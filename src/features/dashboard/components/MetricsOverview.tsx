'use client'

// src/features/dashboard/components/MetricsOverview.tsx
import { Line } from "react-chartjs-2"
import { BarChart } from 'lucide-react'
import { MetricsOverviewProps } from '@/features/dashboard/type'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: '#000000'
      }
    },
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: '#000000'
      }
    }
  },
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#000000',
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      text: 'Performance Trends',
      color: '#000000',
      font: {
        size: 16
      },
      padding: 20
    }
  }
}

export function MetricsOverview({ timeRange, className = '' }: MetricsOverviewProps) {
  const getChartData = (timeRange: string) => {
    switch (timeRange) {
      case '7d':
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Energy Usage (kWh)",
              data: [3200, 3100, 3300, 3250, 3400, 3150, 3000],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              tension: 0.4
            },
            {
              label: "Water Usage (L)",
              data: [15000, 14800, 15200, 15100, 14900, 15300, 15000],
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderWidth: 2,
              tension: 0.4
            }
          ]
        }
      case '30d':
        return {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Energy Usage (kWh)",
              data: [13000, 12800, 13200, 13000],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              tension: 0.4
            },
            {
              label: "Water Usage (L)",
              data: [60000, 61000, 59000, 60000],
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderWidth: 2,
              tension: 0.4
            }
          ]
        }
      default:
        return {
          labels: ["6AM", "9AM", "12PM", "3PM", "6PM", "9PM"],
          datasets: [
            {
              label: "Energy Usage (kWh)",
              data: [450, 400, 420, 410, 430, 400],
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 2,
              tension: 0.4
            },
            {
              label: "Water Usage (L)",
              data: [2000, 1800, 1900, 1950, 1820, 1800],
              borderColor: "rgb(54, 162, 235)",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderWidth: 2,
              tension: 0.4
            }
          ]
        }
    }
  }

  const chartData = getChartData(timeRange)

  return (
    <div className={`mt-6 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <BarChart className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-black">Performance Overview</h2>
      </div>
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="h-[400px] w-full">
          <Line options={chartOptions} data={chartData} />
        </div>
      </div>
    </div>
  )
}