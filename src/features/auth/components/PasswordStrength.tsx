'use client'

import { useMemo } from 'react'

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200', textColor: 'text-gray-600' };
    
    // Calculate password strength
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score += 1; // Has uppercase
    if (/[a-z]/.test(password)) score += 1; // Has lowercase
    if (/[0-9]/.test(password)) score += 1; // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char
    
    // Determine label and color based on score
    let label: string;
    let color: string;
    let textColor: string;
    
    switch (true) {
      case (score <= 2):
        label = 'Weak';
        color = 'bg-red-500';
        textColor = 'text-red-600';
        break;
      case (score <= 4):
        label = 'Moderate';
        color = 'bg-yellow-500';
        textColor = 'text-yellow-600';
        break;
      case (score <= 5):
        label = 'Strong';
        color = 'bg-green-500';
        textColor = 'text-green-600';
        break;
      default:
        label = 'Very Strong';
        color = 'bg-green-600';
        textColor = 'text-green-700';
    }
    
    return { 
      score: Math.min(score, 6), 
      label, 
      color,
      textColor 
    };
  }, [password]);
  
  // Don't show anything if password field is empty
  if (!password) return null;
  
  const strengthPercentage = (strength.score / 6) * 100;
  
  return (
    <div className="mt-2 mb-1">
      <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
        <div 
          className={`h-1 rounded-full ${strength.color}`}
          style={{ width: `${strengthPercentage}%` }}
        />
      </div>
      <p className={`text-xs ${strength.textColor}`}>
        Password strength: {strength.label}
      </p>
    </div>
  );
};