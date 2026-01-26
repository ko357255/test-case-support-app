import { Timestamp } from 'firebase/firestore';

export interface EvidenceDoc {
  id: string;
  projectId: string;
  stepId?: string;
  testCaseId?: string;
  name: string;
  note?: string;
  type: 'screenshot' | 'document' | 'video';
  uploadedAt: Timestamp;
  url: string;
}

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
  projectId: string;
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
  testCaseId: string;
  stepNumber: number;
  action: string;
  expected: string;
  actual?: string;
  status?: 'passed' | 'failed' | 'in_progress' | 'not_started';
}
