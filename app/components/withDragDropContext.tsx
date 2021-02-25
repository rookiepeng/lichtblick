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
import * as React from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

function withDragDropContext<T extends any>(Component: React.ComponentType<T>) {
  class ComponentWithDragDropContext extends React.Component<T> {
    render() {
      return (
        <DndProvider backend={HTML5Backend}>
          <Component {...this.props} />
        </DndProvider>
      );
    }
  }
  return ComponentWithDragDropContext;
}
// separate creation of this into a helper module so that a second copy isn't created during
// hot module reloading (unless this module changes)
export default withDragDropContext;
