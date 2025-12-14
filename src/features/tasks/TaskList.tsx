import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { Plus, Search, Filter, Calendar } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import type { Priority, Status, Task } from '../../types';
import { TaskModal } from './TaskModal';

const PriorityChip = ({ priority }: { priority: Priority }) => {
    const styles: Record<Priority, { bg: string; text: string; dot: string }> = {
        Critical: { 
            bg: 'bg-[var(--accent-red)]/10', 
            text: 'text-[var(--accent-red)]',
            dot: 'priority-critical'
        },
        High: { 
            bg: 'bg-[var(--accent-orange)]/10', 
            text: 'text-[var(--accent-orange)]',
            dot: 'priority-high'
        },
        Medium: { 
            bg: 'bg-[var(--accent-yellow)]/10', 
            text: 'text-[var(--accent-yellow)]',
            dot: 'priority-medium'
        },
        Low: { 
            bg: 'bg-[var(--accent-green)]/10', 
            text: 'text-[var(--accent-green)]',
            dot: 'priority-low'
        },
    };
    const style = styles[priority];
    return (
        <span className={`badge ${style.bg} ${style.text} border border-current/20 inline-flex items-center gap-1.5`}>
            <span className={`priority-dot ${style.dot}`} />
            {priority}
        </span>
    );
};

const StatusChip = ({ status }: { status: Status }) => {
    const styles: Record<Status, string> = {
        'To Do': 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-color)]',
        'In Progress': 'bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30',
        'In Review': 'bg-[var(--accent-purple)]/10 text-[var(--accent-purple)] border border-[var(--accent-purple)]/30',
        'Blocked': 'bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/30',
        'On Hold': 'bg-[var(--accent-yellow)]/10 text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/30',
        'Complete': 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/30',
    };
    return (
        <span className={`badge ${styles[status]}`}>
            {status}
        </span>
    );
};

export const TaskList: React.FC = () => {
    const { tasks, filters, setFilter } = useTaskContext();
    const [showModal, setShowModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const filteredTasks = tasks.filter(task => {
        if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        if (filters.priority !== 'All' && task.priority !== filters.priority) return false;
        return true;
    });

    const handleCreate = () => {
        setSelectedTask(null);
        setShowModal(true);
    };

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-[1800px] mx-auto">
            <TaskModal isOpen={showModal} onClose={() => setShowModal(false)} task={selectedTask} />

            {/* Page Header */}
            <div className="mb-3">
                <PageHeader
                    title="Tasks"
                    subtitle="Manage your tasks and track progress"
                    actions={<button className="btn btn-primary flex items-center gap-2 px-4 py-2 text-sm" onClick={handleCreate}><Plus size={16} /> New Task</button>}
                />
            </div>


            {/* Filters Section */}
            <div className="card p-4 rounded-xl flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[280px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="w-full pl-10 pr-4 py-2.5 text-sm"
                        value={filters.search}
                        onChange={(e) => setFilter('search', e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Filter size={18} className="text-[var(--text-muted)]" />
                    <select
                        className="text-sm min-w-[150px]"
                        value={filters.priority}
                        onChange={(e) => setFilter('priority', e.target.value)}
                    >
                        <option value="All">All Priorities</option>
                        <option value="Critical">Critical</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            {/* Task List */}
            <div className="space-y-3">
                {/* Header Row (Hidden on mobile) */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)]">
                    <div className="col-span-5">Task</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-2">Due Date</div>
                    <div className="col-span-1 text-right">Progress</div>
                </div>

                {filteredTasks.length === 0 ? (
                    <div className="card p-8 rounded-xl text-center">
                        <p className="text-[var(--text-muted)]">No tasks found. Create a new task to get started.</p>
                    </div>
                ) : (
                    filteredTasks.map((task, index) => (
                        <div
                            key={task.id}
                            className="card md:grid grid-cols-12 gap-4 items-center p-4 rounded-xl antigravity-hover cursor-pointer animate-slide-up group"
                            style={{ animationDelay: `${index * 30}ms` }}
                            onClick={() => handleEdit(task)}
                        >
                            {/* Title & Description */}
                            <div className="col-span-12 md:col-span-5 mb-4 md:mb-0">
                                <h3 className="font-semibold text-[var(--text-primary)] text-[15px] group-hover:text-[var(--accent-blue)] transition-colors mb-1.5">
                                    {task.title}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{task.description}</p>
                            </div>

                            {/* Status */}
                            <div className="col-span-6 md:col-span-2 flex items-center">
                                <StatusChip status={task.status} />
                            </div>

                            {/* Priority */}
                            <div className="col-span-6 md:col-span-2 flex items-center">
                                <PriorityChip priority={task.priority} />
                            </div>

                            {/* Due Date */}
                            <div className="col-span-6 md:col-span-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                <Calendar size={16} className="text-[var(--text-muted)]" />
                                <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="col-span-12 md:col-span-1 flex flex-col items-end">
                                <div className="w-full md:w-24">
                                    <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-2 font-medium">
                                        <span>{task.actualTime}h</span>
                                        <span>/ {task.estimatedTime}h</span>
                                    </div>
                                    <div className="w-full bg-[var(--bg-tertiary)] h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-green)] transition-all duration-700 rounded-full"
                                            style={{ width: `${Math.min((task.actualTime / Math.max(task.estimatedTime, 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
