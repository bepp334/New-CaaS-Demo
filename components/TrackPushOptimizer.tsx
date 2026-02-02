import React from 'react';
import { Scenario, TrackStepPurpose } from '../types';
import { Sparkles, Layers, MessageSquare, Image as ImageIcon, Link, ArrowRight, TrendingUp, CalendarDays, Flag, Gift, BookOpen, Smile } from 'lucide-react';

interface TrackPushOptimizerProps {
  scenario: Scenario;
}

const PurposeIcon = ({ purpose }: { purpose?: TrackStepPurpose }) => {
    switch (purpose) {
        case 'welcome': return <Smile className="w-3 h-3 text-pink-500" />;
        case 'education': return <BookOpen className="w-3 h-3 text-blue-500" />;
        case 'offer': return <Gift className="w-3 h-3 text-orange-500" />;
        case 'reminder': return <Flag className="w-3 h-3 text-red-500" />;
        default: return <TrendingUp className="w-3 h-3 text-green-500" />;
    }
};

const PurposeLabel = ({ purpose }: { purpose?: TrackStepPurpose }) => {
    const labels = {
        welcome: '挨拶・導入',
        education: '教育・啓蒙',
        nurturing: '信頼構築',
        offer: 'オファー',
        reminder: 'リマインド'
    };
    return <span>{labels[purpose || 'nurturing'] || 'General'}</span>;
};

export const TrackPushOptimizer: React.FC<TrackPushOptimizerProps> = ({ scenario }) => {
  // Ensure we have 8 days slots. If variant exists, it's active.
  const slots = Array.from({ length: 8 }, (_, i) => {
      const day = i + 1;
      const variantGroup = scenario.variants && scenario.variants[i] ? scenario.variants[i] : [];
      return { day, variantGroup, isActive: variantGroup.length > 0 };
  });

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      
      {/* Header Area */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 shadow-sm z-10">
        <div className="flex justify-between items-start">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-lg font-bold text-slate-800">{scenario.name}</h2>
                    <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1 font-bold">
                        <Sparkles className="w-3 h-3" />
                        AI Optimized
                    </span>
                </div>
                <p className="text-slate-500 text-xs">
                    各ステップの目的(Purpose)に基づき、AIがCVRを最大化するクリエイティブを自動配信しています。
                </p>
            </div>
            <div className="flex gap-4 text-xs">
                <div className="text-center">
                    <div className="text-slate-400 font-medium">Avg Open Rate</div>
                    <div className="font-bold text-slate-800 text-lg">42.8%</div>
                </div>
                <div className="text-center">
                    <div className="text-slate-400 font-medium">Avg CVR</div>
                    <div className="font-bold text-slate-800 text-lg">8.4%</div>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content: Horizontal Journey */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar p-6 bg-[#f8fafc]">
        
        {/* Active Journey Lane */}
        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
            <span>Active Journey (8 Days)</span>
        </div>

        <div className="flex gap-4 min-w-max pb-8 h-[320px]">
            {slots.map((slot, idx) => (
                <React.Fragment key={slot.day}>
                    <div className={`relative w-64 flex-shrink-0 flex flex-col ${slot.isActive ? '' : 'opacity-60'}`}>
                        {/* Day Header */}
                        <div className={`flex items-center justify-between mb-2 px-1 ${slot.isActive ? 'text-indigo-900' : 'text-gray-400'}`}>
                            <span className="text-sm font-bold">Day {slot.day}</span>
                            {slot.isActive && (
                                <span className="text-[10px] uppercase font-bold tracking-wider bg-white px-2 py-0.5 rounded-full border border-gray-200 shadow-sm flex items-center gap-1">
                                    <PurposeIcon purpose={slot.variantGroup[0]?.meta?.purpose as TrackStepPurpose} />
                                    <PurposeLabel purpose={slot.variantGroup[0]?.meta?.purpose as TrackStepPurpose} />
                                </span>
                            )}
                        </div>

                        {/* Card Area */}
                        {slot.isActive ? (
                            <div className="flex-1 bg-white rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all cursor-pointer group flex flex-col overflow-hidden relative">
                                {/* Top: Metrics Overlay */}
                                <div className="absolute top-0 right-0 left-0 bg-gradient-to-b from-white/90 to-transparent p-2 z-10 flex justify-end">
                                    <div className="bg-green-50 text-green-700 border border-green-200 text-xs px-2 py-0.5 rounded font-bold shadow-sm">
                                        CVR {slot.variantGroup[0]?.analytics?.cvr || '-'}
                                    </div>
                                </div>

                                {/* Middle: Content Preview */}
                                <div className="flex-1 p-3 pt-8 overflow-hidden">
                                     {/* Text Preview */}
                                     <div className="bg-slate-50 p-2 rounded text-[10px] text-gray-600 mb-2 border border-slate-100 line-clamp-4 leading-relaxed relative">
                                         <MessageSquare className="w-3 h-3 text-slate-300 absolute top-1 right-1" />
                                         {slot.variantGroup.find(n => n.type === 'text')?.content}
                                     </div>
                                     {/* Image Preview */}
                                     {slot.variantGroup.find(n => n.type === 'image') && (
                                         <div className="h-20 w-full rounded bg-gray-100 overflow-hidden relative">
                                             <img src={slot.variantGroup.find(n => n.type === 'image')?.content} className="w-full h-full object-cover" />
                                             <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[9px] px-1 rounded">IMG</div>
                                         </div>
                                     )}
                                </div>

                                {/* Bottom: Footer */}
                                <div className="p-2 border-t border-gray-50 bg-gray-50 flex justify-between items-center text-[10px] text-gray-500">
                                    <span>CTR: <span className="font-bold text-gray-700">{slot.variantGroup[0]?.analytics?.ctr || '-'}</span></span>
                                    <span className="text-indigo-500 font-bold group-hover:underline">Edit</span>
                                </div>
                            </div>
                        ) : (
                            /* Inactive / Placeholder Slot */
                            <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-gray-300 transition-colors bg-gray-50/50">
                                <span className="text-gray-300 font-bold text-xs">No Delivery</span>
                                <button className="text-xs bg-white border border-gray-200 px-3 py-1 rounded text-gray-500 hover:text-indigo-600 shadow-sm font-medium">
                                    + Add Step
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Arrow Connector */}
                    {idx < slots.length - 1 && (
                        <div className="flex items-center justify-center pt-8 opacity-30">
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>

        <div className="h-px bg-gray-200 my-4 w-full"></div>

        {/* Candidate Pool (De-emphasized) */}
        <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-500">
                <Layers className="w-4 h-4" />
                <span>Candidate Pool (Inactive Variants)</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                 {[1, 2, 3, 4, 5].map(i => (
                     <div key={i} className="w-48 h-24 bg-white border border-gray-200 rounded-lg p-2 flex gap-2 opacity-70 hover:opacity-100 transition-opacity cursor-grab shadow-sm flex-shrink-0">
                         <div className="w-16 bg-gray-100 rounded flex-shrink-0"></div>
                         <div className="flex-1 flex flex-col justify-between">
                             <div className="h-2 bg-gray-100 rounded w-full"></div>
                             <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                             <span className="text-[9px] text-gray-400">Var-{i}</span>
                         </div>
                     </div>
                 ))}
            </div>
        </div>

      </div>
    </div>
  );
};