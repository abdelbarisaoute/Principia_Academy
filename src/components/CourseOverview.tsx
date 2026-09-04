import React, { useState } from 'react';
import { Course, Chapter, Lesson } from '../types';
import { storage } from '../lib/storage';
import { PdfExportModal } from './PdfExportModal';
import { 
  BookOpen, Clock, Award, CheckCircle2, Bookmark, Heart, 
  ArrowRight, Printer, Users, Layers, ChevronRight, FileText,
  Sparkles, Check
} from 'lucide-react';

interface CourseOverviewProps {
  course: Course;
  chapters: Chapter[];
  lessons: Lesson[];
  onNavigateLesson: (chapterSlug: string, lessonSlug: string) => void;
  onNavigateBack: () => void;
}

export const CourseOverview: React.FC<CourseOverviewProps> = ({
  course,
  chapters,
  lessons,
  onNavigateLesson,
  onNavigateBack
}) => {
  const [progress, setProgress] = useState(storage.getUserProgress());
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  const courseLessons = lessons.filter(l => l.courseId === course.id);
  const completedCount = courseLessons.filter(l => progress.completedLessons.includes(l.id)).length;
  const progressPct = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;
  const isFavorite = progress.favorites.includes(course.id);

  const handleToggleFavorite = () => {
    storage.toggleFavorite(course.id);
    setProgress(storage.getUserProgress());
  };

  // Find first lesson to start/continue
  const firstUnfinishedLesson = courseLessons.find(l => !progress.completedLessons.includes(l.id)) || courseLessons[0];
  const firstChapter = chapters[0];

  const handleStartOrContinue = () => {
    if (firstUnfinishedLesson) {
      const ch = chapters.find(c => c.id === firstUnfinishedLesson.chapterId);
      if (ch) {
        onNavigateLesson(ch.slug, firstUnfinishedLesson.slug);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Course Hero Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 py-10 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-xs">
            <button 
              onClick={onNavigateBack}
              className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 font-medium"
            >
              Library Catalog
            </button>
            <span className="text-neutral-400">/</span>
            <span className="font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
              {course.subjectSlug}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left 2 columns: Title, description, meta */}
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-3xl sm:text-4xl font-bold font-serif text-neutral-950 dark:text-neutral-50 tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-base text-neutral-700 dark:text-neutral-300 font-serif leading-relaxed italic">
                {course.description}
              </p>

              {/* Authors & metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <div>
                  <span className="text-neutral-400 block mb-0.5">Primary Authors</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{course.authors.join(', ')}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">Academic Level</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{course.level}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">Est. Completion</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">~{course.estimatedHours} Hours</span>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-0.5">Last Revised</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{course.updatedAt}</span>
                </div>
              </div>

              {/* Prerequisites */}
              {course.prerequisites.length > 0 && (
                <div className="pt-2 text-xs">
                  <span className="text-neutral-400 mr-2">Prerequisites:</span>
                  <span className="text-neutral-600 dark:text-neutral-400 font-serif">
                    {course.prerequisites.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Right column: Action Box */}
            <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-sm">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-neutral-600 dark:text-neutral-400">Course Progress</span>
                  <span className="font-mono text-neutral-900 dark:text-neutral-100">{progressPct}%</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-800 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="text-[11px] text-neutral-400 text-right">
                  {completedCount} of {courseLessons.length} lessons mastered
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleStartOrContinue}
                  className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>{progressPct > 0 ? 'Continue Studying' : 'Start Reading Textbook'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`py-2 px-3 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 border ${
                      isFavorite
                        ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900'
                        : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? 'Saved' : 'Save Course'}</span>
                  </button>

                  <button
                    onClick={() => setIsPdfModalOpen(true)}
                    className="py-2 px-3 bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 border border-neutral-200 dark:border-neutral-700"
                  >
                    <Printer className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Table of Contents */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-8">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-neutral-950 dark:text-neutral-50">
              Curriculum & Table of Contents
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Structured academic units, rigorous derivations, and practice exercises.
            </p>
          </div>
          <span className="text-xs font-mono text-neutral-400">
            {chapters.length} Chapters • {courseLessons.length} Lessons
          </span>
        </div>

        <div className="space-y-6">
          {chapters.map((chapter) => {
            const chLessons = lessons.filter(l => l.chapterId === chapter.id);
            return (
              <div 
                key={chapter.id} 
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs"
              >
                {/* Chapter Header */}
                <div className="p-5 bg-neutral-50/60 dark:bg-neutral-950/40 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                      Chapter {chapter.number}
                    </div>
                    <h3 className="text-lg font-bold font-serif text-neutral-950 dark:text-neutral-50">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-serif italic">
                      {chapter.description}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-neutral-400 shrink-0">
                    {chLessons.length} lessons
                  </span>
                </div>

                {/* Lessons List */}
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {chLessons.map((l) => {
                    const isLessonComplete = progress.completedLessons.includes(l.id);
                    return (
                      <div
                        key={l.id}
                        onClick={() => onNavigateLesson(chapter.slug, l.slug)}
                        className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 cursor-pointer transition group"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                            isLessonComplete 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                          }`}>
                            {isLessonComplete ? <Check className="w-3.5 h-3.5" /> : l.number}
                          </div>

                          <div className="truncate">
                            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition truncate">
                              {l.title}
                            </h4>
                            <p className="text-xs text-neutral-500 truncate hidden sm:block">
                              {l.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-xs text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {l.readingTimeMinutes}m
                          </span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PDF Export Modal */}
      <PdfExportModal
        isOpen={isPdfModalOpen}
        course={course}
        chapters={chapters}
        lessons={courseLessons}
        onClose={() => setIsPdfModalOpen(false)}
      />
    </div>
  );
};
