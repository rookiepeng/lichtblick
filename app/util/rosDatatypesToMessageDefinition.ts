// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/
//
// This file incorporates work covered by the following copyright and
// permission notice:
//
//   Copyright 2018-2021 Cruise LLC
//
//   This source code is licensed under the Apache License, Version 2.0,
//   found at http://www.apache.org/licenses/LICENSE-2.0
//   You may not use this file except in compliance with the License.

import { RosMsgDefinition } from "rosbag";

import { RosDatatypes } from "@foxglove-studio/app/types/RosDatatypes";

// For one datatype in the datatypes, find the RosMsgDefinition that we can use to either write or parse it.
// `datatypes` should contain the root datatype and all complex sub-datatypes.
export default function rosDatatypesToMessageDefinition(
  datatypes: RosDatatypes,
  rootDatatypeName: string,
): RosMsgDefinition[] {
  const result = [];
  const seenDatatypeNames = new Set([rootDatatypeName]);
  // It doesn't matter if we use a stack or queue here, but we use a stack.
  const datatypeNameStack = [rootDatatypeName];

  while (datatypeNameStack.length > 0) {
    const currentDatatypeName = datatypeNameStack.pop();
    if (!currentDatatypeName) {
      throw new Error(`Invariant violation - Array.pop() when lenght > 0`);
    }
    const currentDatatype = datatypes[currentDatatypeName];
    if (!currentDatatype) {
      throw new Error(
        `While searching datatypes for "${rootDatatypeName}", could not find datatype "${currentDatatypeName}"`,
      );
    }
    // The root datatype has no name field.
    const msgDefinition: RosMsgDefinition =
      currentDatatypeName === rootDatatypeName
        ? { definitions: currentDatatype.fields }
        : { name: currentDatatypeName, definitions: currentDatatype.fields };
    result.push(msgDefinition);
    for (const field of currentDatatype.fields) {
      // Only search subfields if we haven't already seen it and it is "complex", IE it has its own fields and should
      // be contained in `datatypes`.
      if (field.isComplex && !seenDatatypeNames.has(field.type)) {
        datatypeNameStack.push(field.type);
        seenDatatypeNames.add(field.type);
      }
    }
  }

  return result;
}
