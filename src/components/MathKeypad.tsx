import React from 'react';
import { Delete, CheckCircle2, RotateCcw } from 'lucide-react';

interface MathKeypadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isDirectionFactoring?: boolean;
}

export const MathKeypad: React.FC<MathKeypadProps> = ({
  value,
  onChange,
  onSubmit,
  isDirectionFactoring = false,
}) => {
  const handleInsert = (token: string) => {
    onChange(value + token);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="keypad-container">
      {/* Quick shortcuts row */}
      <div className="keypad-row-4">
        <button
          type="button"
          onClick={() => handleInsert('x^2')}
          className="keypad-key keypad-key-primary"
        >
          x²
        </button>
        <button
          type="button"
          onClick={() => handleInsert('x')}
          className="keypad-key keypad-key-primary"
        >
          x
        </button>
        <button
          type="button"
          onClick={() => handleInsert('+')}
          className="keypad-key keypad-key-emerald"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => handleInsert('-')}
          className="keypad-key keypad-key-rose"
        >
          -
        </button>
      </div>

      {/* Parentheses & Exponent Row */}
      <div className="keypad-row-4">
        <button
          type="button"
          onClick={() => handleInsert('(')}
          className="keypad-key keypad-key-cyan"
        >
          (
        </button>
        <button
          type="button"
          onClick={() => handleInsert(')')}
          className="keypad-key keypad-key-cyan"
        >
          )
        </button>
        <button
          type="button"
          onClick={() => handleInsert('^2')}
          className="keypad-key keypad-key-purple"
          dir="ltr"
        >
          ( )²
        </button>
        <button
          type="button"
          onClick={() => handleInsert('y')}
          className="keypad-key keypad-key-primary"
        >
          y
        </button>
      </div>

      {/* Numpad digits */}
      <div className="keypad-row-3">
        {['7', '8', '9', '4', '5', '6', '1', '2', '3'].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleInsert(digit)}
            className="keypad-key"
          >
            {digit}
          </button>
        ))}
      </div>

      {/* Bottom row: Clear, 0, Backspace */}
      <div className="keypad-row-3">
        <button
          type="button"
          onClick={handleClear}
          className="keypad-key keypad-key-clear"
          title="נקה הכל"
        >
          <RotateCcw size={16} />
          <span className="keypad-clear-text">איפוס</span>
        </button>
        <button
          type="button"
          onClick={() => handleInsert('0')}
          className="keypad-key"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          className="keypad-key keypad-key-backspace"
          title="מחק תו אחרון"
        >
          <Delete size={20} />
        </button>
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!value.trim()}
        className="keypad-submit-btn"
      >
        <CheckCircle2 size={20} />
        <span>בדוק תשובה</span>
      </button>

      {isDirectionFactoring && (
        <div className="keypad-factoring-hint">
          💡 טיפ לפירוק לגורמים: השתמשו בסוגריים, לדוגמה: <code>(x+3)^2</code> או <code>(x+4)(x-4)</code>
        </div>
      )}
    </div>
  );
};
