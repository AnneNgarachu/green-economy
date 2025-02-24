// src/features/dashboard/components/EnergyUsage.tsx
"use client";

import { MetricProps, MetricDataByTimeRange } from '@/features/dashboard/type';

const metricData: MetricDataByTimeRange = {
  "24h": {
    current: "450 kWh",
    previous: "475 kWh",
    change: "+5.2%",
    peak: "525 kWh",
    average: "445 kWh",
    target: "400 kWh",
  },
  "7d": {
    current: "3,200 kWh",
    previous: "3,500 kWh",
    change: "-8.6%",
    peak: "4,000 kWh",
    average: "3,300 kWh",
    target: "3,000 kWh",
  },
  "30d": {
    current: "13,000 kWh",
    previous: "13,500 kWh",
    change: "-3.7%",
    peak: "15,000 kWh",
    average: "13,200 kWh",
    target: "12,500 kWh",
  },
};

export function EnergyUsage({ timeRange, Icon, iconColor }: MetricProps) {
  const data = metricData[timeRange];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <h2 className="text-lg font-semibold text-black">Energy Usage</h2>
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