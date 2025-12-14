import React from 'react';
import { Bar } from 'react-chartjs-2';
import '../lib/chartSetup';
import { useStudy } from '../context/StudyContext';

export const SubjectChart = () => {
    const { subjects } = useStudy();

    const data = {
        labels: subjects.map(s => s.name),
        datasets: [
            {
                label: 'Mastery %',
                data: subjects.map(s => s.progress),
                backgroundColor: subjects.map(s => s.color),
                borderRadius: 8,
                barThickness: 40,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1E293B',
                titleColor: '#F8FAFC',
                bodyColor: '#F8FAFC',
                padding: 10,
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#94A3B8',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94A3B8',
                }
            }
        },
    };

    return (
        <div className="h-[300px] w-full">
            <Bar data={data} options={options} />
        </div>
    );
};
