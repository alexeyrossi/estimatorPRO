import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { MAX_EXTRA_STOPS } from '@/lib/estimatePolicy';
import { EstimateInputs, ExtraStop } from '@/lib/types/estimator';
import { AccessSegmented } from './AccessSegmented';
import { InputLabel } from './InputLabel';

interface ExtraStopsBlockProps {
    inputs: EstimateInputs;
    setInputs: React.Dispatch<React.SetStateAction<EstimateInputs>>;
}

export const ExtraStopsBlock = ({ inputs, setInputs }: ExtraStopsBlockProps) => {
    if (inputs.moveType === "Labor") return null;

    const extraStops = inputs.extraStops || [];

    const handleAdd = () => {
        if (extraStops.length < MAX_EXTRA_STOPS) {
            setInputs((prev) => ({
                ...prev,
                extraStops: [...(prev.extraStops || []), { access: "ground", label: "" }]
            }));
        }
    };

    const handleRemove = (index: number) => {
        setInputs((prev) => {
            const stops = [...(prev.extraStops || [])];
            stops.splice(index, 1);
            return { ...prev, extraStops: stops };
        });
    };

    const updateStop = (index: number, partial: Partial<ExtraStop>) => {
        setInputs((prev) => {
            const stops = [...(prev.extraStops || [])];
            stops[index] = { ...stops[index], ...partial };
            return { ...prev, extraStops: stops };
        });
    };

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
                <InputLabel label="Extra Stops" />
            </div>

            {extraStops.map((stop, i) => (
                <div key={i} className="p-4 bg-gray-50 border border-gray-200/60 rounded-2xl flex flex-col gap-3 relative">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200 font-bold uppercase tracking-widest">
                            STOP {i + 1}
                        </span>
                        <button
                            onClick={() => handleRemove(i)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Delete stop"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <input
                        type="text"
                        maxLength={30}
                        placeholder="Label (e.g. Storage unit)"
                        value={stop.label}
                        onChange={(e) => updateStop(i, { label: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-base font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
                    />

                    <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-[150px]">
                            <AccessSegmented
                                value={stop.access}
                                onChange={(access) => updateStop(i, { access })}
                            />
                        </div>
                    </div>
                </div>
            ))}

            {extraStops.length < MAX_EXTRA_STOPS && (
                <button
                    onClick={handleAdd}
                    className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl text-[11px] font-bold text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                >
                    <Plus className="w-4 h-4" /> ADD EXTRA STOP
                </button>
            )}
        </div>
    );
};
