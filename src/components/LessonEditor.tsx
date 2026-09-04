import React, { useState } from 'react';
import { Lesson, ContentBlock, BlockType, ExerciseData } from '../types';
import { storage } from '../lib/storage';
import { MathRenderer, FormattedText } from './MathRenderer';
import { DiagramRenderer } from './DiagramRenderer';
import { EquationEditorModal } from './EquationEditorModal';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, Copy, Eye, Edit3, Save, 
  Check, BookOpen, Sparkles, HelpCircle, Code, Image, FileText, 
  AlertTriangle, Info, Compass, Sigma, ArrowLeft
} from 'lucide-react';

interface LessonEditorProps {
  initialLesson: Lesson;
  onSave: (savedLesson: Lesson) => void;
  onCancel: () => void;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  initialLesson,
  onSave,
  onCancel
}) => {
  const [lesson, setLesson] = useState<Lesson>(JSON.parse(JSON.stringify(initialLesson)));
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'split'>('editor');
  const [editingEquationBlockId, setEditingEquationBlockId] = useState<string | null>(null);
  const [isEquationModalOpen, setIsEquationModalOpen] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Block management
  const handleAddBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      text: '',
      level: type === 'heading' ? 2 : undefined,
      title: type === 'definition' ? 'Definition' : type === 'theorem' ? 'Theorem' : type === 'example' ? 'Example' : type === 'proof' ? 'Proof' : undefined,
      latex: type === 'equation' ? '\\vec{F}_{\\text{net}} = m\\vec{a}' : undefined,
      exercise: type === 'exercise' ? {
        id: `ex-${Date.now()}`,
        prompt: 'State the problem prompt here...',
        solutionLatex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        solutionExplanation: 'Step-by-step worked analytical solution...'
      } : undefined,
      diagram: type === 'diagram' ? {
        type: 'freebody',
        title: 'Free-Body Force Diagram',
        config: { angle: 30, mass: 5, mu: 0.2 }
      } : undefined
    };

    setLesson(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const handleUpdateBlock = (id: string, updates: Partial<ContentBlock>) => {
    setLesson(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const handleDeleteBlock = (id: string) => {
    setLesson(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
  };

  const handleDuplicateBlock = (block: ContentBlock) => {
    const copy: ContentBlock = {
      ...JSON.parse(JSON.stringify(block)),
      id: `b-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    const idx = lesson.blocks.findIndex(b => b.id === block.id);
    const newBlocks = [...lesson.blocks];
    newBlocks.splice(idx + 1, 0, copy);
    setLesson(prev => ({ ...prev, blocks: newBlocks }));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === lesson.blocks.length - 1)) return;
    const newBlocks = [...lesson.blocks];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIdx];
    newBlocks[targetIdx] = temp;
    setLesson(prev => ({ ...prev, blocks: newBlocks }));
  };

  const handleSave = () => {
    storage.saveLesson(lesson);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    onSave(lesson);
  };

  const openEquationEditor = (blockId: string) => {
    setEditingEquationBlockId(blockId);
    setIsEquationModalOpen(true);
  };

  const activeEquationBlock = lesson.blocks.find(b => b.id === editingEquationBlockId);

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      {/* Top Author Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-amber-800 dark:text-amber-400 uppercase">
                Author Studio
              </span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs font-medium text-neutral-500">
                Lesson § {lesson.number}
              </span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-md">
              {lesson.title || 'Untitled Lesson'}
            </h2>
          </div>
        </div>

        {/* View mode switcher & Save actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded font-medium transition ${activeTab === 'editor' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              Block Editor
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`px-3 py-1 rounded font-medium transition ${activeTab === 'split' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded font-medium transition ${activeTab === 'preview' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              Reader Preview
            </button>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-medium text-sm transition flex items-center gap-2 shadow-sm"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </header>

      {/* Main Authoring Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 gap-6">
        
        {/* Lesson Metadata Accordion */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
            Lesson Metadata & Publishing State
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">Section Number</label>
              <input
                type="text"
                value={lesson.number}
                onChange={(e) => setLesson({ ...lesson, number: e.target.value })}
                className="w-full p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">Lesson Title</label>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => setLesson({ ...lesson, title: e.target.value })}
                className="w-full p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 font-semibold"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">Status</label>
              <select
                value={lesson.status}
                onChange={(e) => setLesson({ ...lesson, status: e.target.value as any })}
                className="w-full p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 font-medium"
              >
                <option value="draft">Draft (Private)</option>
                <option value="review">In Academic Review</option>
                <option value="published">Published (Live in Library)</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">Estimated Reading Time</label>
              <input
                type="number"
                value={lesson.readingTimeMinutes}
                onChange={(e) => setLesson({ ...lesson, readingTimeMinutes: Number(e.target.value) })}
                className="w-full p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>
        </div>

        {/* Editor vs Preview Grid */}
        <div className={`grid gap-6 ${activeTab === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          
          {/* ======================================================== */}
          {/* BLOCK BUILDER COLUMN                                     */}
          {/* ======================================================== */}
          {(activeTab === 'editor' || activeTab === 'split') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Content Blocks ({lesson.blocks.length})
                </span>
              </div>

              {/* Block List */}
              <div className="space-y-4">
                {lesson.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
                  >
                    {/* Block Toolbar Header */}
                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-neutral-400 text-[10px]">#{index + 1}</span>
                        <span className="font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                          {block.type}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveBlock(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-800 disabled:opacity-30"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveBlock(index, 'down')}
                          disabled={index === lesson.blocks.length - 1}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-800 disabled:opacity-30"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicateBlock(block)}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-800"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-1 rounded text-neutral-400 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Block-Specific Inputs */}
                    {/* 1. Paragraph */}
                    {block.type === 'paragraph' && (
                      <div>
                        <textarea
                          value={block.text || ''}
                          onChange={(e) => handleUpdateBlock(block.id, { text: e.target.value })}
                          rows={4}
                          placeholder="Type paragraph prose here. Supports inline $math$ syntax..."
                          className="w-full p-3 font-serif text-base bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>
                    )}

                    {/* 2. Heading */}
                    {block.type === 'heading' && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={block.text || ''}
                          onChange={(e) => handleUpdateBlock(block.id, { text: e.target.value })}
                          placeholder="Heading title..."
                          className="w-full p-2.5 font-sans font-bold text-base bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 outline-none"
                        />
                      </div>
                    )}

                    {/* 3. Display LaTeX Equation */}
                    {block.type === 'equation' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-neutral-500">LaTeX Expression</span>
                          <button
                            onClick={() => openEquationEditor(block.id)}
                            className="text-xs px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 rounded font-medium hover:bg-amber-200 transition flex items-center gap-1"
                          >
                            <Sigma className="w-3.5 h-3.5" /> Visual Equation Editor
                          </button>
                        </div>
                        <textarea
                          value={block.latex || ''}
                          onChange={(e) => handleUpdateBlock(block.id, { latex: e.target.value })}
                          rows={2}
                          className="w-full p-2.5 font-mono text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 outline-none"
                        />
                        {block.latex && (
                          <div className="p-3 bg-neutral-100 dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800">
                            <MathRenderer latex={block.latex} displayMode={true} />
                          </div>
                        )}
                      </div>
                    )}

                    {/* 4. Definition / Theorem / Example / Proof */}
                    {(block.type === 'definition' || block.type === 'theorem' || block.type === 'example' || block.type === 'proof' || block.type === 'remark') && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={block.title || ''}
                          onChange={(e) => handleUpdateBlock(block.id, { title: e.target.value })}
                          placeholder={`${block.type.toUpperCase()} Label (e.g. Theorem 1.1 — Cauchy-Schwarz Inequality)`}
                          className="w-full p-2 font-sans font-bold text-xs bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100 outline-none"
                        />
                        <textarea
                          value={block.text || ''}
                          onChange={(e) => handleUpdateBlock(block.id, { text: e.target.value })}
                          rows={4}
                          placeholder={`Content for ${block.type}. Supports LaTeX $$equations$$ and inline $math$...`}
                          className="w-full p-3 font-serif text-base bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 outline-none"
                        />
                      </div>
                    )}

                    {/* 5. Exercise with Solution */}
                    {block.type === 'exercise' && block.exercise && (
                      <div className="space-y-3 p-3 bg-neutral-50 dark:bg-neutral-950/80 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
                        <div>
                          <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">Problem Prompt</label>
                          <textarea
                            value={block.exercise.prompt}
                            onChange={(e) => handleUpdateBlock(block.id, {
                              exercise: { ...block.exercise!, prompt: e.target.value }
                            })}
                            rows={3}
                            placeholder="Enter the problem statement with mathematical context..."
                            className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded font-serif text-sm text-neutral-900 dark:text-neutral-100"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">Final LaTeX Solution (Equation)</label>
                          <input
                            type="text"
                            value={block.exercise.solutionLatex || ''}
                            onChange={(e) => handleUpdateBlock(block.id, {
                              exercise: { ...block.exercise!, solutionLatex: e.target.value }
                            })}
                            placeholder="e.g. \\vec{r}(t) = 4\\hat{i} - 16\\hat{j}\\,\\text{m}"
                            className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded font-mono"
                          />
                        </div>

                        <div>
                          <label className="block font-medium text-neutral-600 dark:text-neutral-400 mb-1">Step-by-Step Worked Explanation</label>
                          <textarea
                            value={block.exercise.solutionExplanation}
                            onChange={(e) => handleUpdateBlock(block.id, {
                              exercise: { ...block.exercise!, solutionExplanation: e.target.value }
                            })}
                            rows={4}
                            placeholder="Explain each step clearly with intermediate formulas..."
                            className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded font-serif text-sm text-neutral-900 dark:text-neutral-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Block Insertion Palette */}
              <div className="bg-white dark:bg-neutral-900 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">
                  + Add Educational Content Block
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                  <button
                    onClick={() => handleAddBlock('paragraph')}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg font-medium transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> Paragraph
                  </button>
                  <button
                    onClick={() => handleAddBlock('heading')}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg font-medium transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Heading
                  </button>
                  <button
                    onClick={() => handleAddBlock('equation')}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg font-medium transition flex items-center gap-1.5"
                  >
                    <Sigma className="w-3.5 h-3.5 text-amber-600" /> Equation (LaTeX)
                  </button>
                  <button
                    onClick={() => handleAddBlock('definition')}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg font-medium transition flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-700" /> Definition
                  </button>
                  <button
                    onClick={() => handleAddBlock('theorem')}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg font-medium transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Theorem
                  </button>
                  <button
                    onClick={() => handleAddBlock('proof')}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg font-medium transition flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Proof
                  </button>
                  <button
                    onClick={() => handleAddBlock('example')}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg font-medium transition flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Example
                  </button>
                  <button
                    onClick={() => handleAddBlock('exercise')}
                    className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-950 rounded-lg font-medium transition flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-purple-600" /> Exercise & Solution
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* LIVE PREVIEW COLUMN                                      */}
          {/* ======================================================== */}
          {(activeTab === 'preview' || activeTab === 'split') && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-10 shadow-sm overflow-y-auto max-h-[85vh]">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400">
                  Live Textbook Preview
                </span>
                <h1 className="text-3xl font-bold font-serif text-neutral-950 dark:text-neutral-50 mt-1">
                  § {lesson.number} {lesson.title}
                </h1>
                <p className="text-sm italic text-neutral-600 dark:text-neutral-400 font-serif mt-1">
                  {lesson.description}
                </p>
              </div>

              {/* Render Blocks */}
              <div className="space-y-6 font-academic text-lg">
                {lesson.blocks.map((b) => (
                  <div key={b.id}>
                    {b.type === 'paragraph' && <FormattedText content={b.text} />}
                    {b.type === 'heading' && (
                      <h2 className="text-xl font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-6 mb-2">
                        {b.text}
                      </h2>
                    )}
                    {b.type === 'equation' && b.latex && (
                      <div className="my-4 p-4 bg-neutral-50 dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800">
                        <MathRenderer latex={b.latex} displayMode={true} />
                      </div>
                    )}
                    {b.type === 'definition' && (
                      <div className="p-4 my-4 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-800 rounded-r">
                        <div className="font-bold text-xs uppercase font-sans text-amber-900 dark:text-amber-300 mb-1">{b.title}</div>
                        <FormattedText content={b.text} />
                      </div>
                    )}
                    {b.type === 'theorem' && (
                      <div className="p-4 my-4 bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-900 rounded-r">
                        <div className="font-bold text-xs uppercase font-sans text-blue-900 dark:text-blue-300 mb-1">{b.title}</div>
                        <FormattedText content={b.text} />
                      </div>
                    )}
                    {b.type === 'proof' && (
                      <div className="p-4 my-4 border-l-2 border-neutral-400 italic text-neutral-800 dark:text-neutral-200">
                        <div className="not-italic font-bold font-sans text-xs text-neutral-500 mb-1">{b.title}</div>
                        <FormattedText content={b.text} />
                      </div>
                    )}
                    {b.type === 'exercise' && b.exercise && (
                      <div className="p-5 my-5 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-950">
                        <div className="font-bold font-sans text-xs text-amber-800 dark:text-amber-400 uppercase mb-2">
                          Exercise Prompt
                        </div>
                        <FormattedText content={b.exercise.prompt} />
                        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs">
                          <span className="font-bold font-sans uppercase text-neutral-500">Worked Solution:</span>
                          {b.exercise.solutionLatex && <MathRenderer latex={b.exercise.solutionLatex} displayMode={true} />}
                          <FormattedText content={b.exercise.solutionExplanation} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* LaTeX Equation Editor Modal */}
      {isEquationModalOpen && (
        <EquationEditorModal
          isOpen={isEquationModalOpen}
          initialLatex={activeEquationBlock?.latex || '\\vec{F} = m\\vec{a}'}
          onClose={() => setIsEquationModalOpen(false)}
          onSave={(newLatex) => {
            if (editingEquationBlockId) {
              handleUpdateBlock(editingEquationBlockId, { latex: newLatex });
            }
          }}
        />
      )}
    </div>
  );
};
