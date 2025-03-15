// src/features/dashboard/components/CarbonFootprintChart.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { FACILITIES, METRICS } from '@/lib/constants';

// Carbon emission factor for UK electricity (kg CO2e per kWh)
// Source: UK Government GHG Conversion Factors 2023
const UK_ELECTRICITY_CARBON_FACTOR = 0.21233;

// Cost per kWh (£) - average UK business rate
const ELECTRICITY_COST_PER_KWH = 0.21;

interface CarbonFootprintChartProps {
  facility?: string;
  timeRange?: '24h' | '7d' | '30d' | 'custom';
  startDate?: string;
  endDate?: string;
}

export default function CarbonFootprintChart({
  facility = FACILITIES.TALBOT_HOUSE,
  timeRange = '7d',
  startDate,
  endDate
}: CarbonFootprintChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'carbon' | 'cost' | 'combined'>('carbon');
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      
      try {
        // Calculate date range
        let start = startDate;
        let end = endDate || new Date().toISOString().split('T')[0];
        
        if (!start) {
          const now = new Date();
          if (timeRange === '24h') {
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            start = yesterday.toISOString().split('T')[0];
          } else if (timeRange === '7d') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            start = weekAgo.toISOString().split('T')[0];
          } else if (timeRange === '30d') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            start = monthAgo.toISOString().split('T')[0];
          }
        }
        
        // Fetch electricity consumption data
        const { data: metricsData, error: metricsError } = await supabase
          .from('metrics')
          .select('*')
          .eq('facility', facility)
          .eq('metric_name', METRICS.ELECTRICITY)
          .gte('reading_date', start)
          .lte('reading_date', end)
          .order('reading_date', { ascending: true });
          
        if (metricsError) {
          throw new Error(metricsError.message);
        }
        
        if (!metricsData || metricsData.length === 0) {
          setData([]);
          setIsLoading(false);
          return;
        }
        
        // Process data to calculate carbon footprint and cost
        const processedData = metricsData.map(record => {
          const consumption = record.value;
          const carbonEmission = consumption * UK_ELECTRICITY_CARBON_FACTOR;
          const cost = consumption * ELECTRICITY_COST_PER_KWH;
          
          return {
            date: record.reading_date,
            consumption: Number(consumption.toFixed(2)),
            carbon: Number(carbonEmission.toFixed(2)),
            cost: Number(cost.toFixed(2))
          };
        });
        
        setData(processedData);
      } catch (err: any) {
        console.error('Error fetching carbon data:', err);
        setError(err.message || 'Failed to load carbon footprint data');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [facility, timeRange, startDate, endDate]);
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carbon Footprint & Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-sm text-gray-500">Loading data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carbon Footprint & Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carbon Footprint & Cost Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">No data available for the selected time range.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Refresh</Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate totals
  const totalConsumption = data.reduce((sum, item) => sum + item.consumption, 0);
  const totalCarbon = data.reduce((sum, item) => sum + item.carbon, 0);
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Carbon Footprint & Cost Analysis</span>
          <div className="text-sm font-normal text-gray-600">
            {facility} | {timeRange === 'custom' ? `${startDate} to ${endDate}` : `Last ${timeRange}`}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-xs text-blue-700 uppercase font-medium">Total Consumption</div>
            <div className="text-2xl font-bold">{totalConsumption.toFixed(2)} kWh</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-xs text-green-700 uppercase font-medium">Carbon Footprint</div>
            <div className="text-2xl font-bold">{totalCarbon.toFixed(2)} kg CO₂e</div>
          </div>
          <div className="bg-amber-50 p-4 rounded">
            <div className="text-xs text-amber-700 uppercase font-medium">Electricity Cost</div>
            <div className="text-2xl font-bold">£{totalCost.toFixed(2)}</div>
          </div>
        </div>
        
        <Tabs defaultValue="carbon" onValueChange={(value) => setView(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="carbon">Carbon Emissions</TabsTrigger>
            <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
            <TabsTrigger value="combined">Combined View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="carbon">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} kg CO₂e`, 'Carbon']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="carbon" 
                    name="Carbon Emissions" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Carbon emissions calculated using the UK conversion factor of {UK_ELECTRICITY_CARBON_FACTOR} kg CO₂e per kWh.
            </div>
          </TabsContent>
          
          <TabsContent value="cost">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`£${value}`, 'Cost']} />
                  <Legend />
                  <Bar 
                    dataKey="cost" 
                    name="Electricity Cost" 
                    fill="#F59E0B" 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Cost calculated using average UK business electricity rate of £{ELECTRICITY_COST_PER_KWH} per kWh.
            </div>
          </TabsContent>
          
          <TabsContent value="combined">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    name="Consumption (kWh)" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    yAxisId="left"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="carbon" 
                    name="Carbon (kg CO₂e)" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    yAxisId="left"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cost" 
                    name="Cost (£)" 
                    stroke="#F59E0B" 
                    strokeWidth={2}
                    yAxisId="right"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}