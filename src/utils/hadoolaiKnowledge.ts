/**
 * HadoolAI Website Knowledge Base & Search System
 * 
 * Provides fast, structured retrieval of HadoolAI's verified directory tools,
 * in-depth reviews, head-to-head comparisons, and comprehensive editorial guides.
 */

export interface HadoolAIContentResult {
  title: string;
  url: string;
  category: string;
  snippet: string;
  type: 'tool' | 'article' | 'comparison' | 'general';
}

export const HADOOLAI_OVERVIEW = {
  name: 'HadoolAI',
  website: 'https://hadoolai.co.in',
  tagline: 'Independent AI Software Reviews, Comparisons, & Guides',
  description:
    'HadoolAI (https://hadoolai.co.in) is an independent AI review and benchmark publication founded to provide transparent, human-first evaluations of artificial intelligence tools for creators, professionals, businesses, and developers.',
  keySections: [
    { name: 'AI Assistant Chatbot', path: '/chat', desc: 'Real-time conversational AI assistant powered by Google Search grounding and HadoolAI knowledge' },
    { name: 'AI Tools Directory', path: '/ai-tools', desc: 'Curated directory of vetted generative AI software' },
    { name: 'AI Video Tools', path: '/ai-video-tools', desc: 'Reviews and rankings of Runway, Kling, Veo, Pika, Descript' },
    { name: 'AI Writing Tools', path: '/ai-writing-tools', desc: 'Evaluations of ChatGPT, Claude, Gemini, Jasper, Copy.ai, Writesonic' },
    { name: 'AI Image Tools', path: '/ai-image-tools', desc: 'Midjourney, Adobe Firefly, Canva Magic Studio' },
    { name: 'AI Audio & Voice', path: '/ai-audio-tools', desc: 'ElevenLabs, Descript, voice clones and podcast tools' },
    { name: 'AI Comparisons', path: '/comparisons', desc: 'Side-by-side spec, pricing, and output benchmarks' },
    { name: 'Review Methodology', path: '/review-methodology', desc: 'HadoolAI 5-pillar scoring framework' },
    { name: 'Editorial Policy', path: '/editorial-policy', desc: 'Independent testing principles and commercial disclosures' },
    { name: 'Google Drive Workspace', path: '/drive', desc: 'Google Drive workspace sync integration' },
  ],
  majorGuides: [
    {
      title: 'YouTube Review 2026: Monetization, Shorts, Earnings & Complete Guide',
      path: '/blog/youtube-review-2026',
      summary: 'Comprehensive 2026 guide to YouTube Partner Program (YPP), Shorts vs Watch Page revenue, AI content rules, reused content policies, and 90-day growth strategy.',
    },
    {
      title: 'Facebook Monetization 2026: The Complete Creator Guide (Content Monetization, Reels, Qualified Views & Meta Policy)',
      path: '/blog/facebook-monetization-2026',
      summary: 'Complete guide to Meta unified Content Monetization in 2026: qualified view metrics, Reels earnings, AI content policy, eligibility criteria, and a 30-day creator growth roadmap.',
    },
    {
      title: 'Best AI Writing Tools 2026: Complete Guide for Blogs, SEO, Students, & Business',
      path: '/blog/best-ai-writing-tools-2026',
      summary: 'Comprehensive 10-tool benchmark covering ChatGPT, Claude, Gemini, Jasper, Copy.ai, Writesonic, Notion AI, Sudowrite, Rytr, and QuillBot.',
    },
    {
      title: 'Best AI Video Generators 2026: Runway vs Veo vs Kling vs Pika',
      path: '/articles/best-ai-video-generators-2026',
      summary: 'Cinematic camera controls, motion physics, and YouTube workflow evaluations.',
    },
    {
      title: 'Bilibili App Review 2026: Features, Anime, Download, Safety & Creator Guide',
      path: '/articles/bilibili-app-review',
      summary: 'Full platform review covering creator incentives, monetization, danmaku comments, and international usability.',
    },
    {
      title: 'Online Free Earning Without Investment: High-Value Skills & Methods',
      path: '/articles/online-free-earning-without-investment',
      summary: 'Legitimate remote freelance, digital creation, and AI workflow methods.',
    },
  ],
  featuredTools: [
    {
      name: 'Runway',
      path: '/reviews/runway',
      category: 'AI Video',
      pricing: 'Freemium (from $12/mo)',
      highlight: 'Gen-3 Alpha text-to-video, Motion Brush, cinematic camera directors suite.',
    },
    {
      name: 'Kling AI',
      path: '/reviews/kling',
      category: 'AI Video',
      pricing: 'Freemium',
      highlight: 'Advanced 3D spatiotemporal simulation, realistic fluid dynamics and human physics.',
    },
    {
      name: 'Google Veo',
      path: '/reviews/google-veo',
      category: 'AI Video',
      pricing: 'Enterprise / Preview',
      highlight: 'High-definition 1080p video with deep cinematic prompt comprehension.',
    },
    {
      name: 'ChatGPT',
      path: '/reviews/chatgpt',
      category: 'AI Writing & LLM',
      pricing: 'Freemium ($20/mo Plus)',
      highlight: 'OpenAI flagship model with GPT-4o, Custom GPTs, and Advanced Voice Mode.',
    },
    {
      name: 'Claude',
      path: '/reviews/claude',
      category: 'AI Writing & Coding',
      pricing: 'Freemium ($20/mo Pro)',
      highlight: 'Anthropic Claude 3.5 Sonnet excels in natural prose, coding, and large document analysis.',
    },
    {
      name: 'Gemini',
      path: '/reviews/gemini',
      category: 'Multimodal AI',
      pricing: 'Freemium ($20/mo Advanced)',
      highlight: 'Google DeepMind model with real-time Google Search grounding and 1M+ context window.',
    },
    {
      name: 'Midjourney',
      path: '/reviews/midjourney',
      category: 'AI Image',
      pricing: 'Paid (from $10/mo)',
      highlight: 'Industry benchmark for aesthetic art, lighting, textures, and photorealism.',
    },
    {
      name: 'Adobe Firefly',
      path: '/reviews/adobe-firefly',
      category: 'AI Image & Design',
      pricing: 'Freemium (Creative Cloud integration)',
      highlight: 'Trained on Adobe Stock for commercial indemnity, Photoshop Generative Fill.',
    },
    {
      name: 'ElevenLabs',
      path: '/reviews/elevenlabs',
      category: 'AI Voice & Audio',
      pricing: 'Freemium (from $5/mo)',
      highlight: 'State-of-the-art voice cloning, emotional inflection, and sound effects synthesis.',
    },
    {
      name: 'Descript',
      path: '/reviews/descript',
      category: 'AI Video & Audio Editor',
      pricing: 'Freemium (from $12/mo)',
      highlight: 'Edit audio and video as easily as editing a text transcript with Studio Sound.',
    },
    {
      name: 'Jasper',
      path: '/reviews/jasper',
      category: 'AI Marketing & Writing',
      pricing: 'Paid (from $39/mo)',
      highlight: 'Enterprise marketing campaigns, brand voice memory, and multichannel assets.',
    },
    {
      name: 'Copy.ai',
      path: '/reviews/copy-ai',
      category: 'AI Writing & GTM',
      pricing: 'Freemium (from $36/mo)',
      highlight: 'Go-to-market workflows, sales email automation, and social copywriting.',
    },
  ],
};

