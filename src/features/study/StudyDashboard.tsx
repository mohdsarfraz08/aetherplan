import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Plus,
    CheckCircle2,
    TrendingUp,
    AlertCircle,
    BarChart3,
    MoreHorizontal,
    Calendar
} from 'lucide-react';

// --- Types ---
interface Subtask {
    id: string | number;
    title: string;
    done: boolean;
}

interface Unit {
    id: number;
    title: string;
    completed: boolean;
    subtasks: Subtask[];
}

interface Subject {
    id: number;
    name: string;
    progress: number;
    color: string;
    units: Unit[];
}

// --- 🎨 DESIGN SYSTEM CONSTANTS ---
const COLORS = {
    bg: 'bg-[#0F172A]',
    card: 'bg-[#1E293B]',
    primary: 'bg-[#38BDF8]',
    textPrimary: 'text-[#38BDF8]',
    success: 'bg-[#22C55E]',
    textSuccess: 'text-[#22C55E]',
    warning: 'bg-[#FACC15]',
    danger: 'bg-[#EF4444]',
    textLight: 'text-[#F8FAFC]',
    textDim: 'text-[#94A3B8]',
    border: 'border-white/10'
};

// --- 💾 MOCK DATA ---
const INITIAL_DATA: Subject[] = [
    {
        id: 1,
        name: 'Python Masterclass',
        progress: 68,
        color: 'from-blue-400 to-cyan-300',
        units: [
            { id: 101, title: 'Data Types & Variables', completed: true, subtasks: [] },
            { id: 102, title: 'Loops & Conditionals', completed: true, subtasks: [] },
            {
                id: 103, title: 'Object Oriented Prog.', completed: false, subtasks: [
                    { id: 's1', title: 'Classes & Objects', done: true },
                    { id: 's2', title: 'Inheritance', done: false },
                    { id: 's3', title: 'Polymorphism', done: false }
                ]
            }
        ]
    },
    {
        id: 2,
        name: 'Mathematics',
        progress: 42,
        color: 'from-purple-400 to-pink-300',
        units: [
            { id: 201, title: 'Calculus I', completed: true, subtasks: [] },
            {
                id: 202, title: 'Linear Algebra', completed: false, subtasks: [
                    { id: 'm1', title: 'Matrices', done: false },
                    { id: 'm2', title: 'Eigenvalues', done: false }
                ]
            }
        ]
    },
    {
        id: 3,
        name: 'DSA (Algorithms)',
        progress: 85,
        color: 'from-emerald-400 to-teal-300',
        units: []
    }
];

// --- 🧩 COMPONENTS ---

// 1. Fluid Progress Bar
const FluidBar = ({ percentage, color, height = "h-3" }: { percentage: number, color: string, height?: string }) => {
    return (
        <div className={`w-full ${height} bg-slate-700/30 rounded-full overflow-hidden backdrop-blur-sm border ${COLORS.border} relative`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={`h-full absolute top-0 left-0 bg-gradient-to-r ${color}`}
            >
                {/* Shimmer/Glass Effect Overlay */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/20 blur-[1px]" />
            </motion.div>
        </div>
    );
};

// 2. Circular Progress
const CircularProgress = ({ percentage }: { percentage: number }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center w-40 h-40 mx-auto mb-6">
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    cx="80" cy="80" r={radius}
                    stroke="#1E293B" strokeWidth="12" fill="transparent"
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    cx="80" cy="80" r={radius}
                    stroke="#38BDF8" strokeWidth="12" fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute text-center">
                <span className={`text-4xl font-bold font-poppins ${COLORS.textLight}`}>{percentage}%</span>
                <p className={`text-xs ${COLORS.textDim} mt-1`}>Overall Completion</p>
            </div>
        </div>
    );
};

// 3. Subject Card
const SubjectCard = ({ subject, onClick }: { subject: Subject; onClick: (s: Subject) => void }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(subject)}
        className={`${COLORS.card} p-5 rounded-2xl border ${COLORS.border} shadow-lg cursor-pointer flex flex-col gap-3 group`}
    >
        <div className="flex justify-between items-center">
            <h3 className={`font-semibold text-lg ${COLORS.textLight}`}>{subject.name}</h3>
            <span className={`${COLORS.textDim} text-sm group-hover:text-white transition-colors`}>{subject.progress}%</span>
        </div>
        <FluidBar percentage={subject.progress} color={subject.color} height="h-4" />
        <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-slate-500">Last study: 2h ago</span>
            <div className="flex -space-x-2">
                {/* Micro visualizations of units */}
                <div className="w-2 h-2 rounded-full bg-blue-500/50" />
                <div className="w-2 h-2 rounded-full bg-blue-500/30" />
            </div>
        </div>
    </motion.div>
);

