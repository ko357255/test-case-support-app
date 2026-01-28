import { Timestamp } from 'firebase/firestore';

export interface ProjectDoc {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TestCaseDoc {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'passed' | 'failed' | 'in_progress' | 'not_started';
  groupId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TestStepDoc {
  id: string;
  stepNumber: number;
  action: string;
  expected: string;
  actual?: string;
  status?: 'passed' | 'failed' | 'in_progress' | 'not_started';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface EvidenceDoc {
  id: string;
  name: string;
  type: 'screenshot' | 'document' | 'video' | 'text';
  url?: string;
  textContent?: string;
  createdAt: Timestamp;
}
