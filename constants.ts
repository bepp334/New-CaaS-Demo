import { Scenario, Project, GlobalTag } from './types';

// --- Global Tags (Cross-Project Data) ---
export const GLOBAL_TAGS: Record<string, GlobalTag> = {
  OCCUPATION: { id: 'user_occupation', label: '職業', scope: 'global' },
  INTEREST: { id: 'user_interest', label: '興味関心', scope: 'global' },
  LIFESTYLE: { id: 'user_lifestyle', label: '生活スタイル', scope: 'global' },
  GOAL_TIMING: { id: 'user_goal_timing', label: '目標時期', scope: 'global' },
  SKIN_TROUBLE: { id: 'user_skin_trouble', label: '肌悩み', scope: 'global' }, // Specific but managed globally
};

// --- Projects ---
export const PROJECTS: Project[] = [
  { id: 'proj_cpa', name: 'CPAラーニング (教育)', category: 'Education' },
  { id: 'proj_cosme', name: 'Lumiere Cosmetics (EC)', category: 'Beauty/EC' },
];

// --- Project 1: CPA Learning Data ---
export const CPA_DATA = {
  initial: {
    id: 'init-001',
    type: 'initial',
    name: '学習プラン診断フロー (4問)',
    schedule: '即時',
    status: 'published',
    compliance: {
      status: 'approved',
      feedback: [],
      history: [
        { id: 'log-1', timestamp: '2025-01-10 10:00', actor: 'AI_Checker', action: 'check_passed', comment: 'No NG words found.' },
        { id: 'log-2', timestamp: '2025-01-10 14:30', actor: 'Legal_Dept', action: 'manual_approve', comment: 'Approved for release.' }
      ]
    },
    nodes: [
      {
        id: 'init-1',
        type: 'text',
        content: '{user_first_name}さん、こんにちは😊\n1,700本以上の動画が無料で見放題のCPAラーニングです📚',
        analytics: { impressions: 12500, dropoffRate: '2.1%' }
      },
      {
        id: 'init-2',
        type: 'question',
        content: '「学習プラン診断」はお済みですか？\n診断結果をもとに、さっそく学習を始めてみませんか？👇',
        meta: { options: ['診断を始める', 'あとで'] },
        analytics: { impressions: 12200, clicks: 8500, ctr: '69.6%' }
      },
      {
        id: 'init-q1',
        type: 'question',
        content: 'Q1. 現在の職業を教えてください',
        meta: { 
          options: ['学生', '会社員', '公務員', 'その他'],
          saveToTag: GLOBAL_TAGS.OCCUPATION 
        },
        analytics: { impressions: 8500, clicks: 8450, ctr: '99.4%' }
      },
      {
        id: 'init-q2',
        type: 'question',
        content: 'Q2. 興味のある分野はどれですか？',
        meta: { 
          options: ['簿記', '会計士', '税理士', 'プログラミング'],
          saveToTag: GLOBAL_TAGS.INTEREST
        },
        analytics: { impressions: 8450, clicks: 8400, ctr: '99.4%' }
      },
      {
        id: 'init-q3',
        type: 'carousel',
        content: 'Q3. どのくらいの学習時間を確保できますか？',
        meta: { 
          items: [
            { title: 'スキマ時間で', image: 'https://picsum.photos/300/200?random=10' },
            { title: '週末に集中', image: 'https://picsum.photos/300/200?random=11' },
            { title: '毎日コツコツ', image: 'https://picsum.photos/300/200?random=12' }
          ],
          saveToTag: GLOBAL_TAGS.LIFESTYLE
        },
        analytics: { impressions: 8400, clicks: 8200, ctr: '97.6%' }
      },
      {
        id: 'init-q4',
        type: 'question',
        content: 'Q4. 目標とする時期はありますか？',
        meta: { 
          options: ['3ヶ月以内', '半年以内', '1年以内'],
          saveToTag: GLOBAL_TAGS.GOAL_TIMING
        },
        analytics: { impressions: 8200, clicks: 8000, ctr: '97.5%' }
      },
      {
        id: 'init-end',
        type: 'offer',
        content: '診断ありがとうございます！\nあなたにおすすめのコースはこちらです🎉',
        analytics: { impressions: 8000, clicks: 4500, ctr: '56.2%' }
      }
    ]
  } as Scenario,
  
  // --- Enhanced Shots Data ---
  shots: [
    {
      id: 'shot-past-001',
      type: 'shot',
      name: '【配信済】1月度: お年玉キャンペーン',
      schedule: '2025-01-01 10:00',
      status: 'sent',
      sentDate: '2025/01/01',
      stats: { openRate: '68%', ctr: '12%', cvr: '3.5%' },
      nodes: [
        { id: 's-p1-1', type: 'text', content: 'あけましておめでとうございます🎍\n今年こそ簿記合格を目指すあなたへ、お年玉です！' },
        { id: 's-p1-2', type: 'image', content: 'https://picsum.photos/400/300?random=1' }
      ]
    },
    {
      id: 'shot-draft-002',
      type: 'shot',
      name: '2月度: 確定申告直前セミナー',
      schedule: '2025-02-10 19:00',
      status: 'scheduled',
      stats: { openRate: '-', ctr: '-', cvr: '-' },
      compliance: { status: 'approved', feedback: [], history: [] },
      nodes: [
        { id: 's-d2-1', type: 'text', content: '確定申告の準備は進んでいますか？\n実は、簿記の知識があるとこんなに楽になるんです。' },
        { id: 's-d2-2', type: 'bot_link', content: '無料セミナーを見る', meta: { url: 'https://...' } }
      ]
    },
    {
      id: 'shot-future-003',
      type: 'shot',
      name: '3月度: 年度末スキルアップ応援',
      schedule: '2025-03-20 12:00',
      status: 'draft',
      stats: { openRate: '-', ctr: '-', cvr: '-' },
      compliance: { status: 'pending', feedback: [], history: [] },
      nodes: [
        { id: 's-f3-1', type: 'text', content: '4月からの新生活に向けて、今のうちに資格を取りませんか？' },
        { id: 's-f3-2', type: 'image', content: 'https://picsum.photos/400/300?random=3' }
      ]
    },
    {
      id: 'shot-future-004',
      type: 'shot',
      name: '4月度: 新社会人応援キャンペーン',
      schedule: '2025-04-01 09:00',
      status: 'draft',
      stats: { openRate: '-', ctr: '-', cvr: '-' },
      nodes: [
        { id: 's-f4-1', type: 'text', content: '新社会人の皆様、おめでとうございます！\n経理・財務の基礎知識はここで学べます。' }
      ]
    }
  ] as Scenario[],

  // --- Enhanced Track Push Data (8 Days Journey) ---
  trackPush: {
    id: 'track-001',
    type: 'track_push',
    name: '新規会員ナーチャリング (8 Days Journey)',
    schedule: 'Auto-Schedule',
    status: 'optimizing',
    compliance: { status: 'pending', feedback: [], history: [] },
    nodes: [], 
    // Structure: Array of variant arrays. Each outer array index corresponds to a "Step" (Day 1, Day 2...)
    variants: [
      // Day 1: Welcome / Awareness
      [
        { id: 'v1-1', type: 'text', content: '【Day 1】ご登録ありがとうございます！\nまずは「簿記3級」の第1回講義を見てみましょう🎥', analytics: { cvr: '12.5%', ctr: '45%' }, meta: { dayOffset: 1, purpose: 'welcome' } },
        { id: 'v1-2', type: 'image', content: 'https://picsum.photos/400/300?random=20' },
        { id: 'v1-3', type: 'bot_link', content: '動画を見る', meta: { url: 'https://...' } }
      ],
      // Day 2: Education (Light)
      [
        { id: 'v2-1', type: 'text', content: '【Day 2】スキマ時間の活用法\n電車の中でもスマホで問題集が解けるって知っていましたか？', analytics: { cvr: '8.2%', ctr: '38%' }, meta: { dayOffset: 2, purpose: 'education' } },
        { id: 'v2-img', type: 'image', content: 'https://picsum.photos/400/300?random=21' }
      ],
      // Day 3: Education (Deep)
      [
        { id: 'v3-1', type: 'text', content: '【Day 3】テキストはダウンロードしましたか？📖\nPDFなら書き込みも自由自在です。', analytics: { cvr: '5.4%', ctr: '22%' }, meta: { dayOffset: 3, purpose: 'education' } },
        { id: 'v3-link', type: 'bot_link', content: 'テキストを確認', meta: { url: 'https://...' } }
      ],
      // Day 4: Candidate (Not Active)
      [], 
      // Day 5: Trust / Social Proof
      [
        { id: 'v5-1', type: 'text', content: '【Day 5】合格者の声をご紹介\n「完全無料でここまで学べるとは思いませんでした」', analytics: { cvr: '9.1%', ctr: '30%' }, meta: { dayOffset: 5, purpose: 'nurturing' } },
        { id: 'v5-car', type: 'carousel', content: '合格者インタビュー', meta: { items: [{title:'Aさん', image:'https://picsum.photos/200'}, {title:'Bさん', image:'https://picsum.photos/201'}] } }
      ],
      // Day 6: Candidate
      [],
      // Day 7: Main Offer
      [
        { id: 'v7-1', type: 'text', content: '【Day 7】学習の習慣はつきましたか？\n今なら模試が無料で受けられます！', analytics: { cvr: '15.3%', ctr: '50%' }, meta: { dayOffset: 7, purpose: 'offer' } },
        { id: 'v7-offer', type: 'offer', content: '模試に申し込む' }
      ],
       // Day 8: Reminder / Last Push
       [
        { id: 'v8-1', type: 'text', content: '【Day 8】模試の申し込みは今日まで！\n実力を試すチャンスです🔥', analytics: { cvr: '18.9%', ctr: '62%' }, meta: { dayOffset: 8, purpose: 'reminder' } },
      ]
    ]
  } as Scenario
};

// --- Project 2: Cosmetics Data (Simplified for brevity) ---
export const COSME_DATA = {
  initial: CPA_DATA.initial, // Reuse for demo
  shots: [],
  trackPush: { ...CPA_DATA.trackPush, id: 'track-cosme' }
};