import React, { useState, useRef, useEffect } from 'react';
import { MathRenderer } from './MathRenderer';
import { X, Check, Copy, Sparkles, BookOpen } from 'lucide-react';

interface EquationEditorModalProps {
  isOpen: boolean;
  initialLatex?: string;
  onClose: () => void;
  onSave: (latex: string) => void;
}

const SYMBOL_CATEGORIES = [
  {
    name: 'Greek',
    symbols: [
      { label: '\\alpha', display: '\\alpha' },
      { label: '\\beta', display: '\\beta' },
      { label: '\\gamma', display: '\\gamma' },
      { label: '\\delta', display: '\\delta' },
      { label: '\\epsilon', display: '\\epsilon' },
      { label: '\\theta', display: '\\theta' },
      { label: '\\lambda', display: '\\lambda' },
      { label: '\\mu', display: '\\mu' },
      { label: '\\pi', display: '\\pi' },
      { label: '\\rho', display: '\\rho' },
      { label: '\\sigma', display: '\\sigma' },
      { label: '\\tau', display: '\\tau' },
      { label: '\\phi', display: '\\phi' },
      { label: '\\psi', display: '\\psi' },
      { label: '\\omega', display: '\\omega' },
      { label: '\\Delta', display: '\\Delta' },
      { label: '\\Gamma', display: '\\Gamma' },
      { label: '\\Lambda', display: '\\Lambda' },
      { label: '\\Omega', display: '\\Omega' },
      { label: '\\Sigma', display: '\\Sigma' }
    ]
  },
  {
    name: 'Calculus',
    symbols: [
      { label: '\\frac{df}{dx}', display: '\\frac{df}{dx}' },
      { label: '\\frac{\\partial f}{\\partial x}', display: '\\frac{\\partial f}{\\partial x}' },
      { label: '\\int_a^b f(x)\\,dx', display: '\\int_a^b' },
      { label: '\\iint_D f(x,y)\\,dA', display: '\\iint' },
      { label: '\\oint_C \\vec{F}\\cdot d\\vec{r}', display: '\\oint' },
      { label: '\\sum_{i=1}^n x_i', display: '\\sum' },
      { label: '\\prod_{k=1}^m a_k', display: '\\prod' },
      { label: '\\lim_{x \\to 0}', display: '\\lim' },
      { label: '\\nabla', display: '\\nabla' },
      { label: '\\sqrt{x}', display: '\\sqrt{x}' },
      { label: '\\sqrt[n]{x}', display: '\\sqrt[n]{x}' },
      { label: '\\infty', display: '\\infty' },
      { label: '\\partial', display: '\\partial' }
    ]
  },
  {
    name: 'Operators & Relations',
    symbols: [
      { label: '\\pm', display: '\\pm' },
      { label: '\\times', display: '\\times' },
      { label: '\\cdot', display: '\\cdot' },
      { label: '\\leq', display: '\\leq' },
      { label: '\\geq', display: '\\geq' },
      { label: '\\neq', display: '\\neq' },
      { label: '\\approx', display: '\\approx' },
      { label: '\\equiv', display: '\\equiv' },
      { label: '\\propto', display: '\\propto' },
      { label: '\\circ', display: '\\circ' },
      { label: '\\perp', display: '\\perp' },
      { label: '\\parallel', display: '\\parallel' }
    ]
  },
  {
    name: 'Vectors & Arrows',
    symbols: [
      { label: '\\vec{F}', display: '\\vec{F}' },
      { label: '\\hat{i}', display: '\\hat{i}' },
      { label: '\\hat{j}', display: '\\hat{j}' },
      { label: '\\hat{k}', display: '\\hat{k}' },
      { label: '\\mathbf{v}', display: '\\mathbf{v}' },
      { label: '\\to', display: '\\to' },
      { label: '\\Rightarrow', display: '\\Rightarrow' },
      { label: '\\iff', display: '\\iff' },
      { label: '\\leftarrow', display: '\\leftarrow' },
      { label: '\\mapsto', display: '\\mapsto' }
    ]
  },
  {
    name: 'Matrices & Cases',
    symbols: [
      { 
        label: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', 
        display: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' 
      },
      { 
        label: '\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}', 
        display: '\\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}' 
      },
      { 
        label: '\\begin{cases} x & \\text{if } x \\geq 0 \\\\ -x & \\text{if } x < 0 \\end{cases}', 
        display: '\\begin{cases} a \\\\ b \\end{cases}' 
      },
      { label: '\\det(A)', display: '\\det(A)' }
    ]
  },
  {
    name: 'Physics & Sets',
    symbols: [
      { label: '\\hbar', display: '\\hbar' },
      { label: '\\epsilon_0', display: '\\epsilon_0' },
      { label: '\\mu_0', display: '\\mu_0' },
      { label: '\\mathbb{R}', display: '\\mathbb{R}' },
      { label: '\\mathbb{C}', display: '\\mathbb{C}' },
      { label: '\\mathbb{Z}', display: '\\mathbb{Z}' },
      { label: '\\in', display: '\\in' },
      { label: '\\notin', display: '\\notin' },
      { label: '\\subset', display: '\\subset' },
      { label: '\\cup', display: '\\cup' },
      { label: '\\cap', display: '\\cap' }
    ]
  }
];

