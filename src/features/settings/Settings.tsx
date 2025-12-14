import { Trash2, Volume2, Shield, Download, Upload, Database } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useRef } from 'react';

export const SettingsPage = () => {
    const { subjects } = useStudy();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleReset = () => {
        if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleExport = () => {
        const data = {
            subjects: localStorage.getItem('study-subjects'),
            xp: localStorage.getItem('study-xp'),
            version: '0.3.0'
        };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `antigravity-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                if (data.subjects) localStorage.setItem('study-subjects', data.subjects);
                if (data.xp) localStorage.setItem('study-xp', data.xp);

                alert('Data imported successfully! The app will now reload.');
                window.location.reload();
            } catch (error) {
                alert('Failed to import data. Invalid file format.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-10">
            <header>
                <h1 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-2">Settings</h1>
                <p className="text-text-secondary">Manage your preferences and data.</p>
            </header>

            <div className="space-y-6">

                {/* Section: Data Management */}
                <div className="glass-panel p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Database size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Data Management</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Export */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div>
                                <div className="font-medium text-white">Export Data</div>
                                <div className="text-sm text-text-secondary">Download a backup of your progress.</div>
                            </div>
                            <button
                                onClick={handleExport}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium border border-white/10"
                            >
                                <Download size={16} />
                                Export JSON
                            </button>
                        </div>

                        {/* Import */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div>
                                <div className="font-medium text-white">Import Data</div>
                                <div className="text-sm text-text-secondary">Restore from a previously exported file.</div>
                            </div>
                            <div>
                                <input
                                    type="file"
                                    accept=".json"
                                    ref={fileInputRef}
                                    onChange={handleImport}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium border border-white/10"
                                >
                                    <Upload size={16} />
                                    Import JSON
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section: Audio */}
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                        <div className="font-medium text-white">Brown Noise Generator</div>
                        <div className="text-sm text-text-secondary">Use the Focus Timer to enable immersive soundscapes.</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-text-muted">Built-in</span>
                </div>
            </div>

            {/* Section: Data */}
            <div className="glass-panel p-6 border-red-500/20">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                        <Trash2 size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Danger Zone</h2>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-red-500/5 rounded-xl border border-red-500/10">
                    <div>
                        <div className="font-medium text-white">Reset Application Data</div>
                        <div className="text-sm text-text-secondary">Permanently delete all subjects, tasks, and XP.</div>
                    </div>
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                        Reset Data
                    </button>
                </div>
            </div>

            <div className="text-center text-text-muted text-sm pt-8">
                Antigravity v0.3.0 • Built with ❤️
            </div>

        </div>
    );
};
