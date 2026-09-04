import React, { useState } from 'react';
import { storage } from '../lib/storage';
import { SubjectSlug, User } from '../types';
import { BookOpen, CheckCircle2, Send, Users, ShieldCheck, Sparkles, Feather } from 'lucide-react';

interface ContributePageProps {
  currentUser: User;
  onGoToLibrary: () => void;
}

export const ContributePage: React.FC<ContributePageProps> = ({ currentUser, onGoToLibrary }) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [background, setBackground] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectSlug[]>(['physics', 'mathematics']);
  const [proposal, setProposal] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal.trim() || !background.trim()) return;

    storage.submitContributorApplication({
      userId: currentUser.id,
      name: name.trim(),
      email: email.trim(),
      institution: institution.trim() || 'Independent Scholar',
      academicBackground: background.trim(),
      subjectsInterested: selectedSubjects,
      sampleProposal: proposal.trim()
    });

    setIsSubmitted(true);
  };

  const toggleSubject = (sub: SubjectSlug) => {
    if (selectedSubjects.includes(sub)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, sub]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Feather className="w-3.5 h-3.5" />
            <span>Academic Authorship & Peer Review</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-neutral-950 dark:text-neutral-50">
            Contribute to the Open Scientific Library
          </h1>
          <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-serif">
            Help build the definitive, freely accessible digital curriculum for mathematics and physics. Join our network of educators, researchers, and contributing scholars.
          </p>
        </div>

        {/* Process Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-base font-serif">Apply as Scholar</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Submit your academic background and proposed curriculum topics or exercise sets.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-base font-serif">Author & Typeset</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Use our visual equation editor and block builder to author rich LaTeX lessons and diagrams.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-base font-serif">Peer Review & Publish</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Submissions undergo academic review by discipline editors before live publication.
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-bold font-serif">Application Submitted Successfully</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                Thank you for applying to become a contributing scholar on Principia. Our editorial board will review your application and proposal within 2 business days.
              </p>
              <div className="pt-4">
                <button
                  onClick={onGoToLibrary}
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
                >
                  Return to Library
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <h3 className="text-lg font-bold font-serif text-neutral-950 dark:text-neutral-50">
                  Scholar Application Form
                </h3>
                <p className="text-neutral-500 mt-0.5">Please provide details regarding your academic experience.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Full Legal / Academic Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Academic / Institutional Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  University / Research Institution Affiliation
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. University of Cambridge, MIT, CNRS, Max Planck Institute, or Independent"
                  className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Subject Fields
                </label>
                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => toggleSubject('mathematics')}
                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 border ${
                      selectedSubjects.includes('mathematics')
                        ? 'bg-amber-100 dark:bg-amber-950 border-amber-500 text-amber-900 dark:text-amber-200'
                        : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600'
                    }`}
                  >
                    <span>Mathematics</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleSubject('physics')}
                    className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 border ${
                      selectedSubjects.includes('physics')
                        ? 'bg-blue-100 dark:bg-blue-950 border-blue-500 text-blue-900 dark:text-blue-200'
                        : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-600'
                    }`}
                  >
                    <span>Physics</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Academic Background & Degrees
                </label>
                <textarea
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  rows={3}
                  required
                  placeholder="State your current degree level, major, relevant coursework (e.g. Real Analysis, Quantum Electrodynamics), and previous teaching or writing experience..."
                  className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Proposed Curriculum or Exercise Contributions
                </label>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe the lessons, chapters, worked exercise sets, or interactive diagrams you wish to create or improve..."
                  className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Contributor Application</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
