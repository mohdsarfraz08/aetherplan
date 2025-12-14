import { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useStudy } from '../../context/StudyContext';
import type { Subtask } from '../../types';

// Helper to distribute points on a sphere (Fibonacci Sphere)
const getSpherePosition = (index: number, total: number, radius: number) => {
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;
    return new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
    );
};

const TaskNode = ({ task, color, position, onClick }: { task: Subtask; color: string; position: THREE.Vector3; onClick: (t: Subtask) => void }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <group position={position}>
            <mesh
                onClick={(e) => { e.stopPropagation(); onClick(task); }}
                onPointerOver={() => { document.body.style.cursor = 'pointer'; setHovered(true); }}
                onPointerOut={() => { document.body.style.cursor = 'auto'; setHovered(false); }}
            >
                <sphereGeometry args={[task.completed ? 0.4 : 0.6, 32, 32]} />
                <meshStandardMaterial
                    color={task.completed ? '#76FF03' : color}
                    emissive={task.completed ? '#76FF03' : color}
                    emissiveIntensity={hovered ? 0.8 : 0.2}
                    roughness={0.3}
                    metalness={0.8}
                />
            </mesh>

            {/* Label/Tooltip */}
            {hovered && (
                <Html distanceFactor={10}>
                    <div className="bg-black/80 text-white p-2 rounded text-xs whitespace-nowrap border border-white/20 backdrop-blur-sm pointer-events-none select-none transform -translate-x-1/2 -translate-y-full mt-[-10px]">
                        <div className="font-bold">{task.title}</div>
                        <div className="text-[10px] opacity-80">{task.completed ? 'Complete' : 'Pending'}</div>
                    </div>
                </Html>
            )}
        </group>
    );
};

export const WorkloadSphere = ({ onTaskClick, className = "h-[350px]" }: { onTaskClick?: (task: Subtask) => void, className?: string }) => {
    const { subjects } = useStudy();

    // Flatten all tasks
    const allTasks = useMemo(() => {
        const tasks: { subtask: Subtask, subjectColor: string }[] = [];
        subjects.forEach(subject => {
            subject.units.forEach(unit => {
                unit.subtasks.forEach(subtask => {
                    tasks.push({ subtask, subjectColor: subject.color });
                });
            });
        });
        return tasks;
    }, [subjects]);

    const positions = useMemo(() => {
        return allTasks.map((_, i) => getSpherePosition(i, allTasks.length, 8));
    }, [allTasks.length]);

    if (allTasks.length === 0) {
        return (
            <div className={`w-full ${className} bg-white/5 rounded-2xl flex items-center justify-center text-text-secondary`}>
                No tasks to visualize
            </div>
        );
    }

    return (
        <div className={`w-full ${className} bg-gradient-to-br from-[#0f1115] to-[#1a1d23] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative`}>
            {/* ... */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Sphere View</h3>
                <p className="text-xs text-text-secondary">Interact with tasks in 3D space</p>
            </div>

            <Canvas
                camera={{ position: [0, 0, 18], fov: 60 }}
                frameloop="demand"
                dpr={[1, 2]}
                gl={{
                    powerPreference: "default",
                    antialias: true,
                    alpha: true,
                    preserveDrawingBuffer: true
                }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />
                <group>
                    {allTasks.map((item, i) => (
                        <TaskNode
                            key={item.subtask.id}
                            task={item.subtask}
                            color={item.subjectColor}
                            position={positions[i]}
                            onClick={(t) => onTaskClick && onTaskClick(t)}
                        />
                    ))}
                </group>

                <OrbitControls
                    makeDefault
                    enableZoom={true}
                    autoRotate
                    autoRotateSpeed={0.5}
                />
            </Canvas>
        </div>
    );
};
