// API 基础 URL
const API_BASE_URL = 'http://localhost:3001/api';
//线上
//const API_BASE_URL = '/api';

// 全局状态
let state = {
  questions: [],
  answers: [],
  currentQuestion: 0,
  exchangeCode: null,
  testResult: null,
  isTransitioning: false
};

// MBTI 70个问题
const MBTI_QUESTIONS = [
  {
    id: 1,
    question: "在聚会上，你会：",
    options: [
      { value: 'e', text: "与许多人互动，包括陌生人" },
      { value: 'i', text: "与几位你认识的人互动" }
    ]
  },
  {
    id: 2,
    question: "你更倾向于：",
    options: [
      { value: 's', text: "现实性优于推测性" },
      { value: 'n', text: "推测性大于现实性" }
    ]
  },
  {
    id: 3,
    question: "以下哪种情况更糟糕：",
    options: [
      { value: 's', text: "发挥你的想象力" },
      { value: 'n', text: "墨守成规" }
    ]
  },
  {
    id: 4,
    question: "以下哪一项给你留下的印象更深刻：",
    options: [
      { value: 't', text: "原则" },
      { value: 'f', text: "情感" }
    ]
  },
  {
    id: 5,
    question: "更倾向于：",
    options: [
      { value: 't', text: "有说服力" },
      { value: 'f', text: "触摸" }
    ]
  },
  {
    id: 6,
    question: "你更喜欢以下哪种工作方式：",
    options: [
      { value: 'j', text: "遵守截止日期" },
      { value: 'p', text: "仅'无论何时'" }
    ]
  },
  {
    id: 7,
    question: "你倾向于选择：",
    options: [
      { value: 'j', text: "相当小心" },
      { value: 'p', text: "有点冲动" }
    ]
  },
  {
    id: 8,
    question: "在聚会上，你会：",
    options: [
      { value: 'e', text: "熬夜，精力却越来越旺盛" },
      { value: 'i', text: "精力不济，早点离开" }
    ]
  },
  {
    id: 9,
    question: "你更倾向于：",
    options: [
      { value: 's', text: "明智的人" },
      { value: 'n', text: "富有想象力的人" }
    ]
  },
  {
    id: 10,
    question: "您对以下哪个更感兴趣：",
    options: [
      { value: 's', text: "什么是实际的" },
      { value: 'n', text: "什么是可能的" }
    ]
  },
  {
    id: 11,
    question: "在评价他人时，你更容易受到以下因素的影响：",
    options: [
      { value: 't', text: "法律而非情况" },
      { value: 'f', text: "情境而非法律" }
    ]
  },
  {
    id: 12,
    question: "在接近他人时，你是否倾向于：",
    options: [
      { value: 't', text: "目标" },
      { value: 'f', text: "个人" }
    ]
  },
  {
    id: 13,
    question: "你更倾向于：",
    options: [
      { value: 'j', text: "守时" },
      { value: 'p', text: "悠闲地" }
    ]
  },
  {
    id: 14,
    question: "以下哪种情况更让你感到困扰：",
    options: [
      { value: 'j', text: "未完成" },
      { value: 'p', text: "已完成" }
    ]
  },
  {
    id: 15,
    question: "在你的社交群体中，你是否：",
    options: [
      { value: 'e', text: "随时了解他人的动态" },
      { value: 'i', text: "了解最新新闻" }
    ]
  },
  {
    id: 16,
    question: "在做日常事情时，你更有可能：",
    options: [
      { value: 's', text: "按常规方式执行" },
      { value: 'n', text: "随心所欲" }
    ]
  },
  {
    id: 17,
    question: "作家应该：",
    options: [
      { value: 's', text: "言其所意，意其所言" },
      { value: 'n', text: "通过类比来更好地表达事物" }
    ]
  },
  {
    id: 18,
    question: "你更喜欢哪种：",
    options: [
      { value: 't', text: "思维一致性" },
      { value: 'f', text: "和谐的人际关系" }
    ]
  },
  {
    id: 19,
    question: "你更习惯于做以下哪种事情：",
    options: [
      { value: 't', text: "逻辑判断" },
      { value: 'f', text: "价值判断" }
    ]
  },
  {
    id: 20,
    question: "你是否想要以下物品：",
    options: [
      { value: 'j', text: "已解决并决定" },
      { value: 'p', text: "犹豫不决" }
    ]
  },
  {
    id: 21,
    question: "你会更倾向于以下哪种描述：",
    options: [
      { value: 'j', text: "严肃且坚定" },
      { value: 'p', text: "随和" }
    ]
  },
  {
    id: 22,
    question: "在打电话时，你会：",
    options: [
      { value: 'e', text: "很少质疑是否所有事情都会被说清楚" },
      { value: 'i', text: "排练你要说的话" }
    ]
  },
  {
    id: 23,
    question: "事实：",
    options: [
      { value: 's', text: "代表自己发言" },
      { value: 'n', text: "阐述原理" }
    ]
  },
  {
    id: 24,
    question: "是否具有远见卓识：",
    options: [
      { value: 's', text: "有些烦人" },
      { value: 'n', text: "相当迷人" }
    ]
  },
  {
    id: 25,
    question: "你更经常：",
    options: [
      { value: 't', text: "一个头脑冷静的人" },
      { value: 'f', text: "一个热心肠的人" }
    ]
  },
  {
    id: 26,
    question: "以下哪种情况更糟糕：",
    options: [
      { value: 't', text: "不公正" },
      { value: 'f', text: "无情" }
    ]
  },
  {
    id: 27,
    question: "一个人通常应该顺其自然吗：",
    options: [
      { value: 'j', text: "通过精心挑选和慎重选择" },
      { value: 'p', text: "随机且偶然" }
    ]
  },
  {
    id: 28,
    question: "你是否对以下方面感觉更好：",
    options: [
      { value: 'j', text: "已购买" },
      { value: 'p', text: "有购买选择权" }
    ]
  },
  {
    id: 29,
    question: "在公司里，你会：",
    options: [
      { value: 'e', text: "发起对话" },
      { value: 'i', text: "等待被接近" }
    ]
  },
  {
    id: 30,
    question: "常识是：",
    options: [
      { value: 's', text: "几乎无疑问" },
      { value: 'n', text: "经常有疑问" }
    ]
  },
  {
    id: 31,
    question: "孩子们通常不会：",
    options: [
      { value: 's', text: "让自己变得足够有用" },
      { value: 'n', text: "充分施展他们的想象力" }
    ]
  },
  {
    id: 32,
    question: "在做决定时，您更倾向于：",
    options: [
      { value: 't', text: "标准" },
      { value: 'f', text: "感受" }
    ]
  },
  {
    id: 33,
    question: "你更倾向于：",
    options: [
      { value: 't', text: "坚定而非温和" },
      { value: 'f', text: "温和而非坚硬" }
    ]
  },
  {
    id: 34,
    question: "以下哪一项更值得敬佩：",
    options: [
      { value: 'j', text: "组织能力和条理性" },
      { value: 'p', text: "适应和将就的能力" }
    ]
  },
  {
    id: 35,
    question: "你更看重：",
    options: [
      { value: 'j', text: "无穷大" },
      { value: 'p', text: "思想开放" }
    ]
  },
  {
    id: 36,
    question: "新的非常规交互是否：",
    options: [
      { value: 'e', text: "激励你，让你充满活力" },
      { value: 'i', text: "对储备金征税" }
    ]
  },
  {
    id: 37,
    question: "你是否更频繁地：",
    options: [
      { value: 's', text: "一个务实的人" },
      { value: 'n', text: "一个爱幻想的人" }
    ]
  },
  {
    id: 38,
    question: "你更有可能：",
    options: [
      { value: 's', text: "看看别人是如何发挥作用的" },
      { value: 'n', text: "看看别人是怎么看的" }
    ]
  },
  {
    id: 39,
    question: "以下哪一项更令人满意：",
    options: [
      { value: 't', text: "彻底讨论一个问题" },
      { value: 'f', text: "就某一问题达成一致意见" }
    ]
  },
  {
    id: 40,
    question: "你更遵循哪些规则：",
    options: [
      { value: 't', text: "你的头" },
      { value: 'f', text: "你的心" }
    ]
  },
  {
    id: 41,
    question: "你更喜欢以下哪种工作：",
    options: [
      { value: 'j', text: "已签约" },
      { value: 'p', text: "偶尔完成" }
    ]
  },
  {
    id: 42,
    question: "你是否倾向于寻找：",
    options: [
      { value: 'j', text: "秩序井然者" },
      { value: 'p', text: "无论发生什么" }
    ]
  },
  {
    id: 43,
    question: "你更喜欢：",
    options: [
      { value: 'e', text: "许多短暂接触的朋友" },
      { value: 'i', text: "几位联系时间较长的朋友" }
    ]
  },
  {
    id: 44,
    question: "你更倾向于：",
    options: [
      { value: 's', text: "事实" },
      { value: 'n', text: "原则" }
    ]
  },
  {
    id: 45,
    question: "你更感兴趣的是：",
    options: [
      { value: 's', text: "生产和分销" },
      { value: 'n', text: "设计与研究" }
    ]
  },
  {
    id: 46,
    question: "以下哪一项更像是一种赞美：",
    options: [
      { value: 't', text: "有一个人非常有条理。" },
      { value: 'f', text: "有一个非常多愁善感的人。" }
    ]
  },
  {
    id: 47,
    question: "你更看重自己的以下哪个方面：",
    options: [
      { value: 't', text: "坚定不移" },
      { value: 'f', text: "忠诚的" }
    ]
  },
  {
    id: 48,
    question: "你更倾向于：",
    options: [
      { value: 'j', text: "最终且不可更改的声明" },
      { value: 'p', text: "暂定和初步声明" }
    ]
  },
  {
    id: 49,
    question: "你更习惯于：",
    options: [
      { value: 'j', text: "做出决定后" },
      { value: 'p', text: "在做出决定之前" }
    ]
  },
  {
    id: 50,
    question: "你是否：",
    options: [
      { value: 'e', text: "与陌生人轻松且长时间地交谈" },
      { value: 'i', text: "发现与陌生人无话可说" }
    ]
  },
  {
    id: 51,
    question: "你更倾向于信任：",
    options: [
      { value: 's', text: "经验" },
      { value: 'n', text: "预感" }
    ]
  },
  {
    id: 52,
    question: "你是否觉得：",
    options: [
      { value: 's', text: "实用胜于巧妙" },
      { value: 'n', text: "巧胜于实" }
    ]
  },
  {
    id: 53,
    question: "以下哪个人更值得称赞：",
    options: [
      { value: 't', text: "明确原因" },
      { value: 'f', text: "强烈的感情" }
    ]
  },
  {
    id: 54,
    question: "你更倾向于：",
    options: [
      { value: 't', text: "公正" },
      { value: 'f', text: "同情" }
    ]
  },
  {
    id: 55,
    question: "更倾向于：",
    options: [
      { value: 'j', text: "确保事情安排妥当" },
      { value: 'p', text: "顺其自然" }
    ]
  },
  {
    id: 56,
    question: "在人际关系中，大多数事情应该是：",
    options: [
      { value: 'j', text: "可重新协商" },
      { value: 'p', text: "随机且偶然" }
    ]
  },
  {
    id: 57,
    question: "当电话响起时，你会：",
    options: [
      { value: 'e', text: "赶紧抢先行动" },
      { value: 'i', text: "希望其他人能回答" }
    ]
  },
  {
    id: 58,
    question: "你更看重自己的哪一点：",
    options: [
      { value: 's', text: "强烈的现实感" },
      { value: 'n', text: "丰富的想象力" }
    ]
  },
  {
    id: 59,
    question: "你更倾向于：",
    options: [
      { value: 's', text: "基本原理" },
      { value: 'n', text: "泛音" }
    ]
  },
  {
    id: 60,
    question: "以下哪个错误更大：",
    options: [
      { value: 't', text: "过于热情" },
      { value: 'f', text: "过于客观" }
    ]
  },
  {
    id: 61,
    question: "你认为自己基本上是：",
    options: [
      { value: 't', text: "头脑冷静" },
      { value: 'f', text: "心肠柔软的" }
    ]
  },
  {
    id: 62,
    question: "以下哪种情况更吸引你：",
    options: [
      { value: 'j', text: "有条理且按计划进行" },
      { value: 'p', text: "非结构化和非计划性" }
    ]
  },
  {
    id: 63,
    question: "你更倾向于以下哪种类型的人：",
    options: [
      { value: 'j', text: "常规化而非异想天开" },
      { value: 'p', text: "异想天开而非墨守成规" }
    ]
  },
  {
    id: 64,
    question: "你更倾向于：",
    options: [
      { value: 'e', text: "容易接近" },
      { value: 'i', text: "有些保守" }
    ]
  },
  {
    id: 65,
    question: "在写作方面，你更倾向于：",
    options: [
      { value: 's', text: "更为直译" },
      { value: 'n', text: "比喻性更强" }
    ]
  },
  {
    id: 66,
    question: "你是否觉得以下事情更难做到：",
    options: [
      { value: 's', text: "与他人产生共鸣" },
      { value: 'n', text: "利用他人" }
    ]
  },
  {
    id: 67,
    question: "你更希望自己拥有什么：",
    options: [
      { value: 't', text: "推理清晰" },
      { value: 'f', text: "同情心的强度" }
    ]
  },
  {
    id: 68,
    question: "哪个是更大的错误：",
    options: [
      { value: 't', text: "无差别" },
      { value: 'f', text: "保持批判性思维" }
    ]
  },
  {
    id: 69,
    question: "你更喜欢：",
    options: [
      { value: 'j', text: "计划中的活动" },
      { value: 'p', text: "意外事件" }
    ]
  },
  {
    id: 70,
    question: "你是否更倾向于：",
    options: [
      { value: 'j', text: "深思熟虑而非自发" },
      { value: 'p', text: "自发而非刻意" }
    ]
  }
];

