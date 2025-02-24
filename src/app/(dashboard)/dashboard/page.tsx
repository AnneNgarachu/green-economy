'use client'

import React from 'react'
import { EnergyUsage, WaterConsumption, MetricsOverview, CarbonFootprint, SustainabilityMetrics } from '@/features/dashboard/components'
import { DashboardData } from '@/features/dashboard/type'
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
  },
  charts: []
};

const DashboardPage: React.FC = () => {
  const timeRange = "30d"; // Default time range
  
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <p className="text-gray-600">Monitoring your sustainability metrics</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        
        <CarbonFootprint 
          timeRange={timeRange} 
          Icon={Cloud} 
          iconColor="text-gray-500"
          metricData={dashboardData.carbonFootprint}
        />
        
        <MetricsOverview 
          timeRange={timeRange} 
          data={{
            energy: dashboardData.energyUsage,
            water: dashboardData.waterConsumption,
            carbon: dashboardData.carbonFootprint,
            sustainability: dashboardData.sustainabilityScore
          }}
        />
        
        <SustainabilityMetrics 
          timeRange={timeRange} 
          Icon={BarChart} 
          iconColor="text-green-500"
          metricData={dashboardData.sustainabilityScore}
        />
      </div>
    </div>
  );
};

export default DashboardPage;