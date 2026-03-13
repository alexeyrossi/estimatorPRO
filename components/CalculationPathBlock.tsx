'use client';

import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Box, ChevronDown, ChevronRight, Clock3, Info, PackageOpen, Scale, Sparkles } from 'lucide-react';

import type {
  CalculationPathItem,
  CalculationPathLane,
  CalculationPathModifier,
  CalculationPathNode,
  EstimateResult,
} from '@/lib/types/estimator';

const TOOLTIP_WIDTH = 272;
const TOOLTIP_GAP = 10;
const VIEWPORT_PADDING = 16;

type TooltipPosition = {
  top: number;
  left: number;
  width: number;
};

type SplitLaneItems = {
  mainItems: CalculationPathItem[];
  overrideModifier: CalculationPathModifier | null;
  overrideNode: CalculationPathNode | null;
};

type LaneSegments = {
  railItems: CalculationPathItem[];
  resultNode: CalculationPathNode | null;
};

type RailTheme = {
  sectionBorder: string;
  sectionSurface: string;
  sectionGlow: string;
  label: string;
  caption: string;
  connector: string;
  nodeLabel: string;
  nodeValue: string;
  nodeUnit: string;
  modifierBg: string;
  modifierHoverBg: string;
  modifierLabel: string;
  modifierValue: string;
  modifierIcon: string;
  modifierGlow: string;
  tooltipBorder: string;
  tooltipGlow: string;
};

type ResultTheme = {
  label: string;
  value: string;
  valueGlow: string;
  unit: string;
  caption: string;
  glow: string;
  aura: string;
  arrowHead: string;
};

type OverrideStripTheme = {
  container: string;
  labelBadge: string;
  valueBadge: string;
};

