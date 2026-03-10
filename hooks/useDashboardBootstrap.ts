"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadDraft, migrateLegacyDraft } from "@/lib/draftStorage";
import { hydrateDraftState } from "@/lib/estimateDraftReducer";
import type { EstimateDraftState, SavedEstimateRecord } from "@/lib/types/estimator";

type UseDashboardBootstrapOptions = {
  hydrateDraft: (state: EstimateDraftState) => void;
  onLoadEstimate: (estimateId: string) => Promise<SavedEstimateRecord | null>;
  onReady: () => void;
};

export function useDashboardBootstrap({
  hydrateDraft,
  onLoadEstimate,
  onReady,
}: UseDashboardBootstrapOptions) {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function loadInitialState() {
      const params = new URLSearchParams(window.location.search);
      const estimateId = params.get("estimate_id");

      if (estimateId) {
        try {
          const data = await onLoadEstimate(estimateId);
          if (active && data) {
            router.replace("/dashboard");
            onReady();
            return;
          }
        } catch (error: unknown) {
          console.error("Failed to load estimate from DB:", error);
        }
      }

      const draftResult = loadDraft();
      if (draftResult.state) {
        hydrateDraft(hydrateDraftState(draftResult.state));
        if (active) onReady();
        return;
      }

      if (draftResult.status === "missing") {
        const migratedDraft = migrateLegacyDraft();
        if (migratedDraft) {
          hydrateDraft(hydrateDraftState(migratedDraft));
          if (active) onReady();
          return;
        }
      }

      if (active) onReady();
    }

    void loadInitialState();

    return () => {
      active = false;
    };
  }, [hydrateDraft, onLoadEstimate, onReady, router]);
}
