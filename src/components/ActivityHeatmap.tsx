import { eachDayOfInterval, subDays, format, isSameDay, parseISO } from 'date-fns';
import { useStudy } from '../context/StudyContext';

export const ActivityHeatmap = () => {
    const { subjects } = useStudy();

    const today = new Date();
    // Generate dates for the last 365 days (or fewer for mobile density)
    const dates = eachDayOfInterval({
        start: subDays(today, 364),
        end: today
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
        if (count === 1) return 'bg-primary-DEFAULT/40';
        if (count === 2) return 'bg-primary-DEFAULT/60';
        if (count === 3) return 'bg-primary-DEFAULT/80';
        return 'bg-primary-DEFAULT';
    };

    return (
        <div className="w-full overflow-x-auto custom-scrollbar pb-4">
            <div className="min-w-[800px]">
                <div className="flex gap-1 mb-2">
                    {/* Render weeks approximately. simpler approach: 7 rows of days? 
                        Git style: Columns are weeks, Rows are days (Mon, Tue...) 
                        Let's do a simpler Grid for now: 12 months x days.
                        Actually, standard heatmap is grid of weeks.
                    */}
                    <div className="grid grid-rows-7 grid-flow-col gap-1">
                        {dates.map((date) => (
                            <div
                                key={date.toISOString()}
                                className={`w-3 h-3 rounded-sm ${getIntensity(date)} transition-colors hover:ring-1 hover:ring-white/50`}
                                title={`${format(date, 'MMM d, yyyy')}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-end items-center gap-2 text-xs text-text-secondary mt-2">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-sm bg-white/5" />
                        <div className="w-3 h-3 rounded-sm bg-primary-DEFAULT/40" />
                        <div className="w-3 h-3 rounded-sm bg-primary-DEFAULT/80" />
                        <div className="w-3 h-3 rounded-sm bg-primary-DEFAULT" />
                    </div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};
