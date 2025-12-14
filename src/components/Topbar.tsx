import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

interface TopbarProps {
  currentView: 'dashboard' | 'tasks' | 'study';
  setView: (v: 'dashboard' | 'tasks' | 'study') => void;
}

export const Topbar: React.FC<TopbarProps> = ({ currentView, setView }) => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 mb-6 border-b border-[rgba(255,255,255,0.03)]">
      <div className="flex items-center gap-4">
        <div className="text-sm font-semibold text-[var(--text-primary)]">My Workspace</div>
        <div className="hidden sm:flex items-center gap-1 text-sm text-[var(--text-secondary)]">
          <button className={`px-3 py-1 rounded-md ${currentView === 'dashboard' ? 'bg-[rgba(88,166,255,0.06)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`} onClick={() => setView('dashboard')}>Dashboard</button>
          <button className={`px-3 py-1 rounded-md ${currentView === 'tasks' ? 'bg-[rgba(88,166,255,0.06)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`} onClick={() => setView('tasks')}>Tasks</button>
          <button className={`px-3 py-1 rounded-md ${currentView === 'study' ? 'bg-[rgba(88,166,255,0.06)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`} onClick={() => setView('study')}>Study</button>
        </div>
      </div>

      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
          <input className="w-full pl-10 pr-3 py-2 text-sm bg-[transparent] border border-[rgba(255,255,255,0.02)] rounded-md" placeholder="Search everything..." aria-label="Search" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.02)]"><Bell size={18} /></button>
        <button className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.02)]"><Settings size={18} /></button>
        <div className="w-8 h-8 rounded-md bg-[rgba(255,255,255,0.03)]" aria-hidden />
      </div>
    </div>
  );
};

export default Topbar;
