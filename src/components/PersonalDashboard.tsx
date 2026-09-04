import React, { useState } from 'react';
import { Course, Chapter, Lesson, UserProgress, User } from '../types';
import { storage } from '../lib/storage';
import { 
  BookOpen, Bookmark, CheckCircle2, StickyNote, Clock, 
  ArrowRight, Trash2, Award, Compass, Sigma, User as UserIcon
} from 'lucide-react';

interface PersonalDashboardProps {
  currentUser: User;
  onNavigateLesson: (subjectSlug: string, courseSlug: string, chapterSlug: string, lessonSlug: string) => void;
  onNavigateCourse: (subjectSlug: string, courseSlug: string) => void;
}

export const PersonalDashboard: React.FC<PersonalDashboardProps> = ({
  currentUser,
  onNavigateLesson,
  onNavigateCourse
}) => {
  const [progress, setProgress] = useState<UserProgress>(storage.getUserProgress());
  const courses = storage.getCourses();
  const chapters = storage.getChapters();
  const lessons = storage.getLessons();

  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'bookmarks'>('overview');

  const handleDeleteNote = (noteId: string) => {
    storage.deleteNote(noteId);
    setProgress(storage.getUserProgress());
  };

  const handleToggleBookmark = (lessonId: string) => {
    storage.toggleBookmark(lessonId);
    setProgress(storage.getUserProgress());
  };

  // Calculate course completion stats
  const calculateCourseProgress = (courseId: string) => {
    const courseLessons = lessons.filter(l => l.courseId === courseId);
    if (courseLessons.length === 0) return 0;
    const completedCount = courseLessons.filter(l => progress.completedLessons.includes(l.id)).length;
    return Math.round((completedCount / courseLessons.length) * 100);
  };

  const lastVisited = progress.lastVisited;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Profile Header Banner */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-800/30 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif text-neutral-950 dark:text-neutral-50">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {currentUser.institution || 'Academic Reader'} • {currentUser.email}
              </p>
              {currentUser.bio && (
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-xl line-clamp-1 italic">
                  "{currentUser.bio}"
                </p>
              )}
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition ${activeTab === 'overview' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              My Learning
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${activeTab === 'notes' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span>Notes ({progress.notes.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${activeTab === 'bookmarks' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'}`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarks ({progress.bookmarks.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* ======================================================== */}
        {/* OVERVIEW TAB                                             */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Continue Studying Hero Card */}
            {lastVisited && (
              <div className="p-6 bg-gradient-to-r from-amber-900 via-stone-900 to-neutral-950 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Continue Studying Where You Left Off</span>
                  </div>
                  <h3 className="text-xl font-bold font-serif">
                    {lastVisited.lessonTitle}
                  </h3>
                  <p className="text-xs text-neutral-300">
                    {lastVisited.courseTitle}
                  </p>
                </div>

                <button
                  onClick={() => onNavigateLesson(lastVisited.subjectSlug, lastVisited.courseSlug, lastVisited.chapterSlug, lastVisited.lessonSlug)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <span>Resume Lesson</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
                  <span>Completed Lessons</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold font-serif mt-2 text-neutral-900 dark:text-neutral-100">
                  {progress.completedLessons.length}
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
                  <span>Solved Exercises</span>
                  <Award className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-3xl font-bold font-serif mt-2 text-neutral-900 dark:text-neutral-100">
                  {progress.completedExercises.length}
                </div>
              </div>

              <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs">
                <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
                  <span>Saved Notes</span>
                  <StickyNote className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-bold font-serif mt-2 text-neutral-900 dark:text-neutral-100">
                  {progress.notes.length}
                </div>
              </div>
            </div>

            {/* Course Progress Cards */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4 font-serif">
                Enrolled Courses & Academic Progress
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => {
                  const pct = calculateCourseProgress(course.id);
                  const courseLessons = lessons.filter(l => l.courseId === course.id);
                  const completedLessons = courseLessons.filter(l => progress.completedLessons.includes(l.id));

                  return (
                    <div
                      key={course.id}
                      className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-4 hover:border-amber-700/50 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            {course.subjectSlug}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-serif mt-1">
                            {course.title}
                          </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
                          {pct}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-800 h-full transition-all duration-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-neutral-500">
                          {completedLessons.length} of {courseLessons.length} lessons mastered
                        </span>
                        <button
                          onClick={() => onNavigateCourse(course.subjectSlug, course.slug)}
                          className="font-medium text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <span>Open Course</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* NOTES TAB                                                */}
        {/* ======================================================== */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-serif">
                Private Study Notebook
              </h2>
              <p className="text-xs text-neutral-500">All your personal annotations and textbook insights, organized by lesson.</p>
            </div>

            {progress.notes.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 italic">
                No personal notes saved yet. Use the notes tool while reading any lesson.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progress.notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                          {note.lessonTitle}
                        </span>
                        <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-serif text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                        {note.text}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                      <button
                        onClick={() => onNavigateLesson('physics', note.courseSlug, note.chapterSlug, note.lessonSlug)}
                        className="text-amber-800 dark:text-amber-400 hover:underline font-medium flex items-center gap-1"
                      >
                        <span>Jump to Lesson</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1 text-neutral-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* BOOKMARKS TAB                                            */}
        {/* ======================================================== */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-serif">
                Bookmarked Lessons & References
              </h2>
              <p className="text-xs text-neutral-500">Quick access to key theorems, derivations, and physics principles.</p>
            </div>

            {progress.bookmarks.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 italic">
                No bookmarked lessons yet.
              </div>
            ) : (
              <div className="divide-y divide-neutral-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                {progress.bookmarks.map((bId) => {
                  const l = lessons.find(les => les.id === bId);
                  if (!l) return null;
                  const ch = chapters.find(c => c.id === l.chapterId);
                  const crs = courses.find(c => c.id === l.courseId);
                  if (!ch || !crs) return null;

                  return (
                    <div key={l.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition">
                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <span>{crs.title}</span>
                          <span>•</span>
                          <span>Chapter {ch.number}</span>
                        </div>
                        <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-serif truncate">
                          § {l.number} {l.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => onNavigateLesson(crs.subjectSlug, crs.slug, ch.slug, l.slug)}
                          className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                        >
                          <span>Open Lesson</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleBookmark(l.id)}
                          className="p-2 text-neutral-400 hover:text-red-600 rounded"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
