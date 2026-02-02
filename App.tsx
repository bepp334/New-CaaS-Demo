import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Settings, 
  ChevronRight, 
  Split,
  Eye,
  Table as TableIcon,
  Zap,
  GitMerge,
  Megaphone,
  Briefcase,
  ChevronDown,
  Database,
  Check,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { VisualFlow } from './components/VisualFlow';
import { DataTable } from './components/DataTable';
import { TrackPushOptimizer } from './components/TrackPushOptimizer';
import { CampaignDashboard } from './components/CampaignDashboard';
import { AIAssistant } from './components/AIAssistant';
import { CPA_DATA, COSME_DATA, PROJECTS } from './constants';
import { Scenario, AppSection, ViewMode, ScenarioNode, Project } from './types';

function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('initial');
  
  // Project State
  const [currentProject, setCurrentProject] = useState<Project>(PROJECTS[0]);
  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);

  // Data State
  const [initialConv, setInitialConv] = useState<Scenario>(CPA_DATA.initial);
  const [shots, setShots] = useState<Scenario[]>(CPA_DATA.shots);
  const [trackPush, setTrackPush] = useState<Scenario>(CPA_DATA.trackPush);
  
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isGenerating, setIsGenerating] = useState(false);

  // Load data when project changes
  useEffect(() => {
    if (currentProject.id === 'proj_cpa') {
        setInitialConv(CPA_DATA.initial);
        setShots(CPA_DATA.shots);
        setTrackPush(CPA_DATA.trackPush);
        // Reset shot selection to null (dashboard view) by default or first shot
        setSelectedShotId(null);
    } else {
        setInitialConv(COSME_DATA.initial);
        setShots(COSME_DATA.shots);
        setTrackPush(COSME_DATA.trackPush);
        setSelectedShotId(null);
    }
  }, [currentProject]);

  // Handle Shot Section Navigation
  const handleShotSectionClick = () => {
      setActiveSection('shot');
      setSelectedShotId(null); // Show Dashboard
      setViewMode('dashboard');
  };

  // Determine current active scenario
  const activeScenario = (() => {
      switch(activeSection) {
          case 'initial': return initialConv;
          case 'track_push': return trackPush;
          case 'shot': return shots.find(s => s.id === selectedShotId); // Can be undefined if in dashboard
      }
  })();

  const currentNodes = activeScenario?.nodes || [];

  // Mock AI Generation Logic
  const handleAIGenerate = async (prompt: string) => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Special logic for Annual Plan Batch Generation
    if (activeSection === 'shot' && prompt.includes('Annual Plan')) {
        const annualPlans: Scenario[] = [
            {
                id: `shot-gen-1`, type: 'shot', name: '🌸 春の応援キャンペーン (4/1)', schedule: '2026-04-01 10:00', status: 'draft',
                nodes: [{id:'s1', type:'text', content:'新年度スタート！新しいことを始めませんか？'}, {id:'s2', type:'image', content:'https://picsum.photos/400/300?random=100'}]
            },
            {
                id: `shot-gen-2`, type: 'shot', name: '🏖 夏休み集中講座 (8/1)', schedule: '2026-08-01 10:00', status: 'draft',
                nodes: [{id:'s1', type:'text', content:'夏休みは集中のチャンス！'}, {id:'s2', type:'image', content:'https://picsum.photos/400/300?random=101'}]
            },
            {
                id: `shot-gen-3`, type: 'shot', name: '🎃 ハロウィン限定クーポン (10/31)', schedule: '2026-10-31 18:00', status: 'draft',
                nodes: [{id:'s1', type:'text', content:'Trick or Study? 限定クーポン配布中'}, {id:'s2', type:'image', content:'https://picsum.photos/400/300?random=102'}]
            },
            {
                id: `shot-gen-4`, type: 'shot', name: '🎄 クリスマスセール (12/24)', schedule: '2026-12-24 19:00', status: 'draft',
                nodes: [{id:'s1', type:'text', content:'自分へのクリスマスプレゼントに🎁'}, {id:'s2', type:'image', content:'https://picsum.photos/400/300?random=103'}]
            },
             {
                id: `shot-gen-5`, type: 'shot', name: '🧧 お年玉キャンペーン (1/1)', schedule: '2027-01-01 09:00', status: 'draft',
                nodes: [{id:'s1', type:'text', content:'あけましておめでとうございます！'}, {id:'s2', type:'image', content:'https://picsum.photos/400/300?random=104'}]
            }
        ];
        setShots(prev => [...annualPlans, ...prev]);
        // setSelectedShotId(annualPlans[0].id); // Don't force select, stay on dashboard
        alert("Generated 5 annual plan drafts to the dashboard.");
        setIsGenerating(false);
        return;
    }

    // Basic logic to simulate "Adding" nodes or content
    if (activeSection === 'initial') {
        const newNode: ScenarioNode = {
            id: `gen-${Date.now()}`,
            type: 'text',
            content: `AI生成: ${prompt} (初期会話への追加)`
        };
        setInitialConv(prev => ({...prev, nodes: [...prev.nodes, newNode]}));
    } else if (activeSection === 'track_push') {
        alert("AI generated 20 new variants and optimized the schedule.");
    } else {
        const newShot: Scenario = {
            id: `shot-${Date.now()}`,
            type: 'shot',
            name: `AI生成キャンペーン: ${prompt.slice(0, 10)}...`,
            status: 'draft',
            schedule: '2026-01-01 10:00',
            nodes: [
                { id: 's-new-1', type: 'text', content: prompt },
                { id: 's-new-2', type: 'image', content: 'https://picsum.photos/400/300' }
            ]
        };
        setShots(prev => [...prev, newShot]);
        setSelectedShotId(newShot.id);
        setViewMode('split'); // Switch to edit view
    }

    setIsGenerating(false);
  };

  const handleAddNode = (node: ScenarioNode) => {
      if (activeSection === 'initial') {
          setInitialConv(prev => ({...prev, nodes: [...prev.nodes, node]}));
      } else if (activeSection === 'shot' && selectedShotId) {
          setShots(prev => prev.map(s => s.id === selectedShotId ? { ...s, nodes: [...s.nodes, node] } : s));
      } else {
          alert("To add to Track Push, please use the Variant Manager.");
      }
  };

  const handleDeleteNode = (id: string) => {
      if (activeSection === 'initial') {
          setInitialConv(prev => ({...prev, nodes: prev.nodes.filter(n => n.id !== id)}));
      } else if (activeSection === 'shot' && selectedShotId) {
          setShots(prev => prev.map(s => s.id === selectedShotId ? { ...s, nodes: s.nodes.filter(n => n.id !== id) } : s));
      }
  };

  const renderContent = () => {
    // 1. Track Push
    if (activeSection === 'track_push') {
        return <TrackPushOptimizer scenario={trackPush} />;
    }

    // 2. Shot Dashboard
    if (activeSection === 'shot' && !selectedShotId) {
        return <CampaignDashboard scenarios={shots} onSelectScenario={(id) => { setSelectedShotId(id); setViewMode('split'); }} />;
    }

    // 3. Editor View (Initial or Selected Shot)
    return (
        <>
            {(viewMode === 'visual' || viewMode === 'split') && (
                <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full flex flex-col relative transition-all duration-300 border-r border-gray-200`}>
                    <div className="absolute top-2 left-2 z-10 bg-white/80 backdrop-blur px-2 py-1 rounded text-xs font-bold text-gray-500 border border-gray-200 shadow-sm pointer-events-none">
                        Human View
                    </div>
                    <VisualFlow nodes={currentNodes} />
                </div>
            )}

            {(viewMode === 'data' || viewMode === 'split') && (
                <div className={`${viewMode === 'split' ? 'w-1/2' : 'w-full'} h-full flex flex-col transition-all duration-300`}>
                    <DataTable 
                        nodes={currentNodes} 
                        compliance={activeScenario?.compliance} 
                        onDeleteNode={handleDeleteNode} 
                    />
                </div>
            )}
        </>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 z-20 shadow-xl relative">
        
        {/* Project Switcher */}
        <div className="p-4 border-b border-slate-800">
            <div className="relative">
                <button 
                    onClick={() => setIsProjectMenuOpen(!isProjectMenuOpen)}
                    className="w-full flex items-center justify-between bg-slate-800 hover:bg-slate-700 p-2 rounded-lg transition-colors border border-slate-700"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold shrink-0">
                            {currentProject.name.charAt(0)}
                        </div>
                        <div className="flex flex-col items-start truncate">
                            <span className="text-xs text-slate-400 font-medium">Project</span>
                            <span className="text-sm font-bold text-white truncate w-32 text-left">{currentProject.name}</span>
                        </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {isProjectMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsProjectMenuOpen(false)}></div>
                        <div className="absolute top-full left-0 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                            <div className="p-2 text-xs font-bold text-slate-500 uppercase">Select Project</div>
                            {PROJECTS.map(proj => (
                                <button
                                    key={proj.id}
                                    onClick={() => {
                                        setCurrentProject(proj);
                                        setIsProjectMenuOpen(false);
                                    }}
                                    className={`w-full text-left p-2 flex items-center gap-2 hover:bg-slate-700 transition-colors ${currentProject.id === proj.id ? 'bg-slate-700 text-white' : 'text-slate-300'}`}
                                >
                                    <Briefcase className="w-3 h-3" />
                                    <span className="text-sm truncate flex-1">{proj.name}</span>
                                    {currentProject.id === proj.id && <Check className="w-3 h-3 text-blue-400" />}
                                </button>
                            ))}
                            <div className="border-t border-slate-700 mt-1 pt-1 p-2">
                                <button className="w-full text-center text-xs text-blue-400 hover:text-blue-300">+ New Project</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>

        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
            
            {/* 1. Initial Conversation */}
            <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Onboarding</div>
                <button 
                    onClick={() => setActiveSection('initial')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'initial' ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
                >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">初期会話 (Initial)</span>
                </button>
            </div>

            {/* 2. Track Push (Nurturing) */}
            <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Nurturing</div>
                <button 
                    onClick={() => setActiveSection('track_push')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === 'track_push' ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
                >
                    <GitMerge className="w-4 h-4" />
                    <span className="text-sm font-medium">トラックプッシュ</span>
                    <span className="ml-auto text-[10px] bg-indigo-500 px-1.5 rounded text-white">AI</span>
                </button>
            </div>

            {/* 3. Shots (Campaigns) */}
            <div>
                <div className="flex justify-between items-center mb-2 px-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campaign Shots</span>
                    <button onClick={handleShotSectionClick} className="text-slate-500 hover:text-white" title="Campaign Dashboard"><LayoutGrid className="w-4 h-4"/></button>
                </div>
                
                <button 
                    onClick={handleShotSectionClick}
                    className={`w-full flex items-center gap-3 px-3 py-2 mb-2 rounded-lg transition-colors ${activeSection === 'shot' && !selectedShotId ? 'bg-orange-600 text-white shadow-md' : 'hover:bg-slate-800'}`}
                >
                    <Megaphone className="w-4 h-4" />
                    <span className="text-sm font-medium">All Campaigns</span>
                </button>

                <div className="space-y-1">
                    {shots.slice(0, 3).map(scenario => (
                        <button
                            key={scenario.id}
                            onClick={() => { setActiveSection('shot'); setSelectedShotId(scenario.id); setViewMode('split'); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left group ${selectedShotId === scenario.id && activeSection === 'shot' ? 'bg-slate-800 text-orange-400' : 'hover:bg-slate-800'}`}
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${scenario.status === 'sent' ? 'bg-green-500' : scenario.status === 'scheduled' ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                                <span className="text-xs font-medium truncate opacity-80">{scenario.name}</span>
                            </div>
                        </button>
                    ))}
                    {shots.length > 3 && (
                        <div onClick={handleShotSectionClick} className="px-3 text-[10px] text-slate-500 cursor-pointer hover:text-white">
                            + {shots.length - 3} more...
                        </div>
                    )}
                </div>
            </div>
            
            {/* Global Tag Section (Read only for demo) */}
            <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 px-2 mb-2 text-slate-500">
                    <Database className="w-3 h-3" />
                    <span className="text-xs font-bold uppercase">Cross-Project Data</span>
                </div>
                <div className="px-2 space-y-1">
                    <div className="text-xs text-slate-400 flex justify-between">
                        <span>🏷 職業 (Occupation)</span>
                        <span className="text-slate-600">Global</span>
                    </div>
                     <div className="text-xs text-slate-400 flex justify-between">
                        <span>🏷 興味関心 (Interest)</span>
                        <span className="text-slate-600">Global</span>
                    </div>
                </div>
            </div>

        </nav>

        <div className="p-4 border-t border-slate-800">
            <button className="flex items-center gap-3 text-sm hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-slate-800">
                <Settings className="w-4 h-4" />
                <span>Global Settings</span>
            </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        
        {/* Header (Simplified based on view) */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm z-10 h-[60px]">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${
                    activeSection === 'initial' ? 'bg-blue-100 text-blue-600' :
                    activeSection === 'track_push' ? 'bg-indigo-100 text-indigo-600' :
                    'bg-orange-100 text-orange-600'
                }`}>
                    {activeSection === 'initial' ? <MessageCircle className="w-4 h-4" /> :
                     activeSection === 'track_push' ? <GitMerge className="w-4 h-4" /> :
                     <Zap className="w-4 h-4" />}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <h1 className="text-lg font-bold text-gray-900 truncate max-w-md">
                    {activeSection === 'shot' && !selectedShotId ? 'Campaign Dashboard' : activeScenario?.name}
                </h1>
                
                {activeScenario?.status && activeSection !== 'shot' && (
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ml-2 ${
                        activeScenario.status === 'sent' ? 'bg-green-100 text-green-700' :
                        activeScenario.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                        'bg-indigo-100 text-indigo-700'
                    }`}>
                        {activeScenario.status.charAt(0).toUpperCase() + activeScenario.status.slice(1)}
                    </span>
                )}
            </div>

            {/* View Switcher: Only show if we are in an EDITOR mode (Initial or Selected Shot) */}
            {(activeSection === 'initial' || (activeSection === 'shot' && selectedShotId)) && (
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setViewMode('visual')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'visual' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title="Human View (Visual)"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setViewMode('split')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'split' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title="Split View"
                    >
                        <Split className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setViewMode('data')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'data' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title="AI View (Data)"
                    >
                        <TableIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </header>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
            {renderContent()}
        </div>

        {/* AI Command Center (Footer) - Only show if in Edit Mode or Track Push */}
        {(activeSection !== 'shot' || selectedShotId) && (
             <AIAssistant 
                context={activeSection} 
                onGenerate={handleAIGenerate} 
                onAddNode={handleAddNode}
                isGenerating={isGenerating} 
            />
        )}

      </main>
    </div>
  );
}

export default App;