type FactorCard = {
  title: string;
  value: string;
  caption: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const standaloneCardClass = 'relative overflow-hidden rounded-[1.6rem] border px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:px-5 sm:py-5';

const railThemes: Record<'volume' | 'labor' | 'amber', RailTheme> = {
  volume: {
    sectionBorder: 'border-sky-400/10',
    sectionSurface: 'bg-[linear-gradient(180deg,rgba(4,16,30,0.98),rgba(2,11,22,0.98))]',
    sectionGlow: 'bg-[radial-gradient(circle_at_18%_20%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(ellipse_at_54%_68%,rgba(16,185,129,0.18),transparent_54%),radial-gradient(circle_at_82%_18%,rgba(14,165,233,0.08),transparent_26%)]',
    label: 'text-emerald-300',
    caption: 'text-slate-400',
    connector: 'text-slate-600',
    nodeLabel: 'text-slate-400',
    nodeValue: 'text-slate-100',
    nodeUnit: 'text-slate-500',
    modifierBg: 'bg-transparent',
    modifierHoverBg: 'hover:bg-transparent',
    modifierLabel: 'text-sky-100/78',
    modifierValue: 'text-slate-50',
    modifierIcon: 'text-sky-100/70',
    modifierGlow: 'bg-[radial-gradient(circle,rgba(14,165,233,0.18),transparent_68%)]',
    tooltipBorder: 'border-sky-400/25',
    tooltipGlow: 'shadow-[0_22px_60px_rgba(14,165,233,0.12)]',
  },
  labor: {
    sectionBorder: 'border-violet-400/10',
    sectionSurface: 'bg-[linear-gradient(180deg,rgba(7,14,31,0.98),rgba(3,8,22,0.98))]',
    sectionGlow: 'bg-[radial-gradient(circle_at_18%_22%,rgba(99,102,241,0.14),transparent_26%),radial-gradient(ellipse_at_54%_70%,rgba(139,92,246,0.18),transparent_54%),radial-gradient(circle_at_84%_18%,rgba(139,92,246,0.08),transparent_24%)]',
    label: 'text-violet-300',
    caption: 'text-slate-400',
    connector: 'text-slate-600',
    nodeLabel: 'text-slate-400',
    nodeValue: 'text-slate-100',
    nodeUnit: 'text-slate-500',
    modifierBg: 'bg-transparent',
    modifierHoverBg: 'hover:bg-transparent',
    modifierLabel: 'text-violet-100/78',
    modifierValue: 'text-slate-50',
    modifierIcon: 'text-violet-100/72',
    modifierGlow: 'bg-[radial-gradient(circle,rgba(139,92,246,0.18),transparent_68%)]',
    tooltipBorder: 'border-violet-400/25',
    tooltipGlow: 'shadow-[0_22px_60px_rgba(139,92,246,0.14)]',
  },
  amber: {
    sectionBorder: 'border-amber-300/18',
    sectionSurface: 'bg-[linear-gradient(180deg,rgba(56,32,4,0.36),rgba(25,17,6,0.54))]',
    sectionGlow: 'bg-[radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.16),transparent_34%),radial-gradient(circle_at_58%_76%,rgba(180,83,9,0.10),transparent_38%)]',
    label: 'text-amber-200',
    caption: 'text-amber-100/65',
    connector: 'text-amber-200/40',
    nodeLabel: 'text-amber-100/65',
    nodeValue: 'text-amber-50',
    nodeUnit: 'text-amber-100/48',
    modifierBg: 'bg-transparent',
    modifierHoverBg: 'hover:bg-transparent',
    modifierLabel: 'text-amber-100/75',
    modifierValue: 'text-amber-50',
    modifierIcon: 'text-amber-100/72',
    modifierGlow: 'bg-[radial-gradient(circle,rgba(251,191,36,0.22),transparent_68%)]',
    tooltipBorder: 'border-amber-300/25',
    tooltipGlow: 'shadow-[0_22px_60px_rgba(251,191,36,0.14)]',
  },
};

const resultThemes: Record<'volume' | 'labor', ResultTheme> = {
  volume: {
    label: 'text-emerald-300/80',
    value: 'text-emerald-400',
    valueGlow: 'drop-shadow-[0_0_24px_rgba(16,185,129,0.24)]',
    unit: 'text-emerald-300/55',
    caption: 'text-emerald-200/42',
    glow: 'bg-[radial-gradient(circle,rgba(16,185,129,0.20),transparent_66%)]',
    aura: 'bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.24),transparent_64%)]',
    arrowHead: 'text-emerald-400/70',
  },
  labor: {
    label: 'text-violet-200/82',
    value: 'text-violet-50',
    valueGlow: 'drop-shadow-[0_0_22px_rgba(139,92,246,0.20)]',
    unit: 'text-violet-200/60',
    caption: 'text-violet-100/40',
    glow: 'bg-[radial-gradient(circle,rgba(139,92,246,0.18),transparent_66%)]',
    aura: 'bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.20),transparent_64%)]',
    arrowHead: 'text-violet-300/62',
  },
};

const overrideStripThemes: Record<'amber' | 'labor', OverrideStripTheme> = {
  amber: {
    container: 'border border-amber-300/18 bg-amber-400/[0.08] text-amber-50',
    labelBadge: 'border border-amber-300/24 bg-amber-400/[0.10] text-amber-100',
    valueBadge: 'border border-amber-300/22 bg-black/20 text-amber-50',
  },
  labor: {
    container: 'border border-violet-300/18 bg-violet-400/[0.08] text-violet-50',
    labelBadge: 'border border-violet-300/24 bg-violet-400/[0.10] text-violet-100',
    valueBadge: 'border border-violet-300/22 bg-black/20 text-violet-50',
  },
};

const mobileLabelMap: Record<string, string> = {
  'Inventory Volume': 'Inv.',
  'Coverage / Safety': 'Cov.',
  'Adjusted Volume': 'Adj.',
  'Loose-Load / Stacking': 'Stack.',
  'Truck Space': 'Truck',
  'Base Time': 'Base',
  'Access & Handling': 'Acc.',
  'Work Time': 'Work',
  'Range Buffer': 'Buf.',
  'Est. Range': 'Range',
  'Manual Override': 'Manual',
  'Final Volume': 'Final',
  'Final Range': 'Final',
};

const compactRailLabelMap: Record<string, string> = {
  'Inventory Volume': 'Inventory',
  'Coverage / Safety': 'Coverage',
  'Adjusted Volume': 'Adjusted',
  'Loose-Load / Stacking': 'Stacking',
  'Truck Space': 'Truck Space',
  'Base Time': 'Base Time',
  'Access & Handling': 'Access',
  'Work Time': 'Work Time',
  'Range Buffer': 'Buffer',
  'Est. Range': 'Est. Range',
  'Manual Override': 'Manual',
  'Final Volume': 'Final Volume',
  'Final Range': 'Final Range',
};

function formatDisplayValue(value: number | string, unit: string) {
  if (typeof value !== 'number') return value;

  if (unit === 'h') {
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1);
  }

  return value.toLocaleString();
}

