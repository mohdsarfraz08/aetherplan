export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
    deadline?: string; // ISO string
    completedAt?: string; // ISO string
}

export interface Unit {
    id: string;
    name: string;
    subtasks: Subtask[];
    completed: boolean; // Derived
    progress: number; // Derived 0-100
    notes?: string;
}

export interface Subject {
    id: string;
    name: string;
    units: Unit[];
    color: string; // Hex color for the progress bar
    progress: number; // Derived 0-100
    totalTasks: number; // Derived
    completedTasks: number; // Derived
    lastActivity?: string; // ISO string
}

export interface StudyState {
    subjects: Subject[];
    isLoading: boolean;
    totalProgress: number; // Derived 0-100
    totalXP: number;
    level: number; // Derived from XP
}