// MBTI 性格类型详细数据
const MBTI_DATA = {
  'INTJ': {
    name: '建筑师',
    quote: '你以为我在发呆，其实我在推演五种结局',
    rarity: '稀有',
   脑洞Index: '极高',
    socialBattery: '低',
    percentages: {
      e: 30,
      i: 70,
      s: 25,
      n: 75,
      t: 80,
      f: 20,
      j: 85,
      p: 15
    },
    portrait: '你是一个战略思想家，具有远见卓识和独立精神。你善于分析复杂问题，制定长远计划，并以高标准要求自己和他人。你重视逻辑和理性，常常能看到别人忽略的模式和联系。',
    typicalBehaviors: [
      '在会议中，你更倾向于提出战略性建议而非参与日常讨论',
      '你喜欢独立工作，需要安静的环境来思考',
      '做决定时，你会权衡各种可能性和后果，而不是仅凭直觉'
    ],
    strengths: [
      '逻辑思维能力强，善于分析和解决复杂问题',
      '有远见，能够制定长期战略规划',
      '独立性强，能够在没有监督的情况下高效工作'
    ],
    blindSpots: [
      '可能过于理性，忽略情感因素',
      '对细节可能不够关注，容易忽略眼前的问题'
    ],
    suggestions: [
      '学会倾听他人的情感需求，不要只关注逻辑',
      '定期休息，避免过度思考导致的疲劳'
    ],
    compatibility: {
      friend: 'INTP, ENTP, ENFJ',
      work: 'ENTJ, ESTJ, ISTJ',
      love: 'ENFP, INFP, ENTJ'
    },
    celebrities: ['爱因斯坦', '霍金', '乔布斯', '赫敏·格兰杰'],
    eggText: '你的大脑配置：8核处理器，但散热较弱，记得关机休息哦~'
  },
  'INTP': {
    name: '逻辑学家',
    quote: '问题的答案永远比问题本身更有趣',
    rarity: '稀有',
   脑洞Index: '极高',
    socialBattery: '低',
    percentages: {
      e: 25,
      i: 75,
      s: 20,
      n: 80,
      t: 85,
      f: 15,
      j: 30,
      p: 70
    },
    portrait: '你是一个充满好奇心的思考者，热衷于探索各种可能性和理论。你善于分析和解决复杂问题，对知识有着永不满足的渴望。你重视逻辑和理性，常常能看到事物的本质。',
    typicalBehaviors: [
      '你喜欢拆解事物，了解它们的工作原理',
      '在讨论中，你更关注逻辑的一致性而非情感表达',
      '你常常沉浸在自己的思考中，忽略周围的环境'
    ],
    strengths: [
      '逻辑思维能力强，善于分析和解决问题',
      '好奇心强，知识渊博',
      '思维开放，愿意接受新的观点和想法'
    ],
    blindSpots: [
      '可能过于理论化，忽略实际应用',
      '对情感需求不够敏感，可能显得冷漠'
    ],
    suggestions: [
      '学会将理论与实践相结合，关注实际应用',
      '培养对他人情感的敏感度，提高人际关系能力'
    ],
    compatibility: {
      friend: 'INTJ, ENTP, INFP',
      work: 'ENTP, ISTP, ESTP',
      love: 'ENTP, ENFP, INFJ'
    },
    celebrities: ['牛顿', '达尔文', '比尔·盖茨', '谢尔顿·库珀'],
    eggText: '你的大脑是一台精密的逻辑机器，记得定期清理缓存哦~'
  },
  'ENTJ': {
    name: '指挥官',
    quote: '如果没有路，我就自己开辟一条',
    rarity: '较稀有',
   脑洞Index: '高',
    socialBattery: '高',
    percentages: {
      e: 80,
      i: 20,
      s: 35,
      n: 65,
      t: 85,
      f: 15,
      j: 90,
      p: 10
    },
    portrait: '你是一个天生的领导者，具有强烈的目标感和决断力。你善于组织和规划，能够激励他人朝着共同的目标努力。你重视效率和结果，常常能够在复杂的情况下迅速做出决策。',
    typicalBehaviors: [
      '在团队中，你自然地成为领导者，负责制定计划和分配任务',
      '你喜欢挑战，不害怕面对困难和压力',
      '你善于分析形势，做出理性的决策'
    ],
    strengths: [
      '领导力强，能够激励和组织他人',
      '目标明确，行动力强',
      '逻辑思维清晰，决策果断'
    ],
    blindSpots: [
      '可能过于强势，忽略他人的意见',
      '对情感需求不够敏感，可能显得冷漠'
    ],
    suggestions: [
      '学会倾听他人的意见，避免过于独断',
      '关注团队成员的情感需求，提高团队凝聚力'
    ],
    compatibility: {
      friend: 'ENTP, INTJ, ESTJ',
      work: 'ESTJ, ISTJ, ENFJ',
      love: 'INTJ, INTP, ENFP'
    },
    celebrities: ['拿破仑', '特朗普', '马斯克', '奥利弗·奎恩'],
    eggText: '你的大脑是一台高效的指挥中心，记得偶尔让下属（大脑细胞）休息一下哦~'
  },
  'ENTP': {
    name: '辩论家',
    quote: '规则就是用来打破的',
    rarity: '较稀有',
   脑洞Index: '极高',
    socialBattery: '高',
    percentages: {
      e: 85,
      i: 15,
      s: 25,
      n: 75,
      t: 80,
      f: 20,
      j: 20,
      p: 80
    },
    portrait: '你是一个充满创意和好奇心的思想家，善于发现问题并提出创新的解决方案。你喜欢辩论和挑战传统观念，常常能够看到事物的多种可能性。你精力充沛，善于社交，能够与各种人建立联系。',
    typicalBehaviors: [
      '你喜欢参与辩论，享受智力上的挑战',
      '你常常有新的想法和创意，喜欢尝试不同的事物',
      '你善于与人交流，能够迅速与陌生人建立联系'
    ],
    strengths: [
      '创造力强，善于提出创新的想法',
      '思维敏捷，善于辩论和说服',
      '适应能力强，能够应对变化'
    ],
    blindSpots: [
      '可能过于注重理论，忽略实际应用',
      '可能不够专注，容易分散注意力'
    ],
    suggestions: [
      '学会专注于一个目标，避免同时追求太多事情',
      '关注细节，确保创意能够转化为实际成果'
    ],
    compatibility: {
      friend: 'INTP, ENFJ, INTJ',
      work: 'ENTJ, ESTP, ISTP',
      love: 'INFJ, INTJ, ENFP'
    },
    celebrities: ['爱迪生', '富兰克林', '托尼·斯塔克', '夏洛克·福尔摩斯'],
    eggText: '你的大脑是一个永不停止的创意工厂，记得给发电机加加油哦~'
  },
  'INFJ': {
    name: '倡导者',
    quote: '我看到的不仅仅是你，而是你可能成为的样子',
    rarity: '稀有',
   脑洞Index: '高',
    socialBattery: '中',
    percentages: {
      e: 25,
      i: 75,
      s: 30,
      n: 70,
      t: 35,
      f: 65,
      j: 80,
      p: 20
    },
    portrait: '你是一个理想主义者，具有强烈的价值观和使命感。你善于理解他人的情感和需求，能够为他人提供支持和指导。你具有远见卓识，常常能够看到事物的深层意义和潜在可能性。',
    typicalBehaviors: [
      '你善于倾听他人的问题，给予情感支持',
      '你关注社会公益，希望能够为世界做出贡献',
      '你常常思考人生的意义和价值'
    ],
    strengths: [
      '同理心强，善于理解他人',
      '有远见，能够看到事物的深层意义',
      '价值观坚定，有使命感'
    ],
    blindSpots: [
      '可能过于理想化，忽略现实的限制',
      '可能过于关注他人的需求，忽略自己的需求'
    ],
    suggestions: [
      '学会平衡理想与现实，接受世界的不完美',
      '关注自己的需求，避免过度付出'
    ],
    compatibility: {
      friend: 'INFP, ENFJ, INTJ',
      work: 'ENFJ, ESFJ, INFP',
      love: 'ENFP, INTP, ENTJ'
    },
    celebrities: ['甘地', '特蕾莎修女', '马丁·路德·金', '阿不思·邓布利多'],
    eggText: '你的大脑是一个充满洞察力的灵魂窗口，记得偶尔拉上窗帘休息一下哦~'
  },
  'INFP': {
    name: '调停者',
    quote: '世界需要更多的爱和理解',
    rarity: '常见',
   脑洞Index: '高',
    socialBattery: '中',
    percentages: {
      e: 30,
      i: 70,
      s: 25,
      n: 75,
      t: 20,
      f: 80,
      j: 40,
      p: 60
    },
    portrait: '你是一个理想主义者，具有强烈的个人价值观和同理心。你善于理解他人的情感，重视和谐与和平。你富有创造力，常常通过艺术、写作或其他创造性表达来展现自己的想法和情感。',
    typicalBehaviors: [
      '你对他人的情感非常敏感，善于察觉他人的情绪变化',
      '你喜欢通过创造性的方式表达自己',
      '你重视个人价值观，不愿意妥协自己的原则'
    ],
    strengths: [
      '同理心强，善于理解他人',
      '创造力强，富有想象力',
      '价值观坚定，有理想'
    ],
    blindSpots: [
      '可能过于理想化，忽略现实的限制',
      '可能过于敏感，容易受到他人情绪的影响'
    ],
    suggestions: [
      '学会面对现实，接受世界的不完美',
      '培养情绪韧性，避免过度敏感'
    ],
    compatibility: {
      friend: 'INFJ, ENFP, ISFP',
      work: 'ENFP, ESFP, INFJ',
      love: 'ENFP, ENFJ, INTJ'
    },
    celebrities: ['莎士比亚', '简·奥斯汀', '约翰·列侬', '露娜·洛夫古德'],
    eggText: '你的大脑是一个充满爱的花园，记得给花朵浇水的同时也要给自己浇水哦~'
  },
  'ENFJ': {
    name: '主角',
    quote: '我最大的快乐就是帮助他人实现梦想',
    rarity: '较稀有',
   脑洞Index: '中',
    socialBattery: '高',
    percentages: {
      e: 85,
      i: 15,
      s: 35,
      n: 65,
      t: 25,
      f: 75,
      j: 80,
      p: 20
    },
    portrait: '你是一个热情、富有魅力的领导者，善于理解和激励他人。你具有强烈的责任感和使命感，希望能够为他人和社会做出贡献。你善于沟通和协调，能够将不同的人凝聚在一起。',
    typicalBehaviors: [
      '你善于激励和鼓舞他人，帮助他们实现目标',
      '你关注团队的和谐与凝聚力',
      '你喜欢参与社会活动，为他人提供支持'
    ],
    strengths: [
      '领导力强，善于激励他人',
      '同理心强，善于理解他人',
      '沟通能力强，善于协调关系'
    ],
    blindSpots: [
      '可能过于关注他人的需求，忽略自己的需求',
      '可能过于理想化，对他人期望过高'
    ],
    suggestions: [
      '学会关注自己的需求，避免过度付出',
      '接受他人的局限性，避免对他人期望过高'
    ],
    compatibility: {
      friend: 'INFJ, ENFP, ESFJ',
      work: 'ESFJ, ESTJ, INFJ',
      love: 'INFP, INFJ, ENFP'
    },
    celebrities: ['奥巴马', '奥普拉', '甘地', '赫敏·格兰杰'],
    eggText: '你的大脑是一个温暖的太阳，记得发光的同时也要补充能量哦~'
  },
  'ENFP': {
    name: '宣传者',
    quote: '生活是一场冒险，我要尽情体验',
    rarity: '常见',
   脑洞Index: '高',
    socialBattery: '高',
    percentages: {
      e: 90,
      i: 10,
      s: 20,
      n: 80,
      t: 25,
      f: 75,
      j: 30,
      p: 70
    },
    portrait: '你是一个充满热情和创造力的自由灵魂，善于发现生活中的美好和可能性。你精力充沛，善于社交，能够与各种人建立联系。你富有理想主义精神，希望能够为世界带来积极的改变。',
    typicalBehaviors: [
      '你喜欢尝试新的事物，寻求新的体验',
      '你善于与人交流，能够迅速与陌生人建立联系',
      '你富有创造力，常常有新的想法和创意'
    ],
    strengths: [
      '创造力强，富有想象力',
      '社交能力强，善于与人沟通',
      '乐观积极，充满热情'
    ],
    blindSpots: [
      '可能过于冲动，缺乏计划',
      '可能过于理想主义，忽略现实的限制'
    ],
    suggestions: [
      '学会制定计划，提高执行力',
      '平衡理想与现实，接受世界的不完美'
    ],
    compatibility: {
      friend: 'INFP, ENFJ, ENTP',
      work: 'ENTP, ESFP, ESTP',
      love: 'INFP, INTJ, INFJ'
    },
    celebrities: [' Walt Disney', '罗宾·威廉姆斯', '玛丽·居里', '莱娅公主'],
    eggText: '你的大脑是一个五彩斑斓的游乐场，记得玩得开心的同时也要按时闭园哦~'
  },
  'ISTJ': {
    name: '物流师',
    quote: '细节决定成败',
    rarity: '常见',
   脑洞Index: '低',
    socialBattery: '低',
    percentages: {
      e: 20,
      i: 80,
      s: 85,
      n: 15,
      t: 75,
      f: 25,
      j: 90,
      p: 10
    },
    portrait: '你是一个务实、可靠的人，重视传统和秩序。你善于组织和管理，能够确保事情按照计划进行。你注重细节，做事认真负责，是团队中值得信赖的成员。',
    typicalBehaviors: [
      '你喜欢按照计划和流程做事，不喜欢意外和变化',
      '你注重细节，做事认真负责',
      '你重视传统和规则，尊重权威'
    ],
    strengths: [
      '可靠负责，做事认真细致',
      '组织能力强，善于管理',
      '注重实际，脚踏实地'
    ],
    blindSpots: [
      '可能过于保守，拒绝改变',
      '可能过于注重细节，忽略整体'
    ],
    suggestions: [
      '学会接受变化，保持开放的心态',
      '培养全局思维，关注整体目标'
    ],
    compatibility: {
      friend: 'ISFJ, ESTJ, ISTP',
      work: 'ESTJ, ISFJ, INTJ',
      love: 'ISFJ, ESFJ, ESTJ'
    },
    celebrities: ['乔治·华盛顿', '女王伊丽莎白二世', '赫敏·格兰杰', '山姆·甘姆齐'],
    eggText: '你的大脑是一个精密的物流中心，记得货物运转的同时也要给仓库管理员放假哦~'
  },
  'ISFJ': {
    name: '守护者',
    quote: '我会一直在你身边',
    rarity: '常见',
   脑洞Index: '低',
    socialBattery: '中',
    percentages: {
      e: 25,
      i: 75,
      s: 90,
      n: 10,
      t: 30,
      f: 70,
      j: 85,
      p: 15
    },
    portrait: '你是一个温暖、体贴的人，善于照顾他人的需求。你重视家庭和传统，是团队中的守护者和支持者。你做事认真负责，能够为他人提供稳定的支持和帮助。',
    typicalBehaviors: [
      '你善于照顾他人的需求，喜欢为他人提供帮助',
      '你重视家庭和朋友，愿意为他们付出',
      '你做事认真负责，注重细节'
    ],
    strengths: [
      '体贴入微，善于照顾他人',
      '可靠负责，做事认真细致',
      '重视传统，维护和谐'
    ],
    blindSpots: [
      '可能过于关注他人的需求，忽略自己的需求',
      '可能过于保守，拒绝改变'
    ],
    suggestions: [
      '学会关注自己的需求，避免过度付出',
      '保持开放的心态，接受新的想法和变化'
    ],
    compatibility: {
      friend: 'ISTJ, ESFJ, ISFP',
      work: 'ESFJ, ESTJ, ISTJ',
      love: 'ISTJ, ESFJ, ESTJ'
    },
    celebrities: ['特蕾莎修女', '圣母玛利亚', '佩妮·霍布斯', '山姆·甘姆齐'],
    eggText: '你的大脑是一个温暖的守护者，记得保护他人的同时也要保护好自己哦~'
  },
  'ESTJ': {
    name: '执行官',
    quote: '规则是为了让事情更顺利',
    rarity: '常见',
   脑洞Index: '低',
    socialBattery: '高',
    percentages: {
      e: 85,
      i: 15,
      s: 90,
      n: 10,
      t: 80,
      f: 20,
      j: 95,
      p: 5
    },
    portrait: '你是一个务实、果断的领导者，善于组织和管理。你重视秩序和效率，能够确保事情按照计划进行。你善于制定规则和流程，是团队中的执行者和组织者。',
    typicalBehaviors: [
      '你喜欢制定计划和规则，确保事情有序进行',
      '你善于组织和管理，能够有效地分配任务',
      '你注重效率和结果，不喜欢拖延'
    ],
    strengths: [
      '组织能力强，善于管理',
      '决策果断，行动迅速',
      '注重效率和结果'
    ],
    blindSpots: [
      '可能过于严格，缺乏灵活性',
      '可能过于注重规则，忽略他人的感受'
    ],
    suggestions: [
      '学会灵活应对变化，避免过于僵化',
      '关注他人的感受，提高人际关系能力'
    ],
    compatibility: {
      friend: 'ISTJ, ESFJ, ENTJ',
      work: 'ISTJ, ISFJ, ENTJ',
      love: 'ISFJ, ESFJ, ISTJ'
    },
    celebrities: ['丘吉尔', '希拉里·克林顿', '美国队长', '赫敏·格兰杰'],
    eggText: '你的大脑是一个高效的执行中心，记得按计划行事的同时也要给计划留一点弹性哦~'
  },
  'ESFJ': {
    name: '领事',
    quote: '和谐是最重要的',
    rarity: '常见',
   脑洞Index: '低',
    socialBattery: '高',
    percentages: {
      e: 90,
      i: 10,
      s: 85,
      n: 15,
      t: 20,
      f: 80,
      j: 90,
      p: 10
    },
    portrait: '你是一个热情、体贴的人，善于照顾他人的需求。你重视和谐与合作，是团队中的协调者和支持者。你善于社交，能够与各种人建立良好的关系。',
    typicalBehaviors: [
      '你善于照顾他人的需求，喜欢为他人提供帮助',
      '你重视团队的和谐与凝聚力',
      '你善于社交，喜欢与他人互动'
    ],
    strengths: [
      '体贴入微，善于照顾他人',
      '社交能力强，善于与人沟通',
      '重视和谐，善于协调关系'
    ],
    blindSpots: [
      '可能过于关注他人的需求，忽略自己的需求',
      '可能过于在意他人的看法，缺乏独立判断'
    ],
    suggestions: [
      '学会关注自己的需求，避免过度付出',
      '培养独立判断能力，不要过于在意他人的看法'
    ],
    compatibility: {
      friend: 'ISFJ, ESTJ, ENFJ',
      work: 'ISFJ, ESTJ, ENFJ',
      love: 'ESTJ, ISTJ, ESFP'
    },
    celebrities: ['奥普拉', '黛安娜王妃', '瑞秋·格林', '山姆·甘姆齐'],
    eggText: '你的大脑是一个和谐的社交中心，记得照顾他人情绪的同时也要照顾好自己的情绪哦~'
  },
  'ISTP': {
    name: '鉴赏家',
    quote: '实践出真知',
    rarity: '较稀有',
   脑洞Index: '中',
    socialBattery: '低',
    percentages: {
      e: 20,
      i: 80,
      s: 85,
      n: 15,
      t: 75,
      f: 25,
      j: 30,
      p: 70
    },
    portrait: '你是一个务实、灵活的问题解决者，善于动手操作和实践。你喜欢探索和了解事物的工作原理，能够在实践中学习和成长。你冷静、理性，能够在压力下保持清醒的头脑。',
    typicalBehaviors: [
      '你喜欢动手操作，善于修理和制作东西',
      '你冷静、理性，能够在压力下保持清醒',
      '你喜欢探索和了解事物的工作原理'
    ],
    strengths: [
      '动手能力强，善于解决实际问题',
      '冷静理性，能够在压力下保持清醒',
      '灵活适应，能够应对变化'
    ],
    blindSpots: [
      '可能过于注重实际，忽略理论和抽象思维',
      '可能过于独立，不愿意寻求帮助'
    ],
    suggestions: [
      '学会理论与实践相结合，培养抽象思维能力',
      '学会团队合作，不要过于独立'
    ],
    compatibility: {
      friend: 'ESTP, ISTJ, INTP',
      work: 'ESTP, ISTJ, INTJ',
      love: 'ESTP, ESFP, ISFP'
    },
    celebrities: ['史蒂夫·乔布斯', '詹姆斯·邦德', '鹰眼', '阿拉贡'],
    eggText: '你的大脑是一个敏锐的工具库，记得使用工具的同时也要保养工具哦~'
  },
  'ISFP': {
    name: '探险家',
    quote: '生活是艺术，我是创作者',
    rarity: '常见',
   脑洞Index: '中',
    socialBattery: '中',
    percentages: {
      e: 30,
      i: 70,
      s: 80,
      n: 20,
      t: 25,
      f: 75,
      j: 35,
      p: 65
    },
    portrait: '你是一个温柔、敏感的艺术家，善于通过艺术和创造性表达来展现自己的情感和想法。你重视个人体验和感受，喜欢探索和体验生活中的美好。你灵活、适应，能够在变化中找到平衡。',
    typicalBehaviors: [
      '你喜欢通过艺术、音乐或其他创造性方式表达自己',
      '你重视个人体验和感受，善于察觉美',
      '你灵活适应，能够在变化中找到平衡'
    ],
    strengths: [
      '创造力强，善于表达',
      '敏感细腻，善于察觉美',
      '灵活适应，能够应对变化'
    ],
    blindSpots: [
      '可能过于敏感，容易受到他人情绪的影响',
      '可能缺乏规划，过于随性'
    ],
    suggestions: [
      '培养情绪韧性，避免过度敏感',
      '学会制定计划，提高执行力'
    ],
    compatibility: {
      friend: 'ESFP, ISFJ, INFP',
      work: 'ESFP, ESTP, INFP',
      love: 'ESFP, ISTP, ENFP'
    },
    celebrities: ['莫奈', '弗里达·卡罗', '精灵王子莱戈拉斯', '山姆·甘姆齐'],
    eggText: '你的大脑是一个美丽的艺术画廊，记得创作的同时也要给自己留出欣赏的时间哦~'
  },
  'ESTP': {
    name: '企业家',
    quote: '行动胜于言语',
    rarity: '较稀有',
   脑洞Index: '中',
    socialBattery: '高',
    percentages: {
      e: 90,
      i: 10,
      s: 90,
      n: 10,
      t: 70,
      f: 30,
      j: 20,
      p: 80
    },
    portrait: '你是一个充满活力、行动派的人，善于抓住机会和解决实际问题。你喜欢冒险和挑战，能够在压力下保持冷静。你善于社交，能够与各种人建立联系，是团队中的行动者和冒险家。',
    typicalBehaviors: [
      '你喜欢冒险和挑战，寻求新的体验',
      '你善于解决实际问题，行动迅速',
      '你善于社交，能够与各种人建立联系'
    ],
    strengths: [
      '行动能力强，善于解决实际问题',
      '社交能力强，善于与人沟通',
      '适应能力强，能够应对变化'
    ],
    blindSpots: [
      '可能过于冲动，缺乏计划',
      '可能过于注重短期目标，忽略长期规划'
    ],
    suggestions: [
      '学会制定计划，避免过于冲动',
      '培养长期思维，关注长远目标'
    ],
    compatibility: {
      friend: 'ISTP, ESFP, ENTP',
      work: 'ISTP, ESFP, ENTJ',
      love: 'ESFP, ISTP, ENFP'
    },
    celebrities: ['哥伦布', '麦当娜', '钢铁侠', '阿拉贡'],
    eggText: '你的大脑是一个充满活力的行动中心，记得行动的同时也要给自己留出思考的时间哦~'
  },
  'ESFP': {
    name: '表演者',
    quote: '生活就是舞台，我要尽情表演',
    rarity: '常见',
   脑洞Index: '中',
    socialBattery: '高',
    percentages: {
      e: 95,
      i: 5,
      s: 85,
      n: 15,
      t: 20,
      f: 80,
      j: 25,
      p: 75
    },
    portrait: '你是一个热情、活泼的表演者，善于通过行动和表达来展现自己。你喜欢与人互动和社交，能够为周围的人带来欢乐和活力。你重视当下的体验，善于享受生活中的美好。',
    typicalBehaviors: [
      '你喜欢成为焦点，善于表达和表演',
      '你喜欢与人互动和社交，能够迅速与陌生人建立联系',
      '你重视当下的体验，善于享受生活'
    ],
    strengths: [
      '社交能力强，善于与人沟通',
      '热情活泼，能够为周围的人带来欢乐',
      '适应能力强，能够应对变化'
    ],
    blindSpots: [
      '可能过于注重当下，忽略未来规划',
      '可能过于在意他人的看法，缺乏独立判断'
    ],
    suggestions: [
      '学会制定未来规划，避免过于短视',
      '培养独立判断能力，不要过于在意他人的看法'
    ],
    compatibility: {
      friend: 'ISFP, ESTP, ENFP',
      work: 'ESTP, ISFP, ENFP',
      love: 'ESTP, ESFJ, ISFP'
    },
    celebrities: ['玛丽莲·梦露', '埃尔维斯·普雷斯利', '小罗伯特·唐尼', '山姆·甘姆齐'],
    eggText: '你的大脑是一个闪亮的舞台，记得表演的同时也要给自己留出后台休息的时间哦~'
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  state.questions = MBTI_QUESTIONS;
  state.answers = new Array(MBTI_QUESTIONS.length).fill(null);
  document.getElementById('totalQuestions').textContent = MBTI_QUESTIONS.length;
  
  
});

