'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { 
  Upload, 
  Loader2, 
  File, 
  CheckCircle,
  AlertCircle,
  LogIn
} from "lucide-react";
import * as XLSX from 'xlsx';
import { useAuth } from "@/hooks/useAuth"; // Import the hook we just created

interface FileUploadProps {
  onUploadComplete?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadComplete 
}) => {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // Use the auth hook with correct property names
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("csv");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "map" | "preview">("upload");
  const [mappings, setMappings] = useState<{[key: string]: string}>({});
  const [preview, setPreview] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [facility, setFacility] = useState<string>("Talbot House");
  const [metricName, setMetricName] = useState<string>("electricity_usage");

  const availableFields = ["facility", "metric_name", "value", "unit", "reading_date", "reading_type", "notes", "meter_code", "meter_name"];
  const requiredFields = ["facility", "metric_name", "value", "unit", "reading_date", "meter_name"];

  // Description for each field to help users understand mapping
  const fieldDescriptions: {[key: string]: string} = {
    facility: "Building or location name",
    metric_name: "Type of utility (e.g., electricity, water, gas)",
    value: "The actual measurement value",
    unit: "Unit of measurement (e.g., kWh, m³)",
    reading_date: "Date when the reading was taken",
    reading_type: "How the reading was collected (e.g., manual, automatic)",
    notes: "Additional information about the reading",
    meter_code: "Unique identifier for the meter",
    meter_name: "Human-readable name of the meter"
  };

  // Enhanced date format handling
  const formatDate = (dateValue: any): string => {
    // Handle Excel date serial numbers
    if (typeof dateValue === 'number' && dateValue > 30000) {
      // Convert Excel date serial to JavaScript date
      const date = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
      // Skip time-only values
      if (dateValue.includes(':') && !dateValue.includes('-') && !dateValue.includes('/')) {
        // It's just a time, we'll handle this differently
        return '';
      }
      
      // Try standard date parsing
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().split('T')[0];
      }
      
      // Handle common formats manually
      if (dateValue.match(/^\d{8}$/)) {
        // YYYYMMDD
        return `${dateValue.substring(0, 4)}-${dateValue.substring(4, 6)}-${dateValue.substring(6, 8)}`;
      }
      
      if (dateValue.includes('/')) {
        // MM/DD/YYYY or DD/MM/YYYY
        const parts = dateValue.split('/');
        if (parts.length === 3) {
          // Check for American format (MM/DD/YYYY)
          if (parseInt(parts[0]) <= 12) {
            const month = parts[0].padStart(2, '0');
            const day = parts[1].padStart(2, '0');
            const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
            return `${year}-${month}-${day}`;
          } else {
            // Assume European format (DD/MM/YYYY)
            const day = parts[0].padStart(2, '0');
            const month = parts[1].padStart(2, '0');
            const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
            return `${year}-${month}-${day}`;
          }
        }
      }
    }
    
    // Default to today's date if we couldn't parse
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      
      // Auto-detect file type from extension
      if (selectedFile.name.endsWith('.csv')) {
        setFileType('csv');
      } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        setFileType('excel');
      }
    }
  };

  const parseFile = async () => {
    // Check authentication first
    if (!user && !isLoading) {
      setError("You must be logged in to upload files. Please log in.");
      return;
    }
    
    if (!file) return;
    setLoading(true);
    setError(null);
    
    try {
      if (fileType === 'excel') {
        // Read the Excel file
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          throw new Error("Excel file is empty or has no data");
        }
        
        // Get column headers
        const headers = Object.keys(jsonData[0] || {});
        
        // Auto-map columns with improved intelligence
        const initialMappings: {[key: string]: string} = {};
        
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase();
          
          // More comprehensive patterns for matching
          if (lowerHeader.includes('facility') || lowerHeader.includes('location') || 
              lowerHeader.includes('building') || lowerHeader.includes('site')) {
            initialMappings[header] = 'facility';
          } 
          else if (lowerHeader.includes('metric') || lowerHeader.includes('type') || 
                   lowerHeader.includes('utility') || lowerHeader.includes('category')) {
            initialMappings[header] = 'metric_name';
          } 
          else if (lowerHeader.includes('value') || lowerHeader.includes('reading') || 
                   lowerHeader.includes('consumption') || lowerHeader.includes('usage') ||
                   lowerHeader.includes('kwh') || lowerHeader.includes('amount')) {
            initialMappings[header] = 'value';
          } 
          else if (lowerHeader.includes('unit') || lowerHeader.includes('measure')) {
            initialMappings[header] = 'unit';
          } 
          else if (lowerHeader === 'date' || lowerHeader.includes('date') || 
                  (lowerHeader.includes('date') && !lowerHeader.includes('time'))) {
            initialMappings[header] = 'reading_date';
          } 
          else if (lowerHeader.includes('meter code') || lowerHeader.includes('meter id') || 
                   lowerHeader.includes('meter_code')) {
            initialMappings[header] = 'meter_code';
          }
          else if (lowerHeader.includes('meter name') || lowerHeader.includes('meter description') || 
                   lowerHeader.includes('meter_name')) {
            initialMappings[header] = 'meter_name';
          }
          else if (lowerHeader.includes('note') || lowerHeader.includes('comment') || 
                   lowerHeader.includes('description')) {
            initialMappings[header] = 'notes';
          }
          else if (lowerHeader.includes('method') || 
                  (lowerHeader.includes('type') && !lowerHeader.includes('metric'))) {
            initialMappings[header] = 'reading_type';
          }
          // Don't map time-only columns to reading_date
          else if (lowerHeader === 'time' || (lowerHeader.includes('time') && !lowerHeader.includes('date'))) {
            // Leave it unmapped by default
          }
        });
        
        setColumns(headers);
        setMappings(initialMappings);
        setPreview(jsonData.slice(0, 10)); // Show first 10 rows
        setStep("map");
      } else {
        // CSV parsing logic would go here
        // For now, just show a mock for CSV files
        
        // Mock some data for demo (in a real app, you'd use Papa.parse)
        const mockColumns = ['Location', 'Metric Type', 'Reading Value', 'Unit', 'Date'];
        const mockData = [
          {
            'Location': 'Headquarters',
            'Metric Type': 'Energy Consumption',
            'Reading Value': '1240',
            'Unit': 'kWh',
            'Date': '2025-02-15'
          },
          {
            'Location': 'Data Center',
            'Metric Type': 'Water Usage',
            'Reading Value': '320',
            'Unit': 'm³',
            'Date': '2025-02-16'
          },
          {
            'Location': 'Warehouse A',
            'Metric Type': 'Waste Generated',
            'Reading Value': '450',
            'Unit': 'kg',
            'Date': '2025-02-17'
          }
        ];
        
        // Auto-map columns
        const initialMappings: {[key: string]: string} = {
          'Location': 'facility',
          'Metric Type': 'metric_name',
          'Reading Value': 'value',
          'Unit': 'unit',
          'Date': 'reading_date'
        };
        
        setColumns(mockColumns);
        setMappings(initialMappings);
        setPreview(mockData);
        setStep("map");
      }
    } catch (err: any) {
      console.error("File parsing error:", err);
      setError(err instanceof Error ? err.message : "Failed to parse file");
    } finally {
      setLoading(false);
    }
  };

  const handleMappingChange = (column: string, field: string) => {
    setMappings(prev => ({
      ...prev,
      [column]: field
    }));
  };

  const handleSubmit = async () => {
    // Check authentication first
    if (!user && !isLoading) {
      setError("You must be logged in to upload files. Please log in.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Check for file
      if (!file) {
        throw new Error("No file selected");
      }

      // Transform the mapped data
      const transformedData = preview.map(row => {
        const transformed: {[key: string]: any} = {};
        
        // Track if we have separate date and time columns
        let dateValue = null;
        let timeValue = null;
        
        // First pass: identify date and time fields
        Object.entries(mappings).forEach(([column, field]) => {
          if (field === 'reading_date' && row[column]) {
            // If it looks like a time value, store it separately
            if (typeof row[column] === 'string' && row[column].includes(':') && row[column].length <= 8) {
              timeValue = row[column];
            } else {
              dateValue = row[column];
            }
          }
        });
        
        // Second pass: apply mappings
        Object.entries(mappings).forEach(([column, field]) => {
          if (field && row[column] !== undefined) {
            // Skip time-only values for reading_date
            if (field === 'reading_date') {
              if (typeof row[column] === 'string' && row[column].includes(':') && row[column].length <= 8) {
                // Don't set the reading_date yet if it's just a time
              } else {
                transformed[field] = formatDate(row[column]);
              }
            }
            // Convert value field to number
            else if (field === 'value') {
              transformed[field] = parseFloat(String(row[column]).replace(/[^0-9.-]/g, ''));
            } else {
              transformed[field] = row[column];
            }
          }
        });
        
        // Format date properly - either combine date and time or use just date
        if (dateValue && timeValue) {
          // We have both date and time, but only use date for now
          transformed['reading_date'] = formatDate(dateValue);
        } else if (dateValue) {
          // We have only date
          transformed['reading_date'] = formatDate(dateValue);
        } else if (timeValue) {
          // We have only time - use current date
          const today = new Date();
          transformed['reading_date'] = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        } else {
          // No date/time found, use current date
          const today = new Date();
          transformed['reading_date'] = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        }
        
        // Add default facility if not mapped
        if (!transformed.facility) {
          transformed.facility = facility;
        }
        
        // Add default metric_name if not mapped
        if (!transformed.metric_name) {
          transformed.metric_name = metricName;
        }
        
        // Add default reading type if not provided
        if (!transformed.reading_type) {
          transformed.reading_type = 'imported';
        }
        
        // Add a default meter_code if missing
        if (!transformed.meter_code) {
          transformed.meter_code = 'TH-E-01'; // Default for Talbot House Electricity
        }
        
        // IMPORTANT: Add default meter_name if missing
        if (!transformed.meter_name) {
          transformed.meter_name = `${transformed.facility} Electricity Meter`;
        }
        
        // Add default unit if missing
        if (!transformed.unit) {
          if (metricName === 'electricity_usage') {
            transformed.unit = 'kWh';
          } else if (metricName === 'water_usage') {
            transformed.unit = 'm³';
          } else if (metricName === 'gas_usage') {
            transformed.unit = 'm³';
          } else {
            transformed.unit = 'unit';
          }
        }
        
        // Add user_id to each record
        if (user) {
          transformed.user_id = user.id;
        }
        
        return transformed;
      });
      
      // Verify required fields are present in at least the first row
      const firstRow = transformedData[0] || {};
      const missingFields = requiredFields.filter(field => !firstRow[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }
      
      console.log("Processed data ready for submission:", transformedData);
      
      // Save to Supabase
      try {
        console.log("Attempting to save to Supabase:", transformedData);
        
        const { error: supabaseError } = await supabase
          .from('metrics')
          .insert(transformedData);
        
        if (supabaseError) {
          console.error("Supabase error:", supabaseError);
          throw new Error(supabaseError.message);
        }

        console.log("Successfully saved to Supabase");
        
        setSuccess(true);
        setStep("upload");
        setFile(null);
        setPreview([]);
        setColumns([]);
        setMappings({});
        
        // Important: Make sure we call the onUploadComplete callback to refresh the Recent Entries
        if (onUploadComplete) {
          console.log("Calling onUploadComplete callback");
          onUploadComplete();
        }
        
        setTimeout(() => {
          setSuccess(false);
        }, 6000);
      } catch (dbError: any) {
        console.error("Database error details:", dbError);
        throw new Error(`Database error: ${dbError.message || "Unknown database error"}`);
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setStep("upload");
    setFile(null);
    setPreview([]);
    setColumns([]);
    setMappings({});
    setError(null);
  };

  // Check if any required field is missing from mappings
  const getMissingRequiredFields = () => {
    const mappedFields = Object.values(mappings);
    return requiredFields.filter(field => !mappedFields.includes(field));
  };

  // Check if a column appears to be a time-only column
  const isTimeOnlyColumn = (column: string) => {
    const lowerColumn = column.toLowerCase();
    
    // Check if the column name suggests it's a time column
    if (lowerColumn === 'time' || 
       (lowerColumn.includes('time') && !lowerColumn.includes('date'))) {
      return true;
    }
    
    // Check the actual data in the column
    if (preview.length > 0) {
      const firstValue = preview[0][column];
      if (typeof firstValue === 'string' && 
          firstValue.includes(':') && 
          !firstValue.includes('-') && 
          !firstValue.includes('/') &&
          firstValue.length <= 8) {
        return true;
      }
    }
    
    return false;
  };

  // If authentication is loading, show loading state
  if (isLoading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p>Loading authentication...</p>
      </div>
    );
  }

 // If not authenticated, show login prompt
 if (!user) {
  return (
    <div className="p-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
      <p className="text-center text-gray-600 mb-4">
        You need to be logged in to upload and process files.
      </p>
      <Button onClick={() => router.push('/login')} className="flex items-center">
        <LogIn className="mr-2 h-4 w-4" />
        Log In
      </Button>
    </div>
  );
}

return (
  <div className="space-y-6">
    {error && (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )}

    {step === "upload" && (
      <>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload your file</h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload CSV or Excel (XLSX) files with your metric data
            </p>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
            <Label 
              htmlFor="file-upload" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded cursor-pointer"
            >
              Browse Files
            </Label>
          </div>

          {file && (
            <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <File className="h-8 w-8 text-blue-500 mr-3" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <div className="flex space-x-2">
                <select
                  className="px-2 py-1 border rounded"
                  value={fileType} 
                  onChange={(e) => setFileType(e.target.value)}
                >
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
                <Button onClick={parseFile} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Success message moved here, below the file upload area */}
          {success && (
            <div className="mt-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-700">
                  File uploaded and processed successfully
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </>
    )}

    {step === "map" && (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Map Columns to Fields</h3>
          <p className="text-sm text-gray-500 mb-6">
            Match your file columns to the corresponding data fields
          </p>
        </div>
        
        {/* Default values for facility and metric name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg mb-4">
          <div>
            <Label className="mb-2 block">Default Facility (if not in file):</Label>
            <Input 
              value={facility} 
              onChange={(e) => setFacility(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label className="mb-2 block">Default Metric Type (if not in file):</Label>
            <select
              value={metricName}
              onChange={(e) => setMetricName(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="electricity_usage">Electricity Usage</option>
              <option value="water_usage">Water Usage</option>
              <option value="gas_usage">Gas Usage</option>
              <option value="waste_generated">Waste Generated</option>
            </select>
          </div>
        </div>

        {/* Missing required fields warning */}
        {getMissingRequiredFields().length > 0 && (
          <Alert className="bg-yellow-50 border-yellow-200 mb-4">
            <AlertCircle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="text-yellow-700">
              <strong>Required fields not mapped:</strong> {getMissingRequiredFields().join(', ')}. 
              <p className="text-sm mt-1">Default values will be used where available.</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {columns.map((column) => {
            const isTimeColumn = isTimeOnlyColumn(column);
            
            return (
              <div key={column} className="space-y-2">
                <Label>
                  Map "{column}" to:
                  {isTimeColumn && <span className="text-xs text-amber-600 ml-1">(Time columns should be ignored)</span>}
                </Label>
                <select 
                  className="w-full p-2 border rounded"
                  value={mappings[column] || ""}
                  onChange={(e) => handleMappingChange(column, e.target.value)}
                >
                  <option value="">Ignore column</option>
                  {availableFields.map(field => (
                    <option 
                      key={field} 
                      value={field}
                      disabled={isTimeColumn && field === 'reading_date'}
                    >
                      {field.replace('_', ' ')}
                    </option>
                  ))}
                </select>
                {mappings[column] && (
                  <p className="text-xs text-gray-500">{fieldDescriptions[mappings[column]] || ''}</p>
                )}
                {isTimeColumn && mappings[column] === 'reading_date' && (
                  <p className="text-xs text-red-500">Time-only columns should not be mapped to reading_date!</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Data Preview</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column}
                      {mappings[column] && (
                        <span className={`block text-xs font-normal normal-case ${requiredFields.includes(mappings[column]) ? 'text-blue-600' : 'text-gray-400'}`}>
                          ↓ {mappings[column].replace('_', ' ')}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preview.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column} className="px-3 py-2 text-sm text-gray-500">
                        {row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload Data"
            )}
          </Button>
        </div>
      </div>
    )}
  </div>
);
};