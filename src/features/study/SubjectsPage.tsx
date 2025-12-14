import { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Book, Plus, ArrowRight, Trash2, Check, X } from 'lucide-react';

const COLORS = ['#38BDF8', '#F472B6', '#A78BFA', '#34D399', '#FBBF24', '#FB7185'];

interface SubjectsPageProps {
    onNavigate: (view: string, subjectId?: string) => void;
}

export const SubjectsPage = ({ onNavigate }: SubjectsPageProps) => {
    const { subjects, addSubject, deleteSubject } = useStudy();
    const [isAdding, setIsAdding] = useState(false);
    const [newSubjectName, setNewSubjectName] = useState('');

    const handleCreateSubject = () => {
        if (!newSubjectName.trim()) return;
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        addSubject(newSubjectName, color);
        setNewSubjectName('');
        setIsAdding(false);
    };

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

    return (
        <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div>
                <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-2">
                            All Subjects
                        </h1>
                        <p className="text-text-secondary">Manage and track all your learning paths.</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-primary-DEFAULT text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} />
                        Add Subject
                    </button>
                </div>
            </div>

            {/* Subjects Grid */}
            <motion.div
                key={subjects.length}
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                {/* Add New Subject Card (Visible when adding) */}
                <AnimatePresence>
                    {isAdding && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white/5 border border-primary-DEFAULT rounded-xl p-6 flex flex-col items-center justify-center min-h-[180px]"
                        >
                            <div className="w-full space-y-4" onClick={e => e.stopPropagation()}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Subject Name"
                                    className="w-full bg-black/20 text-white border border-white/10 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary-DEFAULT text-center"
                                    value={newSubjectName}
                                    onChange={(e) => setNewSubjectName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleCreateSubject();
                                        if (e.key === 'Escape') setIsAdding(false);
                                    }}
                                />
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={handleCreateSubject}
                                        className="p-2 bg-primary-DEFAULT text-white rounded-lg hover:bg-primary-hover"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => setIsAdding(false)}
                                        className="p-2 bg-white/10 text-text-secondary rounded-lg hover:bg-white/20"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {subjects.map((subject) => (
                    <motion.div
                        key={subject.id}
                        variants={item}
                        layout
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
            </motion.div>
        </div>
    );
};
