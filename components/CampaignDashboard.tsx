import React from 'react';
import { Scenario } from '../types';
import { Calendar, CheckCircle, Clock, FileEdit, BarChart2, Plus, ArrowUpRight, Search, Filter } from 'lucide-react';

interface CampaignDashboardProps {
  scenarios: Scenario[];
  onSelectScenario: (id: string) => void;
}

export const CampaignDashboard: React.FC<CampaignDashboardProps> = ({ scenarios, onSelectScenario }) => {
  const sent = scenarios.filter(s => s.status === 'sent');
  const scheduled = scenarios.filter(s => s.status === 'scheduled');
  const drafts = scenarios.filter(s => s.status === 'draft');

  return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden">
      {/* Dashboard Header */}
      <div className="bg-white px-6 py-5 border-b border-gray-200 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Campaign Dashboard
            </h2>
            <p className="text-xs text-gray-500 mt-1">Manage broadcast schedules and monitor performance.</p>
          </div>
          <div className="flex gap-3">
              <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search campaigns..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64" />
              </div>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm shadow hover:bg-indigo-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Create Campaign
              </button>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        
        {/* Section 1: Scheduled (Upcoming) */}
        <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <Clock className="w-4 h-4 text-orange-500" /> Upcoming Schedules
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduled.map(s => (
                    <div key={s.id} onClick={() => onSelectScenario(s.id)} className="bg-white p-4 rounded-xl border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-mono bg-orange-50 text-orange-700 px-2 py-0.5 rounded">{s.schedule}</span>
                            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                        </div>
                        <h4 className="font-bold text-gray-800 mb-2 truncate">{s.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 h-8">{s.nodes[0]?.content}</p>
                        <div className="mt-4 flex items-center gap-2">
                             <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Target: All Users</span>
                             <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100">Ready</span>
                        </div>
                    </div>
                ))}
                {scheduled.length === 0 && <div className="text-sm text-gray-400 italic p-4">No upcoming campaigns.</div>}
            </div>
        </div>

        {/* Section 2: Drafts */}
        <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <FileEdit className="w-4 h-4 text-gray-500" /> Drafts
            </h3>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-bold">
                        <tr>
                            <th className="p-4">Campaign Name</th>
                            <th className="p-4">Scheduled For</th>
                            <th className="p-4">Compliance</th>
                            <th className="p-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {drafts.map(s => (
                            <tr key={s.id} onClick={() => onSelectScenario(s.id)} className="hover:bg-gray-50 cursor-pointer transition-colors">
                                <td className="p-4 font-medium text-gray-800">
                                    {s.name}
                                    <div className="text-xs text-gray-400 font-normal mt-0.5 line-clamp-1">{s.nodes[0]?.content}</div>
                                </td>
                                <td className="p-4 text-gray-500 font-mono text-xs">{s.schedule || 'Unscheduled'}</td>
                                <td className="p-4">
                                    {s.compliance?.status === 'pending' && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Pending Check</span>}
                                    {s.compliance?.status === 'approved' && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Approved</span>}
                                    {!s.compliance && <span className="text-xs text-gray-400">-</span>}
                                </td>
                                <td className="p-4 text-right text-indigo-600 font-bold text-xs">Edit &gt;</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Section 3: Past Performance */}
        <div className="mb-4">
             <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <BarChart2 className="w-4 h-4 text-indigo-600" /> Performance History
            </h3>
            <div className="space-y-3">
                {sent.map(s => (
                    <div key={s.id} onClick={() => onSelectScenario(s.id)} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-center justify-between hover:border-indigo-300 cursor-pointer transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 p-2 rounded-full">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <div className="text-xs text-gray-400 font-mono mb-0.5">{s.sentDate}</div>
                                <h4 className="font-bold text-gray-800">{s.name}</h4>
                            </div>
                        </div>
                        
                        <div className="flex gap-8 pr-8">
                            <div className="text-center">
                                <div className="text-[10px] text-gray-400 uppercase">Open Rate</div>
                                <div className="font-bold text-gray-800 text-lg">{s.stats?.openRate}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-gray-400 uppercase">CTR</div>
                                <div className="font-bold text-indigo-600 text-lg">{s.stats?.ctr}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-[10px] text-gray-400 uppercase">CVR</div>
                                <div className="font-bold text-pink-600 text-lg">{s.stats?.cvr}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};