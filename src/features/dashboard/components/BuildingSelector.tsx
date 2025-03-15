// src/features/dashboard/components/BuildingSelector.tsx
import React from 'react';
import { Building } from 'lucide-react';
import { FACILITIES, FacilityName } from '@/lib/constants';
import { BuildingSelectorProps } from '../type';

export function BuildingSelector({ 
  currentBuilding, 
  onChange 
}: BuildingSelectorProps) {
  return (
    <div className="flex items-center space-x-2">
      <Building className="h-4 w-4 text-muted-foreground" />
      <select
        className="bg-white border border-gray-300 text-gray-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        value={currentBuilding}
        onChange={(e) => onChange(e.target.value as FacilityName | 'All Buildings')}
      >
        <option value="All Buildings">All Buildings</option>
        {Object.values(FACILITIES).map((facility) => (
          <option key={facility} value={facility}>
            {facility}
          </option>
        ))}
      </select>
    </div>
  );
}