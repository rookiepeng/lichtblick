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
import { Time, TimeUtil } from "rosbag";

export function getBagChunksOverlapCount(
  chunkInfos: ReadonlyArray<{ startTime: Time; endTime: Time }>,
) {
  if (!chunkInfos) {
    return 0;
  }
  const sorted = chunkInfos
    .slice()
    .sort((left, right) => TimeUtil.compare(left.startTime, right.startTime));
  let maxEndTime = { sec: -Infinity, nsec: 0 };
  let overlaps = 0;
  sorted.forEach(({ startTime, endTime }) => {
    if (TimeUtil.isLessThan(startTime, maxEndTime)) {
      overlaps += 1;
    }
    if (TimeUtil.isGreaterThan(endTime, maxEndTime)) {
      maxEndTime = endTime;
    }
  });
  return overlaps;
}
