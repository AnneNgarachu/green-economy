// src/lib/api/metrics.ts
import { supabase } from '@/lib/supabase/client';
import { Metric, MetricName } from '@/lib/constants';

export async function fetchMetrics(
  facility: string,
  metricName: MetricName,
  startDate: string,
  endDate: string
) {
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

// Other metric-related functions...