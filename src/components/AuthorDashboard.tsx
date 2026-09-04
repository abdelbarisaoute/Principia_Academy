import React, { useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import config from '../../firebase-applet-config.json';
import { Course, Chapter, Lesson, Suggestion, ContributorApplication, Category, User } from '../types';
import { storage } from '../lib/storage';
import { 
  BookOpen, Plus, Edit3, Trash2, Eye, FileText, CheckCircle2, 
  XCircle, MessageSquare, Users, BarChart3, Download, Upload, 
  RotateCcw, Sparkles, FolderPlus, Layers, Check
} from 'lucide-react';

interface AuthorDashboardProps {
  currentUser: User;
  onEditLesson: (lessonId: string) => void;
  onPreviewLesson: (subjectSlug: string, courseSlug: string, chapterSlug: string, lessonSlug: string) => void;
  onRefreshData: () => void;
}

export const AuthorDashboard: React.FC<AuthorDashboardProps> = ({
  currentUser,
  onEditLesson,
  onPreviewLesson,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'suggestions' | 'contributors' | 'analytics' | 'settings'>('content');
  
  // Data state
  const [courses, setCourses] = useState<Course[]>(storage.getCourses());
  const [chapters, setChapters] = useState<Chapter[]>(storage.getChapters());
  const [lessons, setLessons] = useState<Lesson[]>(storage.getLessons());
  const [suggestions, setSuggestions] = useState<Suggestion[]>(storage.getSuggestions());
  const [applications, setApplications] = useState<ContributorApplication[]>(storage.getContributorApplications());

  // Modal / Form state for new Course / Chapter / Lesson
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseSubject, setNewCourseSubject] = useState<'mathematics' | 'physics'>('mathematics');
  const [newCourseDesc, setNewCourseDesc] = useState('');

  const [selectedCourseForNewChapter, setSelectedCourseForNewChapter] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const [selectedChapterForNewLesson, setSelectedChapterForNewLesson] = useState<string | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonNumber, setNewLessonNumber] = useState('1.1');

  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Admin promotion state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error' | 'loading', message: string } | null>(null);

  const handlePromoteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    setInviteStatus({ type: 'loading', message: 'Searching for user...' });
    try {
      const q = query(collection(db, 'users'), where('email', '==', inviteEmail.trim()));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setInviteStatus({ type: 'error', message: 'No user found with this email. They must sign in first.' });
        return;
      }
      
      const userDoc = snap.docs[0];
      await updateDoc(doc(db, 'users', userDoc.id), { role: 'contributor' });
      
      setInviteStatus({ type: 'success', message: `${userDoc.data().name || inviteEmail} is now a Contributor!` });
      setInviteEmail('');
    } catch (err: any) {
      setInviteStatus({ type: 'error', message: 'Failed to promote user. Are you sure you have admin rights?' });
    }
  };

  // Suggestions handlers
  const handleSuggestionAction = (id: string, status: 'accepted' | 'rejected') => {
    storage.updateSuggestionStatus(id, status, 'Thank you for your academic contribution.');
    setSuggestions(storage.getSuggestions());
  };

  // Contributor application handlers
  const handleApplicationAction = (id: string, status: 'approved' | 'declined') => {
    storage.updateApplicationStatus(id, status);
    setApplications(storage.getContributorApplications());
  };

  // Create course
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const slug = newCourseTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      subjectSlug: newCourseSubject,
      categorySlug: newCourseSubject === 'mathematics' ? 'calculus' : 'mechanics',
      title: newCourseTitle.trim(),
      slug: slug || `course-${Date.now()}`,
      description: newCourseDesc.trim() || 'A comprehensive open academic course.',
      level: 'Introductory',
      authors: [currentUser.name],
      contributors: [],
      estimatedHours: 35,
      prerequisites: ['Basic High School Algebra'],
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      coverGradient: newCourseSubject === 'mathematics' ? 'from-amber-800 via-amber-900 to-stone-900' : 'from-blue-900 via-slate-900 to-stone-900',
      iconName: newCourseSubject === 'mathematics' ? 'Sigma' : 'Compass',
      chaptersCount: 0,
      lessonsCount: 0
    };

    storage.saveCourse(newCourse);
    setCourses(storage.getCourses());
    setIsCreatingCourse(false);
    setNewCourseTitle('');
    setNewCourseDesc('');
    onRefreshData();
  };

  // Create chapter
  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim() || !selectedCourseForNewChapter) return;

    const courseChapters = chapters.filter(c => c.courseId === selectedCourseForNewChapter);
    const chapterNumber = courseChapters.length + 1;
    const slug = newChapterTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newChap: Chapter = {
      id: `ch-${Date.now()}`,
      courseId: selectedCourseForNewChapter,
      number: chapterNumber,
      title: newChapterTitle.trim(),
      slug: slug || `chapter-${chapterNumber}`,
      description: 'Chapter overview and conceptual outline.',
      lessons: []
    };

    storage.saveChapter(newChap);
    setChapters(storage.getChapters());
    setSelectedCourseForNewChapter(null);
    setNewChapterTitle('');
    onRefreshData();
  };

  // Create lesson
  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle.trim() || !selectedChapterForNewLesson) return;

    const chap = chapters.find(c => c.id === selectedChapterForNewLesson);
    if (!chap) return;

    const slug = newLessonTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newLes: Lesson = {
      id: `lesson-${Date.now()}`,
      chapterId: chap.id,
      courseId: chap.courseId,
      number: newLessonNumber.trim() || `${chap.number}.1`,
      title: newLessonTitle.trim(),
      slug: slug || `lesson-${Date.now()}`,
      description: 'Educational lesson covering theoretical principles and worked examples.',
      readingTimeMinutes: 15,
      author: currentUser.name,
      status: 'draft',
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [chap.title],
      blocks: [
        {
          id: `b-${Date.now()}-1`,
          type: 'paragraph',
          text: 'Start authoring lesson introduction here. Supports mathematical LaTeX expressions like $E = mc^2$ and inline formatting.'
        },
        {
          id: `b-${Date.now()}-2`,
          type: 'heading',
          level: 2,
          text: '1. Theoretical Framework'
        },
        {
          id: `b-${Date.now()}-3`,
          type: 'equation',
          latex: '\\vec{F} = m\\vec{a}'
        }
      ]
    };

    storage.saveLesson(newLes);
    setLessons(storage.getLessons());
    setSelectedChapterForNewLesson(null);
    setNewLessonTitle('');
    onRefreshData();
    onEditLesson(newLes.id);
  };

  const handleDeleteCourse = (id: string) => {
    if (confirm('Are you sure you want to delete this course and its chapters?')) {
      storage.deleteCourse(id);
      setCourses(storage.getCourses());
      onRefreshData();
    }
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      storage.deleteLesson(id);
      setLessons(storage.getLessons());
      onRefreshData();
    }
  };

  // Export JSON
  const handleExportJson = () => {
    const json = storage.exportLibraryJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `principia-library-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBackupToDrive = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        alert("Please connect with Google first from the top right user menu.");
        return;
      }
      
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: config.oAuthClientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            console.error("Token error:", tokenResponse.error);
            alert("Failed to get Google Drive permissions.");
            return;
          }
          
          alert("Starting backup to Google Drive... please wait.");
          const json = JSON.parse(storage.exportLibraryJson());
          
          try {
            const res = await fetch('/api/drive/backup', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                data: json,
                accessToken: tokenResponse.access_token
              })
            });
            
            const result = await res.json();
            if (result.success) {
              alert("Successfully backed up to Google Drive! File ID: " + result.fileId);
            } else {
              alert("Failed to backup to Google Drive: " + result.error);
            }
          } catch(err) {
            console.error(err);
            alert("Failed to backup to Google Drive.");
          }
        },
      });
      
      client.requestAccessToken();
      
    } catch(e) {
      console.error(e);
      alert("Backup failed.");
    }
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = storage.importLibraryJson(content);
      if (ok) {
        setImportStatus('Library successfully restored from backup JSON.');
        setCourses(storage.getCourses());
        setChapters(storage.getChapters());
        setLessons(storage.getLessons());
        onRefreshData();
      } else {
        setImportStatus('Error: Invalid JSON backup schema.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (confirm('Reset entire library database back to original sample curriculum?')) {
      storage.resetToDefaults();
      setCourses(storage.getCourses());
      setChapters(storage.getChapters());
      setLessons(storage.getLessons());
      setSuggestions(storage.getSuggestions());
      setApplications(storage.getContributorApplications());
      onRefreshData();
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Top Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
              Editorial Administration
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 dark:text-neutral-50 font-serif">
              Author & Academic Management
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Signed in as <span className="font-semibold text-neutral-800 dark:text-neutral-200">{currentUser.name}</span> ({currentUser.role.toUpperCase()}) • {currentUser.institution}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'content' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum & Lessons</span>
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                activeTab === 'suggestions' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Peer Review ({suggestions.filter(s => s.status === 'pending').length})</span>
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('contributors')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'contributors' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Scholars ({applications.filter(a => a.status === 'pending').length})</span>
              </button>
            )}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'analytics' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analytics</span>
              </button>
            )}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'settings' ? 'bg-white dark:bg-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600 dark:text-neutral-400'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Data & Backup</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* ======================================================== */}
        {/* TAB 1: CURRICULUM & LESSONS MANAGEMENT                   */}
        {/* ======================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Course & Textbook Catalog</h2>
                <p className="text-xs text-neutral-500">Organize subjects, books, chapters, and individual mathematical lessons.</p>
              </div>
              <button
                onClick={() => setIsCreatingCourse(true)}
                className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg font-medium text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create New Course
              </button>
            </div>

            {/* Create Course Form Modal */}
            {isCreatingCourse && (
              <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-md">
                <h3 className="font-bold text-sm mb-4">Create New Academic Course</h3>
                <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-neutral-600 mb-1">Course Title</label>
                      <input
                        type="text"
                        value={newCourseTitle}
                        onChange={(e) => setNewCourseTitle(e.target.value)}
                        placeholder="e.g. Real Analysis I: Metric Spaces & Measure Theory"
                        required
                        className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-neutral-600 mb-1">Subject</label>
                      <select
                        value={newCourseSubject}
                        onChange={(e) => setNewCourseSubject(e.target.value as any)}
                        className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded"
                      >
                        <option value="mathematics">Mathematics</option>
                        <option value="physics">Physics</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-600 mb-1">Description</label>
                    <textarea
                      value={newCourseDesc}
                      onChange={(e) => setNewCourseDesc(e.target.value)}
                      rows={2}
                      placeholder="Comprehensive course syllabus and target learning outcomes..."
                      className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingCourse(false)}
                      className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-800 text-white font-medium rounded"
                    >
                      Save Course
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Courses and Hierarchical Chapters */}
            <div className="space-y-6">
              {courses.map((course) => {
                const courseChapters = chapters.filter(ch => ch.courseId === course.id);
                return (
                  <div key={course.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
                    {/* Course Header */}
                    <div className="p-5 bg-neutral-50/70 dark:bg-neutral-950/50 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300">
                            {course.subjectSlug}
                          </span>
                          <span className="text-xs text-neutral-400">• Level: {course.level}</span>
                        </div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-serif mt-1">
                          {course.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedCourseForNewChapter(course.id)}
                          className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-amber-950 text-neutral-800 dark:text-neutral-200 rounded text-xs font-medium transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Chapter
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* New Chapter Inline Form */}
                    {selectedCourseForNewChapter === course.id && (
                      <form onSubmit={handleCreateChapter} className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border-b border-neutral-200 dark:border-neutral-800 flex gap-3 items-center text-xs">
                        <input
                          type="text"
                          value={newChapterTitle}
                          onChange={(e) => setNewChapterTitle(e.target.value)}
                          placeholder="Chapter title (e.g. Chapter 5 — Rotational Dynamics)..."
                          required
                          className="flex-1 p-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded"
                        />
                        <button type="submit" className="px-3 py-2 bg-amber-800 text-white rounded font-medium">
                          Add
                        </button>
                        <button type="button" onClick={() => setSelectedCourseForNewChapter(null)} className="px-2 text-neutral-500">
                          Cancel
                        </button>
                      </form>
                    )}

                    {/* Chapters List */}
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                      {courseChapters.length === 0 ? (
                        <div className="p-6 text-center text-xs text-neutral-400 italic">
                          No chapters created yet. Click "Add Chapter" to structure this course.
                        </div>
                      ) : (
                        courseChapters.map((ch) => {
                          const chapterLessons = lessons.filter(l => l.chapterId === ch.id);
                          return (
                            <div key={ch.id} className="p-4 sm:p-5 space-y-3">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                                    Chapter {ch.number}
                                  </span>
                                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                    {ch.title}
                                  </h4>
                                </div>
                                <button
                                  onClick={() => setSelectedChapterForNewLesson(ch.id)}
                                  className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs transition flex items-center gap-1 border border-neutral-200 dark:border-neutral-700"
                                >
                                  <Plus className="w-3 h-3" /> New Lesson
                                </button>
                              </div>

                              {/* New Lesson Inline Form */}
                              {selectedChapterForNewLesson === ch.id && (
                                <form onSubmit={handleCreateLesson} className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row gap-2 text-xs">
                                  <input
                                    type="text"
                                    value={newLessonNumber}
                                    onChange={(e) => setNewLessonNumber(e.target.value)}
                                    placeholder="e.g. 2.3"
                                    className="w-20 p-2 bg-white dark:bg-neutral-900 border rounded"
                                  />
                                  <input
                                    type="text"
                                    value={newLessonTitle}
                                    onChange={(e) => setNewLessonTitle(e.target.value)}
                                    placeholder="Lesson title (e.g. Torque & Moment of Inertia)..."
                                    required
                                    className="flex-1 p-2 bg-white dark:bg-neutral-900 border rounded"
                                  />
                                  <div className="flex gap-1">
                                    <button type="submit" className="px-3 py-2 bg-amber-800 text-white font-medium rounded">
                                      Create & Edit
                                    </button>
                                    <button type="button" onClick={() => setSelectedChapterForNewLesson(null)} className="px-2 text-neutral-500">
                                      Cancel
                                    </button>
                                  </div>
                                </form>
                              )}

                              {/* Lessons Table */}
                              <div className="space-y-1.5 pl-3 border-l-2 border-neutral-200 dark:border-neutral-800">
                                {chapterLessons.map((l) => (
                                  <div key={l.id} className="p-2.5 rounded-lg bg-neutral-50/60 dark:bg-neutral-950/40 hover:bg-neutral-100 dark:hover:bg-neutral-850 transition flex items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-2.5 truncate">
                                      <span className="font-mono text-neutral-400 font-bold">{l.number}</span>
                                      <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{l.title}</span>
                                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                                        l.status === 'published' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                      }`}>
                                        {l.status}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 shrink-0">
                                      <button
                                        onClick={() => onPreviewLesson(course.subjectSlug, course.slug, ch.slug, l.slug)}
                                        title="Preview Reader Experience"
                                        className="p-1 text-neutral-500 hover:text-neutral-900 rounded"
                                      >
                                        <Eye className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => onEditLesson(l.id)}
                                        className="px-2.5 py-1 bg-amber-800 hover:bg-amber-900 text-white rounded font-medium transition flex items-center gap-1"
                                      >
                                        <Edit3 className="w-3 h-3" /> Edit Blocks
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLesson(l.id)}
                                        className="p-1 text-neutral-400 hover:text-red-600 rounded"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PEER REVIEW SUGGESTIONS INBOX                     */}
        {/* ======================================================== */}
        {activeTab === 'suggestions' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Peer Review & Corrections Inbox</h2>
              <p className="text-xs text-neutral-500">Review feedback, mathematical corrections, and clarity suggestions submitted by readers.</p>
            </div>

            <div className="space-y-4">
              {suggestions.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 italic">
                  No suggestions in queue.
                </div>
              ) : (
                suggestions.map((sug) => (
                  <div key={sug.id} className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2 text-xs">
                      <div>
                        <span className="font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">{sug.suggestionType}</span>
                        <span className="text-neutral-400 mx-2">•</span>
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200">{sug.lessonTitle} ({sug.sectionTitle})</span>
                      </div>
                      <span className="text-neutral-400">{new Date(sug.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-lg text-xs font-serif text-neutral-800 dark:text-neutral-200 leading-relaxed border border-neutral-200 dark:border-neutral-800">
                      "{sug.content}"
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="text-neutral-500">
                        Submitted by <span className="font-medium text-neutral-800 dark:text-neutral-200">{sug.userName}</span> ({sug.userEmail})
                      </div>

                      {sug.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSuggestionAction(sug.id, 'accepted')}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Apply
                          </button>
                          <button
                            onClick={() => handleSuggestionAction(sug.id, 'rejected')}
                            className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded font-medium hover:bg-neutral-300"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className={`font-semibold uppercase text-[10px] px-2 py-0.5 rounded ${
                          sug.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-600'
                        }`}>
                          Status: {sug.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: SCHOLAR & CONTRIBUTOR APPLICATIONS                */}
        {/* ======================================================== */}
        {activeTab === 'contributors' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            
            {/* Direct Admin Promotion */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5">
              <div className="mb-4">
                <h3 className="text-md font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Direct Promotion
                </h3>
                <p className="text-xs text-neutral-500">
                  Instantly promote an existing user to Contributor. They must have signed into the app at least once.
                </p>
              </div>
              <form onSubmit={handlePromoteUser} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <button
                  type="submit"
                  disabled={inviteStatus?.type === 'loading'}
                  className="px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50"
                >
                  {inviteStatus?.type === 'loading' ? 'Searching...' : 'Promote to Contributor'}
                </button>
              </form>
              {inviteStatus && (
                <div className={`mt-3 p-3 rounded-lg text-xs font-medium ${
                  inviteStatus.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' :
                  inviteStatus.type === 'error' ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' :
                  'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                }`}>
                  {inviteStatus.message}
                </div>
              )}
            </div>

            <hr className="border-neutral-200 dark:border-neutral-800" />

            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Contributing Scholar Applications</h2>
              <p className="text-xs text-neutral-500">Review applications from graduate students, professors, and researchers wanting to write lessons.</p>
            </div>

            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400 italic">
                  No applications in queue.
                </div>
              ) : (
                applications.map((app) => (
                  <div key={app.id} className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3 shadow-xs">
                    <div className="flex justify-between items-start text-xs border-b border-neutral-100 dark:border-neutral-800 pb-2">
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{app.name}</h4>
                        <p className="text-neutral-500">{app.institution} • {app.email}</p>
                      </div>
                      <span className="text-neutral-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="text-xs space-y-2">
                      <div>
                        <span className="font-semibold text-neutral-600 dark:text-neutral-400">Academic Background:</span>
                        <p className="text-neutral-800 dark:text-neutral-200 mt-0.5">{app.academicBackground}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-neutral-600 dark:text-neutral-400">Proposed Curriculum Contributions:</span>
                        <p className="text-neutral-800 dark:text-neutral-200 mt-0.5 italic bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded border border-neutral-200 dark:border-neutral-800">
                          "{app.sampleProposal}"
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                      <div className="text-neutral-500 font-mono">
                        Target Subjects: {app.subjectsInterested.join(', ')}
                      </div>

                      {app.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApplicationAction(app.id, 'approved')}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve as Contributor
                          </button>
                          <button
                            onClick={() => handleApplicationAction(app.id, 'declined')}
                            className="px-3 py-1.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded font-medium"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="font-semibold uppercase text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {app.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: EDUCATIONAL ANALYTICS                             */}
        {/* ======================================================== */}
        {activeTab === 'analytics' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Library Reading & Learning Metrics</h2>
              <p className="text-xs text-neutral-500">Privacy-respecting engagement metrics across mathematical and physical courses.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <div className="text-xs font-bold text-neutral-400 uppercase">Published Courses</div>
                <div className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100 mt-1">{courses.length}</div>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <div className="text-xs font-bold text-neutral-400 uppercase">Total Lessons</div>
                <div className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100 mt-1">{lessons.length}</div>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <div className="text-xs font-bold text-neutral-400 uppercase">Active Reader Sessions</div>
                <div className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100 mt-1">1,420</div>
              </div>
              <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                <div className="text-xs font-bold text-neutral-400 uppercase">Exercise Solves</div>
                <div className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100 mt-1">3,892</div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-4">
              <h3 className="font-bold text-sm">Most Engaged Curriculum Modules</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span>Classical Mechanics: Newton’s Laws & Free-Body Vectors</span>
                    <span>94% completion</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-800 h-full w-[94%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span>Calculus I: Epsilon-Delta Limit Proofs</span>
                    <span>81% completion</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-800 h-full w-[81%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-medium mb-1">
                    <span>Calculus I: The Fundamental Theorem of Calculus</span>
                    <span>76% completion</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-800 h-full w-[76%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: DATA EXPORT, IMPORT & BACKUP                      */}
        {/* ======================================================== */}
        {activeTab === 'settings' && currentUser.role === 'admin' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Data Portability & Database Backups</h2>
              <p className="text-xs text-neutral-500">Export the entire open curriculum as open JSON or restore from existing backups.</p>
            </div>

            {importStatus && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 rounded text-xs text-amber-900 dark:text-amber-200">
                {importStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Download className="w-4 h-4 text-amber-800" />
                  <span>Export Complete Library (JSON)</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Download structured JSON containing all mathematics and physics textbooks, chapters, lessons, LaTeX blocks, and exercises.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportJson}
                    className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-medium transition"
                  >
                    Download Local Backup JSON
                  </button>
                  <button
                    onClick={handleBackupToDrive}
                    className="px-4 py-2 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                  >
                    Backup to Google Drive
                  </button>
                </div>
              </div>

              <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Upload className="w-4 h-4 text-blue-800" />
                  <span>Restore from Backup</span>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Upload a previously exported JSON backup file to overwrite or restore curriculum contents.
                </p>
                <label className="inline-block px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-medium cursor-pointer transition border border-neutral-300 dark:border-neutral-700">
                  Select Backup JSON File
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
                <div>
                  <h4 className="text-xs font-bold text-red-900 dark:text-red-300">Reset to Default Curriculum</h4>
                  <p className="text-[11px] text-red-700 dark:text-red-400">Re-seed Calculus I and Classical Mechanics default textbooks.</p>
                </div>
                <button
                  onClick={handleResetDefaults}
                  className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-medium rounded-lg transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Database
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
