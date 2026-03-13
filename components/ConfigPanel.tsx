import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { LucideIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import {
    AlignLeft,
    MapPin,
    Maximize2,
    Minimize2,
    Pencil,
    Plus,
    RefreshCcw,
    Sparkles,
    Settings,
    Trash2,
    Undo2,
    Weight,
} from 'lucide-react';
import {
    DESKTOP_INVENTORY_VIEWPORT_SNAPSHOT,
    getInventoryExpandedMetrics,
    resolveStableInventoryViewportSnapshot,
    type InventoryViewportSnapshot,
} from '@/lib/inventoryViewport';
import {
    resolveConfigPanelViewSwap,
    resolveConfigPanelViewTransition,
    resolveMobileExpandedViewportHeight,
    type ConfigPanelView,
    type ConfigPanelViewPhase,
} from '@/lib/configPanelView';
import { EstimateInputs, EstimateResult, NormalizedRow, RowsStatus } from '@/lib/types/estimator';
import { MAX_EXTRA_STOPS } from '@/lib/estimatePolicy';
import { AccessSegmented } from './AccessSegmented';
import { GlassPanel } from './GlassPanel';
import { InputLabel } from './InputLabel';
import { Select } from './Select';

const INVENTORY_SCROLL_MARGIN_BOTTOM = 'calc(8rem + env(safe-area-inset-bottom))';
const NON_TEXT_INPUT_TYPES = new Set([
    'button',
    'checkbox',
    'color',
    'file',
    'hidden',
    'image',
    'radio',
    'range',
    'reset',
    'submit',
]);

const softActionButtonTransition = {
    transitionProperty: 'transform, background-color, color',
    transitionDuration: '150ms, 200ms, 200ms',
    transitionTimingFunction: 'ease-out',
} as const;
const MOBILE_EXPANDED_VIEWPORT_MIN_HEIGHT = 368;
const CLEAN_TOOLTIP_GAP = 10;
const CLEAN_TOOLTIP_VIEWPORT_PADDING = 16;

type TooltipPosition = {
    top: number;
    left: number;
};

let inventoryViewportSnapshot: InventoryViewportSnapshot = DESKTOP_INVENTORY_VIEWPORT_SNAPSHOT;

const measureElementHeight = (node: HTMLDivElement | null) => {
    if (!node) return null;
    return Math.ceil(node.getBoundingClientRect().height);
};

const measureRawComposer = (
    textarea: HTMLTextAreaElement | null,
    limits: { minHeight: number; maxHeight: number }
): { height: number; overflowY: 'hidden' | 'auto' } | null => {
    if (!textarea) return null;

    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;

    return {
        height: Math.max(limits.minHeight, Math.min(scrollHeight, limits.maxHeight)),
        overflowY: scrollHeight > limits.maxHeight ? 'auto' : 'hidden',
    };
};

const subscribeToInventoryViewport = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    window.addEventListener('resize', callback);
    const visualViewport = window.visualViewport;
    visualViewport?.addEventListener('resize', callback);

    return () => {
        window.removeEventListener('resize', callback);
        visualViewport?.removeEventListener('resize', callback);
    };
};

const hasActiveEditableFocus = () => {
    if (typeof document === 'undefined') return false;

    const activeElement = document.activeElement;

    if (!(activeElement instanceof HTMLElement)) {
        return false;
    }

    if (activeElement.isContentEditable || activeElement.tagName === 'TEXTAREA') {
        return true;
    }

    if (activeElement.tagName !== 'INPUT') {
        return false;
    }

    const inputType = activeElement.getAttribute('type')?.toLowerCase() ?? 'text';
    return !NON_TEXT_INPUT_TYPES.has(inputType);
};

const getInventoryViewportSnapshot = () => {
    if (typeof window === 'undefined') {
        return inventoryViewportSnapshot;
    }

    inventoryViewportSnapshot = resolveStableInventoryViewportSnapshot(
        inventoryViewportSnapshot,
        {
            viewportWidth: window.innerWidth,
            viewportHeight: window.visualViewport?.height ?? window.innerHeight,
            hasEditableFocus: hasActiveEditableFocus(),
        }
    );

    return inventoryViewportSnapshot;
};

const getInventoryViewportServerSnapshot = () => DESKTOP_INVENTORY_VIEWPORT_SNAPSHOT;

const isDomNode = (target: EventTarget | null): target is Node => target instanceof Node;

const getInventoryModeToggleMeta = (
    inventoryMode: 'raw' | 'normalized',
    rowsStatus: RowsStatus
) => {
    if (inventoryMode === 'normalized') {
        return {
            label: 'Text',
            mobileLabel: 'Text',
            title: 'Switch to text view',
            Icon: AlignLeft,
        };
    }

    if (rowsStatus === 'stale') {
        return {
            label: 'Re-sync Items',
            mobileLabel: 'Sync',
            title: 'Re-sync detected items',
            Icon: RefreshCcw,
        };
    }

    return {
        label: 'Edit',
        mobileLabel: 'Edit',
        title: 'Switch to edit view',
        Icon: Pencil,
    };
};

const SubviewActionButton = ({
    active = false,
    Icon,
    label,
    mobileLabel,
    onClick,
    showDesktopLabel = true,
    title,
    disabled = false,
}: {
    active?: boolean;
    Icon: LucideIcon;
    label: string;
    mobileLabel?: string;
    onClick: () => void;
    showDesktopLabel?: boolean;
    title?: string;
    disabled?: boolean;
}) => {
    const hasMobileLabel = Boolean(mobileLabel);
    const hasVisibleLabel = hasMobileLabel || showDesktopLabel;

    return (
        <button
            type="button"
            onClick={onClick}
            title={title ?? label}
            aria-label={title ?? label}
            disabled={disabled}
            className={`group relative flex h-9 shrink-0 items-center justify-center rounded-xl text-slate-500 ${disabled ? 'cursor-not-allowed opacity-50' : 'active:scale-[0.98]'} ${active ? 'bg-slate-100 text-slate-900' : disabled ? '' : 'hover:bg-slate-100 hover:text-slate-900'} ${hasVisibleLabel ? (hasMobileLabel ? 'gap-1.5 px-2.5 md:gap-2 md:px-3.5' : 'w-9 md:w-auto md:gap-2 md:px-3.5') : 'w-9'}`}
            style={softActionButtonTransition}
        >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            {hasMobileLabel && (
                <span className="text-[10px] font-bold leading-none md:hidden">
                    {mobileLabel}
                </span>
            )}
            {showDesktopLabel && (
                <span className="hidden text-[11px] font-bold leading-none md:inline">
                    {label}
                </span>
            )}
        </button>
    );
};

