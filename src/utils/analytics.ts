/**
 * Google Analytics 4 (GA4) Integration Utility
 * Measurement ID: G-H555SQW3XH
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'G-H555SQW3XH';

/**
 * Ensures gtag function and dataLayer exist on window.
 */
export function ensureGtag(): void {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
}

/**
 * Tracks a page_view event in Google Analytics 4 for client-side SPA routing.
 * Ensures page_path, page_location, and page_title are accurately recorded.
 */
export function trackPageView(path?: string, title?: string): void {
  if (typeof window === 'undefined') return;

  ensureGtag();

  const currentPath = path || window.location.pathname + window.location.search || '/';
  const pageTitle = title || document.title || 'HadoolAI';
  const pageLocation = window.location.origin + currentPath;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: pageLocation,
      page_path: currentPath,
      send_to: GA_MEASUREMENT_ID,
    });
  }
}

/**
 * Tracks custom user interactions and events (e.g. search, outbound tool click, bookmark, filter).
 */
export function trackEvent(
  eventName: string,
  eventParams: Record<string, any> = {}
): void {
  if (typeof window === 'undefined') return;

  ensureGtag();

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
}
