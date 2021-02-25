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

// @ts-expect-error remove this module since the author indicates it is deprecated
// eslint-disable-next-line import/no-unresolved
import { withState } from "@dump247/storybook-state";
import MinusCircleIcon from "@mdi/svg/svg/minus-circle.svg";
import PlusCircleIcon from "@mdi/svg/svg/plus-circle.svg";
import { storiesOf } from "@storybook/react";
import React from "react";

import ChildToggle from "@foxglove-studio/app/components/ChildToggle";
import Flex from "@foxglove-studio/app/components/Flex";
import Icon from "@foxglove-studio/app/components/Icon";

const initialState = {
  isOpen: true,
  value: "",
};

const Block = (props: any) => (
  <div style={{ width: 50, backgroundColor: "red" }}>{props.children}</div>
);
const MARGIN = 50;

function ChildToggleStory({ store }: any) {
  const { state } = store;
  const onToggle = () => {
    store.set({ isOpen: !state.isOpen });
  };
  const icon = state.isOpen ? <MinusCircleIcon /> : <PlusCircleIcon />;
  return (
    <Flex
      col
      center
      style={{
        position: "relative",
        /* shouldn't affect popup position */
      }}
    >
      <div style={{ margin: MARGIN, border: "1px solid gray" }}>
        <ChildToggle position="right" onToggle={onToggle} isOpen={state.isOpen}>
          <Icon>{icon}</Icon>
          <Block>this opens right-aligned of the icon</Block>
        </ChildToggle>
      </div>
      <div style={{ marginTop: 60, marginBottom: 10, border: "1px solid gray" }}>
        <ChildToggle position="above" onToggle={onToggle} isOpen={state.isOpen}>
          <Icon>{icon}</Icon>
          <Block>this opens above the icon</Block>
        </ChildToggle>
      </div>
      <div style={{ margin: MARGIN, border: "1px solid gray" }}>
        <ChildToggle position="below" onToggle={onToggle} isOpen={state.isOpen}>
          <Icon>{icon}</Icon>
          <Block>this opens below the icon</Block>
        </ChildToggle>
      </div>
      <div style={{ margin: MARGIN, border: "1px solid gray" }}>
        <ChildToggle position="bottom-left" onToggle={onToggle} isOpen={state.isOpen}>
          <Icon>{icon}</Icon>
          <Block>this opens below and to the left of the icon</Block>
        </ChildToggle>
      </div>
      <div style={{ margin: MARGIN, border: "1px solid gray" }}>
        <ChildToggle position="left" onToggle={onToggle} isOpen={state.isOpen}>
          <Icon>{icon}</Icon>
          <Block>this opens left-aligned of the icon</Block>
        </ChildToggle>
      </div>
      <div style={{ margin: MARGIN, border: "1px solid gray" }}>
        <ChildToggle.ContainsOpen>
          {(containsOpen) => (
            <div>
              Contains an open child toggle: {JSON.stringify(containsOpen)}
              <ChildToggle position="below" onToggle={onToggle} isOpen={state.isOpen}>
                <Icon>{icon}</Icon>
                <Block>this opens below</Block>
              </ChildToggle>
            </div>
          )}
        </ChildToggle.ContainsOpen>
      </div>
      <div style={{ margin: MARGIN, border: "1px solid gray" }}>
        <ChildToggle.ContainsOpen>
          {(containsOpen) => (
            <div>
              Contains an open child toggle: {JSON.stringify(containsOpen)}
              <ChildToggle
                position="below"
                isOpen={false}
                onToggle={() => {
                  // no-op
                }}
              >
                <Icon>{icon}</Icon>
                <Block>this should never be visible</Block>
              </ChildToggle>
            </div>
          )}
        </ChildToggle.ContainsOpen>
      </div>
    </Flex>
  );
}

storiesOf("<ChildToggle>", module)
  .add(
    "controlled",
    withState(initialState, (store: any) => <ChildToggleStory store={store} />),
  )
  .add(
    "closes when Escape key pressed",
    withState(initialState, (store: any) => {
      return (
        <div
          ref={() =>
            setImmediate(() =>
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "Escape", code: "Escape", keyCode: 27 }),
              ),
            )
          }
        >
          <ChildToggleStory store={store} />
        </div>
      );
    }),
  );
