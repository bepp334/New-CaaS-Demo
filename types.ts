export type NodeType = 'text' | 'image' | 'question' | 'offer' | 'bot_link' | 'carousel';

export type ComplianceStatus = 'pending' | 'approved' | 'warning' | 'rejected';

export interface ComplianceLog {
  id: string;
  timestamp: string;
  actor: 'AI_Checker' | 'Legal_Dept' | 'User';
  action: 'check_passed' | 'check_failed' | 'manual_approve' | 'comment';
  comment?: string;
}

export interface ComplianceResult {
  status: ComplianceStatus;
  feedback: string[];
  history: ComplianceLog[]; // Audit trail
}

export interface GlobalTag {
  id: string;
  label: string;
  scope: 'global'; // Shared across all projects
}

export interface NodeAnalytics {
  impressions?: number;
  clicks?: number;
  ctr?: string;
  dropoffRate?: string;
  cvr?: string; // Conversion Rate for Track Push
}

export interface ScenarioNode {
  id: string;
  type: NodeType;
  content: string; // Text content or image URL
  meta?: {
    options?: string[];
    items?: { title: string; image: string }[];
    url?: string;
    alt?: string;
    saveToTag?: GlobalTag; // The tag where the answer is saved
    [key: string]: any;
  };
  analytics?: NodeAnalytics; // Performance data attached to the node
}

export type ScenarioType = 'initial' | 'track_push' | 'shot';

// For Track Push steps
export type TrackStepPurpose = 'welcome' | 'education' | 'nurturing' | 'offer' | 'reminder';

export interface Scenario {
  id: string;
  type: ScenarioType;
  name: string;
  schedule?: string; // "Immediate", "2026-12-25", or "Day 1"
  status: 'draft' | 'published' | 'optimizing' | 'scheduled' | 'sent';
  nodes: ScenarioNode[];
  compliance?: ComplianceResult;
  variants?: ScenarioNode[][]; // For Track Push AI pool
  
  // Specific for Track Push
  stepPurpose?: TrackStepPurpose;
  dayOffset?: number; // 1, 2, 3... 8
  
  // Specific for Shots
  sentDate?: string;
  stats?: {
      openRate: string;
      ctr: string;
      cvr: string;
  };
}

export interface Project {
  id: string;
  name: string;
  category: string;
}

export type ViewMode = 'split' | 'visual' | 'data' | 'dashboard'; // Added dashboard for Shot list

export type AppSection = 'initial' | 'track_push' | 'shot';