import React, { useState } from 'react';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { Challenge150Page } from './pages/Challenge150Page';
import { sound } from './utils/audio';
import {
  BookOpen,
  Target,
  Timer,
  Volume2,
  VolumeX,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

type NavTab = 'learn' | 'practice' | 'challenge';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('learn');
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);

  const handleTabChange = (tab: NavTab) => {
    sound.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playClick();
    }
  };

  return (
    <div className="app-container" dir="rtl">
      {/* Top Header */}
      <header className="app-header">
        <div className="header-inner">
          {/* Logo & Title */}
          <div
            onClick={() => handleTabChange('learn')}
            className="brand-wrapper"
          >
            <div className="brand-icon-box">🎯</div>
            <div>
              <div className="brand-title">
                <span>אלופי הכפל המקוצר</span>
                <span className="brand-tag">כיתה ח׳</span>
              </div>
              <p className="brand-sub">
                (a+b)² • (a-b)² • (a+b)(a-b)
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button
              onClick={() => handleTabChange('learn')}
              className={`nav-tab-btn nav-tab-learn ${activeTab === 'learn' ? 'active' : ''}`}
            >
              <BookOpen size={16} />
              <span>הסברים והמחשות</span>
            </button>

            <button
              onClick={() => handleTabChange('practice')}
              className={`nav-tab-btn nav-tab-practice ${activeTab === 'practice' ? 'active' : ''}`}
            >
              <Target size={16} />
              <span>מתחם אימונים</span>
            </button>

            <button
              onClick={() => handleTabChange('challenge')}
              className={`nav-tab-btn nav-tab-challenge ${activeTab === 'challenge' ? 'active' : ''}`}
            >
              <Timer size={16} />
              <span>אתגר 150 שניות</span>
            </button>
          </nav>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`audio-btn ${!isMuted ? 'active' : ''}`}
            title={isMuted ? 'הפעל צלילים' : 'השתק צלילים'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="main-content">
        {activeTab === 'learn' && (
          <LearnPage onStartPractice={() => handleTabChange('practice')} />
        )}
        {activeTab === 'practice' && <PracticePage />}
        {activeTab === 'challenge' && (
          <Challenge150Page onBackToPractice={() => handleTabChange('practice')} />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div className="footer-item-left">
            <GraduationCap size={16} className="footer-icon-primary" />
            <span>משחק למידה אינטראקטיבי בנוסחאות הכפל המקוצר לכיתה ח׳</span>
          </div>

          <div className="footer-item-right">
            <span>קובץ יחיד ועצמאי • פועל אופליין בכל מכשיר</span>
            <Sparkles size={14} className="footer-icon-amber" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
