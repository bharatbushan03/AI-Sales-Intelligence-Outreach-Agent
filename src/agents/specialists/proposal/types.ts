export interface SolutionDesign {
  solutionName: string;
  objectives: string[];
  businessBenefits: string[];
  implementationApproach: string;
  expectedOutcomes: string[];
}

export interface BusinessCase {
  currentState: string;
  futureState: string;
  challenges: string[];
  businessImpact: string;
  strategicBenefits: string[];
}

export interface RoiAnalysis {
  estimatedInvestment: number;
  projectedSavings: number;
  projectedRevenueImpact: number;
  paybackPeriod: string;
  roiPercentage: number;
  assumptions: string[];
}

export interface ProposalDocument {
  coverPage: {
    title: string;
    subtitle: string;
    preparedFor: string;
    preparedBy: string;
    date: string;
  };
  executiveSummary: string;
  companyUnderstanding: string;
  challengesIdentified: string[];
  proposedSolution: string;
  expectedOutcomes: string[];
  roiAnalysisSummary: string;
  implementationRoadmap: string[];
  risksMitigation: Array<{ risk: string; mitigation: string }>;
  nextSteps: string[];
}

export interface ExecutiveSummary {
  summaryText: string;
  businessValue: string;
  strategicImpact: string;
  expectedOutcomes: string[];
}

export interface RoadmapPhase {
  phase: string;
  objectives: string;
  deliverables: string[];
  timeline: string;
  risks: string[];
}

export interface SlideOutline {
  slideTitle: string;
  keyPoints: string[];
  speakerNotes: string;
}

export interface ProposalPackage {
  id?: string;
  proposal: ProposalDocument;
  businessCase: BusinessCase;
  roiAnalysis: RoiAnalysis;
  executiveSummary: ExecutiveSummary;
  implementationRoadmap: RoadmapPhase[];
  presentationOutline: SlideOutline[];
  qualityScore: number;
  recommendations: string[];
  metadata: {
    companyName: string;
    timestamp: string;
    query?: string;
    workflowId?: string;
  };
}
