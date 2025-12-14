
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import '../../../lib/chartSetup';

const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(10, 25, 41, 0.9)',
            titleColor: '#fff',
            bodyColor: '#94a3b8',
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1
        },
    },
    scales: {
        x: { display: false },
        y: { display: false, min: 0 },
    },
    elements: {
        line: { tension: 0.4 },
        point: { radius: 0, hoverRadius: 4 },
    },
};

export const EfficiencyChart = () => {
    const data: ChartData<'line'> = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                fill: true,
                label: 'Efficiency',
                data: [65, 59, 80, 81, 56, 55, 90],
                borderColor: '#76FF03', // Neon Green
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(118, 255, 3, 0.2)');
                    gradient.addColorStop(1, 'rgba(118, 255, 3, 0)');
                    return gradient;
                },
            },
            {
                fill: true,
                label: 'Workload',
                data: [28, 48, 40, 19, 86, 27, 50],
                borderColor: '#00F0FF', // Neon Blue
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.2)');
                    gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
                    return gradient;
                },
            }
        ],
    };

    return <Line options={options} data={data} />;
};
