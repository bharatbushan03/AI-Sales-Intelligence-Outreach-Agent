import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  MessageCircle,
  Banknote,
  Edit,
  Plus,
} from 'lucide-react';

interface CRMColumn {
  id: string;
  title: string;
  color: string;
  leadCount: number;
  value: number;
  leads: {
    id: number;
    name: string;
    company: string;
    value: number;
    probability: number;
    daysInStage: number;
    lastActivity: string;
    owner: string;
  }[];
}

const crmData: CRMColumn[] = [
  {
    id: 'prospecting',
    title: 'Prospecting',
    color: 'bg-indigo-500/20 border-indigo-500',
    leadCount: 12,
    value: 600000,
    leads: [
      {
        id: 1,
        name: 'Alex Johnson',
        company: 'TechStartup Inc',
        value: 50000,
        probability: 10,
        daysInStage: 5,
        lastActivity: '2 hours ago',
        owner: 'John Doe',
      },
      {
        id: 2,
        name: 'Sarah Chen',
        company: 'Innovatech Solutions',
        value: 75000,
        probability: 15,
        daysInStage: 3,
        lastActivity: '1 day ago',
        owner: 'Sarah Chen',
      },
    ],
  },
  {
    id: 'qualification',
    title: 'Qualification',
    color: 'bg-yellow-500/20 border-yellow-500',
    leadCount: 8,
    value: 400000,
    leads: [
      {
        id: 3,
        name: 'Mike Rodriguez',
        company: 'GrowthCorp Ltd',
        value: 100000,
        probability: 30,
        daysInStage: 7,
        lastActivity: '3 hours ago',
        owner: 'Mike Rodriguez',
      },
      {
        id: 4,
        name: 'Lisa Wang',
        company: 'DataFlow Systems',
        value: 150000,
        probability: 25,
        daysInStage: 2,
        lastActivity: '5 hours ago',
        owner: 'Lisa Wang',
      },
    ],
  },
  {
    id: 'proposal',
    title: 'Proposal',
    color: 'bg-green-500/20 border-green-500',
    leadCount: 5,
    value: 750000,
    leads: [
      {
        id: 5,
        name: 'David Kim',
        company: 'CloudTech Inc',
        value: 200000,
        probability: 50,
        daysInStage: 10,
        lastActivity: '1 day ago',
        owner: 'John Doe',
      },
      {
        id: 6,
        name: 'Jennifer Lee',
        company: 'AI Dynamics',
        value: 300000,
        probability: 45,
        daysInStage: 5,
        lastActivity: '2 hours ago',
        owner: 'Sarah Chen',
      },
    ],
  },
  {
    id: 'negotiation',
    title: 'Negotiation',
    color: 'bg-blue-500/20 border-blue-500',
    leadCount: 3,
    value: 900000,
    leads: [
      {
        id: 7,
        name: 'Robert Taylor',
        company: 'Enterprise Solutions',
        value: 400000,
        probability: 70,
        daysInStage: 14,
        lastActivity: '4 hours ago',
        owner: 'Mike Rodriguez',
      },
      {
        id: 8,
        name: 'Amanda Scott',
        company: 'Global Industries',
        value: 300000,
        probability: 65,
        daysInStage: 7,
        lastActivity: '1 day ago',
        owner: 'Lisa Wang',
      },
      {
        id: 9,
        name: 'Chris Brown',
        company: 'Future Tech',
        value: 200000,
        probability: 60,
        daysInStage: 10,
        lastActivity: '3 hours ago',
        owner: 'John Doe',
      },
    ],
  },
  {
    id: 'closed-won',
    title: 'Closed Won',
    color: 'bg-emerald-500/20 border-emerald-500',
    leadCount: 15,
    value: 1200000,
    leads: [
      {
        id: 10,
        name: 'Mark Davis',
        company: 'Success Corp',
        value: 250000,
        probability: 100,
        daysInStage: 20,
        lastActivity: '5 days ago',
        owner: 'Sarah Chen',
      },
      {
        id: 11,
        name: 'Karen White',
        company: 'Premier Services',
        value: 150000,
        probability: 100,
        daysInStage: 10,
        lastActivity: '3 days ago',
        owner: 'Lisa Wang',
      },
    ],
  },
];

export default function CRMKanban() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="space-y-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">CRM Pipeline</h2>
          <div className="flex items-center gap-2">
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              <Plus className="h-3 w-3" /> Add Lead
            </button>
            <button className="text-sm text-indigo-400 hover:text-indigo-300">
              <Edit className="h-3 w-3" /> Edit Pipeline
            </button>
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
            <div>
              <p className="font-medium">Total Leads</p>
              <p className="text-lg font-bold text-slate-100">43</p>
            </div>
            <div>
              <p className="font-medium">Pipeline Value</p>
              <p className="text-lg font-bold text-slate-100">$3.85M</p>
            </div>
            <div>
              <p className="font-medium">Win Rate</p>
              <p className="text-lg font-bold text-indigo-400">35%</p>
            </div>
            <div>
              <p className="font-medium">Avg. Deal Size</p>
              <p className="text-lg font-bold text-slate-100">$89K</p>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="overflow-x-auto">
          <div className="flex space-x-4">
            {crmData.map((column) => (
              <div key={column.id} className="min-w-[200px] flex-1 space-y-3">
                <div className={`rounded-lg p-3 ${column.color}`}>
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-sm font-medium text-slate-100">{column.title}</h3>
                    <span className="text-xs font-medium">{column.leadCount} leads</span>
                  </div>
                  <p className="mb-2 text-xs text-slate-400">
                    ${(column.value / 1000).toFixed(0)}K in pipeline
                  </p>

                  {/* Leads in Column */}
                  <div className="space-y-2">
                    {column.leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="rounded-xl border border-slate-800/50 bg-slate-900/30 p-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-100">{lead.name}</p>
                            <p className="text-xs text-slate-400">{lead.company}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-indigo-400">
                              ${(lead.value / 1000).toFixed(0)}K
                            </p>
                            <p className="text-xs text-slate-400">{lead.probability}%</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span>
                            <Clock className="h-3 w-3" /> {lead.daysInStage} days
                          </span>
                          <span>
                            <Users className="h-3 w-3" /> {lead.owner}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
