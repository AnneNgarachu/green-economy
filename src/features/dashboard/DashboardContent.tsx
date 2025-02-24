"use client";

import { useState } from "react";
import {
  Zap,
  Droplets,
  Leaf,
  Target,
} from 'lucide-react';
import {
  EnergyUsage,
  WaterConsumption,
  MetricsOverview,
  CarbonFootprint,
  SustainabilityMetrics
} from './components';
import type { TimeRange, MetricDataByTimeRange } from './type';

export default function DashboardContent() {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("24h");

  // Example dynamic data for EnergyUsage
  const energyUsageData: MetricDataByTimeRange = {
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

  // Example dynamic data for WaterConsumption
  const waterConsumptionData: MetricDataByTimeRange = {
    "24h": {
      current: "2000 L",
      previous: "1945 L",
      change: "+2.8%",
      peak: "2200 L",
      average: "1950 L",
      target: "1800 L",
    },
    "7d": {
      current: "14,000 L",
      previous: "13,600 L",
      change: "+2.9%",
      peak: "15,000 L",
      average: "14,200 L",
      target: "13,000 L",
    },
    "30d": {
      current: "60,000 L",
      previous: "58,000 L",
      change: "+3.4%",
      peak: "65,000 L",
      average: "61,000 L",
      target: "55,000 L",
    },
  };

  // Example dynamic data for CarbonFootprint
  const carbonFootprintData: MetricDataByTimeRange = {
    "24h": {
      current: "25 tons",
      previous: "25.8 tons",
      change: "-3.1%",
      peak: "28 tons",
      average: "24.6 tons",
      target: "20 tons",
    },
    "7d": {
      current: "175 tons",
      previous: "180 tons",
      change: "-2.8%",
      peak: "190 tons",
      average: "178 tons",
      target: "150 tons",
    },
    "30d": {
      current: "750 tons",
      previous: "770 tons",
      change: "-2.6%",
      peak: "800 tons",
      average: "760 tons",
      target: "700 tons",
    },
  };

  // Example dynamic data for SustainabilityMetric
  const sustainabilityMetricData: MetricDataByTimeRange = {
    "24h": {
      current: "85%",
      previous: "82%",
      change: "+3.7%",
      peak: "90%",
      average: "83%",
      target: "86%",
    },
    "7d": {
      current: "88%",
      previous: "85%",
      change: "+3.5%",
      peak: "92%",
      average: "87%",
      target: "90%",
    },
    "30d": {
      current: "90%",
      previous: "88%",
      change: "+2.3%",
      peak: "95%",
      average: "91%",
      target: "93%",
    },
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Sustainability Metrics</h1>
        <select
          className="bg-white border border-gray-300 text-black rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:bg-gray-50"
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange)}
        >
          <option value="24h" className="text-black">Last 24 Hours</option>
          <option value="7d" className="text-black">Last 7 Days</option>
          <option value="30d" className="text-black">Last 30 Days</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <EnergyUsage 
            timeRange={selectedTimeRange} 
            Icon={Zap}
            iconColor="text-yellow-500"
            metricData={energyUsageData} // Pass dynamic data
          />
        </div>
        <div>
          <WaterConsumption 
            timeRange={selectedTimeRange} 
            Icon={Droplets}
            iconColor="text-blue-500"
            metricData={waterConsumptionData} // Pass dynamic data
          />
        </div>
        <div>
          <CarbonFootprint 
            timeRange={selectedTimeRange} 
            Icon={Leaf}
            iconColor="text-green-500"
            metricData={carbonFootprintData} // Pass dynamic data
          />
        </div>
        <div>
          <SustainabilityMetrics 
            timeRange={selectedTimeRange} 
            Icon={Target}
            iconColor="text-purple-500"
            metricData={sustainabilityMetricData} // Pass dynamic data
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8">
        <MetricsOverview timeRange={selectedTimeRange} />
      </div>
    </div>
  );
}