const FORMULA_TEMPLATES = [
  {
    name: 'Newton’s 2nd Law (General)',
    latex: '\\vec{F}_{\\text{net}} = \\frac{d\\vec{p}}{dt} = m\\frac{d^2\\vec{r}}{dt^2} = m\\vec{a}'
  },
  {
    name: 'Fundamental Theorem of Calculus',
    latex: '\\frac{d}{dx}\\left( \\int_a^x f(t)\\,dt \\right) = f(x), \\qquad \\int_a^b f(x)\\,dx = F(b) - F(a)'
  },
  {
    name: 'Taylor Series Expansion',
    latex: 'f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(c)}{n!} (x - c)^n = f(c) + f\'(c)(x-c) + \\frac{f\'\'(c)}{2!}(x-c)^2 + \\cdots'
  },
  {
    name: 'Maxwell’s Equations (Differential)',
    latex: '\\begin{cases} \\nabla \\cdot \\vec{E} = \\frac{\\rho}{\\epsilon_0} \\\\[4pt] \\nabla \\cdot \\vec{B} = 0 \\\\[4pt] \\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t} \\\\[4pt] \\nabla \\times \\vec{B} = \\mu_0\\vec{J} + \\mu_0\\epsilon_0\\frac{\\partial \\vec{E}}{\\partial t} \\end{cases}'
  },
  {
    name: 'Schrödinger Time-Dependent Equation',
    latex: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\vec{r}, t) = \\left( -\\frac{\\hbar^2}{2m}\\nabla^2 + V(\\vec{r}, t) \\right) \\Psi(\\vec{r}, t)'
  },
  {
    name: 'Eigenvalue Equation',
    latex: 'A\\vec{v} = \\lambda\\vec{v} \\iff (A - \\lambda I)\\vec{v} = \\vec{0}'
  }
];

export const EquationEditorModal: React.FC<EquationEditorModalProps> = ({
  isOpen,
  initialLatex = '\\vec{F} = m\\vec{a}',
  onClose,
  onSave
}) => {
  const [latex, setLatex] = useState<string>(initialLatex);
  const [activeCategory, setActiveCategory] = useState<string>('Greek');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLatex(initialLatex);
  }, [initialLatex, isOpen]);

  if (!isOpen) return null;

  const handleInsertSymbol = (symbolLatex: string) => {
    if (!textareaRef.current) {
      setLatex(prev => prev + symbolLatex);
      return;
    }
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newText = latex.substring(0, start) + symbolLatex + latex.substring(end);
    setLatex(newText);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + symbolLatex.length, start + symbolLatex.length);
    }, 10);
  };

  const handleApplyTemplate = (templateLatex: string) => {
    setLatex(templateLatex);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div className="flex items-center gap-2">
            <span className="font-academic text-xl font-bold text-amber-900 dark:text-amber-300">∮</span>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">LaTeX Equation Editor</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Live Preview Display Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Live Mathematical Typesetting</span>
              <span className="text-xs text-neutral-400">KaTeX Responsive Engine</span>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 min-h-[90px] flex items-center justify-center overflow-x-auto shadow-inner">
              {latex.trim() ? (
                <MathRenderer latex={latex} displayMode={true} />
              ) : (
                <span className="text-neutral-400 italic text-sm">Enter LaTeX syntax below or select symbols...</span>
              )}
            </div>
          </div>

          {/* Code Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
              LaTeX Code Input
            </label>
            <textarea
              ref={textareaRef}
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              rows={3}
              placeholder="e.g. \vec{F} = m\vec{a} or \int_a^b f(x)\,dx = F(b) - F(a)"
              className="w-full font-mono text-sm p-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-neutral-900 dark:text-neutral-100 outline-none"
            />
          </div>

          {/* Quick Symbol Palettes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Mathematical Symbol Palettes</span>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-3">
              {SYMBOL_CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition ${
                    activeCategory === cat.name
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Symbol buttons in active category */}
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-h-[140px] overflow-y-auto p-1">
              {SYMBOL_CATEGORIES.find(c => c.name === activeCategory)?.symbols.map((sym, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInsertSymbol(sym.label)}
                  title={sym.label}
                  className="flex flex-col items-center justify-center p-2 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded border border-neutral-200 dark:border-neutral-700 transition"
                >
                  <MathRenderer latex={sym.display} displayMode={false} className="text-sm pointer-events-none" />
                </button>
              ))}
            </div>
          </div>

          {/* Common Formula Templates */}
          <div>
            <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2">
              Quick Academic Templates
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {FORMULA_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyTemplate(tpl.latex)}
                  className="text-left p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 hover:border-amber-500 dark:hover:border-amber-500 transition group"
                >
                  <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 block mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-400">
                    {tpl.name}
                  </span>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate pointer-events-none">
                    ${tpl.latex.substring(0, 45)}...$
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <button
            onClick={() => setLatex('')}
            className="text-xs text-neutral-500 hover:text-red-600 transition"
          >
            Clear Formula
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (latex.trim()) {
                  onSave(latex.trim());
                  onClose();
                }
              }}
              className="px-5 py-2 text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition flex items-center gap-2 shadow-sm"
            >
              <Check className="w-4 h-4" />
              Insert Equation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
