
export type Role = 'Product Leader' | 'Business Leader' | 'Founder' | 'Other';
export type CompanySize = 'Startup' | 'Growing' | 'Large';
export type DecisionArea = 'Product' | 'Cost' | 'GTM' | 'Productivity' | 'Risk';

export interface UserPreferences {
  role: Role | '';
  companySize: CompanySize | '';
  decisionAreas: DecisionArea[];
  mainConcern: string;
  hasPersonalized: boolean;
}

export interface User {
  email: string;
  preferences: UserPreferences;
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
}

export type ViewState = 
  | 'marketing' 
  | 'signin' 
  | 'signup' 
  | 'personalization' 
  | 'dashboard' 
  | 'detail' 
  | 'saved' 
  | 'settings';
