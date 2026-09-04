import { 
  Course, Chapter, Lesson, Category, User, UserRole, UserProgress, 
  UserNote, Suggestion, ContributorApplication, SearchResult, SubjectSlug 
} from '../types';
import { 
  INITIAL_CATEGORIES, INITIAL_COURSES, INITIAL_CHAPTERS, INITIAL_LESSONS 
} from '../data/initialData';

const STORAGE_KEYS = {
  COURSES: 'principia_courses_v1',
  CHAPTERS: 'principia_chapters_v1',
  LESSONS: 'principia_lessons_v1',
  CATEGORIES: 'principia_categories_v1',
  CURRENT_USER: 'principia_current_user_v1',
  USER_PROGRESS: 'principia_user_progress_v1',
  SUGGESTIONS: 'principia_suggestions_v1',
  CONTRIBUTIONS: 'principia_contributions_v1',
  SAVED_THEME: 'principia_theme_v1'
};

export const MOCK_USERS: Record<UserRole, User> = {
  reader: {
    id: 'user-reader-1',
    name: 'Abdelbari Saoutelhak',
    email: 'abdelbarisaoutelhak@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'reader',
    bio: 'Mathematics & Physics undergraduate student studying classical mechanics and single-variable calculus.',
    institution: 'University of Cambridge'
  },
  contributor: {
    id: 'user-contrib-1',
    name: 'Elena Rostova, M.Sc.',
    email: 'elena.rostova@academic.org',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'contributor',
    bio: 'Graduate researcher in theoretical physics and mathematical analysis. Active textbook contributor.',
    institution: 'ETH Zürich'
  },
  author: {
    id: 'user-author-1',
    name: 'Prof. Richard Feynman-Hall',
    email: 'r.feynman.hall@principia.edu',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'author',
    bio: 'Professor of Theoretical Physics and Editor of the Open Classical Mechanics Curriculum.',
    institution: 'Department of Physics, Oxford'
  },
  admin: {
    id: 'user-admin-1',
    name: 'Dr. Arthur Pendelton (Admin)',
    email: 'a.pendelton@principia.edu',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    bio: 'Chief Academic Officer and Lead Platform Administrator for Principia Library.',
    institution: 'Principia Academic Foundation'
  }
};

