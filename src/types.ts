export type UserRole = 'reader' | 'contributor' | 'author' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  bio?: string;
  institution?: string;
}

export type SubjectSlug = 'mathematics' | 'physics';

export interface Category {
  id: string;
  subjectSlug: SubjectSlug;
  title: string;
  slug: string;
  description: string;
  iconName?: string;
}

export interface Course {
  id: string;
  subjectSlug: SubjectSlug;
  categorySlug: string;
  title: string;
  slug: string;
  description: string;
  level: 'Introductory' | 'Intermediate' | 'Advanced';
  authors: string[];
  contributors: string[];
  estimatedHours: number;
  prerequisites: string[];
  publishedAt: string;
  updatedAt: string;
  coverGradient: string;
  iconName: string;
  chaptersCount: number;
  lessonsCount: number;
  isFeatured?: boolean;
}

export interface Book {
  id: string;
  courseId: string;
  title: string;
  slug: string;
  description: string;
  authors: string[];
  version: string;
  isbn?: string;
  preface?: string;
}

export interface Chapter {
  id: string;
  courseId: string;
  number: number;
  title: string;
  slug: string;
  description: string;
  lessons: Lesson[];
}

export type BlockType = 
  | 'paragraph'
  | 'heading'
  | 'equation'
  | 'definition'
  | 'theorem'
  | 'proof'
  | 'example'
  | 'remark'
  | 'warning'
  | 'exercise'
  | 'diagram'
  | 'code'
  | 'quote'
  | 'table';

export interface ExerciseData {
  id: string;
  number?: number;
  prompt: string;
  hints?: string[];
  solutionLatex?: string;
  solutionExplanation: string;
  type?: 'conceptual' | 'numerical' | 'proof' | 'multiple_choice';
  options?: string[];
  correctOptionIndex?: number;
  numericAnswer?: number;
  numericTolerance?: number;
  unit?: string;
}

export interface DiagramData {
  type: 'vector' | 'plot' | 'freebody' | 'projectile' | 'coordinate';
  title?: string;
  caption?: string;
  config: Record<string, any>;
}

export interface ContentBlock {
  id: string;
  type: BlockType;
  level?: 2 | 3 | 4; // for heading
  title?: string; // e.g. "Theorem 2.1 (Mean Value Theorem)", "Definition 1.1"
  text?: string; // markdown content with inline $math$
  latex?: string; // for display equations
  isNumbered?: boolean;
  exercise?: ExerciseData;
  diagram?: DiagramData;
  code?: {
    language: string;
    code: string;
    caption?: string;
  };
  quoteAuthor?: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  courseId: string;
  number: string; // e.g. "1.1", "2.3"
  title: string;
  slug: string;
  description: string;
  readingTimeMinutes: number;
  author: string;
  status: 'draft' | 'review' | 'published';
  publishedAt: string;
  updatedAt: string;
  blocks: ContentBlock[];
  tags: string[];
}

export interface UserNote {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseSlug: string;
  chapterSlug: string;
  lessonSlug: string;
  blockId?: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface Suggestion {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseSlug: string;
  sectionTitle: string;
  suggestionType: 'typo' | 'clarity' | 'math_error' | 'new_example' | 'other';
  content: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  authorResponse?: string;
}

export interface ContributorApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  institution: string;
  academicBackground: string;
  subjectsInterested: SubjectSlug[];
  sampleProposal: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

export interface UserProgress {
  completedLessons: string[]; // lessonIds
  completedExercises: string[]; // exerciseIds
  bookmarks: string[]; // lessonIds
  favorites: string[]; // courseIds
  notes: UserNote[];
  lastVisited?: {
    courseId: string;
    lessonId: string;
    lessonTitle: string;
    courseTitle: string;
    subjectSlug: SubjectSlug;
    courseSlug: string;
    chapterSlug: string;
    lessonSlug: string;
    timestamp: string;
  };
}

export interface SearchResult {
  id: string;
  type: 'course' | 'lesson' | 'section' | 'definition' | 'theorem' | 'exercise';
  title: string;
  snippet: string;
  subjectSlug: SubjectSlug;
  courseSlug: string;
  courseTitle: string;
  chapterSlug?: string;
  chapterTitle?: string;
  lessonSlug?: string;
  lessonNumber?: string;
  relevanceScore: number;
}
