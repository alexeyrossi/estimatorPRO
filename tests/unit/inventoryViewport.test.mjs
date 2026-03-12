import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  DESKTOP_INVENTORY_VIEWPORT_SNAPSHOT,
  getInventoryExpandedMetrics,
  getInventoryViewportMetrics,
  resolveStableInventoryViewportSnapshot,
} = require("../../lib/inventoryViewport.ts");

const createSnapshot = (viewportWidth, viewportHeight) => ({
  viewportWidth,
  viewportHeight,
  metrics: getInventoryViewportMetrics(viewportWidth, viewportHeight),
});

test("mobile keyboard shrink keeps the previous snapshot while an editable field is focused", () => {
  const previous = createSnapshot(390, 844);

  const next = resolveStableInventoryViewportSnapshot(previous, {
    viewportWidth: 390,
    viewportHeight: 512,
    hasEditableFocus: true,
  });

  assert.equal(next, previous);
  assert.equal(next.metrics.rawMaxHeight, previous.metrics.rawMaxHeight);
  assert.equal(next.metrics.normalizedMaxHeight, previous.metrics.normalizedMaxHeight);
});

test("mobile keyboard close restores larger viewport metrics", () => {
  const previous = createSnapshot(390, 560);

  const next = resolveStableInventoryViewportSnapshot(previous, {
    viewportWidth: 390,
    viewportHeight: 844,
    hasEditableFocus: false,
  });

  assert.notEqual(next, previous);
  assert.equal(next.viewportHeight, 844);
  assert.ok(next.metrics.rawMaxHeight > previous.metrics.rawMaxHeight);
  assert.ok(next.metrics.normalizedMaxHeight > previous.metrics.normalizedMaxHeight);
});

test("mobile width change recomputes viewport metrics even while focused", () => {
  const previous = createSnapshot(390, 844);

  const next = resolveStableInventoryViewportSnapshot(previous, {
    viewportWidth: 430,
    viewportHeight: 900,
    hasEditableFocus: true,
  });

  assert.notEqual(next, previous);
  assert.equal(next.viewportWidth, 430);
  assert.deepEqual(next.metrics, getInventoryViewportMetrics(430, 900));
});

test("desktop resize remains live and does not freeze on editable focus", () => {
  const next = resolveStableInventoryViewportSnapshot(DESKTOP_INVENTORY_VIEWPORT_SNAPSHOT, {
    viewportWidth: 1024,
    viewportHeight: 640,
    hasEditableFocus: true,
  });

  assert.notEqual(next, DESKTOP_INVENTORY_VIEWPORT_SNAPSHOT);
  assert.equal(next.viewportHeight, 640);
  assert.deepEqual(next.metrics, DESKTOP_INVENTORY_VIEWPORT_SNAPSHOT.metrics);
});

test("desktop expanded metrics produce a tall in-card workspace", () => {
  const metrics = getInventoryExpandedMetrics(DESKTOP_INVENTORY_VIEWPORT_SNAPSHOT);

  assert.deepEqual(metrics, {
    workspaceHeight: 666,
    rawMinHeight: 634,
    rawMaxHeight: 634,
    normalizedMaxHeight: 580,
  });
});

test("mobile expanded metrics use the stable snapshot while keyboard is open", () => {
  const previous = createSnapshot(390, 844);
  const stableSnapshot = resolveStableInventoryViewportSnapshot(previous, {
    viewportWidth: 390,
    viewportHeight: 512,
    hasEditableFocus: true,
  });

  const metrics = getInventoryExpandedMetrics(stableSnapshot);

  assert.deepEqual(metrics, {
    workspaceHeight: 439,
    rawMinHeight: 411,
    rawMaxHeight: 411,
    normalizedMaxHeight: 365,
  });
});

test("expanded metrics leave extra chrome room for normalized inventory controls", () => {
  const snapshot = createSnapshot(390, 844);
  const metrics = getInventoryExpandedMetrics(snapshot);

  assert.ok(metrics.rawMaxHeight > metrics.normalizedMaxHeight);
  assert.equal(metrics.rawMinHeight, metrics.rawMaxHeight);
  assert.ok(metrics.workspaceHeight > metrics.normalizedMaxHeight);
});
