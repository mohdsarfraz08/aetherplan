import React, { useState } from 'react';
import { LayoutDashboard, Settings, ChevronLeft, ChevronRight, Book, BarChart2 } from 'lucide-react';
import { LevelBadge } from './LevelBadge';
import { motion } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    currentView: string;
    onNavigate: (view: string) => void;
}

export const Layout = ({ children, currentView, onNavigate }: LayoutProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-background text-text-primary overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`
                    relative bg-card border-r border-white/5 flex flex-col z-20 transition-all duration-300 ease-in-out
                    ${isCollapsed ? 'w-20' : 'w-20 lg:w-64'}
                    overflow-visible
                `}
            >
                {/* Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-9 bg-card border border-white/10 rounded-full p-1 text-text-secondary hover:text-white transition-colors hidden lg:flex z-50 cursor-pointer shadow-sm"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <div className={`py-6 flex flex-col h-full ${isCollapsed ? 'items-center' : 'items-center lg:items-stretch'}`}>
                    <div className={`mb-6 flex justify-center overflow-hidden ${isCollapsed ? 'px-0' : 'px-0 lg:px-6 lg:justify-start'}`}>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 min-w-[2.5rem] bg-gradient-to-br from-primary-DEFAULT to-primary-hover rounded-xl flex items-center justify-center shadow-lg shadow-primary-DEFAULT/20 shrink-0">
                                <span className="font-heading font-bold text-white text-xl">A</span>
                            </div>

                            <motion.span
                                animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : 'auto' }}
                                className={`text-xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 whitespace-nowrap hidden lg:block`}
                            >
                                Antigravity
                            </motion.span>
                        </div>
                    </div>

                    <div className="px-4 mb-6 hidden lg:block overflow-hidden">
                        <div className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0 scale-950 pointer-events-none' : 'opacity-100'}`}>
                            {!isCollapsed && <LevelBadge />}
                        </div>
                    </div>

                    <nav className="flex-1 w-full px-2 lg:px-4 space-y-2">
                        <NavItem
                            icon={<LayoutDashboard size={22} />}
                            label="Dashboard"
                            active={currentView === 'dashboard'}
                            onClick={() => onNavigate('dashboard')}
                            collapsed={isCollapsed}
                        />
                        <NavItem
                            icon={<Book size={22} />}
                            label="Tasks"
                            active={currentView === 'subjects'}
                            onClick={() => onNavigate('subjects')}
                            collapsed={isCollapsed}
                        />
                        <NavItem
                            icon={<BarChart2 size={22} />}
                            label="Analytics"
                            active={currentView === 'analytics'}
                            onClick={() => onNavigate('analytics')}
                            collapsed={isCollapsed}
                        />
                    </nav>

                    <div className="p-4 border-t border-white/5 w-full">
                        <NavItem
                            icon={<Settings size={22} />}
                            label="Settings"
                            active={currentView === 'settings'}
                            onClick={() => onNavigate('settings')}
                            collapsed={isCollapsed}
                        />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-DEFAULT/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="h-full overflow-y-auto custom-scrollbar p-0">
                    {children}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, active, onClick, collapsed }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, collapsed: boolean }) => (
    <button
        onClick={onClick}
        className={`
      w-full flex items-center gap-0 lg:gap-3 p-3 rounded-xl transition-all duration-300
      justify-center ${collapsed ? '' : 'lg:justify-start'}
      ${active
                ? 'bg-primary-DEFAULT/10 text-primary-DEFAULT shadow-[0_0_20px_rgba(56,189,248,0.15)] border border-primary-DEFAULT/20'
                : 'text-text-secondary hover:text-white hover:bg-white/5'}
    `}
        title={collapsed ? label : undefined}
    >
        <div className="shrink-0 flex items-center justify-center">
            {icon}
        </div>
        <motion.span
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
            className="hidden lg:block font-medium whitespace-nowrap overflow-hidden"
        >
            {label}
        </motion.span>
    </button>
);
