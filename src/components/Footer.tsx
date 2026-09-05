import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Bot,
  Scale
} from 'lucide-react';
import { categories } from '../data/categories';

interface FooterProps {
  onNavigate: (path: string) => void;
  onSubscribeNewsletter?: (email: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSubscribeNewsletter }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    if (onSubscribeNewsletter) onSubscribeNewsletter(email);
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Top Newsletter Highlight Bar */}
      <div className="border-b border-slate-850 bg-slate-900/60 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-3 py-1 rounded-full mb-3">
              <Sparkles size={13} /> Weekly AI Tool Digest
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-tight">
              Stay ahead of the generative AI curve.
            </h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Get unbiased hands-on reviews, pricing updates, comparison matrices, and tutorials delivered straight to your inbox.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2.5 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 px-5 py-3.5 rounded-xl text-sm font-semibold">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                <span>You're subscribed! Check your inbox for our 2026 HadoolAI report.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-sm focus:outline-hidden focus:border-indigo-500 transition-colors"
                  id="footer-newsletter-email"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm cursor-pointer shrink-0"
                  id="footer-newsletter-submit"
                >
                  <span>Subscribe</span>
                  <Send size={14} />
                </button>
              </form>
            )}
            <p className="text-[11px] text-slate-400 mt-2 text-center lg:text-left">
              Zero spam. 100% independent evaluation. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white">
                <Sparkles size={16} />
              </div>
              <span className="font-heading font-extrabold text-xl text-white tracking-tight">
                HadoolAI
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your trusted, independent authority for discovering, comparing, and mastering generative artificial intelligence tools and software.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-slate-400">
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <ShieldCheck size={16} className="text-indigo-400 shrink-0" />
                <span>100% Independent Hands-On Benchmark Lab</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300">
                <Bot size={16} className="text-emerald-400 shrink-0" />
                <span>Powered by Gemini & Google Search Grounding</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onNavigate(`/category/${cat.id}`)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/categories')}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer text-left inline-flex items-center gap-1"
                >
                  <span>All Categories</span>
                  <ArrowRight size={12} />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Tools & Comparisons */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Featured Tools & Battles
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => onNavigate('/ai-tools/chatgpt')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  ChatGPT Review
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/ai-tools/claude')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Claude 3.7 Sonnet
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/ai-tools/gemini')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Google Gemini Review
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/ai-tools/runway')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Runway Gen-3 Alpha
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/ai-tools/kling')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Kling AI Video Review
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/ai-tools/elevenlabs')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  ElevenLabs Voice AI
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/ai-tools/notebooklm')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  NotebookLM Guide
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/comparisons/notebooklm-vs-chatgpt')} className="text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer">
                  NotebookLM vs ChatGPT
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/comparisons/chatgpt-vs-gemini')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  ChatGPT vs Gemini
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Editorial & Legal */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Editorial & Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button type="button" onClick={() => onNavigate('/chat')} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer flex items-center gap-1">
                  <Bot size={14} />
                  <span>AI Chat Assistant</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/about')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  About HadoolAI
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/how-we-review')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Review Methodology
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/blog')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Blog & Guides
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/contact')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Contact Us
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/disclaimer')} className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1">
                  <Scale size={13} className="text-slate-400" />
                  <span>Disclaimer & Disclosures</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/privacy-policy')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('/terms')} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* AdSense & Affiliate Notice */}
        <div className="mt-12 pt-8 border-t border-slate-900 text-xs text-slate-400 leading-relaxed space-y-2">
          <p>
            <strong>Editorial & Advertising Disclosure:</strong> HadoolAI evaluates software through hands-on testing. We may earn an affiliate commission when you purchase through links on our site at no additional cost to you. Advertisements served through Google AdSense comply with Google Publisher Policies and do not influence our editorial ratings.
          </p>
          <p>
            <strong>AI Assistant Guidance:</strong> The AI Chat assistant utilizes Google Gemini and Google Search grounding to retrieve current factual web information. AI outputs are for informational purposes only.
          </p>
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 mt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} HadoolAI. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => onNavigate('/disclaimer')} className="hover:text-slate-200">Disclaimer</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/privacy-policy')} className="hover:text-slate-200">Privacy Policy</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/terms')} className="hover:text-slate-200">Terms of Service</button>
            <span>•</span>
            <button type="button" onClick={() => onNavigate('/contact')} className="hover:text-slate-200">Contact</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
