import React from 'react';
import type { Question } from '../services/questionFactory';
import { MathView, FormattedMathText } from './MathView';
import { Lightbulb, X, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  mistakesCount: number;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  question,
  mistakesCount,
}) => {
  if (!isOpen) return null;

  const { explanation } = question;
  const isTriggeredByMistakes = mistakesCount >= 3;

  return (
    <div className="modal-overlay">
      <div className="modal-card" dir="rtl">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-info">
            <div className="modal-bulb-box">
              <Lightbulb size={24} />
            </div>
            <div>
              <h3 className="modal-header-title">
                {isTriggeredByMistakes ? 'פירוק והסבר מלא שלב-אחר-שלב' : 'רמז והסבר מודרך'}
              </h3>
              <p className="modal-header-sub">
                {isTriggeredByMistakes
                  ? '3 ניסיונות - בואו נבין בדיוק איך לפתור זאת ביחד!'
                  : 'הדרכה צעד-אחר-צעד לפתרון השאלה'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body">
          {/* Target Question Reminder */}
          <div className="modal-target-box">
            <div className="modal-target-label">{question.promptText}</div>
            <div className="modal-target-math">
              <MathView math={question.promptLatex} display />
            </div>
          </div>

          {/* Formula Card */}
          <div className="modal-formula-box">
            <div className="modal-formula-title">
              {explanation.formulaName}
            </div>
            <div className="modal-formula-math">
              <MathView math={explanation.formulaTemplate} display />
            </div>
          </div>

          {/* Steps */}
          <div className="modal-steps-list">
            {/* Step 1 */}
            <div className="modal-step-row">
              <span className="modal-step-number">1</span>
              <div>
                <strong className="modal-step-title">שלב 1: זיהוי האיברים</strong>
                <FormattedMathText text={explanation.step1} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="modal-step-row">
              <span className="modal-step-number modal-step-badge-purple">2</span>
              <div>
                <strong className="modal-step-title">שלב 2: בחירת הנוסחה</strong>
                <FormattedMathText text={explanation.step2} />
              </div>
            </div>

            {/* Step 3: Parts */}
            <div className="modal-step-row">
              <span className="modal-step-number modal-step-badge-cyan">3</span>
              <div className="modal-step-body">
                <strong className="modal-step-title">שלב 3: חישוב איברי הנוסחה</strong>
                <div className="modal-step-parts-list">
                  {explanation.step3Parts.map((part, idx) => (
                    <div
                      key={idx}
                      className="modal-part-item"
                    >
                      <FormattedMathText text={part} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Final Result */}
            <div className="modal-step-row modal-result-row">
              <div className="modal-result-icon">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <strong className="modal-result-title">התוצאה הסופית:</strong>
                <div className="modal-result-math">
                  <FormattedMathText text={explanation.step4Result} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button
            onClick={onClose}
            className="primary-action-btn modal-close-action-btn"
          >
            <span>הבנתי, בואו נמשיך!</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
