'use client';

import { useState, useEffect } from 'react';
import TopBar from './TopBar';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import CartDrawer from './CartDrawer';
import type { MedusaCategory } from '@/lib/categories';

interface HeaderProps {
  categories: MedusaCategory[];
}

export default function Header({ categories }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div
        className={`transition-all duration-300 ${
          scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'
        }`}
      >
        <TopBar />
      </div>
      <header
        className={`sticky top-0 z-50 bg-cream/95 backdrop-blur-sm transition-shadow duration-300 ${
          scrolled ? 'shadow-md' : ''
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Navigation categories={categories} />
            <MobileMenu categories={categories} />
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
