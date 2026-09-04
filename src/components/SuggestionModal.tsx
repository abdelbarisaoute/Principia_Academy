import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { Suggestion, User } from '../types';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface SuggestionModalProps {
  currentUser: User | null;
  isOpen: boolean;
  lessonId: string;
  lessonTitle: string;
  courseSlug: string;
  sectionTitle: string;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
  currentUser,
  isOpen,
  lessonId,
  lessonTitle,
  courseSlug,
  sectionTitle,
  onClose,
  onSubmitted
}) => {
  const [suggestionType, setSuggestionType] = useState<Suggestion['suggestionType']>('clarity');
  const [content, setContent] = useState('');
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    storage.addSuggestion({
      lessonId,
      lessonTitle,
      courseSlug,
      sectionTitle: sectionTitle || 'General Lesson',
      suggestionType,
      content: content.trim(),
      userId: currentUser?.id || `guest_${Date.now()}`,
      userName: name.trim() || currentUser?.name || 'Anonymous Reader',
      userEmail: email.trim() || currentUser?.email || 'guest@example.com'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setContent('');
      onClose();
      if (onSubmitted) onSubmitted();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">Peer Review</span>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Suggest an Improvement</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">Thank You!</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Your suggestion has been submitted to the course authors for academic peer review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="text-neutral-500 dark:text-neutral-400 mb-0.5">Lesson & Section:</div>
              <div className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                {lessonTitle} {sectionTitle ? `— § ${sectionTitle}` : ''}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Type of Suggestion
              </label>
              <select
                value={suggestionType}
                onChange={(e) => setSuggestionType(e.target.value as any)}
                className="w-full text-sm p-2.5 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 outline-none"
              >
                <option value="clarity">Pedagogical Clarity / Explanation</option>
                <option value="math_error">Mathematical / Equation Error</option>
                <option value="typo">Typographical Correction</option>
                <option value="new_example">New Example or Exercise Proposal</option>
                <option value="other">Other Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-1.5">
                Details & Proposed Correction
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
                placeholder="Explain what could be improved, cite formulas or line numbers, and provide the proposed correct wording..."
                className="w-full text-sm p-3 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-5 py-2 text-sm font-medium bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white rounded-lg transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit for Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
