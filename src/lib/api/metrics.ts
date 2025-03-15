// src/lib/api/metrics.ts
import { supabase } from '@/lib/supabase/client';
import { MetricName } from '@/lib/constants';
import { Metric } from './types';

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

export async function fetchMetricsByFacility(
  facility: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('metrics')
    .select('*')
    .eq('facility', facility)
    .gte('reading_date', startDate)
    .lte('reading_date', endDate)
    .order('reading_date', { ascending: true });

  if (error) {
    console.error('Error fetching metrics by facility:', error);
    throw error;
  }

  return data as Metric[];
}

export async function insertMetric(metric: Omit<Metric, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('metrics')
    .insert([metric])
    .select();

  if (error) {
    console.error('Error inserting metric:', error);
    throw error;
  }

  return data as Metric[];
}

export async function insertMetrics(metrics: Omit<Metric, 'id' | 'created_at' | 'updated_at'>[]) {
  const { data, error } = await supabase
    .from('metrics')
    .insert(metrics)
    .select();

  if (error) {
    console.error('Error inserting metrics:', error);
    throw error;
  }

  return data as Metric[];
}

export async function updateMetric(id: number, updates: Partial<Omit<Metric, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('metrics')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error updating metric:', error);
    throw error;
  }

  return data as Metric[];
}

export async function deleteMetric(id: number) {
  const { error } = await supabase
    .from('metrics')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting metric:', error);
    throw error;
  }

  return true;
}

export async function calculateAggregates(
  facility: string,
  metricName: MetricName,
  startDate: string,
  endDate: string
) {
  const metrics = await fetchMetrics(facility, metricName, startDate, endDate);
  
  if (!metrics.length) {
    return {
      total: 0,
      average: 0,
      peak: 0
    };
  }

  const total = metrics.reduce((sum, item) => sum + item.value, 0);
  const average = total / metrics.length;
  const peak = Math.max(...metrics.map(item => item.value));

  return {
    total,
    average,
    peak
  };
}