'use client';

import { useState } from 'react';
import Link from 'next/link';

import { navLinks } from '@/config/site';
import { AuthButton } from '@/components/features/auth-button';

// ── Icons (inline SVG, no deps) ──────────────────────────────────────────────

function MenuIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── Logo ──────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="font-display text-xl font-bold">
      <span className="text-[#1A1A2E]">Youth</span>
      <span className="text-primary">Atlas</span>
    </Link>
  );
}

// ── Desktop nav ───────────────────────────────────────────────────────────────

function DesktopNav() {
  return (
    <nav className="hidden items-center gap-6 md:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm text-text-secondary transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
      <AuthButton />
    </nav>
  );
}

// ── Mobile nav ────────────────────────────────────────────────────────────────

function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  return (
    <nav className="border-t border-slate-200 pb-4 pt-2 md:hidden">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClose}
          className="block px-4 py-3 text-sm text-text-secondary transition-colors hover:text-primary"
        >
          {link.label}
        </Link>
      ))}
      <div className="px-4 py-2">
        <AuthButton />
      </div>
    </nav>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <DesktopNav />
        <button
          type="button"
          className="md:hidden -mr-2 p-2"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
