import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTaskContext } from '../../context/TaskContext';
import type { Task, Priority, Status } from '../../types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: Task | null; // If null, creating new task
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task }) => {
    const { addTask, updateTask, users, tasks } = useTaskContext();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium' as Priority,
        status: 'To Do' as Status,
        dueDate: new Date().toISOString().split('T')[0],
        assignee: users[0]?.id || '',
        estimatedTime: 1,
        dependencies: [] as string[],
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: new Date(task.dueDate).toISOString().split('T')[0],
                assignee: task.assignee,
                estimatedTime: task.estimatedTime,
                dependencies: task.dependencies,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                priority: 'Medium',
                status: 'To Do',
                dueDate: new Date().toISOString().split('T')[0],
                assignee: users[0]?.id || '',
                estimatedTime: 1,
                dependencies: [],
            });
        }
    }, [task, isOpen, users]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (task) {
            updateTask(task.id, formData);
        } else {
            addTask({
                ...formData,
                actualTime: 0,
                dependencies: formData.dependencies,
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in p-4" onClick={onClose}>
            <div 
                className="w-full max-w-2xl bg-[var(--bg-elevated)] border border-[var(--border-color)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-[var(--border-color)]">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                            {task ? 'Edit Task' : 'Create New Task'}
                        </h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">
                            {task ? 'Update task details' : 'Add a new task to your list'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6 custom-scrollbar">

                    {/* Title & Description */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                Task Title
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full text-base font-medium"
                                placeholder="Enter task title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                Description
                            </label>
                            <textarea
                                rows={4}
                                className="w-full resize-none text-sm"
                                placeholder="Add a description..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Grid of fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                Priority
                            </label>
                            <select
                                className="w-full text-sm"
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: e.target.value as Priority })}
                            >
                                <option value="Critical">Critical</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                Status
                            </label>
                            <select
                                className="w-full text-sm"
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as Status })}
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="In Review">In Review</option>
                                <option value="Blocked">Blocked</option>
                                <option value="On Hold">On Hold</option>
                                <option value="Complete">Complete</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                Due Date
                            </label>
                            <input
                                type="date"
                                className="w-full text-sm"
                                value={formData.dueDate}
                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                Estimated Hours
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                className="w-full text-sm"
                                placeholder="0"
                                value={formData.estimatedTime}
                                onChange={e => setFormData({ ...formData, estimatedTime: parseFloat(e.target.value) || 0 })}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                Assignee
                            </label>
                            <select
                                className="w-full text-sm"
                                value={formData.assignee}
                                onChange={e => setFormData({ ...formData, assignee: e.target.value })}
                            >
                                <option value="">Unassigned</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                                Dependencies
                            </label>
                            <select
                                multiple
                                className="w-full text-sm min-h-[100px]"
                                value={formData.dependencies}
                                onChange={e => {
                                    const options = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({ ...formData, dependencies: options });
                                }}
                            >
                                {tasks.filter(t => t.id !== task?.id).map(t => (
                                    <option key={t.id} value={t.id}>{t.title} ({t.status})</option>
                                ))}
                            </select>
                            <p className="text-xs text-[var(--text-muted)] mt-1">Hold Ctrl/Cmd to select multiple</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary px-6 py-2.5 text-sm font-semibold"
                        >
                            {task ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
