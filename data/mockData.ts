import { User, Order, BrandVoicePreset } from '../types';

export const mockUser: User = {
  id: 'usr-1',
  email: 'shahid@wavespace.agency',
  name: 'Shahid Miah',
  company: 'Wavespace',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop'
};

export const mockBrandVoicePresets: BrandVoicePreset[] = [
  {
    id: 'bvp-1',
    name: 'Wavespace Authority',
    description: 'Expert, authoritative tone for developer tools and technical platforms.',
    tone: 'Highly technical, authoritative, precise',
    exampleText: 'Our distributed caching system guarantees sub-millisecond latencies under high throughput by utilizing direct memory mappings and non-blocking TCP connections.'
  },
  {
    id: 'bvp-2',
    name: 'Energetic Startup',
    description: 'Casual, punchy, and highly enthusiastic voice for consumer products.',
    tone: 'Playful, friendly, catchy, direct',
    exampleText: 'Ready to supercharge your workflow? Check out our brand new integrations designed to get you moving 10x faster without breaking a sweat!'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    userId: 'usr-1',
    title: 'SaaS Growth Guide',
    contentType: 'Blog Post',
    status: 'In Progress',
    deadline: '2026-10-31T17:00:00.000Z',
    wordCount: 1500,
    targetAudience: 'SaaS founders and growth marketers',
    toneVoice: 'Informative, direct, action-oriented',
    keywords: ['saas growth', 'marketing guide', 'acquisition'],
    referenceLinks: [],
    additionalNotes: 'Keep the copy highly actionable and structured with bullet points.',
    createdAt: '2026-09-15T09:00:00.000Z',
    attachments: []
  },
  {
    id: 'ord-2',
    userId: 'usr-1',
    title: 'Q3 Newsletter',
    contentType: 'Newsletter Email',
    status: 'In Review',
    deadline: '2026-10-19T17:00:00.000Z',
    wordCount: 600,
    targetAudience: 'Newsletter subscribers',
    toneVoice: 'Snappy, punchy, engaging',
    keywords: [],
    referenceLinks: [],
    additionalNotes: 'Summarize our key achievements and feature updates from Q3.',
    createdAt: '2026-09-12T14:15:00.000Z',
    attachments: []
  },
  {
    id: 'ord-3',
    userId: 'usr-1',
    title: 'Product Launch Post',
    contentType: 'Social Media Post',
    status: 'Completed',
    deadline: '2026-10-14T17:00:00.000Z',
    wordCount: 250,
    targetAudience: 'LinkedIn audience',
    toneVoice: 'Excited, professional, value-driven',
    keywords: [],
    referenceLinks: [],
    additionalNotes: 'Highlight the speed improvements and modern design system.',
    createdAt: '2026-09-10T10:00:00.000Z',
    attachments: []
  },
  {
    id: 'ord-4',
    userId: 'usr-1',
    title: 'Landing Page Copy',
    contentType: 'Website Copy',
    status: 'Draft',
    deadline: '2026-11-04T17:00:00.000Z',
    wordCount: 800,
    targetAudience: 'New website visitors',
    toneVoice: 'Clear, modern, benefits-focused',
    keywords: [],
    referenceLinks: [],
    additionalNotes: 'Focus on high-converting headlines and subheadlines.',
    createdAt: '2026-09-18T11:00:00.000Z',
    attachments: []
  },
  {
    id: 'ord-5',
    userId: 'usr-1',
    title: 'Customer Success Story',
    contentType: 'Case Study',
    status: 'Completed',
    deadline: '2026-09-29T17:00:00.000Z',
    wordCount: 1200,
    targetAudience: 'Enterprise clients',
    toneVoice: 'Data-driven, precise, professional',
    keywords: [],
    referenceLinks: [],
    additionalNotes: 'Incorporate metrics of how client saved 15+ hours per week.',
    createdAt: '2026-09-17T16:00:00.000Z',
    attachments: []
  }
];
