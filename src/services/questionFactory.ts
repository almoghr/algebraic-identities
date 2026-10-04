export type IdentityType = 'sum_square' | 'diff_square' | 'diff_of_squares';
export type DifficultyLevel = 1 | 2 | 3;

export interface StepByStepHint {
  formulaName: string;
  formulaTemplate: string;
  step1: string;
  step2: string;
  step3Parts: string[];
  step4Result: string;
}

export interface Question {
  id: string;
  type: IdentityType;
  level: DifficultyLevel;
  direction: 'expand' | 'factor';
  promptLatex: string;
  promptText: string;
  answerLatex: string;
  answerNormalized: string;
  acceptableAnswers: string[];
  options: string[]; // 4 LaTeX strings
  correctOptionIndex: number;
  explanation: StepByStepHint;
  aStr: string;
  bStr: string;
}

// Helper to choose random integer in [min, max] inclusive
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to shuffle an array
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Normalize algebraic string for comparison
export function normalizeAlgebraic(input: string): string {
  return input
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\\cdot/g, '')
    .replace(/\*/g, '')
    .replace(/²/g, '^2')
    .replace(/X/g, 'x')
    .replace(/Y/g, 'y');
}

export function isAnswerCorrect(userInput: string, question: Question): boolean {
  const normUser = normalizeAlgebraic(userInput);
  if (!normUser) return false;

  for (const acc of question.acceptableAnswers) {
    if (normUser === normalizeAlgebraic(acc)) return true;
  }

  // Handle commutativity for (a+b)(a-b) vs (a-b)(a+b)
  if (question.type === 'diff_of_squares' && question.direction === 'factor') {
    const match = normUser.match(/^\(([^)]+)\)\(([^)]+)\)$/);
    if (match) {
      const part1 = match[1];
      const part2 = match[2];
      const flipped = `(${part2})(${part1})`;
      for (const acc of question.acceptableAnswers) {
        if (flipped === normalizeAlgebraic(acc)) return true;
      }
    }
  }

  return false;
}