function splitLaneItems(items: CalculationPathItem[]): SplitLaneItems {
  if (items.length < 2) {
    return {
      mainItems: items,
      overrideModifier: null,
      overrideNode: null,
    };
  }

  const lastItem = items[items.length - 1];
  const previousItem = items[items.length - 2];

  if (
    previousItem.kind === 'modifier' &&
    lastItem.kind === 'node' &&
    (previousItem.tone === 'amber' || lastItem.tone === 'amber')
  ) {
    return {
      mainItems: items.slice(0, -2),
      overrideModifier: previousItem,
      overrideNode: lastItem,
    };
  }

  return {
    mainItems: items,
    overrideModifier: null,
    overrideNode: null,
  };
}

function splitLaneResult(items: CalculationPathItem[]): LaneSegments {
  if (items.length === 0) {
    return {
      railItems: items,
      resultNode: null,
    };
  }

  const lastItem = items[items.length - 1];

  if (lastItem.kind === 'node') {
    return {
      railItems: items.slice(0, -1),
      resultNode: lastItem,
    };
  }

  return {
    railItems: items,
    resultNode: null,
  };
}

function getDelayStyle(isReady: boolean, step: number) {
  return {
    transitionDelay: isReady ? `${step * 55}ms` : '0ms',
  };
}

function isDomNode(target: EventTarget | null): target is Node {
  return typeof Node !== 'undefined' && target instanceof Node;
}

function getShortLabel(label: string, condensed: boolean) {
  if (condensed) return mobileLabelMap[label] || label;
  return compactRailLabelMap[label] || label;
}

function getUnitLabel(unit: string, condensed: boolean) {
  if (!condensed) return unit;
  return unit === 'cu ft' ? 'cf' : unit;
}

function condenseModifierValue(value: string, condensed: boolean) {
  const compactValue = value
    .replaceAll('cu ft', 'cf')
    .replaceAll(' / ', '/')
    .replaceAll(' h', 'h');

  if (!condensed) return compactValue;
  return compactValue
    .replace(/\s*cf$/i, '')
    .replaceAll('0.', '.');
}

function stripLeadingMetric(text: string) {
  return text
    .replace(/^[+-]?\d+(?:\.\d+)?(?:–\d+(?:\.\d+)?)?\s*(?:cu ft|h)\s+/i, '')
    .replace(/^Reasons:\s*/i, '')
    .trim();
}

function truncateText(text: string, maximum = 56) {
  if (text.length <= maximum) return text;
  return `${text.slice(0, maximum - 1)}…`;
}

function getModifier(lane: CalculationPathLane, label: string) {
  return lane.items.find((item) => item.kind === 'modifier' && item.label === label) as CalculationPathModifier | undefined;
}

