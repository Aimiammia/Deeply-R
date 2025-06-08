
'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  // Initialize theme state: 1. localStorage, 2. Default to 'dark'
  const [theme, setTheme] = useState<string>(() => {
    // This function runs only on the client, once, for initialization
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      return storedTheme || 'dark'; // Default to 'dark' if nothing in localStorage
    }
    return 'dark'; // Fallback for non-browser environments
  });

  useEffect(() => {
    setMounted(true);
  }, []); // Runs once on client to confirm mount

  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  if (!mounted) {
    // Render a placeholder to prevent layout shift and hydration issues
    return (
        <div className="w-10 h-10 flex items-center justify-center">
          {/* Placeholder for the button, same size */}
        </div>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="تغییر پوسته">
      {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
    </Button>
  );
}
