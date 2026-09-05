import { CategoryMeta } from './types';

export const categories: CategoryMeta[] = [
  {
    id: 'video',
    name: 'AI Video',
    slug: 'ai-video-tools',
    description: 'Create cinematic videos, generate hyper-realistic footage from text prompts, animate photos, and automate video editing with modern generative video models.',
    iconName: 'Video',
    toolsCount: 24,
    heroHighlight: 'Generate 4K cinematic scenes, avatars, and visual effects with AI text-to-video.'
  },
  {
    id: 'writing',
    name: 'AI Writing',
    slug: 'ai-writing-tools',
    description: 'Accelerate long-form content, brainstorm ideas, draft emails, write code documentation, and edit copy with industry-leading Large Language Models.',
    iconName: 'PenTool',
    toolsCount: 38,
    heroHighlight: 'Produce human-grade copy, essays, documentation, and creative stories in seconds.'
  },
  {
    id: 'image',
    name: 'AI Image',
    slug: 'ai-image-tools',
    description: 'Synthesize photorealistic concept art, graphics, product photography, logos, and UI assets using advanced diffusion and multimodal image generators.',
    iconName: 'Image',
    toolsCount: 32,
    heroHighlight: 'Turn imagination into high-resolution visuals, vector illustrations, and photo mockups.'
  },
  {
    id: 'productivity',
    name: 'AI Productivity',
    slug: 'ai-productivity-tools',
    description: 'Automate repetitive workflows, summarize meeting notes, organize workspace knowledge, manage tasks, and synthesize data with smart AI agents.',
    iconName: 'Zap',
    toolsCount: 45,
    heroHighlight: 'Save 10+ hours every week by delegating routine administrative tasks to AI workflows.'
  },
  {
    id: 'audio',
    name: 'AI Audio & Voice',
    slug: 'ai-audio-tools',
    description: 'Clone ultra-realistic voices, generate studio-grade text-to-speech, create royalty-free background music, and clean noisy audio tracks.',
    iconName: 'Mic',
    toolsCount: 19,
    heroHighlight: 'Studio-quality voiceovers, voice cloning in 30+ languages, and AI music generation.'
  },
  {
    id: 'coding',
    name: 'AI Coding & Dev',
    slug: 'ai-coding-tools',
    description: 'Next-generation AI IDEs, code autocomplete engines, automated test generators, and repository-wide context copilots for modern software engineering.',
    iconName: 'Code',
    toolsCount: 22,
    heroHighlight: 'Ship bug-free software 3x faster with context-aware repository copilots.'
  },
  {
    id: 'research',
    name: 'AI Research & Search',
    slug: 'ai-research-tools',
    description: 'Deep conversational search engines with verified source citations, academic paper synthesizers, and intelligent knowledge bases.',
    iconName: 'Search',
    toolsCount: 16,
    heroHighlight: 'Access web-grounded research answers with direct inline academic and news citations.'
  }
];

export const getCategoryById = (id: string): CategoryMeta | undefined => {
  const normalized = id.toLowerCase().replace(/^\//, '');
  if (normalized === 'voice' || normalized === 'ai-voice-tools') {
    return categories.find(c => c.id === 'audio');
  }
  return categories.find(c => c.id === normalized || c.slug === normalized || c.slug === `ai-${normalized}-tools`);
};
