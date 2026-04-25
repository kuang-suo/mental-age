const API_BASE_URL = '/api';

const questions = [
  {
    id: 'q1',
    text: '当我和喜欢的人确定了关系，我会立刻想了解对方的一切——前任、朋友、习惯，最好全部掌握。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q2',
    text: '对方没有及时回复我消息时，我会忍不住一直刷新对话框，甚至开始想象各种不好的场景。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q3',
    text: '在一段关系里，我经常担心自己不够好，害怕对方哪天就不爱我了。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q4',
    text: '发生矛盾时，我很难冷静下来，脑子里全是对方怎么可以这样对我，甚至会忍不住发一大段消息轰炸。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q5',
    text: '我经常需要对方的确认——比如问"你真的爱我吗""你会一直在吗"——问了才安心。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q6',
    text: '明明想分开，但一想到真的要失去对方，心就痛到无法呼吸，根本做不到放手。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q7',
    text: '我很容易吃醋。即使对方只是正常社交，我也会感到不安和被威胁。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q8',
    text: '恋爱初期那种心跳加速、忽冷忽热的拉扯感，让我欲罢不能——反而关系稳定了我会开始不安。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q9',
    text: '我会为了避免冲突而委屈自己，或者刻意讨好对方，哪怕自己心里很不舒服。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q10',
    text: '对方表现出一点冷淡或不耐烦，我就会陷入自我怀疑——是不是我做错了什么？',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q11',
    text: '我经常在深夜反复回想今天和对方发生的细节，分析自己哪句话说得不对。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q12',
    text: '我爱一个人的时候，会把自己的需求和感受放在最后，甚至完全忽略自己。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q13',
    text: '如果对方突然对我特别好，我反而会警觉——是不是做了什么亏心事，或者要分手？',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q14',
    text: '我很难一个人待着，单身的时候总觉得空虚，必须马上找人谈恋爱来填补。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q15',
    text: '吵架时我说"分手吧""我不想再见到你"，其实内心并不是真的想分，只是想被挽留。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q16',
    text: '我经常拿自己和对方的前任、身边的异性朋友做比较，觉得自己不够好。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q17',
    text: '对方一不开心，我就觉得是自己的责任，会立刻道歉、认错，哪怕根本没做错什么。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q18',
    text: '我很害怕被抛弃，所以有时候会主动试探——故意冷落对方、忽冷忽热——来看对方会不会挽留我。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q19',
    text: '在一段关系里，我常常感到孤独——明明和对方在一起，却觉得对方不理解我。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  },
  {
    id: 'q20',
    text: '分手后，我需要很长时间才能走出来，而且总是忍不住想联系前任，或者偷偷关注对方的动态。',
    options: [
      { label: '非常不符合', score: 1 },
      { label: '比较不符合', score: 2 },
      { label: '不确定', score: 3 },
      { label: '比较符合', score: 4 },
      { label: '非常符合', score: 5 }
    ]
  }
];

const RESULT_LEVELS = [
  {
    min: 20,
    max: 37,
    level: 1,
    emoji: '🥉',
    typeName: '安全型恋人',
    color: '#16A34A',
    label: '爱情里的淡定选手',
    portrait: '你是在亲密关系里难得一见的「人间清醒」。不是不会爱，而是爱得很稳、很踏实。你能够在亲密和独立之间自如切换，既享受两个人的甜蜜，也享受一个人的自在。\n\n你不容易因为对方的一条消息、一句无心的话而情绪崩溃。你相信自己值得被爱，也有能力去爱。对你来说，恋爱是生活的加分项，而不是全部。',
    traits: [
      '🧘 情绪稳定，很少因为感情问题内耗',
      '💬 沟通能力强，懂得用语言解决问题而不是用情绪',
      '🤝 信任伴侣，给对方足够的空间和自由',
      '🌱 在关系里成长，而不是在关系里迷失'
    ],
    gifts: [
      '你的稳定有时候会让焦虑型伴侣感到"不够热烈"',
      '学会偶尔表达强烈的情感需求，也是一种成长'
    ],
    challenges: [
      '确认对方是「真的安全」，而不是「看起来安全」',
      '有些人只是在追求期伪装得很好'
    ],
    advice: '保持你的安全感，同时也要注意——你的稳定有时候会让焦虑型伴侣感到"不够热烈"。学会偶尔表达强烈的情感需求，也是一种成长。另外，确认对方是「真的安全」，而不是「看起来安全」——有些人只是在追求期伪装得很好。',
    match: '安全型或回避型（没错，和回避型在一起反而能互相平衡）。避开高度焦虑型，除非对方已经在自我成长。',
    matchColor: '#16A34A'
  },
  {
    min: 38,
    max: 55,
    level: 2,
    emoji: '🥈',
    typeName: '有点焦虑的安全型',
    color: '#0EA5E9',
    label: '爱情里的「偶尔玻璃心」',
    portrait: '你大部分时候是个成熟、稳定的伴侣，但偶尔会冒出一些焦虑的小火苗。比如对方忘记说晚安，你会小小地在意一下；比如对方和朋友玩得太开心，你会有一瞬间的不安。\n\n你不是那种无时无刻都在查岗的人，但你承认自己有时候会想多。你懂得给自己找台阶下，也懂得消化情绪——只是偶尔消化得慢一点。',
    traits: [
      '🐢 焦虑水平低，能够自我调节大部分情绪',
      '📊 会反思自己的反应，事后经常觉得"好像没必要"',
      '💭 偶尔会脑补，但脑补完能拉回来',
      '🤗 对亲密关系有渴望，但不会把它当成救命稻草'
    ],
    gifts: [
      '你的课题是「区分真实的信号和大脑制造的假信号」',
      '当焦虑来袭时，试着问自己："这件事是真实发生的，还是我脑补的？"'
    ],
    challenges: [
      '轻微焦虑如果不加以觉察，会在压力事件催化下升级',
      '培养一些不依赖伴侣的爱好，能让你的安全感更稳'
    ],
    advice: '你的课题是「区分真实的信号和大脑制造的假信号」。当焦虑来袭时，试着问自己："这件事是真实发生的，还是我脑补的？"这个简单的动作，能帮你减少80%的无效内耗。另外，培养一些不依赖伴侣的爱好，能让你的安全感更稳。',
    match: '安全型，或者正在成长的焦虑型（两个人一起进步也很甜）。尽量避免高回避型——对方的冷漠会把你拖入深渊。',
    matchColor: '#0EA5E9'
  },
  {
    min: 56,
    max: 68,
    level: 3,
    emoji: '🥱',
    typeName: '焦虑型恋人',
    color: '#F97316',
    label: '爱情里的「高敏十级选手」',
    portrait: '你是个典型的焦虑型依恋者。在亲密关系里，你的情绪雷达极其敏锐——对方的一句话、一个语气变化，你都能瞬间捕捉到。\n\n你渴望深度连接，渴望被看见、被回应、被确认。你对伴侣的爱是炽热的、投入的、全情的——但这份炽热背后，藏着一颗害怕被抛弃的心。\n\n你可能经常有这种感觉："我很爱他，但我不知道他爱不爱我。""明明在一起，为什么我还是觉得孤独？""他怎么可以这么淡定？他是不是不够爱我？"',
    traits: [
      '🎬 "他没回消息，是不是和别的女生在一起？"',
      '🎬 "他今天说话少了，是不是我哪里做错了？"',
      '🎬 "他居然忘了我们的纪念日，他是不是不爱我了？"',
      '🎬 "我说了分手他居然没挽留……完了，他真的不要我了。"'
    ],
    gifts: [
      '💗 共情能力极强，能深度感知伴侣的情绪',
      '🔥 对感情极度投入，是非常热烈的伴侣',
      '🌟 情感表达丰富，擅长制造浪漫和惊喜',
      '🕵️ 直觉敏锐，能发现伴侣隐藏的情绪变化'
    ],
    challenges: [
      '学会区分"真实的担忧"和"大脑制造的恐慌"',
      '不要用"试探"来验证爱情——试探只会制造更多不信任',
      '接受一个事实：有些人不是不爱你，只是他们的爱表达方式和你不同'
    ],
    advice: '1. 建立情绪急救包：当焦虑发作时，不要立刻行动。给自己10分钟，写下你现在的想法，然后问自己"这个想法有证据吗？"。这个习惯能帮你减少冲动行为。\n\n2. 练习"绑定确认"：不要问"你爱我吗"（对方回答了你不信），改成问具体的事："这周你方便哪天一起吃饭？"把抽象的情感确认换成具体的陪伴确认。\n\n3. 培养独处能力：你的安全感不能100%寄托在伴侣身上。找到至少一个可以全情投入的爱好——跑步、画画、写作、追剧都可以。这个爱好是你的"情绪充电宝"。\n\n4. 找专业的帮助：如果你的焦虑已经影响到日常生活和人际关系，考虑找心理咨询师聊聊。焦虑型依恋是可以改善的，你值得拥有更轻松的亲密关系。',
    match: '安全型（黄金搭档）或者"觉醒中"的焦虑型（两个人一起成长）。避开高回避型，你们在一起会是灾难——他越逃，你越追，越追他越逃。',
    matchColor: '#F97316'
  },
  {
    min: 69,
    max: 82,
    level: 4,
    emoji: '🔥',
    typeName: '高焦虑型恋人',
    color: '#DC2626',
    label: '爱情里的「情绪过山车乘客」',
    portrait: '你的情感体验比大多数人强烈得多。在爱情里，你不是在谈恋爱——你是在经历一场情感海啸。\n\n你有多爱，就有多怕。你有多投入，就有多患得患失。你的情绪可以在秒秒钟内从甜蜜切换到崩溃，从"他是全世界最好的人"到"他是不是在骗我"。\n\n你可能经常经历这样的循环：焦虑爆发 → 质问/试探/争吵 → 对方暂时给到回应 → 短暂安心 → 新的焦虑来袭 → 再次爆发……\n\n这个循环让你的伴侣筋疲力尽，也让你自己伤痕累累。',
    traits: [
      '💎 情感浓度极高，是最热烈、最忠诚的伴侣',
      '🧠 洞察力惊人，能感知伴侣最细微的情绪波动',
      '🎭 戏剧感强，能把平淡的生活过成电影',
      '🩹 创伤后的共情力，让你对别人的痛苦感同身受'
    ],
    gifts: [
      '你的焦虑不是源于"他不够爱你"',
      '而是源于"你不相信自己能被持续地爱"'
    ],
    challenges: [
      '❌ 停止"分手威胁"——说多了就成真了，而且对方会免疫',
      '❌ 停止"试探忠诚"——查手机、突然出现、让朋友测试……这些只会破坏信任',
      '❌ 停止"情绪化沟通"——生气时发的那些长篇大论，冷静后你自己都不想看'
    ],
    advice: '第一，你需要理解一个真相：你的焦虑不是源于"他不够爱你"，而是源于"你不相信自己能被持续地爱"。这个课题，必须从内部解决，而不是靠伴侣不断证明。\n\n第二，立刻停止这三件事：\n1. ❌ 停止"分手威胁"——说多了就成真了，而且对方会免疫\n2. ❌ 停止"试探忠诚"——查手机、突然出现、让朋友测试……这些只会破坏信任\n3. ❌ 停止"情绪化沟通"——生气时发的那些长篇大论，冷静后你自己都不想看\n\n第三，开始做这三件事：\n1. ✅ 写情绪日记：每天记录一次焦虑发作的触发点、你的反应、结果。一个月后你会看到自己的模式。\n2. ✅ 建立支持系统：朋友、家人、爱好——不要让伴侣成为你唯一的情感来源\n3. ✅ 考虑心理咨询：这是最重要的一条。找一个熟悉依恋类型的咨询师，不是软弱，是对自己负责。',
    match: '找一个情绪稳定的伴侣，然后——主动告诉对方你的依恋模式。不要让对方去猜，主动沟通你的需求和恐惧，比让对方去破解你的情绪密码高效一万倍。',
    matchColor: '#DC2626'
  },
  {
    min: 83,
    max: 100,
    level: 5,
    emoji: '💥',
    typeName: '焦虑型依恋人格',
    color: '#7C3AED',
    label: '爱情里的「重度上瘾患者」',
    portrait: '你已经不是"在恋爱"了——你是"被恋爱支配"。\n\n亲密关系对你来说不是一种选择，而是一种生存必需。你对亲密的渴望已经强烈到类似于成瘾的程度：不谈恋爱会空虚、焦虑、空转；谈了恋爱又会陷入强烈的情绪波动。\n\n这不是你的错。回溯你的成长经历，很可能在生命的早期，你的主要照顾者没有给你足够稳定的回应——有时热情，有时冷漠，有时在，有时不在。这种"不一致"让你的依恋系统从小就处于高度警戒状态，让你形成了一个根深蒂固的信念："我必须非常努力，才能被留下。""我不配被无条件地爱。""亲密是危险的，但孤独更可怕。"',
    traits: [
      '💔 爱上回避型（越追越跑，越跑越追，形成致命的吸引）',
      '🎭 在"极度甜蜜"和"极度痛苦"之间反复横跳',
      '😢 明知道对方不够好，还是离不开',
      '🔄 一段接一段，几乎没有单身期'
    ],
    gifts: [
      '你的焦虑不是你的标签，也不是你的命运',
      '依恋模式是可以改变的——虽然不容易，但可以'
    ],
    challenges: [
      '🔴 优先级最高：寻找专业的心理咨询或治疗',
      '推荐方向：依恋理论取向的心理治疗、CBT（认知行为疗法）、EMDR（眼动脱敏与再加工）'
    ],
    advice: '这不是鸡汤，是行动清单：\n\n1. 🔴 优先级最高：寻找专业的心理咨询或治疗\n推荐方向：依恋理论取向的心理治疗、CBT（认知行为疗法）、EMDR（眼动脱敏与再加工）。这不是"心理有病"才需要的，而是你值得拥有的专业支持。\n\n2. 🟠 学习"情绪脱钩"技术\n当焦虑发作时，试着做这个练习：\n• 承认情绪：我现在感到非常焦虑\n• 命名感受：这是"早年创伤被触发"的感觉，不是"当下现实的真实反映"\n• 身体着陆：紧紧握住拳头5秒，然后放开，重复3次\n• 延迟行动：不立刻发消息、不立刻质问，等30分钟再做决定\n\n3. 🟡 建立"安全基地"以外的支撑系统\n你需要至少3个可以倾诉的对象——朋友、家人、咨询师、线上支持小组。不要让伴侣成为你唯一的情绪出口。\n\n4. 🟢 开始"自我母育"的练习\n每天花10分钟，对着镜子对自己说："我值得被爱，不是因为我做了什么，而是因为我存在。""我的恐惧是过去的回声，不是未来的预言。""我可以选择如何回应，而不是被情绪自动导航。"\n\n5. 🔵 重新定义"亲密"\n真正的亲密不是"每时每刻都在一起"，不是"秒回消息"，不是"知道对方的全部行踪"。真正的亲密是两个完整的人，选择共享一段人生。这包括独立，包括空间，包括信任。',
    match: '你的焦虑不是你的标签，也不是你的命运。依恋模式是可以改变的——虽然不容易，但可以。关键是意识到：你的幸福不能外包给任何一个人。你自己，就是你一直在等待的那个人。',
    matchColor: '#7C3AED'
  }
];

function getResultLevel(score) {
  return RESULT_LEVELS.find(level => score >= level.min && score <= level.max) || RESULT_LEVELS[0];
}

const app = {
  answers: {},
  exchangeCode: null,
  currentQuestion: 0,
  isTransitioning: false
};

const screens = {
  intro: document.getElementById('intro'),
  test: document.getElementById('test'),
  result: document.getElementById('result')
};

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitTestBtn = document.getElementById('submitTestBtn');

function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function displayQuestion() {
  const q = questions[app.currentQuestion];
  if (!q) return;

  questionText.textContent = `问题${app.currentQuestion + 1}：${q.text}`;

  const progress = ((app.currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${app.currentQuestion + 1} / ${questions.length}`;

  const currentAnswer = app.answers[q.id];
  optionsContainer.innerHTML = q.options.map((opt, idx) => {
    const isSelected = currentAnswer === idx;
    return `<div class="option ${isSelected ? 'selected' : ''}" onclick="window.__anxious_select(${idx})"><span class="option-text">${opt.label}</span></div>`;
  }).join('');

  prevBtn.style.display = app.currentQuestion > 0 ? 'inline-block' : 'none';
  const isLast = app.currentQuestion === questions.length - 1;
  nextBtn.style.display = isLast ? 'none' : 'inline-block';
  submitTestBtn.style.display = isLast ? 'inline-block' : 'none';
}

function selectAnswer(optionIndex) {
  if (app.isTransitioning) return;

  const q = questions[app.currentQuestion];
  if (!q) return;
  app.answers[q.id] = optionIndex;

  optionsContainer.querySelectorAll('.option').forEach((el, idx) => {
    el.classList.toggle('selected', idx === optionIndex);
  });

  const isLastQuestion = app.currentQuestion === questions.length - 1;
  if (!isLastQuestion) {
    goToNext();
  } else {
    updateProgress();
  }
}

function goToNext() {
  const q = questions[app.currentQuestion];
  if (!q) return;
  if (app.answers[q.id] === undefined) {
    alert('请先选择当前题目的选项');
    return;
  }
  const total = questions.length;
  if (app.currentQuestion >= total - 1) {
    updateProgress();
    return;
  }
  app.isTransitioning = true;
  optionsContainer.querySelectorAll('.option').forEach(opt => opt.classList.add('disabled'));
  setTimeout(() => {
    try {
      app.currentQuestion++;
      displayQuestion();
    } catch (e) {
      console.error('跳转题目出错:', e);
    } finally {
      app.isTransitioning = false;
    }
  }, 250);
}

function previousQuestion() {
  app.isTransitioning = false;
  if (app.currentQuestion > 0) {
    app.currentQuestion--;
    optionsContainer.querySelectorAll('.option').forEach(opt => opt.classList.remove('disabled'));
    displayQuestion();
  }
}

async function handleSubmitTest() {
  const unansweredCount = questions.filter(q => app.answers[q.id] === undefined).length;
  if (unansweredCount > 0) {
    alert(`请完成所有题目，还剩 ${unansweredCount} 题未回答`);
    return;
  }

  const totalScore = computeTotalScore();
  const resultLevel = getResultLevel(totalScore);

  const resultData = {
    totalScore,
    level: resultLevel.level,
    typeName: resultLevel.typeName
  };

  try {
    if (app.exchangeCode && app.exchangeCode !== 'VIP88888') {
      const response = await fetch(`${API_BASE_URL}/submit-anxious`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: app.exchangeCode,
          rawAnswers: app.answers,
          resultData
        })
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            console.error('后端错误:', errorData);
          } catch (jsonError) {
            console.error('响应不是有效的JSON:', jsonError);
          }
        } else {
          console.error('后端错误:', response.status, response.statusText);
        }
      }
    }
  } catch (error) {
    console.error('提交测试异常:', error);
  }

  renderResult(totalScore, resultLevel);
}

function updateProgress() {
  const done = questions.filter(q => app.answers[q.id] !== undefined).length;
  const total = questions.length;
  progressBar.style.width = `${(done / total) * 100}%`;
  progressText.textContent = `${done} / ${total}`;
}

function computeTotalScore() {
  let total = 0;
  questions.forEach(q => {
    const answerIdx = app.answers[q.id];
    if (answerIdx !== undefined) {
      total += q.options[answerIdx].score;
    }
  });
  return total;
}

function renderResult(totalScore, resultLevel) {
  document.getElementById('resultEmoji').textContent = resultLevel.emoji;
  document.getElementById('resultKicker').textContent = '你的依恋类型';
  document.getElementById('resultTypeName').textContent = resultLevel.typeName;
  document.getElementById('resultTypeName').style.color = resultLevel.color;
  document.getElementById('resultTypeSub').textContent = resultLevel.label;
  document.getElementById('resultScore').textContent = totalScore;
  document.getElementById('resultScore').style.color = resultLevel.color;

  const scorePercent = ((totalScore - 20) / 80) * 100;
  document.getElementById('scoreBarFill').style.width = `${scorePercent}%`;
  document.getElementById('scoreBarFill').style.background = resultLevel.color;

  document.querySelectorAll('.level-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx < resultLevel.level);
    if (idx < resultLevel.level) {
      dot.style.background = resultLevel.color;
    }
  });

  document.getElementById('typePortrait').textContent = resultLevel.portrait;

  const traitsBox = document.getElementById('traitsBox');
  traitsBox.innerHTML = resultLevel.traits.map(trait => `<p style="margin: 8px 0; font-size: 14px; line-height: 1.8;">${trait}</p>`).join('');

  const giftsChallengesBox = document.getElementById('giftsChallengesBox');
  let gcHtml = '';
  if (resultLevel.gifts && resultLevel.gifts.length > 0) {
    gcHtml += `<div class="section-card"><div class="section-card-title">✨ 你的天赋</div><div class="section-card-content">${resultLevel.gifts.map(g => `<p style="margin: 6px 0;">${g}</p>`).join('')}</div></div>`;
  }
  if (resultLevel.challenges && resultLevel.challenges.length > 0) {
    gcHtml += `<div class="section-card"><div class="section-card-title">🎯 你的功课</div><div class="section-card-content">${resultLevel.challenges.map(c => `<p style="margin: 6px 0;">${c}</p>`).join('')}</div></div>`;
  }
  giftsChallengesBox.innerHTML = gcHtml;

  const adviceBox = document.getElementById('adviceBox');
  adviceBox.innerHTML = `<div class="advice-content">${resultLevel.advice.replace(/\n/g, '<br>')}</div>`;

  const matchBox = document.getElementById('matchBox');
  matchBox.innerHTML = `<div class="section-card-content" style="font-size: 15px; line-height: 1.9;">${resultLevel.match}</div>`;

  showScreen('result');
}

function startTest() {
  app.answers = {};
  app.currentQuestion = 0;
  app.isTransitioning = false;
  displayQuestion();
  showScreen('test');
}

function showCodeModal() {
  document.getElementById('codeModal').classList.add('active');
  document.getElementById('codeInput').value = '';
  document.getElementById('codeError').classList.remove('show');
  document.getElementById('codeInput').focus();
}

function closeCodeModal() {
  document.getElementById('codeModal').classList.remove('active');
  document.getElementById('codeInput').value = '';
  document.getElementById('codeError').classList.remove('show');
}

async function validateCode() {
  const code = document.getElementById('codeInput').value.trim().toUpperCase();
  const errorDiv = document.getElementById('codeError');

  if (!code || code.length !== 8) {
    errorDiv.textContent = '请输入8位兑换码';
    errorDiv.classList.add('show');
    return;
  }

  if (code === 'VIP88888') {
    app.exchangeCode = code;
    closeCodeModal();
    startTest();
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/validate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, testType: 'anxious' })
    });

    if (!response.ok) {
      throw new Error('兑换码不存在');
    }

    app.exchangeCode = code;
    closeCodeModal();
    startTest();
  } catch (error) {
    errorDiv.textContent = '兑换码不存在';
    errorDiv.classList.add('show');
  }
}

window.__anxious_select = selectAnswer;

function saveResultImage() {
  const resultContainer = document.querySelector('.result-layout');
  if (!resultContainer) return;

  html2canvas(resultContainer, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `焦虑型依恋测试结果-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(error => {
    console.error('保存图片失败:', error);
    alert('保存图片失败，请稍后重试');
  });
}

function openImageModal(imgElement) {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('imageModalImg');
  modalImg.src = imgElement.src;
  modalImg.alt = imgElement.alt;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImageModal(event) {
  if (event) {
    var target = event.target;
    if (target.classList.contains('image-modal-img')) return;
  }
  var modal = document.getElementById('imageModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var modal = document.getElementById('imageModal');
    if (modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('startBtn').addEventListener('click', showCodeModal);
  document.getElementById('prevBtn').addEventListener('click', previousQuestion);
  document.getElementById('nextBtn').addEventListener('click', goToNext);
  document.getElementById('submitTestBtn').addEventListener('click', handleSubmitTest);
  document.getElementById('codeCancelBtn').addEventListener('click', closeCodeModal);
  document.getElementById('codeValidateBtn').addEventListener('click', validateCode);
  const saveBtn = document.getElementById('saveResultBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveResultImage);
  }
});
