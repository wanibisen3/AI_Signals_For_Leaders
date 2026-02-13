
import { Brief } from './types';

export const MOCK_BRIEFS: Brief[] = [
  {
    id: '1',
    headline: 'OpenAI Sora: Transforming Enterprise Content Strategy',
    summary: 'A new text-to-video model capable of generating high-fidelity video up to 60 seconds long.',
    whyItMatters: 'Drastic ROI shifts in content production. 70-85% cost reduction for internal training and product explainers.',
    leaderTakeaway: 'Audit current video pipeline. Identify low-stakes content for AI-assisted pilot programs.',
    whatHappened: 'OpenAI officially released Sora, demonstrating a profound understanding of physical world dynamics and temporal consistency across complex camera movements.',
    whatToConsiderNext: [
      'Audit Current Video Pipeline',
      'Legal & Compliance Review of AI-generated assets',
      'Ethics & Watermarking policies'
    ],
    source: 'OpenAI',
    date: 'Oct 24, 2024',
    category: 'Strategy'
  },
  {
    id: '2',
    headline: 'Global Semiconductor Shift: Strategic Reshoring Accelerates',
    summary: 'Recent policy shifts in Southeast Asia are prompting a pivot in silicon supply chains.',
    whyItMatters: 'Potential 12% increase in logistics overhead offset by a 30% reduction in supply chain disruption risks.',
    leaderTakeaway: 'Evaluate current vendor contracts for flexibility clauses; consider a tiered dual-sourcing model.',
    whatHappened: 'Major manufacturers are now prioritizing vertical integration within NAFTA regions to mitigate regional geopolitical volatility.',
    whatToConsiderNext: [
      'Inventory buffer strategy audit',
      'Geopolitical risk assessment of Tier 2 suppliers',
      'Onshoring tax incentive analysis'
    ],
    source: 'Bloomberg',
    date: 'Oct 23, 2024',
    category: 'Market Dynamics'
  },
  {
    id: '3',
    headline: 'EU AI Act: Compliance Deadline Move',
    summary: 'New directives suggest an accelerated timeline for transparency requirements in generative AI.',
    whyItMatters: 'Non-compliance risks reach up to 7% of global annual turnover. Audit readiness must move to monthly.',
    leaderTakeaway: 'Direct the CTO office to prioritize automated data tagging and establish human-in-the-loop protocols.',
    whatHappened: 'The European Union has moved up the implementation timeline for high-risk AI system documentation.',
    whatToConsiderNext: [
      'Monthly internal audit framework',
      'Data lineage automation investment',
      'Legal counsel briefing on liability shifts'
    ],
    source: 'Financial Times',
    date: 'Oct 22, 2024',
    category: 'Regulatory'
  },
  {
    id: '4',
    headline: 'LLM Latency Breakthrough',
    summary: 'New model quantization allows local execution with 0.1s response time.',
    whyItMatters: 'Disrupts cloud-only dependency for mobile features. Enables private, on-device data processing.',
    leaderTakeaway: 'Evaluate Edge-AI hardware requirements for the next product refresh cycle.',
    whatHappened: 'Researchers discovered a new 4-bit quantization technique that maintains performance while halving memory requirements.',
    whatToConsiderNext: [
      'On-device AI roadmap',
      'Hardware specification updates',
      'Data privacy marketing opportunities'
    ],
    source: 'Emerging AI',
    date: 'Oct 21, 2024',
    category: 'Technology'
  },
  {
    id: '5',
    headline: 'Anthropic Claude 3.5 Sonnet: Coding Benchmarks',
    summary: 'New benchmarks show Sonnet outperforming existing models in complex Python and Java refactoring.',
    whyItMatters: 'Productivity gain potential for engineering teams is now quantifiable at roughly 35% for maintenance tasks.',
    leaderTakeaway: 'Incorporate AI coding assistants into standard engineering workflows to unlock senior developer capacity.',
    whatHappened: 'Anthropic released updated performance metrics for its mid-tier model, showing unprecedented reasoning capabilities.',
    whatToConsiderNext: [
      'Engineering headcount planning revision',
      'AI assistant licensing audit',
      'Quality assurance automation shift'
    ],
    source: 'Anthropic',
    date: 'Oct 20, 2024',
    category: 'Productivity'
  }
];
