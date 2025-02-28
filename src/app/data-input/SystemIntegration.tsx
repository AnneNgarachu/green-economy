// src/app/data-input/SystemIntegration.tsx
'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
// Removed Badge import 
// import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/Card";
// Removed Select components
// import { 
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { AlertCircle, CheckCircle, Loader2, PlugZap, Settings } from "lucide-react";

interface SystemIntegrationProps {
  onDataImported?: () => void;
}

export const SystemIntegration: React.FC<SystemIntegrationProps> = ({ 
  onDataImported 
}) => {
  const [selectedSystem, setSelectedSystem] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState("connector");
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connected" | "connecting">("disconnected");
  const [mockMetadata, setMockMetadata] = useState<any>(null);
  const [apiKey, setApiKey] = useState("");
  const [endpoint, setEndpoint] = useState("");

  const systemOptions = [
    { value: "building-management", label: "Building Management System" },
    { value: "energy-monitoring", label: "Energy Monitoring System" },
    { value: "water-management", label: "Water Management System" },
    { value: "waste-tracking", label: "Waste Tracking System" }
  ];

  const mockMetricData = {
    lastUpdate: "2025-02-20T08:30:00Z",
    metrics: [
      {
        location: "Headquarters",
        type: "Energy Consumption",
        value: 1350,
        unit: "kWh",
        timestamp: "2025-02-20T08:00:00Z"
      },
      {
        location: "Data Center",
        type: "Energy Consumption",
        value: 2780,
        unit: "kWh",
        timestamp: "2025-02-20T08:00:00Z"
      },
      {
        location: "Warehouse A",
        type: "Water Usage",
        value: 420,
        unit: "m³",
        timestamp: "2025-02-20T07:30:00Z"
      }
    ]
  };

  const handleConnect = async () => {
    if (!selectedSystem) {
      setError("Please select a system to connect");
      return;
    }

    if (!apiKey || !endpoint) {
      setError("API key and endpoint URL are required");
      return;
    }

    setLoading(true);
    setConnectionStatus("connecting");
    setError(null);
    
    try {
      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demo purposes, load mock data
      setMockMetadata(mockMetricData);
      setConnectionStatus("connected");
      setSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to system");
      setConnectionStatus("disconnected");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      if (connectionStatus !== "connected" || !mockMetadata) {
        throw new Error("System not connected or no data available");
      }
      
      // Process mock data
      const metricsToImport = mockMetadata.metrics.map((metric: any) => ({
        facility: metric.location,
        metric_name: metric.type,
        value: metric.value,
        unit: metric.unit,
        reading_date: metric.timestamp.split('T')[0],
        reading_type: 'system',
        notes: `Imported from ${selectedSystem} system`
      }));
      
      // Simulate insertion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      
      if (onDataImported) onDataImported();
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to import data");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setConnectionStatus("disconnected");
    setMockMetadata(null);
    setSelectedSystem("");
    setApiKey("");
    setEndpoint("");
  };

  const handleLoadDemo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load demo data for testing
      await new Promise(resolve => setTimeout(resolve, 800));
      setMockMetadata(mockMetricData);
      setConnectionStatus("connected");
      setSelectedSystem("building-management");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load demo data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {connectionStatus === "connected" 
              ? "System connected successfully" 
              : "Data imported successfully"}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connector">
            <PlugZap className="h-4 w-4 mr-2" />
            System Connector
          </TabsTrigger>
          <TabsTrigger value="settings" disabled={connectionStatus !== "connected"}>
            <Settings className="h-4 w-4 mr-2" />
            Connection Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connector" className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Connect to External System</h3>
            
            <div 
              className={
                connectionStatus === "connected" ? "bg-green-100 text-green-800 px-2 py-1 rounded text-sm" : 
                connectionStatus === "connecting" ? "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm" : 
                "bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
              }
            >
              {connectionStatus === "connected" ? "Connected" : 
               connectionStatus === "connecting" ? "Connecting..." : 
               "Disconnected"}
            </div>
          </div>

          {connectionStatus === "disconnected" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system">System Type</Label>
                <select
                  id="system"
                  className="w-full p-2 border rounded-md"
                  value={selectedSystem}
                  onChange={(e) => setSelectedSystem(e.target.value)}
                >
                  <option value="">Select system type</option>
                  {systemOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endpoint">API Endpoint</Label>
                <Input
                  id="endpoint"
                  type="text"
                  placeholder="https://api.example.com/v1"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={handleConnect} 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleLoadDemo}
                  disabled={loading}
                >
                  Load Demo System
                </Button>
              </div>
            </div>
          )}

          {connectionStatus === "connected" && mockMetadata && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Connected System</h4>
                      <p className="text-sm text-gray-500">
                        {systemOptions.find(opt => opt.value === selectedSystem)?.label}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Available Metrics:</span>
                      <span className="font-medium">{mockMetadata?.metrics.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Last Update:</span>
                      <span className="font-medium">
                        {mockMetadata?.lastUpdate || "Unknown"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h4 className="font-medium">Sample Data</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockMetadata?.metrics.map((metric: any, idx: number) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">{metric.location}</td>
                          <td className="px-3 py-2">{metric.type}</td>
                          <td className="px-3 py-2">{metric.value}</td>
                          <td className="px-3 py-2">{metric.unit}</td>
                          <td className="px-3 py-2">{metric.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Button 
                onClick={handleImport} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  "Import Data"
                )}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 pt-4">
          <h3 className="text-lg font-medium">Connection Settings</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refresh-interval">Data Refresh Interval</Label>
              <select 
                id="refresh-interval"
                className="w-full p-2 border rounded-md"
                defaultValue="daily"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="metrics-to-import">Metrics to Import</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="energy" defaultChecked />
                  <label htmlFor="energy">Energy</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="water" defaultChecked />
                  <label htmlFor="water">Water</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="waste" defaultChecked />
                  <label htmlFor="waste">Waste</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="carbon" defaultChecked />
                  <label htmlFor="carbon">Carbon</label>
                </div>
              </div>
            </div>
            
            <Button className="w-full">
              Save Settings
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};