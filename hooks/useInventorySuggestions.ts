"use client";

import { useEffect, useRef, useState } from "react";
import { suggestItemsAction } from "@/app/actions/estimate";
import { useDebounce } from "@/hooks/useDebounce";

export function useInventorySuggestions(addRowInput: string) {
  const [suggestedItems, setSuggestedItems] = useState<string[]>([]);
  const debouncedAddInput = useDebounce(addRowInput, 300);
  const requestVersionRef = useRef(0);
  const shouldLoadSuggestions = debouncedAddInput.length > 1;

  useEffect(() => {
    if (!shouldLoadSuggestions) {
      return;
    }

    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    let active = true;

    async function loadSuggestions() {
      try {
        const items = await suggestItemsAction(debouncedAddInput);
        if (!active || requestVersion !== requestVersionRef.current) return;
        setSuggestedItems(items);
      } catch (error) {
        if (!active || requestVersion !== requestVersionRef.current) return;
        console.error("Suggestion load failed", error);
        setSuggestedItems([]);
      }
    }

    void loadSuggestions();

    return () => {
      active = false;
    };
  }, [debouncedAddInput, shouldLoadSuggestions]);

  return shouldLoadSuggestions ? suggestedItems : [];
}