// 测试百分比计算
function testPercentageCalculation() {
  try {
    console.log('测试按钮被点击');
    
    // 手动创建测试答案，确保每个维度的数量正确
    const testAnswers = [];
    
    // E/I 维度：10个问题，随机生成e或i
    for (let i = 0; i < 10; i++) {
      testAnswers.push(Math.random() > 0.5 ? 'e' : 'i');
    }
    
    // S/N 维度：20个问题，随机生成s或n
    for (let i = 0; i < 20; i++) {
      testAnswers.push(Math.random() > 0.5 ? 's' : 'n');
    }
    
    // T/F 维度：20个问题，随机生成t或f
    for (let i = 0; i < 20; i++) {
      testAnswers.push(Math.random() > 0.5 ? 't' : 'f');
    }
    
    // J/P 维度：20个问题，随机生成j或p
    for (let i = 0; i < 20; i++) {
      testAnswers.push(Math.random() > 0.5 ? 'j' : 'p');
    }
    
    console.log('测试答案创建完成，数量:', testAnswers.length);
    
    // 计算结果
    const result = calculateMBTIResult(testAnswers);
    
    console.log('计算结果完成');
    
    // 输出测试结果
    console.log('测试答案数量:', testAnswers.length);
    console.log('E计数:', result.counts.e);
    console.log('I计数:', result.counts.i);
    console.log('S计数:', result.counts.s);
    console.log('N计数:', result.counts.n);
    console.log('T计数:', result.counts.t);
    console.log('F计数:', result.counts.f);
    console.log('J计数:', result.counts.j);
    console.log('P计数:', result.counts.p);
    console.log('E百分比:', result.percentages.e.toFixed(2), '%');
    console.log('I百分比:', result.percentages.i.toFixed(2), '%');
    console.log('S百分比:', result.percentages.s.toFixed(2), '%');
    console.log('N百分比:', result.percentages.n.toFixed(2), '%');
    console.log('T百分比:', result.percentages.t.toFixed(2), '%');
    console.log('F百分比:', result.percentages.f.toFixed(2), '%');
    console.log('J百分比:', result.percentages.j.toFixed(2), '%');
    console.log('P百分比:', result.percentages.p.toFixed(2), '%');
    
    // 显示结果
    state.answers = testAnswers;
    state.testResult = result;
    
    console.log('开始显示结果');
    
    const startScreen = document.getElementById('startScreen');
    const resultScreen = document.getElementById('resultScreen');
    
    console.log('startScreen元素:', startScreen);
    console.log('resultScreen元素:', resultScreen);
    
    if (startScreen) {
      startScreen.classList.remove('active');
      console.log('startScreen.active 类已移除');
    } else {
      console.error('startScreen元素不存在');
    }
    
    if (resultScreen) {
      resultScreen.classList.add('active');
      console.log('resultScreen.active 类已添加');
    } else {
      console.error('resultScreen元素不存在');
    }
    
    renderResult();
    console.log('结果渲染完成');
    
  } catch (error) {
    console.error('测试百分比计算失败:', error);
    alert('测试百分比计算失败: ' + error.message);
  }
}

