import React, { useState, useEffect, useRef } from 'react';
import { storage } from '../lib/storage';
import { SearchResult, SubjectSlug } from '../types';
import { Search, X, BookOpen, Compass, Grid, Sigma, FileText, ArrowRight, CornerDownLeft } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (subjectSlug: SubjectSlug, courseSlug: string, chapterSlug?: string, lessonSlug?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<SubjectSlug | 'all'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      performSearch(query, subjectFilter);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const performSearch = (q: string, filter: SubjectSlug | 'all') => {
    if (!q.trim()) {
      // Show default popular / featured entries
      const defaultRes = storage.search('law', filter);
      setResults(defaultRes.slice(0, 6));
      return;
    }
    const res = storage.search(q, filter);
    setResults(res);
    setSelectedIndex(0);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    performSearch(val, subjectFilter);
  };

  const handleFilterChange = (filter: SubjectSlug | 'all') => {
    setSubjectFilter(filter);
    performSearch(query, filter);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleSelect = (result: SearchResult) => {
    onNavigate(
      result.subjectSlug,
      result.courseSlug,
      result.chapterSlug,
      result.lessonSlug
    );
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800 gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Search mathematics, physics, equations, theorems, limits, Newton..."
            className="w-full bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-base outline-none"
          />
          {query && (
            <button 
              onClick={() => handleQueryChange('')}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-500 px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700">
            ESC
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50/80 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-xs overflow-x-auto">
          <span className="text-neutral-500 font-medium shrink-0">Filter:</span>
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-2.5 py-1 rounded-full font-medium transition ${
              subjectFilter === 'all'
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            All Subjects
          </button>
          <button
            onClick={() => handleFilterChange('mathematics')}
            className={`px-2.5 py-1 rounded-full font-medium transition flex items-center gap-1 ${
              subjectFilter === 'mathematics'
                ? 'bg-amber-800 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            <Sigma className="w-3 h-3" />
            Mathematics
          </button>
          <button
            onClick={() => handleFilterChange('physics')}
            className={`px-2.5 py-1 rounded-full font-medium transition flex items-center gap-1 ${
              subjectFilter === 'physics'
                ? 'bg-blue-900 text-white'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
            }`}
          >
            <Compass className="w-3 h-3" />
            Physics
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {results.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-sm">
              No results found for <span className="font-semibold text-neutral-800 dark:text-neutral-200">"{query}"</span>.
              <p className="text-xs text-neutral-400 mt-1">Try searching for terms like "derivative", "momentum", "limit", or "force".</p>
            </div>
          ) : (
            results.map((result, idx) => (
              <div
                key={result.id}
                onClick={() => handleSelect(result)}
                className={`p-3 rounded-lg cursor-pointer transition flex items-start justify-between gap-3 ${
                  selectedIndex === idx
                    ? 'bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      result.subjectSlug === 'mathematics'
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300'
                        : 'bg-blue-100 text-blue-900 dark:bg-blue-900/50 dark:text-blue-300'
                    }`}>
                      {result.subjectSlug}
                    </span>
                    <span className="text-xs text-neutral-500 truncate">
                      {result.courseTitle} {result.chapterTitle ? `› ${result.chapterTitle}` : ''}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    {result.title}
                  </h4>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    {result.snippet}
                  </p>
                </div>

                <div className="shrink-0 pt-2 text-neutral-400">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border rounded shadow-2xs">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border rounded shadow-2xs">↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-neutral-800 border rounded shadow-2xs flex items-center">
                <CornerDownLeft className="w-3 h-3" />
              </kbd>
              to select
            </span>
          </div>
          <span>Principia Academic Index</span>
        </div>
      </div>
    </div>
  );
};