const CleanTooltipButton = ({
    disabled,
    isCleaning,
    onClick,
}: {
    disabled: boolean;
    isCleaning: boolean;
    onClick: () => void;
}) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [isVisualActive, setIsVisualActive] = useState(false);
    const [supportsHover, setSupportsHover] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const touchHoldTimerRef = useRef<number | null>(null);
    const longPressTriggeredRef = useRef(false);
    const tooltipId = useId();
    const isInteractive = !disabled && !isCleaning;
    const isHoverable = isInteractive;
    const isAriaDisabled = disabled || isCleaning;
    const shouldShowHoverVisual = isInteractive && isVisualActive;

    const clearTouchHold = useCallback(() => {
        if (touchHoldTimerRef.current !== null) {
            window.clearTimeout(touchHoldTimerRef.current);
            touchHoldTimerRef.current = null;
        }
    }, []);

    const updateTooltipPosition = useCallback(() => {
        if (typeof window === 'undefined' || !triggerRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const maxWidth = Math.max(0, window.innerWidth - CLEAN_TOOLTIP_VIEWPORT_PADDING * 2);
        const measuredWidth = tooltipRef.current
            ? Math.ceil(tooltipRef.current.getBoundingClientRect().width)
            : 0;
        const width = Math.min(measuredWidth || 0, maxWidth);
        const height = tooltipRef.current?.getBoundingClientRect().height ?? 0;
        const centeredLeft = triggerRect.left + triggerRect.width / 2 - width / 2;
        const maxLeft = Math.max(CLEAN_TOOLTIP_VIEWPORT_PADDING, window.innerWidth - CLEAN_TOOLTIP_VIEWPORT_PADDING - width);
        const left = Math.min(Math.max(CLEAN_TOOLTIP_VIEWPORT_PADDING, centeredLeft), maxLeft);
        const belowTop = triggerRect.bottom + CLEAN_TOOLTIP_GAP;
        const aboveTop = triggerRect.top - CLEAN_TOOLTIP_GAP - height;
        const minTop = CLEAN_TOOLTIP_VIEWPORT_PADDING;
        const maxTop = Math.max(minTop, window.innerHeight - CLEAN_TOOLTIP_VIEWPORT_PADDING - height);
        let top = aboveTop;

        if (height > 0 && aboveTop < CLEAN_TOOLTIP_VIEWPORT_PADDING) {
            const belowFits = belowTop + height <= window.innerHeight - CLEAN_TOOLTIP_VIEWPORT_PADDING;
            top = belowFits ? belowTop : Math.min(Math.max(minTop, belowTop), maxTop);
        } else if (height > 0) {
            top = Math.min(Math.max(minTop, aboveTop), maxTop);
        }

        setTooltipPosition((current) => (
            current && current.top === top && current.left === left
                ? current
                : { top, left }
        ));
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

        const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        const syncSupport = () => setSupportsHover(mediaQuery.matches);

        syncSupport();

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', syncSupport);
            return () => mediaQuery.removeEventListener('change', syncSupport);
        }

        mediaQuery.addListener(syncSupport);
        return () => mediaQuery.removeListener(syncSupport);
    }, []);

    useLayoutEffect(() => {
        if (!tooltipOpen) return;
        updateTooltipPosition();
    }, [tooltipOpen, updateTooltipPosition]);

    useEffect(() => {
        if (!tooltipOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            const target = isDomNode(event.target) ? event.target : null;
            if (target && !rootRef.current?.contains(target) && !tooltipRef.current?.contains(target)) {
                setIsVisualActive(false);
                setTooltipOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsVisualActive(false);
                setTooltipOpen(false);
            }
        };

        const handlePositionChange = () => {
            updateTooltipPosition();
        };

        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handlePositionChange);
        window.addEventListener('scroll', handlePositionChange, true);
        window.visualViewport?.addEventListener('resize', handlePositionChange);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handlePositionChange);
            window.removeEventListener('scroll', handlePositionChange, true);
            window.visualViewport?.removeEventListener('resize', handlePositionChange);
        };
    }, [tooltipOpen, updateTooltipPosition]);

    useEffect(() => {
        return () => {
            clearTouchHold();
        };
    }, [clearTouchHold]);

    const tooltip = tooltipOpen && typeof document !== 'undefined'
        ? createPortal(
            <div
                ref={tooltipRef}
                id={tooltipId}
                role="tooltip"
                className="clean-hover-tooltip pointer-events-auto fixed z-[90] overflow-hidden rounded-[0.95rem] p-px"
                style={tooltipPosition
                    ? {
                        top: tooltipPosition.top,
                        left: tooltipPosition.left,
                        maxWidth: Math.max(0, window.innerWidth - CLEAN_TOOLTIP_VIEWPORT_PADDING * 2),
                        background: 'linear-gradient(135deg, rgba(103, 232, 249, 0.92), rgba(96, 165, 250, 0.9), rgba(196, 181, 253, 0.88))',
                        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.12)',
                    }
                    : {
                        top: 0,
                        left: 0,
                        maxWidth: Math.max(0, window.innerWidth - CLEAN_TOOLTIP_VIEWPORT_PADDING * 2),
                        visibility: 'hidden',
                        background: 'linear-gradient(135deg, rgba(103, 232, 249, 0.92), rgba(96, 165, 250, 0.9), rgba(196, 181, 253, 0.88))',
                    }}
                onMouseEnter={() => {
                    if (supportsHover) setTooltipOpen(true);
                }}
                onMouseLeave={(event) => {
                    const nextTarget = isDomNode(event.relatedTarget) ? event.relatedTarget : null;
                    if (supportsHover && !rootRef.current?.contains(nextTarget)) {
                        setIsVisualActive(false);
                        setTooltipOpen(false);
                    }
                }}
            >
                <div
                    className="clean-hover-tooltip-shell relative inline-flex overflow-hidden rounded-full px-3 py-1.5"
                    style={{
                        background: 'linear-gradient(180deg, rgba(2, 6, 23, 0.985), rgba(3, 10, 24, 0.985))',
                        border: '1px solid rgba(15, 23, 42, 0.82)',
                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05), inset 0 0 0 1px rgba(67, 56, 202, 0.24)',
                        color: '#f8fafc',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                    }}
                >
                    <div className="relative whitespace-nowrap text-[11px] font-black leading-none text-slate-50">
                        AI Transcript
                    </div>
                </div>
            </div>,
            document.body
        )
        : null;

    return (
        <>
            <div
                ref={rootRef}
                className="clean-hover-trigger relative shrink-0"
                data-clean-hoverable={isHoverable ? 'true' : 'false'}
                data-clean-active={shouldShowHoverVisual ? 'true' : 'false'}
                data-clean-disabled={disabled ? 'true' : 'false'}
                onMouseEnter={() => {
                    setIsVisualActive(true);
                    if (supportsHover) setTooltipOpen(true);
                }}
                onMouseLeave={(event) => {
                    const nextTarget = isDomNode(event.relatedTarget) ? event.relatedTarget : null;
                    if (!tooltipRef.current?.contains(nextTarget)) {
                        setIsVisualActive(false);
                    }
                    if (supportsHover && !tooltipRef.current?.contains(nextTarget)) {
                        setTooltipOpen(false);
                    }
                }}
                onBlur={(event) => {
                    const nextTarget = isDomNode(event.relatedTarget) ? event.relatedTarget : null;
                    if (!event.currentTarget.contains(nextTarget) && !tooltipRef.current?.contains(nextTarget)) {
                        setIsVisualActive(false);
                        setTooltipOpen(false);
                    }
                }}
                onTouchStart={() => {
                    if (supportsHover) return;

                    clearTouchHold();
                    setIsVisualActive(true);
                    touchHoldTimerRef.current = window.setTimeout(() => {
                        longPressTriggeredRef.current = true;
                        setTooltipOpen(true);
                        touchHoldTimerRef.current = null;
                    }, 420);
                }}
                onTouchEnd={() => {
                    clearTouchHold();
                    setIsVisualActive(false);
                }}
                onTouchCancel={() => {
                    clearTouchHold();
                    setIsVisualActive(false);
                }}
            >
                <div ref={triggerRef} className="relative">
                    <button
                        type="button"
                        aria-label="AI Clean"
                        aria-describedby={tooltipOpen ? tooltipId : undefined}
                        aria-expanded={tooltipOpen}
                        aria-disabled={isAriaDisabled}
                        aria-busy={isCleaning || undefined}
                        tabIndex={isCleaning ? -1 : 0}
                        onFocus={() => {
                            setIsVisualActive(true);
                            if (supportsHover) setTooltipOpen(true);
                        }}
                        onKeyDown={(event) => {
                            if (event.key !== 'Enter' && event.key !== ' ') return;
                            event.preventDefault();
                            if (!isInteractive) return;
                            onClick();
                        }}
                        onClick={() => {
                            if (!supportsHover && longPressTriggeredRef.current) {
                                longPressTriggeredRef.current = false;
                                return;
                            }

                            if (!isInteractive) return;
                            onClick();
                        }}
                        className={`clean-hover-button group relative flex h-9 shrink-0 items-center justify-center rounded-xl px-2.5 md:gap-2 md:px-3.5 ${isInteractive ? 'clean-hover-button--ready text-slate-500' : 'cursor-not-allowed text-slate-400'} ${isCleaning ? 'opacity-60' : ''}`}
                    >
                        <span aria-hidden="true" className="clean-hover-aura absolute inset-0 rounded-[inherit]" />
                        <span className="relative z-[1] flex items-center gap-1.5">
                            <Sparkles className="clean-hover-icon h-4 w-4 shrink-0" strokeWidth={2} />
                            <span className="text-[10px] font-bold leading-none md:hidden">
                                {isCleaning ? '...' : 'Clean'}
                            </span>
                            <span className="hidden text-[11px] font-bold leading-none md:inline">
                                {isCleaning ? 'Cleaning' : 'Clean'}
                            </span>
                        </span>
                    </button>
                </div>
            </div>
            {tooltip}
        </>
    );
};

