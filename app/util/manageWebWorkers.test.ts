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

import WebWorkerManager from "./WebWorkerManager";

jest.mock("@foxglove-studio/app/util/Rpc", () => {
  return class FakeRpc {
    receive() {
      // no-op
    }
  };
});
class FakeWorker {
  terminated = false;
  terminate() {
    this.terminated = true;
  }
}

describe("WebWorkerManager", () => {
  it("kills the worker when unregistering it", () => {
    const webWorkerManager = new WebWorkerManager(FakeWorker, 1);
    webWorkerManager.registerWorkerListener("1");
    const worker = webWorkerManager.testing_getWorkerState("1")?.worker;
    expect(worker?.terminated).toEqual(false);
    webWorkerManager.unregisterWorkerListener("1");
    expect(worker?.terminated).toEqual(true);
    expect(webWorkerManager.testing_getWorkerState("1")).toEqual(undefined);
  });

  it("does not unregister the worker until the last listener stops listening", () => {
    const webWorkerManager = new WebWorkerManager(FakeWorker, 1);
    // We create two listeners for the same worker.
    const firstRpc = webWorkerManager.registerWorkerListener("0");
    webWorkerManager.registerWorkerListener("1");

    const worker = webWorkerManager.testing_getWorkerState("1")?.worker;
    expect(worker?.terminated).toEqual(false);
    webWorkerManager.unregisterWorkerListener("0");
    expect(worker?.terminated).toEqual(false);
    const workerState = webWorkerManager.testing_getWorkerState("1");
    expect(workerState?.rpc).toEqual(firstRpc);
    expect(workerState?.listenerIds).toEqual(["1"]);

    webWorkerManager.unregisterWorkerListener("1");
    expect(worker?.terminated).toEqual(true);
    expect(webWorkerManager.testing_getWorkerState("1")).toEqual(undefined);
  });

  it("can add and remove multiple listeners to the same worker", () => {
    const webWorkerManager = new WebWorkerManager(FakeWorker, 2);
    webWorkerManager.registerWorkerListener("1");
    webWorkerManager.registerWorkerListener("2");
    webWorkerManager.registerWorkerListener("3");
    expect(webWorkerManager.testing_getWorkerState("1")).toEqual(
      webWorkerManager.testing_getWorkerState("3"),
    );
    expect(webWorkerManager.testing_getWorkerState("1")?.listenerIds).toEqual(["1", "3"]);
    expect(webWorkerManager.testing_getWorkerState("2")?.listenerIds).toEqual(["2"]);

    webWorkerManager.unregisterWorkerListener("1");
    expect(webWorkerManager.testing_getWorkerState("3")?.listenerIds).toEqual(["3"]);
    webWorkerManager.unregisterWorkerListener("2");
    webWorkerManager.unregisterWorkerListener("3");
    // eslint-disable-next-line no-underscore-dangle
    expect(webWorkerManager._workerStates).toEqual([undefined, undefined]);
  });

  it("throws when registering an ID twice", () => {
    const webWorkerManager = new WebWorkerManager(FakeWorker, 2);
    webWorkerManager.registerWorkerListener("1");
    expect(() => webWorkerManager.registerWorkerListener("1")).toThrow();
  });

  it("throws when unregistering an ID twice", () => {
    const webWorkerManager = new WebWorkerManager(FakeWorker, 2);
    webWorkerManager.registerWorkerListener("1");
    webWorkerManager.unregisterWorkerListener("1");
    expect(() => webWorkerManager.unregisterWorkerListener("1")).toThrow();
  });
});