export function generateQuestion(level: DifficultyLevel = 1, fixedType?: IdentityType): Question {
  const types: IdentityType[] = ['sum_square', 'diff_square', 'diff_of_squares'];
  const type = fixedType || types[Math.floor(Math.random() * types.length)];
  const id = Math.random().toString(36).substring(2, 9);

  let aCoeff = 1;
  let bVal = 2;
  const variable = 'x';

  if (level === 1) {
    // Level 1: x + b where aCoeff = 1, b in [1, 9]
    aCoeff = 1;
    bVal = randInt(1, 9);
  } else if (level === 2) {
    // Level 2: kx + b where k in [2, 5], b in [2, 8]
    aCoeff = randInt(2, 5);
    bVal = randInt(2, 8);
  } else {
    // Level 3 (Factoring): can have aCoeff = 1 (60% chance) or 2/3 (40% chance)
    aCoeff = Math.random() < 0.6 ? 1 : randInt(2, 4);
    bVal = randInt(1, 9);
  }

  const aStr = aCoeff === 1 ? variable : `${aCoeff}${variable}`;
  const aSquaredCoeff = aCoeff * aCoeff;
  const aSquaredStr = aSquaredCoeff === 1 ? `${variable}^2` : `${aSquaredCoeff}${variable}^2`;

  const bSquared = bVal * bVal;
  const twoAB = 2 * aCoeff * bVal;
  const ab = aCoeff * bVal;

  let promptLatex = '';
  let promptText = '';
  let answerLatex = '';
  let answerNormalized = '';
  const acceptableAnswers: string[] = [];
  const optionsSet = new Set<string>();

  let formulaName = '';
  let formulaTemplate = '';
  let step1 = '';
  let step2 = '';
  const step3Parts: string[] = [];
  let step4Result = '';

  if (level === 1 || level === 2) {
    // DIRECTION: EXPAND (פתיחת סוגריים)
    if (type === 'sum_square') {
      formulaName = 'נוסחה 1: ריבוע של סכום';
      formulaTemplate = '(a + b)^2 = a^2 + 2ab + b^2';
      promptLatex = `(${aStr} + ${bVal})^2`;
      promptText = `פתחו את הסוגריים לפי נוסחת הכפל המקוצר:`;

      answerLatex = `${aSquaredStr} + ${twoAB}${variable} + ${bSquared}`;
      answerNormalized = `${aSquaredStr}+${twoAB}${variable}+${bSquared}`;
      acceptableAnswers.push(answerNormalized);
      // Alternative valid permutations
      acceptableAnswers.push(`${bSquared}+${twoAB}${variable}+${aSquaredStr}`);
      acceptableAnswers.push(`${twoAB}${variable}+${aSquaredStr}+${bSquared}`);

      step1 = `נזהה את איברי הנוסחה: האיבר הראשון הוא $a = ${aStr}$, והאיבר השני הוא $b = ${bVal}$.`;
      step2 = `נשתמש בנוסחת סכום בריבוע: $(a + b)^2 = a^2 + 2ab + b^2$.`;
      step3Parts.push(`איבר ראשון בריבוע: $a^2 = (${aStr})^2 = ${aSquaredStr}$`);
      step3Parts.push(`הכפלת האיברים כפול 2: $2ab = 2 \\cdot (${aStr}) \\cdot ${bVal} = ${twoAB}${variable}$`);
      step3Parts.push(`איבר שני בריבוע: $b^2 = ${bVal}^2 = ${bSquared}$`);
      step4Result = `נחבר את כל החלקים ונקבל: $(${aStr} + ${bVal})^2 = ${answerLatex}$`;

      // Distractors
      // Distractor 1: Missing middle term (a^2 + b^2) - classic mistake!
      optionsSet.add(`${aSquaredStr} + ${bSquared}`);
      // Distractor 2: Forgot factor of 2 (ab instead of 2ab)
      optionsSet.add(`${aSquaredStr} + ${ab}${variable} + ${bSquared}`);
      // Distractor 3: Wrong sign (-2ab)
      optionsSet.add(`${aSquaredStr} - ${twoAB}${variable} + ${bSquared}`);
      // Distractor 4 (if aCoeff > 1): did not square coefficient
      if (aCoeff > 1) {
        optionsSet.add(`${aCoeff}${variable}^2 + ${twoAB}${variable} + ${bSquared}`);
      } else {
        optionsSet.add(`${aSquaredStr} + ${twoAB + 2}${variable} + ${bSquared}`);
      }
    } else if (type === 'diff_square') {
      formulaName = 'נוסחה 2: ריבוע של הפרש';
      formulaTemplate = '(a - b)^2 = a^2 - 2ab + b^2';
      promptLatex = `(${aStr} - ${bVal})^2`;
      promptText = `פתחו את הסוגריים לפי נוסחת הכפל המקוצר:`;

      answerLatex = `${aSquaredStr} - ${twoAB}${variable} + ${bSquared}`;
      answerNormalized = `${aSquaredStr}-${twoAB}${variable}+${bSquared}`;
      acceptableAnswers.push(answerNormalized);
      acceptableAnswers.push(`${bSquared}-${twoAB}${variable}+${aSquaredStr}`);

      step1 = `נזהה את איברי הנוסחה: האיבר הראשון הוא $a = ${aStr}$, והאיבר השני הוא $b = ${bVal}$.`;
      step2 = `נשתמש בנוסחת הפרש בריבוע: $(a - b)^2 = a^2 - 2ab + b^2$. שימו לב למינוס לפני ה-$2ab$ ולפלוס לפני ה-$b^2$!`;
      step3Parts.push(`איבר ראשון בריבוע: $a^2 = (${aStr})^2 = ${aSquaredStr}$`);
      step3Parts.push(`מינוס כפל האיברים פי 2: $-2ab = -2 \\cdot (${aStr}) \\cdot ${bVal} = -${twoAB}${variable}$`);
      step3Parts.push(`איבר שני בריבוע: $b^2 = (-${bVal})^2 = +${bSquared}$`);
      step4Result = `נחבר את כל החלקים ונקבל: $(${aStr} - ${bVal})^2 = ${answerLatex}$`;

      // Distractors
      optionsSet.add(`${aSquaredStr} - ${bSquared}`); // Missed middle
      optionsSet.add(`${aSquaredStr} + ${twoAB}${variable} + ${bSquared}`); // Wrong sign (+ instead of -)
      optionsSet.add(`${aSquaredStr} - ${twoAB}${variable} - ${bSquared}`); // Wrong sign on b^2 (- instead of +)
      if (aCoeff > 1) {
        optionsSet.add(`${aCoeff}${variable}^2 - ${twoAB}${variable} + ${bSquared}`);
      } else {
        optionsSet.add(`${aSquaredStr} - ${ab}${variable} + ${bSquared}`);
      }
    } else {
      // type === 'diff_of_squares'
      formulaName = 'נוסחה 3: הפרש ריבועים';
      formulaTemplate = '(a + b)(a - b) = a^2 - b^2';
      promptLatex = `(${aStr} + ${bVal})(${aStr} - ${bVal})`;
      promptText = `פתחו את המכפלה לפי נוסחת הפרש ריבועים:`;

      answerLatex = `${aSquaredStr} - ${bSquared}`;
      answerNormalized = `${aSquaredStr}-${bSquared}`;
      acceptableAnswers.push(answerNormalized);

      step1 = `נזהה את איברי המכפלה: איבר ראשון $a = ${aStr}$, איבר שני $b = ${bVal}$.`;
      step2 = `נשתמש בנוסחת הפרש ריבועים: $(a + b)(a - b) = a^2 - b^2$. האיברים האמצעיים מבטלים זה את זה!`;
      step3Parts.push(`איבר ראשון בריבוע: $a^2 = (${aStr})^2 = ${aSquaredStr}$`);
      step3Parts.push(`איבר שני בריבוע: $b^2 = ${bVal}^2 = ${bSquared}$`);
      step4Result = `נחסר ביניהם: $a^2 - b^2 = ${answerLatex}$`;

      // Distractors
      optionsSet.add(`${aSquaredStr} + ${bSquared}`); // Plus instead of minus
      optionsSet.add(`${aSquaredStr} - ${twoAB}${variable} + ${bSquared}`); // Added 2ab unnecessarily
      optionsSet.add(`${aSquaredStr} + ${twoAB}${variable} - ${bSquared}`);
      if (aCoeff > 1) {
        optionsSet.add(`${aCoeff}${variable}^2 - ${bSquared}`);
      } else {
        optionsSet.add(`${aSquaredStr} - ${bVal * 2}`); // b*2 instead of b^2
      }
    }
  } else {
    // DIRECTION: FACTOR / REVERSE (פירוק לגורמים - רמה 3)
    if (type === 'sum_square') {
      formulaName = 'נוסחה 1 בהיפוך: פירוק לריבוע סכום';
      formulaTemplate = 'a^2 + 2ab + b^2 = (a + b)^2';
      promptLatex = `${aSquaredStr} + ${twoAB}${variable} + ${bSquared}`;
      promptText = `פרקו לגורמים וסגרו בתוך סוגריים:`;

      answerLatex = `(${aStr} + ${bVal})^2`;
      answerNormalized = `(${aStr}+${bVal})^2`;
      acceptableAnswers.push(answerNormalized);
      acceptableAnswers.push(`(${aStr}+${bVal})(${aStr}+${bVal})`);
      acceptableAnswers.push(`(${bVal}+${aStr})^2`);

      step1 = `נזהה את מבנה התלת-איבר: יש 3 איברים עם סימני פלוס בלבד. זהו מבנה של $a^2 + 2ab + b^2$.`;
      step2 = `נחלץ את האיברים על ידי שורש:`;
      step3Parts.push(`האיבר הראשון בריבוע הוא $a^2 = ${aSquaredStr} \\Rightarrow a = ${aStr}$`);
      step3Parts.push(`האיבר האחרון בריבוע הוא $b^2 = ${bSquared} \\Rightarrow b = ${bVal}$`);
      step3Parts.push(`נבדוק את האיבר האמצעי: $2 \\cdot (${aStr}) \\cdot ${bVal} = ${twoAB}${variable}$ (מתאים בדיוק!)`);
      step4Result = `נסגור לסוגריים בריבוע: $(${aStr} + ${bVal})^2$`;

      // Distractors
      optionsSet.add(`(${aStr} - ${bVal})^2`); // Minus instead of plus
      optionsSet.add(`(${aStr} + ${bVal})(${aStr} - ${bVal})`); // Difference of squares
      optionsSet.add(`(${aSquaredStr} + ${bVal})^2`);
      optionsSet.add(`(${aStr} + ${bSquared})^2`);
    } else if (type === 'diff_square') {
      formulaName = 'נוסחה 2 בהיפוך: פירוק לריבוע הפרש';
      formulaTemplate = 'a^2 - 2ab + b^2 = (a - b)^2';
      promptLatex = `${aSquaredStr} - ${twoAB}${variable} + ${bSquared}`;
      promptText = `פרקו לגורמים וסגרו בתוך סוגריים:`;

      answerLatex = `(${aStr} - ${bVal})^2`;
      answerNormalized = `(${aStr}-${bVal})^2`;
      acceptableAnswers.push(answerNormalized);
      acceptableAnswers.push(`(${aStr}-${bVal})(${aStr}-${bVal})`);

      step1 = `נזהה את המבנה: 3 איברים כאשר האיבר האמצעי שלילי והאחרון חיובי: $a^2 - 2ab + b^2$.`;
      step2 = `נחלץ את $a$ ו-$b$:`;
      step3Parts.push(`$a^2 = ${aSquaredStr} \\Rightarrow a = ${aStr}$`);
      step3Parts.push(`$b^2 = ${bSquared} \\Rightarrow b = ${bVal}$`);
      step3Parts.push(`נאמת איבר אמצעי: $-2ab = -2 \\cdot (${aStr}) \\cdot ${bVal} = -${twoAB}${variable}$ (נכון!)`);
      step4Result = `נסגור לסוגריים בריבוע של הפרש: $(${aStr} - ${bVal})^2$`;

      // Distractors
      optionsSet.add(`(${aStr} + ${bVal})^2`); // Plus instead of minus
      optionsSet.add(`(${aStr} + ${bVal})(${aStr} - ${bVal})`);
      optionsSet.add(`(${aStr} - ${bSquared})^2`);
      optionsSet.add(`(${aSquaredStr} - ${bVal})^2`);
    } else {
      // type === 'diff_of_squares'
      formulaName = 'נוסחה 3 בהיפוך: פירוק להפרש ריבועים';
      formulaTemplate = 'a^2 - b^2 = (a + b)(a - b)';
      promptLatex = `${aSquaredStr} - ${bSquared}`;
      promptText = `פרקו לגורמים לפי הפרש ריבועים:`;

      answerLatex = `(${aStr} + ${bVal})(${aStr} - ${bVal})`;
      answerNormalized = `(${aStr}+${bVal})(${aStr}-${bVal})`;
      acceptableAnswers.push(answerNormalized);
      acceptableAnswers.push(`(${aStr}-${bVal})(${aStr}+${bVal})`);

      step1 = `נזהה את המבנה: ישנם רק שני איברים עם סימן חיסור ביניהם. זהו הפרש ריבועים $a^2 - b^2$!`;
      step2 = `נוציא שורש ריבועי מכל אחד משני האיברים:`;
      step3Parts.push(`$\\sqrt{${aSquaredStr}} = ${aStr} \\Rightarrow a = ${aStr}$`);
      step3Parts.push(`$\\sqrt{${bSquared}} = ${bVal} \\Rightarrow b = ${bVal}$`);
      step4Result = `נציב בשני זוגות סוגריים (אחד עם פלוס ואחד עם מינוס): $(${aStr} + ${bVal})(${aStr} - ${bVal})$`;

      // Distractors
      optionsSet.add(`(${aStr} - ${bVal})^2`);
      optionsSet.add(`(${aStr} + ${bVal})^2`);
      optionsSet.add(`(${aStr} + ${bSquared})(${aStr} - ${bSquared})`);
      if (aCoeff > 1) {
        optionsSet.add(`(${aCoeff}${variable} - ${bVal})^2`);
      } else {
        optionsSet.add(`(${aStr} - ${bVal / 2})(${aStr} + ${bVal / 2})`);
      }
    }
  }

  // Remove the correct answer from distractors if present
  optionsSet.delete(answerLatex);

  // Take 3 distinct distractors
  const distractors = Array.from(optionsSet).slice(0, 3);
  while (distractors.length < 3) {
    distractors.push(`${aSquaredStr} + ${bSquared + distractors.length}`);
  }

  // Combine with correct answer and shuffle
  const allOptions = shuffle([answerLatex, ...distractors]);
  const correctOptionIndex = allOptions.indexOf(answerLatex);

  return {
    id,
    type,
    level,
    direction: level === 3 ? 'factor' : 'expand',
    promptLatex,
    promptText,
    answerLatex,
    answerNormalized,
    acceptableAnswers,
    options: allOptions,
    correctOptionIndex,
    explanation: {
      formulaName,
      formulaTemplate,
      step1,
      step2,
      step3Parts,
      step4Result,
    },
    aStr,
    bStr: String(bVal),
  };
}
