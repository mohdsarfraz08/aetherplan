import { motion } from 'framer-motion';

interface CircularProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
}

export const CircularProgress = ({
    progress,
    size = 120,
    strokeWidth = 12,
    color = '#38BDF8'
}: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center p-4">
            {/* Background Glow */}
            <div
                className="absolute inset-0 rounded-full blur-2xl opacity-20"
                style={{ background: color }}
            />

            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90 z-10"
            >
                {/* Track */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Indicator */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>

            {/* Text Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <span className="text-3xl font-bold font-heading text-white">
                    {Math.round(progress)}%
                </span>
                <span className="text-xs text-text-secondary uppercase tracking-wider">
                    Mastery
                </span>
            </div>
        </div>
    );
};
