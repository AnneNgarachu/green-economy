// src/features/dashboard/components/WaterConsumption.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { MetricProps, MetricDataByTimeRange } from '@/features/dashboard/type';
import { supabase } from '@/lib/supabase/client';
import { METRICS } from '@/lib/constants';
import { TrendingDown, TrendingUp, Loader2 } from 'lucide-react';

// Define the mock data explicitly as MetricDataByTimeRange
const defaultMetricData: MetricDataByTimeRange = {
  "24h": {
    current: "2000 L",
    previous: "1945 L",
    change: "-2.8%",
    peak: "2200 L",
    average: "1950 L",
    target: "1800 L",
  },
  "7d": {
    current: "15,000 L",
    previous: "14,800 L",
    change: "+1.4%",
    peak: "16,000 L",
    average: "15,200 L",
    target: "14,000 L",
  },
  "30d": {
    current: "60,000 L",
    previous: "63,000 L",
    change: "-4.8%",
    peak: "65,000 L",
    average: "61,000 L",
    target: "58,000 L",
  },
};

export function WaterConsumption({ timeRange, Icon, iconColor, metricData = defaultMetricData }: MetricProps) {
  const [data, setData] = useState(metricData[timeRange]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buildingName, setBuildingName] = useState("All Buildings");

  useEffect(() => {
    // Reset to the provided metric data first
    setData(metricData[timeRange]);
    
    const fetchWaterData = async () => {
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

        // Try to fetch data for Talbot House
        try {
          const { data: metricsData, error: supabaseError } = await supabase
            .from('metrics')
            .select('*')
            .eq('facility', 'Talbot House')
            .eq('metric_name', METRICS.WATER) // Using constant instead of string
            .gte('reading_date', startDate)
            .lte('reading_date', endDate)
            .order('reading_date', { ascending: true });

          if (supabaseError) throw supabaseError;

          if (metricsData && metricsData.length > 0) {
            // Calculate metrics from the data
            const totalConsumption = metricsData.reduce((sum, item) => sum + item.value, 0);
            const peakConsumption = Math.max(...metricsData.map(item => item.value));
            const avgConsumption = totalConsumption / metricsData.length;
            
            // Calculate previous period for comparison
            const halfwayIndex = Math.floor(metricsData.length / 2);
            const currentPeriodData = metricsData.slice(halfwayIndex);
            const previousPeriodData = metricsData.slice(0, halfwayIndex);
            
            const currentTotal = currentPeriodData.reduce((sum, item) => sum + item.value, 0);
            const previousTotal = previousPeriodData.reduce((sum, item) => sum + item.value, 0);
            
            // Calculate percent change
            const percentChange = previousTotal !== 0 
              ? ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1)
              : "0.0";
              
            // Format the data for display
            const updatedData = {
              current: `${Math.round(totalConsumption)} L`,
              previous: `${Math.round(previousTotal)} L`,
              change: `${percentChange}%`,
              peak: `${Math.round(peakConsumption)} L`,
              average: `${Math.round(avgConsumption)} L`,
              target: metricData[timeRange].target, // Keep existing target
            };
            
            setData(updatedData);
            setBuildingName("Talbot House");
          }
        } catch (error) {
          console.error("Supabase error:", error);
          setError("Failed to fetch water data");
          // Keep using provided metric data if database query fails
        }
      } catch (err) {
        console.error('Failed to load water data:', err);
        setError("An error occurred while loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaterData();
  }, [timeRange, metricData]);

  const isPositiveChange = parseFloat(data.change) > 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <div>
            <h2 className="text-lg font-semibold text-black">Water Consumption</h2>
            <p className="text-xs text-gray-500">{buildingName}</p>
          </div>
        </div>
        {!isLoading && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              isPositiveChange 
                ? "bg-red-100 text-red-800" 
                : "bg-green-100 text-green-800"
            }`}
          >
            {isPositiveChange ? 
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