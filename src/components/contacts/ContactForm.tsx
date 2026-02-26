'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, Loader2, ChevronDown } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const inputClass =
  'w-full px-4 py-3 rounded-lg border bg-white text-base text-charcoal outline-none transition-colors focus:border-olive focus:ring-1 focus:ring-olive/20';

export default function ContactForm() {
  const t = useTranslations('contacts.form');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [subjectOpen, setSubjectOpen] = useState(false);
  const subjectRef = useRef<HTMLDivElement>(null);

  const subjectOptions = [
    { value: 'general', label: t('subjects.general') },
    { value: 'custom', label: t('subjects.custom') },
    { value: 'other', label: t('subjects.other') },
  ];

  const selectedSubject = subjectOptions.find((o) => o.value === formData.subject);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (subjectRef.current && !subjectRef.current.contains(e.target as Node)) {
        setSubjectOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!formData.name.trim()) errs.name = t('required');
    if (!formData.email.trim()) errs.email = t('required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = t('invalidEmail');
    if (!formData.message.trim()) errs.message = t('required');
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  function reset() {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setStatus('idle');
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-12 px-6 animate-fadeIn">
        <CheckCircle className="w-14 h-14 text-olive mb-4" strokeWidth={1.5} />
        <h3 className="font-serif text-2xl text-charcoal mb-3">{t('success.title')}</h3>
        <p className="text-warm-gray mb-8 max-w-sm">{t('success.subtitle')}</p>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-olive hover:underline cursor-pointer"
        >
          {t('success.sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {t('name')} <span className="text-olive">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
          className={`${inputClass} ${errors.name ? 'border-red-400' : 'border-sand'}`}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {t('email')} <span className="text-olive">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
          className={`${inputClass} ${errors.email ? 'border-red-400' : 'border-sand'}`}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Subject — custom dropdown */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">{t('subject')}</label>
        <div ref={subjectRef} className="relative">
          <button
            type="button"
            onClick={() => setSubjectOpen((o) => !o)}
            className={`${inputClass} border-sand flex items-center justify-between cursor-pointer text-left`}
          >
            <span className={selectedSubject ? 'text-charcoal' : 'text-warm-gray'}>
              {selectedSubject ? selectedSubject.label : t('subjectPlaceholder')}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-warm-gray shrink-0 transition-transform duration-200 ${subjectOpen ? 'rotate-180' : ''}`}
              strokeWidth={1.5}
            />
          </button>

          {subjectOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-cream rounded-lg shadow-lg border border-sand/60 z-10 py-1">
              {subjectOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setFormData((d) => ({ ...d, subject: opt.value }));
                    setSubjectOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm cursor-pointer hover:bg-sand/30 transition-colors duration-100 ${
                    formData.subject === opt.value ? 'text-olive font-medium' : 'text-charcoal'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-1.5">
          {t('message')} <span className="text-olive">*</span>
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
          rows={5}
          className={`${inputClass} resize-none ${errors.message ? 'border-red-400' : 'border-sand'}`}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-3 bg-olive text-cream py-4 text-sm uppercase tracking-widest font-medium rounded cursor-pointer hover:bg-olive-dark transition-colors duration-200 disabled:opacity-60 disabled:cursor-default"
      >
        {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === 'loading' ? t('sending') : t('send')}
      </button>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">{t('error')}</p>
      )}
    </form>
  );
}
