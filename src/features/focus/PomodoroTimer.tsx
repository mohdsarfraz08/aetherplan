import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Target, Volume2, VolumeX } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { audio } from '../../lib/audio';

interface PomodoroTimerProps {
    onClose: () => void;
}

export const PomodoroTimer = ({ onClose }: PomodoroTimerProps) => {
    const { awardXP } = useStudy();
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
    const [isActive, setIsActive] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(false);

    // Audio Toggle Effect
    useEffect(() => {
        audio.toggleBrownNoise(isActive && soundEnabled);
        return () => audio.toggleBrownNoise(false);
    }, [isActive, soundEnabled]);

    useEffect(() => {
        let interval: number;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            audio.toggleBrownNoise(false);
            audio.playLevelUp(); // Success sound

            if (mode === 'focus') {
                awardXP(1000); // Big reward for focus
            }
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode, awardXP]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        if (mode === 'focus') setTimeLeft(25 * 60);
        if (mode === 'short') setTimeLeft(5 * 60);
        if (mode === 'long') setTimeLeft(15 * 60);
    };

    const changeMode = (newMode: 'focus' | 'short' | 'long') => {
        setMode(newMode);
        setIsActive(false);
        if (newMode === 'focus') setTimeLeft(25 * 60);
        if (newMode === 'short') setTimeLeft(5 * 60);
        if (newMode === 'long') setTimeLeft(15 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = mode === 'focus'
        ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
        : mode === 'short'
            ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
            : ((15 * 60 - timeLeft) / (15 * 60)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#0F172A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Ambient Glow */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r 
          ${mode === 'focus' ? 'from-transparent via-primary-DEFAULT to-transparent' :
                        mode === 'short' ? 'from-transparent via-green-500 to-transparent' :
                            'from-transparent via-blue-500 to-transparent'
                    }`}
                />

                <div className="flex flex-col items-center">

                    {/* Header & Mode Switcher */}
                    <div className="flex bg-white/5 p-1 rounded-xl mb-8">
                        {(['focus', 'short', 'long'] as const).map((m) => (
                            <button
                                key={m}
                                onClick={() => changeMode(m)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m
                                    ? 'bg-white/10 text-white shadow-sm'
                                    : 'text-text-secondary hover:text-white'
                                    }`}
                            >
                                {m === 'focus' ? 'Focus' : m === 'short' ? 'Short Break' : 'Long Break'}
                            </button>
                        ))}
                    </div>

                    {/* Timer Display */}
                    <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                        {/* SVG Circle Progress */}
                        <svg className="absolute w-full h-full transform -rotate-90">
                            <circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="8"
                                fill="none"
                            />
                            <motion.circle
                                cx="128"
                                cy="128"
                                r="120"
                                stroke={mode === 'focus' ? '#38BDF8' : mode === 'short' ? '#22C55E' : '#3B82F6'}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
                                strokeLinecap="round"
                                initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 120 * (1 - progress / 100) }}
                                transition={{ duration: 1, ease: "linear" }}
                            />
                        </svg>

                        <div className="text-center z-10">
                            <div className="text-6xl font-heading font-bold text-white tabular-nums tracking-tighter">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-text-secondary mt-2 flex items-center justify-center gap-2">
                                <Target size={14} />
                                <span>{isActive ? 'Stay focused' : 'Ready to start?'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={`p-4 rounded-full transition-all ${soundEnabled ? 'bg-primary-DEFAULT/10 text-primary-DEFAULT' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                            title="Toggle Brown Noise"
                        >
                            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
                        </button>

                        <button
                            onClick={toggleTimer}
                            className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
                        </button>

                        <button
                            onClick={resetTimer}
                            className="p-4 rounded-full text-text-secondary hover:bg-white/5 hover:text-white transition-all"
                        >
                            <RotateCcw size={24} />
                        </button>
                    </div>

                </div>

            </motion.div>
        </motion.div>
    );
};
