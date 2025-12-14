import { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { CircularProgress } from '../../components/CircularProgress';
import { FluidProgressBar } from '../../components/FluidProgressBar';
import { SubjectChart } from '../../components/SubjectChart';
import { ActivityChart } from '../../components/ActivityChart';
import { ActivityHeatmap } from '../../components/ActivityHeatmap';
import { MagneticButton } from '../../components/MagneticButton';
import { PomodoroTimer } from '../focus/PomodoroTimer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Book, Flame, Timer, Trash2 } from 'lucide-react';



interface DashboardProps {
    onNavigate: (view: string, subjectId?: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
    const { subjects, totalProgress, isLoading, deleteSubject } = useStudy();
    const [showTimer, setShowTimer] = useState(false);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (isLoading) return <div className="p-8 text-center text-text-secondary">Loading study data...</div>;

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">

            {/* Header Section */}
            <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-2">
                        Study Dashboard
                    </h1>
                    <p className="text-text-secondary">Track your mastery across all subjects.</p>
                </div>

                {/* Overall Progress Card & Focus Button */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <MagneticButton
                        onClick={() => setShowTimer(true)}
                        className="group flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-primary-DEFAULT/10 border border-white/10 hover:border-primary-DEFAULT/50 rounded-xl transition-all"
                    >
                        <div className="p-2 rounded-lg bg-primary-DEFAULT/10 text-primary-DEFAULT group-hover:bg-primary-DEFAULT group-hover:text-white transition-colors">
                            <Timer size={24} />
                        </div>
                        <div className="text-left">
                            <div className="text-sm text-text-muted group-hover:text-primary-DEFAULT/80">Deep Work</div>
                            <div className="font-bold text-white">Start Focus</div>
                        </div>
                    </MagneticButton>

                    <div className="glass-panel p-4 flex items-center gap-6 pr-8">
                        <CircularProgress progress={totalProgress} size={80} strokeWidth={8} />
                        <div>
                            <div className="text-sm text-text-secondary mb-1">Total Mastery</div>
                            <div className="text-xl font-bold text-white">Keep going!</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Subjects Grid */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-heading font-semibold text-white flex items-center gap-2">
                        <Book className="text-primary-DEFAULT" size={20} />
                        Recent Subjects
                    </h2>
                    <button
                        onClick={() => onNavigate('subjects')}
                        className="text-sm text-primary-DEFAULT hover:text-primary-hover transition-colors"
                    >
                        View All
                    </button>
                </div>

                <motion.div
                    key={subjects.length}
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {subjects
                        .sort((a, b) => {
                            if (!a.lastActivity) return 1;
                            if (!b.lastActivity) return -1;
                            return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
                        })
                        .slice(0, 3)
                        .map((subject) => (
                            <motion.div
                                key={subject.id}
                                variants={item}
                                onClick={() => onNavigate('subject', subject.id)}
                                className="glass-panel glass-panel-hover p-6 cursor-pointer group relative overflow-hidden"
                            >
                                {/* Card Content */}
                                <div className="flex justify-between items-start mb-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                                        style={{ backgroundColor: subject.color }}
                                    >
                                        {subject.name.charAt(0)}
                                    </div>
                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Are you sure you want to delete this subject?')) {
                                                deleteSubject(subject.id);
                                            }
                                        }}
                                        className="z-10 p-2 text-text-disabled hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    {/* Visual Progress Indicator inside card */}
                                    <div className="absolute top-0 right-0 h-full w-24 opacity-10 pointer-events-none">
                                        {/* Abstract decoration based on color */}
                                        <div className="absolute top-[-20%] right-[-20%] w-32 h-32 rounded-full blur-xl" style={{ backgroundColor: subject.color }} />
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary-DEFAULT transition-colors">
                                    {subject.name}
                                </h3>

                                <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                                    <span>{subject.completedTasks}/{subject.totalTasks} Tasks</span>
                                    <span>•</span>
                                    <span>{subject.units.length} Units</span>
                                </div>

                                {/* Progress Bar & Action */}
                                <div className="flex items-end justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span style={{ color: subject.color }}>{subject.progress}%</span>
                                            <span className="text-text-muted">Progress</span>
                                        </div>
                                        {/* Horizontal Mini Bar for Card */}
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: subject.color }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${subject.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-DEFAULT group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
                                        <ArrowRight size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                    {/* 'Add New Subject' functionality moved to All Subjects page */}

                </motion.div>
            </section>

            {/* Analytics & Mastery Stack */}
            {/* Analytics Section */}
            <section className="pt-8 border-t border-white/5 space-y-8">
                {/* 1. Visual Mastery Stack */}
                <div>
                    <h2 className="text-xl font-heading font-semibold text-white mb-6 flex items-center gap-2">
                        <Flame className="text-orange-500" size={20} />
                        Visual Mastery Stack
                    </h2>
                    <div className="h-64 flex items-end justify-start gap-8 px-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        {subjects.map((subject) => (
                            <div key={subject.id} className="flex flex-col items-center gap-3 flex-shrink-0">
                                <FluidProgressBar
                                    progress={subject.progress}
                                    color={subject.color}
                                    height={200}
                                    className="w-12 lg:w-16"
                                />
                                <span className="text-xs font-medium text-text-secondary truncate max-w-[80px] text-center">
                                    {subject.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid for Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* 2. Analytics (Subject Mastery) */}
                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-medium text-text-secondary mb-4">Subject Mastery</h3>
                        <SubjectChart />
                    </div>

                    {/* 3. Study Activity */}
                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-medium text-text-secondary mb-4">Study Activity (Last 7 Days)</h3>
                        <ActivityChart />
                    </div>
                </div>

                {/* 4. Study Distribution (Full Width) */}
                <div className="glass-panel p-6">
                    <h3 className="text-sm font-medium text-text-secondary mb-4">Study Distribution (Year)</h3>
                    <ActivityHeatmap />
                </div>
            </section>

            <AnimatePresence>
                {showTimer && <PomodoroTimer onClose={() => setShowTimer(false)} />}
            </AnimatePresence>

        </div>
    );
};
