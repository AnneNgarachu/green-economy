// src/features/dashboard/components/MetricsOverview.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import { BarChart, Loader2 } from 'lucide-react';
import { MetricsOverviewProps } from '@/features/dashboard/type';
import { supabase } from '@/lib/supabase/client';
import { METRICS } from '@/lib/constants';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: '#000000'
      }
    },
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: '#000000'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#000000',
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      text: 'Performance Trends',
      color: '#000000',
      font: {
        size: 16
      },
      padding: 20
    }
  }
};

export function MetricsOverview({ timeRange, className = '', building = 'All Buildings' }: MetricsOverviewProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock chart data for fallback
  const getMockChartData = (timeRange: string) => {
    switch (timeRange) {
      case '7d':
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Energy Usage (kWh)",
              data: [3200, 3100, 3300, 3250, 3400, 3150, 3000],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              tension: 0.4
            },
            {
              label: "Water Usage (L)",
              data: [15000, 14800, 15200, 15100, 14900, 15300, 15000],
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderWidth: 2,
              tension: 0.4
            }
          ]
        };
      case '30d':
        return {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Energy Usage (kWh)",
              data: [13000, 12800, 13200, 13000],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              tension: 0.4
            },
            {
              label: "Water Usage (L)",
              data: [60000, 61000, 59000, 60000],
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderWidth: 2,
              tension: 0.4
            }
          ]
        };
      default: // 24h
        return {
          labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
          datasets: [
            {
              label: "Energy Usage (kWh)",
              data: [450, 400, 420, 410, 430, 400],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              tension: 0.4
            },
            {
              label: "Water Usage (L)",
              data: [2000, 1800, 1900, 1950, 1820, 1800],
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderWidth: 2,
              tension: 0.4
            }
          ]
        };
    }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Calculate date ranges based on timeRange
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        let startDate;
        let labels: string[] = [];

        if (timeRange === "24h") {
          const oneDayAgo = new Date(today);
          oneDayAgo.setDate(today.getDate() - 1);
          startDate = oneDayAgo.toISOString().split('T')[0];
          labels = ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"];
        } else if (timeRange === "7d") {
          const oneWeekAgo = new Date(today);
          oneWeekAgo.setDate(today.getDate() - 7);
          startDate = oneWeekAgo.toISOString().split('T')[0];
          
          // Generate day labels for 7 days
          labels = Array.from({ length: 7 }, (_, i) => {
            const date = new Date(today);
            date.setDate(date.getDate() - 6 + i);
            return date.toLocaleDateString('en-US', { weekday: 'short' });
          });
        } else { // 30d
          const oneMonthAgo = new Date(today);
          oneMonthAgo.setMonth(today.getMonth() - 1);
          startDate = oneMonthAgo.toISOString().split('T')[0];
          
          // For 30 days, use weeks
          labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
        }

        // Try to fetch data from Supabase
        try {
          // Get electricity data
          const { data: electricityData, error: electricityError } = await supabase
            .from('metrics')
            .select('*')
            .eq(building !== 'All Buildings' ? 'facility' : 'metric_name', building !== 'All Buildings' ? building : METRICS.ELECTRICITY)
            .eq('metric_name', METRICS.ELECTRICITY)
            .gte('reading_date', startDate)
            .lte('reading_date', endDate)
            .order('reading_date', { ascending: true });

          if (electricityError) throw electricityError;
          
          // Get water data
          const { data: waterData, error: waterError } = await supabase
            .from('metrics')
            .select('*')
            .eq(building !== 'All Buildings' ? 'facility' : 'metric_name', building !== 'All Buildings' ? building : METRICS.WATER)
            .eq('metric_name', METRICS.WATER)
            .gte('reading_date', startDate)
            .lte('reading_date', endDate)
            .order('reading_date', { ascending: true });

          if (waterError) throw waterError;
          
          // Process the data for chart display
          if ((electricityData && electricityData.length > 0) || 
              (waterData && waterData.length > 0)) {
            
            // Process electricity data
            let electricityValues: number[] = Array(labels.length).fill(0);
            
            if (electricityData && electricityData.length > 0) {
              if (timeRange === "24h") {
                // Group hourly
                const hourlyData: Record<string, number> = {};
                electricityData.forEach(item => {
                  const date = new Date(item.reading_date);
                  const hour = Math.floor(date.getHours() / 3) * 3; // Group by 3 hours
                  const key = `${hour}`;
                  
                  if (!hourlyData[key]) hourlyData[key] = 0;
                  hourlyData[key] += item.value;
                });
                
                // Map to the labels
                electricityValues = labels.map((label, index) => {
                  const hour = label.includes('AM') 
                    ? parseInt(label.replace('AM', '')) % 12
                    : ((parseInt(label.replace('PM', '')) % 12) + 12);
                  
                  const key = `${Math.floor(hour / 3) * 3}`;
                  return hourlyData[key] || 0;
                });
              } else if (timeRange === "7d") {
                // Group by day
                const dailyData: Record<string, number> = {};
                electricityData.forEach(item => {
                  const date = new Date(item.reading_date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  if (!dailyData[dayName]) dailyData[dayName] = 0;
                  dailyData[dayName] += item.value;
                });
                
                // Map to the labels
                electricityValues = labels.map(day => dailyData[day] || 0);
              } else { // 30d
                // Split into 4 weeks
                const weeklyData: number[] = [0, 0, 0, 0];
                electricityData.forEach(item => {
                  const date = new Date(item.reading_date);
                  const today = new Date();
                  const dayDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                  
                  if (dayDiff < 7) weeklyData[3] += item.value;
                  else if (dayDiff < 14) weeklyData[2] += item.value;
                  else if (dayDiff < 21) weeklyData[1] += item.value;
                  else if (dayDiff < 30) weeklyData[0] += item.value;
                });
                
                electricityValues = weeklyData;
              }
            }
            
            // Process water data in a similar way
            let waterValues: number[] = Array(labels.length).fill(0);
            
            if (waterData && waterData.length > 0) {
              if (timeRange === "24h") {
                // Group hourly
                const hourlyData: Record<string, number> = {};
                waterData.forEach(item => {
                  const date = new Date(item.reading_date);
                  const hour = Math.floor(date.getHours() / 3) * 3; // Group by 3 hours
                  const key = `${hour}`;
                  
                  if (!hourlyData[key]) hourlyData[key] = 0;
                  hourlyData[key] += item.value;
                });// Map to the labels
                waterValues = labels.map((label, index) => {
                  const hour = label.includes('AM') 
                    ? parseInt(label.replace('AM', '')) % 12
                    : ((parseInt(label.replace('PM', '')) % 12) + 12);
                  
                  const key = `${Math.floor(hour / 3) * 3}`;
                  return hourlyData[key] || 0;
                });
              } else if (timeRange === "7d") {
                // Group by day
                const dailyData: Record<string, number> = {};
                waterData.forEach(item => {
                  const date = new Date(item.reading_date);
                  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                  
                  if (!dailyData[dayName]) dailyData[dayName] = 0;
                  dailyData[dayName] += item.value;
                });
                
                // Map to the labels
                waterValues = labels.map(day => dailyData[day] || 0);
              } else { // 30d
                // Split into 4 weeks
                const weeklyData: number[] = [0, 0, 0, 0];
                waterData.forEach(item => {
                  const date = new Date(item.reading_date);
                  const today = new Date();
                  const dayDiff = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                  
                  if (dayDiff < 7) weeklyData[3] += item.value;
                  else if (dayDiff < 14) weeklyData[2] += item.value;
                  else if (dayDiff < 21) weeklyData[1] += item.value;
                  else if (dayDiff < 30) weeklyData[0] += item.value;
                });
                
                waterValues = weeklyData;
              }
            }
            
            // Create chart data
            const chartData = {
              labels,
              datasets: [
                {
                  label: "Energy Usage (kWh)",
                  data: electricityValues.length > 0 ? electricityValues : [0],
                  borderColor: "rgb(75, 192, 192)",
                  backgroundColor: "rgba(75, 192, 192, 0.2)",
                  borderWidth: 2,
                  tension: 0.4
                },
                {
                  label: "Water Usage (L)",
                  data: waterValues.length > 0 ? waterValues : [0],
                  borderColor: "rgb(54, 162, 235)",
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  borderWidth: 2,
                  tension: 0.4
                }
              ]
            };
            
            setChartData(chartData);
          } else {
            // If no data found, use mock data
            setChartData(getMockChartData(timeRange));
          }
        } catch (error) {
          console.error("Supabase error:", error);
          setError("Failed to fetch chart data");
          // Fallback to mock data
          setChartData(getMockChartData(timeRange));
        }
      } catch (err) {
        console.error('Failed to load metrics data:', err);
        setError("An error occurred while loading data");
        // Fallback to mock data
        setChartData(getMockChartData(timeRange));
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [timeRange, building]);

  // If no chart data yet, show loading or use mock data
  if (!chartData && !isLoading) {
    setChartData(getMockChartData(timeRange));
  }

  return (
    <div className={`mt-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <BarChart className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-black">Performance Overview</h2>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-red-500 p-6 bg-red-50 rounded-md">
              <p>{error}</p>
              <button 
                className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        ) : chartData ? (
          <div className="h-[400px] w-full">
            <Line options={chartOptions} data={chartData} />
          </div>
        ) : null}
      </div>
    </div>
  );
}