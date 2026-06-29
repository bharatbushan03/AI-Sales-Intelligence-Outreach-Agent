'use client';

import React, { useState, useEffect } from 'react';
import { Joyride, Step, STATUS } from 'react-joyride';

export function GuidedTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const handleStartTour = () => setRun(true);
    window.addEventListener('start-demo-tour', handleStartTour);
    return () => window.removeEventListener('start-demo-tour', handleStartTour);
  }, []);

  const steps: Step[] = [
    {
      target: 'body',
      content:
        'Welcome to the Autonomous B2B Sales Intelligence Agent! Let me show you around the platform.',
      placement: 'center',
    },
    {
      target: '.demo-step-judge-mode',
      content:
        'This is the Judge Mode toggle. It resets the demo environment and seeds data instantly.',
    },
    {
      target: '.nav-dashboard',
      content: "The Executive Dashboard gives a bird's eye view of all pipeline activities.",
    },
    {
      target: '.nav-research',
      content:
        'Company Analysis & Research Agent automatically enrich leads with SEC filings and news.',
    },
    {
      target: '.nav-opportunities',
      content: 'The Opportunity Agent identifies and scores deals based on intent signals.',
    },
    {
      target: '.nav-outreach',
      content:
        "The Outreach Agent generates hyper-personalized campaigns tailored to the prospect's pain points.",
    },
    {
      target: '.nav-crm',
      content: 'The CRM Agent keeps all systems in sync seamlessly without manual data entry.',
    },
    {
      target: '.nav-proposals',
      content: 'The Proposal Agent drafts multi-page enterprise proposals in seconds.',
    },
    {
      target: '.nav-intelligence',
      content: 'The Knowledge Graph maps out competitive landscapes and strategic insights.',
    },
    {
      target: '.nav-war-room',
      content: 'The Sales War Room provides a real-time collaborative workspace for closing deals.',
    },
    {
      target: '.nav-agent-command-center',
      content: 'The Executive AI Copilot orchestrates all underlying sub-agents efficiently.',
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];
    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  // Do not render Joyride on server side
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Joyride steps={steps} run={run} continuous scrollToFirstStep />;
}
