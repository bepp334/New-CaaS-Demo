import React, { useState } from 'react';
import { ScenarioNode, ComplianceResult } from '../types';
import { Database, Copy, Trash2, FileJson, Table2, ShieldCheck, Download, Upload, User, Bot } from 'lucide-react';

interface DataTableProps {
  nodes: ScenarioNode[];
  compliance?: ComplianceResult;
  onDeleteNode?: (id: string) => void;
}

type Tab = 'table' | 'json' | 'audit';

export const DataTable: React.FC<DataTableProps> = ({ nodes, compliance, onDeleteNode }) => {
  const [activeTab, setActiveTab] = useState<Tab>('table');

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(nodes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "scenario_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      
      {/* Header with Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
                <Database className="w-4 h-4" />
                <span>Structured Data & Audit</span>
            </div>
            
            <div className="flex gap-2">
                <button className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-2 py-1.5 rounded hover:bg-gray-50 text-gray-600">
                    <Upload className="w-3 h-3" /> Import
                </button>
                <button onClick={exportData} className="flex items-center gap-1 text-xs bg-indigo-50 border border-indigo-200 px-2 py-1.5 rounded hover:bg-indigo-100 text-indigo-700 font-medium">
                    <Download className="w-3 h-3" /> Export JSON
                </button>
            </div>
        </div>
        
        <div className="flex px-4 gap-4">
            <button 
                onClick={() => setActiveTab('table')}
                className={`pb-2 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'table' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Table2 className="w-3 h-3" /> Data Grid
            </button>
            <button 
                onClick={() => setActiveTab('json')}
                className={`pb-2 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'json' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <FileJson className="w-3 h-3" /> Raw JSON (AI)
            </button>
            <button 
                onClick={() => setActiveTab('audit')}
                className={`pb-2 text-xs font-medium border-b-2 flex items-center gap-1.5 transition-colors ${activeTab === 'audit' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <ShieldCheck className="w-3 h-3" /> Compliance Log
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar bg-white">
        
        {/* VIEW 1: DATA TABLE */}
        {activeTab === 'table' && (
            <div className="min-w-full inline-block align-middle">
                {nodes.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20 text-sm">No Data Records</div>
                ) : (
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="sticky top-0 bg-gray-50 z-10 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">ID</th>
                            <th className="sticky top-0 bg-gray-50 z-10 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Type</th>
                            <th className="sticky top-0 bg-gray-50 z-10 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Payload & Tag</th>
                            <th className="sticky top-0 bg-gray-50 z-10 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 w-24">Performance</th>
                            <th className="sticky top-0 bg-gray-50 z-10 p-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                        {nodes.map((node) => (
                        <tr key={node.id} className="group hover:bg-blue-50/50 transition-colors">
                            <td className="p-3 font-mono text-gray-500 text-[10px] align-top">{node.id}</td>
                            <td className="p-3 align-top">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide
                                    ${node.type === 'text' ? 'bg-blue-100 text-blue-800' : 
                                    node.type === 'image' ? 'bg-purple-100 text-purple-800' :
                                    node.type === 'question' ? 'bg-orange-100 text-orange-800' :
                                    node.type === 'offer' ? 'bg-red-100 text-red-800' :
                                    'bg-green-100 text-green-800'
                                    }`}>
                                    {node.type}
                                </span>
                            </td>
                            <td className="p-3 text-gray-700 align-top max-w-xs">
                                <div className="line-clamp-2 text-xs mb-1">{node.content}</div>
                                {node.meta?.saveToTag && (
                                    <div className="inline-flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                        <Database className="w-3 h-3 text-gray-500" />
                                        <span className="text-[10px] font-mono text-gray-600">{node.meta.saveToTag.id}</span>
                                    </div>
                                )}
                            </td>
                            <td className="p-3 align-top">
                                {node.analytics ? (
                                    <div className="flex flex-col gap-1">
                                        {node.analytics.ctr && (
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="text-gray-400">CTR</span>
                                                <span className="font-bold text-gray-700">{node.analytics.ctr}</span>
                                            </div>
                                        )}
                                        {node.analytics.impressions && (
                                            <div className="flex justify-between items-center text-[10px]">
                                                <span className="text-gray-400">Imp</span>
                                                <span className="text-gray-700">{node.analytics.impressions.toLocaleString()}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-[10px] text-gray-300">-</span>
                                )}
                            </td>
                            <td className="p-3 text-right align-top opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex justify-end gap-2">
                                    <button className="p-1 hover:bg-gray-200 rounded text-gray-500">
                                        <Copy className="w-3 h-3" />
                                    </button>
                                    {onDeleteNode && (
                                        <button onClick={() => onDeleteNode(node.id)} className="p-1 hover:bg-red-100 rounded text-red-500">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                )}
            </div>
        )}

        {/* VIEW 2: RAW JSON */}
        {activeTab === 'json' && (
            <div className="p-4 bg-slate-900 min-h-full">
                <div className="text-gray-400 text-xs mb-2 font-mono">
                    // This is the source of truth for AI generation and cross-platform import/export.
                </div>
                <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap leading-relaxed">
                    {JSON.stringify(nodes, null, 2)}
                </pre>
            </div>
        )}

        {/* VIEW 3: COMPLIANCE AUDIT */}
        {activeTab === 'audit' && (
            <div className="p-6">
                <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    Legal Check History (Audit Trail)
                </h3>
                
                {!compliance?.history || compliance.history.length === 0 ? (
                    <div className="text-sm text-gray-400 italic">No compliance records found.</div>
                ) : (
                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-4">
                        {compliance.history.map((log) => (
                            <div key={log.id} className="relative pl-6">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                                    log.action === 'check_passed' ? 'bg-green-500' :
                                    log.action === 'check_failed' ? 'bg-red-500' :
                                    'bg-blue-500'
                                }`}></div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-700">{log.timestamp}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                            log.actor === 'AI_Checker' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                            log.actor === 'Legal_Dept' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                            'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                            {log.actor === 'AI_Checker' && <Bot className="w-3 h-3 inline mr-1" />}
                                            {log.actor === 'Legal_Dept' && <User className="w-3 h-3 inline mr-1" />}
                                            {log.actor}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-900">
                                        {log.action.replace('_', ' ').toUpperCase()}
                                    </div>
                                    {log.comment && (
                                        <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 border border-gray-200 mt-1">
                                            "{log.comment}"
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="mt-8 pt-4 border-t border-gray-100">
                    <div className="bg-blue-50 p-3 rounded-lg flex gap-3">
                         <div className="text-blue-600 font-bold text-xs mt-0.5">Note:</div>
                         <div className="text-xs text-blue-800">
                             この監査ログはブロックチェーン技術（Mock）により改ざん不可能な状態で保存されます。
                             法的紛争時の証跡として利用可能です。
                         </div>
                    </div>
                </div>
            </div>
        )}

      </div>
      
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-[10px] text-gray-400 font-mono text-center flex justify-between px-4">
        <span>SCHEMA: v2.4.0 (JSON-LD Compatible)</span>
        <span>{nodes.length} Objects</span>
      </div>
    </div>
  );
};