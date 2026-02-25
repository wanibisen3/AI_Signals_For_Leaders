
export type Role = 'Product Leader' | 'Business Leader' | 'Founder' | 'Other';
export type CompanySize = 'Startup' | 'Growing' | 'Large';
export type DecisionArea = 'Product' | 'Cost' | 'GTM' | 'Productivity' | 'Risk';

export interface UserPreferences {
  role: Role | '';
  companySize: CompanySize | '';
  decisionAreas: DecisionArea[];
  mainConcern: string;
  keywords?: string[];
  generateBriefs?: boolean;
  hasPersonalized: boolean;
}

export interface User {
  id?: string;
  email: string;
  preferences: UserPreferences;
}

export interface TokenTier {
  packageCode: string;
  currency: string;
  amount: number;
  tokens: number;
  label: string;
  mostPopular: boolean;
}

export interface DashboardState {
  tokenBalance: number;
  personalization: UserPreferences;
  briefs: Brief[];
  hasBatch: boolean;
  latestBatch: {
    id: string;
    status: 'pending' | 'completed' | 'failed';
    created_at?: string;
  } | null;
}

export interface Brief {
  id: string;
  headline: string;
  summary: string;
  whyItMatters: string;
  leaderTakeaway: string;
  whatHappened: string;
  whatToConsiderNext: string[];
  source: string;
  date: string;
  category: string;
  matchScore?: number;
  matchBreakdown?: {
    role: number;
    focus: number;
    decisionAreas: number;
  };
}

export type ViewState =
  | 'marketing'
  | 'signin'
  | 'signup'
  | 'billing_success'
  | 'about'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'personalization'
  | 'dashboard'
  | 'detail'
  | 'settings';
