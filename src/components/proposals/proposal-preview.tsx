"use client";

import { Edit, FileText, Link, Cloud } from 'lucide-react';
import { useState } from 'react';

export default function ProposalPreview() {
  const [saving, setSaving] = useState(false);
  const [driveLink, setDriveLink] = useState('');

  const handleSaveToDrive = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/proposals/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Strategic Partnership Proposal - TechCorp Solutions',
          content: '# Strategic Partnership Proposal\n\nFor TechCorp Solutions\n\n## Executive Summary\n\nThis proposal outlines a comprehensive technology partnership designed to address TechCorp Solutions current infrastructure challenges while positioning them for future growth.'
        }),
      });
      const data = await res.json();
      if (data.success && data.driveLink) {
        setDriveLink(data.driveLink);
      } else {
        alert(data.error || 'Failed to save to Drive');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Proposal Preview
          </h2>
          <div className="flex items-center gap-2">
            <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <Edit className="h-3 w-3" /> Edit Proposal
            </button>
            <button className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              <FileText className="h-3 w-3" /> Export PDF
            </button>
            <button 
              onClick={handleSaveToDrive}
              disabled={saving}
              className={`text-sm flex items-center gap-1 ${saving ? 'text-slate-400 cursor-not-allowed' : 'text-emerald-400 hover:text-emerald-300'}`}
            >
              <Cloud className="h-3 w-3" /> {saving ? 'Saving...' : 'Save to Drive'}
            </button>
            <button 
              onClick={() => driveLink ? window.open(driveLink, '_blank') : null}
              className={`text-sm flex items-center gap-1 ${driveLink ? 'text-indigo-400 hover:text-indigo-300' : 'text-slate-500 cursor-not-allowed'}`}
            >
              <Link className="h-3 w-3" /> {driveLink ? 'Open in Drive' : 'Share Link'}
            </button>
          </div>
        </div>

        {/* Proposal Content */}
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center pb-4 border-b border-slate-800">
            <h1 className="text-2xl font-bold text-slate-100">
              Strategic Partnership Proposal
            </h1>
            <p className="text-sm text-slate-400 mb-2">
              For TechCorp Solutions
            </p>
            <p className="text-xs text-slate-500">
              Prepared: June 22, 2026 • Valid Until: July 22, 2026
            </p>
          </div>

          {/* Executive Summary */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Executive Summary
            </h2>
            <p className="text-slate-400">
              This proposal outlines a comprehensive technology partnership designed to address TechCorp Solutions'
              current infrastructure challenges while positioning them for future growth. Our solution combines
              cutting-edge AI capabilities with proven enterprise architecture to deliver measurable business outcomes.
            </p>
          </div>

          {/* Technical Approach */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Technical Approach
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Phase 1: Assessment & Planning</p>
                  <p className="text-xs text-slate-400">Weeks 1-2</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Phase 2: Implementation</p>
                  <p className="text-xs text-slate-400">Weeks 3-8</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Phase 3: Optimization & Training</p>
                  <p className="text-xs text-slate-400">Weeks 9-12</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Phase 4: Go-Live & Support</p>
                  <p className="text-xs text-slate-400">Week 13+</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Investment Summary
            </h2>
            <div className="grid gap-4 grid-cols-2">
              <div>
                <p className="text-sm font-medium text-slate-100">Implementation Services</p>
                <p className="text-lg font-bold text-indigo-400">$120,000</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">Licensing (Annual)</p>
                <p className="text-lg font-bold text-indigo-400">$60,000</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">Training & Change Management</p>
                <p className="text-lg font-bold text-indigo-400">$25,000</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">Ongoing Support</p>
                <p className="text-lg font-bold text-indigo-400">$15,000/year</p>
              </div>
              <div className="col-span-2">
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <p className="text-sm font-medium text-slate-100">Total First Year Investment</p>
                  <p className="text-xl font-bold text-indigo-600">$220,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Expected Outcomes */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Expected Business Outcomes
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Operational Efficiency</p>
                  <p className="text-xs text-indigo-400">40% reduction in manual processes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Cost Savings</p>
                  <p className="text-xs text-indigo-400">$350K annually</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Revenue Growth</p>
                  <p className="text-xs text-indigo-400">25% increase in deal velocity</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-100">Customer Satisfaction</p>
                  <p className="text-xs text-indigo-400">35% improvement in CSAT scores</p>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">
              Terms & Conditions
            </h2>
            <p className="text-slate-400 text-sm">
              • Payment Terms: 50% upon signing, 50% upon completion<br/>
              • Timeline: 13 weeks from project kickoff<br/>
              • Warranty: 90 days post-implementation support included<br/>
              • Confidentiality: Mutual NDA to be executed prior to commencement<br/>
              • Governance: Monthly steering committee meetings with executive sponsors
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}