class StorageEngine {
  private get<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return fallback;
      return JSON.parse(data) as T;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Storage save failed for ${key}:`, e);
    }
  }

  // --- Initialization ---
  public init(): void {
    if (!localStorage.getItem(STORAGE_KEYS.COURSES)) {
      this.set(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHAPTERS)) {
      this.set(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LESSONS)) {
      this.set(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.set(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      this.set(STORAGE_KEYS.CURRENT_USER, MOCK_USERS.reader);
    }
    if (!localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)) {
      const defaultProgress: UserProgress = {
        completedLessons: ['lesson-calc-1-1'],
        completedExercises: ['ex-calc-1-1'],
        bookmarks: ['lesson-mech-2-1'],
        favorites: ['course-calc-1', 'course-classical-mech'],
        notes: [
          {
            id: 'note-1',
            lessonId: 'lesson-mech-2-1',
            lessonTitle: 'Newton’s Laws of Motion & Dynamical Principles',
            courseSlug: 'classical-mechanics',
            chapterSlug: 'newtons-laws',
            lessonSlug: 'newtons-laws-of-motion',
            text: 'Key insight: Action-reaction pairs act on different bodies so they never cancel in a single free-body diagram.',
            createdAt: '2026-02-14T10:00:00Z',
            updatedAt: '2026-02-14T10:00:00Z'
          }
        ],
        lastVisited: {
          courseId: 'course-classical-mech',
          lessonId: 'lesson-mech-2-1',
          lessonTitle: 'Newton’s Laws of Motion & Dynamical Principles',
          courseTitle: 'Classical Mechanics: Kinematics, Dynamics & Energy',
          subjectSlug: 'physics',
          courseSlug: 'classical-mechanics',
          chapterSlug: 'newtons-laws',
          lessonSlug: 'newtons-laws-of-motion',
          timestamp: new Date().toISOString()
        }
      };
      this.set(STORAGE_KEYS.USER_PROGRESS, defaultProgress);
    }
  }

  // --- Current User & Roles ---
  public getCurrentUser(): User {
    return this.get<User>(STORAGE_KEYS.CURRENT_USER, MOCK_USERS.reader);
  }

  public setCurrentUser(user: User): void {
    this.set(STORAGE_KEYS.CURRENT_USER, user);
  }

  public switchRole(role: UserRole): User {
    const user = MOCK_USERS[role];
    this.setCurrentUser(user);
    return user;
  }

  // --- Categories ---
  public getCategories(): Category[] {
    return this.get<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  public saveCategories(categories: Category[]): void {
    this.set(STORAGE_KEYS.CATEGORIES, categories);
  }

  public addCategory(cat: Category): void {
    const list = this.getCategories();
    this.set(STORAGE_KEYS.CATEGORIES, [...list, cat]);
  }

  // --- Courses ---
  public getCourses(): Course[] {
    return this.get<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  }

  public getCourseBySlug(slug: string): Course | undefined {
    return this.getCourses().find(c => c.slug === slug);
  }

  public getCourseById(id: string): Course | undefined {
    return this.getCourses().find(c => c.id === id);
  }

  public saveCourse(course: Course): void {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === course.id);
    if (index >= 0) {
      courses[index] = course;
    } else {
      courses.push(course);
    }
    this.set(STORAGE_KEYS.COURSES, courses);
  }

  public deleteCourse(id: string): void {
    const courses = this.getCourses().filter(c => c.id !== id);
    this.set(STORAGE_KEYS.COURSES, courses);
  }

  // --- Chapters ---
  public getChapters(courseId?: string): Chapter[] {
    const all = this.get<Chapter[]>(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
    if (courseId) {
      return all.filter(ch => ch.courseId === courseId).sort((a, b) => a.number - b.number);
    }
    return all;
  }

  public getChapterBySlug(courseId: string, chapterSlug: string): Chapter | undefined {
    return this.getChapters(courseId).find(ch => ch.slug === chapterSlug);
  }

  public saveChapter(chapter: Chapter): void {
    const chapters = this.get<Chapter[]>(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS);
    const idx = chapters.findIndex(c => c.id === chapter.id);
    if (idx >= 0) {
      chapters[idx] = chapter;
    } else {
      chapters.push(chapter);
    }
    this.set(STORAGE_KEYS.CHAPTERS, chapters);
  }

  public deleteChapter(id: string): void {
    const chapters = this.get<Chapter[]>(STORAGE_KEYS.CHAPTERS, INITIAL_CHAPTERS).filter(c => c.id !== id);
    this.set(STORAGE_KEYS.CHAPTERS, chapters);
  }

  // --- Lessons ---
  public getLessons(chapterId?: string): Lesson[] {
    const all = this.get<Lesson[]>(STORAGE_KEYS.LESSONS, INITIAL_LESSONS);
    if (chapterId) {
      return all.filter(l => l.chapterId === chapterId);
    }
    return all;
  }

  public getLessonBySlug(chapterId: string, lessonSlug: string): Lesson | undefined {
    return this.getLessons(chapterId).find(l => l.slug === lessonSlug);
  }

  public getLessonById(id: string): Lesson | undefined {
    return this.getLessons().find(l => l.id === id);
  }

  public saveLesson(lesson: Lesson): void {
    const lessons = this.getLessons();
    const idx = lessons.findIndex(l => l.id === lesson.id);
    if (idx >= 0) {
      lessons[idx] = { ...lesson, updatedAt: new Date().toISOString().split('T')[0] };
    } else {
      lessons.push(lesson);
    }
    this.set(STORAGE_KEYS.LESSONS, lessons);
  }

  public deleteLesson(id: string): void {
    const lessons = this.getLessons().filter(l => l.id !== id);
    this.set(STORAGE_KEYS.LESSONS, lessons);
  }

  // --- User Progress ---
  public getUserProgress(): UserProgress {
    return this.get<UserProgress>(STORAGE_KEYS.USER_PROGRESS, {
      completedLessons: [],
      completedExercises: [],
      bookmarks: [],
      favorites: [],
      notes: []
    });
  }

  public toggleLessonCompleted(lessonId: string): boolean {
    const progress = this.getUserProgress();
    const isCompleted = progress.completedLessons.includes(lessonId);
    if (isCompleted) {
      progress.completedLessons = progress.completedLessons.filter(id => id !== lessonId);
    } else {
      progress.completedLessons.push(lessonId);
    }
    this.set(STORAGE_KEYS.USER_PROGRESS, progress);
    return !isCompleted;
  }

  public toggleExerciseCompleted(exerciseId: string): boolean {
    const progress = this.getUserProgress();
    const isCompleted = progress.completedExercises.includes(exerciseId);
    if (isCompleted) {
      progress.completedExercises = progress.completedExercises.filter(id => id !== exerciseId);
    } else {
      progress.completedExercises.push(exerciseId);
    }
    this.set(STORAGE_KEYS.USER_PROGRESS, progress);
    return !isCompleted;
  }

  public toggleBookmark(lessonId: string): boolean {
    const progress = this.getUserProgress();
    const isBookmarked = progress.bookmarks.includes(lessonId);
    if (isBookmarked) {
      progress.bookmarks = progress.bookmarks.filter(id => id !== lessonId);
    } else {
      progress.bookmarks.push(lessonId);
    }
    this.set(STORAGE_KEYS.USER_PROGRESS, progress);
    return !isBookmarked;
  }

  public toggleFavorite(courseId: string): boolean {
    const progress = this.getUserProgress();
    const isFavorite = progress.favorites.includes(courseId);
    if (isFavorite) {
      progress.favorites = progress.favorites.filter(id => id !== courseId);
    } else {
      progress.favorites.push(courseId);
    }
    this.set(STORAGE_KEYS.USER_PROGRESS, progress);
    return !isFavorite;
  }

  public saveNote(note: UserNote): void {
    const progress = this.getUserProgress();
    const idx = progress.notes.findIndex(n => n.id === note.id);
    if (idx >= 0) {
      progress.notes[idx] = note;
    } else {
      progress.notes.push(note);
    }
    this.set(STORAGE_KEYS.USER_PROGRESS, progress);
  }

  public deleteNote(noteId: string): void {
    const progress = this.getUserProgress();
    progress.notes = progress.notes.filter(n => n.id !== noteId);
    this.set(STORAGE_KEYS.USER_PROGRESS, progress);
  }

  public setLastVisited(entry: NonNullable<UserProgress['lastVisited']>): void {
    const progress = this.getUserProgress();
    progress.lastVisited = entry;
    this.set(STORAGE_KEYS.USER_PROGRESS, progress);
  }

  // --- Suggestions ---
  public getSuggestions(): Suggestion[] {
    return this.get<Suggestion[]>(STORAGE_KEYS.SUGGESTIONS, [
      {
        id: 'sug-1',
        lessonId: 'lesson-mech-2-1',
        lessonTitle: 'Newton’s Laws of Motion',
        courseSlug: 'classical-mechanics',
        sectionTitle: 'Newton’s Third Law',
        suggestionType: 'clarity',
        content: 'Could we add a brief remark about internal vs external forces in a multi-particle system to clarify why internal third-law forces cancel out in the sum?',
        userId: 'user-reader-1',
        userName: 'Abdelbari Saoutelhak',
        userEmail: 'abdelbarisaoutelhak@gmail.com',
        status: 'pending',
        createdAt: '2026-02-15T14:30:00Z'
      }
    ]);
  }

  public addSuggestion(sug: Omit<Suggestion, 'id' | 'createdAt' | 'status'>): Suggestion {
    const list = this.getSuggestions();
    const newSug: Suggestion = {
      ...sug,
      id: `sug-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.set(STORAGE_KEYS.SUGGESTIONS, [newSug, ...list]);
    return newSug;
  }

  public updateSuggestionStatus(id: string, status: 'accepted' | 'rejected', response?: string): void {
    const list = this.getSuggestions();
    const idx = list.findIndex(s => s.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      if (response) list[idx].authorResponse = response;
      this.set(STORAGE_KEYS.SUGGESTIONS, list);
    }
  }

  // --- Contributor Applications ---
  public getContributorApplications(): ContributorApplication[] {
    return this.get<ContributorApplication[]>(STORAGE_KEYS.CONTRIBUTIONS, [
      {
        id: 'ca-1',
        userId: 'user-reader-1',
        name: 'Abdelbari Saoutelhak',
        email: 'abdelbarisaoutelhak@gmail.com',
        institution: 'University of Cambridge',
        academicBackground: 'B.A. in Natural Sciences (Physics & Mathematics). Specialized in Analytical Mechanics and Multivariable Calculus.',
        subjectsInterested: ['physics', 'mathematics'],
        sampleProposal: 'I would like to contribute complete exercise sets and worked step-by-step solutions for Rotational Dynamics and Lagrangian Mechanics.',
        status: 'pending',
        createdAt: '2026-02-16T09:15:00Z'
      }
    ]);
  }

  public submitContributorApplication(app: Omit<ContributorApplication, 'id' | 'createdAt' | 'status'>): ContributorApplication {
    const list = this.getContributorApplications();
    const newApp: ContributorApplication = {
      ...app,
      id: `ca-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.set(STORAGE_KEYS.CONTRIBUTIONS, [newApp, ...list]);
    return newApp;
  }

  public updateApplicationStatus(id: string, status: 'approved' | 'declined'): void {
    const list = this.getContributorApplications();
    const idx = list.findIndex(a => a.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      this.set(STORAGE_KEYS.CONTRIBUTIONS, list);
    }
  }

  // --- Search Engine ---
  public search(query: string, subjectFilter?: SubjectSlug | 'all'): SearchResult[] {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    const courses = this.getCourses();
    const chapters = this.getChapters();
    const lessons = this.getLessons();

    // 1. Search Courses
    for (const course of courses) {
      if (subjectFilter && subjectFilter !== 'all' && course.subjectSlug !== subjectFilter) continue;
      let score = 0;
      if (course.title.toLowerCase().includes(q)) score += 50;
      if (course.description.toLowerCase().includes(q)) score += 20;
      if (course.authors.some(a => a.toLowerCase().includes(q))) score += 30;

      if (score > 0) {
        results.push({
          id: `search-course-${course.id}`,
          type: 'course',
          title: course.title,
          snippet: course.description,
          subjectSlug: course.subjectSlug,
          courseSlug: course.slug,
          courseTitle: course.title,
          relevanceScore: score
        });
      }
    }

    // 2. Search Lessons & Content Blocks
    for (const lesson of lessons) {
      const chapter = chapters.find(ch => ch.id === lesson.chapterId);
      const course = courses.find(c => c.id === lesson.courseId);
      if (!course || !chapter) continue;
      if (subjectFilter && subjectFilter !== 'all' && course.subjectSlug !== subjectFilter) continue;

      let lessonScore = 0;
      let matchingSnippet = lesson.description;

      if (lesson.title.toLowerCase().includes(q)) lessonScore += 45;
      if (lesson.description.toLowerCase().includes(q)) lessonScore += 25;
      if (lesson.tags.some(t => t.toLowerCase().includes(q))) lessonScore += 20;

      // Check blocks for definitions, theorems, latex, equations, text
      for (const block of lesson.blocks) {
        if (block.title && block.title.toLowerCase().includes(q)) {
          lessonScore += 35;
          matchingSnippet = block.title + ': ' + (block.text || block.latex || '');
        }
        if (block.text && block.text.toLowerCase().includes(q)) {
          lessonScore += 15;
          const idx = block.text.toLowerCase().indexOf(q);
          const start = Math.max(0, idx - 40);
          const end = Math.min(block.text.length, idx + q.length + 60);
          matchingSnippet = '...' + block.text.substring(start, end) + '...';
        }
        if (block.latex && block.latex.toLowerCase().includes(q)) {
          lessonScore += 25;
          matchingSnippet = 'LaTeX Equation: ' + block.latex;
        }
        if (block.exercise && (block.exercise.prompt.toLowerCase().includes(q) || block.exercise.solutionExplanation.toLowerCase().includes(q))) {
          lessonScore += 30;
          matchingSnippet = 'Exercise: ' + block.exercise.prompt;
        }
      }

      if (lessonScore > 0) {
        results.push({
          id: `search-lesson-${lesson.id}`,
          type: 'lesson',
          title: `${lesson.number} ${lesson.title}`,
          snippet: matchingSnippet,
          subjectSlug: course.subjectSlug,
          courseSlug: course.slug,
          courseTitle: course.title,
          chapterSlug: chapter.slug,
          chapterTitle: chapter.title,
          lessonSlug: lesson.slug,
          lessonNumber: lesson.number,
          relevanceScore: lessonScore
        });
      }
    }

    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // --- Reset to Factory Defaults ---
  public resetToDefaults(): void {
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.CHAPTERS);
    localStorage.removeItem(STORAGE_KEYS.LESSONS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.SUGGESTIONS);
    localStorage.removeItem(STORAGE_KEYS.CONTRIBUTIONS);
    this.init();
  }

  // --- JSON Export / Import ---
  public exportLibraryJson(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      categories: this.getCategories(),
      courses: this.getCourses(),
      chapters: this.getChapters(),
      lessons: this.getLessons()
    };
    return JSON.stringify(data, null, 2);
  }

  public importLibraryJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.courses && data.chapters && data.lessons) {
        if (data.categories) this.set(STORAGE_KEYS.CATEGORIES, data.categories);
        this.set(STORAGE_KEYS.COURSES, data.courses);
        this.set(STORAGE_KEYS.CHAPTERS, data.chapters);
        this.set(STORAGE_KEYS.LESSONS, data.lessons);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

export const storage = new StorageEngine();
storage.init();
