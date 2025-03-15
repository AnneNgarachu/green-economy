// src/lib/constants.ts
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
  WASTE: 'waste_generation',
  CARBON: 'carbon_emissions'
} as const;

export const UNITS = {
  ELECTRICITY: 'kWh',
  WATER: 'm³',
  GAS: 'm³',
  WASTE: 'kg',
  CARBON: 'tons'
} as const;

// Type definitions
export type FacilityName = (typeof FACILITIES)[keyof typeof FACILITIES];
export type MetricName = (typeof METRICS)[keyof typeof METRICS];
export type UnitName = (typeof UNITS)[keyof typeof UNITS];

// Carbon calculation factors
export const CARBON_FACTORS = {
  ELECTRICITY: 0.233, // kg CO2e per kWh (UK 2023)
  GAS: 0.184, // kg CO2e per kWh
  WATER: 0.344, // kg CO2e per m³
}

// Cost rates (£)
export const COST_RATES = {
  ELECTRICITY: 0.21, // £ per kWh
  GAS: 0.058, // £ per kWh
  WATER: 2.5 // £ per m³
}