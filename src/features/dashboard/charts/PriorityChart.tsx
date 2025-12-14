
import { Doughnut } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import '../../../lib/chartSetup';

const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
        legend: { display: false },
    },
    elements: {
        arc: { borderWidth: 0 }
    }
};

export const PriorityChart = () => {
    const data: ChartData<'doughnut'> = {
        labels: ['Critical', 'High', 'Medium'],
        datasets: [
            {
                data: [12, 19, 8],
                backgroundColor: [
                    '#00F0FF', // Neon Blue
                    '#76FF03', // Lime
                    '#1e293b', // Dark
                ],
                hoverOffset: 4
            },
        ],
    };

    return <Doughnut options={options} data={data} />;
};
