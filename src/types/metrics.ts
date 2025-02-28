// src/types/metrics.ts

export interface Metric {
    name: string;
    units: string[];
  }
  
  export interface MetricEntry {
    id: string;
    facility: string;
    metric_name: string;
    value: number;
    unit: string;
    reading_date: string;
    reading_type: string; // manual, automatic, imported, system
    notes?: string | null;
    created_at?: string;
    updated_at?: string;
  }