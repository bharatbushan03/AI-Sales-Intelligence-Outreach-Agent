import { GoogleGenerativeAI } from '@google/generative-ai';
import { RoiAnalysis, SolutionDesign } from './types';
import { ROI_ANALYSIS_PROMPT } from '../../prompts/proposal-prompts';
import { logger } from '../../../utils/logger';

export class ROIEngine {
  constructor(private genAI: GoogleGenerativeAI | null) {}

  public async calculate(
    companyName: string,
    opportunityData: Record<string, unknown>,
    solutionDesign: SolutionDesign,
  ): Promise<RoiAnalysis> {
    if (this.genAI) {
      try {
        const model = this.genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Company Name: ${companyName}\nOpportunity Analysis:\n${JSON.stringify(
          opportunityData,
        )}\nSolution Design:\n${JSON.stringify(solutionDesign)}`;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: ROI_ANALYSIS_PROMPT,
        });

        return JSON.parse(result.response.text()) as RoiAnalysis;
      } catch (error) {
        logger.error(
          `ROIEngine calculations failed for ${companyName}. Falling back to mock.`,
          error,
        );
      }
    }

    return this.getMockRoi(companyName);
  }

  private getMockRoi(companyName: string): RoiAnalysis {
    const name = companyName.toLowerCase();

    if (name.includes('stripe')) {
      return {
        estimatedInvestment: 75000,
        projectedSavings: 180000,
        projectedRevenueImpact: 450000,
        paybackPeriod: '4 months',
        roiPercentage: 740,
        assumptions: [
          'Average decline recovery rate is modeled at 15% across localized checkout channels',
          'Hourly engineering cost is estimated at $150/hr for onboarding support',
          'Connect setup setups are scaled across 2,000 sub-merchant registrations annually',
        ],
      };
    }

    if (name.includes('hubspot')) {
      return {
        estimatedInvestment: 45000,
        projectedSavings: 95000,
        projectedRevenueImpact: 220000,
        paybackPeriod: '6 months',
        roiPercentage: 600,
        assumptions: [
          'Enterprise object sync lag reduction decreases sales outreach cycle delays',
          'Automated style guides prevent content re-writes and mock legal review cycles',
          'Baseline licensing costs saved by deprecating third-party integration brokers',
        ],
      };
    }

    if (name.includes('salesforce')) {
      return {
        estimatedInvestment: 120000,
        projectedSavings: 280000,
        projectedRevenueImpact: 650000,
        paybackPeriod: '8 months',
        roiPercentage: 675,
        assumptions: [
          'Einstein AI Agent grounding connector cuts integration setups by 120 dev hours',
          'Support ticketing automation reduces live representative hours by 25%',
          'Prevents customer compliance risks by verifying data schema masking patterns',
        ],
      };
    }

    if (name.includes('notion')) {
      return {
        estimatedInvestment: 30000,
        projectedSavings: 65000,
        projectedRevenueImpact: 140000,
        paybackPeriod: '5 months',
        roiPercentage: 580,
        assumptions: [
          'Wiki index cleanups reduce employee time wasted searching documentation',
          'Faster page load speeds on Notion public sites increase signup conversion by 5%',
          'Reduces duplicate software usage by consolidating internal tools within Notion pages',
        ],
      };
    }

    if (name.includes('shopify')) {
      return {
        estimatedInvestment: 90000,
        projectedSavings: 210000,
        projectedRevenueImpact: 520000,
        paybackPeriod: '6 months',
        roiPercentage: 710,
        assumptions: [
          'Shopify Collective inventory ledger removes out-of-stock checkouts and refunds',
          'Shopify Audiences ad spend value attribution prevents merchant churn on Plus tiers',
          'Increases total merchant gross merchandise volume by driving partner collaborations',
        ],
      };
    }

    return {
      estimatedInvestment: 25000,
      projectedSavings: 45000,
      projectedRevenueImpact: 110000,
      paybackPeriod: '6 months',
      roiPercentage: 520,
      assumptions: [
        'Operations automation reduces manual work hours across team workflows',
        'Consolidated database sync metrics speed up executive strategic decision periods',
      ],
    };
  }
}
export default ROIEngine;
