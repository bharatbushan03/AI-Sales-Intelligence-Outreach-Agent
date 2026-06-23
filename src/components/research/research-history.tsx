export default function ResearchHistory() {
  const researchHistory = [
    {
      id: 1,
      company: "TechCorp Solutions",
      date: "2026-06-20",
      type: "Deep Dive Report",
      status: "completed",
      insights: 12,
      confidence: "92%"
    },
    {
      id: 2,
      company: "StartupXYZ Inc",
      date: "2026-06-18",
      type: "Competitive Analysis",
      status: "completed",
      insights: 8,
      confidence: "78%"
    },
    {
      id: 3,
      company: "Global Enterprises Ltd",
      date: "2026-06-15",
      type: "Market Opportunity Study",
      status: "in_progress",
      insights: 5,
      confidence: "85%"
    },
    {
      id: 4,
      company: "Innovatech Dynamics",
      date: "2026-06-10",
      type: "Technology Landscape",
      status: "completed",
      insights: 15,
      confidence: "88%"
    }
  ];

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Research History
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            View All
          </div>
        </div>

        <div className="space-y-3">
          {researchHistory.map((item) => (
            <div key={item.id} className="border-t border-slate-700 pt-3 first:border-t-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`h-3 w-3 rounded-full ${
                    item.status === 'completed'
                      ? 'bg-indigo-500'
                      : item.status === 'in_progress'
                      ? 'bg-yellow-500'
                      : 'bg-slate-500'
                  }`} />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium text-slate-100">
                    {item.company}
                  </p>
                  <p className="text-xs text-slate-400">
                    {item.type} • {item.date}
                  </p>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span>
                      <Brain className="h-3 w-3" /> {item.insights} Insights
                    </span>
                    <span className={`text-xs ${
                      parseInt(item.confidence) >= 90
                        ? 'text-indigo-400'
                        : parseInt(item.confidence) >= 80
                        ? 'text-green-400'
                        : parseInt(item.confidence) >= 70
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}>
                      {item.confidence} Confidence
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}