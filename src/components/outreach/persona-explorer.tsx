export default function PersonaExplorer() {
  const personas = [
    {
      id: 1,
      name: "The Tech-Savvy Innovator",
      role: "CTO / VP of Engineering",
      companySize: "200-1000 employees",
      industry: "SaaS & Technology",
      painPoints: [
        "Scaling infrastructure efficiently",
        "Reducing technical debt",
        "Attracting top engineering talent"
      ],
      goals: [
        "Improve system reliability",
        "Accelerate product development",
        "Reduce operational costs"
      ],
      preferredChannels: ["Email", "LinkedIn", "Technical Blogs"],
      messaging: "Focus on technical benefits, scalability, and performance improvements"
    },
    {
      id: 2,
      name: "The Growth-Oriented Executive",
      role: "CEO / President",
      companySize: "50-500 employees",
      industry: "Professional Services",
      painPoints: [
        "Acquiring new customers efficiently",
        "Improving sales team productivity",
        "Demonstrating ROI to stakeholders"
      ],
      goals: [
        "Increase revenue by 30% YoY",
        "Optimize sales processes",
        "Build predictable revenue streams"
      ],
      preferredChannels: ["Email", "Phone", "Industry Events"],
      messaging: "Emphasize revenue impact, efficiency gains, and competitive advantage"
    },
    {
      id: 3,
      name: "The Operations Leader",
      role: "COO / Director of Operations",
      companySize: "100-2000 employees",
      industry: "Manufacturing & Logistics",
      painPoints: [
        "Streamlining complex workflows",
        "Reducing operational costs",
        "Improving supply chain visibility"
      ],
      goals: [
        "Increase operational efficiency by 25%",
        "Reduce waste and bottlenecks",
        "Implement real-time monitoring"
      ],
      preferredChannels: ["Phone", "LinkedIn", "Industry Publications"],
      messaging: "Highlight process optimization, cost savings, and operational excellence"
    }
  ];

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Persona Explorer
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <Users className="h-3 w-3" /> View All Personas
          </div>
        </div>

        {/* Persona Cards */}
        <div className="space-y-4">
          {personas.map((persona) => (
            <div key={persona.id} className="border-t border-slate-700 pt-4 first:border-t-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-indigo-900/30 rounded-full">
                    <Brain className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-medium text-slate-100">{persona.name}</h3>
                    <span className="text-xs bg-indigo-900/20 text-indigo-400 px-2 py-0.5 rounded">
                      {persona.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{persona.companySize} • {persona.industry}</p>

                  {/* Pain Points */}
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-100 mb-1">Pain Points</p>
                    <div className="flex flex-wrap gap-1">
                      {persona.painPoints.map((point, index) => (
                        <span key={index} className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">
                          {point}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-100 mb-1">Goals</p>
                    <div className="flex flex-wrap gap-1">
                      {persona.goals.map((goal, index) => (
                        <span key={index} className="bg-slate-800/50 px-2 py-0.5 rounded text-xs text-slate-300">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Channels */}
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-100 mb-1">Preferred Channels</p>
                    <div className="flex flex-wrap gap-1">
                      {persona.preferredChannels.map((channel, index) => (
                        <span key={index} className="bg-indigo-900/20 text-indigo-400 px-2 py-0.5 rounded text-xs">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Messaging Guidelines */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Messaging Guidelines</p>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">
              <strong>Do:</strong> Personalize based on role-specific challenges, use data-backed value propositions, keep messages concise and action-oriented
            </p>
            <p className="text-xs text-slate-400 mt-1">
              <strong>Don't:</strong> Use generic templates, focus on features over benefits, make assumptions without research
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}