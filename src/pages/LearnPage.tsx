import React, { useState } from 'react';
import { MathView } from '../components/MathView';
import { GeometricVisualizer } from '../components/GeometricVisualizer';
import {
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Eye,
  Layers,
} from 'lucide-react';

interface LearnPageProps {
  onStartPractice: () => void;
}

export const LearnPage: React.FC<LearnPageProps> = ({ onStartPractice }) => {
  const [selectedFormula, setSelectedFormula] = useState<number>(1);
  const [showTrapProof, setShowTrapProof] = useState<boolean>(false);

  return (
    <div dir="rtl">
      {/* Hero Banner */}
      <div className="hero-card">
        <div className="hero-content-wrapper">
          <div className="hero-pill">
            <BookOpen size={14} />
            <span>מתמטיקה לכיתה ח׳ • פרק אלגברה</span>
          </div>
          <h1 className="hero-heading">
            נוסחאות הכפל המקוצר <span className="hero-gradient-text">בקלות ובהנאה!</span>
          </h1>
          <p className="hero-desc">
            במקום לפתוח סוגריים באריכות בעזרת חוק הפילוג, גילו המתמטיקאים 3 קיצורי דרך גאוניים.
            בדף זה נבין <strong className="hero-bold-highlight">למה</strong> הנוסחאות פועלות, נראה אותן בעיניים באופן גיאומטרי, ונתגבר על המלכודות הנפוצות ביותר!
          </p>
          <button
            onClick={onStartPractice}
            className="primary-action-btn"
          >
            <span>קדימה, לעבור לאימון!</span>
            <ArrowRight size={18} className="icon-arrow-flipped" />
          </button>
        </div>
      </div>

      {/* 3 Formula Cards Grid */}
      <div className="section-spacer">
        <div className="section-title-wrapper">
          <Layers size={18} className="footer-icon-primary" />
          <span>שלוש הנוסחאות המרכזיות שחייבים להכיר:</span>
        </div>

        <div className="formula-grid">
          {/* Card 1: Sum squared */}
          <div
            onClick={() => setSelectedFormula(1)}
            className={`formula-card ${selectedFormula === 1 ? 'selected' : ''}`}
          >
            <div className="formula-card-top">
              <span className="formula-badge">נוסחה 1</span>
              <span className="formula-name-text">ריבוע של סכום</span>
            </div>
            <div className="formula-math-display">
              <MathView math="(a + b)^2 = a^2 + 2ab + b^2" display />
            </div>
            <p className="formula-explanation">
              <strong>במילים:</strong> הריבוע של הראשון, <strong>ועוד</strong> פעמיים מכפלת האיברים, <strong>ועוד</strong> הריבוע של השני.
            </p>
            <div className="formula-example-row">
              <div className="formula-example-content">
                <span className="formula-example-label">דוגמה:</span>
                <span className="formula-example-math" dir="ltr">(x+3)² = x² + 6x + 9</span>
              </div>
              <CheckCircle size={14} />
            </div>
          </div>

          {/* Card 2: Difference squared */}
          <div
            onClick={() => setSelectedFormula(2)}
            className={`formula-card formula-card-rose ${selectedFormula === 2 ? 'selected' : ''}`}
          >
            <div className="formula-card-top">
              <span className="formula-badge formula-badge-rose">נוסחה 2</span>
              <span className="formula-name-text">ריבוע של הפרש</span>
            </div>
            <div className="formula-math-display">
              <MathView math="(a - b)^2 = a^2 - 2ab + b^2" display />
            </div>
            <p className="formula-explanation">
              <strong>במילים:</strong> הריבוע של הראשון, <strong>פחות</strong> פעמיים מכפלת האיברים, <strong>ועוד</strong> הריבוע של השני.
            </p>
            <div className="formula-example-row formula-example-rose">
              <div className="formula-example-content">
                <span className="formula-example-label">דוגמה:</span>
                <span className="formula-example-math" dir="ltr">(x-5)² = x² - 10x + 25</span>
              </div>
              <CheckCircle size={14} />
            </div>
          </div>

          {/* Card 3: Difference of squares */}
          <div
            onClick={() => setSelectedFormula(3)}
            className={`formula-card formula-card-cyan ${selectedFormula === 3 ? 'selected' : ''}`}
          >
            <div className="formula-card-top">
              <span className="formula-badge formula-badge-cyan">נוסחה 3</span>
              <span className="formula-name-text">הפרש ריבועים</span>
            </div>
            <div className="formula-math-display">
              <MathView math="(a + b)(a - b) = a^2 - b^2" display />
            </div>
            <p className="formula-explanation">
              <strong>במילים:</strong> מכפלת סכום בהפרש שווה לריבוע של הראשון <strong>פחות</strong> הריבוע של השני (האיברים האמצעיים מתבטלים!).
            </p>
            <div className="formula-example-row formula-example-cyan">
              <div className="formula-example-content">
                <span className="formula-example-label">דוגמה:</span>
                <span className="formula-example-math" dir="ltr">(x+4)(x-4) = x² - 16</span>
              </div>
              <CheckCircle size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Geometric Proof Sandbox */}
      <GeometricVisualizer />

      {/* The #1 Trap */}
      <div className="trap-container">
        <div className="trap-header">
          <div className="trap-title-group">
            <div className="trap-icon-box">
              <AlertTriangle size={26} />
            </div>
            <div>
              <h3 className="trap-title">המלכודת של 80% מהתלמידים במבחן!</h3>
              <p className="trap-subtitle">
                למה אסור בתכלית האיסור לכתוב ש- <MathView math="(a + b)^2 = a^2 + b^2" />?
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowTrapProof(!showTrapProof)}
            className="secondary-toggle-btn"
          >
            <Eye size={16} />
            <span>{showTrapProof ? 'הסתר הסבר והוכחה' : 'הצג הוכחה מספרית פשוטה'}</span>
          </button>
        </div>

        {showTrapProof && (
          <div className="trap-proof-grid">
            {/* Correct way */}
            <div className="proof-card proof-card-valid">
              <span className="proof-label proof-label-valid">
                ✅ הדרך הנכונה (לפי סדר פעולות חשבון):
              </span>
              <p className="proof-text-desc">
                נציב למשל: <MathView math="a = 3, b = 4" />
              </p>
              <div className="proof-math-valid">
                <MathView math="(3 + 4)^2 = 7^2 = 49" display />
              </div>
              <p className="proof-footer-valid">
                לפי הנוסחה: <MathView math="3^2 + 2\cdot 3\cdot 4 + 4^2 = 9 + 24 + 16 = 49" /> (מושלם!)
              </p>
            </div>

            {/* Mistake way */}
            <div className="proof-card proof-card-invalid">
              <span className="proof-label proof-label-invalid">
                ❌ הטעות הנפוצה (הזנחת ה-2ab):
              </span>
              <p className="proof-text-desc">
                אם נחשב רק <MathView math="a^2 + b^2" />:
              </p>
              <div className="proof-math-invalid">
                <MathView math="3^2 + 4^2 = 9 + 16 = 25" display />
              </div>
              <p className="proof-footer-invalid">
                49 אינו שווה ל-25! חסרים לנו בדיוק 24, שהם ה-<MathView math="2ab" />!
              </p>
            </div>

            <div className="callout-box">
              💡 <strong>כלל ברזל לחיים:</strong> חזקה <strong>אינה</strong> מתפלגת על חיבור או חיסור!
              ריבוע של סוגריים פירושו להכפיל את הסוגריים בעצמם: <MathView math="(a+b)^2 = (a+b)(a+b)" />.
            </div>
          </div>
        )}
      </div>

      {/* 4 Steps Section */}
      <div className="steps-container">
        <div className="steps-header">
          <div className="steps-icon-box">
            <Lightbulb size={22} />
          </div>
          <div>
            <h3 className="steps-heading-title">איך פותרים כל תרגיל ב-4 צעדים?</h3>
            <p className="steps-heading-sub">האלגוריתם המנצח לפתרון שאלות כפל מקוצר</p>
          </div>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-badge">1</span>
            <h4 className="step-card-title">זיהוי התבנית</h4>
            <p className="step-card-text">
              האם יש סכום בריבוע <MathView math="(a+b)^2" />, הפרש בריבוע <MathView math="(a-b)^2" />, או הפרש ריבועים <MathView math="(a+b)(a-b)" />?
            </p>
          </div>

          <div className="step-card">
            <span className="step-badge step-badge-purple">2</span>
            <h4 className="step-card-title">חילוץ a ו-b</h4>
            <p className="step-card-text">
              לדוגמה בתרגיל <MathView math="(3x + 5)^2" />:
              האיבר הראשון הוא <MathView math="a = 3x" /> והאיבר השני הוא <MathView math="b = 5" />.
            </p>
          </div>

          <div className="step-card">
            <span className="step-badge step-badge-cyan">3</span>
            <h4 className="step-card-title">העלאה בריבוע וכפל</h4>
            <p className="step-card-text">
              שימו לב: <MathView math="(3x)^2 = 9x^2" /> (גם המספר 3 מועלה בריבוע!). האיבר האמצעי: <MathView math="2 \cdot 3x \cdot 5 = 30x" />.
            </p>
          </div>

          <div className="step-card">
            <span className="step-badge step-badge-emerald">4</span>
            <h4 className="step-card-title">חיבור התוצאה</h4>
            <p className="step-card-text">
              מאחדים את שלושת החלקים: <MathView math="9x^2 + 30x + 25" /> ומסיימים בחיוך!
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA to practice */}
      <div className="cta-section">
        <h3 className="cta-heading">מרגישים מוכנים?</h3>
        <p className="cta-desc">
          התיאוריה ברורה, עכשיו הגיע הזמן לתרגל! עברו למתחם האימונים כדי להתאמן ברמות קושי שונות עם שאלות אינסופיות ורמזים חכמים.
        </p>
        <button
          onClick={onStartPractice}
          className="primary-action-btn cta-button"
        >
          <span>התחילו באימון עכשיו</span>
          <ArrowRight size={20} className="icon-arrow-flipped" />
        </button>
      </div>
    </div>
  );
};
