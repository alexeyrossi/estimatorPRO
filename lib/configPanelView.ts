export type ConfigPanelView = "parameters" | "inventoryExpanded";
export type ConfigPanelViewPhase = "idle" | "leaving" | "entering";

export const CONFIG_PANEL_VIEW_SWAP_DELAY_MS = 120;
export const MOBILE_EXPANDED_VIEWPORT_GUTTER_PX = 16;

export const resolveMobileExpandedViewportHeight = ({
    bottomGutter = MOBILE_EXPANDED_VIEWPORT_GUTTER_PX,
    minHeight,
    viewportHeight,
    viewportTop,
}: {
    bottomGutter?: number;
    minHeight: number;
    viewportHeight: number;
    viewportTop: number;
}) => {
    const safeBottomGutter = Number.isFinite(bottomGutter) ? Math.max(0, bottomGutter) : 0;
    const safeMinHeight = Number.isFinite(minHeight) ? Math.max(0, minHeight) : 0;
    const safeViewportHeight = Number.isFinite(viewportHeight) ? viewportHeight : 0;
    const safeViewportTop = Number.isFinite(viewportTop) ? Math.max(0, viewportTop) : 0;

    return Math.max(
        safeMinHeight,
        Math.round(safeViewportHeight - safeViewportTop - safeBottomGutter)
    );
};

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
