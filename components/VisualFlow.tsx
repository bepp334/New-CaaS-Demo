import React from 'react';
import { ScenarioNode } from '../types';
import { MessageSquare, Image as ImageIcon, HelpCircle, Gift, Link, GalleryHorizontal, Database } from 'lucide-react';

interface VisualFlowProps {
  nodes: ScenarioNode[];
}

const NodeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'text': return <MessageSquare className="w-4 h-4 text-white" />;
    case 'image': return <ImageIcon className="w-4 h-4 text-white" />;
    case 'question': return <HelpCircle className="w-4 h-4 text-white" />;
    case 'offer': return <Gift className="w-4 h-4 text-white" />;
    case 'bot_link': return <Link className="w-4 h-4 text-white" />;
    case 'carousel': return <GalleryHorizontal className="w-4 h-4 text-white" />;
    default: return <MessageSquare className="w-4 h-4 text-white" />;
  }
};

const NodeColor = (type: string) => {
    switch(type) {
        case 'text': return 'bg-blue-500';
        case 'image': return 'bg-purple-500';
        case 'question': return 'bg-orange-500';
        case 'carousel': return 'bg-indigo-500';
        default: return 'bg-gray-500';
    }
}

export const VisualFlow: React.FC<VisualFlowProps> = ({ nodes }) => {
  if (nodes.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-slate-50">
        <p>ノードがありません</p>
        <p className="text-sm">AIに生成を依頼するか、データを追加してください</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#8aa3cf] p-8 custom-scrollbar relative">
      {/* Background Pattern for LINE-like feel */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      <div className="flex flex-col items-center max-w-md mx-auto space-y-4 relative z-10">
        
        {/* Start Indicator */}
        <div className="mb-2 flex flex-col items-center">
            <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-full px-4 py-1 text-[10px] font-bold text-gray-500 shadow-sm uppercase tracking-widest">
                Start Flow
            </div>
            <div className="h-4 w-px bg-white/50 my-1"></div>
        </div>

        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            <div className="w-full flex gap-3 group">
                {/* Icon Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${NodeColor(node.type)}`}>
                    <NodeIcon type={node.type} />
                </div>

                <div className="flex-1 max-w-[85%]">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-1 pl-1">
                        <span className="text-[10px] text-white/80 font-bold">{node.type.toUpperCase()}</span>
                        <span className="text-[10px] text-white/60 font-mono">{node.id}</span>
                    </div>

                    {/* Content Bubble */}
                    <div className={`bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100 relative transition-transform duration-200 group-hover:scale-[1.01]`}>
                        
                        {node.type === 'carousel' && node.meta?.items ? (
                             <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar snap-x">
                                {node.meta.items.map((item: any, i: number) => (
                                    <div key={i} className="snap-center flex-shrink-0 w-40 border border-gray-200 rounded-lg overflow-hidden">
                                        <img src={item.image} className="w-full h-24 object-cover" />
                                        <div className="p-2 bg-gray-50 text-xs font-bold text-center text-gray-700">{item.title}</div>
                                    </div>
                                ))}
                             </div>
                        ) : node.type === 'image' ? (
                            <div className="rounded-lg overflow-hidden border border-gray-100">
                                <img src={node.content} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                                {node.content}
                            </p>
                        )}

                        {/* Options Buttons (for Questions) */}
                        {node.meta?.options && (
                            <div className="mt-3 flex flex-col gap-2">
                                {node.meta.options.map((opt: string, i: number) => (
                                    <button key={i} className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-lg transition-colors border border-blue-100">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                         
                        {/* Bot Link Styling */}
                        {node.type === 'bot_link' && (
                             <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-center">
                                 <span className="text-xs text-blue-500 font-bold flex items-center gap-1">
                                     Link <Link className="w-3 h-3" />
                                 </span>
                             </div>
                        )}

                        {/* Global Data Tag Indicator */}
                        {node.meta?.saveToTag && (
                            <div className="absolute -right-2 -bottom-2 bg-gray-800 text-white px-2 py-1 rounded-md shadow-md flex items-center gap-1.5 z-20 border border-gray-600">
                                <Database className="w-3 h-3 text-green-400" />
                                <div className="flex flex-col leading-none">
                                    <span className="text-[8px] text-gray-400 uppercase">Saves to</span>
                                    <span className="text-[10px] font-mono font-bold">{node.meta.saveToTag.label}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Connector Line */}
            {index < nodes.length - 1 && (
              <div className="h-4 w-px bg-white/40 flex-shrink-0 ml-4"></div>
            )}
          </React.Fragment>
        ))}

        {/* End Indicator */}
        <div className="mt-2 flex flex-col items-center">
             <div className="h-4 w-px bg-white/50 mb-1"></div>
            <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-full px-4 py-1 text-[10px] font-bold text-gray-500 shadow-sm uppercase tracking-widest">
                End Flow
            </div>
        </div>

      </div>
    </div>
  );
};