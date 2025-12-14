import { eachDayOfInterval, subDays, format, isSameDay, parseISO, startOfWeek } from 'date-fns';
import { useStudy } from '../context/StudyContext';

export const ActivityHeatmap = () => {
    const { subjects } = useStudy();

    const today = new Date();
    // Ensure we start on a Sunday to align with grid-rows-7
    const startDate = startOfWeek(subDays(today, 364));
    // Optionally end on endOfWeek to fill the last column, or just today
    const endDate = today;

    const dates = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    // Flatten all subtasks to find completedAt timestamps
    const completedDates = subjects.flatMap(s =>
        s.units.flatMap(u =>
            u.subtasks
                .filter(t => t.completed && t.completedAt)
                .map(t => parseISO(t.completedAt!))
        )
    );

    const getIntensity = (date: Date) => {
        const count = completedDates.filter(d => isSameDay(d, date)).length;
        if (count === 0) return 'bg-white/5';
        if (count === 1) return 'bg-[#0096FF]/40';
        if (count === 2) return 'bg-[#0096FF]/60';
        if (count === 3) return 'bg-[#0096FF]/80';
        return 'bg-[#0096FF]';
    };

    return (
        <div className="w-full overflow-x-auto custom-scrollbar pb-4">
            <div className="min-w-[800px]">
                {/* Month Labels - Simplified approximation based on weeks */}
                <div className="flex text-xs text-text-secondary mb-2 pl-8">
                    {/* We can just render months at approximate positions or every 4 units? 
                        Better: just show Start - End for now or specific month markers 
                    */}
                    <div className="flex gap-12">
                        {Array.from({ length: 12 }).map((_, i) => {
                            const d = subDays(today, 365 - (i * 30));
                            return <span key={i}>{format(d, 'MMM')}</span>
                        })}
                    </div>
                </div>

                <div className="flex gap-2">
                    {/* Day Labels */}
                    <div className="grid grid-rows-7 gap-1 text-[10px] text-text-secondary h-min">
                        <span></span>
                        <span>Mon</span>
                        <span></span>
                        <span>Wed</span>
                        <span></span>
                        <span>Fri</span>
                        <span></span>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="grid grid-rows-7 grid-flow-col gap-1">
                        {dates.map((date) => (
                            <div
                                key={date.toISOString()}
                                className={`w-3 h-3 rounded-sm ${getIntensity(date)} transition-colors hover:ring-1 hover:ring-white/50`}
                                title={`${format(date, 'MMM d, yyyy')}: ${completedDates.filter(d => isSameDay(d, date)).length} tasks`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex justify-end items-center gap-2 text-xs text-text-secondary mt-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-white/5" />
                        <div className="w-3 h-3 rounded-sm bg-[#0096FF]/40" />
                        <div className="w-3 h-3 rounded-sm bg-[#0096FF]/80" />
                        <div className="w-3 h-3 rounded-sm bg-[#0096FF]" />
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};
