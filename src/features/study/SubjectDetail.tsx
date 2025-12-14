import { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ChevronDown, Circle, Trash2, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { format, isPast, isToday, parseISO } from 'date-fns';
import { MarkdownEditor } from '../../components/MarkdownEditor';

interface SubjectDetailProps {
    subjectId: string;
    onBack: () => void;
}

export const SubjectDetail = ({ subjectId, onBack }: SubjectDetailProps) => {
    const { subjects, toggleSubtask, addUnit, addSubtask, deleteSubtask, updateSubtaskDeadline, updateUnitNotes } = useStudy();
    const subject = subjects.find(s => s.id === subjectId);
    const [expandedUnits, setExpandedUnits] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<Record<string, 'tasks' | 'notes'>>({});
    const [newUnitName, setNewUnitName] = useState('');
    const [newTaskNames, setNewTaskNames] = useState<Record<string, string>>({});

    if (!subject) return <div>Subject not found</div>;

    const toggleUnit = (unitId: string) => {
        setExpandedUnits(prev =>
            prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
        );
    };

    const handleAddUnit = () => {
        if (!newUnitName.trim()) return;
        addUnit(subject.id, newUnitName);
        setNewUnitName('');
    };

    const handleAddTask = (unitId: string) => {
        const title = newTaskNames[unitId];
        if (!title?.trim()) return;
        addSubtask(subject.id, unitId, title);
        setNewTaskNames(prev => ({ ...prev, [unitId]: '' }));
    };

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </button>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg"
                            style={{ backgroundColor: subject.color }}
                        >
                            {subject.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-white">{subject.name}</h1>
                            <p className="text-text-secondary">{subject.units.length} Units • {subject.completedTasks}/{subject.totalTasks} Tasks Completed</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 min-w-[300px]">
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-white">Overall Progress</span>
                                <span style={{ color: subject.color }} className="font-bold">{subject.progress}%</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: subject.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${subject.progress}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Units List */}
            <div className="space-y-4">
                {subject.units.map((unit) => (
                    <motion.div
                        key={unit.id}
                        layout
                        className="glass-panel overflow-hidden"
                    >
                        {/* Unit Header */}
                        <div
                            onClick={() => toggleUnit(unit.id)}
                            className="p-4 lg:p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <motion.div
                                    animate={{ rotate: expandedUnits.includes(unit.id) ? 180 : 0 }}
                                    className="text-text-secondary"
                                >
                                    <ChevronDown size={20} />
                                </motion.div>

                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                        {unit.name}
                                        {unit.completed && (
                                            <span className="px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-500 border border-green-500/20">
                                                COMPLETED
                                            </span>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-emerald-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${unit.progress}%` }}
                                            />
                                        </div>
                                        <span>{unit.progress}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content Area */}
                        <AnimatePresence>
                            {expandedUnits.includes(unit.id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/5 bg-black/20"
                                >
                                    <div className="p-4 lg:p-6 space-y-4">

                                        <div className="flex gap-4 border-b border-white/5 pb-2">
                                            <button
                                                onClick={() => setActiveTab(prev => ({ ...prev, [unit.id]: 'tasks' }))}
                                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${(!activeTab[unit.id] || activeTab[unit.id] === 'tasks')
                                                    ? 'text-white border-primary-DEFAULT'
                                                    : 'text-text-muted border-transparent hover:text-white'
                                                    }`}
                                            >
                                                Tasks
                                            </button>
                                            <button
                                                onClick={() => setActiveTab(prev => ({ ...prev, [unit.id]: 'notes' }))}
                                                className={`text-sm font-medium pb-1 border-b-2 transition-colors ${activeTab[unit.id] === 'notes'
                                                    ? 'text-white border-primary-DEFAULT'
                                                    : 'text-text-muted border-transparent hover:text-white'
                                                    }`}
                                            >
                                                Notes
                                            </button>
                                        </div>

                                        {/* Subtasks List */}
                                        {(!activeTab[unit.id] || activeTab[unit.id] === 'tasks') && (
                                            <div className="space-y-3">
                                                {unit.subtasks.map((task) => (
                                                    <motion.div
                                                        key={task.id}
                                                        layout
                                                        className="flex flex-col lg:flex-row lg:items-center justify-between group p-3 rounded-lg hover:bg-white/5 transition-colors gap-3"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <div
                                                                onClick={() => toggleSubtask(subject.id, unit.id, task.id)}
                                                                className={`cursor-pointer transition-colors ${task.completed ? 'text-green-500' : 'text-text-disabled hover:text-white'}`}
                                                            >
                                                                {task.completed ? <CheckCircle2 size={22} className="fill-green-500/10" /> : <Circle size={22} />}
                                                            </div>

                                                            <div className="flex flex-col min-w-0">
                                                                <span className={`${task.completed ? 'text-text-muted line-through' : 'text-white'} transition-all truncate`}>
                                                                    {task.title}
                                                                </span>
                                                                {task.completed && task.completedAt && (
                                                                    <span className="text-xs text-text-disabled">
                                                                        Completed {format(parseISO(task.completedAt), 'MMM d, h:mm a')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-4 ml-8 lg:ml-0">
                                                            {/* Deadline Picker */}
                                                            <div className="relative group/date">
                                                                <button className={`
                                                            flex items-center gap-1.5 text-xs px-2 py-1 rounded-md border transition-all
                                                            ${task.deadline
                                                                        ? isPast(parseISO(task.deadline)) && !isToday(parseISO(task.deadline)) && !task.completed
                                                                            ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                                            : isToday(parseISO(task.deadline)) && !task.completed
                                                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                                                : 'bg-white/5 text-text-secondary border-white/10 hover:border-white/20'
                                                                        : 'text-text-disabled border-transparent hover:bg-white/5'
                                                                    }
                                                        `}>
                                                                    <CalendarIcon size={12} />
                                                                    {task.deadline
                                                                        ? format(parseISO(task.deadline), 'MMM d')
                                                                        : <span className="opacity-0 group-hover/date:opacity-100 transition-opacity">Add Date</span>
                                                                    }
                                                                </button>
                                                                <input
                                                                    type="date"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                    onChange={(e) => updateSubtaskDeadline(subject.id, unit.id, task.id, e.target.value)}
                                                                />
                                                            </div>

                                                            <button
                                                                onClick={() => deleteSubtask(subject.id, unit.id, task.id)}
                                                                className="text-text-disabled hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                {/* Add Task Input */}
                                                <div className="flex items-center gap-3 mt-4 pt-2 border-t border-white/5">
                                                    <Plus size={20} className="text-primary-DEFAULT" />
                                                    <input
                                                        type="text"
                                                        placeholder="Add a new subtask..."
                                                        className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder:text-text-muted flex-1"
                                                        value={newTaskNames[unit.id] || ''}
                                                        onChange={(e) => setNewTaskNames(prev => ({ ...prev, [unit.id]: e.target.value }))}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTask(unit.id)}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Notes Editor */}
                                        {activeTab[unit.id] === 'notes' && (
                                            <div className="min-h-[300px]">
                                                <MarkdownEditor
                                                    initialValue={unit.notes || ''}
                                                    onSave={(val) => updateUnitNotes(subject.id, unit.id, val)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}

                {/* Add Unit Section */}
                <div className="glass-panel p-4 flex items-center gap-3 border-dashed border-white/20 hover:border-primary-DEFAULT/50 transition-colors">
                    <Plus size={20} className="text-primary-DEFAULT" />
                    <input
                        type="text"
                        placeholder="Add new unit..."
                        className="bg-transparent border-none text-white focus:ring-0 placeholder:text-text-muted flex-1 p-0"
                        value={newUnitName}
                        onChange={(e) => setNewUnitName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddUnit()}
                    />
                    <button
                        onClick={handleAddUnit}
                        className="text-xs bg-primary-DEFAULT/10 text-primary-DEFAULT px-3 py-1.5 rounded-lg hover:bg-primary-DEFAULT hover:text-white transition-colors"
                    >
                        Add Unit
                    </button>
                </div>

            </div >
        </div >
    );
};
