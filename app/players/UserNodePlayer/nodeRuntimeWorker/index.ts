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
import {
  registerNode,
  processMessage,
} from "@foxglove-studio/app/players/UserNodePlayer/nodeRuntimeWorker/registry";
import { BobjectRpcReceiver } from "@foxglove-studio/app/util/binaryObjects/BobjectRpc";
import Rpc from "@foxglove-studio/app/util/Rpc";
import { enforceFetchIsBlocked, inSharedWorker } from "@foxglove-studio/app/util/workers";

if (!inSharedWorker()) {
  // In Chrome, web workers currently (as of March 2020) inherit their Content Security Policy from
  // their associated page, ignoring any policy in the headers of their source file. SharedWorkers
  // use the headers from their source files, though, and we use a CSP to prohibit node playground
  // workers from making web requests (using enforceFetchIsBlocked, below.)
  // TODO(steel): Change this back to a web worker if/when Chrome changes its behavior:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1012640
  throw new Error("Not in a SharedWorker.");
}

(global as any).onconnect = (e: any) => {
  const port = e.ports[0];
  const rpc = new Rpc(port);
  // Just check fetch is blocked on registration, don't slow down message processing.
  rpc.receive("registerNode", enforceFetchIsBlocked(registerNode));
  new BobjectRpcReceiver(rpc).receive(
    "processMessage",
    "parsed",
    async (message, globalVariables) => processMessage({ message, globalVariables }),
  );
  port.start();
};
