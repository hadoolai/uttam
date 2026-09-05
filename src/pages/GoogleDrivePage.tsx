import React, { useState, useEffect, useRef } from 'react';
import { 
  HardDrive, 
  FolderPlus, 
  Upload, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Trash2, 
  Folder, 
  FileText, 
  FileSpreadsheet, 
  Presentation, 
  File, 
  Image as ImageIcon, 
  Film, 
  Music, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Sparkles, 
  FileCode, 
  ArrowLeft, 
  LogOut, 
  ChevronRight, 
  Lock, 
  ShieldCheck, 
  Plus, 
  Bookmark, 
  Clock, 
  Info,
  X,
  FileCheck
} from 'lucide-react';
import { 
  googleSignIn, 
  logout, 
  subscribeAuth, 
  getAccessToken 
} from '../utils/googleAuth';
import { 
  listDriveFiles, 
  getDriveAbout, 
  createDriveFolder, 
  uploadFileToDrive, 
  saveTextDocumentToDrive, 
  deleteDriveFile, 
  trashDriveFile,
  formatBytes, 
  getMimeTypeDetails,
  DriveFile, 
  DriveAboutInfo 
} from '../utils/googleDriveService';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { toolsData } from '../data/tools';
import { User } from 'firebase/auth';

interface GoogleDrivePageProps {
  onNavigate: (path: string) => void;
  onToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

interface BreadcrumbFolder {
  id: string;
  name: string;
}

export const GoogleDrivePage: React.FC<GoogleDrivePageProps> = ({ onNavigate, onToast }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [driveInfo, setDriveInfo] = useState<DriveAboutInfo | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'folders' | 'docs' | 'sheets' | 'slides' | 'pdf' | 'media'>('all');
  
  // Folder navigation state
  const [folderHistory, setFolderHistory] = useState<BreadcrumbFolder[]>([
    { id: 'root', name: 'My Drive' }
  ]);

  // Modal states
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isExportReportOpen, setIsExportReportOpen] = useState(false);
  const [exportTitle, setExportTitle] = useState('HadoolAI - Top AI Tools Stack & Research');
  const [isExporting, setIsExporting] = useState(false);

  // Destructive action confirmation modal (MANDATORY per Workspace Skill)
  const [deleteTarget, setDeleteTarget] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentFolder = folderHistory[folderHistory.length - 1];

