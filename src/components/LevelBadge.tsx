import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const LevelBadge = () => {
    const { level, totalXP } = useStudy();

    // Calculate progress to next level
    // Level N starts at (N-1)^2 * 100 XP
    // Level N+1 starts at N^2 * 100 XP
    const currentLevelStartXP = Math.pow(level - 1, 2) * 100;
    const nextLevelStartXP = Math.pow(level, 2) * 100;
    const levelProgress = ((totalXP - currentLevelStartXP) / (nextLevelStartXP - currentLevelStartXP)) * 100;

    return (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-center gap-4">
            <div className="relative">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg transform rotate-3">
                    <Trophy className="text-white drop-shadow-md" size={24} />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#0F172A] border border-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                    Lvl {level}
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-bold text-white flex items-center gap-1">
                        <Star size={10} className="text-yellow-400 fill-yellow-400" />
                        {totalXP.toLocaleString()} XP
                    </span>
                    <span className="text-text-secondary">Next: {nextLevelStartXP.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(Math.max(levelProgress, 5), 100)}%` }}
                        transition={{ duration: 1, type: "spring" }}
                    />
                </div>
            </div>
        </div>
    );
};
