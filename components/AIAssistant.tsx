import React, { useState } from 'react';
import { Sparkles, Send, Loader2, ShieldCheck, Settings2, AlertTriangle, CheckCircle, FileText, CalendarRange, Palette, Globe, ScanEye, ImagePlus, Plus } from 'lucide-react';
import { AppSection, ScenarioNode } from '../types';

interface AIAssistantProps {
  onGenerate: (prompt: string) => Promise<void>;
  onAddNode?: (node: ScenarioNode) => void;
  isGenerating: boolean;
  context: AppSection;
}

type Tab = 'generate' | 'creative' | 'compliance';

export const AIAssistant: React.FC<AIAssistantProps> = ({ onGenerate, onAddNode, isGenerating, context }) => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [prompt, setPrompt] = useState('');
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('あなたは優秀なLINEマーケティングのコピーライターです。ユーザーの行動心理に基づき、エンゲージメントを高める短いメッセージと画像生成プロンプトを作成してください。');
  
  // Compliance State
  const [isChecking, setIsChecking] = useState(false);
  const [complianceResult, setComplianceResult] = useState<null | 'safe' | 'warning'>(null);

  // Creative Studio State
  const [lpUrl, setLpUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [creativePlan, setCreativePlan] = useState<null | {
      concept: string;
      target: string;
      layout: string;
      mainCopy: string;
      visual: string;
  }>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isCreatingImage, setIsCreatingImage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt);
      setPrompt('');
    }
  };

  const handleComplianceCheck = async () => {
      setIsChecking(true);
      setComplianceResult(null);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setComplianceResult('warning');
      setIsChecking(false);
  };

  const handleAnalyzeLP = async () => {
      if(!lpUrl) return;
      setIsAnalyzing(true);
      setCreativePlan(null);
      setGeneratedImage(null);
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock Response based on URL context (simple heuristic)
      if (lpUrl.includes('cpa')) {
          setCreativePlan({
              target: '資格取得を検討中の社会人・学生',
              concept: '「無料で始められる」心理的ハードルの低さを強調',
              layout: '上部：キャッチコピー(明朝体) / 中央：学習イメージ / 下部：CTAボタン',
              mainCopy: '簿記3級・2級が\n全講義 無料で見放題！',
              visual: '落ち着いたグリーンの背景、タブレットで学習する真剣な表情のユーザー、テキストの表紙イメージ'
          });
      } else if (lpUrl.includes('cosme')) {
           setCreativePlan({
              target: '30代〜40代の肌悩みを持つ女性',
              concept: '「春の新作」による季節感と限定感の演出',
              layout: '全面画像（商品寄り）＋手書き風フォントのあしらい',
              mainCopy: '春の光を、肌にまとう。\n新作コレクション予約開始',
              visual: '桜色の背景、商品ボトル（美容液）の周りに舞う花びら、柔らかな自然光'
          });
      } else {
           setCreativePlan({
              target: '一般的なLINEユーザー',
              concept: 'ベネフィット重視の訴求',
              layout: 'Zの法則を意識した視線誘導レイアウト',
              mainCopy: '今だけの特別オファー\n詳細をチェック',
              visual: '明るい配色の背景、驚きの表情の人物、キャンペーンバッジ'
          });
      }
      setIsAnalyzing(false);
  };

  const handleCreateImage = async () => {
      if(!creativePlan) return;
      setIsCreatingImage(true);
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock Image generation
      // Using picsum with specific ID to simulate consistency, or random to simulate generation
      const seed = Math.floor(Math.random() * 1000);
      setGeneratedImage(`https://picsum.photos/seed/${seed}/900/1200`);
      setIsCreatingImage(false);
  };

  const handleAddToScene = () => {
      if(generatedImage && onAddNode) {
          onAddNode({
              id: `img-${Date.now()}`,
              type: 'image',
              content: generatedImage,
              meta: { 
                  alt: creativePlan?.mainCopy || 'AI Generated Creative',
                  source: 'AI Creative Studio'
              }
          });
          // Reset after adding
          setLpUrl('');
          setCreativePlan(null);
          setGeneratedImage(null);
          alert('クリエイティブをシナリオに追加しました');
      }
  };

  const getSuggestions = () => {
      switch(context) {
          case 'shot': return ['年間販促計画を自動生成 (Annual Plan)', 'クリスマスセール (12/24)', '新春お年玉クーポン', '週末限定タイムセール'];
          case 'track_push': return ['購入後1ヶ月間のナーチャリング', 'カート落ちユーザーへの再アプローチ', '無料会員から有料会員への引き上げ'];
          case 'initial': return ['肌診断ボット', 'ギフト選び診断', 'アンケート回答でクーポン配布'];
          default: return [];
      }
  };

  return (
    <div className="bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-4">
            <button 
                onClick={() => setActiveTab('generate')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'generate' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Sparkles className="w-4 h-4" />
                Scenario Generator
            </button>
            <button 
                onClick={() => setActiveTab('creative')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'creative' ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <Palette className="w-4 h-4" />
                Creative Studio
            </button>
            <button 
                onClick={() => setActiveTab('compliance')}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'compliance' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                <ShieldCheck className="w-4 h-4" />
                Legal Check
            </button>
        </div>

        {/* Content */}
        <div className="p-4 max-w-5xl mx-auto min-h-[140px]">
            
            {/* TAB 1: SCENARIO GENERATOR */}
            {activeTab === 'generate' && (
                <>
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1 mr-4">
                            {getSuggestions().map((s, i) => (
                                <button 
                                    key={i}
                                    onClick={() => {
                                        setPrompt(s);
                                        // Auto submit for the special annual plan command
                                        if(s.includes('Annual Plan')) {
                                            onGenerate(s);
                                        }
                                    }}
                                    className={`whitespace-nowrap px-3 py-1 text-xs rounded-full transition-colors border flex items-center gap-1
                                        ${s.includes('Annual Plan') 
                                            ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-800 border-indigo-200 font-bold' 
                                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'}`}
                                >
                                    {s.includes('Annual Plan') && <CalendarRange className="w-3 h-3" />}
                                    {s}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => setShowPromptSettings(!showPromptSettings)}
                            className={`p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors ${showPromptSettings ? 'text-indigo-500 bg-indigo-50' : ''}`}
                            title="Edit System Prompt"
                        >
                            <Settings2 className="w-4 h-4" />
                        </button>
                    </div>

                    {showPromptSettings && (
                        <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg animate-in slide-in-from-top-2">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">System Prompt (Generator Config)</label>
                            <textarea 
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                className="w-full text-sm p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700"
                                rows={2}
                            />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isGenerating}
                            placeholder={context === 'track_push' ? "例: 「購入後7日間のナーチャリングシナリオを20パターン生成して最適化」" : "AIへの指示を入力してください..."}
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={!prompt || isGenerating}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg 
                            ${!prompt || isGenerating ? 'bg-gray-200 text-gray-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'}
                            transition-all`}
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        </button>
                    </form>
                </>
            )}

            {/* TAB 2: CREATIVE STUDIO */}
            {activeTab === 'creative' && (
                <div className="flex gap-6 h-full">
                    {/* Left: Inputs */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1.5">
                                <Globe className="w-3 h-3" /> Client LP URL
                            </label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={lpUrl}
                                    onChange={(e) => setLpUrl(e.target.value)}
                                    placeholder="https://cpa-learning.com/lp/..." 
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                                />
                                <button 
                                    onClick={handleAnalyzeLP}
                                    disabled={!lpUrl || isAnalyzing}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ScanEye className="w-3 h-3" />}
                                    Analyze
                                </button>
                            </div>
                        </div>

                        {creativePlan && (
                            <div className="bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-100 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-pink-500" />
                                        AI Creative Plan
                                    </h4>
                                    {!generatedImage && !isCreatingImage && (
                                        <button 
                                            onClick={handleCreateImage}
                                            className="text-xs bg-pink-600 text-white px-3 py-1.5 rounded-full shadow-sm hover:bg-pink-700 font-bold flex items-center gap-1"
                                        >
                                            <Sparkles className="w-3 h-3" /> Generate Image
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-2 text-xs text-gray-700">
                                    <div className="grid grid-cols-[80px_1fr] gap-2">
                                        <span className="text-gray-400 font-medium">Concept</span>
                                        <span className="font-medium">{creativePlan.concept}</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2">
                                        <span className="text-gray-400 font-medium">Layout</span>
                                        <span>{creativePlan.layout}</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2">
                                        <span className="text-gray-400 font-medium">Copy</span>
                                        <span className="font-serif italic text-pink-800 bg-white/50 px-1 rounded">{creativePlan.mainCopy}</span>
                                    </div>
                                    <div className="grid grid-cols-[80px_1fr] gap-2">
                                        <span className="text-gray-400 font-medium">Visual</span>
                                        <span>{creativePlan.visual}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Output */}
                    <div className="w-48 flex-shrink-0 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden relative min-h-[160px]">
                        {isCreatingImage ? (
                            <div className="flex flex-col items-center gap-2 text-pink-500">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="text-xs font-medium">Generating...</span>
                            </div>
                        ) : generatedImage ? (
                            <div className="relative group w-full h-full">
                                <img src={generatedImage} alt="Generated Creative" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    <button 
                                        onClick={handleAddToScene}
                                        className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gray-100 flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" /> Add to Scene
                                    </button>
                                </div>
                                <div className="absolute top-1 left-1 bg-black/50 text-white text-[9px] px-1 rounded">
                                    900x1200
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 p-4">
                                <ImagePlus className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <span className="text-[10px]">Preview will appear here</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: COMPLIANCE */}
            {activeTab === 'compliance' && (
                <div className="flex items-start gap-6">
                    <div className="flex-1">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-3">
                            <h4 className="text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Current Regulations
                            </h4>
                            <p className="text-xs text-yellow-700 mb-2">
                                適用中: 薬機法ガイドラインv2.4, クライアント独自規定(NGワードリスト)
                            </p>
                            <button className="text-xs bg-white border border-yellow-300 text-yellow-700 px-2 py-1 rounded hover:bg-yellow-100">
                                規定ファイルをアップロード
                            </button>
                        </div>
                        <div className="text-xs text-gray-400 text-right">
                             プロンプトで審査基準を調整可能
                        </div>
                    </div>

                    <div className="w-px bg-gray-200 self-stretch"></div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        {!complianceResult && !isChecking && (
                            <button 
                                onClick={handleComplianceCheck}
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700 flex items-center gap-2 font-medium"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Run Compliance Check
                            </button>
                        )}

                        {isChecking && (
                            <div className="flex flex-col items-center text-indigo-600">
                                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                <span className="text-sm font-medium">Scanning content...</span>
                            </div>
                        )}

                        {complianceResult === 'warning' && (
                            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
                                <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    Potential Issues Found
                                </div>
                                <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                                    <li>「絶対効果がある」という表現は誇大広告の可能性があります。</li>
                                    <li>画像のコントラスト比がガイドライン推奨値を下回っています。</li>
                                </ul>
                            </div>
                        )}
                        
                        {complianceResult === 'safe' && (
                            <div className="flex items-center gap-2 text-green-600 font-bold">
                                <CheckCircle className="w-5 h-5" />
                                No Issues Detected
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};