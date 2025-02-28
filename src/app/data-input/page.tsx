// src/app/data-input/page.tsx
'use client'

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// Import components from the same directory
import { ManualInput } from "./ManualInput";
import { FileUpload } from "./FileUpload";
import { SystemIntegration } from "./SystemIntegration";
import { RecentEntries } from "./RecentEntries";

// Define types directly to avoid external dependencies
type Metric = {
  name: string;
  units: string[];
};

type MetricEntry = {
  id: string;
  facility: string;
  metric_name: string;
  value: number;
  unit: string;
  reading_date: string;
  reading_type: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
};

export default function DataInputPage() {
  const [recentEntries, setRecentEntries] = useState<MetricEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("manual");

  const facilities = [
    "Headquarters", "Manufacturing Plant", "Warehouse A", 
    "Data Center", "Research Lab A", "Retail Store", 
    "Distribution Center", "Office A", "Testing Facility"
  ];

  const metrics: Metric[] = [
    { name: "Energy Consumption", units: ["kWh", "MWh"] },
    { name: "Water Usage", units: ["L", "m³"] },
    { name: "Waste Generated", units: ["kg", "tons"] },
    { name: "Carbon Emissions", units: ["kgCO2", "tonsCO2"] }
  ];

  // Sample data for demonstration
  const mockEntries: MetricEntry[] = [
    {
      id: "1",
      facility: "Headquarters",
      metric_name: "Energy Consumption",
      value: 1250,
      unit: "kWh",
      reading_date: "2025-02-20",
      reading_type: "manual",
      notes: "Regular monthly reading",
      created_at: "2025-02-20T10:30:00Z"
    },
    {
      id: "2",
      facility: "Data Center",
      metric_name: "Water Usage",
      value: 350,
      unit: "m³",
      reading_date: "2025-02-19",
      reading_type: "automatic",
      created_at: "2025-02-19T14:15:00Z"
    },
    {
      id: "3",
      facility: "Warehouse A",
      metric_name: "Waste Generated",
      value: 450,
      unit: "kg",
      reading_date: "2025-02-18",
      reading_type: "imported",
      created_at: "2025-02-18T09:45:00Z"
    }
  ];

  useEffect(() => {
    // Load data whenever lastUpdated changes
    fetchRecentEntries();
  }, [lastUpdated]);

  const fetchRecentEntries = async () => {
    setLoading(true);
    try {
      console.log("Fetching recent entries...");
      
      // Try to fetch from Supabase
      try {
        const { data, error } = await supabase
          .from('metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log("Fetched data from Supabase:", data);
          setRecentEntries(data);
        } else {
          console.log("No data from Supabase, using mock data");
          // Use mock data if no entries from Supabase
          setRecentEntries(mockEntries);
        }
      } catch (supabaseError) {
        console.error("Error fetching from Supabase, using mock data instead:", supabaseError);
        // Fallback to mock data if Supabase fails
        setRecentEntries(mockEntries);
      }
    } catch (error) {
      console.error("Error in fetchRecentEntries:", error);
      // Still set mock data as fallback
      setRecentEntries(mockEntries);
    } finally {
      setLoading(false);
    }
  };

  // This function will be called after any successful data entry
  const handleDataChanged = () => {
    console.log("Data changed, refreshing entries...");
    setLastUpdated(new Date()); // This will trigger the useEffect to reload data
  };
  
  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Get tab styles based on active state
  const getTabStyle = (tabName: string) => {
    if (tabName === activeTab) {
      switch (tabName) {
        case 'manual':
          return 'bg-blue-500 text-white';
        case 'file':
          return 'bg-green-500 text-white';
        case 'system':
          return 'bg-purple-500 text-white';
        default:
          return '';
      }
    }
    return '';
  };

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle>Record New Metrics</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="manual" onValueChange={handleTabChange}>
            <TabsList className="w-full rounded-none border-b border-gray-200 p-0 h-12">
              <TabsTrigger 
                value="manual" 
                className={`flex-1 rounded-none border-r border-gray-200 h-full transition-colors ${getTabStyle('manual')}`}
              >
                Manual Input
              </TabsTrigger>
              <TabsTrigger 
                value="file" 
                className={`flex-1 rounded-none border-r border-gray-200 h-full transition-colors ${getTabStyle('file')}`}
              >
                File Upload
              </TabsTrigger>
              <TabsTrigger 
                value="system" 
                className={`flex-1 rounded-none h-full transition-colors ${getTabStyle('system')}`}
              >
                System Integration
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6">
              <TabsContent value="manual" className="mt-0">
                <ManualInput 
                  facilities={facilities} 
                  metrics={metrics} 
                  onSuccess={handleDataChanged}
                />
              </TabsContent>
              
              <TabsContent value="file" className="mt-0">
                <FileUpload onUploadComplete={handleDataChanged} />
              </TabsContent>
              
              <TabsContent value="system" className="mt-0">
                <SystemIntegration onDataImported={handleDataChanged} />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b border-gray-200">
          <CardTitle>Recent Entries</CardTitle>
          {!loading && (
            <button 
              onClick={handleDataChanged} 
              className="text-sm text-gray-500 flex items-center hover:text-gray-700"
            >
              <Loader2 className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <RecentEntries 
              entries={recentEntries}
              onRefresh={handleDataChanged}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}