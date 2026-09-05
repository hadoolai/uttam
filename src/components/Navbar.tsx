import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Menu, 
  X, 
  Bookmark, 
  Sparkles, 
  HardDrive,
  Sun,
  Moon,
  Bot
} from 'lucide-react';
import { useTheme } from '../utils/ThemeContext';
import { subscribeAuth } from '../utils/googleAuth';
import { User } from 'firebase/auth';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
  bookmarksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenSearch,
  bookmarksCount
}) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeAuth((user) => {
      setGoogleUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'AI Tools', path: '/ai-tools' },
    { label: 'Comparisons', path: '/comparisons' },
    { label: 'Categories', path: '/categories' },
    { label: 'Blog', path: '/blog' },
    { label: 'AI Chat', path: '/chat', isHighlight: true },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800' 
          : 'bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800'
      }`}
    >
      {/* Micro announcement / trust bar */}
      <div className="bg-slate-900 dark:bg-slate-900 text-slate-300 text-[11px] font-medium py-1 px-4 text-center hidden md:block border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5 mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Independent AI Benchmark Lab • Live Google Search Grounded AI Chatbot & 250+ Software Reviews
          </span>
          <span className="text-slate-400">Updated February 2026</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav('/')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
              id="brand-logo-btn"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles size={18} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  HadoolAI
                </span>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">
                  AI TOOLS • REVIEWS • GUIDES
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNav(link.path)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold'
                      : link.isHighlight
                      ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/60 border border-indigo-200/60 dark:border-indigo-800/60 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-900'
                  }`}
                  id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.isHighlight && <Sparkles size={14} className="text-indigo-600 dark:text-indigo-400" />}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Quick Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-200/80 dark:border-slate-800 cursor-pointer shadow-2xs"
              aria-label="Search AI tools"
              id="navbar-search-btn"
            >
              <Search size={16} className="text-slate-400" />
              <span className="hidden sm:inline">Search AI tools...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              title={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              aria-label="Toggle theme"
              id="navbar-theme-toggle-btn"
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-600" />
              )}
            </button>

            {/* Saved Bookmarks Icon */}
            <button
              type="button"
              onClick={() => handleNav('/bookmarks')}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
              title="Saved AI Tools"
              aria-label="Saved AI Tools"
              id="navbar-bookmarks-btn"
            >
              <Bookmark size={18} className={bookmarksCount > 0 ? 'fill-indigo-600 text-indigo-600' : ''} />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-950">
                  {bookmarksCount}
                </span>
              )}
            </button>

            {/* Prominent AI Chat CTA Button */}
            <button
              type="button"
              onClick={() => handleNav('/chat')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all cursor-pointer"
              id="navbar-ai-chat-cta"
            >
              <Bot size={15} />
              <span>AI Chat</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                onOpenSearch();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 p-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 rounded-xl cursor-pointer"
            >
              <Search size={15} /> Search Directory
            </button>
            <button
              type="button"
              onClick={() => handleNav('/bookmarks')}
              className="flex items-center justify-center gap-2 p-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 rounded-xl cursor-pointer"
            >
              <Bookmark size={15} /> Saved ({bookmarksCount})
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNav(link.path)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 font-bold'
                      : link.isHighlight
                      ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/40 dark:bg-indigo-950/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.isHighlight && <Sparkles size={14} className="text-indigo-500" />}
                    {link.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <button type="button" onClick={() => handleNav('/about')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">About</button>
            <button type="button" onClick={() => handleNav('/contact')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Contact</button>
            <button type="button" onClick={() => handleNav('/disclaimer')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Disclaimer</button>
            <button type="button" onClick={() => handleNav('/privacy-policy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Privacy</button>
            <button type="button" onClick={() => handleNav('/terms')} className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Terms</button>
          </div>
        </div>
      )}
    </header>
  );
};
