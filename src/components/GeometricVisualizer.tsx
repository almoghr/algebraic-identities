import React, { useState } from 'react';
import { MathView } from './MathView';
import { Sparkles, Sliders } from 'lucide-react';

export const GeometricVisualizer: React.FC = () => {
  const [a, setA] = useState<number>(4);
  const [b, setB] = useState<number>(2);
  const [activeFormula, setActiveFormula] = useState<'sum' | 'diff' | 'diff_squares'>('sum');

  // Relative percentages for pure SVG coordinates (no inline styles)
  const sumTotal = a + b;
  const aPct = (a / sumTotal) * 100;
  const bPct = (b / sumTotal) * 100;

  const diffA = a;
  const diffSubRatio = ((diffA - b) / diffA) * 100;
  const diffBRatio = (b / diffA) * 100;

  return (
    <div className="visualizer-container">
      <div className="visualizer-header">
        <div>
          <div className="visualizer-subheading">
            <Sparkles size={16} />
            <span>המחשה גיאומטרית אינטראקטיבית</span>
          </div>
          <h3 className="visualizer-title">
            לראות את האלגברה בעיניים!
          </h3>
          <p className="visualizer-subtitle">
            שנו את הערכים של <strong className="color-highlight-blue">a</strong> ו-
            <strong className="color-highlight-amber">b</strong> וראו כיצד השטחים מורכבים במדויק!
          </p>
        </div>

        {/* Formula selector tabs (LTR) */}
        <div className="visualizer-tabs" dir="ltr">
          <button
            onClick={() => setActiveFormula('sum')}
            className={`visualizer-tab-btn ${activeFormula === 'sum' ? 'active-sum' : ''}`}
          >
            (a + b)²
          </button>
          <button
            onClick={() => setActiveFormula('diff')}
            className={`visualizer-tab-btn ${activeFormula === 'diff' ? 'active-diff' : ''}`}
          >
            (a - b)²
          </button>
          <button
            onClick={() => setActiveFormula('diff_squares')}
            className={`visualizer-tab-btn ${activeFormula === 'diff_squares' ? 'active-diff-squares' : ''}`}
          >
            (a + b)(a - b)
          </button>
        </div>
      </div>

      {/* Sliders row */}
      <div className="sliders-row">
        <div className="slider-group">
          <Sliders size={20} className="footer-icon-primary" />
          <div className="slider-content">
            <div className="slider-label-row">
              <span className="slider-label-blue">אורך צלע a:</span>
              <span className="slider-value-badge">a = {a}</span>
            </div>
            <input
              type="range"
              min={activeFormula === 'diff' ? Math.max(3, b + 1) : 2}
              max={6}
              value={a}
              onChange={(e) => {
                const val = Number(e.target.value);
                setA(val);
                if (activeFormula === 'diff' && val <= b) {
                  setB(val - 1);
                }
              }}
              className="custom-range-input"
            />
          </div>
        </div>

        <div className="slider-group">
          <Sliders size={20} className="footer-icon-amber" />
          <div className="slider-content">
            <div className="slider-label-row">
              <span className="slider-label-amber">אורך צלע b:</span>
              <span className="slider-value-badge slider-value-amber">
                b = {b}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={activeFormula === 'diff' ? a - 1 : 4}
              value={b}
              onChange={(e) => setB(Number(e.target.value))}
              className="custom-range-input"
            />
          </div>
        </div>
      </div>

      {/* Content depending on active tab */}
      {activeFormula === 'sum' && (
        <div className="visualizer-body-grid">
          {/* Vector SVG Canvas (LTR) */}
          <div className="canvas-wrapper">
            <svg
              className="geo-svg-container"
              viewBox="0 0 100 100"
            >
              {/* a^2 square */}
              <rect
                x="0"
                y="0"
                width={aPct}
                height={aPct}
                className="svg-rect-blue"
              />
              <text x={aPct / 2} y={aPct / 2 - 4} className="svg-text-primary" fontSize="9">
                a²
              </text>
              <text x={aPct / 2} y={aPct / 2 + 5} className="svg-text-secondary" fontSize="4.5">
                {a}×{a}={a * a}
              </text>

              {/* ab top-right rectangle */}
              <rect
                x={aPct}
                y="0"
                width={bPct}
                height={aPct}
                className="svg-rect-emerald"
              />
              <text x={aPct + bPct / 2} y={aPct / 2 - 3} className="svg-text-primary" fontSize="7">
                ab
              </text>
              <text x={aPct + bPct / 2} y={aPct / 2 + 4} className="svg-text-secondary" fontSize="4">
                {a}×{b}={a * b}
              </text>

              {/* ab bottom-left rectangle */}
              <rect
                x="0"
                y={aPct}
                width={aPct}
                height={bPct}
                className="svg-rect-emerald"
              />
              <text x={aPct / 2} y={aPct + bPct / 2 - 3} className="svg-text-primary" fontSize="7">
                ab
              </text>
              <text x={aPct / 2} y={aPct + bPct / 2 + 4} className="svg-text-secondary" fontSize="4">
                {b}×{a}={a * b}
              </text>

              {/* b^2 bottom-right square */}
              <rect
                x={aPct}
                y={aPct}
                width={bPct}
                height={bPct}
                className="svg-rect-amber"
              />
              <text x={aPct + bPct / 2} y={aPct + bPct / 2 - 3} className="svg-text-primary" fontSize="7">
                b²
              </text>
              <text x={aPct + bPct / 2} y={aPct + bPct / 2 + 4} className="svg-text-secondary" fontSize="4">
                {b}×{b}={b * b}
              </text>
            </svg>

            {/* Separated LTR math parts */}
            <div className="canvas-footer-caption">
              <span>אורך צלע כולל:</span>
              <span className="caption-math" dir="ltr">({a} + {b}) = {a + b}</span>
              <span>יחידות | שטח כולל:</span>
              <span className="caption-math" dir="ltr">({a} + {b})² = {(a + b) * (a + b)}</span>
            </div>
          </div>

          {/* Explanation Math Box */}
          <div>
            <div className="math-info-box">
              <div className="math-info-title">נוסחת ריבוע סכום</div>
              <MathView math="(a + b)^2 = a^2 + 2ab + b^2" display />
            </div>

            <div>
              <div className="breakdown-row breakdown-blue">
                <span>
                  <span className="breakdown-dot breakdown-dot-blue" />
                  <span>ריבוע כחול (a²):</span>
                </span>
                <strong>{a}² = {a * a}</strong>
              </div>

              <div className="breakdown-row breakdown-green">
                <span>
                  <span className="breakdown-dot breakdown-dot-green" />
                  <span>שני מלבנים ירוקים (2ab):</span>
                </span>
                <strong>2 × ({a} × {b}) = {2 * a * b}</strong>
              </div>

              <div className="breakdown-row breakdown-amber">
                <span>
                  <span className="breakdown-dot breakdown-dot-amber" />
                  <span>ריבוע כתום (b²):</span>
                </span>
                <strong>{b}² = {b * b}</strong>
              </div>
            </div>

            <div className="callout-box callout-box-trap">
              <strong className="callout-title-rose">
                🚨 המלכודת הגדולה של כיתה ח':
              </strong>
              תלמידים רבים חושבים ש- <MathView math="(a + b)^2 = a^2 + b^2" />.
              שימו לב בריבוע הגיאומטרי: אם ניקח רק את הריבוע הכחול והכתום,{' '}
              <strong className="color-highlight-white">נפספס את שני המלבנים הירוקים בשטח {2 * a * b}!</strong>{' '}
              לכן חייבים להוסיף תמיד את <MathView math="+ 2ab" />.
            </div>
          </div>
        </div>
      )}

      {activeFormula === 'diff' && (
        <div className="visualizer-body-grid">
          <div className="canvas-wrapper">
            <svg
              className="geo-svg-container geo-svg-rose"
              viewBox="0 0 100 100"
            >
              {/* (a-b)^2 target square */}
              <rect
                x="0"
                y="0"
                width={diffSubRatio}
                height={diffSubRatio}
                className="svg-rect-rose"
              />
              <text
                x={diffSubRatio / 2}
                y={diffSubRatio / 2 - 3}
                className="svg-text-primary"
                fontSize="8"
              >
                (a-b)²
              </text>
              <text
                x={diffSubRatio / 2}
                y={diffSubRatio / 2 + 5}
                className="svg-text-secondary"
                fontSize="4.5"
              >
                {a - b}×{a - b}={(a - b) * (a - b)}
              </text>

              {/* Subtracted right strip */}
              <rect
                x={diffSubRatio}
                y="0"
                width={diffBRatio}
                height="100"
                className="svg-rect-dark-strip"
              />
              <text
                x={diffSubRatio + diffBRatio / 2}
                y={diffSubRatio / 2}
                className="svg-text-cutout"
                fontSize="4"
              >
                הורדנו ab
              </text>

              {/* Subtracted bottom strip */}
              <rect
                x="0"
                y={diffSubRatio}
                width="100"
                height={diffBRatio}
                className="svg-rect-dark-strip"
              />
              <text
                x={diffSubRatio / 2}
                y={diffSubRatio + diffBRatio / 2}
                className="svg-text-cutout"
                fontSize="4"
              >
                הורדנו ab
              </text>

              {/* Added back b^2 overlap */}
              <rect
                x={diffSubRatio}
                y={diffSubRatio}
                width={diffBRatio}
                height={diffBRatio}
                className="svg-rect-amber"
              />
              <text
                x={diffSubRatio + diffBRatio / 2}
                y={diffSubRatio + diffBRatio / 2 - 2}
                className="svg-text-primary"
                fontSize="6"
              >
                +b²
              </text>
              <text
                x={diffSubRatio + diffBRatio / 2}
                y={diffSubRatio + diffBRatio / 2 + 4}
                className="svg-text-secondary"
                fontSize="3.5"
              >
                הוחזר
              </text>
            </svg>

            {/* Separated LTR math parts */}
            <div className="canvas-footer-caption">
              <span>ריבוע התחלתי:</span>
              <span className="caption-math" dir="ltr">{a}² = {a * a}</span>
              <span>| שטח הריבוע המבוקש:</span>
              <span className="caption-math" dir="ltr">({a} - {b})² = {(a - b) * (a - b)}</span>
            </div>
          </div>

          <div>
            <div className="math-info-box math-info-box-rose">
              <div className="math-info-title math-info-title-rose">נוסחת ריבוע הפרש</div>
              <MathView math="(a - b)^2 = a^2 - 2ab + b^2" display />
            </div>

            <div className="diff-desc-text">
              <p className="diff-desc-p">
                מתחילים מריבוע גדול בשטח <MathView math="a^2" />.
              </p>
              <p className="diff-desc-p-spaced">
                מחסירים שתי רצועות ברוחב <MathView math="b" />, כלומר <MathView math="-2ab" />.
              </p>
              <div className="callout-box callout-box-amber">
                💡 <strong>מדוע הנוסחה מסתיימת ב-+b²?</strong><br />
                הפינה בפינה התחתונה (<MathView math="b^2" />) נחתכה <strong>פעמיים</strong> ברצועות שהורדנו! לכן חייבים לפצות ולהוסיף אותה פעם אחת בחזרה: <MathView math="+ b^2" />.
              </div>
            </div>
          </div>
        </div>
      )}

      {activeFormula === 'diff_squares' && (
        <div className="visualizer-body-grid">
          <div className="canvas-wrapper">
            <svg
              className="geo-svg-container geo-svg-cyan"
              viewBox="0 0 100 100"
            >
              {/* Full a^2 shape with cutout */}
              <rect
                x="0"
                y="0"
                width="100"
                height="100"
                className="svg-rect-cyan"
              />
              <text
                x="50"
                y="55"
                className="svg-text-primary"
                fontSize="9"
              >
                a² - b²
              </text>
              <text
                x="50"
                y="65"
                className="svg-text-secondary"
                fontSize="4.5"
              >
                {a}² - {b}² = {a * a - b * b}
              </text>

              {/* Cutout corner b x b */}
              <rect
                x={100 - diffBRatio}
                y="0"
                width={diffBRatio}
                height={diffBRatio}
                className="svg-rect-cutout"
              />
              <text
                x={100 - diffBRatio / 2}
                y={diffBRatio / 2 - 2}
                className="svg-text-cutout"
                fontSize="5"
              >
                נחתך
              </text>
              <text
                x={100 - diffBRatio / 2}
                y={diffBRatio / 2 + 3.5}
                className="svg-text-cutout"
                fontSize="3.5"
              >
                b²={b * b}
              </text>
            </svg>

            {/* Separated LTR math parts */}
            <div className="canvas-footer-caption">
              <span>אם נגזור את הרצועה הנותרת ונצמיד אותה לצד, נקבל מלבן במידות</span>
              <span className="caption-math" dir="ltr">({a} + {b})</span>
              <span>על</span>
              <span className="caption-math" dir="ltr">({a} - {b})</span>
              <span>בשטח</span>
              <span className="caption-math" dir="ltr">{a}² - {b}² = {a * a - b * b}</span>
            </div>
          </div>

          <div>
            <div className="math-info-box math-info-box-cyan">
              <div className="math-info-title math-info-title-cyan">נוסחת הפרש ריבועים</div>
              <MathView math="(a + b)(a - b) = a^2 - b^2" display />
            </div>

            <div className="callout-box callout-box-cyan">
              ✨ <strong>שימו לב מה קורה בפתיחת סוגריים רגילה:</strong><br />
              <MathView math="(a+b)(a-b) = a^2 - ab + ba - b^2" display />
              האיבר <MathView math="-ab" /> והאיבר <MathView math="+ba" /> הם איברים נגדיים, ולכן הם <strong>מתבטלים לאפס!</strong><br />
              נשארים אך ורק עם הריבוע של הראשון פחות הריבוע של השני: <MathView math="a^2 - b^2" />.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
