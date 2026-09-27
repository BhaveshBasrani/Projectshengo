'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import GrungeGlyph from '@/components/ui/GrungeGlyph';
import { useAuth } from '@/lib/firebase/auth-context';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'suggestion' | 'feedback';
}

export default function FeedbackModal({ isOpen, onClose, defaultType = 'suggestion' }: FeedbackModalProps) {
  const { user, profile } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [type, setType] = useState<'suggestion' | 'feedback'>(defaultType);
  const [name, setName] = useState(profile?.display_name || user?.displayName || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('All fields are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          type,
          subject: subject.trim(),
          message: message.trim(),
          user_id: user?.uid || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Error transmitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setSubject('');
    setMessage('');
    onClose();
  };

  return createPortal(
    <div
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto"
    >
      <div className="w-full max-w-lg bg-[#0E0E0E] text-[#F4F1EA] border-2 border-[#E50914] shadow-[8px_8px_0px_0px_#E50914] p-6 relative my-auto stencil-cut">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 border border-[#333333] hover:border-[#E50914] hover:bg-[#E50914] hover:text-white transition-all"
        >
          <GrungeGlyph name="close" className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-[#E50914] uppercase tracking-widest font-bold">
              CONTACT US
            </span>
          </div>
          <h3 className="font-heading text-2xl font-black uppercase tracking-tight">
            SEND A MESSAGE
          </h3>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Your message goes directly to our team and is kept private.
          </p>
        </div>

        {/* Toggle between Suggestion and Feedback */}
        <div className="grid grid-cols-2 gap-2 mb-4 font-mono text-xs font-bold uppercase">
          <button
            type="button"
            onClick={() => setType('suggestion')}
            className={`py-2 px-3 border-2 transition-all font-mono font-bold ${
              type === 'suggestion'
                ? 'border-[#E50914] bg-[#E50914] text-white shadow-[2px_2px_0px_0px_#000000]'
                : 'border-[#333333] bg-[#141414] text-[#888888] hover:border-white'
            }`}
          >
            [+] SUGGESTION
          </button>
          <button
            type="button"
            onClick={() => setType('feedback')}
            className={`py-2 px-3 border-2 transition-all font-mono font-bold ${
              type === 'feedback'
                ? 'border-[#E50914] bg-[#E50914] text-white shadow-[2px_2px_0px_0px_#000000]'
                : 'border-[#333333] bg-[#141414] text-[#888888] hover:border-white'
            }`}
          >
            [!] FEEDBACK
          </button>
        </div>

        {success ? (
          <div className="p-5 border-2 border-emerald-500 bg-emerald-950/40 text-emerald-200 space-y-3 text-center stencil-cut">
            <GrungeGlyph name="check" className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-heading font-black text-lg">MESSAGE SENT</h4>
            <p className="text-xs font-sans text-emerald-300 leading-relaxed">
              Thank you for reaching out. Our team has received your message and will read it carefully.
            </p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 px-5 py-2 bg-[#E50914] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
            >
              CLOSE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {error && (
              <div className="p-3 border border-[#E50914] bg-red-950/50 text-[#FF6B6B] flex items-center gap-2">
                <GrungeGlyph name="alert" className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block uppercase text-[11px] text-[#888888] mb-1 font-bold">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name / Alias"
                  className="w-full p-2.5 bg-[#141414] border border-[#333333] focus:border-[#E50914] text-white outline-none"
                />
              </div>

              <div>
                <label className="block uppercase text-[11px] text-[#888888] mb-1 font-bold">
                  Your Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@example.com"
                  className="w-full p-2.5 bg-[#141414] border border-[#333333] focus:border-[#E50914] text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase text-[11px] text-[#888888] mb-1 font-bold">
                Subject *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={`Brief summary of your ${type}`}
                className="w-full p-2.5 bg-[#141414] border border-[#333333] focus:border-[#E50914] text-white outline-none"
              />
            </div>

            <div>
              <label className="block uppercase text-[11px] text-[#888888] mb-1 font-bold">
                Message Details *
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Provide specific context, suggestions, ideas, or observations...`}
                className="w-full p-2.5 bg-[#141414] border border-[#333333] focus:border-[#E50914] text-white outline-none resize-none"
              />
            </div>

            <div className="p-3 bg-[#141414] border border-[#222222] text-[10px] text-[#888888] leading-relaxed flex items-start gap-2">
              <GrungeGlyph name="shield" className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
              <span><strong>Strict Privacy:</strong> Suggestions and feedback are strictly private administrative records. They will NEVER be publicly displayed on the website.</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#E50914] hover:bg-white hover:text-black text-white font-heading font-black text-sm uppercase tracking-wider transition-all border border-[#E50914] shadow-[4px_4px_0px_0px_#000000] disabled:opacity-50"
            >
              {submitting ? 'SENDING...' : `SEND ${type.toUpperCase()}`}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
