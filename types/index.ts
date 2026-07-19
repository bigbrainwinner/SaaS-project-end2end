export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  avatarUrl: string;
}

export interface Attachment {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  createdAt: string;
}

export interface BrandVoicePreset {
  id: string;
  name: string;
  description: string;
  tone: string;
  exampleText: string;
}

export interface Settings {
  notifications: {
    emailOnStatusChange: boolean;
    emailOnCompletion: boolean;
    weeklyDigest: boolean;
  };
}

export type OrderStatus = 'Draft' | 'In Progress' | 'In Review' | 'Completed';

export interface Order {
  id: string;
  userId: string;
  title: string;
  contentType: string; // e.g. "Blog Post", "Social Media Copy", "Technical Guide"
  status: OrderStatus;
  deadline: string; // ISO date string
  wordCount: number;
  targetAudience: string;
  toneVoice: string;
  keywords: string[];
  referenceLinks: string[];
  additionalNotes: string;
  createdAt: string; // ISO date string
  attachments: Attachment[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'deadline';
  time: string;
  read: boolean;
}
