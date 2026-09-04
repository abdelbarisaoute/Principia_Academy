import React, { useState } from 'react';
import { Course, Category, SubjectSlug, Lesson } from '../types';
import { storage } from '../lib/storage';
import { 
  BookOpen, Search, Sparkles, Sigma, Compass, Layers, 
  ArrowRight, Clock, Award, Users, BookMarked, Feather, CheckCircle2
} from 'lucide-react';

interface LibraryHomeProps {
  courses: Course[];
  categories: Category[];
  lessons: Lesson[];
  onSelectCourse: (subjectSlug: string, courseSlug: string) => void;
  onSelectLesson: (subjectSlug: string, courseSlug: string, chapterSlug: string, lessonSlug: string) => void;
  onOpenSearch: () => void;
  onOpenContribute: () => void;
}

export const LibraryHome: React.FC<LibraryHomeProps> = ({
  courses,
  categories,
  lessons,
  onSelectCourse,
  onSelectLesson,
  onOpenSearch,
  onOpenContribute
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | SubjectSlug>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const progress = storage.getUserProgress();

  const filteredCategories = categories.filter(c => 
    selectedSubject === 'all' || c.subjectSlug === selectedSubject
  );

  const filteredCourses = courses.filter(course => {
    const matchesSubject = selectedSubject === 'all' || course.subjectSlug === selectedSubject;
    const matchesCategory = selectedCategory === 'all' || course.categorySlug === selectedCategory;
    return matchesSubject && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      
      {/* Editorial Library Banner */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-300 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
            <span>Open Access Academic Repository • Peer-Reviewed Curriculum</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="text-3xl sm:text-5xl font-bold font-serif text-neutral-950 dark:text-neutral-50 tracking-tight leading-none">
              PRINCIPIA
            </h1>
            <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 font-serif leading-relaxed">
              An open digital academic library for studying and authoring mathematics and physics textbooks, rigorous proofs, and interactive mechanics simulations with complete KaTeX typeset rendering.
            </p>
          </div>

          {/* Quick Search Bar trigger */}
          <div className="pt-2">
            <button
              onClick={onOpenSearch}
              className="w-full max-w-xl flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-400 transition shadow-2xs text-xs font-mono"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-neutral-400" />
                <span>Search theorems, LaTeX formulas, Newton's laws, proofs...</span>
              </div>
              <kbd className="hidden sm:inline-block px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-[10px] text-neutral-600 dark:text-neutral-400">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>
      </div>

      {/* Main Catalog View */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10">
        
        {/* Subject & Discipline Filter Tabs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3 overflow-x-auto text-xs">
            <button
              onClick={() => { setSelectedSubject('all'); setSelectedCategory('all'); }}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedSubject === 'all' 
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              All Disciplines
            </button>
            <button
              onClick={() => { setSelectedSubject('mathematics'); setSelectedCategory('all'); }}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-1.5 ${
                selectedSubject === 'mathematics' 
                  ? 'bg-amber-800 text-white font-semibold' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Sigma className="w-3.5 h-3.5" />
              <span>Pure & Applied Mathematics</span>
            </button>
            <button
              onClick={() => { setSelectedSubject('physics'); setSelectedCategory('all'); }}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-1.5 ${
                selectedSubject === 'physics' 
                  ? 'bg-blue-900 text-white font-semibold' 
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Theoretical Physics</span>
            </button>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition ${
                selectedCategory === 'all'
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-850'
              }`}
            >
              All Subfields
            </button>
            {filteredCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium transition whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-semibold'
                    : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-850'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const courseLessons = lessons.filter(l => l.courseId === course.id);
            const completedCount = courseLessons.filter(l => progress.completedLessons.includes(l.id)).length;
            const isCompleted = courseLessons.length > 0 && completedCount === courseLessons.length;

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.subjectSlug, course.slug)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-amber-700/50 transition cursor-pointer flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        course.subjectSlug === 'mathematics' 
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' 
                          : 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {course.subjectSlug}
                      </span>
                      <span className="text-xs text-neutral-400">• Level: {course.level}</span>
                    </div>

                    {completedCount > 0 && (
                      <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {completedCount}/{courseLessons.length} Done
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold font-serif text-neutral-950 dark:text-neutral-50 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-serif line-clamp-2 mt-1 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Topics covered */}
                  <div className="space-y-1 text-xs">
                    <span className="text-neutral-400 uppercase font-mono text-[10px] tracking-wider">Featured Academic Topics</span>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {courseLessons.slice(0, 3).map(l => (
                        <span key={l.id} className="text-[11px] px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded">
                          § {l.number} {l.title}
                        </span>
                      ))}
                      {courseLessons.length > 3 && (
                        <span className="text-[11px] px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 rounded">
                          +{courseLessons.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer / Action */}
                <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <div className="text-neutral-400">
                    Authors: <span className="text-neutral-700 dark:text-neutral-300 font-medium">{course.authors.join(', ')}</span>
                  </div>

                  <div className="font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition">
                    <span>Explore Textbook</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Physics & Math Highlights */}
        <div className="p-8 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
              Interactive Academic Labs
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-neutral-950 dark:text-neutral-50">
              Interactive Dynamic Simulations & Analytical Proofs
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-xl">
              Explore dynamic vector calculations, friction parameters, and analytical theorem steps directly within the digital textbook.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div 
              onClick={() => onSelectLesson('physics', 'classical-mechanics-foundations', 'dynamics-and-newtonian-laws', 'newtons-laws-and-force-vectors')}
              className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-amber-700 cursor-pointer transition space-y-2 shadow-2xs"
            >
              <div className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase font-mono">
                Interactive Lab § 2.1
              </div>
              <h4 className="text-sm font-bold font-serif text-neutral-900 dark:text-neutral-100">
                Newtonian Force Vectors on Inclined Plane
              </h4>
              <p className="text-xs text-neutral-500 font-serif">
                Adjust incline angle, friction coefficient, and mass to compute normal force and net acceleration vectors in real time.
              </p>
            </div>

            <div 
              onClick={() => onSelectLesson('mathematics', 'calculus-rigorous-foundations', 'limits-and-continuity', 'the-epsilon-delta-definition-of-limits')}
              className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-amber-700 cursor-pointer transition space-y-2 shadow-2xs"
            >
              <div className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase font-mono">
                Formal Rigor § 1.1
              </div>
              <h4 className="text-sm font-bold font-serif text-neutral-900 dark:text-neutral-100">
                Cauchy-Weierstrass ($\epsilon$-$\delta$) Limit Proofs
              </h4>
              <p className="text-xs text-neutral-500 font-serif">
                Explore formal quantifier structures $\forall \varepsilon &gt; 0, \exists \delta &gt; 0$ with interactive tolerance intervals.
              </p>
            </div>
          </div>
        </div>

        {/* Contributing Scholars Callout Banner */}
        <div className="p-8 bg-gradient-to-r from-amber-900 via-stone-900 to-neutral-950 text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-300">
              <Feather className="w-4 h-4" />
              <span>Join the Academic Editorial Network</span>
            </div>
            <h3 className="text-2xl font-bold font-serif">
              Author Open Textbooks for the Global Community
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed font-serif">
              Are you a professor, researcher, or graduate student in mathematics or physics? Contribute lessons, review peer suggestions, and author open science textbooks.
            </p>
          </div>

          <button
            onClick={onOpenContribute}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition flex items-center gap-2 shrink-0 shadow-sm"
          >
            <span>Apply as Contributing Scholar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
