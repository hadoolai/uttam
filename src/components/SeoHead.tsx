import React, { useEffect } from 'react';
import { SITE_URL } from '../utils/constants';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
  noIndex?: boolean;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  schema,
  noIndex = false
}) => {
  useEffect(() => {
    // 1. Title
    const fullTitle = title.includes('HadoolAI') ? title : `${title} | HadoolAI`;
    document.title = fullTitle;

    // Determine canonical URL - Always canonicalize to https://hadoolai.co.in
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
    const resolvedCanonical = canonicalUrl || `${SITE_URL}${currentPath === '/' ? '' : currentPath}`;

    // Helper for <meta> tags by name or property
    const setMetaTag = (attrName: 'name' | 'property', attrValue: string, contentValue: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attrName, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', contentValue);
    };

    // 2. Meta description
    setMetaTag('name', 'description', description);

    // 3. Robots meta tag
    setMetaTag('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // 4. OpenGraph tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:url', resolvedCanonical);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'HadoolAI');

    // 5. Twitter Card tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 6. Canonical <link rel="canonical"> tag
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', resolvedCanonical);

    // 7. Inject JSON-LD Schema
    const schemaId = 'structured-data-jsonld';
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = schemaId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    // 8. Scroll to top on page navigation
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [title, description, canonicalUrl, ogType, ogImage, schema, noIndex]);

  return null;
};

