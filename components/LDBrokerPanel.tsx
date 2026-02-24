import React from 'react';
import { EstimateResult } from '@/lib/types/estimator';
import { Box, Truck, MapPin } from 'lucide-react';
import { MetricCard } from './MetricCard';

interface LDBrokerPanelProps {
    estimate: EstimateResult;
}

export const LDBrokerPanel = ({ estimate }: LDBrokerPanelProps) => {
    if (!estimate.billableCF) return null;

    return (
        <div className="p-5 mt-6 bg-blue-50/50 border border-blue-100 rounded-[2rem] shadow-inner">
            <div className="mb-4 ml-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                    Long Distance Broker Breakdown
                </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-3 rounded-2xl border border-blue-100 text-center shadow-sm">
                    <div className="text-[10px] font-bold text-gray-400 mb-1">ITEMS VOLUME</div>
                    <div className="text-lg font-black text-gray-900">{estimate.billableCF}</div>
                    <div className="text-[10px] font-semibold text-blue-600">Billable CF</div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-blue-100 text-center shadow-sm">
                    <div className="text-[10px] font-bold text-gray-400 mb-1">TRUCK LOAD</div>
                    <div className="text-lg font-black text-gray-900">~{estimate.truckSpaceCF || estimate.finalVolume}</div>
                    <div className="text-[10px] font-semibold text-gray-500">Actual Space</div>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-blue-100 text-center shadow-sm">
                    <div className="text-[10px] font-bold text-gray-400 mb-1">EST. WEIGHT</div>
                    <div className="text-lg font-black text-gray-900">{estimate.weight?.toLocaleString()}</div>
                    <div className="text-[10px] font-semibold text-gray-500">lbs</div>
                </div>
            </div>
        </div>
    );
};
