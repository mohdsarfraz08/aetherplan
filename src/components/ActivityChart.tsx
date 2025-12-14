import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useStudy } from '../context/StudyContext';
import { format, subDays, parseISO, isSameDay } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export const ActivityChart = () => {
    const { subjects } = useStudy();

    // Generate last 7 days labels
    const days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
            date,
            label: format(date, 'MMM d')
        };
    });

    // Calculate completed tasks for each day
    const completionData = days.map(day => {
        let count = 0;
        subjects.forEach(subject => {
            subject.units.forEach(unit => {
                unit.subtasks.forEach(task => {
                    if (task.completed && task.completedAt) {
                        if (isSameDay(parseISO(task.completedAt), day.date)) {
                            count++;
                        }
                    }
                });
            });
        });
        return count;
    });

    const data = {
        labels: days.map(d => d.label),
        datasets: [
            {
                fill: true,
                label: 'Tasks Completed',
                data: completionData,
                borderColor: '#38BDF8',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                tension: 0.4,
                pointBackgroundColor: '#38BDF8',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: '#0F172A',
                titleColor: '#F8FAFC',
                bodyColor: '#94A3B8',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#64748B',
                    stepSize: 1,
                    precision: 0
                },
                beginAtZero: true
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748B'
                }
            }
        }
    };

    return (
        <div className="h-[250px] w-full">
            <Line options={options} data={data} />
        </div>
    );
};
