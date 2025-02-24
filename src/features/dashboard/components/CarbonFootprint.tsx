// src/features/dashboard/components/CarbonFootprint.tsx
"use client";

import { MetricProps, MetricDataByTimeRange } from '@/features/dashboard/type';

const metricData: MetricDataByTimeRange = {
  "24h": {
    current: "25 tons",
    previous: "25.8 tons",
    change: "-3.1%",
    peak: "28 tons",
    average: "24.5 tons",
    target: "20 tons",
  },
  "7d": {
    current: "180 tons",
    previous: "185 tons",
    change: "-2.7%",
    peak: "200 tons",
    average: "190 tons",
    target: "170 tons",
  },
  "30d": {
    current: "750 tons",
    previous: "780 tons",
    change: "-3.8%",
    peak: "800 tons",
    average: "760 tons",
    target: "700 tons",
  },
};

export function CarbonFootprint({ timeRange, Icon, iconColor }: MetricProps) {
  const data = metricData[timeRange];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <h2 className="text-lg font-semibold text-black">Carbon Footprint</h2>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
            parseFloat(data.change) > 0 
              ? "bg-red-100 text-red-800" 
              : "bg-green-100 text-green-800"
          }`}
        >
          {data.change}
        </span>
      </div>
      <div className="mb-6">
        <p className="text-3xl font-bold text-black">{data.current}</p>
        <p className="text-sm text-black mt-1">Previous: {data.previous}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs font-medium text-black mb-1">Peak</p>
          <p className="text-sm font-semibold text-black">{data.peak}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs font-medium text-black mb-1">Average</p>
          <p className="text-sm font-semibold text-black">{data.average}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs font-medium text-black mb-1">Target</p>
          <p className="text-sm font-semibold text-black">{data.target}</p>
        </div>
      </div>
    </div>
  );
}