const SurfaceIconButton = ({
    Icon,
    className = '',
    onClick,
    title,
}: {
    Icon: LucideIcon;
    className?: string;
    onClick: () => void;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 ${className}`}
    >
        <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
    </button>
);

interface ConfigPanelProps {
    inputs: EstimateInputs;
    setInputs: React.Dispatch<React.SetStateAction<EstimateInputs>>;
    isConfigTabActive: boolean;
    inventoryMode: 'raw' | 'normalized';
    normalizedRows: NormalizedRow[];
    setNormalizedRows: React.Dispatch<React.SetStateAction<NormalizedRow[]>>;
    rowsStatus: RowsStatus;
    inventoryClipped: boolean;
    setInventoryClipped: (v: boolean) => void;
    addRowInput: string;
    setAddRowInput: (v: string) => void;
    suggestedItems: string[];
    handleCleanTranscript: () => void | Promise<void>;
    handleInventoryModeToggle: () => void | Promise<void>;
    handleRawInventoryChange: (text: string) => void;
    handleAddRow: () => void;
    handleRowQtyChange: (id: string, value: string, blur?: boolean) => void;
    isCleaningTranscript: boolean;
    estimate: EstimateResult | Partial<EstimateResult>;
}

export const ConfigPanel = ({
    inputs,
    setInputs,
    isConfigTabActive,
    inventoryMode,
    normalizedRows,
    setNormalizedRows,
    rowsStatus,
    inventoryClipped,
    setInventoryClipped,
    addRowInput,
    setAddRowInput,
    suggestedItems,
    handleCleanTranscript,
    handleInventoryModeToggle,
    handleRawInventoryChange,
    handleAddRow,
    handleRowQtyChange,
    isCleaningTranscript,
    estimate,
}: ConfigPanelProps) => {
    const isLabor = inputs.moveType === 'Labor';
    const inventoryModeToggle = getInventoryModeToggleMeta(inventoryMode, rowsStatus);
    const detectedQtyTotal = (estimate as EstimateResult)?.detectedQtyTotal ?? 0;
    const inventoryViewport = useSyncExternalStore(
        subscribeToInventoryViewport,
        getInventoryViewportSnapshot,
        getInventoryViewportServerSnapshot
    );
    const expandedMetrics = getInventoryExpandedMetrics(inventoryViewport);

    const [undoCache, setUndoCache] = useState<{ text: string; rows: NormalizedRow[] } | null>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [configView, setConfigView] = useState<ConfigPanelView>('parameters');
    const [displayedConfigView, setDisplayedConfigView] = useState<ConfigPanelView>('parameters');
    const [configViewPhase, setConfigViewPhase] = useState<ConfigPanelViewPhase>('idle');
    const [contentViewportHeight, setContentViewportHeight] = useState<number | null>(null);
    const [mobileExpandedViewportHeight, setMobileExpandedViewportHeight] = useState<number | null>(null);
    const [activeContentNode, setActiveContentNode] = useState<HTMLDivElement | null>(null);

    const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const swapTimerRef = useRef<number | null>(null);
    const enterFrameRef = useRef<number | null>(null);
    const resizeFrameRef = useRef<number | null>(null);
    const mobileExpandedMeasureFrameRef = useRef<number | null>(null);
    const configViewportRef = useRef<HTMLDivElement | null>(null);
    const rawTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const normalizedListRef = useRef<HTMLDivElement | null>(null);
    const rawScrollTopRef = useRef(0);
    const normalizedScrollTopRef = useRef(0);

    const hasInventoryContent = inputs.inventoryText.length > 0 || normalizedRows.length > 0;
    const showInventoryActions = hasInventoryContent || Boolean(undoCache);
    const isExpandedViewDisplayed = displayedConfigView === 'inventoryExpanded';
    const isMobileExpandedViewDisplayed = inventoryViewport.metrics.isMobile && isExpandedViewDisplayed;
    const isMobileExpandedRawViewDisplayed = isMobileExpandedViewDisplayed && inventoryMode === 'raw';

    const clearViewTimers = useCallback(() => {
        if (swapTimerRef.current !== null) {
            window.clearTimeout(swapTimerRef.current);
            swapTimerRef.current = null;
        }
        if (enterFrameRef.current !== null) {
            window.cancelAnimationFrame(enterFrameRef.current);
            enterFrameRef.current = null;
        }
        if (resizeFrameRef.current !== null) {
            window.cancelAnimationFrame(resizeFrameRef.current);
            resizeFrameRef.current = null;
        }
        if (mobileExpandedMeasureFrameRef.current !== null) {
            window.cancelAnimationFrame(mobileExpandedMeasureFrameRef.current);
            mobileExpandedMeasureFrameRef.current = null;
        }
    }, []);

    const handleClearInventory = () => {
        setUndoCache({ text: inputs.inventoryText, rows: [...normalizedRows] });
        setInputs((prev) => ({ ...prev, inventoryText: '' }));
        setNormalizedRows([]);

        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
        undoTimerRef.current = setTimeout(() => setUndoCache(null), 10000);
    };

    const handleUndo = () => {
        if (!undoCache) return;

        setInputs((prev) => ({ ...prev, inventoryText: undoCache.text }));
        setNormalizedRows(undoCache.rows);
        setUndoCache(null);

        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };

    const limitInventoryText = (val: string) => {
        const maxChars = 12000;
        let nextValue = val ?? '';
        if (nextValue.length > maxChars) nextValue = nextValue.slice(0, maxChars);
        return nextValue;
    };

    const openInventoryWorkspace = useCallback(() => {
        setConfigView('inventoryExpanded');
    }, []);

    const closeInventoryWorkspace = useCallback(() => {
        setConfigView('parameters');
    }, []);

    const handleRawInventoryFocus = (event: React.FocusEvent<HTMLTextAreaElement>) => {
        if (isExpandedViewDisplayed) return;

        const target = event.currentTarget;
        requestAnimationFrame(() => {
            target.scrollIntoView({ block: 'nearest' });
        });
    };

    const handleRawInventoryScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
        rawScrollTopRef.current = event.currentTarget.scrollTop;
    };

    const handleNormalizedScroll = (event: React.UIEvent<HTMLDivElement>) => {
        normalizedScrollTopRef.current = event.currentTarget.scrollTop;
    };

    const syncMobileExpandedViewportHeight = useCallback(() => {
        if (!inventoryViewport.metrics.isMobile || displayedConfigView !== 'inventoryExpanded') return;

        const viewportNode = configViewportRef.current;
        if (!viewportNode) return;

        const nextHeight = resolveMobileExpandedViewportHeight({
            minHeight: MOBILE_EXPANDED_VIEWPORT_MIN_HEIGHT,
            viewportHeight: inventoryViewport.viewportHeight,
            viewportTop: viewportNode.getBoundingClientRect().top,
        });

        setMobileExpandedViewportHeight((current) => current === nextHeight ? current : nextHeight);
    }, [displayedConfigView, inventoryViewport.metrics.isMobile, inventoryViewport.viewportHeight]);

    useEffect(() => {
        return () => {
            if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
            clearViewTimers();
        };
    }, [clearViewTimers]);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

        syncPreference();

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', syncPreference);
            return () => mediaQuery.removeEventListener('change', syncPreference);
        }

        mediaQuery.addListener(syncPreference);
        return () => mediaQuery.removeListener(syncPreference);
    }, []);

    useEffect(() => {
        if (configView === displayedConfigView) return;

        clearViewTimers();

        const transition = resolveConfigPanelViewTransition(
            displayedConfigView,
            configView,
            prefersReducedMotion
        );

        if (transition.phase === 'idle') {
            enterFrameRef.current = window.requestAnimationFrame(() => {
                setDisplayedConfigView(transition.displayedView);
                setConfigViewPhase('idle');
                enterFrameRef.current = null;
            });
            return;
        }

        enterFrameRef.current = window.requestAnimationFrame(() => {
            setConfigViewPhase(transition.phase);
            enterFrameRef.current = null;

            swapTimerRef.current = window.setTimeout(() => {
                const nextState = resolveConfigPanelViewSwap(configView, prefersReducedMotion);
                setDisplayedConfigView(nextState.displayedView);
                setConfigViewPhase(nextState.phase);
                swapTimerRef.current = null;
            }, transition.swapDelayMs);
        });

        return () => clearViewTimers();
    }, [clearViewTimers, configView, displayedConfigView, prefersReducedMotion]);

    useEffect(() => {
        if (configViewPhase !== 'entering' || prefersReducedMotion) return;

        enterFrameRef.current = window.requestAnimationFrame(() => {
            const nextHeight = measureElementHeight(activeContentNode);
            if (nextHeight != null) {
                setContentViewportHeight((current) => current === nextHeight ? current : nextHeight);
            }
            setConfigViewPhase('idle');
            enterFrameRef.current = null;
        });

        return () => {
            if (enterFrameRef.current !== null) {
                window.cancelAnimationFrame(enterFrameRef.current);
                enterFrameRef.current = null;
            }
        };
    }, [activeContentNode, configViewPhase, prefersReducedMotion]);

    useEffect(() => {
        if (!activeContentNode) return;

        const syncHeight = () => {
            const nextHeight = measureElementHeight(activeContentNode);
            if (nextHeight != null) {
                setContentViewportHeight((current) => current === nextHeight ? current : nextHeight);
            }
        };

        syncHeight();

        if (typeof ResizeObserver === 'undefined') return;

        const observer = new ResizeObserver(() => {
            if (resizeFrameRef.current !== null) {
                window.cancelAnimationFrame(resizeFrameRef.current);
            }

            resizeFrameRef.current = window.requestAnimationFrame(() => {
                syncHeight();
                resizeFrameRef.current = null;
            });
        });

        observer.observe(activeContentNode);

        return () => {
            observer.disconnect();
            if (resizeFrameRef.current !== null) {
                window.cancelAnimationFrame(resizeFrameRef.current);
                resizeFrameRef.current = null;
            }
        };
    }, [activeContentNode]);

    useEffect(() => {
        if (!isMobileExpandedViewDisplayed) return;

        const scheduleSync = () => {
            if (mobileExpandedMeasureFrameRef.current !== null) {
                window.cancelAnimationFrame(mobileExpandedMeasureFrameRef.current);
            }

            mobileExpandedMeasureFrameRef.current = window.requestAnimationFrame(() => {
                syncMobileExpandedViewportHeight();
                mobileExpandedMeasureFrameRef.current = null;
            });
        };

        scheduleSync();

        window.addEventListener('scroll', scheduleSync, { passive: true });

        if (typeof ResizeObserver === 'undefined') {
            return () => {
                window.removeEventListener('scroll', scheduleSync);
                if (mobileExpandedMeasureFrameRef.current !== null) {
                    window.cancelAnimationFrame(mobileExpandedMeasureFrameRef.current);
                    mobileExpandedMeasureFrameRef.current = null;
                }
            };
        }

        const observer = new ResizeObserver(() => {
            scheduleSync();
        });

        if (document.body) {
            observer.observe(document.body);
        }
        if (document.documentElement && document.documentElement !== document.body) {
            observer.observe(document.documentElement);
        }
        if (configViewportRef.current) {
            observer.observe(configViewportRef.current);
        }

        return () => {
            window.removeEventListener('scroll', scheduleSync);
            observer.disconnect();
            if (mobileExpandedMeasureFrameRef.current !== null) {
                window.cancelAnimationFrame(mobileExpandedMeasureFrameRef.current);
                mobileExpandedMeasureFrameRef.current = null;
            }
        };
    }, [isMobileExpandedViewDisplayed, syncMobileExpandedViewportHeight]);

    useEffect(() => {
        if (
            !inventoryViewport.metrics.isMobile
            || isConfigTabActive
            || configView === 'parameters'
        ) {
            return;
        }

        const frameId = window.requestAnimationFrame(() => {
            clearViewTimers();
            setConfigView('parameters');
            setDisplayedConfigView('parameters');
            setConfigViewPhase('idle');
        });

        return () => window.cancelAnimationFrame(frameId);
    }, [clearViewTimers, configView, inventoryViewport.metrics.isMobile, isConfigTabActive]);

    useEffect(() => {
        if (inventoryMode === 'raw' && rawTextareaRef.current) {
            rawTextareaRef.current.scrollTop = rawScrollTopRef.current;
        }

        if (inventoryMode === 'normalized' && normalizedListRef.current) {
            normalizedListRef.current.scrollTop = normalizedScrollTopRef.current;
        }
    }, [displayedConfigView, inventoryMode]);

    useEffect(() => {
        const textarea = rawTextareaRef.current;
        if (!textarea) return;

        if (isMobileExpandedRawViewDisplayed) {
            textarea.style.height = '';
            textarea.style.overflowY = 'auto';
            return;
        }

        if (inventoryMode !== 'raw') return;

        const rawLimits = isExpandedViewDisplayed
            ? {
                minHeight: expandedMetrics.rawMinHeight,
                maxHeight: expandedMetrics.rawMaxHeight,
            }
            : {
                minHeight: inventoryViewport.metrics.rawMinHeight,
                maxHeight: inventoryViewport.metrics.rawMaxHeight,
            };
        const nextStyle = measureRawComposer(textarea, rawLimits);
        if (!nextStyle) return;

        textarea.style.height = `${nextStyle.height}px`;
        textarea.style.overflowY = nextStyle.overflowY;
    }, [
        expandedMetrics.rawMaxHeight,
        expandedMetrics.rawMinHeight,
        inputs.inventoryText,
        isExpandedViewDisplayed,
        isMobileExpandedRawViewDisplayed,
        inventoryMode,
        inventoryViewport.metrics.rawMaxHeight,
        inventoryViewport.metrics.rawMinHeight,
    ]);

    const configMotionStyle: React.CSSProperties = configViewPhase === 'leaving'
        ? {
            opacity: 0,
            transform: 'translateY(-4px)',
        }
        : configViewPhase === 'entering'
            ? {
                opacity: 0,
                transform: 'translateY(6px)',
            }
            : {
                opacity: 1,
                transform: 'translateY(0px)',
            };

    const resolvedConfigViewportHeight = isMobileExpandedViewDisplayed
        ? mobileExpandedViewportHeight ?? contentViewportHeight
        : contentViewportHeight;
    const configViewportStyle: React.CSSProperties = {
        height: resolvedConfigViewportHeight != null ? `${resolvedConfigViewportHeight}px` : undefined,
        transition: 'height 220ms ease-out',
    };

    const renderInventoryUtilityActions = () => (
        showInventoryActions ? (
            <div className="flex items-center gap-1.5">
                {hasInventoryContent && (
                    <button
                        type="button"
                        onClick={handleClearInventory}
                        className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        title="Clear inventory"
                        aria-label="Clear inventory"
                    >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                )}
                {undoCache && (
                    <button
                        type="button"
                        onClick={handleUndo}
                        className="rounded-lg bg-slate-50 p-1.5 text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-700"
                        title="Undo clear"
                        aria-label="Undo clear"
                    >
                        <Undo2 className="h-4 w-4" />
                    </button>
                )}
            </div>
        ) : null
    );

    const renderInventoryModeAction = () => (
        <SubviewActionButton
            Icon={inventoryModeToggle.Icon}
            label={inventoryModeToggle.label}
            mobileLabel={inventoryModeToggle.mobileLabel}
            onClick={() => void handleInventoryModeToggle()}
            title={inventoryModeToggle.title}
        />
    );

    const renderTranscriptCleanAction = () => (
        inventoryMode === 'raw' ? (
            <CleanTooltipButton
                onClick={() => void handleCleanTranscript()}
                isCleaning={isCleaningTranscript}
                disabled={isCleaningTranscript || !inputs.inventoryText.trim()}
            />
        ) : null
    );

    const renderInventoryExpandAction = (expanded: boolean) => (
        expanded ? (
            <SurfaceIconButton
                Icon={Minimize2}
                onClick={closeInventoryWorkspace}
                title="Collapse"
            />
        ) : (
            <SurfaceIconButton
                Icon={Maximize2}
                onClick={openInventoryWorkspace}
                title="Fullscreen"
            />
        )
    );

    const renderRawInventoryComposer = (expanded: boolean) => (
        <div className={`flex ${expanded ? 'h-full min-h-0 flex-col' : 'flex-col'}`}>
            <div className={`relative ${expanded ? 'flex-1 min-h-0 overflow-hidden rounded-2xl border border-slate-200 bg-white' : ''}`}>
                <div className="absolute right-2 top-2 z-10">
                    {renderInventoryExpandAction(expanded)}
                </div>
                <textarea
                    ref={rawTextareaRef}
                    value={inputs.inventoryText}
                    onChange={(event) => {
                        const raw = event.target.value;
                        const limited = limitInventoryText(raw);
                        setInventoryClipped(limited.length !== raw.length);
                        handleRawInventoryChange(limited);
                    }}
                    onFocus={handleRawInventoryFocus}
                    onScroll={handleRawInventoryScroll}
                    className={`inventory-scrollbar-hidden block w-full resize-none font-mono leading-relaxed text-slate-800 outline-none transition-colors placeholder:text-slate-500 ${expanded
                        ? 'h-full min-h-0 border-0 bg-white px-4 py-4 pr-10 text-[14px] md:px-5 md:py-5 md:pr-10'
                        : 'min-h-[96px] rounded-2xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-base sm:p-5 sm:pr-10 md:min-h-[224px] md:pr-10 md:text-[14px]'}`}
                    placeholder="Paste inventory or transcript..."
                    style={{
                        WebkitOverflowScrolling: 'touch',
                        scrollMarginBottom: INVENTORY_SCROLL_MARGIN_BOTTOM,
                        ...(!expanded
                            ? { maxHeight: inventoryViewport.metrics.rawMaxHeight }
                            : inventoryViewport.metrics.isMobile
                                ? {}
                                : { maxHeight: expandedMetrics.rawMaxHeight }),
                    }}
                    aria-label="Raw inventory text input"
                />
            </div>
            {rowsStatus === 'stale' && (
                <div className="mt-2 px-1 text-[10px] font-bold text-amber-600">
                    Rows stale. Re-normalize to sync.
                </div>
            )}
        </div>
    );

    const renderNormalizedInventoryEditor = (expanded: boolean) => (
        <div
            className={`rounded-2xl border border-slate-200 bg-white ${expanded ? 'flex h-full min-h-0 flex-col p-4' : 'p-3'}`}
            style={{ scrollMarginBottom: INVENTORY_SCROLL_MARGIN_BOTTOM }}
        >
            <div className="mb-2 flex items-center gap-3 px-1">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                    Edit Items
                </div>
                <div className="ml-auto">
                    {renderInventoryExpandAction(expanded)}
                </div>
            </div>
            <div
                ref={normalizedListRef}
                onScroll={handleNormalizedScroll}
                className={`inventory-scrollbar-hidden overflow-x-auto overflow-y-auto pr-1 ${expanded ? 'flex-1 min-h-0' : ''}`}
                style={{
                    WebkitOverflowScrolling: 'touch',
                    ...(!expanded
                        ? { maxHeight: inventoryViewport.metrics.normalizedMaxHeight }
                        : inventoryViewport.metrics.isMobile
                            ? {}
                            : { maxHeight: expandedMetrics.normalizedMaxHeight }),
                }}
            >
                <div className="min-w-[260px] w-full">
                    <div className="sticky top-0 z-10 mb-1 grid grid-cols-[1fr_2.5rem_2.5rem_2.5rem_1.75rem] gap-1.5 border-b border-slate-100 bg-white px-1 pb-1 text-[9px] font-semibold text-slate-500">
                        <div>Item</div>
                        <div className="text-center">Qty</div>
                        <div className="text-center">CF/ea</div>
                        <div className="text-center">Heavy</div>
                        <div></div>
                    </div>
                    {normalizedRows.map((row) => (
                        <div key={row.id} className="mb-1 grid grid-cols-[1fr_2.5rem_2.5rem_2.5rem_1.75rem] items-center gap-1.5 text-[10px] font-semibold">
                            <input
                                className="min-w-0 h-8 rounded border border-transparent bg-slate-50 px-2 text-base text-slate-900 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:border-slate-200 focus:ring-0 md:h-7 md:text-[10px]"
                                value={row.name}
                                onChange={(event) => setNormalizedRows((prev) => prev.map((candidate) => candidate.id === row.id ? {
                                    ...candidate,
                                    name: event.target.value,
                                    cfExact: undefined,
                                    isSynthetic: false,
                                } : candidate))}
                                aria-label={`Item name for ${row.name}`}
                            />
                            <input
                                type="number"
                                className="h-8 rounded border border-transparent bg-slate-50 px-1 text-center text-base text-slate-900 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:border-slate-200 focus:ring-0 md:h-7 md:text-[10px]"
                                value={row.qty as string | number}
                                onChange={(event) => handleRowQtyChange(row.id, event.target.value)}
                                onBlur={() => handleRowQtyChange(row.id, row.qty as string, true)}
                                aria-label={`Quantity for ${row.name}`}
                            />
                            <input
                                type="number"
                                className="h-8 rounded border border-transparent bg-slate-50 px-1 text-center text-base text-slate-900 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:border-slate-200 focus:ring-0 md:h-7 md:text-[10px]"
                                value={row.cfUnit as string | number}
                                onChange={(event) => setNormalizedRows((prev) => prev.map((candidate) => candidate.id === row.id ? {
                                    ...candidate,
                                    cfUnit: Number(event.target.value) || 1,
                                    cfExact: undefined,
                                    isSynthetic: false,
                                } : candidate))}
                                aria-label={`Cubic feet per unit for ${row.name}`}
                            />
                            <div className="flex justify-center">
                                <label className="group relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={row.flags.heavy}
                                        onChange={(event) => setNormalizedRows((prev) => prev.map((candidate) => candidate.id === row.id ? {
                                            ...candidate,
                                            flags: { ...candidate.flags, heavy: event.target.checked },
                                        } : candidate))}
                                        aria-label={`Mark ${row.name} as heavy item`}
                                    />
                                    <div className={`flex h-[22px] w-[22px] items-center justify-center rounded-md shadow-sm transition-all duration-200 ease-out ${row.flags.heavy ? 'border-[1.5px] border-slate-900 bg-slate-900' : 'bg-transparent hover:bg-slate-100'}`}>
                                        <Weight className={`h-3.5 w-3.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${row.flags.heavy ? 'scale-110 text-white' : 'text-slate-300'}`} strokeWidth={2.5} />
                                    </div>
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={() => setNormalizedRows((prev) => prev.filter((candidate) => candidate.id !== row.id))}
                                className="flex items-center justify-center rounded-lg p-1.5 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-600"
                                aria-label="Delete item"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-2 flex gap-2 border-t border-slate-100 pt-2">
                <input
                    className="h-8 flex-1 rounded-lg border border-transparent bg-slate-50 px-2 text-base text-slate-900 outline-none transition-all placeholder:text-slate-500 hover:bg-slate-100 focus:bg-white focus:border-slate-200 focus:ring-0"
                    placeholder="Add item (e.g. piano)"
                    list="volumeSuggestions"
                    value={addRowInput}
                    onChange={(event) => setAddRowInput(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') handleAddRow();
                    }}
                    aria-label="Add new item name"
                />
                <datalist id="volumeSuggestions">
                    {addRowInput.length > 1 && suggestedItems.map((item) => <option key={item} value={item} />)}
                </datalist>
                <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex h-8 items-center gap-1 whitespace-nowrap rounded-lg bg-gray-900 px-4 text-[11px] font-bold text-white shadow-sm transition-all active:scale-95"
                >
                    <Plus className="h-3.5 w-3.5" /> ADD
                </button>
            </div>
        </div>
    );

    const renderInventorySectionHeader = (expanded: boolean) => (
        <div className={`flex flex-wrap items-center gap-1.5 ${expanded ? 'mb-3' : 'mb-3 ml-1'}`}>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                Inventory
            </span>

            <span className="mr-auto ml-2 inline-flex cursor-default select-none justify-center whitespace-nowrap rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[9px] font-extrabold text-slate-500">
                <span className="inline-block w-[20px] text-right tabular-nums">{detectedQtyTotal}</span>
                <span className="ml-0.5 inline-block w-[26px] text-left">{detectedQtyTotal === 1 ? 'item' : 'items'}</span>
            </span>

            <div className="ml-auto flex min-w-0 items-center gap-1.5">
                {renderInventoryUtilityActions()}
                {renderTranscriptCleanAction()}
                {renderInventoryModeAction()}
            </div>
        </div>
    );

    const renderInventoryBody = (expanded: boolean) => (
        inventoryMode === 'raw'
            ? renderRawInventoryComposer(expanded)
            : renderNormalizedInventoryEditor(expanded)
    );

    const parametersShellHeader = (
        <div className="mb-2 hidden items-center gap-2 border-b border-slate-100 pb-5 md:flex">
            <Settings className="h-4 w-4 text-slate-500" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600">Parameters</span>
        </div>
    );

    const parametersContent = (
        <div className="flex flex-col space-y-5 md:space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <InputLabel label="Size" />
                    <Select
                        id="homeSize"
                        value={inputs.homeSize}
                        onChange={(event) => setInputs({ ...inputs, homeSize: event.target.value })}
                        options={[
                            { value: '1', label: '1 BDR / Less' },
                            { value: '2', label: '2 BDR' },
                            { value: '3', label: '3 BDR' },
                            { value: '4', label: '4 BDR' },
                            { value: '5', label: '5+ BDR' },
                            { value: 'Commercial', label: 'Commercial' },
                        ]}
                    />
                </div>
                <div>
                    <InputLabel label="Distance" />
                    <div className={`relative ${isLabor ? 'pointer-events-none opacity-50' : ''}`}>
                        <input
                            type="text"
                            inputMode="numeric"
                            disabled={isLabor}
                            value={inputs.distance}
                            onChange={(event) => {
                                const value = event.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
                                setInputs({ ...inputs, distance: value });
                            }}
                            className="w-full rounded-2xl border border-transparent bg-slate-50 px-4 py-3.5 text-base font-bold text-slate-900 outline-none transition-all hover:bg-slate-100 focus:bg-white focus:border-slate-200 focus:ring-0"
                            aria-label="Moving distance in miles"
                        />
                        <MapPin className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <InputLabel label="Service" />
                    <Select
                        id="moveType"
                        value={inputs.moveType}
                        onChange={(event) => {
                            const nextValue = event.target.value;
                            setInputs((prev) => {
                                const next = { ...prev, moveType: nextValue as 'Local' | 'LD' | 'Labor' };
                                if (nextValue !== 'Local' && prev.accessDest !== 'ground') {
                                    next.accessDest = 'ground';
                                }
                                return next;
                            });
                        }}
                        options={[
                            { value: 'Local', label: 'Local' },
                            { value: 'LD', label: 'Long Distance' },
                            { value: 'Labor', label: 'Labor' },
                        ]}
                    />
                </div>
                <div>
                    <InputLabel label="Packing" />
                    <Select
                        id="packingLevel"
                        value={inputs.packingLevel}
                        onChange={(event) => setInputs({ ...inputs, packingLevel: event.target.value as 'None' | 'Partial' | 'Full' })}
                        options={[
                            { value: 'None', label: 'No Packing' },
                            { value: 'Partial', label: 'Partial Packing' },
                            { value: 'Full', label: 'Full Packing' },
                        ]}
                    />
                </div>
            </div>

            <div className="space-y-4 pt-1 md:pt-2">
                <div>
                    <InputLabel label={inputs.moveType === 'Labor' ? 'Location Access' : 'Pickup Access'} />
                    <AccessSegmented value={inputs.accessOrigin} onChange={(value) => setInputs({ ...inputs, accessOrigin: value })} />
                </div>
                {inputs.moveType === 'Local' && (
                    <div>
                        <InputLabel label="Delivery Access" />
                        <AccessSegmented value={inputs.accessDest} onChange={(value) => setInputs({ ...inputs, accessDest: value })} />
                    </div>
                )}
            </div>

            {inputs.moveType !== 'Labor' && (
                <div className="pt-1 md:pt-2">
                    <InputLabel label="Extra Stops" />
                    {(inputs.extraStops || []).map((stop, idx) => (
                        <div key={idx} className="mb-3 flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex-1">
                                <div className="mb-1.5 flex items-center gap-2">
                                    <span className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">STOP {idx + 1}</span>
                                    <input
                                        type="text"
                                        placeholder="Label (e.g. Storage unit)"
                                        value={stop.label || ''}
                                        maxLength={30}
                                        onChange={(event) => {
                                            const nextStops = [...(inputs.extraStops || [])];
                                            nextStops[idx].label = event.target.value;
                                            setInputs({ ...inputs, extraStops: nextStops });
                                        }}
                                        className="flex-1 rounded-lg border border-transparent bg-slate-50 px-2.5 py-2 text-base font-medium text-slate-900 outline-none transition-all placeholder:text-slate-500 hover:bg-slate-100 focus:bg-white focus:border-slate-200 focus:ring-0 md:py-1.5 md:text-[11px]"
                                        aria-label={`Extra stop ${idx + 1} label`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nextStops = (inputs.extraStops || []).filter((_, stopIndex) => stopIndex !== idx);
                                            setInputs({ ...inputs, extraStops: nextStops });
                                        }}
                                        className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <AccessSegmented
                                        value={stop.access}
                                        onChange={(value) => {
                                            const nextStops = [...(inputs.extraStops || [])];
                                            nextStops[idx].access = value as 'ground' | 'elevator' | 'stairs';
                                            setInputs({ ...inputs, extraStops: nextStops });
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {(inputs.extraStops || []).length < MAX_EXTRA_STOPS && (
                        <button
                            type="button"
                            onClick={() => {
                                const nextStops = [...(inputs.extraStops || []), { label: '', access: 'ground' as 'ground' | 'elevator' | 'stairs' }];
                                setInputs({ ...inputs, extraStops: nextStops });
                            }}
                            className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-200 bg-transparent px-3 py-2.5 text-[10px] font-semibold text-slate-500 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 active:scale-95"
                        >
                            <Plus className="h-3.5 w-3.5" /> ADD EXTRA STOP
                        </button>
                    )}
                </div>
            )}

            <div className="relative flex flex-1 flex-col border-t border-slate-100 pt-2 md:pt-3">
                {renderInventorySectionHeader(false)}
                <div className="w-full">
                    {renderInventoryBody(false)}
                    {inventoryClipped && (
                        <div className="mt-3 rounded-lg border border-orange-100 bg-orange-50 p-2.5 text-[10px] font-semibold text-orange-600">
                            Inventory clipped (limit reached).
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const expandedContent = (
        <div className={`flex flex-col gap-3 ${inventoryViewport.metrics.isMobile ? 'h-full min-h-0' : ''}`}>
            <div
                className={inventoryViewport.metrics.isMobile ? 'flex-1 min-h-0' : 'min-h-0'}
                style={inventoryViewport.metrics.isMobile ? undefined : { height: `${expandedMetrics.workspaceHeight}px` }}
            >
                {renderInventoryBody(true)}
            </div>
            {inventoryClipped && (
                <div className="rounded-lg border border-orange-100 bg-orange-50 p-2.5 text-[10px] font-semibold text-orange-600">
                    Inventory clipped (limit reached).
                </div>
            )}
        </div>
    );

    const configShellHeader = displayedConfigView === 'inventoryExpanded'
        ? renderInventorySectionHeader(true)
        : parametersShellHeader;
    const configContent = displayedConfigView === 'inventoryExpanded'
        ? expandedContent
        : parametersContent;

    return (
        <GlassPanel className="overflow-hidden">
            <div className="flex flex-col p-4 md:p-6">
                {configShellHeader}
                <div ref={configViewportRef} className="config-view-viewport overflow-hidden" style={configViewportStyle}>
                    <div
                        key={displayedConfigView}
                        ref={setActiveContentNode}
                        className={`config-view-motion transition-[opacity,transform] duration-[180ms] ease-out ${isMobileExpandedViewDisplayed ? 'h-full' : ''}`}
                        style={configMotionStyle}
                    >
                        {configContent}
                    </div>
                </div>
            </div>
        </GlassPanel>
    );
};