  // Auth subscription
  useEffect(() => {
    const unsubscribe = subscribeAuth((currentUser, currentToken) => {
      setUser(currentUser);
      setAccessToken(currentToken);
      if (currentToken) {
        loadDriveData(currentToken, currentFolder.id);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch drive files & about info
  const loadDriveData = async (token: string, folderId: string, query = searchQuery, category = selectedCategory) => {
    setIsLoadingFiles(true);
    try {
      // Parallel fetch about and files
      const [aboutData, filesResult] = await Promise.all([
        getDriveAbout(token).catch(err => {
          console.warn('Could not fetch drive about info:', err);
          return null;
        }),
        listDriveFiles(token, {
          folderId: query ? undefined : folderId,
          query: query.trim(),
          mimeTypeCategory: category,
          pageSize: 50,
        })
      ]);

      if (aboutData) setDriveInfo(aboutData);
      setFiles(filesResult.files || []);
    } catch (err: any) {
      console.error('Error loading Google Drive data:', err);
      onToast(err.message || 'Failed to load files from Google Drive.', 'error');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // Trigger search/filter reload
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessToken) {
      loadDriveData(accessToken, currentFolder.id, searchQuery, selectedCategory);
    }
  };

  const handleCategoryChange = (category: typeof selectedCategory) => {
    setSelectedCategory(category);
    if (accessToken) {
      loadDriveData(accessToken, currentFolder.id, searchQuery, category);
    }
  };

  // Sign In handler
  const handleGoogleSignIn = async () => {
    setIsAuthenticating(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setAccessToken(result.accessToken);
        onToast(`Connected to Google Drive as ${result.user.email}`, 'success');
        loadDriveData(result.accessToken, 'root');
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      onToast(err.message || 'Google Drive authentication was cancelled or failed.', 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Sign Out handler
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setFiles([]);
      setDriveInfo(null);
      setFolderHistory([{ id: 'root', name: 'My Drive' }]);
      onToast('Signed out of Google Drive.', 'info');
    } catch (err: any) {
      onToast('Failed to sign out properly.', 'error');
    }
  };

  // Folder navigation
  const navigateToFolder = (folder: DriveFile) => {
    const nextHistory = [...folderHistory, { id: folder.id, name: folder.name }];
    setFolderHistory(nextHistory);
    setSearchQuery('');
    if (accessToken) {
      loadDriveData(accessToken, folder.id, '', selectedCategory);
    }
  };

  const navigateBreadcrumb = (index: number) => {
    const nextHistory = folderHistory.slice(0, index + 1);
    setFolderHistory(nextHistory);
    setSearchQuery('');
    const targetFolder = nextHistory[nextHistory.length - 1];
    if (accessToken) {
      loadDriveData(accessToken, targetFolder.id, '', selectedCategory);
    }
  };

  // Create folder action
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      const newFolder = await createDriveFolder(accessToken, newFolderName, currentFolder.id);
      onToast(`Folder "${newFolder.name}" created in Google Drive!`, 'success');
      setIsNewFolderOpen(false);
      setNewFolderName('');
      loadDriveData(accessToken, currentFolder.id);
    } catch (err: any) {
      onToast(err.message || 'Failed to create folder.', 'error');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Upload file action
  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedUploadFile) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadFileToDrive(accessToken, selectedUploadFile, currentFolder.id);
      onToast(`Uploaded "${uploaded.name}" to Google Drive successfully!`, 'success');
      setIsUploadOpen(false);
      setSelectedUploadFile(null);
      loadDriveData(accessToken, currentFolder.id);
    } catch (err: any) {
      onToast(err.message || 'Failed to upload file.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  // Export AI research document into Google Drive
  const handleExportAIReport = async () => {
    if (!accessToken) return;
    setIsExporting(true);
    try {
      // Build high-value Markdown report
      const featuredTools = toolsData.slice(0, 10);
      const markdownContent = `# ${exportTitle}
*Generated via HadoolAI Workspace on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

## Overview
This document contains an editorial breakdown and evaluation of verified AI tools across Generative Video, LLMs, Writing, Image Generation, and Developer Tooling.

---

## Top Evaluated AI Tools Summary

${featuredTools.map((t, i) => `### ${i + 1}. ${t.name} (${t.categoryName})
- **Rating:** ⭐ ${t.rating.overall}/5.0 (${t.reviewCount} verified reviews)
- **Pricing:** ${t.pricingType} (Starting from ${t.startingPrice})
- **Tagline:** ${t.tagline}
- **Website:** ${t.websiteUrl}

**Key Strengths:**
${t.pros.slice(0, 3).map(p => `- ${p}`).join('\n')}

**Best For:**
${t.bestFor.map(b => `- ${b}`).join('\n')}

**Editorial Verdict:**
> ${t.finalVerdict.summary}
`).join('\n---\n\n')}

---

*Document compiled by HadoolAI — Independent AI Tool Research & Benchmarks (https://hadoolai.co.in)*
`;

      const doc = await saveTextDocumentToDrive(
        accessToken,
        exportTitle,
        markdownContent,
        'text/markdown',
        currentFolder.id
      );

      onToast(`Exported "${doc.name}" directly to your Google Drive!`, 'success');
      setIsExportReportOpen(false);
      loadDriveData(accessToken, currentFolder.id);
    } catch (err: any) {
      onToast(err.message || 'Failed to export document to Google Drive.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Confirm destructive delete operation
  const handleConfirmDelete = async () => {
    if (!accessToken || !deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(accessToken, deleteTarget.id);
      onToast(`Deleted "${deleteTarget.name}" from Google Drive.`, 'info');
      setDeleteTarget(null);
      loadDriveData(accessToken, currentFolder.id);
    } catch (err: any) {
      onToast(err.message || 'Failed to delete file.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate storage percentage
  const usageBytes = parseInt(driveInfo?.storageQuota?.usage || '0', 10);
  const limitBytes = parseInt(driveInfo?.storageQuota?.limit || '0', 10);
  const storagePercentage = limitBytes > 0 ? Math.min(100, Math.round((usageBytes / limitBytes) * 100)) : 0;

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Google Drive', path: '/drive' }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <SeoHead
        title="Google Drive Workspace Hub | HadoolAI"
        description="Connect your Google Drive to browse, organize, upload, and export AI tool research, bookmarks, and software reviews directly to your Google Workspace."
        canonicalUrl="https://hadoolai.co.in/drive"
      />

      {/* Header Container */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
          
          <div className="mt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-emerald-500 to-blue-500 p-0.5 shadow-sm shadow-emerald-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <HardDrive className="text-blue-600" size={24} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Google Drive Workspace
                  </h1>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} /> Google API Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Browse files, manage folders, and export AI tool benchmarks directly to your Google Workspace.
                </p>
              </div>
            </div>

            {/* Auth status & actions */}
            {accessToken && user ? (
              <div className="flex items-center gap-2 sm:gap-3 bg-slate-50 border border-slate-200 p-1.5 sm:p-2 rounded-xl">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || 'Google User'} 
                    className="w-8 h-8 rounded-full ring-2 ring-emerald-500/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <div className="text-left pr-2">
                  <p className="text-xs font-semibold text-slate-900 truncate max-w-[140px] sm:max-w-[200px]">
                    {user.displayName || user.email}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                    {user.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                  title="Disconnect Google Drive"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* If Not Authenticated: Beautiful Hero & Official Google Sign-In */}
        {!accessToken || !user ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 mx-auto flex items-center justify-center text-blue-600 mb-5 shadow-inner">
              <HardDrive size={32} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Connect Google Drive to HadoolAI
            </h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Seamlessly link your Google Workspace account with permission to store AI tool notes, export comparison spreadsheets, upload files, and manage your research docs.
            </p>

            {/* Official Google Sign-In Button */}
            <div className="mt-8 flex flex-col items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isAuthenticating}
                className="cursor-pointer group relative inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs hover:shadow-md transition-all text-sm font-semibold text-slate-800 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-hidden ring-offset-2 focus:ring-2 focus:ring-blue-500"
                id="google-drive-signin-btn"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="animate-spin text-blue-600" size={18} />
                    <span>Connecting to Google Drive...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    </svg>
                    <span>Sign in with Google</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                <Lock size={13} className="text-emerald-600" />
                <span>Secure in-memory token authentication • Zero third-party data sharing</span>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-100 text-left">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2.5">
                  <FileCheck size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Export AI Research</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  One-click export tool comparisons, specs, and bookmarked stacks directly to your Google Drive.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
                  <FolderPlus size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Folder & File Explorer</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Browse your Google Docs, Sheets, PDFs, and folders with instant preview links.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2.5">
                  <Upload size={18} />
                </div>
                <h4 className="text-sm font-bold text-slate-900">Upload & Backup</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Upload AI prompts, assets, and project files directly into your personal cloud storage.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-6">
            {/* Storage Quota Card */}
            {driveInfo && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Google Drive Storage
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {formatBytes(usageBytes)} used of {formatBytes(limitBytes)} ({storagePercentage}%)
                    </p>
                  </div>
                  <div className="w-full sm:w-64">
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          storagePercentage > 90 
                            ? 'bg-red-500' 
                            : storagePercentage > 75 
                            ? 'bg-amber-500' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}
                        style={{ width: `${Math.max(3, storagePercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Bar & Controls */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
              {/* Top toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Breadcrumbs for Drive folder traversal */}
                <div className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-semibold text-slate-700">
                  {folderHistory.map((folder, index) => {
                    const isLast = index === folderHistory.length - 1;
                    return (
                      <React.Fragment key={folder.id}>
                        {index > 0 && <ChevronRight size={14} className="text-slate-400" />}
                        <button
                          type="button"
                          onClick={() => navigateBreadcrumb(index)}
                          className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                            isLast
                              ? 'text-indigo-600 bg-indigo-50/80 font-bold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          {index === 0 ? '📁 My Drive' : folder.name}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExportReportOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer"
                  >
                    <Sparkles size={15} /> Export AI Stack to Drive
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <Upload size={15} /> Upload File
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsNewFolderOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <FolderPlus size={15} /> New Folder
                  </button>

                  <button
                    type="button"
                    onClick={() => accessToken && loadDriveData(accessToken, currentFolder.id)}
                    disabled={isLoadingFiles}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                    title="Refresh Files"
                  >
                    <RefreshCw size={16} className={isLoadingFiles ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files and documents in Drive..."
                    className="w-full pl-9.5 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </form>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {[
                    { key: 'all', label: 'All Files' },
                    { key: 'folders', label: 'Folders' },
                    { key: 'docs', label: 'Docs' },
                    { key: 'sheets', label: 'Sheets' },
                    { key: 'slides', label: 'Slides' },
                    { key: 'pdf', label: 'PDFs' },
                    { key: 'media', label: 'Media' },
                  ].map((cat) => (
                    <button
                      key={cat.key}
                      type="button"
                      onClick={() => handleCategoryChange(cat.key as any)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedCategory === cat.key
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Files List Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden">
              {isLoadingFiles ? (
                <div className="py-20 text-center">
                  <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">Reading Google Drive files...</p>
                  <p className="text-xs text-slate-500 mt-1">Retrieving latest folders and documents securely</p>
                </div>
              ) : files.length === 0 ? (
                <div className="py-16 text-center px-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Folder size={24} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No files found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {searchQuery ? `No files matching "${searchQuery}".` : 'This folder is currently empty. Upload files or export your AI tools stack.'}
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUploadOpen(true)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer"
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsExportReportOpen(true)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Export AI Stack
                    </button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-3 px-4 sm:px-6">Name</th>
                        <th className="py-3 px-4 hidden md:table-cell">Type</th>
                        <th className="py-3 px-4 hidden sm:table-cell">Size</th>
                        <th className="py-3 px-4 hidden lg:table-cell">Last Modified</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                      {files.map((file) => {
                        const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                        const mimeDetails = getMimeTypeDetails(file.mimeType);

                        return (
                          <tr 
                            key={file.id} 
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            {/* File / Folder Name */}
                            <td className="py-3 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                {isFolder ? (
                                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                                    <Folder size={18} className="fill-amber-500/20" />
                                  </div>
                                ) : mimeDetails.category === 'doc' ? (
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <FileText size={18} />
                                  </div>
                                ) : mimeDetails.category === 'sheet' ? (
                                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <FileSpreadsheet size={18} />
                                  </div>
                                ) : mimeDetails.category === 'slides' ? (
                                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                    <Presentation size={18} />
                                  </div>
                                ) : mimeDetails.category === 'pdf' ? (
                                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                    <File size={18} />
                                  </div>
                                ) : mimeDetails.category === 'image' ? (
                                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                    <ImageIcon size={18} />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                    <FileCode size={18} />
                                  </div>
                                )}

                                <div className="min-w-0">
                                  {isFolder ? (
                                    <button
                                      type="button"
                                      onClick={() => navigateToFolder(file)}
                                      className="font-bold text-slate-900 hover:text-indigo-600 text-left truncate block cursor-pointer"
                                    >
                                      {file.name}
                                    </button>
                                  ) : (
                                    <a
                                      href={file.webViewLink || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold text-slate-900 hover:text-blue-600 truncate block"
                                    >
                                      {file.name}
                                    </a>
                                  )}
                                  {file.description && (
                                    <p className="text-[11px] text-slate-500 truncate max-w-xs">{file.description}</p>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Type */}
                            <td className="py-3 px-4 hidden md:table-cell">
                              <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold border ${mimeDetails.color}`}>
                                {mimeDetails.label}
                              </span>
                            </td>

                            {/* Size */}
                            <td className="py-3 px-4 text-slate-600 text-xs hidden sm:table-cell">
                              {isFolder ? '—' : formatBytes(file.size)}
                            </td>

                            {/* Modified Time */}
                            <td className="py-3 px-4 text-slate-500 text-xs hidden lg:table-cell">
                              {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }) : '—'}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {file.webViewLink && (
                                  <a
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Open in Google Drive"
                                  >
                                    <ExternalLink size={15} />
                                  </a>
                                )}
                                
                                {file.webContentLink && (
                                  <a
                                    href={file.webContentLink}
                                    download
                                    className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                    title="Direct Download"
                                  >
                                    <Download size={15} />
                                  </a>
                                )}

                                {/* Delete with explicit modal */}
                                <button
                                  type="button"
                                  onClick={() => setDeleteTarget(file)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete file"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: New Folder */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderPlus className="text-indigo-600" size={18} /> New Google Drive Folder
              </h3>
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateFolder}>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Folder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g. AI Video Research 2026"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
                <p className="text-xs text-slate-500">
                  Folder will be created in <strong>{currentFolder.name}</strong>.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder || !newFolderName.trim()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload File */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Upload className="text-indigo-600" size={18} /> Upload to Google Drive
              </h3>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadFile}>
              <div className="space-y-4">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/30"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-800">
                    {selectedUploadFile ? selectedUploadFile.name : 'Click or drop files here to upload'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {selectedUploadFile ? `${formatBytes(selectedUploadFile.size)} • ${selectedUploadFile.type || 'Custom file'}` : 'Supports Docs, PDFs, Markdown, Images, Audio, Video'}
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedUploadFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>

                <p className="text-xs text-slate-500">
                  Target directory: <strong>{currentFolder.name}</strong>
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !selectedUploadFile}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {isUploading && <RefreshCw size={14} className="animate-spin" />}
                  {isUploading ? 'Uploading...' : 'Upload to Drive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Export AI Research Stack */}
      {isExportReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={18} /> Export AI Research to Google Drive
              </h3>
              <button
                type="button"
                onClick={() => setIsExportReportOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={exportTitle}
                  onChange={(e) => setExportTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 space-y-1.5">
                <p className="font-semibold text-slate-800">What will be generated:</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600">
                  <li>Structured Markdown research dossier of verified AI tools.</li>
                  <li>Editorial ratings, pros/cons, starting prices, and official URLs.</li>
                  <li>Formatted for easy viewing and editing in Google Drive / Docs.</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsExportReportOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExportAIReport}
                disabled={isExporting || !exportTitle.trim()}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              >
                {isExporting && <RefreshCw size={14} className="animate-spin" />}
                {isExporting ? 'Exporting...' : 'Save to Google Drive'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY Explicit Confirmation Dialog for Destructive Operations */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-100">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mb-4">
              <Trash2 size={24} />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Delete item from Google Drive?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900 font-semibold">"{deleteTarget.name}"</strong>? 
              This action will remove the file from your Google Drive and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5 shadow-sm shadow-red-600/20"
              >
                {isDeleting && <RefreshCw size={14} className="animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
