import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, PointElement, LineElement, Tooltip, Legend, CategoryScale, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-moment';


ChartJS.register(PointElement, LineElement, Tooltip, Legend, CategoryScale, LinearScale, TimeScale);

interface ScatterChartProps {
  data: { x: Date; y: number }[];
  month: string;
}

const ScatterChart: React.FC<ScatterChartProps> = ({ data, month }) => {
  const scatterData = {
    datasets: [
      {
        label: 'Exercise Records',
        data: data.map(record => ({
          x: record.x,
          y: record.y,
        })),
        backgroundColor: 'rgba(75, 192, 192, 1)',
        pointRadius: 5,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'day' as const,
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Record Count',
        },
        ticks: {
          stepSize: 1,
          callback: function (value: string | number) {
            if (typeof value === 'number') {
              return value % 1 === 0 ? value : '';
            }
            return '';
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const date = context.raw.x;
            return `Date: ${new Date(date).toLocaleDateString()} - Count: ${context.raw.y}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Scatter data={scatterData} options={options} />;
};

export default ScatterChart;
