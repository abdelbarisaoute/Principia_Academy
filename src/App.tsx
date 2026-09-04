import React, { useState, useEffect } from 'react';
import { 
  SubjectSlug, Course, Chapter, Lesson, User, UserRole 
} from './types';
import { storage } from './lib/storage';
import { useAuth } from './lib/AuthContext';
import { LibraryHome } from './components/LibraryHome';
import { CourseOverview } from './components/CourseOverview';
import { LessonReader } from './components/LessonReader';
import { LessonEditor } from './components/LessonEditor';
import { PersonalDashboard } from './components/PersonalDashboard';
import { AuthorDashboard } from './components/AuthorDashboard';
import { ContributePage } from './components/ContributePage';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { 
  BookOpen, Search, User as UserIcon, Shield, Sparkles, 
  Feather, Edit3, Compass, Sigma, LayoutDashboard, ChevronDown, 
  Library, BookmarkCheck, LogIn, LogOut
} from 'lucide-react';

export function App() {
  const { appUser, currentUser: authUser, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  
  // Navigation Route State
  const [currentView, setCurrentView] = useState<'home' | 'course' | 'reader' | 'editor' | 'dashboard' | 'admin' | 'contribute'>('home');
  
  // Navigation Parameter State
  const [selectedSubjectSlug, setSelectedSubjectSlug] = useState<string>('mathematics');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('calculus-rigorous-foundations');
  const [selectedChapterSlug, setSelectedChapterSlug] = useState<string>('limits-and-continuity');
  const [selectedLessonSlug, setSelectedLessonSlug] = useState<string>('the-epsilon-delta-definition-of-limits');
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Global modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // User Profile (Null if not signed in)
  const currentUser = appUser || (authUser ? {
    id: authUser.uid,
    name: authUser.displayName || 'Scholar (Offline)',
    email: authUser.email || '',
    avatar: authUser.photoURL || 'https://ui-avatars.com/api/?name=Scholar&background=random',
    role: authUser.email === 'abdelbarisaoutelhak@gmail.com' ? 'admin' as UserRole : 'reader' as UserRole,
    institution: 'Offline Mode'
  } : null);

  // Data cache
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [categories, setCategories] = useState(storage.getCategories());
  const [chapters, setChapters] = useState<Chapter[]>(storage.getChapters());
  const [lessons, setLessons] = useState<Lesson[]>(storage.getLessons());

  // Refresh data when storage updates
  const refreshData = () => {
    setCourses(storage.getCourses());
    setCategories(storage.getCategories());
    setChapters(storage.getChapters());
    setLessons(storage.getLessons());
  };

  // Keyboard shortcut for Cmd+K Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for switching views
  const handleSelectCourse = (subjectSlug: string, courseSlug: string) => {
    setSelectedSubjectSlug(subjectSlug);
    setSelectedCourseSlug(courseSlug);
    setCurrentView('course');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLesson = (subjectSlug: string, courseSlug: string, chapterSlug: string, lessonSlug: string) => {
    setSelectedSubjectSlug(subjectSlug);
    setSelectedCourseSlug(courseSlug);
    setSelectedChapterSlug(chapterSlug);
    setSelectedLessonSlug(lessonSlug);
    setCurrentView('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditLesson = (lessonId: string) => {
    setEditingLessonId(lessonId);
    setCurrentView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Protect views from unauthenticated users
  useEffect(() => {
    if (!currentUser && ['dashboard', 'admin', 'contribute', 'editor'].includes(currentView)) {
      setCurrentView('home');
    }
  }, [currentUser, currentView]);

  // Derived current course, chapter, lesson
  const currentCourse = courses.find(c => c.slug === selectedCourseSlug) || courses[0];
  const courseChapters = chapters.filter(ch => ch.courseId === currentCourse?.id);
  const currentChapter = courseChapters.find(ch => ch.slug === selectedChapterSlug) || courseChapters[0];
  const currentLesson = lessons.find(l => l.slug === selectedLessonSlug) || lessons[0];
  const activeEditingLesson = lessons.find(l => l.id === editingLessonId) || currentLesson;

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 text-neutral-500 font-serif text-lg">Initializing Principia...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans antialiased selection:bg-amber-200 dark:selection:bg-amber-900">
      
      {/* Top Global Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-800 text-white flex items-center justify-center font-serif font-bold text-lg shadow-2xs group-hover:bg-amber-900 transition">
                $\Pi$
              </div>
              <div>
                <div className="font-serif font-bold text-lg tracking-tight text-neutral-950 dark:text-neutral-50 flex items-center gap-1.5 leading-none">
                  <span>PRINCIPIA</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block mt-0.5">
                  Academic Digital Library
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-400">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-3 py-1.5 rounded-lg transition ${currentView === 'home' ? 'text-amber-800 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50' : 'hover:text-neutral-900 dark:hover:text-neutral-100'}`}
              >
                Curriculum Catalog
              </button>
              {currentUser && (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition ${currentView === 'dashboard' ? 'text-amber-800 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50' : 'hover:text-neutral-900 dark:hover:text-neutral-100'}`}
                >
                  My Study Space
                </button>
              )}
              {(currentUser?.role === 'admin' || currentUser?.role === 'contributor') && (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${currentView === 'admin' ? 'text-amber-800 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50' : 'hover:text-neutral-900 dark:hover:text-neutral-100'}`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Author Studio</span>
                </button>
              )}
              {currentUser && (
                <button
                  onClick={() => setCurrentView('contribute')}
                  className={`px-3 py-1.5 rounded-lg transition ${currentView === 'contribute' ? 'text-amber-800 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/50' : 'hover:text-neutral-900 dark:hover:text-neutral-100'}`}
                >
                  Scholar Network
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs transition border border-neutral-200 dark:border-neutral-700"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search Library</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-900 rounded text-[10px] text-neutral-500">
                ⌘K
              </kbd>
            </button>

            {/* Role & User Switcher */}
            <div className="relative">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium transition border border-neutral-200 dark:border-neutral-700"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="hidden sm:inline font-semibold text-neutral-800 dark:text-neutral-200">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                      {currentUser.role}
                    </span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg p-2 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">{currentUser.name}</div>
                        <div className="text-[11px] text-neutral-500">{currentUser.institution || 'Academic Reader'}</div>
                      </div>
                      
                      <button
                        onClick={() => {
                          signOut();
                          setIsUserMenuOpen(false);
                          setCurrentView('home');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition text-neutral-900 dark:text-neutral-100"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => signInWithGoogle()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Connect</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main View Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME CATALOG */}
        {currentView === 'home' && (
          <LibraryHome
            courses={courses}
            categories={categories}
            lessons={lessons}
            onSelectCourse={handleSelectCourse}
            onSelectLesson={handleSelectLesson}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenContribute={() => setCurrentView('contribute')}
          />
        )}

        {/* VIEW 2: COURSE OVERVIEW */}
        {currentView === 'course' && (
          <CourseOverview
            course={currentCourse}
            chapters={courseChapters}
            lessons={lessons}
            onNavigateLesson={(chSlug, lesSlug) => handleSelectLesson(currentCourse.subjectSlug, currentCourse.slug, chSlug, lesSlug)}
            onNavigateBack={() => setCurrentView('home')}
          />
        )}

        {/* VIEW 3: 3-COLUMN LESSON READER */}
        {currentView === 'reader' && (
          <LessonReader
            currentUser={currentUser}
            course={currentCourse}
            chapter={currentChapter}
            lesson={currentLesson}
            allChapters={courseChapters}
            allLessons={lessons}
            onNavigateLesson={(chSlug, lesSlug) => {
              setSelectedChapterSlug(chSlug);
              setSelectedLessonSlug(lesSlug);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateCourse={() => {
              setCurrentView('course');
            }}
            onEditLesson={(lessonId) => handleEditLesson(lessonId)}
          />
        )}

        {/* VIEW 4: BLOCK-BASED LESSON AUTHOR STUDIO */}
        {currentView === 'editor' && (
          <LessonEditor
            initialLesson={activeEditingLesson}
            onSave={(saved) => {
              refreshData();
            }}
            onCancel={() => {
              setCurrentView('admin');
            }}
          />
        )}

        {/* VIEW 5: PERSONAL STUDY SPACE */}
        {currentView === 'dashboard' && (
          <PersonalDashboard
            currentUser={currentUser}
            onNavigateLesson={handleSelectLesson}
            onNavigateCourse={handleSelectCourse}
          />
        )}

        {/* VIEW 6: AUTHOR & ADMIN EDITORIAL DESK */}
        {currentView === 'admin' && (
          <AuthorDashboard
            currentUser={currentUser}
            onEditLesson={handleEditLesson}
            onPreviewLesson={(subSlug, crsSlug, chSlug, lesSlug) => handleSelectLesson(subSlug, crsSlug, chSlug, lesSlug)}
            onRefreshData={refreshData}
          />
        )}

        {/* VIEW 7: CONTRIBUTOR APPLICATION & NETWORK */}
        {currentView === 'contribute' && (
          <ContributePage
            currentUser={currentUser}
            onGoToLibrary={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Global Search Modal (Cmd+K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(subjectSlug, courseSlug, chapterSlug, lessonSlug) => {
          if (chapterSlug && lessonSlug) {
            handleSelectLesson(subjectSlug, courseSlug, chapterSlug, lessonSlug);
          } else {
            handleSelectCourse(subjectSlug, courseSlug);
          }
        }}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-8 px-4 sm:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-neutral-900 dark:text-neutral-100">$\Pi$ PRINCIPIA</span>
            <span>• Open Digital Academic Library for Mathematics and Physics</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView('home')} className="hover:underline">Catalog</button>
            <button onClick={() => setCurrentView('contribute')} className="hover:underline">Peer Review</button>
            <button onClick={() => setCurrentView('admin')} className="hover:underline">Editorial Desk</button>
            <span className="text-neutral-400">CC-BY-NC-SA 4.0 Open Science License</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
