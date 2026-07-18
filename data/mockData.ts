import { User, Order, BrandVoicePreset } from '../types';

export const mockUser: User = {
  id: 'usr-1',
  email: 'shahid@wavespace.agency',
  name: 'Shahid Miah',
  company: 'Wavespace',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop' // Modern Unsplash avatar image
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
    title: 'Q3 Product Launch Announcement',
    contentType: 'Blog Post',
    status: 'In Progress',
    deadline: '2026-07-25T17:00:00.000Z',
    wordCount: 1200,
    targetAudience: 'SaaS founders and tech professionals',
    toneVoice: 'Professional yet conversational, energetic',
    keywords: ['product launch', 'saas platform', 'agile workflow'],
    referenceLinks: ['https://example.com/product-specs', 'https://example.com/competitor-compare'],
    additionalNotes: 'Make sure to emphasize the new drag-and-drop feature and the speed optimizations we did in the latest sprint. Keep the language snappy.',
    createdAt: '2026-07-15T09:00:00.000Z',
    attachments: [
      {
        id: 'att-1',
        fileName: 'launch-specs.pdf',
        filePath: '/attachments/launch-specs.pdf',
        fileSize: 1048576, // 1 MB
        createdAt: '2026-07-15T09:00:00.000Z'
      }
    ]
  },
  {
    id: 'ord-2',
    userId: 'usr-1',
    title: 'Email Newsletter: AI Integration Guide',
    contentType: 'Newsletter Email',
    status: 'In Review',
    deadline: '2026-07-20T12:00:00.000Z',
    wordCount: 600,
    targetAudience: 'Existing newsletter subscribers',
    toneVoice: 'Informative, educational, helpful',
    keywords: ['AI features', 'user experience', 'automation'],
    referenceLinks: ['https://example.com/ai-docs'],
    additionalNotes: 'Draft version of our bi-weekly update. Emphasize that the AI features are free during the beta phase.',
    createdAt: '2026-07-12T14:15:00.000Z',
    attachments: []
  },
  {
    id: 'ord-3',
    userId: 'usr-1',
    title: 'Technical Whitepaper: Scalable Database Design',
    contentType: 'Whitepaper',
    status: 'Completed',
    deadline: '2026-07-10T18:00:00.000Z',
    wordCount: 3500,
    targetAudience: 'Backend engineers and CTOs',
    toneVoice: 'Highly technical, authoritative, precise',
    keywords: ['database scalability', 'sharding', 'postgres', 'connection pool'],
    referenceLinks: ['https://example.com/postgres-benchmark'],
    additionalNotes: 'The whitepaper is already completed and approved by the engineering lead. It is ready for publication.',
    createdAt: '2026-07-02T10:00:00.000Z',
    attachments: [
      {
        id: 'att-2',
        fileName: 'architecture_diagram.png',
        filePath: '/attachments/architecture_diagram.png',
        fileSize: 524288, // 512 KB
        createdAt: '2026-07-02T10:30:00.000Z'
      }
    ]
  },
  {
    id: 'ord-4',
    userId: 'usr-1',
    title: 'Homepage Copy Rewrite',
    contentType: 'Website Copy',
    status: 'Draft',
    deadline: '2026-08-05T09:00:00.000Z',
    wordCount: 800,
    targetAudience: 'Marketing leads and CMOs',
    toneVoice: 'Punchy, value-focused, direct',
    keywords: ['conversion rate', 'marketing platform', 'optimize conversions'],
    referenceLinks: [],
    additionalNotes: 'We need to redo the hero section and the features list copy. Keep the core focus on how it saves teams 15 hours a week.',
    createdAt: '2026-07-18T11:00:00.000Z',
    attachments: []
  },
  {
    id: 'ord-5',
    userId: 'usr-1',
    title: 'Social Media Campaign: Summer Promo',
    contentType: 'Social Media Post',
    status: 'In Progress',
    deadline: '2026-07-28T15:00:00.000Z',
    wordCount: 300,
    targetAudience: 'B2C Customers',
    toneVoice: 'Playful, friendly, catchy',
    keywords: ['summer sale', 'discount', 'special deal'],
    referenceLinks: [],
    additionalNotes: 'Write 3 variants for Twitter, 2 for LinkedIn, and 1 for Instagram. Focus on the 30% discount code: SUMMER30.',
    createdAt: '2026-07-17T16:00:00.000Z',
    attachments: []
  }
];