// 新的测试函数
function testCalculation() {
  try {
    // 手动创建测试答案，确保每个维度的数量正确
    const testAnswers = [];
    
    // E/I 维度：10个问题
    for (let i = 0; i < 10; i++) {
      testAnswers.push('e');
    }
    
    // S/N 维度：20个问题
    for (let i = 0; i < 20; i++) {
      testAnswers.push('s');
    }
    
    // T/F 维度：20个问题
    for (let i = 0; i < 20; i++) {
      testAnswers.push('t');
    }
    
    // J/P 维度：20个问题
    for (let i = 0; i < 20; i++) {
      testAnswers.push('j');
    }
    
    // 计算结果
    console.log('新测试答案数量:', testAnswers.length);
    const result = calculateMBTIResult(testAnswers);
    console.log('新测试E计数:', result.counts.e);
    console.log('新测试I计数:', result.counts.i);
    console.log('新测试S计数:', result.counts.s);
    console.log('新测试N计数:', result.counts.n);
    console.log('新测试T计数:', result.counts.t);
    console.log('新测试F计数:', result.counts.f);
    console.log('新测试J计数:', result.counts.j);
    console.log('新测试P计数:', result.counts.p);
    console.log('新测试E百分比:', result.percentages.e.toFixed(2), '%');
    console.log('新测试I百分比:', result.percentages.i.toFixed(2), '%');
    console.log('新测试S百分比:', result.percentages.s.toFixed(2), '%');
    console.log('新测试N百分比:', result.percentages.n.toFixed(2), '%');
    console.log('新测试T百分比:', result.percentages.t.toFixed(2), '%');
    console.log('新测试F百分比:', result.percentages.f.toFixed(2), '%');
    console.log('新测试J百分比:', result.percentages.j.toFixed(2), '%');
    console.log('新测试P百分比:', result.percentages.p.toFixed(2), '%');
    
    alert('测试完成！请查看控制台输出。');
    
  } catch (error) {
    console.error('新测试失败:', error);
    alert('新测试失败: ' + error.message);
  }
}



