import React, { useState } from 'react';
import { toolsData } from '../data/tools';
import { ToolCard } from '../components/ToolCard';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Bookmark, Sparkles, ArrowRight, HardDrive, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getAccessToken, googleSignIn } from '../utils/googleAuth';
import { saveTextDocumentToDrive } from '../utils/googleDriveService';

interface BookmarksPageProps {
  bookmarkedIds: string[];
  onToggleBookmark: (toolId: string) => void;
  onNavigate: (path: string) => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({
  bookmarkedIds,
  onToggleBookmark,
  onNavigate
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const bookmarkedTools = toolsData.filter(t => bookmarkedIds.includes(t.id));

  const handleExportToDrive = async () => {
    try {
      setIsExporting(true);
      let token = await getAccessToken();
      if (!token) {
        const result = await googleSignIn();
        token = result?.accessToken || null;
      }

      if (!token) {
        onNavigate('/drive');
        return;
      }

      const content = `# My AI Tools Stack & Shortlist
*Exported from HadoolAI on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*

Total Saved Tools: ${bookmarkedTools.length}

${bookmarkedTools.map((tool, idx) => `## ${idx + 1}. ${tool.name} (${tool.categoryName})
- **Overall Rating:** ⭐ ${tool.rating.overall}/5.0
- **Pricing:** ${tool.pricingType} (${tool.startingPrice})
- **Website:** ${tool.websiteUrl}
- **Summary:** ${tool.tagline}

### Key Pros:
${tool.pros.map(p => `- ${p}`).join('\n')}

### Best For:
${tool.bestFor.map(b => `- ${b}`).join('\n')}
`).join('\n---\n\n')}

---
*Created with HadoolAI (https://hadoolai.co.in)*
`;

      await saveTextDocumentToDrive(token, `HadoolAI_Saved_Tools_${new Date().toISOString().slice(0, 10)}`, content, 'text/markdown');
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err: any) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="Saved AI Tools & Shortlist | HadoolAI"
        description="Your personal shortlist of bookmarked AI tools, comparisons, and software reviews on HadoolAI."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'Saved Bookmarks' }]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
              <Bookmark size={13} className="fill-amber-600" />
              <span>Personal Shortlist ({bookmarkedTools.length})</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight">
              Your Bookmarked AI Tools
            </h1>
            <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
              Quickly access your saved software to compare features and review pricing when ready to subscribe.
            </p>
          </div>

          {bookmarkedTools.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportToDrive}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-60"
              >
                {isExporting ? (
                  <RefreshCw size={14} className="animate-spin text-blue-600" />
                ) : exportSuccess ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <HardDrive size={14} className="text-blue-600" />
                )}
                <span>{exportSuccess ? 'Saved to Google Drive!' : 'Export Shortlist to Drive'}</span>
              </button>
            </div>
          )}
        </div>

        {bookmarkedTools.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs max-w-xl mx-auto my-12">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Bookmark size={24} />
            </div>
            <h3 className="font-heading font-bold text-xl text-slate-900">No Saved Tools Yet</h3>
            <p className="text-slate-500 text-sm mt-2">
              Browse our directory and click the bookmark icon on any tool card or review page to add it to your shortlist.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/ai-tools')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              <span>Explore AI Tools Directory</span>
              <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {bookmarkedTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onSelect={(slug) => onNavigate(`/reviews/${slug}`)}
                isBookmarked={true}
                onToggleBookmark={onToggleBookmark}
                layout="grid"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