// 4. Modal (Add Task)
const AddTaskModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className={`${COLORS.card} w-full max-w-md rounded-2xl border ${COLORS.border} p-6 shadow-2xl`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-bold ${COLORS.textLight}`}>New Study Goal</h2>
                    <button onClick={onClose} className={COLORS.textDim}>Close</button>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className={`text-xs uppercase font-bold tracking-wider ${COLORS.textDim}`}>Subject</label>
                        <input type="text" placeholder="e.g. Quantum Physics" className="w-full mt-2 bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500 transition-colors" />
                    </div>
                    <div>
                        <label className={`text-xs uppercase font-bold tracking-wider ${COLORS.textDim}`}>Deadline</label>
                        <input type="date" className="w-full mt-2 bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-sky-500" />
                    </div>
                    <button type="button" onClick={onClose} className="w-full py-4 mt-4 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl text-white font-bold shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 transition-all">
                        Create Task
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export const StudyDashboard = () => {
    const [view, setView] = useState<'dashboard' | 'detail'>('dashboard');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjects] = useState<Subject[]>(INITIAL_DATA); // State is unused currently for updates, removed setter

    // Helper to open detail view
    const openSubject = (subject: Subject) => {
        setSelectedSubject(subject);
        setView('detail');
    };

    // Helper to toggle a subtask (Mock logic)
    const toggleSubtask = (unitId: number, subtaskId: string | number) => {
        // In a real app, this would update deep state and recalculate percentages
        console.log(`Toggled ${subtaskId} in unit ${unitId}`);
    };

    return (
        <div className={`min-h-full ${COLORS.bg} font-sans selection:bg-sky-500/30`}>

            {/* --- HEADER --- */}
            <header className="p-6 flex justify-between items-center sticky top-0 z-10 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/5 rounded-b-xl">
                {view === 'dashboard' ? (
                    <div>
                        <h1 className={`text-2xl font-bold font-poppins ${COLORS.textLight}`}>Hello, Alex 👋</h1>
                        <p className={COLORS.textDim}>Let's crush some goals today.</p>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setView('dashboard')}
                            className="p-2 rounded-full hover:bg-white/5 transition-colors text-white"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h1 className={`text-xl font-bold font-poppins ${COLORS.textLight}`}>{selectedSubject?.name}</h1>
                    </div>
                )}
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-purple-500 border-2 border-slate-800" />
            </header>

            {/* --- CONTENT AREA --- */}
            <main className="p-6 max-w-lg mx-auto pb-24">
                <AnimatePresence mode='wait'>

                    {/* VIEW: DASHBOARD */}
                    {view === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* Overall Progress */}
                            <section className="text-center">
                                <CircularProgress percentage={68} />

                                {/* Quick Stats Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className={`${COLORS.card} p-3 rounded-xl border ${COLORS.border} flex flex-col items-center gap-1`}>
                                        <CheckCircle2 size={20} className="text-green-400" />
                                        <span className="text-xl font-bold text-white">12</span>
                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Done</span>
                                    </div>
                                    <div className={`${COLORS.card} p-3 rounded-xl border ${COLORS.border} flex flex-col items-center gap-1`}>
                                        <AlertCircle size={20} className="text-yellow-400" />
                                        <span className="text-xl font-bold text-white">4</span>
                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Pending</span>
                                    </div>
                                    <div className={`${COLORS.card} p-3 rounded-xl border ${COLORS.border} flex flex-col items-center gap-1`}>
                                        <TrendingUp size={20} className="text-sky-400" />
                                        <span className="text-xl font-bold text-white">2.5h</span>
                                        <span className="text-[10px] uppercase text-slate-500 font-bold">Focus</span>
                                    </div>
                                </div>
                            </section>

                            {/* Subject List */}
                            <section>
                                <div className="flex justify-between items-end mb-4">
                                    <h2 className={`text-lg font-bold ${COLORS.textLight}`}>Current Subjects</h2>
                                    <button className="text-sky-400 text-sm font-medium hover:text-sky-300">View Analytics</button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {subjects.map(subject => (
                                        <SubjectCard key={subject.id} subject={subject} onClick={openSubject} />
                                    ))}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {/* VIEW: DETAIL */}
                    {view === 'detail' && selectedSubject && (
                        <motion.div
                            key="detail"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            {/* Detail Header */}
                            <div className={`${COLORS.card} p-6 rounded-2xl border ${COLORS.border} relative overflow-hidden`}>
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${selectedSubject.color}`} />
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Progress</h2>
                                        <p className="text-slate-400 text-sm">You're crushing it!</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-bold text-white">{selectedSubject.progress}%</span>
                                    </div>
                                </div>
                                <FluidBar percentage={selectedSubject.progress} color={selectedSubject.color} height="h-3" />
                            </div>

                            {/* Units List (Accordion-ish) */}
                            <div className="space-y-4">
                                <h3 className={`text-lg font-bold ${COLORS.textLight}`}>Units & Tasks</h3>

                                {selectedSubject.units.length === 0 && (
                                    <div className="text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                                        No units added yet.
                                    </div>
                                )}

                                {selectedSubject.units.map((unit) => (
                                    <div key={unit.id} className={`${COLORS.card} rounded-xl border ${COLORS.border} overflow-hidden`}>
                                        {/* Unit Header */}
                                        <div className="p-4 flex justify-between items-center bg-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${unit.completed ? COLORS.success : 'bg-slate-500'}`} />
                                                <span className={`font-semibold ${unit.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                                                    {unit.title}
                                                </span>
                                            </div>
                                            {unit.completed && <CheckCircle2 size={18} className="text-green-500" />}
                                        </div>

                                        {/* Subtasks */}
                                        {unit.subtasks.length > 0 && (
                                            <div className="p-4 pt-2 border-t border-white/5 space-y-3">
                                                {unit.subtasks.map(task => (
                                                    <div
                                                        key={task.id}
                                                        onClick={() => toggleSubtask(unit.id, task.id)}
                                                        className="flex items-center gap-3 cursor-pointer group"
                                                    >
                                                        {task.done ? (
                                                            <div className="w-5 h-5 rounded border border-green-500 bg-green-500/20 flex items-center justify-center text-green-500">
                                                                <CheckCircle2 size={14} />
                                                            </div>
                                                        ) : (
                                                            <div className="w-5 h-5 rounded border border-slate-600 group-hover:border-sky-400 transition-colors" />
                                                        )}
                                                        <span className={`text-sm ${task.done ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                                                            {task.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            {/* --- FLOATING ACTION BUTTON --- */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-sky-500 rounded-full flex items-center justify-center shadow-lg shadow-sky-500/30 text-white z-40"
            >
                <Plus size={28} />
            </motion.button>

            {/* --- MODAL --- */}
            <AnimatePresence>
                {isModalOpen && <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
            </AnimatePresence>

            {/* --- BOTTOM NAV (Mobile) --- */}
            {/* Keeping it in case user resizes to mobile, or we could hide it if Sidebar is always present.
                Given Layout has a sidebar, this might be redundant on Desktop but useful on mobile within the view.
                However, Layout's sidebar is fixed. This bottom nav is also fixed.
                To avoid conflict, I will hide this bottom nav on sm screens if the Sidebar covers it,
                BUT the existing code shows it `sm:hidden` which means it SHOWS on mobile and HIDES on desktop.
                The Layout sidebar is `w-20` and fixed.
                Let's keep it consistent.
            */}
            <nav className="fixed bottom-0 w-full bg-[#0F172A]/90 backdrop-blur-lg border-t border-white/5 p-4 flex justify-around items-center z-30 sm:hidden">
                <div className="flex flex-col items-center gap-1 text-sky-400">
                    <BarChart3 size={20} />
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-500">
                    <Calendar size={20} />
                </div>
                <div className="w-10"></div> {/* Spacer for FAB */}
                <div className="flex flex-col items-center gap-1 text-slate-500">
                    <TrendingUp size={20} />
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-500">
                    <MoreHorizontal size={20} />
                </div>
            </nav>
        </div>
    );
}
