// src/app/data-input/FileUpload.tsx
'use client'

import React, { useState } from "react";
// Use the working import statement
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
  AlertCircle 
} from "lucide-react";

interface FileUploadProps {
  onUploadComplete?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onUploadComplete 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("csv");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"upload" | "map" | "preview">("upload");
  const [mappings, setMappings] = useState<{[key: string]: string}>({});
  const [preview, setPreview] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const availableFields = ["facility", "metric_name", "value", "unit", "reading_date", "reading_type", "notes"];
  const requiredFields = ["facility", "metric_name", "value", "unit", "reading_date"];

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
    if (!file) return;
    setLoading(true);
    setError(null);
    
    try {
      // For demo purposes, let's simulate file parsing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock some data for demo (in a real app, you'd use Papa.parse or XLSX)
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
    } catch (err: any) {
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
    setLoading(true);
    setError(null);
    
    try {
      // Check if all required fields are mapped
      const mappedFields = Object.values(mappings);
      const missingFields = requiredFields.filter(field => !mappedFields.includes(field));
      
      if (missingFields.length > 0) {
        throw new Error(`Required fields missing: ${missingFields.join(', ')}`);
      }
      
      if (!file) {
        throw new Error("No file selected");
      }

      // Transform the mapped data
      const transformedData = preview.map(row => {
        const transformed: {[key: string]: any} = {};
        
        // Apply mappings
        Object.entries(mappings).forEach(([column, field]) => {
          if (field && row[column] !== undefined) {
            // Convert value field to number
            if (field === 'value') {
              transformed[field] = parseFloat(row[column]);
            } else {
              transformed[field] = row[column];
            }
          }
        });
        
        // Add default reading type if not provided
        if (!transformed.reading_type) {
          transformed.reading_type = 'imported';
        }
        
        return transformed;
      });
      
      // Save to Supabase if it's properly connected
      try {
        // Uncomment below when Supabase is properly set up
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
        }, 3000);
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
            File uploaded and processed successfully
          </AlertDescription>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {columns.map((column) => (
              <div key={column} className="space-y-2">
                <Label>
                  Map "{column}" to:
                </Label>
                <select 
                  className="w-full p-2 border rounded"
                  value={mappings[column] || ""}
                  onChange={(e) => handleMappingChange(column, e.target.value)}
                >
                  <option value="">Ignore column</option>
                  {availableFields.map(field => (
                    <option key={field} value={field}>
                      {field.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            ))}
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
                          <span className="block text-xs font-normal normal-case text-gray-400">
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