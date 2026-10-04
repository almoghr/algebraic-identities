import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  display?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, display = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: display,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return `<code>${math}</code>`;
    }
  }, [math, display]);

  return (
    <span
      className={`inline-math ${display ? 'block-math' : ''} ${className}`}
      dir="ltr"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const FormattedMathText: React.FC<{ text: string; className?: string }> = ({
  text,
  className = '',
}) => {
  const parts = useMemo(() => {
    const regex = /\$([^\$]+)\$/g;
    const result: Array<{ isMath: boolean; content: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({ isMath: false, content: text.substring(lastIndex, match.index) });
      }
      result.push({ isMath: true, content: match[1] });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      result.push({ isMath: false, content: text.substring(lastIndex) });
    }

    return result;
  }, [text]);

  return (
    <span className={className}>
      {parts.map((p, idx) =>
        p.isMath ? (
          <MathView key={idx} math={p.content} />
        ) : (
          <span key={idx}>{p.content}</span>
        )
      )}
    </span>
  );
};
