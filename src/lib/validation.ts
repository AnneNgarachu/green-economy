// lib/validation.ts
import { z } from 'zod';
import { FACILITIES, METRICS, UNITS } from './constants';

// Create unions from constants
const facilityUnion = z.enum(Object.values(FACILITIES) as [string, ...string[]]);
const metricUnion = z.enum(Object.values(METRICS) as [string, ...string[]]);
const unitUnion = z.enum(Object.values(UNITS) as [string, ...string[]]);

// Metric validation schema
export const metricSchema = z.object({
  reading_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  facility: facilityUnion,
  meter_code: z.string().min(3, 'Meter code must be at least 3 characters'),
  meter_name: z.string().min(3, 'Meter name must be at least 3 characters'),
  metric_name: metricUnion,
  value: z.number().positive('Value must be positive'),
  unit: unitUnion,
  reading_type: z.string().min(3, 'Reading type must be at least 3 characters'),
  source_file: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Input validation for file processing
export const processingInputSchema = z.object({
  facility: facilityUnion,
  file: z.instanceof(File, { message: 'A valid file is required' })
    .refine(f => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(f.type), {
      message: 'File must be an Excel file (.xlsx or .xls)'
    }),
});

// Validate a metric object
export function validateMetric(metric: unknown) {
  return metricSchema.safeParse(metric);
}

// Validate an array of metrics
export function validateMetrics(metrics: unknown[]) {
  return z.array(metricSchema).safeParse(metrics);
}