// 开始测试
function startTest() {
  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('codeModal').classList.add('active');
}

// 关闭兑换码模态框
function closeCodeModal() {
  document.getElementById('codeModal').classList.remove('active');
  document.getElementById('startScreen').classList.add('active');
  document.getElementById('codeInput').value = '';
  document.getElementById('codeError').classList.remove('show');
}

// 验证兑换码
async function validateCode() {
  const code = document.getElementById('codeInput').value.trim().toUpperCase();
  const errorDiv = document.getElementById('codeError');

  if (!code || code.length !== 8) {
    errorDiv.textContent = '请输入8位兑换码';
    errorDiv.classList.add('show');
    return;
  }

  // 特殊处理：VIP测试码-纯前端
  if (code === 'VIP88888') {
    state.exchangeCode = code;
    document.getElementById('codeModal').classList.remove('active');
    showTestScreen();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/validate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '兑换码验证失败');
    }

    state.exchangeCode = code;
    document.getElementById('codeModal').classList.remove('active');
    showTestScreen();
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.add('show');
  }
}

// 显示测试界面
function showTestScreen() {
  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('testScreen').classList.add('active');
  state.currentQuestion = 0;
  state.isTransitioning = false;
  displayQuestion();
}

// 显示题目
function displayQuestion() {
  const question = state.questions[state.currentQuestion];
  document.getElementById('questionText').textContent = `问题${question.id}：${question.question}`;
  document.getElementById('currentQuestion').textContent = state.currentQuestion + 1;

  // 更新进度条
  const progress = ((state.currentQuestion + 1) / state.questions.length) * 100;
  document.getElementById('progressFill').style.width = progress + '%';

  // 隐藏所有选项
  const allOptions = document.querySelectorAll('.option');
  allOptions.forEach(option => {
    option.style.display = 'none';
  });

  // 显示当前题目的选项
  question.options.forEach((option, index) => {
    const optionElement = allOptions[index];
    optionElement.style.display = 'flex';
    optionElement.querySelector('input[type="radio"]').value = option.value;
    optionElement.querySelector('.option-text').textContent = option.text;
    optionElement.querySelector('input[type="radio"]').checked = state.answers[state.currentQuestion] === option.value;
  });

  // 启用所有选项
  document.querySelectorAll('.option').forEach(option => {
    option.classList.remove('disabled');
  });

  // 更新按钮状态
  const isLastQuestion = state.currentQuestion === state.questions.length - 1;
  document.getElementById('prevBtn').style.display = state.currentQuestion > 0 ? 'block' : 'none';
  document.getElementById('submitTestBtn').style.display = isLastQuestion ? 'block' : 'none';
}

