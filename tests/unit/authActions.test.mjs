import "../regression/register-ts.mjs";
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const sampleInputs = {
  homeSize: "2",
  moveType: "Local",
  distance: "15",
  packingLevel: "None",
  accessOrigin: "ground",
  accessDest: "ground",
  inventoryText: "sofa",
  extraStops: [],
};

async function withMockedModule(modulePath, exports, fn) {
  const resolved = require.resolve(modulePath);
  const previous = require.cache[resolved];
  require.cache[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports,
  };

  try {
    return await fn();
  } finally {
    if (previous) require.cache[resolved] = previous;
    else delete require.cache[resolved];
  }
}

function loadFreshEstimateActions() {
  const actionsPath = require.resolve("../../app/actions/estimate.ts");
  delete require.cache[actionsPath];
  return require("../../app/actions/estimate.ts");
}

test("read-only estimate actions reject unauthenticated access", async () => {
  await withMockedModule("../../lib/auth/access.ts", {
    requireAuthenticatedAccess: async () => {
      throw new Error("Unauthorized");
    },
    getSessionAccess: async () => ({ isAuthenticated: false, userId: null }),
  }, async () => {
    const { getEstimate, normalizeInventoryAction, resolveItemAction, suggestItemsAction } = loadFreshEstimateActions();

    await assert.rejects(() => getEstimate(sampleInputs), /Unauthorized/);
    await assert.rejects(() => normalizeInventoryAction("sofa"), /Unauthorized/);
    await assert.rejects(() => resolveItemAction("piano"), /Unauthorized/);
    await assert.rejects(() => suggestItemsAction("pi"), /Unauthorized/);
  });
});

test("mutating estimate actions keep unauthorized return semantics", async () => {
  await withMockedModule("../../lib/auth/access.ts", {
    requireAuthenticatedAccess: async () => {
      throw new Error("Unauthorized");
    },
    getSessionAccess: async () => ({ isAuthenticated: false, userId: null }),
  }, async () => {
    await withMockedModule("../../lib/supabase/server.ts", {
      createClient: async () => {
        throw new Error("createClient should not run for anonymous access");
      },
    }, async () => {
      const {
        deleteEstimateAction,
        fetchHistoryAction,
        loadEstimateAction,
        saveEstimateAction,
      } = loadFreshEstimateActions();

      const saveResult = await saveEstimateAction("Test", sampleInputs, [], "raw", {});
      assert.deepEqual(saveResult, {
        success: false,
        error: "Unauthorized: You must be logged in to save estimates.",
      });
      assert.deepEqual(await fetchHistoryAction(), []);
      assert.equal(await loadEstimateAction("123"), null);
      assert.deepEqual(await deleteEstimateAction("123"), {
        success: false,
        error: "Unauthorized",
      });
    });
  });
});

test("saveEstimateAction preserves fractional net volume payloads", async () => {
  let insertedPayload = null;

  await withMockedModule("../../lib/auth/access.ts", {
    requireAuthenticatedAccess: async () => ({ isAuthenticated: true, userId: "user_123" }),
    getSessionAccess: async () => ({ isAuthenticated: true, userId: "user_123" }),
  }, async () => {
    await withMockedModule("../../lib/engine.ts", {
      buildEstimate: () => ({
        finalVolume: 2650,
        netVolume: 2622.5,
        truckSpaceCF: 2825,
      }),
    }, async () => {
      await withMockedModule("../../lib/supabase/server.ts", {
        createClient: async () => ({
          from: () => ({
            insert: ([payload]) => {
              insertedPayload = payload;
              return {
                select: () => ({
                  single: async () => ({ data: { id: "abc123" }, error: null }),
                }),
              };
            },
          }),
        }),
      }, async () => {
        const { saveEstimateAction } = loadFreshEstimateActions();
        const result = await saveEstimateAction("Client", sampleInputs, [], "raw", {});

        assert.deepEqual(result, { success: true, id: "abc123" });
        assert.equal(insertedPayload.final_volume, 2650);
        assert.equal(insertedPayload.net_volume, 2622.5);
        assert.equal(insertedPayload.truck_space_cf, 2825);
      });
    });
  });
});
