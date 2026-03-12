export type InventoryViewportMetrics = {
    isMobile: boolean;
    rawMinHeight: number;
    rawMaxHeight: number;
    normalizedMaxHeight: number;
};

export type InventoryViewportSnapshot = {
    viewportWidth: number;
    viewportHeight: number;
    metrics: InventoryViewportMetrics;
};

export type InventoryViewportMeasurement = {
    viewportWidth: number;
    viewportHeight: number;
    hasEditableFocus: boolean;
};

const MOBILE_BREAKPOINT_PX = 768;
const MOBILE_RAW_MIN_HEIGHT = 96;
const DESKTOP_RAW_MIN_HEIGHT = 224;
const MOBILE_RAW_MAX_HEIGHT = 260;
const DESKTOP_RAW_MAX_HEIGHT = 320;
const MOBILE_NORMALIZED_MAX_HEIGHT = 360;
const DESKTOP_NORMALIZED_MAX_HEIGHT = 288;
const MOBILE_NORMALIZED_MIN_HEIGHT = 220;

const hasSameViewportMetrics = (a: InventoryViewportMetrics, b: InventoryViewportMetrics) =>
    a.isMobile === b.isMobile
    && a.rawMinHeight === b.rawMinHeight
    && a.rawMaxHeight === b.rawMaxHeight
    && a.normalizedMaxHeight === b.normalizedMaxHeight;

export const DESKTOP_INVENTORY_VIEWPORT_METRICS: InventoryViewportMetrics = {
    isMobile: false,
    rawMinHeight: DESKTOP_RAW_MIN_HEIGHT,
    rawMaxHeight: DESKTOP_RAW_MAX_HEIGHT,
    normalizedMaxHeight: DESKTOP_NORMALIZED_MAX_HEIGHT,
};

export const DESKTOP_INVENTORY_VIEWPORT_SNAPSHOT: InventoryViewportSnapshot = {
    viewportWidth: 1024,
    viewportHeight: 900,
    metrics: DESKTOP_INVENTORY_VIEWPORT_METRICS,
};

export const getInventoryViewportMetrics = (
    viewportWidth: number,
    viewportHeight: number
): InventoryViewportMetrics => {
    const isMobile = viewportWidth < MOBILE_BREAKPOINT_PX;

    if (!isMobile) {
        return DESKTOP_INVENTORY_VIEWPORT_METRICS;
    }

    const rawMinHeight = MOBILE_RAW_MIN_HEIGHT;

    return {
        isMobile,
        rawMinHeight,
        rawMaxHeight: Math.max(rawMinHeight, Math.min(MOBILE_RAW_MAX_HEIGHT, Math.round(viewportHeight * 0.32))),
        normalizedMaxHeight: Math.max(
            MOBILE_NORMALIZED_MIN_HEIGHT,
            Math.min(MOBILE_NORMALIZED_MAX_HEIGHT, Math.round(viewportHeight * 0.4))
        ),
    };
};

const createInventoryViewportSnapshot = (
    viewportWidth: number,
    viewportHeight: number
): InventoryViewportSnapshot => ({
    viewportWidth,
    viewportHeight,
    metrics: getInventoryViewportMetrics(viewportWidth, viewportHeight),
});

const hasSameViewportSnapshot = (
    a: InventoryViewportSnapshot,
    b: InventoryViewportSnapshot
) =>
    a.viewportWidth === b.viewportWidth
    && a.viewportHeight === b.viewportHeight
    && hasSameViewportMetrics(a.metrics, b.metrics);

export const resolveStableInventoryViewportSnapshot = (
    previousSnapshot: InventoryViewportSnapshot | null,
    measurement: InventoryViewportMeasurement
): InventoryViewportSnapshot => {
    const nextSnapshot = createInventoryViewportSnapshot(
        measurement.viewportWidth,
        measurement.viewportHeight
    );

    if (!previousSnapshot) {
        return nextSnapshot;
    }

    const isBreakpointChange = previousSnapshot.metrics.isMobile !== nextSnapshot.metrics.isMobile;
    const isWidthChange = previousSnapshot.viewportWidth !== nextSnapshot.viewportWidth;
    const isHeightShrink = nextSnapshot.viewportHeight < previousSnapshot.viewportHeight;

    if (isBreakpointChange || isWidthChange) {
        return hasSameViewportSnapshot(previousSnapshot, nextSnapshot) ? previousSnapshot : nextSnapshot;
    }

    if (
        nextSnapshot.metrics.isMobile
        && measurement.hasEditableFocus
        && isHeightShrink
    ) {
        return previousSnapshot;
    }

    return hasSameViewportSnapshot(previousSnapshot, nextSnapshot) ? previousSnapshot : nextSnapshot;
};
