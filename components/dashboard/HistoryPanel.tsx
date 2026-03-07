import { Calendar, ClipboardList, MapPin, Package, Undo2, X } from "lucide-react";
import type { EstimateHistoryItem } from "@/lib/types/estimator";

type HistoryPanelProps = {
  historyItems: EstimateHistoryItem[];
  historyLoading: boolean;
  onClose: () => void;
  onLoadEstimate: (estimateId: string) => void;
  onMarkDelete: (estimateId: string) => void;
  onUndoLastDelete: () => void;
  pendingDeletes: Set<string>;
};

export function HistoryPanel({
  historyItems,
  historyLoading,
  onClose,
  onLoadEstimate,
  onMarkDelete,
  onUndoLastDelete,
  pendingDeletes,
}: HistoryPanelProps) {
  return (
    <div className="w-full max-w-6xl mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-gray-400" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Saved Estimates</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            {pendingDeletes.size > 0 && (
              <button
                onClick={onUndoLastDelete}
                className="hover:text-gray-900 transition-colors"
                title="Undo last delete"
                aria-label="Undo last delete"
              >
                <Undo2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="hover:text-gray-900 transition-colors" aria-label="Close history">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {historyLoading ? (
          <div className="text-center py-8 text-[11px] text-gray-400 font-semibold">Loading...</div>
        ) : historyItems.length === 0 ? (
          <div className="text-center py-8 text-[11px] text-gray-400 font-semibold">No saved estimates yet</div>
        ) : (
          <div className="flex flex-wrap gap-3 max-h-[260px] overflow-y-auto pr-1 mb-2">
            {historyItems
              .filter((item) => !pendingDeletes.has(item.id))
              .map((item) => (
                <div key={item.id} className="relative group animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => onLoadEstimate(item.id)}
                    className="text-left bg-white border-[1.5px] border-dashed border-gray-200 hover:border-gray-400 hover:bg-gray-50/50 rounded-xl px-3.5 py-3 transition-all duration-200 cursor-pointer w-full block min-h-[66px] overflow-hidden"
                  >
                    <div className="text-[11px] font-bold text-gray-800 truncate pr-5">{item.client_name}</div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-bold text-gray-600">
                      <Package className="w-3 h-3 text-gray-400" strokeWidth={2} />
                      <span className="tabular-nums">{(item.net_volume || item.final_volume)?.toLocaleString()} cf</span>
                      <span className="text-gray-300">·</span>
                      <MapPin className="w-3 h-3 text-gray-400" strokeWidth={2} />
                      <span>
                        {!item.home_size ? "" : item.home_size === "Commercial" ? "Comm." : item.home_size === "1" ? "1BR/Less" : `${item.home_size}BR`}/{item.move_type === "LD" ? "LD" : item.move_type === "Labor" ? "Labor" : "Local"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-gray-400">
                      <Calendar className="w-3 h-3" strokeWidth={2} />
                      {new Date(item.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      onMarkDelete(item.id);
                    }}
                    className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    aria-label="Delete estimate"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
