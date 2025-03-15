// src/features/dashboard/type.ts
import { LucideIcon } from 'lucide-react';
import { FacilityName } from '@/lib/constants';

// Time range options
export type TimeRange = '24h' | '7d' | '30d';

// Basic metric data structure
export interface MetricData {
  current: string;
  previous: string;
  change: string;
  peak: string;
  average: string;
  target: string;
}

// Type for metrics data organized by time range
export type MetricDataByTimeRange = Record<TimeRange, MetricData>;

// Base props for components that use time range
export interface TimeRangeProps {
  timeRange: TimeRange;
}

// Base metric component props
export interface MetricProps extends TimeRangeProps {
  Icon: LucideIcon;
  iconColor: string;
  metricData: MetricDataByTimeRange;
  building?: FacilityName | 'All Buildings';
}

// Specific props for metric cards
export interface MetricCardProps extends MetricProps {
  title: string;
  description?: string;
  invertColors?: boolean;  // For cases like sustainability score where increase is positive
}

// Props for the metrics overview component
export interface MetricsOverviewProps extends TimeRangeProps {
  className?: string;
  building?: FacilityName | 'All Buildings';
  data?: {
    energy: MetricDataByTimeRange;
    water: MetricDataByTimeRange;
    carbon: MetricDataByTimeRange;
    sustainability: MetricDataByTimeRange;
  };
}

// Chart data types
export interface ChartDataPoint {
  timestamp: string;
  value: number;
  target?: number;
}

export interface ChartData {
  timeRange: TimeRange;
  metric: string;
  data: ChartDataPoint[];
}

// Export a type for the complete dashboard data
export interface DashboardData {
  energyUsage: MetricDataByTimeRange;
  waterConsumption: MetricDataByTimeRange;
  carbonFootprint: MetricDataByTimeRange;
  sustainabilityScore: MetricDataByTimeRange;
  wasteGeneration?: MetricDataByTimeRange;
  charts?: ChartData[];
}

// Building selector props
export interface BuildingSelectorProps {
  currentBuilding: FacilityName | 'All Buildings';
  onChange: (building: FacilityName | 'All Buildings') => void;
}