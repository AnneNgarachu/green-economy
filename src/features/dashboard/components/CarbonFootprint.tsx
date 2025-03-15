// src/features/dashboard/components/CarbonFootprint.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { MetricProps } from '../type';
import { supabase } from '@/lib/supabase/client';
import { METRICS, CARBON_FACTORS } from '@/lib/constants';
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

export function CarbonFootprint({ 
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

  const carbonFactor = CARBON_FACTORS.ELECTRICITY; // kg CO2e per kWh (UK 2023)

  useEffect(() => {
    // Reset to the provided metric data and current facility
    setData(metricData[timeRange]);
    setBuildingName(building);
    
    const fetchCarbonData = async () => {
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

        // Try to fetch electricity data for carbon calculation
        if (building !== 'All Buildings') {
          try {
            const { data: metricsData, error: supabaseError } = await supabase
              .from('metrics')
              .select('*')
              .eq('facility', building)
              .eq('metric_name', METRICS.ELECTRICITY) // We calculate carbon from electricity
              .gte('reading_date', startDate)
              .lte('reading_date', endDate)
              .order('reading_date', { ascending: true });

            if (supabaseError) throw supabaseError;

            if (metricsData && metricsData.length > 0) {
              // Cast to our known type to ensure type safety
              const typedData = metricsData as unknown as MetricRecord[];
              
              // Calculate metrics from the data
              const totalConsumption = typedData.reduce((sum, item) => sum + item.value, 0);
              const totalCarbon = totalConsumption * carbonFactor / 1000; // Convert to tons
              
              const dailyData = typedData.reduce((acc, item) => {
                const date = item.reading_date.split('T')[0];
                if (!acc[date]) acc[date] = 0;
                acc[date] += item.value;
                return acc;
              }, {} as Record<string, number>);
              
              const dailyCarbonValues = Object.values(dailyData).map((val) => val * carbonFactor / 1000);
              const peakCarbon = Math.max(...dailyCarbonValues);
              const avgCarbon = totalCarbon / Object.keys(dailyData).length;
              
              // Calculate previous period for comparison
              const halfwayIndex = Math.floor(typedData.length / 2);
              const currentPeriodData = typedData.slice(halfwayIndex);
              const previousPeriodData = typedData.slice(0, halfwayIndex);
              
              const currentElectricity = currentPeriodData.reduce((sum, item) => sum + item.value, 0);
              const previousElectricity = previousPeriodData.reduce((sum, item) => sum + item.value, 0);
              const currentCarbon = currentElectricity * carbonFactor / 1000;
              const previousCarbon = previousElectricity * carbonFactor / 1000;
              
              // Calculate percent change
              const percentChange = previousCarbon !== 0 
                ? ((currentCarbon - previousCarbon) / previousCarbon * 100).toFixed(1)
                : "0.0";
                
              // Format the data for display
              const updatedData = {
                current: `${totalCarbon.toFixed(1)} tons`,
                previous: `${previousCarbon.toFixed(1)} tons`,
                change: `${percentChange.startsWith('-') ? '' : '+'}${percentChange}%`,
                peak: `${peakCarbon.toFixed(1)} tons`,
                average: `${avgCarbon.toFixed(1)} tons`,
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
        console.error('Failed to load carbon data:', err);
        setError("An error occurred while loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarbonData();
  }, [timeRange, metricData, building, carbonFactor]);

  // Use the utility function to safely check if change is positive
  const positive = isPositiveChange(data.change);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <div>
            <h2 className="text-lg font-semibold text-black">Carbon Footprint</h2>
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