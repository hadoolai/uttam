import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { HomePage } from './pages/HomePage';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { CategoryPage } from './pages/CategoryPage';
import { ToolReviewPage } from './pages/ToolReviewPage';
import { ComparisonsPage } from './pages/ComparisonsPage';
import { ComparisonDetailPage } from './pages/ComparisonDetailPage';
import { ReviewsIndexPage } from './pages/ReviewsIndexPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';
import { BookmarksPage } from './pages/BookmarksPage';
import { ReviewMethodologyPage } from './pages/ReviewMethodologyPage';
import { EditorialPolicyPage } from './pages/EditorialPolicyPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { GoogleDrivePage } from './pages/GoogleDrivePage';
import { ChatPage } from './pages/ChatPage';
import { Chatbot } from './components/Chatbot/Chatbot';

import { toolsData, getToolBySlug } from './data/tools';
import { categories, getCategoryById } from './data/categories';
import { comparisonsData, getComparisonBySlug } from './data/comparisons';
import { articlesData, getArticleBySlug } from './data/articles';
import { trackPageView } from './utils/analytics';

export default function App() {
  // Navigation State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookmarks in LocalStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ai_tool_guide_bookmarks');
      return saved ? JSON.parse(saved) : ['chatgpt', 'runway', 'elevenlabs'];
    } catch {
      return ['chatgpt', 'runway', 'elevenlabs'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ai_tool_guide_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  const toggleBookmark = (toolId: string) => {
    setBookmarkedIds(prev => {
      const exists = prev.includes(toolId);
      const updated = exists ? prev.filter(id => id !== toolId) : [...prev, toolId];
      showToast(exists ? 'Removed from saved shortlist' : 'Saved to your shortlist!');
      return updated;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Synchronize Browser History
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Track Client-Side Page Views in GA4
  useEffect(() => {
    // Slight delay so SeoHead has updated document.title
    const timeoutId = setTimeout(() => {
      trackPageView(currentPath, document.title);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPath]);

  const navigate = (path: string) => {
    if (path === currentPath) return;
    try {
      window.history.pushState({}, '', path);
    } catch {
      // In restricted iframe environments fallback
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse path & params
  const cleanPath = currentPath.split('?')[0];
  const queryString = currentPath.includes('?') ? currentPath.split('?')[1] : '';
  const searchParams = new URLSearchParams(queryString);
  const queryCategory = searchParams.get('category') || undefined;
  const searchQueryParam = searchParams.get('q') || undefined;

  // Resolve Active View
  const renderCurrentPage = () => {
    // 1. Home
    if (cleanPath === '/' || cleanPath === '') {
      return (
        <HomePage
          onNavigate={navigate}
          onOpenSearch={() => setIsSearchOpen(true)}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />
      );
    }

    // 2. Directory
    if (cleanPath === '/ai-tools' || cleanPath === '/tools' || cleanPath === '/directory') {
      return (
        <ToolsDirectoryPage
          initialCategory={queryCategory || 'all'}
          initialQuery={searchQueryParam || ''}
          onNavigate={navigate}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />
      );
    }

    // 3. Category Hub Pages (/ai-*-tools or /category/*)
    if (
      cleanPath === '/ai-video-tools' ||
      cleanPath === '/ai-writing-tools' ||
      cleanPath === '/ai-image-tools' ||
      cleanPath === '/ai-productivity-tools' ||
      cleanPath === '/ai-audio-tools' ||
      cleanPath === '/ai-voice-tools' ||
      cleanPath === '/ai-coding-tools' ||
      cleanPath === '/ai-research-tools' ||
      cleanPath.startsWith('/category/')
    ) {
      let categoryId = 'video';
      if (cleanPath === '/ai-writing-tools' || cleanPath === '/category/writing') categoryId = 'writing';
      else if (cleanPath === '/ai-image-tools' || cleanPath === '/category/image') categoryId = 'image';
      else if (cleanPath === '/ai-productivity-tools' || cleanPath === '/category/productivity') categoryId = 'productivity';
      else if (cleanPath === '/ai-audio-tools' || cleanPath === '/ai-voice-tools' || cleanPath === '/category/audio' || cleanPath === '/category/voice') categoryId = 'audio';
      else if (cleanPath === '/ai-coding-tools' || cleanPath === '/category/coding') categoryId = 'coding';
      else if (cleanPath === '/ai-research-tools' || cleanPath === '/category/research') categoryId = 'research';
      else if (cleanPath.startsWith('/category/')) {
        categoryId = cleanPath.replace('/category/', '');
      }

      const cat = getCategoryById(categoryId) || getCategoryById('video')!;
      return (
        <CategoryPage
          category={cat}
          onNavigate={navigate}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />
      );
    }

    // 4. Categories Overview Page
    if (cleanPath === '/categories') {
      return <CategoriesPage onNavigate={navigate} />;
    }

    // 5. Reviews & Tools Index
    if (cleanPath === '/reviews') {
      return (
        <ReviewsIndexPage
          onNavigate={navigate}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />
      );
    }

    // 6. Review / Tool Single Page (e.g. /ai-tools/chatgpt, /reviews/runway, /tools/claude)
    if (
      cleanPath.startsWith('/reviews/') ||
      cleanPath.startsWith('/ai-tools/') ||
      cleanPath.startsWith('/tools/')
    ) {
      const slug = cleanPath.replace(/^\/(reviews|ai-tools|tools)\//, '');
      const tool = getToolBySlug(slug);
      if (tool) {
        return (
          <ToolReviewPage
            tool={tool}
            onNavigate={navigate}
            isBookmarked={bookmarkedIds.includes(tool.id)}
            onToggleBookmark={toggleBookmark}
            onToast={showToast}
          />
        );
      }
      const article = getArticleBySlug(slug);
      if (article) {
        return <ArticleDetailPage article={article} onNavigate={navigate} onToast={showToast} />;
      }
    }

    // 7. Comparisons Index
    if (cleanPath === '/comparisons' || cleanPath === '/compare') {
      return <ComparisonsPage onNavigate={navigate} />;
    }

    // 8. Comparison Detail Single Page
    if (cleanPath.startsWith('/comparisons/') || cleanPath.startsWith('/compare/')) {
      const slug = cleanPath.replace(/^\/(comparisons|compare)\//, '');
      const comparison = getComparisonBySlug(slug);
      if (comparison) {
        return <ComparisonDetailPage comparison={comparison} onNavigate={navigate} />;
      }
      const article = getArticleBySlug(slug);
      if (article) {
        return <ArticleDetailPage article={article} onNavigate={navigate} onToast={showToast} />;
      }
    }

    // 9. Articles & Blog Index
    if (cleanPath === '/articles' || cleanPath === '/guides' || cleanPath === '/blog') {
      return <ArticlesPage onNavigate={navigate} />;
    }

    // 10. Article / Guide Detail Single Page
    if (cleanPath.startsWith('/articles/') || cleanPath.startsWith('/guides/') || cleanPath.startsWith('/blog/')) {
      const slug = cleanPath.replace(/^\/(articles|guides|blog)\//, '');
      const article = getArticleBySlug(slug);
      if (article) {
        return <ArticleDetailPage article={article} onNavigate={navigate} onToast={showToast} />;
      }
    }

    // 11. Secondary & Trust Pages
    if (cleanPath === '/how-we-review' || cleanPath === '/review-methodology' || cleanPath === '/methodology') {
      return <ReviewMethodologyPage onNavigate={navigate} />;
    }
    if (cleanPath === '/editorial-policy' || cleanPath === '/editorial') {
      return <EditorialPolicyPage onNavigate={navigate} />;
    }
    if (cleanPath === '/disclaimer' || cleanPath === '/disclosures') {
      return <DisclaimerPage onNavigate={navigate} />;
    }
    if (cleanPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }
    if (cleanPath === '/contact') {
      return <ContactPage onNavigate={navigate} onToast={showToast} />;
    }
    if (cleanPath === '/privacy' || cleanPath === '/privacy-policy') {
      return <PrivacyPage onNavigate={navigate} />;
    }
    if (cleanPath === '/terms' || cleanPath === '/terms-of-service') {
      return <TermsPage onNavigate={navigate} />;
    }
    if (cleanPath === '/drive' || cleanPath === '/google-drive') {
      return <GoogleDrivePage onNavigate={navigate} onToast={showToast} />;
    }
    if (cleanPath === '/chat' || cleanPath === '/assistant' || cleanPath === '/ai-assistant') {
      return <ChatPage onNavigate={navigate} />;
    }
    if (cleanPath === '/bookmarks') {
      return (
        <BookmarksPage
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
          onNavigate={navigate}
        />
      );
    }

    // 12. Direct root article slug resolution (e.g., /online-free-earning-without-investment)
    const directArticle = getArticleBySlug(cleanPath.replace(/^\//, ''));
    if (directArticle) {
      return <ArticleDetailPage article={directArticle} onNavigate={navigate} onToast={showToast} />;
    }

    // Fallback: Default to Home
    return (
      <HomePage
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={toggleBookmark}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* Global Navigation Header */}
      <Navbar
        currentPath={cleanPath}
        onNavigate={navigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        bookmarksCount={bookmarkedIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={navigate} />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={navigate}
      />

      {/* Floating AI Assistant Chatbot */}
      <Chatbot onNavigate={navigate} currentPath={cleanPath} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
