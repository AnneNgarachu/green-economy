// lib/constants.ts
export const FACILITIES = {
    TALBOT_HOUSE: 'Talbot House',
    KIMMERIDGE_HOUSE: 'Kimmeridge House',
    POOLE_GATEWAY: 'Poole Gateway',
    CHAPEL_GATE: 'Chapel Gate',
  } as const;
  
  export const METRICS = {
    ELECTRICITY: 'electricity_usage',
    WATER: 'water_usage',
    GAS: 'gas_usage',
  } as const;
  
  export const UNITS = {
    ELECTRICITY: 'kWh',
    WATER: 'm³',
    GAS: 'm³',
  } as const;
  
  // Type definitions
  export type FacilityName = (typeof FACILITIES)[keyof typeof FACILITIES];
  export type MetricName = (typeof METRICS)[keyof typeof METRICS];
  export type UnitName = (typeof UNITS)[keyof typeof UNITS];
  
  // Now define the Metric interface
  export interface Metric {
    id?: number;
    reading_date: string;
    facility: string;
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
  
  export interface ConsumptionData {
    total_consumption: number;
    peak_consumption: number;
    average_consumption: number;
  }