/**
 * Searches HadoolAI verified content for a given user query.
 * Returns relevant matching items or null if no strong website-specific match exists.
 */
export function searchHadoolAIContent(query: string): HadoolAIContentResult[] {
  if (!query) return [];
  const q = query.toLowerCase().trim();
  const results: HadoolAIContentResult[] = [];

  // 1. If query is asking about HadoolAI itself
  if (
    q.includes('hadoolai') ||
    q.includes('hadool') ||
    q.includes('this website') ||
    q.includes('who are you') ||
    q.includes('what do you do') ||
    q.includes('about you')
  ) {
    results.push({
      title: 'HadoolAI — About the Platform',
      url: 'https://hadoolai.co.in/about',
      category: 'About',
      snippet: HADOOLAI_OVERVIEW.description,
      type: 'general',
    });
    results.push({
      title: 'HadoolAI AI Assistant',
      url: 'https://hadoolai.co.in/chat',
      category: 'AI Chatbot',
      snippet: 'HadoolAI AI Assistant provides real-time information, answers user queries, and searches the web using Google Search grounding with source citations.',
      type: 'general',
    });
    results.push({
      title: 'HadoolAI Review Methodology',
      url: 'https://hadoolai.co.in/review-methodology',
      category: 'Methodology',
      snippet: 'HadoolAI evaluates AI tools across 5 pillars: Output Quality, Feature Depth, Usability, Cost & Value, and Support/Reliability.',
      type: 'general',
    });
  }

  // 2. Check major editorial guides
  for (const guide of HADOOLAI_OVERVIEW.majorGuides) {
    const titleWords = guide.title.toLowerCase().split(/\s+/);
    const matchesTitle = titleWords.some((w) => w.length > 3 && q.includes(w));
    if (matchesTitle || (q.includes('writing') && guide.title.includes('Writing')) || (q.includes('video') && guide.title.includes('Video')) || (q.includes('bilibili') && guide.title.includes('Bilibili'))) {
      results.push({
        title: guide.title,
        url: `https://hadoolai.co.in${guide.path}`,
        category: 'Editorial Guide',
        snippet: guide.summary,
        type: 'article',
      });
    }
  }

  // 3. Check featured tools
  for (const tool of HADOOLAI_OVERVIEW.featuredTools) {
    const toolName = tool.name.toLowerCase();
    if (q.includes(toolName) || (q.includes('best') && q.includes(tool.category.toLowerCase()))) {
      results.push({
        title: `${tool.name} Review & Benchmark — HadoolAI`,
        url: `https://hadoolai.co.in${tool.path}`,
        category: tool.category,
        snippet: `${tool.name} (${tool.pricing}): ${tool.highlight}`,
        type: 'tool',
      });
    }
  }

  // 4. Check category hubs
  if (q.includes('video')) {
    results.push({
      title: 'AI Video Tools Directory — HadoolAI',
      url: 'https://hadoolai.co.in/ai-video-tools',
      category: 'AI Video',
      snippet: 'Explore and compare top AI video generators including Runway Gen-3 Alpha, Kling AI, Google Veo, and Pika.',
      type: 'general',
    });
  }
  if (q.includes('writing') || q.includes('writer') || q.includes('copywriting') || q.includes('blog')) {
    results.push({
      title: 'AI Writing Tools Directory — HadoolAI',
      url: 'https://hadoolai.co.in/ai-writing-tools',
      category: 'AI Writing',
      snippet: 'Discover the best AI writing and copywriting tools: ChatGPT, Claude 3.5, Gemini, Jasper, Copy.ai, and Writesonic.',
      type: 'general',
    });
  }
  if (q.includes('image') || q.includes('art') || q.includes('photo')) {
    results.push({
      title: 'AI Image Tools Directory — HadoolAI',
      url: 'https://hadoolai.co.in/ai-image-tools',
      category: 'AI Image',
      snippet: 'Compare the leading generative AI image generators: Midjourney, Adobe Firefly, and Canva Magic Studio.',
      type: 'general',
    });
  }

  // Deduplicate by URL
  const seen = new Set<string>();
  const uniqueResults: HadoolAIContentResult[] = [];
  for (const r of results) {
    if (!seen.has(r.url)) {
      seen.add(r.url);
      uniqueResults.push(r);
    }
  }

  return uniqueResults.slice(0, 5);
}
