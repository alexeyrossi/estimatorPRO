"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getEstimate } from "@/app/actions/estimate";
import { useDebounce } from "@/hooks/useDebounce";
import type { EstimateInputs, EstimateResult, NormalizedRow } from "@/lib/types/estimator";

type EstimateRequest = {
  inputs: EstimateInputs;
  normalizedRows?: NormalizedRow[];
  overrides: Record<string, string>;
};

export function useEstimateRunner(request: EstimateRequest, enabled: boolean) {
  const [estimate, setEstimate] = useState<EstimateResult | Partial<EstimateResult>>({});
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [isEstimateRunning, setIsEstimateRunning] = useState(false);
  const requestVersionRef = useRef(0);
  const debouncedEstimateRequest = useDebounce(request, 1000);

  useEffect(() => {
    if (!enabled) return;

    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    let active = true;

    async function runEstimate() {
      setIsEstimateRunning(true);
      try {
        const result = await getEstimate(
          debouncedEstimateRequest.inputs,
          debouncedEstimateRequest.normalizedRows,
          debouncedEstimateRequest.overrides
        );
        if (!active || requestVersion !== requestVersionRef.current) return;
        setEstimate(result);
        setEstimateError(null);
      } catch (error: unknown) {
        if (!active || requestVersion !== requestVersionRef.current) return;
        console.error("Estimate calculation failed", error);
        setEstimate({});
        setEstimateError("Calculation failed. Please review the inputs and retry.");
        toast.error("Failed to calculate estimate. Please try again.");
      } finally {
        if (!active || requestVersion !== requestVersionRef.current) return;
        setIsEstimateRunning(false);
      }
    }

    void runEstimate();

    return () => {
      active = false;
    };
  }, [debouncedEstimateRequest, enabled]);

  return {
    debouncedEstimateRequest,
    estimate,
    estimateError,
    isEstimateRunning,
    setEstimate,
    setEstimateError,
  };
}
