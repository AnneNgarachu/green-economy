// src/features/dashboard/components/EnergyUsage.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { MetricProps } from '../type';
import { supabase } from '@/lib/supabase/client';
import { METRICS } from '@/lib/constants';
import { TrendingDown, TrendingUp, Loader2 } from 'lucide-react';
import { isPositiveChange } from '@/lib/utils/index'; // Fixed import path

// Define an interface for the data shape returned from Supabase
interface MetricRecord {
  id: number;
  reading_date: string;
  facility: string;
  meter_code: string;
  meter_name: string;
  metric_name: string;
  value: number;
  unit: string;
  reading_type: string;
  source_file?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

const defaultMetricData = {
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
};

export function EnergyUsage({ 
  timeRange, 
  Icon, 
  iconColor, 
  metricData = defaultMetricData,
  building = 'All Buildings'
}: MetricProps) {
  const [data, setData] = useState(metricData[timeRange]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buildingName, setBuildingName] = useState(building);

  useEffect(() => {
    // Reset to the provided metric data first
    setData(metricData[timeRange]);
    setBuildingName(building);
    
    const fetchEnergyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Calculate date ranges based on timeRange
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        let startDate;

        if (timeRange === "24h") {
          const oneDayAgo = new Date(today);
          oneDayAgo.setDate(today.getDate() - 1);
          startDate = oneDayAgo.toISOString().split('T')[0];
        } else if (timeRange === "7d") {
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          startDate = oneWeekAgo.toISOString().split('T')[0];
        } else {
          const oneMonthAgo = new Date(today);
          oneMonthAgo.setMonth(today.getMonth() - 1);
          startDate = oneMonthAgo.toISOString().split('T')[0];
        }

        // Try to fetch data for specific building
        if (building !== 'All Buildings') {
          try {
            const { data: metricsData, error: supabaseError } = await supabase
              .from('metrics')
              .select('*')
              .eq('facility', building)
              .eq('metric_name', METRICS.ELECTRICITY)
              .gte('reading_date', startDate)
              .lte('reading_date', endDate)
              .order('reading_date', { ascending: true });

            if (supabaseError) throw supabaseError;

            if (metricsData && metricsData.length > 0) {
              // Cast to our known type to ensure type safety
              const typedData = metricsData as unknown as MetricRecord[];
              
              // Calculate metrics from the data
              const totalConsumption = typedData.reduce((sum, item) => sum + item.value, 0);
              
              // Get daily values for peak calculation
              const dailyData = typedData.reduce((acc, item) => {
                const date = item.reading_date.split('T')[0];
                if (!acc[date]) acc[date] = 0;
                acc[date] += item.value;
                return acc;
              }, {} as Record<string, number>);
              
              const dailyValues = Object.values(dailyData);
              const peakConsumption = Math.max(...dailyValues);
              const avgConsumption = totalConsumption / Object.keys(dailyData).length;
              
              // Calculate previous period for comparison
              const halfwayIndex = Math.floor(typedData.length / 2);
              const currentPeriodData = typedData.slice(halfwayIndex);
              const previousPeriodData = typedData.slice(0, halfwayIndex);
              
              const currentTotal = currentPeriodData.reduce((sum, item) => sum + item.value, 0);
              const previousTotal = previousPeriodData.reduce((sum, item) => sum + item.value, 0);
              
              // Calculate percent change
              const percentChange = previousTotal !== 0 
                ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1)
                : "0.0";
                
              // Format the data for display
              const updatedData = {
                current: `${Math.round(totalConsumption)} kWh`,
                previous: `${Math.round(previousTotal)} kWh`,
                change: `${percentChange}%`,
                peak: `${Math.round(peakConsumption)} kWh`,
                average: `${Math.round(avgConsumption)} kWh`,
                target: metricData[timeRange].target, // Keep existing target
              };
              
              setData(updatedData);
            }
          } catch (error) {
            console.error("Supabase error:", error);
            // If error fetching, we'll just use the default data
          }
        }
      } catch (err) {
        console.error('Failed to load energy data:', err);
        setError("An error occurred while loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnergyData();
  }, [timeRange, metricData, building]);

  // Use the utility function to safely check if change is positive
  const positive = isPositiveChange(data.change);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <div>
            <h2 className="text-lg font-semibold text-black">Energy Usage</h2>
            <p className="text-xs text-gray-500">{buildingName}</p>
          </div>
        </div>
        {!isLoading && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              positive 
                ? "bg-red-100 text-red-800" 
                : "bg-green-100 text-green-800"
            }`}
          >
            {positive ? 
              <TrendingUp className="w-3 h-3 mr-1" /> : 
              <TrendingDown className="w-3 h-3 mr-1" />
            }
            {data.change}
          </span>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          <p>{error}</p>
          <button 
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}