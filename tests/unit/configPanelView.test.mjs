import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  CONFIG_PANEL_VIEW_SWAP_DELAY_MS,
  MOBILE_EXPANDED_VIEWPORT_GUTTER_PX,
  resolveConfigPanelViewSwap,
  resolveConfigPanelViewTransition,
  resolveMobileExpandedViewportHeight,
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

test("mobile expanded viewport height subtracts panel top and bottom gutter", () => {
  assert.equal(
    resolveMobileExpandedViewportHeight({
      minHeight: 368,
      viewportHeight: 844,
      viewportTop: 184,
    }),
    844 - 184 - MOBILE_EXPANDED_VIEWPORT_GUTTER_PX
  );
});

test("mobile expanded viewport height clamps to the configured minimum", () => {
  assert.equal(
    resolveMobileExpandedViewportHeight({
      minHeight: 368,
      viewportHeight: 560,
      viewportTop: 220,
    }),
    368
  );
});
