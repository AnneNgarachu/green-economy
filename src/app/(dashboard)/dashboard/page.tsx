'use client'

import React, { useState } from 'react'
import { 
  EnergyUsage, 
  WaterConsumption, 
  MetricsOverview, 
  CarbonFootprint, 
  SustainabilityMetrics 
} from '@/features/dashboard/components'
import { DashboardData, TimeRange } from '@/features/dashboard/type'
import { BarChart, Droplet, Zap, Cloud } from 'lucide-react'

// Mock data for dashboard
const dashboardData: DashboardData = {
  energyUsage: {
    "24h": {
      current: "450 kWh",
      previous: "475 kWh",
      change: "-5.2%",
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
  },
  waterConsumption: {
    "24h": {
      current: "3,200 L",
      previous: "3,500 L",
      change: "-8.6%",
      peak: "4,100 L",
      average: "3,300 L",
      target: "3,000 L",
    },
    "7d": {
      current: "22,500 L",
      previous: "24,000 L",
      change: "-6.2%",
      peak: "26,000 L",
      average: "23,100 L",
      target: "21,000 L",
    },
    "30d": {
      current: "95,000 L",
      previous: "98,500 L",
      change: "-3.6%",
      peak: "105,000 L",
      average: "96,200 L",
      target: "90,000 L",
    },
  },
  carbonFootprint: {
    "24h": {
      current: "120 kg",
      previous: "135 kg",
      change: "-11.1%",
      peak: "150 kg",
      average: "125 kg",
      target: "100 kg",
    },
    "7d": {
      current: "840 kg",
      previous: "910 kg",
      change: "-7.7%",
      peak: "950 kg",
      average: "860 kg",
      target: "800 kg",
    },
    "30d": {
      current: "3,600 kg",
      previous: "3,800 kg",
      change: "-5.3%",
      peak: "4,000 kg",
      average: "3,700 kg",
      target: "3,400 kg",
    },
  },
  sustainabilityScore: {
    "24h": {
      current: "85/100",
      previous: "80/100",
      change: "+6.3%",
      peak: "90/100",
      average: "82/100",
      target: "95/100",
    },
    "7d": {
      current: "82/100",
      previous: "78/100",
      change: "+5.1%",
      peak: "88/100",
      average: "80/100",
      target: "90/100",
    },
    "30d": {
      current: "80/100",
      previous: "75/100",
      change: "+6.7%",
      peak: "87/100",
      average: "78/100",
      target: "90/100",
    },
  }
};

const DashboardPage: React.FC = () => {
  // State for the time range filter
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  
  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-600">Monitoring your sustainability metrics</p>
        </div>
        
        {/* Time Range Filter */}
        <div className="mt-4 sm:mt-0">
          <div className="inline-flex rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <button
              type="button"
              onClick={() => setTimeRange("24h")}
              className={`px-6 py-2 text-sm font-medium ${
                timeRange === "24h" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              24 Hours
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("7d")}
              className={`px-6 py-2 text-sm font-medium border-x border-gray-200 ${
                timeRange === "7d" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange("30d")}
              className={`px-6 py-2 text-sm font-medium ${
                timeRange === "30d" 
                  ? "bg-blue-500 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>
      
      {/* Top row - 2 metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <EnergyUsage 
          timeRange={timeRange} 
          Icon={Zap} 
          iconColor="text-yellow-500"
          metricData={dashboardData.energyUsage}
        />
        
        <WaterConsumption 
          timeRange={timeRange} 
          Icon={Droplet} 
          iconColor="text-blue-500"
          metricData={dashboardData.waterConsumption}
        />
      </div>
      
      {/* Bottom row - 2 more metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <CarbonFootprint 
          timeRange={timeRange} 
          Icon={Cloud} 
          iconColor="text-gray-500"
          metricData={dashboardData.carbonFootprint}
        />
        
        <SustainabilityMetrics 
          timeRange={timeRange} 
          Icon={BarChart} 
          iconColor="text-green-500"
          metricData={dashboardData.sustainabilityScore}
        />
      </div>
      
      {/* Performance overview after all 4 cards */}
      <div>
        <MetricsOverview 
          timeRange={timeRange} 
        />
      </div>
    </div>
  );
};

export default DashboardPage;