// 选择答案
function selectAnswer(value) {
  // 防止快速点击导致的跳题
  if (state.isTransitioning) {
    console.log('正在跳转中，忽略此次点击');
    return;
  }

  state.answers[state.currentQuestion] = value;
  console.log(`第 ${state.currentQuestion + 1} 题: 选择答案 ${value}`);

  // 自动跳转到下一题（除了最后一题）
  const isLastQuestion = state.currentQuestion === state.questions.length - 1;
  if (!isLastQuestion) {
    // 设置跳转标志，防止快速点击
    state.isTransitioning = true;

    // 禁用所有选项，防止快速点击
    document.querySelectorAll('.option').forEach(option => {
      option.classList.add('disabled');
    });

    setTimeout(() => {
      state.currentQuestion++;
      console.log(`跳转到第 ${state.currentQuestion + 1} 题`);
      displayQuestion();
      // 跳转完成，清除标志
      state.isTransitioning = false;
    }, 300); // 延迟300ms，让用户看到选择效果
  }
}

// 上一题
function previousQuestion() {
  // 清除跳转标志
  state.isTransitioning = false;

  if (state.currentQuestion > 0) {
    state.currentQuestion--;
    console.log(`返回到第 ${state.currentQuestion + 1} 题`);
    // 清除选项的禁用状态
    document.querySelectorAll('.option').forEach(option => {
      option.classList.remove('disabled');
    });
    displayQuestion();
  }
}

// 处理提交测试按钮点击
function handleSubmitTest() {
  // 检查所有题目是否已回答
  const unansweredCount = state.answers.filter(a => a === null).length;
  if (unansweredCount > 0) {
    alert(`请完成所有题目，还剩 ${unansweredCount} 题未回答`);
    return;
  }

  // 提交测试
  submitTest();
}

// 计算MBTI结果
function calculateMBTIResult(answers) {
  // 统计各维度得分
  const counts = {
    e: 0, i: 0,
    s: 0, n: 0,
    t: 0, f: 0,
    j: 0, p: 0
  };

  answers.forEach(answer => {
    if (counts.hasOwnProperty(answer)) {
      counts[answer]++;
    }
  });

  // 计算百分比
  const percentages = {
    e: (counts.e / 10) * 100,
    i: 100 - (counts.e / 10) * 100,
    s: (counts.s / 20) * 100,
    n: 100 - (counts.s / 20) * 100,
    t: (counts.t / 20) * 100,
    f: 100 - (counts.t / 20) * 100,
    j: (counts.j / 20) * 100,
    p: 100 - (counts.j / 20) * 100
  };

  // 确定类型
  const type = [
    counts.e > counts.i ? 'E' : 'I',
    counts.s > counts.n ? 'S' : 'N',
    counts.t > counts.f ? 'T' : 'F',
    counts.j > counts.p ? 'J' : 'P'
  ].join('');

  return {
    type,
    counts,
    percentages,
    typeInfo: MBTI_DATA[type] || {
      name: '未知类型',
      description: '请重新测试',
      category: '未知'
    }
  };
}

