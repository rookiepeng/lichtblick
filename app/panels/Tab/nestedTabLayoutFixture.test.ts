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

import { Fixture } from "@foxglove-studio/app/stories/PanelSetup";

const nestedTabLayoutFixture: Fixture = {
  topics: [],
  datatypes: {},
  frame: {},
  layout: {
    direction: "column",
    first: {
      direction: "row",
      first: "Tab!Left",
      second: "Tab!Right",
      splitPercentage: 50,
    },
    second: "Tab!Bottom",
    splitPercentage: 75,
  },
  savedProps: {
    "Tab!RightInner": {
      activeTabIdx: 1,
      tabs: [
        {
          title: "Inactive Plots",
          layout: null,
        },
        {
          title: "Child Plots",
          layout: {
            first: {
              first: "Audio!A",
              second: "Audio!B",
              direction: "column",
            },
            second: {
              first: "Audio!C",
              second: "Audio!D",
              direction: "column",
            },
            direction: "row",
          },
        },
      ],
    },
    "Tab!Left": {
      activeTabIdx: 0,
      tabs: [
        {
          title: "Left",
          layout: {
            first: "Global!A",
            second: {
              first: "ImageViewPanel!A",
              second: {
                first: "ImageViewPanel!B",
                second: "ImageViewPanel!C",
                direction: "row",
                splitPercentage: 50,
              },
              direction: "row",
              splitPercentage: 33.3,
            },
            direction: "column",
            splitPercentage: 75,
          },
        },
      ],
    },
    "Tab!Right": {
      activeTabIdx: 0,
      tabs: [
        {
          title: "Right",
          layout: "Tab!RightInner",
        },
      ],
    },
    "Tab!Bottom": {
      activeTabIdx: 0,
      tabs: [
        {
          title: "Bottom",
          layout: "GlobalVariableSliderPanel!A",
        },
      ],
    },
  },
};

export default nestedTabLayoutFixture;
