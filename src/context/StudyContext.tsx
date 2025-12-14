import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Subject, Unit, StudyState } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface StudyContextType extends StudyState {
    addSubject: (name: string, color: string) => void;
    deleteSubject: (subjectId: string) => void;
    addUnit: (subjectId: string, name: string) => void;
    deleteUnit: (subjectId: string, unitId: string) => void;
    addSubtask: (subjectId: string, unitId: string, title: string) => void;
    toggleSubtask: (subjectId: string, unitId: string, subtaskId: string) => void;
    deleteSubtask: (subjectId: string, unitId: string, subtaskId: string) => void;
    updateSubtaskDeadline: (subjectId: string, unitId: string, subtaskId: string, deadline: string) => void;
    updateUnitNotes: (subjectId: string, unitId: string, content: string) => void;
    awardXP: (amount: number) => void;
    resetData: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

// Helper to calculate progress recursively
const calculateSubjectProgress = (units: Unit[]): { progress: number, completedTasks: number, totalTasks: number } => {
    let total = 0;
    let completed = 0;

    units.forEach(unit => {
        unit.subtasks.forEach(task => {
            total++;
            if (task.completed) completed++;
        });
        // Update unit progress inside the loop for local derivation
        unit.progress = unit.subtasks.length > 0
            ? Math.round((unit.subtasks.filter(t => t.completed).length / unit.subtasks.length) * 100)
            : 0;
        unit.completed = unit.progress === 100 && unit.subtasks.length > 0;
    });

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { progress, completedTasks: completed, totalTasks: total };
};

const INITIAL_DATA: Subject[] = [
    {
        id: 's1',
        name: 'Python Mastery',
        color: '#38BDF8', // Sky 400
        units: [
            {
                id: 'u1',
                name: 'Basics & Syntax',
                subtasks: [
                    { id: 't1', title: 'Variables & Data Types', completed: true },
                    { id: 't2', title: 'Control Flow (if/else)', completed: true },
                    { id: 't3', title: 'Loops (for/while)', completed: false },
                ],
                completed: false,
                progress: 66
            },
            {
                id: 'u2',
                name: 'Data Structures',
                subtasks: [
                    { id: 't4', title: 'Lists & Tuples', completed: false },
                    { id: 't5', title: 'Dictionaries', completed: false },
                ],
                completed: false,
                progress: 0
            }
        ],
        progress: 40,
        totalTasks: 5,
        completedTasks: 2
    },
    {
        id: 's2',
        name: 'Data Structures & Algo',
        color: '#F472B6', // Pink 400
        units: [
            {
                id: 'u3',
                name: 'Sorting Algorithms',
                subtasks: [
                    { id: 't6', title: 'Bubble Sort', completed: false },
                    { id: 't7', title: 'Merge Sort', completed: false },
                ],
                completed: false,
                progress: 0
            }
        ],
        progress: 0,
        totalTasks: 2,
        completedTasks: 0
    }
];

export const StudyProvider = ({ children }: { children: ReactNode }) => {
    const [subjects, setSubjects] = useState<Subject[]>(() => {
        const saved = localStorage.getItem('study-subjects');
        return saved ? JSON.parse(saved) : INITIAL_DATA;
    });

    const [totalProgress, setTotalProgress] = useState(0);

    const [totalXP, setTotalXP] = useState(() => {
        const saved = localStorage.getItem('study-xp');
        return saved ? parseInt(saved, 10) : 0;
    });

    // Derived Level (Simple formula: Level = floor(sqrt(XP / 100)) + 1)
    // Level 1: 0-99 XP
    // Level 2: 100-399 XP
    // Level 3: 400-899 XP
    const level = Math.floor(Math.sqrt(totalXP / 100)) + 1;

    // Recalculate progress whenever subjects change
    useEffect(() => {
        const updatedSubjects = subjects.map(subject => {
            const { progress, completedTasks, totalTasks } = calculateSubjectProgress(subject.units);
            return { ...subject, progress, completedTasks, totalTasks };
        });

        const allTotal = updatedSubjects.reduce((acc, s) => acc + s.totalTasks, 0);
        const allCompleted = updatedSubjects.reduce((acc, s) => acc + s.completedTasks, 0);
        setTotalProgress(allTotal > 0 ? Math.round((allCompleted / allTotal) * 100) : 0);

        localStorage.setItem('study-subjects', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem('study-xp', totalXP.toString());
    }, [totalXP]);

    const awardXP = (amount: number) => {
        setTotalXP(prev => prev + amount);
    };

    const resetData = () => {
        if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
            setSubjects(INITIAL_DATA);
            setTotalXP(0);
            localStorage.clear();
            // Force reload to ensure clean state
            setTimeout(() => window.location.reload(), 100);
        }
    };

    // Helper to fully recalculate a subject's stats based on its units
    const recalculateSubjectStats = (units: Unit[], updateTimestamp = true) => {
        const newUnits = units.map(u => {
            const completedCount = u.subtasks.filter(t => t.completed).length;
            const unitProgress = u.subtasks.length > 0
                ? Math.round((completedCount / u.subtasks.length) * 100)
                : 0;

            return {
                ...u,
                progress: unitProgress,
                completed: unitProgress === 100 && u.subtasks.length > 0
            };
        });

        let totalTasks = 0;
        let completedTasks = 0;

        newUnits.forEach(u => {
            totalTasks += u.subtasks.length;
            completedTasks += u.subtasks.filter(t => t.completed).length;
        });

        const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const stats: any = {
            units: newUnits,
            progress,
            completedTasks,
            totalTasks
        };

        if (updateTimestamp) {
            stats.lastActivity = new Date().toISOString();
        }

        return stats;
    };

    const addSubject = (name: string, color: string) => {
        setSubjects(prev => [...prev, {
            id: uuidv4(),
            name,
            color,
            units: [],
            progress: 0,
            totalTasks: 0,
            completedTasks: 0,
            lastActivity: new Date().toISOString()
        }]);
    };

    const deleteSubject = (id: string) => {
        setSubjects(prev => prev.filter(s => s.id !== id));
    };

    const addUnit = (subjectId: string, name: string) => {
        setSubjects(prev => prev.map(s => {
            if (s.id !== subjectId) return s;

            const newUnits = [...s.units, {
                id: uuidv4(),
                name,
                subtasks: [],
                completed: false,
                progress: 0
            }];

            return {
                ...s,
                ...recalculateSubjectStats(newUnits)
            };
        }));
    };

    const deleteUnit = (subjectId: string, unitId: string) => {
        setSubjects(prev => prev.map(s => {
            if (s.id !== subjectId) return s;

            const newUnits = s.units.filter(u => u.id !== unitId);

            return {
                ...s,
                ...recalculateSubjectStats(newUnits)
            };
        }));
    };

    const addSubtask = (subjectId: string, unitId: string, title: string) => {
        setSubjects(prev => prev.map(s => {
            if (s.id !== subjectId) return s;

            const newUnits = s.units.map(u => {
                if (u.id !== unitId) return u;
                return {
                    ...u,
                    subtasks: [...u.subtasks, {
                        id: uuidv4(),
                        title,
                        completed: false
                    }]
                };
            });

            return {
                ...s,
                ...recalculateSubjectStats(newUnits)
            };
        }));
    };

    const toggleSubtask = (subjectId: string, unitId: string, subtaskId: string) => {
        setSubjects(prev => prev.map(s => {
            if (s.id !== subjectId) return s;

            // 1. Update specific unit and its subtasks
            const newUnits = s.units.map(u => {
                if (u.id !== unitId) return u;

                const targetTask = u.subtasks.find(t => t.id === subtaskId);
                if (targetTask && !targetTask.completed) {
                    setTotalXP(prev => prev + 500);
                }

                return {
                    ...u,
                    subtasks: u.subtasks.map(t =>
                        t.id === subtaskId ? {
                            ...t,
                            completed: !t.completed,
                            completedAt: !t.completed ? new Date().toISOString() : undefined
                        } : t
                    )
                };
            });

            return {
                ...s,
                ...recalculateSubjectStats(newUnits)
            };
        }));
    };

    const updateSubtaskDeadline = (subjectId: string, unitId: string, subtaskId: string, deadline: string) => {
        setSubjects(prev => prev.map(s => {
            if (s.id !== subjectId) return s;
            return {
                ...s,
                units: s.units.map(u => {
                    if (u.id !== unitId) return u;
                    return {
                        ...u,
                        subtasks: u.subtasks.map(t =>
                            t.id === subtaskId ? { ...t, deadline } : t
                        )
                    };
                })
            };
        }));
    };

    const deleteSubtask = (subjectId: string, unitId: string, subtaskId: string) => {
        setSubjects(prev => prev.map(s => {
            if (s.id !== subjectId) return s;

            const newUnits = s.units.map(u => {
                if (u.id !== unitId) return u;
                return {
                    ...u,
                    subtasks: u.subtasks.filter(t => t.id !== subtaskId)
                };
            });

            return {
                ...s,
                ...recalculateSubjectStats(newUnits)
            };
        }));
    };

    const updateUnitNotes = (subjectId: string, unitId: string, content: string) => {
        setSubjects(prev => prev.map(s => {
            if (s.id !== subjectId) return s;
            return {
                ...s,
                units: s.units.map(u => {
                    if (u.id !== unitId) return u;
                    return { ...u, notes: content };
                })
            };
        }));
    };

    return (
        <StudyContext.Provider value={{
            subjects,
            isLoading: false,
            totalProgress,
            totalXP,
            level,
            addSubject,
            deleteSubject,
            addUnit,
            deleteUnit,
            addSubtask,
            toggleSubtask,
            deleteSubtask,
            updateSubtaskDeadline,
            updateUnitNotes,
            awardXP,
            resetData
        }}>
            {children}
        </StudyContext.Provider>
    );
};

export const useStudy = () => {
    const context = useContext(StudyContext);
    if (context === undefined) {
        throw new Error('useStudy must be used within a StudyProvider');
    }
    return context;
};
