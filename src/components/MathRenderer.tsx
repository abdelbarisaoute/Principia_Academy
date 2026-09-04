import React, { useMemo } from 'react';
import katex from 'katex';

interface MathRendererProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({
  latex,
  displayMode = false,
  className = ''
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode,
        throwOnError: false,
        output: 'htmlAndMathml',
        trust: true,
        strict: false
      });
    } catch (err) {
      console.warn('KaTeX rendering error:', err);
      return `<span class="text-red-500 font-mono text-xs">[KaTeX error: ${latex}]</span>`;
    }
  }, [latex, displayMode]);

  if (displayMode) {
    return (
      <div 
        className={`math-display-container my-4 text-center select-all ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span 
      className={`inline-math select-all ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

interface FormattedTextProps {
  content?: string;
  className?: string;
}

/**
 * Parses markdown text with inline LaTeX ($...$) and display LaTeX ($$...$$),
 * bold (**...**), italics (*...*), and renders them cleanly.
 */
export const FormattedText: React.FC<FormattedTextProps> = ({ content = '', className = '' }) => {
  const renderedElements = useMemo(() => {
    if (!content) return null;

    // Split by display math $$...$$ first
    const displayMathRegex = /\$\$([\s\S]*?)\$\$/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = displayMathRegex.exec(content)) !== null) {
      const precedingText = content.substring(lastIndex, match.index);
      if (precedingText) {
        parts.push(renderInlineAndMarkdown(precedingText, `pre-${match.index}`));
      }

      const displayLatex = match[1];
      parts.push(
        <MathRenderer 
          key={`disp-${match.index}`} 
          latex={displayLatex} 
          displayMode={true} 
        />
      );
      lastIndex = match.index + match[0].length;
    }

    const remainingText = content.substring(lastIndex);
    if (remainingText) {
      parts.push(renderInlineAndMarkdown(remainingText, `rem-${lastIndex}`));
    }

    return parts;
  }, [content]);

  return <div className={`textbook-prose ${className}`}>{renderedElements}</div>;
};

function renderInlineAndMarkdown(text: string, keyPrefix: string): React.ReactNode {
  // Split paragraphs
  const paragraphs = text.split(/\n\s*\n/);
  
  return (
    <React.Fragment key={keyPrefix}>
      {paragraphs.map((p, pIdx) => {
        if (!p.trim()) return null;
        
        // Parse inline math $...$
        const inlineMathRegex = /\$([^\$]+?)\$/g;
        const inlineParts: React.ReactNode[] = [];
        let curIdx = 0;
        let inlineMatch: RegExpExecArray | null;

        while ((inlineMatch = inlineMathRegex.exec(p)) !== null) {
          const pre = p.substring(curIdx, inlineMatch.index);
          if (pre) {
            inlineParts.push(renderFormatting(pre, `${keyPrefix}-p${pIdx}-txt-${curIdx}`));
          }

          const math = inlineMatch[1];
          inlineParts.push(
            <MathRenderer 
              key={`${keyPrefix}-p${pIdx}-m-${inlineMatch.index}`} 
              latex={math} 
              displayMode={false} 
            />
          );
          curIdx = inlineMatch.index + inlineMatch[0].length;
        }

        const remaining = p.substring(curIdx);
        if (remaining) {
          inlineParts.push(renderFormatting(remaining, `${keyPrefix}-p${pIdx}-rem`));
        }

        return (
          <p key={`${keyPrefix}-p-${pIdx}`} className="leading-relaxed mb-4">
            {inlineParts}
          </p>
        );
      })}
    </React.Fragment>
  );
}

function renderFormatting(text: string, key: string): React.ReactNode {
  // Format bold **...** and italics *...*
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <React.Fragment key={key}>
      {tokens.map((token, idx) => {
        if (token.startsWith('**') && token.endsWith('**')) {
          return <strong key={idx} className="font-semibold text-neutral-900 dark:text-neutral-100">{token.slice(2, -2)}</strong>;
        }
        if (token.startsWith('*') && token.endsWith('*')) {
          return <em key={idx} className="italic text-neutral-800 dark:text-neutral-200">{token.slice(1, -1)}</em>;
        }
        return token;
      })}
    </React.Fragment>
  );
}