function buildFactorCards(calculationPath: EstimateResult['calculationPath']): FactorCard[] {
  const coverage = getModifier(calculationPath.volume, 'Coverage / Safety');
  const looseLoad = getModifier(calculationPath.volume, 'Loose-Load / Stacking');
  const labor = getModifier(calculationPath.labor, 'Access & Handling');

  const coverageDetail = coverage?.details.find((detail) => /box|coverage|hidden volume/i.test(detail)) || coverage?.details[0] || 'Minimum requirement for safe transport.';
  const looseLoadPercentMatch = looseLoad?.details.join(' ').match(/(\d+%)\s+loose-load base allowance/i);
  const looseLoadReason = looseLoad?.details.find((detail) => detail.startsWith('Reasons:')) || looseLoad?.details.find((detail) => /allowance/i.test(detail)) || 'Furniture is not perfectly square.';
  const laborDetail = labor?.details.find((detail) => /access|stairs|elevator|distance|routing/i.test(detail)) || labor?.details[0] || 'Accounts for stairs, elevators, and travel buffers.';

  return [
    {
      title: 'Weight Baseline',
      value: '7 lbs / cu ft',
      caption: 'DOT tariff standard',
      icon: Scale,
    },
    {
      title: 'Box Algorithm',
      value: 'Auto-Generated',
      caption: truncateText(stripLeadingMetric(coverageDetail)),
      icon: Box,
    },
    {
      title: 'Stacking Factor',
      value: looseLoadPercentMatch ? `${looseLoadPercentMatch[1]} Volume Allowance` : 'Loose-Load Buffer',
      caption: truncateText(stripLeadingMetric(looseLoadReason)),
      icon: PackageOpen,
    },
    {
      title: 'Labor Algorithm',
      value: 'Volume + Access Factors',
      caption: truncateText(stripLeadingMetric(laborDetail)),
      icon: Clock3,
    },
  ];
}

function RailHeader({
  label,
  caption,
  theme,
}: {
  label: string;
  caption: string;
  theme: RailTheme;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className={`whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.22em] ${theme.label}`}>
        {label}
      </div>
      <div className={`min-w-0 truncate text-[12px] font-medium leading-none ${theme.caption}`}>
        {caption}
      </div>
    </div>
  );
}

function RailNode({
  item,
  condensed,
  isReady,
  step,
}: {
  item: CalculationPathNode;
  condensed: boolean;
  isReady: boolean;
  step: number;
}) {
  const label = getShortLabel(item.label, condensed);
  const unitLabel = getUnitLabel(item.unit, condensed);
  const value = formatDisplayValue(item.value, item.unit);
  const animationClass = isReady ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0';
  const valueClass = condensed
    ? 'text-[21px] leading-none font-black text-slate-100'
    : 'text-[29px] leading-none font-black text-slate-100';
  const labelClass = 'text-slate-400';
  const unitClass = 'text-slate-500';

  return (
    <div
      className={`min-w-0 text-center transition-[transform,opacity] duration-500 ease-out ${animationClass}`}
      style={getDelayStyle(isReady, step)}
    >
      <div className={`truncate font-semibold leading-none tracking-[0.08em] ${labelClass} ${condensed ? 'text-[8.5px]' : 'text-[9.5px]'}`}>
        {label}
      </div>
      <div className="mt-1 flex items-baseline justify-center gap-1">
        <span className={valueClass}>
          {value}
        </span>
        <span className={`truncate font-semibold tracking-[0.08em] ${unitClass} ${condensed ? 'text-[10px]' : 'text-[11px]'}`}>
          {unitLabel}
        </span>
      </div>
    </div>
  );
}

