'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

const TAG_KEYS = ['scarves', 'tablecloths', 'dresses', 'accessories'] as const;

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const t = useTranslations('search');
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;

  const overlay = (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-250 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Desktop panel */}
      <div
        className={`fixed inset-x-0 top-0 z-[70] hidden md:flex items-start justify-center pt-24 transition-all duration-250 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-5 pointer-events-none'
        }`}
      >
        <div
          className="w-full max-w-2xl mx-4 bg-cream rounded-lg shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8">
            {/* Input */}
            <div className="flex items-center gap-3 border-b-2 border-olive/30 focus-within:border-olive transition-colors pb-3">
              <Search className="h-5 w-5 text-warm-gray flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('placeholder')}
                className="flex-1 bg-transparent text-xl md:text-2xl text-charcoal placeholder:text-warm-gray/60 outline-none font-light"
              />
              <button
                onClick={onClose}
                className="cursor-pointer text-warm-gray hover:text-charcoal transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content below input */}
            <div className="mt-6">
              {query.length > 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-warm-gray">
                  <Sparkles className="h-5 w-5" />
                  <p className="text-sm">{t('comingSoon')}</p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-warm-gray mb-3">
                    {t('popularSearches')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TAG_KEYS.map((key) => (
                      <button
                        key={key}
                        className="cursor-pointer px-4 py-2 bg-sand/60 text-charcoal text-sm rounded-full hover:bg-sand transition-colors"
                      >
                        {t(`tags.${key}`)}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile full-screen */}
      <div
        className={`fixed inset-0 z-[70] md:hidden bg-cream flex flex-col transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="px-4 pt-5 pb-4 border-b border-sand/50">
          <div className="flex items-center gap-3 border-b-2 border-olive/30 focus-within:border-olive transition-colors pb-3">
            <Search className="h-5 w-5 text-warm-gray flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('placeholder')}
              ref={isOpen ? inputRef : undefined}
              className="flex-1 bg-transparent text-xl text-charcoal placeholder:text-warm-gray/60 outline-none font-light"
            />
            <button
              onClick={onClose}
              className="cursor-pointer text-warm-gray hover:text-charcoal transition-colors p-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 px-4 pt-6">
          {query.length > 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-warm-gray">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm">{t('comingSoon')}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-warm-gray mb-3">
                {t('popularSearches')}
              </p>
              <div className="flex flex-wrap gap-2">
                {TAG_KEYS.map((key) => (
                  <button
                    key={key}
                    className="cursor-pointer px-4 py-2 bg-sand/60 text-charcoal text-sm rounded-full hover:bg-sand transition-colors"
                  >
                    {t(`tags.${key}`)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );

  return createPortal(overlay, document.body);
}
