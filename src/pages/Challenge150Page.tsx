import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  generateQuestion,
  type Question,
  type DifficultyLevel,
} from '../services/questionFactory';
import { MathView } from '../components/MathView';
import { sound } from '../utils/audio';
import {
  Timer,
  Flame,
  Trophy,
  RotateCcw,
  Play,
} from 'lucide-react';

const CHALLENGE_DURATION = 150; // 150 seconds

interface Challenge150PageProps {
  onBackToPractice: () => void;
}

export const Challenge150Page: React.FC<Challenge150PageProps> = ({ onBackToPractice }) => {
  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(CHALLENGE_DURATION);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number>(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [highScore, setHighScore] = useState<number>(() => {
    return Number(localStorage.getItem('algebra_150_highscore') || '0');
  });
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const getNextLevel = (qNum: number): DifficultyLevel => {
    if (qNum <= 4) return 1;
    if (qNum <= 10) return 2;
    return Math.random() < 0.5 ? 2 : 3;
  };

  const startChallenge = () => {
    sound.playClick();
    setTimeLeft(CHALLENGE_DURATION);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setQuestionNumber(1);
    setIsNewRecord(false);
    setFeedback(null);

    const firstQ = generateQuestion(1);
    setCurrentQuestion(firstQ);
    setGameState('running');
  };

  useEffect(() => {
    if (gameState !== 'running') return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endChallenge();
          return 0;
        }
        if (prev <= 10) {
          sound.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, score, highScore]);

  const endChallenge = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('finished');
    sound.playFanfare();

    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.5 },
    });

    setScore((currentScore) => {
      if (currentScore > highScore) {
        setHighScore(currentScore);
        setIsNewRecord(true);
        localStorage.setItem('algebra_150_highscore', String(currentScore));
      }
      return currentScore;
    });
  };

  const handleSelectAnswer = (idx: number) => {
    if (!currentQuestion || feedback !== null || gameState !== 'running') return;

    const isCorrect = idx === currentQuestion.correctOptionIndex;

    if (isCorrect) {
      sound.playCorrect();
      setFeedback('correct');

      const nextStreak = streak + 1;
      setStreak(nextStreak);
      if (nextStreak > maxStreak) setMaxStreak(nextStreak);

      const multiplier = nextStreak >= 10 ? 3 : nextStreak >= 5 ? 2 : nextStreak >= 3 ? 1.5 : 1;
      const points = Math.round(100 * multiplier);
      setScore((s) => s + points);
      setCorrectCount((c) => c + 1);

      if (nextStreak >= 5 && nextStreak % 5 === 0) {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      sound.playWrong();
      setFeedback('wrong');
      setStreak(0);
      setWrongCount((w) => w + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      const nextQNum = questionNumber + 1;
      setQuestionNumber(nextQNum);
      const nextLvl = getNextLevel(nextQNum);
      setCurrentQuestion(generateQuestion(nextLvl));
    }, isCorrect ? 250 : 450);
  };

  const getRank = (finalScore: number) => {
    if (finalScore >= 3000) return { title: 'אגדת כפל מקוצר! 👑', className: 'rank-amber' };
    if (finalScore >= 1800) return { title: 'מאסטר אלגברה מבריק! 🚀', className: 'rank-indigo' };
    if (finalScore >= 1000) return { title: 'אלוף חישובים מהיר! ⚡', className: 'rank-emerald' };
    return { title: 'מתלמד מבטיח 🌱', className: 'rank-cyan' };
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div dir="rtl">
      {/* IDLE SCREEN */}
      {gameState === 'idle' && (
        <div className="challenge-hero-card">
          <div className="challenge-icon-box">
            <Timer size={44} />
          </div>

          <h2 className="challenge-hero-title">
            אתגר 150 השניות ⚡
          </h2>

          <p className="challenge-hero-desc">
            כמה נוסחאות כפל מקוצר תצליחו לפתור ב-2.5 דקות?
            כל תשובה נכונה מעניקה נקודות ומעלה את מכפיל הרצף (עד <strong className="challenge-highlight-amber">×3 נקודות</strong>!).
          </p>

          {/* High score badge */}
          {highScore > 0 && (
            <div className="challenge-highscore-pill">
              <Trophy size={20} className="footer-icon-amber" />
              <span>שיא אישי שמור: {highScore.toLocaleString()} נקודות</span>
            </div>
          )}

          <div>
            <button
              onClick={startChallenge}
              className="challenge-play-btn"
            >
              <Play size={24} fill="#fff" />
              <span>התחילו את האתגר עכשיו!</span>
            </button>
          </div>
        </div>
      )}

      {/* RUNNING SCREEN */}
      {gameState === 'running' && currentQuestion && (
        <div>
          {/* Top HUD */}
          <div className="challenge-hud">
            {/* Timer */}
            <div className="hud-timer-group">
              <div className={`hud-timer-badge ${timeLeft <= 30 ? 'hud-timer-danger' : ''}`}>
                <Timer size={22} />
              </div>
              <div>
                <span className="hud-label">זמן נותר</span>
                <span className={`hud-timer-value ${timeLeft <= 30 ? 'hud-timer-value-danger' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="hud-score-group">
              <span className="hud-label">ניקוד</span>
              <span className="hud-score-value">
                {score.toLocaleString()}
              </span>
            </div>

            {/* Multiplier / Streak */}
            <div className="hud-multiplier-group">
              <div className="hud-multiplier-text-group">
                <span className="hud-label">מכפיל רצף</span>
                <span className="hud-multiplier-value">
                  <Flame size={16} fill="var(--color-amber)" />
                  <span>
                    {streak >= 10 ? '×3' : streak >= 5 ? '×2' : streak >= 3 ? '×1.5' : '×1'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Question Box */}
          <div
            className={`challenge-question-card ${
              feedback === 'correct'
                ? 'challenge-question-card-correct'
                : feedback === 'wrong'
                ? 'challenge-question-card-wrong'
                : ''
            }`}
          >
            <div className="challenge-question-title">
              שאלה {questionNumber} • {currentQuestion.promptText}
            </div>

            <div className="challenge-question-math">
              <MathView math={currentQuestion.promptLatex} display />
            </div>

            {/* Fast 4-option grid */}
            <div className="challenge-options-grid">
              {currentQuestion.options.map((opt, idx) => {
                let stateClass = '';
                if (feedback !== null) {
                  if (idx === currentQuestion.correctOptionIndex) {
                    stateClass = 'state-correct';
                  } else {
                    stateClass = 'state-dimmed';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={feedback !== null}
                    className={`option-btn option-btn-centered ${stateClass}`}
                  >
                    <MathView math={opt} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FINISHED SCREEN */}
      {gameState === 'finished' && (
        <div className="challenge-hero-card">
          {isNewRecord && (
            <div className="challenge-record-pill">
              <Trophy size={18} />
              <span>שיא אישי חדש נשבר! 🎉</span>
            </div>
          )}

          <h2 className="challenge-finish-title">נגמר הזמן! ⏱️</h2>
          <div className={`challenge-rank-title ${getRank(score).className}`}>
            {getRank(score).title}
          </div>

          {/* Stats Grid */}
          <div className="score-summary-grid">
            <div className="summary-stat-box">
              <span className="stat-label">ניקוד סופי</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-label">תשובות נכונות</span>
              <span className="stat-value stat-emerald">{correctCount}</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-label">דיוק</span>
              <span className="stat-value stat-cyan">
                {correctCount + wrongCount > 0
                  ? Math.round((correctCount / (correctCount + wrongCount)) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-label">שיא רצף</span>
              <span className="stat-value stat-amber">{maxStreak}</span>
            </div>
          </div>

          <div className="challenge-action-buttons">
            <button
              onClick={startChallenge}
              className="primary-action-btn"
            >
              <RotateCcw size={18} />
              <span>שחקו שוב באתגר</span>
            </button>
            <button
              onClick={onBackToPractice}
              className="primary-action-btn challenge-back-btn"
            >
              <span>חזרה למתחם האימונים</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
