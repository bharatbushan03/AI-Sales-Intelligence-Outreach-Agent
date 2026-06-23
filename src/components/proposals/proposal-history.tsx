export default function ProposalHistory() {
  const proposals = [
    {
      id: 1,
      title: "Enterprise AI Platform Implementation",
      client: "TechCorp Solutions",
      value: 750000,
      status: "won",
      date: "2026-06-15",
      probability: 100,
      owner: "John Doe"
    },
    {
      id: 2,
      title: "Customer Analytics Dashboard",
      client: "StartupXYZ Inc",
      value: 250000,
      status: "lost",
      date: "2026-06-10",
      probability: 0,
      owner: "Sarah Chen"
    },
    {
      id: 3,
      title: "Supply Chain Optimization System",
      client: "Global Enterprises Ltd",
      value: 2000000,
      status: "pending",
      date: "2026-06-05",
      probability: 65,
      owner: "Mike Rodriguez"
    },
    {
      id: 4,
      title: "Marketing Automation Suite",
      client: "Innovatech Dynamics",
      value: 450000,
      status: "won",
      date: "2026-05-28",
      probability: 100,
      owner: "Lisa Wang"
    },
    {
      id: 5,
      title: "Data Migration & Modernization",
      client: "DataFlow Systems",
      value: 300000,
      status: "pending",
      date: "2026-05-20",
      probability: 40,
      owner: "John Doe"
    }
  ];

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-100">
            Proposal History
          </h2>
          <button className="text-sm text-indigo-400 hover:text-indigo-300">
            <FileText className="h-3 w-3" /> View All
          </div>
        </div>

        {/* Proposal List */}
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="border-t border-slate-800 pt-3 first:border-t-0">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-2 h-2 rounded-full ${
                    proposal.status === 'won'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : proposal.status === 'lost'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-indigo-500/20 text-indigo-400'
                  }`}>
                    {proposal.status === 'won' && <CheckCircle className="h-3 w-3" />}
                    {proposal.status === 'lost' && <X className="h-3 w-3" />}
                    {proposal.status === 'pending' && <Clock className="h-3 w-3" />}
                  </div>
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-xs font-medium text-slate-100">{proposal.title}</p>
                  <p className="text-xs text-slate-400">{proposal.client}</p>
                  <div className="flex items-center gap-3 text-xs mt-1">
                    <span>
                      <DollarSign className="h-3 w-3" /> ${(proposal.value / 1000).toFixed(0)}K
                    </span>
                    <span>
                      <Clock className="h-3 w-3" /> {proposal.date}
                    </span>
                    <span className={`text-xs ${
                      proposal.status === 'won'
                        ? 'text-emerald-400'
                        : proposal.status === 'lost'
                        ? 'text-red-400'
                        : 'text-indigo-400'
                    }`}>
                      {proposal.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Proposal Summary */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <p className="text-sm font-medium text-slate-100 mb-2">Proposal Summary (Last 6 Months)</p>
          <div className="grid gap-3 grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-100">Total Proposals</p>
              <p className="text-lg font-bold text-slate-100">45</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Won Proposals</p>
              <p className="text-lg font-bold text-emerald-400">18</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Lost Proposals</p>
              <p className="text-lg font-bold text-red-400">15</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Pending Proposals</p>
              <p className="text-lg font-bold text-indigo-400">12</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Win Rate</p>
              <p className="text-lg font-bold text-indigo-400">40%</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Avg. Proposal Value</p>
              <p className="text-lg font-bold text-indigo-400">$185K</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-100">Total Pipeline Value</p>
              <p className="text-lg font-bold text-indigo-400">$2.4M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}