function RailModifier({
  item,
  theme,
  condensed,
  isReady,
  step,
}: {
  item: CalculationPathModifier;
  theme: RailTheme;
  condensed: boolean;
  isReady: boolean;
  step: number;
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const tooltipId = useId();
  const animationClass = isReady ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0';
  const value = condenseModifierValue(item.displayValue, condensed);

  const updateTooltipPosition = useCallback(() => {
    if (typeof window === 'undefined' || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const width = Math.min(TOOLTIP_WIDTH, Math.max(0, window.innerWidth - VIEWPORT_PADDING * 2));
    const height = tooltipRef.current?.getBoundingClientRect().height ?? 0;
    const centeredLeft = triggerRect.left + triggerRect.width / 2 - width / 2;
    const maxLeft = Math.max(VIEWPORT_PADDING, window.innerWidth - VIEWPORT_PADDING - width);
    const left = Math.min(Math.max(VIEWPORT_PADDING, centeredLeft), maxLeft);
    const belowTop = triggerRect.bottom + TOOLTIP_GAP;
    const aboveTop = triggerRect.top - TOOLTIP_GAP - height;
    let top = belowTop;

    if (height > 0 && belowTop + height > window.innerHeight - VIEWPORT_PADDING && aboveTop >= VIEWPORT_PADDING) {
      top = aboveTop;
    } else if (height > 0) {
      top = Math.min(
        Math.max(VIEWPORT_PADDING, belowTop),
        Math.max(VIEWPORT_PADDING, window.innerHeight - VIEWPORT_PADDING - height)
      );
    }

    setTooltipPosition((current) => (
      current && current.top === top && current.left === left && current.width === width
        ? current
        : { top, left, width }
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
  }, [tooltipOpen, updateTooltipPosition, item.details.length, item.summary]);

  useEffect(() => {
    if (!tooltipOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = isDomNode(event.target) ? event.target : null;
      if (target && !rootRef.current?.contains(target) && !tooltipRef.current?.contains(target)) {
        setTooltipOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTooltipOpen(false);
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

  const tooltip = tooltipOpen && typeof document !== 'undefined'
    ? createPortal(
      <div
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        className={`fixed z-[90] rounded-[1.1rem] border bg-slate-950/98 p-3.5 ${theme.tooltipBorder} ${theme.tooltipGlow}`}
        style={tooltipPosition
          ? {
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            width: tooltipPosition.width,
          }
          : {
            top: 0,
            left: 0,
            width: TOOLTIP_WIDTH,
            visibility: 'hidden',
          }}
        onMouseEnter={() => {
          if (supportsHover) setTooltipOpen(true);
        }}
        onMouseLeave={(event) => {
          const nextTarget = isDomNode(event.relatedTarget) ? event.relatedTarget : null;
          if (supportsHover && !rootRef.current?.contains(nextTarget)) {
            setTooltipOpen(false);
          }
        }}
      >
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          {item.label}
        </div>
        <div className="mt-1.5 text-[12px] font-semibold leading-relaxed text-slate-100">
          {item.summary}
        </div>
        <div className="mt-3 space-y-2">
          {item.details.map((detail) => (
            <div key={detail} className="flex gap-2 text-[11px] font-medium leading-relaxed text-slate-300">
              <span className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white/70" />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      </div>,
      document.body
    )
    : null;

  return (
    <>
      <div
        ref={rootRef}
        className={`min-w-0 transition-[transform,opacity] duration-500 ease-out ${animationClass}`}
        style={getDelayStyle(isReady, step)}
        onMouseEnter={() => {
          if (supportsHover) setTooltipOpen(true);
        }}
        onMouseLeave={(event) => {
          const nextTarget = isDomNode(event.relatedTarget) ? event.relatedTarget : null;
          if (supportsHover && !tooltipRef.current?.contains(nextTarget)) {
            setTooltipOpen(false);
          }
        }}
        onBlur={(event) => {
          const nextTarget = isDomNode(event.relatedTarget) ? event.relatedTarget : null;
          if (!event.currentTarget.contains(nextTarget) && !tooltipRef.current?.contains(nextTarget)) {
            setTooltipOpen(false);
          }
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-label={`Show ${item.label} details`}
          aria-describedby={tooltipOpen ? tooltipId : undefined}
          aria-expanded={tooltipOpen}
          className={`group relative w-full min-w-0 text-center transition-[transform,opacity] duration-300 hover:-translate-y-0.5 ${theme.modifierBg} ${theme.modifierHoverBg} ${condensed ? 'px-0 py-1' : 'px-1 py-1'}`}
          onFocus={() => {
            if (supportsHover) setTooltipOpen(true);
          }}
          onClick={() => {
            if (supportsHover) {
              setTooltipOpen(true);
              return;
            }

            setTooltipOpen((current) => !current);
          }}
        >
          <div className={`pointer-events-none absolute left-1/2 top-[58%] h-7 w-[5.75rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl transition-opacity duration-300 group-hover:opacity-100 ${theme.modifierGlow} ${condensed ? 'opacity-22' : 'opacity-32'}`} />
          {!condensed && (
            <div className={`relative truncate text-[8px] font-semibold tracking-[0.08em] ${theme.modifierLabel}`}>
              {getShortLabel(item.label, condensed)}
            </div>
          )}
          <div className={`relative truncate font-black leading-none ${theme.modifierValue} ${condensed ? 'text-[14px]' : 'mt-1 text-[17px]'}`}>
            {value}
          </div>
          {!condensed && (
            <div className={`relative mt-1 flex items-center justify-center text-[10px] font-semibold ${theme.modifierIcon}`}>
              <Info className="h-3.5 w-3.5" strokeWidth={2.1} />
            </div>
          )}
        </button>
      </div>
      {tooltip}
    </>
  );
}

function RailConnector({
  theme,
  condensed,
}: {
  theme: RailTheme;
  condensed: boolean;
}) {
  return (
    <div className={`flex items-center justify-center ${theme.connector}`}>
      <ChevronRight className={condensed ? 'h-[7px] w-[7px]' : 'h-3.5 w-3.5'} strokeWidth={2.4} />
    </div>
  );
}

function FormulaRail({
  lane,
  theme,
  condensed,
  isReady,
}: {
  lane: CalculationPathLane;
  theme: RailTheme;
  condensed: boolean;
  isReady: boolean;
}) {
  const items = lane.items;
  const steps = items.flatMap((item, index) => (
    index < items.length - 1
      ? [{ type: 'item' as const, item, index }, { type: 'connector' as const, index }]
      : [{ type: 'item' as const, item, index }]
  ));

  const columns = steps.map((step) => {
    if (step.type === 'connector') return condensed ? '3px' : '7px';
    if (condensed) return step.item.kind === 'modifier' ? '54px' : '60px';
    if (step.item.kind === 'modifier') return '122px';
    return '118px';
  }).join(' ');

  return (
    <div className={`mx-auto w-fit max-w-full ${condensed ? 'px-0' : 'px-1'}`}>
      <div
        className={`inline-grid min-w-0 items-center ${condensed ? 'gap-x-0.5' : 'gap-x-2'} justify-center`}
        style={{ gridTemplateColumns: columns }}
      >
        {steps.map((step) => {
          if (step.type === 'connector') {
            return <RailConnector key={`connector-${step.index}`} theme={theme} condensed={condensed} />;
          }

          if (step.item.kind === 'modifier') {
            return (
              <RailModifier
                key={`modifier-${step.index}-${step.item.label}`}
                item={step.item}
                theme={theme}
                condensed={condensed}
                isReady={isReady}
                step={step.index}
              />
            );
          }

          return (
            <RailNode
              key={`node-${step.index}-${step.item.label}`}
              item={step.item}
              condensed={condensed}
              isReady={isReady}
              step={step.index}
            />
          );
        })}
      </div>
    </div>
  );
}

function ResultChip({
  node,
  themeKey,
  isReady,
}: {
  node: CalculationPathNode;
  themeKey: 'volume' | 'labor';
  isReady: boolean;
}) {
  const theme = resultThemes[themeKey];
  const animationClass = isReady ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0';
  const value = formatDisplayValue(node.value, node.unit);

  return (
    <div
      className={`flex justify-center transition-[transform,opacity] duration-500 ease-out ${animationClass}`}
      style={getDelayStyle(isReady, 4)}
    >
      <div className="relative inline-flex w-fit max-w-full flex-col items-center px-3 py-1 text-center sm:min-w-[214px]">
        <div className={`pointer-events-none absolute left-1/2 top-1/2 h-28 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[42px] ${theme.aura}`} />
        <div className={`pointer-events-none absolute left-1/2 top-1/2 h-20 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[24px] ${theme.glow}`} />
        <div className={`text-[10px] font-bold uppercase tracking-[0.18em] ${theme.label}`}>
          {node.label}
        </div>
        <div className="mt-2 flex items-baseline justify-center gap-1.5">
          <span className={`text-[28px] font-black leading-none sm:text-[32px] ${theme.value} ${theme.valueGlow}`}>
            {value}
          </span>
          <span className={`text-[11px] font-semibold uppercase tracking-[0.12em] sm:text-[12px] ${theme.unit}`}>
            {node.unit}
          </span>
        </div>
        <div className={`mt-1 text-[10px] font-medium ${theme.caption}`}>
          Computed Result
        </div>
      </div>
    </div>
  );
}

function ResultArrow({
  themeKey,
  isReady,
}: {
  themeKey: 'volume' | 'labor';
  isReady: boolean;
}) {
  const theme = resultThemes[themeKey];
  const animationClass = isReady ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0';

  return (
    <div
      className={`mt-1 flex items-center justify-center transition-[transform,opacity] duration-500 ease-out ${animationClass}`}
      style={getDelayStyle(isReady, 4)}
    >
      <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${theme.arrowHead}`} strokeWidth={2.4} />
    </div>
  );
}

function OverrideStrip({
  modifier,
  node,
  label,
  themeVariant,
  isReady,
}: {
  modifier: CalculationPathModifier;
  node: CalculationPathNode;
  label: string;
  themeVariant: 'amber' | 'labor';
  isReady: boolean;
}) {
  const animationClass = isReady ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0';
  const theme = overrideStripThemes[themeVariant];

  return (
    <div className={`mt-4 flex flex-wrap items-center gap-2 rounded-[1rem] px-3.5 py-3 transition-[transform,opacity] duration-500 ease-out ${theme.container} ${animationClass}`}>
      <div className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${theme.labelBadge}`}>
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
        {label}
      </div>
      <div className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${theme.valueBadge}`}>
        {modifier.displayValue}
      </div>
      <div className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${theme.valueBadge}`}>
        {node.label}: {formatDisplayValue(node.value, node.unit)} {node.unit === 'cu ft' ? 'cf' : node.unit}
      </div>
    </div>
  );
}

function FactorGrid({
  cards,
}: {
  cards: FactorCard[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="rounded-[1.15rem] border border-white/7 bg-white/[0.03] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 rounded-xl bg-white/[0.04] p-2 text-slate-400">
                <Icon className="h-4 w-4" strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {card.title}
                </div>
                <div className="mt-1 text-[13px] font-bold leading-snug text-slate-100">
                  {card.value}
                </div>
                <div className="mt-1 text-[11px] font-medium leading-relaxed text-slate-400">
                  {card.caption}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FactorsPanel({
  cards,
}: {
  cards: FactorCard[];
}) {
  return (
    <section className={`${standaloneCardClass} border-white/[0.06] bg-[linear-gradient(180deg,rgba(8,16,29,0.98),rgba(4,10,20,0.98))]`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(251,146,60,0.14),transparent_24%),radial-gradient(ellipse_at_58%_72%,rgba(249,115,22,0.14),transparent_48%),radial-gradient(circle_at_82%_20%,rgba(251,191,36,0.08),transparent_18%)]" />
      <div className="relative">
        <div className="flex flex-col gap-1">
          <div className="whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.22em] text-orange-300">
            Applied Factors
          </div>
          <div className="min-w-0 truncate text-[12px] font-medium leading-none text-slate-400">
            Rules behind the estimate
          </div>
        </div>
        <div className="mt-4">
          <FactorGrid cards={cards} />
        </div>
      </div>
    </section>
  );
}

function PathLane({
  lane,
  caption,
  themeKey,
  isReady,
}: {
  lane: CalculationPathLane;
  caption: string;
  themeKey: 'volume' | 'labor';
  isReady: boolean;
}) {
  const { mainItems, overrideModifier, overrideNode } = splitLaneItems(lane.items);
  const theme = railThemes[themeKey];
  const { railItems, resultNode } = useMemo(() => splitLaneResult(mainItems), [mainItems]);
  const laneWithRailItems = useMemo(() => ({ ...lane, items: railItems }), [lane, railItems]);

  return (
    <section className={`${standaloneCardClass} ${theme.sectionBorder} ${theme.sectionSurface}`}>
      <div className={`pointer-events-none absolute inset-0 ${theme.sectionGlow}`} />
      <div className="relative">
        <RailHeader label={lane.label} caption={caption} theme={theme} />
        <div className="mt-3 hidden sm:block">
          <FormulaRail lane={laneWithRailItems} theme={theme} condensed={false} isReady={isReady} />
        </div>
        <div className="mt-2.5 sm:hidden">
          <FormulaRail lane={laneWithRailItems} theme={theme} condensed isReady={isReady} />
        </div>
        {resultNode && (
          <>
            <ResultArrow themeKey={themeKey} isReady={isReady} />
            <ResultChip
              node={resultNode}
              themeKey={themeKey}
              isReady={isReady}
            />
          </>
        )}
      </div>
      {overrideModifier && overrideNode && (
        <OverrideStrip
          modifier={overrideModifier}
          node={overrideNode}
          label={themeKey === 'volume' ? 'Manual Final' : 'Manual Labor'}
          themeVariant={themeKey === 'labor' ? 'labor' : 'amber'}
          isReady={isReady}
        />
      )}
    </section>
  );
}

function OverridesPanel({
  badges,
}: {
  badges: EstimateResult['calculationPath']['overrideBadges'];
}) {
  return (
    <section className={`${standaloneCardClass} border-white/[0.06] bg-[linear-gradient(180deg,rgba(7,14,28,0.98),rgba(3,10,20,0.98))]`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(59,130,246,0.18),transparent_22%),radial-gradient(ellipse_at_60%_70%,rgba(14,165,233,0.12),transparent_44%),radial-gradient(circle_at_86%_18%,rgba(56,189,248,0.08),transparent_18%)]" />
      <div className="relative">
        <div className="flex items-baseline gap-3">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.20em] text-sky-300">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
            Manual Overrides
          </div>
          <div className="min-w-0 truncate text-[12px] font-medium text-slate-400">
            Active manual inputs
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          {badges.map((badge) => (
            <div
              key={badge.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-slate-800/80 px-3 py-1.5 text-[11px] font-semibold text-slate-200"
            >
              <span className="text-slate-400">{badge.label}</span>
              <span>{badge.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const CalculationPathBlock = ({
  calculationPath,
}: {
  calculationPath: EstimateResult['calculationPath'];
}) => {
  const [isReady, setIsReady] = useState(false);
  const factorCards = useMemo(() => buildFactorCards(calculationPath), [calculationPath]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const frameId = window.requestAnimationFrame(() => setIsReady(true));
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="space-y-4">
      {calculationPath.overrideBadges.length > 0 && (
        <OverridesPanel badges={calculationPath.overrideBadges} />
      )}

      <PathLane
        lane={calculationPath.volume}
        caption="Inventory to truck footprint"
        themeKey="volume"
        isReady={isReady}
      />

      <PathLane
        lane={calculationPath.labor}
        caption="Crew time, access and range buffer"
        themeKey="labor"
        isReady={isReady}
      />

      <FactorsPanel cards={factorCards} />
    </div>
  );
};
