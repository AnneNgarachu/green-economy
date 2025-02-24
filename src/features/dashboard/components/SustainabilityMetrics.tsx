// src/features/dashboard/components/SustainabilityMetric.tsx
"use client";

import { MetricProps, MetricDataByTimeRange } from '@/features/dashboard/type';

const metricData: MetricDataByTimeRange = {
  "24h": {
    current: "85%",
    previous: "82%",
    change: "+3.7%",
    peak: "90%",
    average: "83%",
    target: "95%",
  },
  "7d": {
    current: "83%",
    previous: "80%",
    change: "+3.8%",
    peak: "88%",
    average: "81%",
    target: "90%",
  },
  "30d": {
    current: "82%",
    previous: "79%",
    change: "+3.8%",
    peak: "87%",
    average: "80%",
    target: "90%",
  },
};

export function SustainabilityMetrics({ timeRange, Icon, iconColor }: MetricProps) {
  const data = metricData[timeRange];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <h2 className="text-lg font-semibold text-black">Sustainability Score</h2>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
            parseFloat(data.change) > 0 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
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