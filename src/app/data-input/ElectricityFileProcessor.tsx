// src/app/data-input/ElectricityFileProcessor.tsx
'use client'

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Loader2, CheckCircle, UploadCloud, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { z } from 'zod';
import { FACILITIES, METRICS, UNITS } from '@/lib/constants';

// Define the validation schema
const metricSchema = z.object({
  reading_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  facility: z.string().min(3, 'Facility name must be at least 3 characters'),
  meter_code: z.string().min(3, 'Meter code must be at least 3 characters'),
  meter_name: z.string().min(3, 'Meter name must be at least 3 characters'),
  metric_name: z.string().min(3, 'Metric name must be at least 3 characters'),
  value: z.number().positive('Value must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  reading_type: z.string().min(3, 'Reading type must be at least 3 characters'),
  source_file: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

interface ProcessingResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
}

interface MeterReading {
  reading_date: string;
  facility: string;
  meter_code: string;
  meter_name: string;
  metric_name: string;
  value: number;
  unit: string;
  reading_type: string;
  source_file: string;
  notes: string;
}

export const ElectricityFileProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<MeterReading[] | null>(null);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setProcessingResult(null);
    setValidationErrors([]);
    
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Check if it's an Excel file
    if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }
    
    setFile(selectedFile);
    
    try {
      // Read the file to generate preview
      await generatePreview(selectedFile);
    } catch (err: any) {
      setError(`Error reading file: ${err.message}`);
    }
  };

  const generatePreview = async (selectedFile: File) => {
    try {
      const arrayBuffer = await readFileAsArrayBuffer(selectedFile);
      const workbook = XLSX.read(arrayBuffer, { 
        cellDates: true,
        cellStyles: true,
        cellNF: true
      });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Extract meter data, focusing on electricity
      const meterData = processMeterData(jsonData, selectedFile.name);
      
      // Validate the data
      const errors: string[] = [];
      meterData.forEach((reading, index) => {
        try {
          metricSchema.parse(reading);
        } catch (err) {
          if (err instanceof z.ZodError) {
            err.errors.forEach(e => {
              errors.push(`Row ${index+1}: ${e.path.join('.')} - ${e.message}`);
            });
          }
        }
      });
      
      if (errors.length > 0) {
        setValidationErrors(errors);
      }
      
      setPreviewData(meterData.slice(0, 10)); // Only show first 10 rows in preview
      
    } catch (err: any) {
      console.error('Error generating preview:', err);
      throw err;
    }
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as ArrayBuffer);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processMeterData = (data: any[], filename: string): MeterReading[] => {
    // Extract building and meter info from filename
    // Example: 20250228_Daily Report_THE01_All Meters Delta.xlsx
    const filenameMatch = filename.match(/(\d{8})_Daily Report_([A-Z0-9]+)/);
    const reportDate = filenameMatch?.[1] || '';
    
    // Look for rows containing electricity meter data
    return data.filter((row: any) => {
      const meterName = row['Meter Name'] || '';
      return meterName.includes('TH-E-01') && meterName.includes('[DELTA]');
    }).map((row: any) => {
      // Transform the data into our standardized format
      return {
        reading_date: formatDate(reportDate),
        facility: FACILITIES.TALBOT_HOUSE, // Use constant instead of string
        meter_code: 'TH-E-01',
        meter_name: row['Meter Name'] || '',
        metric_name: METRICS.ELECTRICITY, // Use constant instead of 'Electricity'
        value: parseFloat(row['Value'] || 0),
        unit: UNITS.ELECTRICITY, // Use constant instead of 'kWh'
        reading_type: 'automatic',
        source_file: filename,
        notes: `Imported from daily report on ${new Date().toISOString()}`
      };
    });
  };

  const formatDate = (dateString: string): string => {
    // Convert from YYYYMMDD to YYYY-MM-DD
    if (dateString.length === 8) {
      return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
    }
    return dateString;
  };

  const uploadToDatabase = async () => {
    if (!file) return;
    
    // Check if there are validation errors
    if (validationErrors.length > 0) {
      setError(`Please fix validation errors before uploading: ${validationErrors.length} errors found`);
      return;
    }
    
    setLoading(true);
    setError(null);
    setProcessingResult(null);
    
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const workbook = XLSX.read(arrayBuffer, { 
        cellDates: true,
        cellStyles: true,
        cellNF: true
      });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Process meter data
      const meterData = processMeterData(jsonData, file.name);
      
      if (meterData.length === 0) {
        throw new Error('No electricity meter data found in the uploaded file');
      }
      
      // Insert into Supabase
      const errors: string[] = [];
      let successCount = 0;
      
      for (const record of meterData) {
        try {
          // Validate the record before inserting
          metricSchema.parse(record);
          
          const { error: supabaseError } = await supabase
            .from('metrics')
            .insert([record]);
            
          if (supabaseError) {
            console.error("Supabase error:", supabaseError);
            errors.push(`Error inserting record: ${supabaseError.message}`);
          } else {
            successCount++;
          }
        } catch (err: any) {
          console.error("Database error:", err);
          errors.push(`Error: ${err.message}`);
        }
      }
      
      setProcessingResult({
        success: successCount > 0,
        recordsProcessed: successCount,
        errors
      });
      
    } catch (err: any) {
      setError(`Error processing file: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewData(null);
    setProcessingResult(null);
    setError(null);
    setValidationErrors([]);
    
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-medium mb-4">Electricity Data Import</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <div className="text-red-600">{error}</div>
          </Alert>
        )}
        
        {validationErrors.length > 0 && (
          <Alert className="mb-4 bg-yellow-50 border-yellow-200">
            <div className="font-medium text-yellow-800">Validation Errors</div>
            <div className="mt-2 max-h-40 overflow-y-auto">
              <ul className="list-disc pl-5 space-y-1">
                {validationErrors.slice(0, 10).map((err, i) => (
                  <li key={i} className="text-sm text-yellow-700">{err}</li>
                ))}
                {validationErrors.length > 10 && (
                  <li className="text-sm text-yellow-700">...and {validationErrors.length - 10} more errors</li>
                )}
              </ul>
            </div>
          </Alert>
        )}
        
        {processingResult && (
          <Alert className={`mb-4 ${processingResult.success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
            <CheckCircle className={`h-4 w-4 ${processingResult.success ? 'text-green-500' : 'text-yellow-500'}`} />
            <div className={processingResult.success ? 'text-green-700' : 'text-yellow-700'}>
              Processed {processingResult.recordsProcessed} records
              {processingResult.errors.length > 0 && (
                <div className="mt-2">
                  <strong>Errors:</strong>
                  <ul className="list-disc pl-5 mt-1">
                    {processingResult.errors.slice(0, 3).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                    {processingResult.errors.length > 3 && (
                      <li>...and {processingResult.errors.length - 3} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </Alert>
        )}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Excel File</label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Excel files only (.xlsx, .xls)</p>
                {file && (
                  <div className="mt-4 flex items-center text-blue-600">
                    <FileText className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                )}
              </div>
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                accept=".xlsx,.xls" 
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        
        {previewData && previewData.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Data Preview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meter</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.reading_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.meter_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.value}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Showing {previewData.length} of {previewData.length} records
            </p>
          </div>
        )}
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button 
            variant="outline" 
            onClick={resetForm}
            disabled={loading}
          >
            Reset
          </Button>
          <Button 
            onClick={uploadToDatabase}
            disabled={loading || !file || validationErrors.length > 0}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Import Data"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ElectricityFileProcessor;