// 提交测试
async function submitTest() {
  try {
    // 清除跳转标志
    state.isTransitioning = false;

    // 显示加载状态
    document.getElementById('testScreen').classList.add('loading');
    document.getElementById('submitTestBtn').disabled = true;
    document.getElementById('submitTestBtn').textContent = '提交中...';

    // 计算结果
    const result = calculateMBTIResult(state.answers);
    state.testResult = result;

    // 调用后端API标记兑换码为已使用
    if (state.exchangeCode && state.exchangeCode !== 'VIP88888') {
      const response = await fetch(`${API_BASE_URL}/submit-mbti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: state.exchangeCode,
          answers: state.answers,
          realAge: 25 // 为了满足API要求，使用默认值
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('后端错误:', errorData);
        // 即使API调用失败，也继续显示结果
      }
    }

    showResultScreen();
  } catch (error) {
    console.error('提交测试异常:', error);
    // 即使发生错误，也继续显示结果
    if (state.testResult) {
      showResultScreen();
    } else {
      alert(`提交失败:\n${error.message}`);
    }
  } finally {
    document.getElementById('testScreen').classList.remove('loading');
    document.getElementById('submitTestBtn').disabled = false;
    document.getElementById('submitTestBtn').textContent = '提交测试';
  }
}

// 显示结果界面
function showResultScreen() {
  document.getElementById('testScreen').classList.remove('active');
  document.getElementById('resultScreen').classList.add('active');
  renderResult();
}

// 渲染结果
function renderResult() {
  console.log('renderResult 函数被调用');
  const result = state.testResult;
  console.log('测试结果:', result);
  const typeData = MBTI_DATA[result.type] || MBTI_DATA['INTJ']; // 默认使用INTJ数据
  
  const html = `
    <!-- 模块一: 核心人格标识 -->
    <div class="result-module module-age-comparison">
      <div class="personality-highlight">
        <div class="personality-image">🎭</div>
        <div class="personality-label">你的MBTI性格类型</div>
        <div class="personality-name">${result.type}</div>
        <div class="personality-nickname">${typeData.name}</div>
        <div class="personality-quote">${typeData.quote}</div>
        <div class="personality-tags">
          <span class="personality-tag">稀有度: ${typeData.rarity}</span>
          <span class="personality-tag">脑洞指数: ${typeData.脑洞Index}</span>
          <span class="personality-tag">社交电池: ${typeData.socialBattery}</span>
        </div>
      </div>
    </div>

    <!-- 模块二: 四维度倾向可视化 -->
    <div class="result-module module-dimensions">
      <h3 class="module-title">📊 四维度倾向</h3>
      <div class="dimensions-list">
        <!-- E/I 维度 -->
        <div class="dimension-bar" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; min-height: 100px;">
          <div class="dimension-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="dimension-side" style="display: flex; align-items: center; gap: 8px;">
              <span class="dimension-letter" style="font-size: 16px; font-weight: 700; color: var(--text-color);">E</span>
              <span class="dimension-name" style="font-size: 12px; color: #999;">外向</span>
            </div>
            <div class="dimension-side" style="display: flex; align-items: center; gap: 8px;">
              <span class="dimension-letter" style="font-size: 16px; font-weight: 700; color: var(--text-color);">I</span>
              <span class="dimension-name" style="font-size: 12px; color: #999;">内向</span>
            </div>
          </div>
          <div class="progress-container" style="height: 8px !important; width: 100% !important; background: #E5E7EB !important; border-radius: 20px !important; overflow: hidden !important; display: block !important; min-height: 8px;">
            <div class="progress-bar-fill" style="width: ${result.percentages.i > result.percentages.e ? result.percentages.i : result.percentages.e}%; height: 100% !important; background: linear-gradient(90deg, #A78BFA, #C084FC) !important; border-radius: 20px !important; transition: width 0.5s ease !important; display: block !important;"></div>
          </div>
          <div class="dimension-data" style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
            <div class="dimension-percentage" style="font-weight: 700; color: #7C3AED;">${result.percentages.i > result.percentages.e ? 'I' : 'E'} 倾向 ${result.percentages.i > result.percentages.e ? result.percentages.i.toFixed(0) : result.percentages.e.toFixed(0)}%</div>
            <div class="dimension-insight">${result.percentages.i > result.percentages.e ? '你更偏爱独处充电' : '你更享受社交互动'}</div>
          </div>
        </div>

        <!-- S/N 维度 -->
        <div class="dimension-bar" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; min-height: 100px;">
          <div class="dimension-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="dimension-side" style="display: flex; align-items: center; gap: 8px;">
              <span class="dimension-letter" style="font-size: 16px; font-weight: 700; color: var(--text-color);">S</span>
              <span class="dimension-name" style="font-size: 12px; color: #999;">感觉</span>
            </div>
            <div class="dimension-side" style="display: flex; align-items: center; gap: 8px;">
              <span class="dimension-letter" style="font-size: 16px; font-weight: 700; color: var(--text-color);">N</span>
              <span class="dimension-name" style="font-size: 12px; color: #999;">直觉</span>
            </div>
          </div>
          <div class="progress-container" style="height: 8px !important; width: 100% !important; background: #E5E7EB !important; border-radius: 20px !important; overflow: hidden !important; display: block !important; min-height: 8px;">
            <div class="progress-bar-fill" style="width: ${result.percentages.n > result.percentages.s ? result.percentages.n : result.percentages.s}%; height: 100% !important; background: linear-gradient(90deg, #A78BFA, #C084FC) !important; border-radius: 20px !important; transition: width 0.5s ease !important; display: block !important;"></div>
          </div>
          <div class="dimension-data" style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
            <div class="dimension-percentage" style="font-weight: 700; color: #7C3AED;">${result.percentages.n > result.percentages.s ? 'N' : 'S'} 倾向 ${result.percentages.n > result.percentages.s ? result.percentages.n.toFixed(0) : result.percentages.s.toFixed(0)}%</div>
            <div class="dimension-insight">${result.percentages.n > result.percentages.s ? '你更关注未来和可能性' : '你更注重现实和细节'}</div>
          </div>
        </div>

        <!-- T/F 维度 -->
        <div class="dimension-bar" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; min-height: 100px;">
          <div class="dimension-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="dimension-side" style="display: flex; align-items: center; gap: 8px;">
              <span class="dimension-letter" style="font-size: 16px; font-weight: 700; color: var(--text-color);">T</span>
              <span class="dimension-name" style="font-size: 12px; color: #999;">思考</span>
            </div>
            <div class="dimension-side" style="display: flex; align-items: center; gap: 8px;">
              <span class="dimension-letter" style="font-size: 16px; font-weight: 700; color: var(--text-color);">F</span>
              <span class="dimension-name" style="font-size: 12px; color: #999;">情感</span>
            </div>
          </div>
          <div class="progress-container" style="height: 8px !important; width: 100% !important; background: #E5E7EB !important; border-radius: 20px !important; overflow: hidden !important; display: block !important; min-height: 8px;">
            <div class="progress-bar-fill" style="width: ${result.percentages.f > result.percentages.t ? result.percentages.f : result.percentages.t}%; height: 100% !important; background: linear-gradient(90deg, #A78BFA, #C084FC) !important; border-radius: 20px !important; transition: width 0.5s ease !important; display: block !important;"></div>
          </div>
          <div class="dimension-data" style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
            <div class="dimension-percentage" style="font-weight: 700; color: #7C3AED;">${result.percentages.f > result.percentages.t ? 'F' : 'T'} 倾向 ${result.percentages.f > result.percentages.t ? result.percentages.f.toFixed(0) : result.percentages.t.toFixed(0)}%</div>
            <div class="dimension-insight">${result.percentages.f > result.percentages.t ? '你更重视情感和价值观' : '你更注重逻辑和客观'}</div>
          </div>
        </div>

        <!-- J/P 维度 -->
        <div class="dimension-bar" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; min-height: 100px;">
          <div class="dimension-header" style="display: flex; justify-content: space-between; align-items: center;">
            <div class="dimension-side" style="display: flex; align-items: center; gap: 8px;">
              <span class="dimension-letter" style="font-size: 16px; font-weight: 700; color: var(--text-color);">J</span>
              <span class="dimension-name" style="font-size: 12px; color: #999;">判断</span>
            </div>
            <div class="dimension-side" style="display: flex; align-items: center; gap: 8px;">
              <span class="dimension-letter" style="font-size: 16px; font-weight: 700; color: var(--text-color);">P</span>
              <span class="dimension-name" style="font-size: 12px; color: #999;">感知</span>
            </div>
          </div>
          <div class="progress-container" style="height: 8px !important; width: 100% !important; background: #E5E7EB !important; border-radius: 20px !important; overflow: hidden !important; display: block !important; min-height: 8px;">
            <div class="progress-bar-fill" style="width: ${result.percentages.p > result.percentages.j ? result.percentages.p : result.percentages.j}%; height: 100% !important; background: linear-gradient(90deg, #A78BFA, #C084FC) !important; border-radius: 20px !important; transition: width 0.5s ease !important; display: block !important;"></div>
          </div>
          <div class="dimension-data" style="display: flex; justify-content: space-between; align-items: center; font-size: 12px;">
            <div class="dimension-percentage" style="font-weight: 700; color: #7C3AED;">${result.percentages.p > result.percentages.j ? 'P' : 'J'} 倾向 ${result.percentages.p > result.percentages.j ? result.percentages.p.toFixed(0) : result.percentages.j.toFixed(0)}%</div>
            <div class="dimension-insight">${result.percentages.p > result.percentages.j ? '你更偏好灵活和即兴' : '你更喜欢计划和秩序'}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块三: 深度性格解析 -->
    <div class="result-module module-analysis">
      <h3 class="module-title">🌟 深度性格解析</h3>
      
      <!-- 整体画像 -->
      <div class="analysis-section">
        <h4 class="section-subtitle">🎨 整体画像</h4>
        <p class="section-content">${typeData.portrait}</p>
      </div>

      <!-- 典型表现举例 -->
      <div class="analysis-section">
        <h4 class="section-subtitle">📝 典型表现</h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 10px;">
            <span style="font-size: 16px; margin-top: 2px;">1.</span>
            <span>${typeData.typicalBehaviors[0]}</span>
          </li>
          <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 10px;">
            <span style="font-size: 16px; margin-top: 2px;">2.</span>
            <span>${typeData.typicalBehaviors[1]}</span>
          </li>
          <li style="display: flex; align-items: flex-start; gap: 10px;">
            <span style="font-size: 16px; margin-top: 2px;">3.</span>
            <span>${typeData.typicalBehaviors[2]}</span>
          </li>
        </ul>
      </div>

      <!-- 优势与盲点 -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <!-- 优势 -->
        <div class="analysis-section">
          <h4 class="section-subtitle">✨ 优势</h4>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
              <span style="font-size: 14px; margin-top: 2px;">•</span>
              <span>${typeData.strengths[0]}</span>
            </li>
            <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
              <span style="font-size: 14px; margin-top: 2px;">•</span>
              <span>${typeData.strengths[1]}</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 8px;">
              <span style="font-size: 14px; margin-top: 2px;">•</span>
              <span>${typeData.strengths[2]}</span>
            </li>
          </ul>
        </div>

        <!-- 盲点 -->
        <div class="analysis-section">
          <h4 class="section-subtitle">⚠️ 盲点</h4>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 8px; display: flex; align-items: flex-start; gap: 8px;">
              <span style="font-size: 14px; margin-top: 2px;">•</span>
              <span>${typeData.blindSpots[0]}</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 8px;">
              <span style="font-size: 14px; margin-top: 2px;">•</span>
              <span>${typeData.blindSpots[1]}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 给你的小建议 -->
      <div class="analysis-section">
        <h4 class="section-subtitle">💡 给你的小建议</h4>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 12px; display: flex; align-items: flex-start; gap: 10px;">
            <span style="font-size: 16px; margin-top: 2px;">1.</span>
            <span>${typeData.suggestions[0]}</span>
          </li>
          <li style="display: flex; align-items: flex-start; gap: 10px;">
            <span style="font-size: 16px; margin-top: 2px;">2.</span>
            <span>${typeData.suggestions[1]}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 模块四: 延伸趣味内容 -->
    <div class="result-module module-matching">
      <h3 class="module-title">🌈 延伸趣味内容</h3>
      
      <!-- 适配度参考 -->
      <div class="matching-section">
        <h4 class="section-subtitle">🤝 适配度参考</h4>
        <div class="compatibility-info">
          <div class="compatibility-item">
            <span class="compatibility-label">最佳朋友类型:</span>
            <span class="compatibility-value">${typeData.compatibility.friend}</span>
          </div>
          <div class="compatibility-item">
            <span class="compatibility-label">职场黄金搭档:</span>
            <span class="compatibility-value">${typeData.compatibility.work}</span>
          </div>
          <div class="compatibility-item">
            <span class="compatibility-label">恋爱化学反应:</span>
            <span class="compatibility-value">${typeData.compatibility.love}</span>
          </div>
        </div>
      </div>

      <!-- 名人/角色同类型 -->
      <div class="matching-section">
        <h4 class="section-subtitle">🌟 名人/角色同类型</h4>
        <div class="celebrities-list">
          ${typeData.celebrities.map(celebrity => `<span class="celebrity-tag">${celebrity}</span>`).join('')}
        </div>
      </div>

      <!-- 一句话彩蛋 -->
      <div class="egg-text">
        ${typeData.eggText}
      </div>
    </div>

    <!-- 免责声明 -->
    <div class="disclaimer">
      本测试结果仅供参考与自我探索，不构成专业心理评估。
    </div>


  `;

  document.getElementById('resultContent').innerHTML = html;
  console.log('生成的HTML:', html);
}

// 绘制雷达图
function drawRadarChart(result) {
  try {
    const canvas = document.getElementById('radarChart');
    if (!canvas) {
      console.error('Canvas 元素不存在');
      return;
    }

    const ctx = canvas.getContext('2d');
    const labels = ['外向性', '感知', '思考', '判断', '内向性', '直觉', '感受', '感知'];
    
    // 准备数据
    const data = [
      result.percentages.e,
      result.percentages.s,
      result.percentages.t,
      result.percentages.j,
      result.percentages.i,
      result.percentages.n,
      result.percentages.f,
      result.percentages.p
    ];

    // 销毁已存在的图表（如果有）
    if (window.radarChartInstance) {
      window.radarChartInstance.destroy();
    }

    // 绘制新的雷达图
    window.radarChartInstance = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: '你的得分',
          data: data,
          borderColor: '#FFB6C1',
          backgroundColor: 'rgba(255, 182, 193, 0.2)',
          borderWidth: 2,
          pointBackgroundColor: '#FFB6C1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20,
              display: false,
              color: '#999',
              font: {
                size: 12
              }
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#5a5a5a',
              font: {
                size: 16,
                weight: '600'
              },
              padding: 15
            }
          },
          filler: {
            propagate: true
          }
        }
      }
    });
  } catch (error) {
    console.error('绘制雷达图失败:', error);
  }
}

// 保存结果图片
async function saveResultImage() {
  try {
    const element = document.getElementById('resultContent');
    const canvas = await html2canvas(element, {
      backgroundColor: '#fff',
      scale: 2,
      useCORS: true,
      logging: false
    });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `MBTI测试结果_${new Date().getTime()}.png`;
    link.click();
  } catch (error) {
    alert('保存图片失败: ' + error.message);
  }
}

// 复制分享文案
function copyShareText() {
  const result = state.testResult;
  const typeData = MBTI_DATA[result.type] || MBTI_DATA['INTJ'];
  
  const shareText = `🌟 我的MBTI性格测试结果来啦！

我是${result.type} - ${typeData.name}

${typeData.quote}

💡 核心特质：
${typeData.strengths.join('\n')}

🤝 最佳匹配：
朋友: ${typeData.compatibility.friend}
职场: ${typeData.compatibility.work}
恋爱: ${typeData.compatibility.love}

✨ 和我同类型的名人有：${typeData.celebrities.join('、')}

快来测测你的MBTI性格类型吧！`;
  
  navigator.clipboard.writeText(shareText)
    .then(() => {
      alert('分享文案已复制到剪贴板！');
    })
    .catch(err => {
      alert('复制失败，请手动复制：' + err);
    });
}

// 分享到小红书
function shareToXiaohongshu() {
  alert('保存图片后发布小红书即可！\n\n1. 点击「保存结果图片」\n2. 打开小红书\n3. 点击「发布」\n4. 选择保存的图片\n5. 粘贴复制的分享文案\n6. 添加话题 #MBTI测试 #性格测试\n7. 点击发布');
}

// 返回首页
function backToStart() {
  state = {
    questions: MBTI_QUESTIONS,
    answers: new Array(MBTI_QUESTIONS.length).fill(null),
    currentQuestion: 0,
    exchangeCode: null,
    testResult: null,
    isTransitioning: false
  };
  document.getElementById('resultScreen').classList.remove('active');
  document.getElementById('startScreen').classList.add('active');
}

// 跳转到HOME页
function goToHome() {
  window.location.href = 'home.html';
}