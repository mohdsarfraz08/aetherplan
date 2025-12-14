import { useStudy } from '../../context/StudyContext';
import { motion } from 'framer-motion';
import { BarChart2, TrendingUp, Zap, Target } from 'lucide-react';
import { SubjectChart } from '../../components/SubjectChart';
import { ActivityChart } from '../../components/ActivityChart';
import { ActivityHeatmap } from '../../components/ActivityHeatmap';
import { EfficiencyChart } from '../dashboard/charts/EfficiencyChart';
import { PriorityChart } from '../dashboard/charts/PriorityChart';
import { WorkloadSphere } from '../dashboard/WorkloadSphere';

export const AnalyticsPage = () => {
    const { totalProgress, totalXP, level } = useStudy();

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
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-2">
                    Analytics & Insights
                </h1>
                <p className="text-text-secondary">Deep dive into your study metrics and performance.</p>
            </div>

            {/* Key Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <StatCard
                    label="Total Mastery"
                    value={`${totalProgress}%`}
                    icon={<Target className="text-primary-DEFAULT" size={24} />}
                />
                <StatCard
                    label="Current Level"
                    value={`Lvl ${level}`}
                    icon={<Zap className="text-yellow-400" size={24} />}
                />
                <StatCard
                    label="Total XP"
                    value={totalXP.toLocaleString()}
                    icon={<TrendingUp className="text-green-400" size={24} />}
                />
                <StatCard
                    label="Focus Efficiency"
                    value="87%"
                    icon={<BarChart2 className="text-purple-400" size={24} />}
                    subtext="Top 10% of users"
                />
            </motion.div>

            {/* Main Charts - Row 1 */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
                <motion.div variants={item} className="glass-panel p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Subject Mastery</h3>
                    <SubjectChart />
                </motion.div>
                <motion.div variants={item} className="glass-panel p-6">
                    <h3 className="text-lg font-semibold text-white mb-6">Study Activity</h3>
                    <ActivityChart />
                </motion.div>
            </motion.div>

            {/* Heatmap - Full Width */}
            <motion.div
                variants={item}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="glass-panel p-6"
            >
                <h3 className="text-lg font-semibold text-white mb-6">Activity Heatmap</h3>
                <ActivityHeatmap />
            </motion.div>

            {/* Advanced Metrics - Row 2 */}
            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
                {/* Workload Sphere - Takes 1 column */}
                <motion.div variants={item} className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">Workload Balance</h3>
                    <div className="flex-1 min-h-[300px]">
                        <WorkloadSphere className="h-full min-h-[300px]" />
                    </div>
                </motion.div>

                {/* Efficiency Chart */}
                <motion.div variants={item} className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">Efficiency</h3>
                    <div className="flex-1 min-h-[300px]">
                        <EfficiencyChart />
                    </div>
                </motion.div>

                {/* Priority Chart */}
                <motion.div variants={item} className="glass-panel p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-4">Task Priority</h3>
                    <div className="flex-1 min-h-[300px]">
                        <PriorityChart />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

const StatCard = ({ label, value, icon, subtext }: { label: string, value: string, icon: React.ReactNode, subtext?: string }) => (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="glass-panel p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
            <span className="text-text-secondary font-medium">{label}</span>
            <div className="p-2 bg-white/5 rounded-lg">
                {icon}
            </div>
        </div>
        <div>
            <div className="text-2xl font-bold text-white">{value}</div>
            {subtext && <div className="text-xs text-text-muted mt-1">{subtext}</div>}
        </div>
    </motion.div>
);
