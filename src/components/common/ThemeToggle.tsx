import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative flex items-center justify-center focus:outline-none"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <Sun className="w-5 h-5 transition-transform duration-300 hover:rotate-45 text-amber-400" />
      )}
    </button>
  );
};
