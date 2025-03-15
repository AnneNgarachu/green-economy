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

// Types
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

interface ProcessingResult {
  success: boolean;
  recordsProcessed: number;
  errors: string[];
}

export const ElectricityFileProcessor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<MeterReading[] | null>(null);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [facility, setFacility] = useState<string>(FACILITIES.TALBOT_HOUSE);

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
      await generatePreview(selectedFile);
    } catch (err: any) {
      setError(`Error reading file: ${err.message}`);
    }
  };

  // Enhanced date format handling
  const formatDate = (dateValue: any): string => {
    // Handle Excel date serial numbers
    if (typeof dateValue === 'number' && dateValue > 30000) {
      const date = new Date(Math.round((dateValue - 25569) * 86400 * 1000));
      return date.toISOString().split('T')[0];
    }
    
    // Handle string dates
    if (typeof dateValue === 'string') {
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
          // Assume MM/DD/YYYY if first part is 12 or less
          const month = parseInt(parts[0]) <= 12 ? parts[0] : parts[1];
          const day = parseInt(parts[0]) <= 12 ? parts[1] : parts[0];
          const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
    }
    
    // Default to yesterday if we couldn't parse
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer || new ArrayBuffer(0));
      reader.onerror = () => reject(new Error('File reading error'));
      reader.readAsArrayBuffer(file);
    });
  };

  // Simplified intelligent column detection
  const detectColumns = (data: any[]) => {
    // First see if we can use headers
    if (data.length > 0 && typeof data[0] === 'object') {
      const keys = Object.keys(data[0]);
      const cols: any = {};
      
      // Check for common column patterns
      keys.forEach(key => {
        const lowerKey = key.toLowerCase();
        if (/date|day/.test(lowerKey)) cols.date = key;
        else if (/time|hour/.test(lowerKey)) cols.time = key;
        else if (/meter|device|id/.test(lowerKey)) cols.meter = key;
        else if (/read|value|consumption|kwh|usage/.test(lowerKey)) cols.reading = key;
        else if (/unit|measure/.test(lowerKey)) cols.unit = key;
        else if (/note|comment/.test(lowerKey)) cols.notes = key;
      });
      
      return { hasHeaders: true, cols };
    }
    
    // Return a minimal set if we can't detect
    return { hasHeaders: false, cols: {} };
  };

  // Fix for "implicitly has type 'any'" error - this would happen during column type detection
  const analyzeColumnTypes = (rows: any[]) => {
    // Detect data types in the rows
    const typeInfo: Record<string, string[]> = {};
    
    // Check the first few rows to identify column types
    for (let i = 0; i < Math.min(rows.length, 5); i++) {
      // Fixed line - added type annotation and corrected the reference
      const rowData: Record<string, any> = Array.isArray(rows[i]) ? rows[i] : Object.values(rows[i]);
      
      Object.entries(rowData).forEach(([key, cell]) => {
        if (!typeInfo[key]) typeInfo[key] = [];
        
        // Determine the type of the cell
        let type = 'unknown';
        if (cell instanceof Date) type = 'date';
        else if (typeof cell === 'number') type = 'number';
        else if (typeof cell === 'string') {
          // Check for date patterns
          if (/^\d{4}-\d{2}-\d{2}/.test(cell) || /^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(cell)) {
            type = 'date';
          } else if (/^\d+(\.\d+)?$/.test(cell)) {
            type = 'number';
          } else {
            type = 'string';
          }
        }
        
        typeInfo[key].push(type);
      });
    }
    
    // Determine most common type for each column
    const columnTypes: Record<string, string> = {};
    Object.entries(typeInfo).forEach(([key, types]) => {
      const counts: Record<string, number> = {};
      types.forEach(type => {
        counts[type] = (counts[type] || 0) + 1;
      });
      
      let mostCommon = 'string';
      let maxCount = 0;
      
      Object.entries(counts).forEach(([type, count]) => {
        if (count > maxCount) {
          mostCommon = type;
          maxCount = count;
        }
      });
      
      columnTypes[key] = mostCommon;
    });
    
    return columnTypes;
  };

  const generatePreview = async (selectedFile: File) => {
    try {
      const arrayBuffer = await readFileAsArrayBuffer(selectedFile);
      const workbook = XLSX.read(arrayBuffer, { cellDates: true });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Get column types for improved processing
      const columnTypes = analyzeColumnTypes(jsonData);
      
      // Detect columns
      const { cols } = detectColumns(jsonData);
      
      // Process data with intelligent column mapping
      const meterData = jsonData.map((row: any) => {
        // Get date with fallbacks
        const dateValue = row[cols.date] || 
                         row['Date'] || 
                         row['date'] || 
                         row['Reading Date'] || 
                         row['Timestamp'];
        
        // Get reading value with fallbacks
        const readingValue = row[cols.reading] || 
                            row['Reading'] || 
                            row['Value'] || 
                            row['Consumption'] || 
                            row['kWh'] || 
                            row['Usage'];
        
        // Get meter code with fallbacks
        const meterValue = row[cols.meter] || 
                          row['Meter'] || 
                          row['Meter Name'] || 
                          row['Meter ID'] || 
                          'TH-E-01';
        
        // Get notes with fallbacks
        const notesValue = row[cols.notes] || 
                          row['Notes'] || 
                          row['Comments'] || 
                          `Imported from ${selectedFile.name}`;
                          
        // Skip rows without required data
        if (!dateValue || !readingValue) return null;
        
        // Convert reading to number
        let value = typeof readingValue === 'number' 
          ? readingValue 
          : parseFloat(readingValue.toString().replace(/[^0-9.]/g, ''));
          
        // Skip invalid readings
        if (isNaN(value) || value <= 0) return null;
        
        return {
          reading_date: formatDate(dateValue),
          facility: facility,
          meter_code: typeof meterValue === 'string' ? meterValue : 'TH-E-01',
          meter_name: `${facility} Electricity Meter`,
          metric_name: METRICS.ELECTRICITY,
          value: value,
          unit: UNITS.ELECTRICITY,
          reading_type: 'file_import',
          source_file: selectedFile.name,
          notes: notesValue ? notesValue.toString() : ''
        };
      }).filter(Boolean) as MeterReading[];
      
      if (meterData.length === 0) {
        throw new Error('No valid electricity meter data found in the file');
      }
      
      // Sort by date
      meterData.sort((a, b) => a.reading_date.localeCompare(b.reading_date));
      
      setPreviewData(meterData.slice(0, 10)); // Show first 10 rows
      
    } catch (err: any) {
      console.error('Error generating preview:', err);
      throw err;
    }
  };

  const uploadToDatabase = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setProcessingResult(null);
    
    try {
      const arrayBuffer = await readFileAsArrayBuffer(file);
      const workbook = XLSX.read(arrayBuffer, { cellDates: true });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Analyze column types
      const columnTypes = analyzeColumnTypes(jsonData);
      
      // Detect columns and process data
      const { cols } = detectColumns(jsonData);
      
      // Process in the same way as the preview
      const meterData = jsonData.map((row: any) => {
        const dateValue = row[cols.date] || row['Date'] || row['date'] || row['Reading Date'] || row['Timestamp'];
        const readingValue = row[cols.reading] || row['Reading'] || row['Value'] || row['Consumption'] || row['kWh'] || row['Usage'];
        const meterValue = row[cols.meter] || row['Meter'] || row['Meter Name'] || row['Meter ID'] || 'TH-E-01';
        const notesValue = row[cols.notes] || row['Notes'] || row['Comments'] || `Imported from ${file.name}`;
                          
        if (!dateValue || !readingValue) return null;
        
        let value = typeof readingValue === 'number' 
          ? readingValue 
          : parseFloat(readingValue.toString().replace(/[^0-9.]/g, ''));
          
        if (isNaN(value) || value <= 0) return null;
        
        return {
          reading_date: formatDate(dateValue),
          facility: facility,
          meter_code: typeof meterValue === 'string' ? meterValue : 'TH-E-01',
          meter_name: `${facility} Electricity Meter`,
          metric_name: METRICS.ELECTRICITY,
          value: value,
          unit: UNITS.ELECTRICITY,
          reading_type: 'file_import',
          source_file: file.name,
          notes: notesValue ? notesValue.toString() : ''
        };
      }).filter(Boolean) as MeterReading[];
      
      if (meterData.length === 0) {
        throw new Error('No valid electricity meter data found in the file');
      }
      
      // Insert into Supabase
      const errors: string[] = [];
      let successCount = 0;
      
      for (const record of meterData) {
        const { error: supabaseError } = await supabase
          .from('metrics')
          .insert([record]);
          
        if (supabaseError) {
          errors.push(`Error inserting record: ${supabaseError.message}`);
        } else {
          successCount++;
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
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Facility</label>
          <select
            className="w-full p-2 border rounded"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
          >
            {Object.values(FACILITIES).map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        
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
            disabled={loading || !file}
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