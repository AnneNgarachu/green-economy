// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

// Types for metrics data
export interface Metric {
  id?: number;
  reading_date: string;
  facility: string;
  meter_code: string;
  meter_name: string;
  metric_name: string;
  value: number;
  unit: string;
  reading_type: string;
  source_file?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string;  // Add user_id field for RLS
}

export interface ConsumptionData {
  total_consumption: number;
  peak_consumption: number;
  average_consumption: number;
}

// Helper function to fetch metrics data with user_id
export async function fetchMetrics({
  facility,
  metricName,
  startDate,
  endDate,
}: {
  facility: string;
  metricName: string;
  startDate: string;
  endDate: string;
}) {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('facility', facility)
    .eq('metric_name', metricName)
    .gte('reading_date', startDate)
    .lte('reading_date', endDate)
    .order('reading_date', { ascending: true });

  if (error) {
    console.error('Error fetching metrics:', error);
    throw error;
  }

  return data as Metric[];
}

// Helper function to insert a single metric with current user's ID
export async function insertMetric(metric: Omit<Metric, 'id' | 'created_at' | 'updated_at'>) {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to insert metrics");
  }

  const metricWithUser = {
    ...metric,
    user_id: user.id
  };

  const { data, error } = await supabase
    .from('metrics')
    .insert([metricWithUser])
    .select();

  if (error) {
    console.error('Error inserting metric:', error);
    throw error;
  }

  return data;
}

// Helper function to insert multiple metrics with current user's ID
export async function insertMetrics(metrics: Omit<Metric, 'id' | 'created_at' | 'updated_at'>[]) {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to insert metrics");
  }

  const metricsWithUser = metrics.map(metric => ({
    ...metric,
    user_id: user.id
  }));

  const { data, error } = await supabase
    .from('metrics')
    .insert(metricsWithUser)
    .select();

  if (error) {
    console.error('Error inserting metrics:', error);
    throw error;
  }

  return data;
}

// Helper function to calculate consumption statistics
export async function calculateConsumption({
  facility,
  metricName,
  startDate,
  endDate,
}: {
  facility: string;
  metricName: string;
  startDate: string;
  endDate: string;
}) {
  const { data, error } = await supabase
    .rpc('calculate_consumption', {
      facility_name: facility,
      metric_type: metricName,
      start_date: startDate,
      end_date: endDate
    });

  if (error) {
    console.error('Error calculating consumption:', error);
    throw error;
  }

  return data as ConsumptionData;
}

// Helper function to calculate carbon emissions (for electricity)
export function calculateCarbonEmissions(kWh: number, carbonFactor = 0.233) {
  // UK electricity carbon factor: 0.233 kg CO2e per kWh (2023)
  return kWh * carbonFactor;
}

// Helper function to calculate costs
export function calculateCost(
  value: number, 
  metricName: string, 
  rates = { electricity: 0.21, gas: 0.058, water: 2.5 }
) {
  let rate: number;
  
  switch (metricName.toLowerCase()) {
    case 'electricity':
    case 'electricity_usage':
      rate = rates.electricity;
      break;
    case 'gas':
    case 'gas_usage':
      rate = rates.gas;
      break;
    case 'water':
    case 'water_usage':
      rate = rates.water;
      break;
    default:
      rate = 0;
  }
  
  return value * rate;
}