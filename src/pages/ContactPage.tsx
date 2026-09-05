import React, { useState } from 'react';
import { SeoHead } from '../components/SeoHead';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { SITE_URL } from '../utils/constants';

interface ContactPageProps {
  onNavigate: (path: string) => void;
  onToast: (msg: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('tool-submission');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    onToast('Message sent! Our editorial team will get back to you within 24 hours.');
  };

  const contactSchemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact HadoolAI | Submit a Tool or Editorial Inquiry',
      description: 'Get in touch with the HadoolAI editorial testing team. Submit new AI tools for review, report corrections, or inquire about partnerships.',
      url: `${SITE_URL}/contact`
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Contact Us',
          item: `${SITE_URL}/contact`
        }
      ]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <SeoHead
        title="Contact HadoolAI | Submit a Tool or Editorial Inquiry"
        description="Get in touch with the HadoolAI editorial testing team. Submit new AI tools for review, report corrections, or inquire about partnerships."
        canonicalUrl={`${SITE_URL}/contact`}
        schema={contactSchemas}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[{ label: 'Contact Us' }]}
          onNavigate={onNavigate}
        />

        <div className="mt-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight mt-3">
            Contact the Editorial Team
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Have a new AI tool you want our lab to review? Found a pricing update that needs a correction? We'd love to hear from you.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-100">
            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
                <h3 className="font-heading font-bold text-xl text-emerald-950">Message Sent Successfully</h3>
                <p className="text-sm text-emerald-800 max-w-md mx-auto">
                  Thank you for reaching out, {name}. Our editorial team reviews submissions daily and will respond to {email} shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="mt-4 px-5 py-2.5 bg-emerald-600 text-white font-semibold text-xs rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rachel Foster"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rachel@example.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Inquiry Topic *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                  >
                    <option value="tool-submission">Submit a New AI Tool for Review</option>
                    <option value="pricing-update">Report Pricing or Feature Update</option>
                    <option value="editorial">Editorial Feedback / Correction</option>
                    <option value="partnership">Partnership & Media Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Message Details *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide tool URL, feature description, or any specifics..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors cursor-pointer shadow-xs"
                  >
                    <span>Submit Message</span>
                    <Send size={15} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
