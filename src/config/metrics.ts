// config/metrics.ts

export const METRIC_COLORS = {
    energy: {
      primary: 'rgb(75, 192, 192)',
      background: 'rgba(75, 192, 192, 0.2)'
    },
    water: {
      primary: 'rgb(54, 162, 235)',
      background: 'rgba(54, 162, 235, 0.2)'
    },
    waste: {
      primary: 'rgb(153, 102, 255)',
      background: 'rgba(153, 102, 255, 0.2)'
    },
    carbon: {
      primary: 'rgb(255, 99, 132)',
      background: 'rgba(255, 99, 132, 0.2)'
    }
  };
  
  export const TIME_RANGES = {
    '24h': 'Last 24 Hours',
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days'
  } as const;
  
  export const METRIC_UNITS = {
    energy: 'kWh',
    water: 'L',
    waste: 'kg',
    carbon: 'tons'
  } as const;