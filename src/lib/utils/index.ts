// src/lib/utils/index.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { METRICS, CARBON_FACTORS, COST_RATES, MetricName } from '@/lib/constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Carbon calculation utilities
export function calculateCarbonEmissions(kWh: number, fuelType: 'ELECTRICITY' | 'GAS' | 'WATER' = 'ELECTRICITY') {
  const factor = CARBON_FACTORS[fuelType] || CARBON_FACTORS.ELECTRICITY;
  return kWh * factor;
}

// Helper function to calculate costs
export function calculateCost(
  value: number, 
  metricName: MetricName
) {
  let rate = 0;
  
  if (metricName === METRICS.ELECTRICITY) {
    rate = COST_RATES.ELECTRICITY;
  } else if (metricName === METRICS.GAS) {
    rate = COST_RATES.GAS;
  } else if (metricName === METRICS.WATER) {
    rate = COST_RATES.WATER;
  }
  
  return value * rate;
}

// Convert gas volume (m³) to kWh
export function convertGasVolumeTokWh(cubicMeters: number, calorificValue = 39.5) {
  // UK formula: kWh = Volume × Calorific Value × 1.02264 ÷ 3.6
  return cubicMeters * calorificValue * 1.02264 / 3.6;
}

// Convert pulse counts to volume
export function convertPulseToVolume(pulses: number, pulseRatio: number) {
  return pulses * pulseRatio;
}

// Format large numbers with commas
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Calculate sustainability score based on metrics
export function calculateSustainabilityScore(
  electricityConsumption: number, 
  electricityTarget: number,
  waterConsumption: number,
  waterTarget: number,
  gasConsumption: number = 0,
  gasTarget: number = 0,
  wasteGeneration: number = 0,
  wasteTarget: number = 0
): number {
  // Calculate individual scores (capped at 100%)
  const electricityScore = Math.min(1, electricityTarget / Math.max(1, electricityConsumption));
  const waterScore = Math.min(1, waterTarget / Math.max(1, waterConsumption));
  
  // Calculate weighted average score
  const weights = {
    electricity: 0.5,
    water: 0.3,
    gas: 0.15,
    waste: 0.05
  };
  
  let totalScore = electricityScore * weights.electricity + waterScore * weights.water;
  
  // Add gas score if provided
  if (gasConsumption > 0 && gasTarget > 0) {
    const gasScore = Math.min(1, gasTarget / Math.max(1, gasConsumption));
    totalScore += gasScore * weights.gas;
  } else {
    // Redistribute gas weight to electricity and water
    totalScore = (electricityScore * (weights.electricity + weights.gas/2)) + 
                (waterScore * (weights.water + weights.gas/2));
  }
  
  // Add waste score if provided
  if (wasteGeneration > 0 && wasteTarget > 0) {
    const wasteScore = Math.min(1, wasteTarget / Math.max(1, wasteGeneration));
    totalScore += wasteScore * weights.waste;
  } else {
    // Redistribute waste weight to electricity and water
    totalScore = totalScore / (1 - weights.waste);
  }
  
  // Return as a percentage value
  return Math.round(totalScore * 100);
}

// Helper function to check if a change is positive
export function isPositiveChange(changeString: string): boolean {
  if (!changeString) return false;
  
  // Remove any '%' character and trim spaces
  const cleaned = changeString.replace('%', '').trim();
  
  // First check for explicit '+' sign
  if (cleaned.startsWith('+')) return true;
  
  // If no sign prefix, check if it's a positive number
  if (!cleaned.startsWith('-')) {
    // Make sure it's actually a number
    const num = parseFloat(cleaned);
    return !isNaN(num) && num > 0;
  }
  
  return false;
}