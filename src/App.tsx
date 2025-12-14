import { useState } from 'react';
import { StudyProvider } from './context/StudyContext';
import { Layout } from './components/Layout';
import { Dashboard } from './features/dashboard/Dashboard';
import { SubjectDetail } from './features/study/SubjectDetail';
import { SettingsPage } from './features/settings/Settings';
import { SubjectsPage } from './features/study/SubjectsPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';

import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const handleNavigate = (view: string, subjectId?: string) => {
    setCurrentView(view);
    if (subjectId) setSelectedSubjectId(subjectId);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 }
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.3
  };

  return (
    <StudyProvider>
      <Layout currentView={currentView} onNavigate={handleNavigate}>
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition as any}
              className="h-full"
            >
              <Dashboard onNavigate={handleNavigate} />
            </motion.div>
          )}
          {currentView === 'subject' && selectedSubjectId && (
            <motion.div
              key="subject"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition as any}
              className="h-full"
            >
              <SubjectDetail subjectId={selectedSubjectId} onBack={() => handleNavigate('dashboard')} />
            </motion.div>
          )}
          {currentView === 'subjects' && (
            <motion.div
              key="subjects"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition as any}
              className="h-full"
            >
              <SubjectsPage onNavigate={handleNavigate} />
            </motion.div>
          )}
          {currentView === 'settings' && (
            <motion.div
              key="settings"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition as any}
              className="h-full"
            >
              <SettingsPage />
            </motion.div>
          )}
          {currentView === 'analytics' && (
            <motion.div
              key="analytics"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition as any}
              className="h-full"
            >
              <AnalyticsPage />
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </StudyProvider>
  );
}

export default App;
