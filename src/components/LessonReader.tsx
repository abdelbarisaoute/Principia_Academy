import React, { useState, useEffect, useRef } from 'react';
import { Course, Chapter, Lesson, ContentBlock, User } from '../types';
import { storage } from '../lib/storage';
import { MathRenderer, FormattedText } from './MathRenderer';
import { DiagramRenderer } from './DiagramRenderer';
import { SuggestionModal } from './SuggestionModal';
import { PdfExportModal } from './PdfExportModal';
import { 
  Bookmark, CheckCircle2, BookOpen, ChevronLeft, ChevronRight, 
  MessageSquarePlus, Printer, StickyNote, Plus, Trash2, List, 
  Eye, Check, ChevronDown, ChevronUp, Share2, Sparkles, HelpCircle,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Type
} from 'lucide-react';

interface LessonReaderProps {
  currentUser: User | null;
  course: Course;
  chapter: Chapter;
  lesson: Lesson;
  allChapters: Chapter[];
  allLessons: Lesson[];
  onNavigateLesson: (chapterSlug: string, lessonSlug: string) => void;
  onNavigateCourse: () => void;
  onEditLesson?: (lessonId: string) => void;
}

export const LessonReader: React.FC<LessonReaderProps> = ({
  currentUser,
  course,
  chapter,
  lesson,
  allChapters,
  allLessons,
  onNavigateLesson,
  onNavigateCourse,
  onEditLesson
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [isMobileTocOpen, setIsMobileTocOpen] = useState<boolean>(false);
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [selectedSectionForSuggestion, setSelectedSectionForSuggestion] = useState<string>('');
  
  // Reader state
  const [progress, setProgress] = useState(storage.getUserProgress());
  const [newNoteText, setNewNoteText] = useState('');
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [expandedProofs, setExpandedProofs] = useState<Record<string, boolean>>({});
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, 'correct' | 'incorrect'>>({});
  const [fontSizeClass, setFontSizeClass] = useState<'text-base' | 'text-lg' | 'text-xl'>('text-lg');

  const contentRef = useRef<HTMLDivElement>(null);

  const isCompleted = progress.completedLessons.includes(lesson.id);
  const isBookmarked = progress.bookmarks.includes(lesson.id);
  const isFavoriteCourse = progress.favorites.includes(course.id);
  const lessonNotes = progress.notes.filter(n => n.lessonId === lesson.id);

  // Track last visited
  useEffect(() => {
    storage.setLastVisited({
      courseId: course.id,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      courseTitle: course.title,
      subjectSlug: course.subjectSlug,
      courseSlug: course.slug,
      chapterSlug: chapter.slug,
      lessonSlug: lesson.slug,
      timestamp: new Date().toISOString()
    });
  }, [lesson.id]);

  // Headings detection for left-hand Table of Contents
  const headings = lesson.blocks
    .filter(b => b.type === 'heading' || (b.type === 'exercise' && b.exercise))
    .map(b => ({
      id: b.id,
      title: b.type === 'heading' ? (b.text || 'Section') : `Exercise ${b.exercise?.number || ''}`,
      level: b.level || 2
    }));

  // Scroll observer to update active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [lesson.id, headings]);

  // Find previous and next lessons
  const currentChapterLessons = allLessons.filter(l => l.chapterId === chapter.id);
  const currentLessonIndex = currentChapterLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentLessonIndex > 0 ? currentChapterLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < currentChapterLessons.length - 1 ? currentChapterLessons[currentLessonIndex + 1] : null;

  const handleToggleComplete = () => {
    storage.toggleLessonCompleted(lesson.id);
    setProgress(storage.getUserProgress());
  };

  const handleToggleBookmark = () => {
    storage.toggleBookmark(lesson.id);
    setProgress(storage.getUserProgress());
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    storage.saveNote({
      id: `note-${Date.now()}`,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      courseSlug: course.slug,
      chapterSlug: chapter.slug,
      lessonSlug: lesson.slug,
      text: newNoteText.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    setNewNoteText('');
    setProgress(storage.getUserProgress());
  };

  const handleDeleteNote = (noteId: string) => {
    storage.deleteNote(noteId);
    setProgress(storage.getUserProgress());
  };

  const handleToggleProof = (blockId: string) => {
    setExpandedProofs(prev => ({ ...prev, [blockId]: !prev[blockId] }));
  };

  const handleToggleSolution = (exerciseId: string) => {
    setRevealedSolutions(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  };

  const handleSelectOption = (exerciseId: string, optIdx: number, correctIdx?: number) => {
    setSelectedOptions(prev => ({ ...prev, [exerciseId]: optIdx }));
    if (correctIdx !== undefined) {
      if (optIdx === correctIdx) {
        setExerciseFeedback(prev => ({ ...prev, [exerciseId]: 'correct' }));
        storage.toggleExerciseCompleted(exerciseId);
        setProgress(storage.getUserProgress());
      } else {
        setExerciseFeedback(prev => ({ ...prev, [exerciseId]: 'incorrect' }));
      }
    }
  };

  const scrollToBlock = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(id);
      setIsMobileTocOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Top Academic Breadcrumb & Utility Navigation */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 truncate">
            <button 
              onClick={onNavigateCourse}
              className="hover:text-amber-800 dark:hover:text-amber-400 transition font-medium"
            >
              {course.subjectSlug === 'mathematics' ? 'Mathematics' : 'Physics'}
            </button>
            <span>/</span>
            <button 
              onClick={onNavigateCourse}
              className="hover:text-amber-800 dark:hover:text-amber-400 transition font-medium truncate max-w-[150px] sm:max-w-[200px]"
            >
              {course.title}
            </button>
            <span>/</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
              § {lesson.number} {lesson.title}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile TOC button */}
            <button
              onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
              className="lg:hidden p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center gap-1 border border-neutral-200 dark:border-neutral-700"
            >
              <List className="w-4 h-4" />
              <span>Contents</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={handleToggleBookmark}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Lesson'}
              className={`p-1.5 rounded-md transition ${
                isBookmarked 
                  ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/60' 
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Mark as Completed */}
            <button
              onClick={handleToggleComplete}
              className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isCompleted ? 'Completed' : 'Mark Completed'}</span>
            </button>

            {/* Author Edit Button (if author or admin) */}
            {(currentUser?.role === 'admin' || currentUser?.role === 'contributor') && onEditLesson && (
              <button
                onClick={() => onEditLesson(lesson.id)}
                className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded-md font-medium text-xs transition"
              >
                Edit Lesson
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main 3-Column Academic Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ======================================================== */}
          {/* LEFT COLUMN: STICKY TABLE OF CONTENTS                    */}
          {/* ======================================================== */}
          <aside className={`
            lg:col-span-3 lg:sticky lg:top-16 max-h-[calc(100vh-5rem)] overflow-y-auto 
            ${isMobileTocOpen ? 'block fixed inset-x-4 top-14 z-40 bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800' : 'hidden lg:block'}
          `}>
            <div className="pr-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Lesson Outline
                </span>
                {isMobileTocOpen && (
                  <button onClick={() => setIsMobileTocOpen(false)} className="text-neutral-400 hover:text-neutral-700">
                    ✕
                  </button>
                )}
              </div>

              {/* Lesson headings */}
              <nav className="space-y-1 text-sm font-sans">
                {headings.length === 0 ? (
                  <p className="text-xs text-neutral-400 italic">No sub-sections detected.</p>
                ) : (
                  headings.map((h) => (
                    <button
                      key={h.id}
                      onClick={() => scrollToBlock(h.id)}
                      className={`w-full text-left py-1.5 px-2.5 rounded-md text-xs transition flex items-center justify-between ${
                        activeSectionId === h.id
                          ? 'bg-amber-100/70 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 font-semibold border-l-2 border-amber-800'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                      }`}
                    >
                      <span className="truncate">{h.title}</span>
                    </button>
                  ))
                )}
              </nav>

              {/* Chapter Lessons Navigation */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  Chapter {chapter.number} Lessons
                </span>
                <div className="space-y-1 text-xs">
                  {currentChapterLessons.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => onNavigateLesson(chapter.slug, l.slug)}
                      className={`w-full text-left px-2 py-1 rounded transition flex items-center gap-2 ${
                        l.id === lesson.id
                          ? 'bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-900 dark:text-neutral-100'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-neutral-400">{l.number}</span>
                      <span className="truncate">{l.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* CENTER COLUMN: LESSON TEXTBOOK CONTENT                   */}
          {/* ======================================================== */}
          <main ref={contentRef} className="lg:col-span-6 min-w-0">
            {/* Lesson Title & Metadata */}
            <header className="mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
                Chapter {chapter.number} • Lesson {lesson.number}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 font-serif leading-tight">
                {lesson.title}
              </h1>
              <p className="text-base italic text-neutral-600 dark:text-neutral-400 mt-2 font-serif">
                {lesson.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                <div>By <span className="font-medium text-neutral-700 dark:text-neutral-300">{lesson.author}</span></div>
                <div>•</div>
                <div>{lesson.readingTimeMinutes} min read</div>
                <div>•</div>
                <div>Updated {lesson.updatedAt}</div>
              </div>
            </header>

            {/* Content Blocks Engine */}
            <div className={`space-y-6 font-academic ${fontSizeClass}`}>
              {lesson.blocks.map((block) => (
                <div key={block.id} id={block.id} className="relative group">
                  
                  {/* 1. Paragraph */}
                  {block.type === 'paragraph' && (
                    <FormattedText content={block.text} />
                  )}

                  {/* 2. Heading */}
                  {block.type === 'heading' && (
                    <h2 className="text-2xl font-bold font-sans text-neutral-900 dark:text-neutral-100 mt-8 mb-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      {block.text}
                    </h2>
                  )}

                  {/* 3. Display Equation */}
                  {block.type === 'equation' && block.latex && (
                    <div className="my-6 p-4 bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-2xs">
                      <MathRenderer latex={block.latex} displayMode={true} />
                    </div>
                  )}

                  {/* 4. Academic Definition Block */}
                  {block.type === 'definition' && (
                    <div className="my-6 p-5 bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-800 dark:border-amber-500 rounded-r-lg shadow-2xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 font-sans mb-1.5 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {block.title || 'Definition'}
                      </div>
                      <FormattedText content={block.text} />
                    </div>
                  )}

                  {/* 5. Academic Theorem Block */}
                  {block.type === 'theorem' && (
                    <div className="my-6 p-5 bg-blue-50/50 dark:bg-blue-950/20 border-l-4 border-blue-900 dark:border-blue-500 rounded-r-lg shadow-2xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 font-sans mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {block.title || 'Theorem'}
                      </div>
                      <FormattedText content={block.text} />
                    </div>
                  )}

                  {/* 6. Proof Block (with collapsible toggle) */}
                  {block.type === 'proof' && (
                    <div className="my-6 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/40 dark:bg-neutral-900/30 overflow-hidden">
                      <button
                        onClick={() => handleToggleProof(block.id)}
                        className="w-full flex items-center justify-between p-3.5 bg-neutral-100/60 dark:bg-neutral-850 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 text-left transition font-sans text-xs font-semibold text-neutral-700 dark:text-neutral-300"
                      >
                        <span className="italic">{block.title || 'Proof (Click to reveal/collapse)'}</span>
                        {expandedProofs[block.id] !== false ? (
                          <ChevronUp className="w-4 h-4 text-neutral-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-neutral-500" />
                        )}
                      </button>
                      {expandedProofs[block.id] !== false && (
                        <div className="p-5 border-t border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
                          <FormattedText content={block.text} />
                        </div>
                      )}
                    </div>
                  )}

                  {/* 7. Example Block */}
                  {block.type === 'example' && (
                    <div className="my-6 p-5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 font-sans mb-2">
                        {block.title || 'Example'}
                      </div>
                      <FormattedText content={block.text} />
                    </div>
                  )}

                  {/* 8. Remark Block */}
                  {block.type === 'remark' && (
                    <div className="my-5 p-4 bg-stone-50 dark:bg-stone-950/30 border-l-3 border-stone-500 text-sm italic text-neutral-700 dark:text-neutral-300 rounded-r">
                      <div className="not-italic font-bold font-sans text-xs text-neutral-600 dark:text-neutral-400 mb-1">{block.title || 'Remark'}</div>
                      <FormattedText content={block.text} />
                    </div>
                  )}

                  {/* 9. Interactive Diagram */}
                  {block.type === 'diagram' && block.diagram && (
                    <DiagramRenderer data={block.diagram} />
                  )}

                  {/* 10. Exercise with Collapsible Solution */}
                  {block.type === 'exercise' && block.exercise && (
                    <div className="my-8 border-2 border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-xs">
                      <div className="p-5 sm:p-6 bg-neutral-50/50 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 font-sans">
                            Exercise {block.exercise.number ? `§ ${block.exercise.number}` : ''}
                          </span>
                          {exerciseFeedback[block.exercise.id] === 'correct' && (
                            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                              <Check className="w-3.5 h-3.5" /> Solved
                            </span>
                          )}
                        </div>

                        {/* Exercise Prompt */}
                        <div className="text-base text-neutral-900 dark:text-neutral-100 font-serif">
                          <FormattedText content={block.exercise.prompt} />
                        </div>

                        {/* Multiple Choice Interactive Options (if applicable) */}
                        {block.exercise.type === 'multiple_choice' && block.exercise.options && (
                          <div className="mt-4 space-y-2 font-sans text-sm">
                            {block.exercise.options.map((opt, optIdx) => {
                              const isSelected = selectedOptions[block.exercise!.id] === optIdx;
                              const isCorrect = block.exercise!.correctOptionIndex === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectOption(block.exercise!.id, optIdx, block.exercise!.correctOptionIndex)}
                                  className={`w-full text-left p-3 rounded-lg border transition flex items-start gap-3 ${
                                    isSelected
                                      ? isCorrect
                                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200'
                                        : 'bg-red-50 dark:bg-red-950/60 border-red-500 text-red-950 dark:text-red-200'
                                      : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                                  }`}
                                >
                                  <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Hints & Collapsible Solution Section */}
                      <div className="p-4 bg-neutral-50/30 dark:bg-neutral-950/30 font-sans text-xs">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleToggleSolution(block.exercise!.id)}
                            className="px-3.5 py-1.5 bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-md font-medium transition flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{revealedSolutions[block.exercise.id] ? 'Hide Solution' : 'Show Worked Solution ▾'}</span>
                          </button>
                          
                          <span className="text-neutral-400 italic">Self-assessment</span>
                        </div>

                        {revealedSolutions[block.exercise.id] && (
                          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                            <div className="font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider text-[11px]">
                              Step-by-Step Textbook Solution
                            </div>
                            {block.exercise.solutionLatex && (
                              <div className="my-2 p-3 bg-white dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800">
                                <MathRenderer latex={block.exercise.solutionLatex} displayMode={true} />
                              </div>
                            )}
                            <div className="text-sm font-serif text-neutral-800 dark:text-neutral-200 leading-relaxed">
                              <FormattedText content={block.exercise.solutionExplanation} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Suggest improvement inline button on hover */}
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => {
                        setSelectedSectionForSuggestion(block.title || block.text?.substring(0, 30) || 'Section');
                        setIsSuggestionModalOpen(true);
                      }}
                      title="Suggest an improvement or fix for this section"
                      className="p-1 rounded text-neutral-400 hover:text-amber-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs flex items-center gap-1"
                    >
                      <MessageSquarePlus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Lesson Navigation (Previous & Next) */}
            <div className="mt-14 pt-8 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm">
              {prevLesson ? (
                <button
                  onClick={() => onNavigateLesson(chapter.slug, prevLesson.slug)}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-amber-600 text-left transition group"
                >
                  <div className="text-xs text-neutral-400 flex items-center gap-1 mb-1">
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous Lesson
                  </div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 truncate">
                    § {prevLesson.number} {prevLesson.title}
                  </div>
                </button>
              ) : <div />}

              {nextLesson ? (
                <button
                  onClick={() => onNavigateLesson(chapter.slug, nextLesson.slug)}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-amber-600 text-right transition group"
                >
                  <div className="text-xs text-neutral-400 flex items-center justify-end gap-1 mb-1">
                    Next Lesson <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 truncate">
                    § {nextLesson.number} {nextLesson.title}
                  </div>
                </button>
              ) : <div />}
            </div>
          </main>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: READER COMPANION & STUDY TOOLS            */}
          {/* ======================================================== */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Reading Settings Card */}
            <div className="bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl text-xs space-y-3">
              <div className="font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                <span>Reading View</span>
                <Type className="w-3.5 h-3.5" />
              </div>

              {/* Font size picker */}
              <div className="flex items-center justify-between bg-white dark:bg-neutral-950 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Typography Scale</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setFontSizeClass('text-base')}
                    className={`px-2 py-0.5 rounded font-mono ${fontSizeClass === 'text-base' ? 'bg-amber-800 text-white font-bold' : 'text-neutral-500'}`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSizeClass('text-lg')}
                    className={`px-2 py-0.5 rounded font-mono ${fontSizeClass === 'text-lg' ? 'bg-amber-800 text-white font-bold' : 'text-neutral-500'}`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSizeClass('text-xl')}
                    className={`px-2 py-0.5 rounded font-mono ${fontSizeClass === 'text-xl' ? 'bg-amber-800 text-white font-bold' : 'text-neutral-500'}`}
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* PDF Compilation Button */}
              <button
                onClick={() => setIsPdfModalOpen(true)}
                className="w-full py-2 px-3 bg-white dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-800 dark:text-neutral-200 font-medium transition flex items-center justify-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 text-neutral-500" />
                <span>Export Course to PDF</span>
              </button>
            </div>

            {/* Private Personal Notes Card */}
            <div className="bg-neutral-50/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl text-xs space-y-3">
              <div className="font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                <span>Private Study Notes</span>
                <StickyNote className="w-3.5 h-3.5" />
              </div>

              {/* Existing notes */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {lessonNotes.length === 0 ? (
                  <p className="text-neutral-400 italic">No notes saved for this lesson yet.</p>
                ) : (
                  lessonNotes.map((note) => (
                    <div key={note.id} className="p-2.5 bg-white dark:bg-neutral-950 rounded border border-neutral-200 dark:border-neutral-800 space-y-1">
                      <p className="text-neutral-800 dark:text-neutral-200 text-xs font-serif leading-relaxed">
                        {note.text}
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-neutral-400 pt-1 border-t border-neutral-100 dark:border-neutral-850">
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add new note input */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Jot down a private insight, formula mnemonic, or question..."
                  rows={2}
                  className="w-full p-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded text-xs text-neutral-900 dark:text-neutral-100 outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="w-full py-1.5 bg-amber-800 hover:bg-amber-900 disabled:opacity-50 text-white rounded font-medium transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3 h-3" /> Save Note
                </button>
              </form>
            </div>

            {/* Peer Review & Suggestion Box */}
            <div className="bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 p-4 rounded-xl text-xs space-y-2">
              <div className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                <MessageSquarePlus className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                <span>Spotted an Error or Improvement?</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
                Principia is an open community library. Suggest mathematical corrections, clearer proofs, or new examples.
              </p>
              <button
                onClick={() => {
                  setSelectedSectionForSuggestion('');
                  setIsSuggestionModalOpen(true);
                }}
                className="w-full py-1.5 bg-white dark:bg-neutral-900 hover:bg-amber-100 dark:hover:bg-amber-950 border border-amber-300 dark:border-amber-800 rounded font-medium text-amber-900 dark:text-amber-200 transition"
              >
                Submit Suggestion
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Modals */}
      <SuggestionModal
        currentUser={currentUser}
        isOpen={isSuggestionModalOpen}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        courseSlug={course.slug}
        sectionTitle={selectedSectionForSuggestion}
        onClose={() => setIsSuggestionModalOpen(false)}
      />

      <PdfExportModal
        isOpen={isPdfModalOpen}
        course={course}
        chapters={allChapters.filter(ch => ch.courseId === course.id)}
        lessons={allLessons.filter(l => l.courseId === course.id)}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
};
