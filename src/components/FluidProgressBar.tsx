import { motion } from 'framer-motion';

interface FluidProgressBarProps {
    progress: number;
    color?: string;
    height?: number;
    className?: string;
}

export const FluidProgressBar = ({
    progress,
    color = '#38BDF8',
    height = 200,
    className = ''
}: FluidProgressBarProps) => {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div
            className={`relative w-8 bg-glass border border-white/5 rounded-full overflow-hidden ${className}`}
            style={{ height }}
        >
            {/* Background Track */}
            <div className="absolute inset-0 bg-slate-900/50" />

            {/* Fluid Fill */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 w-full"
                initial={{ height: 0 }}
                animate={{ height: `${clampedProgress}%` }}
                transition={{
                    type: "spring",
                    damping: 20,
                    stiffness: 60
                }}
                style={{ backgroundColor: color }}
            >
                {/* Wave Effect Overlay (CSS Animation) */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 fluid-wave opacity-50" />

                {/* Glow */}
                <div
                    className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/30 to-transparent blur-sm"
                />
            </motion.div>

            {/* Shine Reflection */}
            <div className="absolute top-0 left-1 w-2 h-full bg-gradient-to-b from-white/10 to-transparent rounded-full pointer-events-none" />
        </div>
    );
};
