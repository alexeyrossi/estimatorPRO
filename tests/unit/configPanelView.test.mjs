import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  CONFIG_PANEL_VIEW_SWAP_DELAY_MS,
  resolveConfigPanelViewSwap,
  resolveConfigPanelViewTransition,
} = require("../../lib/configPanelView.ts");

test("parameters to inventoryExpanded starts with leaving phase", () => {
  assert.deepEqual(
    resolveConfigPanelViewTransition("parameters", "inventoryExpanded", false),
    {
      displayedView: "parameters",
      phase: "leaving",
      swapDelayMs: CONFIG_PANEL_VIEW_SWAP_DELAY_MS,
    }
  );
});

test("reduced motion swaps inventory subview immediately", () => {
  assert.deepEqual(
    resolveConfigPanelViewTransition("parameters", "inventoryExpanded", true),
    {
      displayedView: "inventoryExpanded",
      phase: "idle",
      swapDelayMs: 0,
    }
  );
});

test("swap helper returns entering phase for animated transition", () => {
  assert.deepEqual(
    resolveConfigPanelViewSwap("parameters", false),
    {
      displayedView: "parameters",
      phase: "entering",
    }
  );
});
