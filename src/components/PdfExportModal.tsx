import React, { useRef } from 'react';
import { Course, Chapter, Lesson } from '../types';
import { MathRenderer, FormattedText } from './MathRenderer';
import { X, Download, Printer, BookOpen } from 'lucide-react';

interface PdfExportModalProps {
  isOpen: boolean;
  course: Course;
  chapters: Chapter[];
  lessons: Lesson[];
  onClose: () => void;
}

export const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  course,
  chapters,
  lessons,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 no-print">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Academic Textbook PDF Compilation</h3>
              <p className="text-xs text-neutral-500">{course.title} — Full Course Edition</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-sm font-medium bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button 
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Preview / Print Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 bg-neutral-100 dark:bg-neutral-950/80">
          <div 
            ref={printRef}
            className="max-w-3xl mx-auto bg-white text-neutral-900 shadow-xl border border-neutral-200 p-8 sm:p-16 rounded-lg font-academic leading-relaxed"
          >
            {/* COVER PAGE */}
            <div className="text-center py-16 border-b-2 border-neutral-900 mb-12">
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">
                Principia Open Scientific Library — Academic Edition
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-serif text-neutral-950">
                {course.title}
              </h1>
              <p className="text-lg italic text-neutral-600 max-w-xl mx-auto mb-8 font-serif">
                {course.description}
              </p>
              
              <div className="mt-12 text-sm text-neutral-700">
                <div className="font-semibold text-neutral-900">Lead Authors:</div>
                <div className="mb-2">{course.authors.join(', ')}</div>
                {course.contributors.length > 0 && (
                  <>
                    <div className="font-semibold text-neutral-900 mt-3">Contributing Scholars:</div>
                    <div className="text-neutral-600">{course.contributors.join(', ')}</div>
                  </>
                )}
                <div className="mt-6 text-xs text-neutral-400 font-mono">
                  Typeset with KaTeX & Principia Engine • {course.updatedAt}
                </div>
              </div>
            </div>

            {/* TABLE OF CONTENTS */}
            <div className="mb-14 pb-8 border-b border-neutral-300">
              <h2 className="text-2xl font-bold uppercase tracking-wide text-neutral-900 mb-6 font-sans">
                Table of Contents
              </h2>
              <div className="space-y-4 text-sm font-sans">
                {chapters.map((ch) => {
                  const chLessons = lessons.filter(l => l.chapterId === ch.id);
                  return (
                    <div key={ch.id} className="space-y-1">
                      <div className="font-bold text-neutral-950 flex justify-between border-b border-neutral-200 pb-1">
                        <span>Chapter {ch.number} — {ch.title}</span>
                      </div>
                      <div className="pl-4 space-y-1 text-neutral-700">
                        {chLessons.map(l => (
                          <div key={l.id} className="flex justify-between text-xs py-0.5">
                            <span>§ {l.number} {l.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CHAPTERS & LESSONS */}
            <div className="space-y-16">
              {chapters.map((ch) => {
                const chLessons = lessons.filter(l => l.chapterId === ch.id);
                return (
                  <div key={ch.id} className="space-y-10">
                    <div className="border-b-2 border-neutral-800 pb-3">
                      <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                        Chapter {ch.number}
                      </div>
                      <h2 className="text-3xl font-bold text-neutral-950 font-serif">
                        {ch.title}
                      </h2>
                      <p className="text-sm italic text-neutral-600 mt-1">{ch.description}</p>
                    </div>

                    {chLessons.map((lesson) => (
                      <div key={lesson.id} className="space-y-6 pt-4">
                        <div className="border-b border-neutral-300 pb-2">
                          <h3 className="text-xl font-bold text-neutral-900 font-sans">
                            § {lesson.number} {lesson.title}
                          </h3>
                        </div>

                        {/* Content Blocks */}
                        <div className="space-y-4 text-[17px]">
                          {lesson.blocks.map((b) => {
                            if (b.type === 'paragraph') {
                              return <FormattedText key={b.id} content={b.text} />;
                            }
                            if (b.type === 'heading') {
                              return (
                                <h4 key={b.id} className="text-lg font-bold text-neutral-900 font-sans mt-6 mb-2">
                                  {b.text}
                                </h4>
                              );
                            }
                            if (b.type === 'equation' && b.latex) {
                              return (
                                <div key={b.id} className="my-4 p-2 bg-neutral-50 border border-neutral-200 rounded">
                                  <MathRenderer latex={b.latex} displayMode={true} />
                                </div>
                              );
                            }
                            if (b.type === 'definition') {
                              return (
                                <div key={b.id} className="p-4 my-4 bg-amber-50/60 border-l-4 border-amber-800 rounded-r">
                                  <div className="font-bold text-neutral-900 font-sans text-sm mb-1">{b.title}</div>
                                  <FormattedText content={b.text} />
                                </div>
                              );
                            }
                            if (b.type === 'theorem') {
                              return (
                                <div key={b.id} className="p-4 my-4 bg-blue-50/60 border-l-4 border-blue-900 rounded-r">
                                  <div className="font-bold text-neutral-900 font-sans text-sm mb-1">{b.title}</div>
                                  <FormattedText content={b.text} />
                                </div>
                              );
                            }
                            if (b.type === 'proof') {
                              return (
                                <div key={b.id} className="pl-4 my-4 border-l-2 border-neutral-400 italic text-neutral-800">
                                  <div className="font-bold font-sans not-italic text-xs text-neutral-500 mb-1">{b.title || 'Proof'}</div>
                                  <FormattedText content={b.text} />
                                </div>
                              );
                            }
                            if (b.type === 'example') {
                              return (
                                <div key={b.id} className="p-4 my-4 bg-neutral-50 border border-neutral-300 rounded">
                                  <div className="font-bold text-neutral-900 font-sans text-sm mb-1">{b.title}</div>
                                  <FormattedText content={b.text} />
                                </div>
                              );
                            }
                            if (b.type === 'exercise' && b.exercise) {
                              return (
                                <div key={b.id} className="p-5 my-5 border-2 border-neutral-300 rounded bg-stone-50">
                                  <div className="font-bold font-sans text-sm text-neutral-900 mb-2">
                                    Exercise {b.exercise.number ? `#${b.exercise.number}` : ''}
                                  </div>
                                  <FormattedText content={b.exercise.prompt} />
                                  <div className="mt-4 pt-3 border-t border-neutral-300">
                                    <div className="font-bold font-sans text-xs uppercase tracking-wider text-neutral-600 mb-1">
                                      Worked Textbook Solution:
                                    </div>
                                    {b.exercise.solutionLatex && (
                                      <MathRenderer latex={b.exercise.solutionLatex} displayMode={true} />
                                    )}
                                    <FormattedText content={b.exercise.solutionExplanation} />
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* APPENDIX / COLOPHON */}
            <div className="mt-20 pt-8 border-t border-neutral-400 text-center text-xs font-mono text-neutral-500">
              End of Textbook • Published under Open Academic Scientific License • Principia Library
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
