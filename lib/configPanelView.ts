export type ConfigPanelView = "parameters" | "inventoryExpanded";
export type ConfigPanelViewPhase = "idle" | "leaving" | "entering";

export const CONFIG_PANEL_VIEW_SWAP_DELAY_MS = 120;

export const resolveConfigPanelViewTransition = (
    displayedView: ConfigPanelView,
    requestedView: ConfigPanelView,
    prefersReducedMotion: boolean
) => {
    if (displayedView === requestedView) {
        return {
            displayedView,
            phase: "idle" as const,
            swapDelayMs: 0,
        };
    }

    if (prefersReducedMotion) {
        return {
            displayedView: requestedView,
            phase: "idle" as const,
            swapDelayMs: 0,
        };
    }

    return {
        displayedView,
        phase: "leaving" as const,
        swapDelayMs: CONFIG_PANEL_VIEW_SWAP_DELAY_MS,
    };
};

export const resolveConfigPanelViewSwap = (
    requestedView: ConfigPanelView,
    prefersReducedMotion: boolean
) => ({
    displayedView: requestedView,
    phase: prefersReducedMotion ? "idle" as const : "entering" as const,
});
