// src/features/dashboard/components/SustainabilityMetrics.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { MetricProps } from '@/features/dashboard/type';
import { supabase } from '@/lib/supabase/client';
import { METRICS } from '@/lib/constants';
import { TrendingDown, TrendingUp, Loader2 } from 'lucide-react';

const defaultMetricData = {
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

export function SustainabilityMetrics({ 
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
    
    const fetchSustainabilityData = async () => {
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

        // For sustainability score, we'll combine multiple metrics
        if (building !== 'All Buildings') {
          try {
            // Get electricity usage for the building
            const { data: electricityData, error: electricityError } = await supabase
              .from('metrics')
              .select('*')
              .eq('facility', building)
              .eq('metric_name', METRICS.ELECTRICITY)
              .gte('reading_date', startDate)
              .lte('reading_date', endDate)
              .order('reading_date', { ascending: true });

            if (electricityError) throw electricityError;
            
            // Try to get targets or benchmarks (this would be stored in a different table in production)
            // For now, we'll use hardcoded targets
            const electricityTarget = 5000; // kWh per day
            
            if (electricityData && electricityData.length > 0) {
              // Calculate total consumption
              const totalConsumption = electricityData.reduce((sum, item) => sum + item.value, 0);
              
              // Calculate theoretical perfect consumption (target × days)
              const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1;
              const perfectConsumption = electricityTarget * days;
              
              // Calculate score as ratio of target to actual (capped at 100%)
              const rawScore = Math.min(1, perfectConsumption / totalConsumption);
              const scorePercentage = Math.round(rawScore * 100);
              
              // Calculate previous period for comparison
              const halfwayIndex = Math.floor(electricityData.length / 2);
              const currentPeriodData = electricityData.slice(halfwayIndex);
              const previousPeriodData = electricityData.slice(0, halfwayIndex);
              
              const currentConsumption = currentPeriodData.reduce((sum, item) => sum + item.value, 0);
              const previousConsumption = previousPeriodData.reduce((sum, item) => sum + item.value, 0);
              
              // Higher consumption means lower score, so we use the inverse for the score
              const currentScore = previousConsumption > 0 ? Math.min(1, (perfectConsumption / 2) / currentConsumption) : 0;
              const previousScore = previousConsumption > 0 ? Math.min(1, (perfectConsumption / 2) / previousConsumption) : 0;
              
              const currentScorePercentage = Math.round(currentScore * 100);
              const previousScorePercentage = Math.round(previousScore * 100);
              
              // Calculate percent change
              const percentChange = previousScorePercentage !== 0 
                ? ((currentScorePercentage - previousScorePercentage) / previousScorePercentage * 100).toFixed(1)
                : "+0.0";
                
              // Format the data for display
              const updatedData = {
                current: `${scorePercentage}%`,
                previous: `${previousScorePercentage}%`,
                change: `${percentChange}%`,
                peak: metricData[timeRange].peak, // Keep mock data for peak
                average: `${Math.round((currentScorePercentage + previousScorePercentage) / 2)}%`,
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
        console.error('Failed to load sustainability data:', err);
        setError("An error occurred while loading data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSustainabilityData();
  }, [timeRange, metricData, building]);

  const isPositiveChange = parseFloat(data.change.replace('%', '')) > 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <div>
            <h2 className="text-lg font-semibold text-black">Sustainability Score</h2>
            <p className="text-xs text-gray-500">{buildingName}</p>
          </div>
        </div>
        {!isLoading && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
              isPositiveChange 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
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