import React from 'react';
import { Cpu, Server, Shield, Cloud, Terminal, CheckCircle2 } from 'lucide-react';

export default function TechStackPage() {
  const technologies = [
    {
      category: 'AI & Machine Learning',
      icon: Cpu,
      items: [
        {
          name: 'Google Gemini Pro 1.5',
          description: 'Core reasoning engine for all autonomous sub-agents.',
        },
        {
          name: 'Vector Embeddings',
          description: 'Semantic search and memory retrieval for historical sales context.',
        },
      ],
    },
    {
      category: 'Backend & Infrastructure',
      icon: Server,
      items: [
        {
          name: 'Next.js 15 App Router',
          description: 'Server-side rendering, API routes, and React Server Components.',
        },
        {
          name: 'Firebase Firestore',
          description: 'Real-time NoSQL database for agent memory and application state.',
        },
        {
          name: 'Vercel Edge Functions',
          description: 'Global, zero-cold-start compute for rapid AI orchestrations.',
        },
      ],
    },
    {
      category: 'Security & Auth',
      icon: Shield,
      items: [
        {
          name: 'Firebase Authentication',
          description: 'Enterprise-grade identity management with RBAC.',
        },
        {
          name: 'Zod Validation',
          description: 'Strict runtime type checking for all API and LLM boundary inputs.',
        },
      ],
    },
    {
      category: 'Frontend & UI',
      icon: Cloud,
      items: [
        {
          name: 'React 19',
          description: 'Concurrent rendering and transitions for fluid user experiences.',
        },
        {
          name: 'Tailwind CSS',
          description: 'Utility-first styling for rapid, responsive, and beautiful design.',
        },
        { name: 'Lucide Icons', description: 'Clean, consistent vector iconography.' },
      ],
    },
  ];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-100">Technology Stack</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Built natively on the Google Cloud ecosystem, optimized for speed, scale, and
          intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {technologies.map((tech) => (
          <div key={tech.category} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500/10 p-2">
                <tech.icon className="h-6 w-6 text-indigo-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-100">{tech.category}</h2>
            </div>

            <div className="space-y-4">
              {tech.items.map((item) => (
                <div key={item.name} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <h3 className="font-medium text-slate-200">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
