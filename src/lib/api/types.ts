// src/lib/api/types.ts
import { FacilityName, MetricName, UnitName } from '@/lib/constants';

export interface Metric {
  id: number;
  reading_date: string;
  facility: FacilityName;
  meter_code: string;
  meter_name: string;
  metric_name: MetricName;
  value: number;
  unit: UnitName;
  reading_type: string;
  source_file?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MetricInput {
  reading_date: string;
  facility: FacilityName;
  meter_code: string;
  meter_name: string;
  metric_name: MetricName;
  value: number;
  unit: UnitName;
  reading_type: string;
  source_file?: string | null;
  notes?: string | null;
}