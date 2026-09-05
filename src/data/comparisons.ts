import { Comparison } from './types';

export const comparisonsData: Comparison[] = [
  {
    id: 'chatgpt-vs-gemini',
    slug: 'chatgpt-vs-gemini',
    toolAId: 'chatgpt',
    toolBId: 'gemini',
    title: 'ChatGPT vs Google Gemini (2026 Head-to-Head)',
    tagline: 'Comparing intelligence, context window length, voice speed, and ecosystem integration',
    summaryVerdict: 'ChatGPT (GPT-4o / o3-mini) leads in coding nuance, custom GPT tools, and conversational voice interaction. Google Gemini (1.5 Pro / 2.0 Flash) wins decisively on context window capacity (up to 2M tokens), Google Workspace integration, and overall bundled value (includes 2TB Google Drive storage).',
    winnerId: 'chatgpt',
    categoryWinner: [
      {
        category: 'Reasoning & Coding',
        winnerId: 'chatgpt',
        reason: 'ChatGPT o1/o3-mini models and Canvas editor deliver deeper step-by-step logic and cleaner code refactoring.'
      },
      {
        category: 'Context Window & Large Files',
        winnerId: 'gemini',
        reason: 'Gemini 2M token context can ingest hours of video, audio, and entire repositories that exceed ChatGPT limits.'
      },
      {
        category: 'Productivity & Ecosystem',
        winnerId: 'gemini',
        reason: 'Native integration with Gmail, Google Docs, Drive, Sheets, and 2TB cloud storage bundled in the $19.99 tier.'
      },
      {
        category: 'Conversational Voice Mode',
        winnerId: 'chatgpt',
        reason: 'ChatGPT Advanced Voice mode has lower latency and handles natural interruptions with greater nuance.'
      },
      {
        category: 'Pricing & Value',
        winnerId: 'gemini',
        reason: 'Gemini Advanced gives you 2TB Google Drive ($10/mo value) plus top-tier AI for $19.99, making it exceptional value.'
      }
    ],
    updatedDate: 'February 2026'
  },
  {
    id: 'claude-vs-chatgpt',
    slug: 'claude-vs-chatgpt',
    toolAId: 'claude',
    toolBId: 'chatgpt',
    title: 'Anthropic Claude vs ChatGPT',
    tagline: 'Which AI model delivers cleaner code, superior writing tone, and better workflow tools?',
    summaryVerdict: 'Claude 3.7 Sonnet is currently preferred by engineers and writers for its authentic tone, Artifacts live preview, and hybrid extended thinking. ChatGPT remains the broader platform with image generation, custom GPTs, and Advanced Voice mode.',
    winnerId: 'claude',
    categoryWinner: [
      {
        category: 'Writing Natural Prose',
        winnerId: 'claude',
        reason: 'Claude writes with substantially less repetitive AI fluff and greater stylistic subtlety.'
      },
      {
        category: 'Software Engineering',
        winnerId: 'claude',
        reason: 'Claude 3.7 Sonnet achieves higher accuracy on complex multi-file architectural refactoring.'
      },
      {
        category: 'Multimodal Features',
        winnerId: 'chatgpt',
        reason: 'ChatGPT includes built-in DALL-E 3 image generation, Python code sandbox execution, and Voice Mode.'
      },
      {
        category: 'Interactive UI (Artifacts vs Canvas)',
        winnerId: 'claude',
        reason: 'Claude Artifacts render live React apps, SVG graphics, and interactive dashboards seamlessly.'
      }
    ],
    updatedDate: 'February 2026'
  },
  {
    id: 'midjourney-vs-canva-ai',
    slug: 'midjourney-vs-canva-ai',
    toolAId: 'midjourney',
    toolBId: 'canva-ai',
    title: 'Midjourney vs Canva AI (Magic Studio)',
    tagline: 'Artistic photorealism vs practical all-in-one business design suite',
    summaryVerdict: 'Midjourney produces vastly superior photorealism, artistic lighting, and cinematic aesthetics for concept art. Canva AI is far better for business marketing, combining AI generation with instant social templates, typography, background removal, and multi-format resizing.',
    winnerId: 'canva-ai',
    categoryWinner: [
      {
        category: 'Image Photorealism & Artistry',
        winnerId: 'midjourney',
        reason: 'Midjourney v6.1 texture quality, skin rendering, and lighting are the best in the industry.'
      },
      {
        category: 'Business Marketing & Templates',
        winnerId: 'canva-ai',
        reason: 'Canva provides ready-to-publish social layouts, brand kits, text overlays, and multi-slide decks.'
      },
      {
        category: 'Ease of Use for Beginners',
        winnerId: 'canva-ai',
        reason: 'Visual drag-and-drop web UI with zero prompt syntax or Discord commands needed.'
      },
      {
        category: 'Editing & Object Manipulation',
        winnerId: 'canva-ai',
        reason: 'Magic Erase, Magic Expand, and one-click Background Remover are fast and seamless.'
      }
    ],
    updatedDate: 'February 2026'
  },
  {
    id: 'elevenlabs-vs-descript',
    slug: 'elevenlabs-vs-descript',
    toolAId: 'elevenlabs',
    toolBId: 'descript',
    title: 'ElevenLabs vs Descript',
    tagline: 'Hyper-realistic voice synthesis vs all-in-one audio/video transcript editing',
    summaryVerdict: 'ElevenLabs is built for pure voice synthesis, ultra-realistic text-to-speech, and multilingual dubbing. Descript is a full audio/video production suite for editing podcasts and video tracks by modifying text transcripts.',
    winnerId: 'elevenlabs',
    categoryWinner: [
      {
        category: 'Voice Realism & Emotion',
        winnerId: 'elevenlabs',
        reason: 'ElevenLabs voice cadence, breath pauses, and emotive range are unmatched.'
      },
      {
        category: 'Podcast & Video Editing',
        winnerId: 'descript',
        reason: 'Descript lets you edit entire multi-track podcasts and remove filler words automatically by editing text.'
      },
      {
        category: 'Multilingual Dubbing',
        winnerId: 'elevenlabs',
        reason: 'ElevenLabs Dubbing Studio preserves the exact original speaker voice across 32 languages.'
      },
      {
        category: 'Audio Noise Cleanup',
        winnerId: 'descript',
        reason: 'Studio Sound makes bedroom recordings sound like a soundproof studio in one click.'
      }
    ],
    updatedDate: 'February 2026'
  },
  {
    id: 'runway-vs-kling',
    slug: 'runway-vs-kling',
    toolAId: 'runway',
    toolBId: 'kling',
    title: 'Runway vs Kling AI (Gen-3 vs Kling 1.5)',
    tagline: 'Cinematic precision & camera control vs complex physics motion simulation',
    summaryVerdict: 'Runway (Gen-3 Alpha) provides unmatched cinematic lighting, Motion Brush precision, and refined camera direction controls for professional film production. Kling AI excels at challenging physical dynamics (fluid motion, athletics, complex interactions) and offers generous free daily credits.',
    winnerId: 'runway',
    categoryWinner: [
      {
        category: 'Cinematic Lighting & Texture',
        winnerId: 'runway',
        reason: 'Runway Gen-3 produces more photorealistic film grain, studio lighting, and subtle actor expressions.'
      },
      {
        category: 'Physical Dynamics & Fluid Motion',
        winnerId: 'kling',
        reason: 'Kling handles complex physical actions (water pouring, fast movements, object impacts) with fewer deformities.'
      },
      {
        category: 'Camera Trajectory Controls',
        winnerId: 'runway',
        reason: 'Runway Motion Brush and multi-axis camera direction tools provide surgical framing accuracy.'
      },
      {
        category: 'Free Tier & Value for Money',
        winnerId: 'kling',
        reason: 'Kling offers 66 daily credits on check-in, whereas Runway provides a one-time 125 credit trial.'
      },
      {
        category: 'Generation Duration & Loop Endpoints',
        winnerId: 'kling',
        reason: 'Kling generates up to 10s continuous clips and allows specifying exact start and end keyframes.'
      }
    ],
    updatedDate: 'February 2026'
  },
  {
    id: 'canva-vs-adobe-firefly',
    slug: 'canva-vs-adobe-firefly',
    toolAId: 'canva-ai',
    toolBId: 'adobe-firefly',
    title: 'Canva AI vs Adobe Firefly (Magic Studio vs Firefly)',
    tagline: 'Drag-and-drop marketing suite vs enterprise-grade commercial generative AI',
    summaryVerdict: 'Canva AI (Magic Studio) is the ultimate rapid design platform for social media creators, marketers, and small business teams. Adobe Firefly is the superior choice for professional designers and enterprises requiring commercially safe AI image generation, vector synthesis, and deep native Photoshop integration.',
    winnerId: 'canva-ai',
    categoryWinner: [
      {
        category: 'Commercial Safety & IP Indemnification',
        winnerId: 'adobe-firefly',
        reason: 'Adobe Firefly is trained strictly on licensed Adobe Stock and offers full enterprise legal indemnification.'
      },
      {
        category: 'Marketing Templates & Publishing',
        winnerId: 'canva-ai',
        reason: 'Canva pairs AI generation with millions of ready-to-publish social layouts, brand kits, and print options.'
      },
      {
        category: 'Photoshop & Professional Workflow Integration',
        winnerId: 'adobe-firefly',
        reason: 'Firefly powers native Generative Fill and Vector Graphic creation directly in Photoshop and Illustrator.'
      },
      {
        category: 'Beginner Accessibility & Speed',
        winnerId: 'canva-ai',
        reason: 'Zero learning curve with one-click background removers, text magic, and multi-format resizing.'
      }
    ],
    updatedDate: 'February 2026'
  },
  {
    id: 'notebooklm-vs-chatgpt',
    slug: 'notebooklm-vs-chatgpt',
    toolAId: 'notebooklm',
    toolBId: 'chatgpt',
    title: 'NotebookLM vs ChatGPT (2026 Head-to-Head)',
    tagline: 'Grounded document synthesis and Audio Overviews vs broad reasoning & generative tasks',
    summaryVerdict: 'NotebookLM is the clear winner for document-grounded research, studying textbooks, zero-hallucination analysis, and generating two-host audio podcast deep dives completely free. ChatGPT remains the superior all-round assistant for open-ended coding, creative writing, DALL-E image generation, and custom workflows.',
    winnerId: 'notebooklm',
    categoryWinner: [
      {
        category: 'Source Grounding & Zero Hallucination',
        winnerId: 'notebooklm',
        reason: 'NotebookLM references exclusively your uploaded files with in-line clickable quotes, preventing made-up facts.'
      },
      {
        category: 'Audio Overviews & Podcast Synthesis',
        winnerId: 'notebooklm',
        reason: 'NotebookLM turns dense textbooks into a 15-minute, two-host conversational podcast with natural banter.'
      },
      {
        category: 'Coding & Step-by-Step Reasoning',
        winnerId: 'chatgpt',
        reason: 'ChatGPT o1/o3-mini models and Python code execution sandbox far outclass NotebookLM for programming.'
      },
      {
        category: 'Broad Multimodal & Creativity',
        winnerId: 'chatgpt',
        reason: 'ChatGPT supports DALL-E 3 image generation, Custom GPT agents, and live interactive voice dialogues.'
      },
      {
        category: 'Price & Value',
        winnerId: 'notebooklm',
        reason: 'NotebookLM is 100% free with no monthly subscription required, while ChatGPT Plus costs $20/month.'
      }
    ],
    updatedDate: 'February 2026'
  }
];

export const getComparisonBySlug = (slug: string): Comparison | undefined => {
  if (slug === 'chatgpt-vs-claude') return comparisonsData.find(c => c.slug === 'claude-vs-chatgpt');
  if (slug === 'chatgpt-vs-notebooklm') return comparisonsData.find(c => c.slug === 'notebooklm-vs-chatgpt');
  if (slug === 'kling-vs-runway') return comparisonsData.find(c => c.slug === 'runway-vs-kling');
  if (slug === 'adobe-firefly-vs-canva' || slug === 'adobe-firefly-vs-canva-ai') return comparisonsData.find(c => c.slug === 'canva-vs-adobe-firefly');
  return comparisonsData.find(c => c.slug === slug || c.id === slug);
};
