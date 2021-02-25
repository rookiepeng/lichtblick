// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2019-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { $ReadOnly } from "utility-types";
import { groupBy } from "lodash";
import { useCallback } from "react";

import { useMessageReducer } from "./useMessageReducer";
import { Message, TypedMessage, MessageFormat } from "@foxglove-studio/app/players/types";
import { useDeepMemo } from "@foxglove-studio/app/util/hooks";

// Exported for tests
// Equivalent to array1.concat(array2).slice(-limit), but somewhat faster. Also works with limit=0.
export const concatAndTruncate = <T>(
  array1: ReadonlyArray<T>,
  array2: ReadonlyArray<T>,
  limit: number,
): T[] => {
  const toTakeFromArray1 = limit - array2.length;
  const ret = toTakeFromArray1 <= 0 ? [] : array1.slice(-toTakeFromArray1);
  const toTakeFromArray2 = limit - ret.length;
  for (let i = Math.max(0, array2.length - toTakeFromArray2); i < array2.length; ++i) {
    ret.push(array2[i]);
  }
  return ret;
};

export type MessagesByTopic = $ReadOnly<{
  [topic: string]: ReadonlyArray<Message>;
}>;

// Convenience wrapper around `useMessageReducer`, for if you just want some
// recent messages for a few topics.
export function useMessagesByTopic<T extends any>({
  topics,
  historySize,
  preloadingFallback,
  format = "parsedMessages",
}: {
  topics: ReadonlyArray<string>;
  historySize: number;
  preloadingFallback?: boolean | null | undefined;
  format?: MessageFormat;
}): MessagesByTopic {
  const requestedTopics = useDeepMemo(topics);

  const addMessages: (
    arg0: $ReadOnly<{
      [key: string]: ReadonlyArray<TypedMessage<T>>;
    }>,
    arg1: ReadonlyArray<TypedMessage<T>>,
  ) => $ReadOnly<{
    [key: string]: ReadonlyArray<TypedMessage<T>>;
  }> = useCallback(
    (
      prevMessagesByTopic: $ReadOnly<{
        [key: string]: ReadonlyArray<TypedMessage<T>>;
      }>,
      messages: ReadonlyArray<TypedMessage<T>>,
    ) => {
      const newMessagesByTopic = groupBy(messages, "topic");
      const ret = { ...prevMessagesByTopic };
      Object.keys(newMessagesByTopic).forEach((topic) => {
        ret[topic] = concatAndTruncate(ret[topic], newMessagesByTopic[topic], historySize);
      });
      return ret;
    },
    [historySize],
  );

  const restore = useCallback(
    (
      prevMessagesByTopic:
        | $ReadOnly<{
            [key: string]: ReadonlyArray<TypedMessage<T>>;
          }>
        | null
        | undefined,
    ): $ReadOnly<{
      [key: string]: ReadonlyArray<TypedMessage<T>>;
    }> => {
      const newMessagesByTopic: {
        [topic: string]: TypedMessage<T>[];
      } = {};
      // When changing topics, we try to keep as many messages around from the previous set of
      // topics as possible.
      for (const topic of requestedTopics) {
        newMessagesByTopic[topic] =
          prevMessagesByTopic && prevMessagesByTopic[topic]
            ? prevMessagesByTopic[topic].slice(-historySize)
            : [];
      }
      return newMessagesByTopic;
    },
    [requestedTopics, historySize],
  );

  return useMessageReducer({
    topics: requestedTopics,
    restore,
    preloadingFallback,
    ...(format === "bobjects" ? { addBobjects: addMessages } : { addMessages }),
  });
}
