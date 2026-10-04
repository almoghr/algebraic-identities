import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  generateQuestion,
  isAnswerCorrect,
  type Question,
  type DifficultyLevel,
  type IdentityType,
} from '../services/questionFactory';
import { MathView } from '../components/MathView';
import { MathKeypad } from '../components/MathKeypad';
import { HintModal } from '../components/HintModal';
import { sound } from '../utils/audio';
import {
  Flame,
  Award,
  HelpCircle,
  RotateCw,
  CheckCircle2,
  XCircle,
  Keyboard,
  ListCheck,
  Target,
} from 'lucide-react';

export const PracticePage: React.FC = () => {
  const [level, setLevel] = useState<DifficultyLevel>(1);
  const [filterType, setFilterType] = useState<IdentityType | 'all'>('all');
  const [inputMode, setInputMode] = useState<'options' | 'keypad'>('options');

  const [question, setQuestion] = useState<Question>(() =>
    generateQuestion(1, undefined)
  );

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [keypadInput, setKeypadInput] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mistakesCount, setMistakesCount] = useState<number>(0);

  const [streak, setStreak] = useState<number>(0);
  const [totalSolved, setTotalSolved] = useState<number>(0);

  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [showAutoHintNotice, setShowAutoHintNotice] = useState<boolean>(false);

  useEffect(() => {
    loadNewQuestion();
  }, [level, filterType]);

  const loadNewQuestion = () => {
    const q = generateQuestion(level, filterType === 'all' ? undefined : filterType);
    setQuestion(q);
    setSelectedOption(null);
    setKeypadInput('');
    setIsAnswered(false);
    setIsCorrect(null);
    setMistakesCount(0);
    setShowAutoHintNotice(false);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;

    sound.playClick();
    setSelectedOption(index);
    const correct = index === question.correctOptionIndex;

    if (correct) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const handleKeypadSubmit = () => {
    if (isAnswered || !keypadInput.trim()) return;

    sound.playClick();
    const correct = isAnswerCorrect(keypadInput, question);

    if (correct) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };

  const handleSuccess = () => {
    setIsAnswered(true);
    setIsCorrect(true);
    const newStreak = streak + 1;
    setStreak(newStreak);
    setTotalSolved((prev) => prev + 1);

    if (newStreak >= 3 && newStreak % 3 === 0) {
      sound.playStreak();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } else {
      sound.playCorrect();
    }
  };

  const handleFailure = () => {
    const newMistakes = mistakesCount + 1;
    setMistakesCount(newMistakes);
    setStreak(0);
    sound.playWrong();

    if (newMistakes >= 3) {
      setIsAnswered(true);
      setIsCorrect(false);
      setShowAutoHintNotice(true);
      setTimeout(() => {
        setIsHintOpen(true);
      }, 700);
    } else {
      setIsCorrect(false);
      setTimeout(() => {
        if (!isAnswered) {
          setIsCorrect(null);
        }
      }, 1200);
    }
  };

  return (
    <div dir="rtl">
      {/* Top Controls & Level Tabs */}
      <div className="practice-hud">
        {/* Level Selector */}
        <div className="level-selector-group">
          <span className="practice-level-label">
            <Target size={16} className="footer-icon-primary" />
            <span>רמת קושי:</span>
          </span>
          <div className="level-buttons-container">
            <button
              onClick={() => setLevel(1)}
              className={`level-btn ${level === 1 ? 'active-lvl-1' : ''}`}
            >
              רמה 1: בסיסי
            </button>
            <button
              onClick={() => setLevel(2)}
              className={`level-btn ${level === 2 ? 'active-lvl-2' : ''}`}
            >
              רמה 2: מתקדם
            </button>
            <button
              onClick={() => setLevel(3)}
              className={`level-btn ${level === 3 ? 'active-lvl-3' : ''}`}
            >
              רמה 3: פירוק לגורמים 🔄
            </button>
          </div>
        </div>

        {/* Stats: Streak & Solved */}
        <div className="stats-badges-group">
          <div className="streak-pill">
            <Flame size={18} className="footer-icon-amber" />
            <span>רצף: {streak}</span>
          </div>

          <div className="solved-pill">
            <Award size={18} className="footer-icon-primary" />
            <span>נפתרו: {totalSolved}</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar-row">
        {/* Formula Filter */}
        <div className="filter-group">
          <span className="filter-label">סינון נוסחה:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as IdentityType | 'all')}
            className="filter-select"
          >
            <option value="all">כל 3 הנוסחאות יחד</option>
            <option value="sum_square">רק (a + b)²</option>
            <option value="diff_square">רק (a - b)²</option>
            <option value="diff_of_squares">רק (a + b)(a - b)</option>
          </select>
        </div>

        {/* Input Mode Toggle */}
        <div className="mode-toggle-group">
          <button
            onClick={() => setInputMode('options')}
            className={`mode-btn ${inputMode === 'options' ? 'active' : ''}`}
          >
            <ListCheck size={14} />
            <span>בחירה אמריקאית</span>
          </button>
          <button
            onClick={() => setInputMode('keypad')}
            className={`mode-btn ${inputMode === 'keypad' ? 'active' : ''}`}
          >
            <Keyboard size={14} />
            <span>מקלדת אלגברית</span>
          </button>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="question-card">
        {/* Top Card Info Bar */}
        <div className="question-card-topbar">
          <div className="card-topbar-left">
            <span
              className={`formula-badge ${
                level === 1
                  ? 'formula-badge-lvl-1'
                  : level === 2
                  ? 'formula-badge-lvl-2'
                  : 'formula-badge-lvl-3'
              }`}
            >
              {level === 3 ? 'פירוק לגורמים' : level === 1 ? 'רמה בסיסית' : 'רמה מתקדמת'}
            </span>

            {/* Mistakes indicators */}
            <div className="mistake-dots-group">
              {[1, 2, 3].map((dot) => (
                <div
                  key={dot}
                  className={`mistake-dot ${dot <= mistakesCount ? 'active' : ''}`}
                  title={`שגיאה ${dot} מתוך 3`}
                />
              ))}
              <span className="mistake-label">{mistakesCount}/3 טעויות</span>
            </div>
          </div>

          {/* Hint Button */}
          <button
            onClick={() => setIsHintOpen(true)}
            className="hint-trigger-btn"
          >
            <HelpCircle size={16} />
            <span>רמז / הסבר</span>
          </button>
        </div>

        {/* Question Prompt */}
        <div className="question-prompt-section">
          <div className="question-prompt-text">
            {question.promptText}
          </div>

          <div className="question-prompt-math-box">
            <MathView math={question.promptLatex} display />
          </div>
        </div>

        {/* Auto Hint Notice */}
        {showAutoHintNotice && (
          <div className="mistake-auto-notice">
            הגעת ל-3 טעויות! פותח עבורך את מפרק השלבים המלא ללמידה...
          </div>
        )}

        {/* Options / Keypad */}
        {inputMode === 'options' ? (
          <div className="options-grid">
            {question.options.map((optLatex, idx) => {
              const isSelected = selectedOption === idx;
              const isTheCorrectOne = idx === question.correctOptionIndex;

              let stateClass = '';
              if (isAnswered) {
                if (isTheCorrectOne) stateClass = 'state-correct';
                else if (isSelected) stateClass = 'state-wrong';
                else stateClass = 'state-dimmed';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isAnswered}
                  className={`option-btn ${stateClass}`}
                >
                  <span className="option-letter-badge">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="option-math-wrapper">
                    <MathView math={optLatex} />
                  </div>
                  {isAnswered && isTheCorrectOne && (
                    <CheckCircle2 size={22} className="proof-label-valid" />
                  )}
                  {isAnswered && isSelected && !isTheCorrectOne && (
                    <XCircle size={22} className="proof-label-invalid" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="keypad-section">
            <div className="keypad-input-box">
              {keypadInput ? (
                <span className="keypad-input-text">{keypadInput}</span>
              ) : (
                <span className="keypad-placeholder">הקישו על כפתורי המקלדת שמתחת...</span>
              )}
            </div>

            {!isAnswered ? (
              <MathKeypad
                value={keypadInput}
                onChange={setKeypadInput}
                onSubmit={handleKeypadSubmit}
                isDirectionFactoring={level === 3}
              />
            ) : (
              <div className="keypad-correct-answer-card">
                <div className="keypad-correct-label">התשובה הנכונה:</div>
                <div className="keypad-correct-value">
                  <MathView math={question.answerLatex} display />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Feedback Row */}
        {isAnswered && (
          <div className="feedback-action-bar">
            <div>
              {isCorrect ? (
                <div className="feedback-msg-success">
                  <CheckCircle2 size={24} />
                  <span>כל הכבוד! תשובה מדויקת! 🎉</span>
                </div>
              ) : (
                <div className="feedback-msg-error">
                  <XCircle size={24} />
                  <span>התשובה הנכונה היא: <MathView math={question.answerLatex} /></span>
                </div>
              )}
            </div>

            <button
              onClick={loadNewQuestion}
              className="next-question-btn"
            >
              <span>שאלה הבאה</span>
              <RotateCw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Hint Modal */}
      <HintModal
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        question={question}
        mistakesCount={mistakesCount}
      />
    </div>
  );
};
