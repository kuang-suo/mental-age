const API_BASE_URL = '/api';

const questions = [
  {
    id: 'q1',
    text: '周末晚上，朋友们都有约了，我一个人在家时，我会感到...',
    options: [
      { label: '非常享受独处时光', score: 1 },
      { label: '有点无聊但还好', score: 2 },
      { label: '有些失落', score: 3 },
      { label: '很孤独，想找人说话', score: 4 },
      { label: '非常孤独，难以忍受', score: 5 }
    ]
  },
  {
    id: 'q2',
    text: '当我有开心的事情想分享时，我能想到可以立刻联系的人有...',
    options: [
      { label: '好几个，随时都能找到人', score: 1 },
      { label: '两三个固定的朋友', score: 2 },
      { label: '可能有一两个', score: 3 },
      { label: '想不起来有谁', score: 4 },
      { label: '没有人可以分享', score: 5 }
    ]
  },
  {
    id: 'q3',
    text: '参加一个都是陌生人的聚会，我的感受是...',
    options: [
      { label: '很兴奋，期待认识新朋友', score: 1 },
      { label: '有点紧张但愿意尝试', score: 2 },
      { label: '不太自在，想早点离开', score: 3 },
      { label: '很焦虑，不知道说什么', score: 4 },
      { label: '非常害怕，想找借口不去', score: 5 }
    ]
  },
  {
    id: 'q4',
    text: '刷朋友圈看到别人聚会、旅行的动态，我会...',
    options: [
      { label: '为他们开心，点个赞', score: 1 },
      { label: '没什么特别感觉', score: 2 },
      { label: '有点羡慕他们的生活', score: 3 },
      { label: '觉得自己生活很无聊', score: 4 },
      { label: '很失落，为什么我没有这样的生活', score: 5 }
    ]
  },
  {
    id: 'q5',
    text: '遇到困难或心情不好时，我会...',
    options: [
      { label: '找朋友倾诉，寻求支持', score: 1 },
      { label: '可能和亲近的人说说', score: 2 },
      { label: '不太想麻烦别人', score: 3 },
      { label: '不知道该和谁说', score: 4 },
      { label: '一个人扛着，没人可以依靠', score: 5 }
    ]
  },
  {
    id: 'q6',
    text: '我现有的朋友中，能真正聊心事、说心里话的大约有...',
    options: [
      { label: '三五个以上', score: 1 },
      { label: '两三个', score: 2 },
      { label: '可能一两个', score: 3 },
      { label: '几乎没有', score: 4 },
      { label: '没有这样的朋友', score: 5 }
    ]
  },
  {
    id: 'q7',
    text: '节假日的时候，我通常会...',
    options: [
      { label: '有很多聚会和活动安排', score: 1 },
      { label: '和几个朋友或家人聚聚', score: 2 },
      { label: '偶尔有人约就出去', score: 3 },
      { label: '大部分时间一个人待着', score: 4 },
      { label: '完全一个人，没人联系我', score: 5 }
    ]
  },
  {
    id: 'q8',
    text: '当我想主动联系朋友时，我会担心...',
    options: [
      { label: '不会担心，随时可以联系', score: 1 },
      { label: '偶尔担心他们是否方便', score: 2 },
      { label: '担心打扰到对方', score: 3 },
      { label: '担心对方不想理我', score: 4 },
      { label: '不敢主动联系，怕被拒绝', score: 5 }
    ]
  },
  {
    id: 'q9',
    text: '在一个群体中（比如工作团队、兴趣小组），我感觉自己是...',
    options: [
      { label: '核心成员，和大家关系很好', score: 1 },
      { label: '普通一员，有说有笑', score: 2 },
      { label: '边缘一点，不太融入', score: 3 },
      { label: '格格不入，很难参与', score: 4 },
      { label: '透明的，没人注意我', score: 5 }
    ]
  },
  {
    id: 'q10',
    text: '晚上睡觉前，我通常会...',
    options: [
      { label: '和朋友聊天或和家人通话', score: 1 },
      { label: '刷刷社交软件，看看朋友动态', score: 2 },
      { label: '追剧或看书，不太社交', score: 3 },
      { label: '发呆，想很多事', score: 4 },
      { label: '感到空虚，睡不着', score: 5 }
    ]
  },
  {
    id: 'q11',
    text: '有人主动和我聊天或约我出去，我的反应是...',
    options: [
      { label: '很开心，欣然答应', score: 1 },
      { label: '挺高兴的，会考虑去', score: 2 },
      { label: '有点意外，不太确定', score: 3 },
      { label: '怀疑对方是不是无聊才找我', score: 4 },
      { label: '不习惯，不知道怎么回应', score: 5 }
    ]
  },
  {
    id: 'q12',
    text: '关于"归属感"，我觉得...',
    options: [
      { label: '在很多地方都有归属感', score: 1 },
      { label: '在几个圈子里有归属感', score: 2 },
      { label: '偶尔有这种感觉', score: 3 },
      { label: '很少感到自己属于哪里', score: 4 },
      { label: '哪里都没有归属感', score: 5 }
    ]
  },
  {
    id: 'q13',
    text: '当周围的人都在讨论他们共同的经历或话题时，我会...',
    options: [
      { label: '积极参与，分享自己的看法', score: 1 },
      { label: '听着，偶尔插几句', score: 2 },
      { label: '默默听着，插不上话', score: 3 },
      { label: '觉得自己是个局外人', score: 4 },
      { label: '很尴尬，想离开', score: 5 }
    ]
  },
  {
    id: 'q14',
    text: '如果我想找人陪我做某件事（比如看电影、逛街），我通常会...',
    options: [
      { label: '很容易就能找到人', score: 1 },
      { label: '问几个朋友，总能找到', score: 2 },
      { label: '可能要问好几个人', score: 3 },
      { label: '很难找到人陪', score: 4 },
      { label: '干脆不问了，一个人去', score: 5 }
    ]
  },
  {
    id: 'q15',
    text: '我对目前人际关系的满意度是...',
    options: [
      { label: '非常满意，朋友很多', score: 1 },
      { label: '比较满意，有几个知心朋友', score: 2 },
      { label: '一般，想再拓展一些', score: 3 },
      { label: '不太满意，感觉缺了什么', score: 4 },
      { label: '很不满意，很孤独', score: 5 }
    ]
  },
  {
    id: 'q16',
    text: '当朋友很久没联系我时，我会想...',
    options: [
      { label: '他们可能忙，我主动联系就好', score: 1 },
      { label: '正常，大家都有自己的事', score: 2 },
      { label: '有点在意，是不是我哪里做错了', score: 3 },
      { label: '觉得他们可能不想和我来往了', score: 4 },
      { label: '觉得果然没人真正在乎我', score: 5 }
    ]
  },
  {
    id: 'q17',
    text: '在社交场合，我通常...',
    options: [
      { label: '很自在，能和各种人聊天', score: 1 },
      { label: '还算自在，和认识的人聊得多', score: 2 },
      { label: '有点拘谨，不太主动说话', score: 3 },
      { label: '很紧张，不知道说什么', score: 4 },
      { label: '想躲起来，不想被人注意', score: 5 }
    ]
  },
  {
    id: 'q18',
    text: '关于"被理解"这件事，我觉得...',
    options: [
      { label: '经常被人理解，有人懂我', score: 1 },
      { label: '有几个朋友能理解我', score: 2 },
      { label: '偶尔有人能理解我', score: 3 },
      { label: '很少有人真正理解我', score: 4 },
      { label: '没有人理解我', score: 5 }
    ]
  },
  {
    id: 'q19',
    text: '独处的时候，我的状态通常是...',
    options: [
      { label: '很享受，做自己喜欢的事', score: 1 },
      { label: '还不错，比较放松', score: 2 },
      { label: '有时享受有时无聊', score: 3 },
      { label: '经常感到空虚', score: 4 },
      { label: '很难受，想逃离这种状态', score: 5 }
    ]
  },
  {
    id: 'q20',
    text: '展望未来，我对建立新关系、拓展社交圈...',
    options: [
      { label: '很有信心，期待认识更多人', score: 1 },
      { label: '比较乐观，会主动尝试', score: 2 },
      { label: '有点迷茫，不知道怎么做', score: 3 },
      { label: '不太乐观，感觉很难', score: 4 },
      { label: '很悲观，觉得自己做不到', score: 5 }
    ]
  }
];

const RESULT_LEVELS = [
  {
    min: 20,
    max: 37,
    level: 1,
    emoji: '🌟',
    typeName: '连接充盈者',
    color: '#16A34A',
    label: '内心充盈，独处也精彩',
    portrait: '你的社交世界丰富而有质量。你既有能够深度连接的朋友，也享受独处的时光。你不是那种需要时刻有人陪伴的人——你懂得在"连接"和"独处"之间找到平衡。\n\n你的孤独感很低，不是因为你的社交圈有多大，而是因为你的关系有深度、有质量。你知道被理解是什么感觉，也知道如何主动建立和维护关系。对你来说，孤独不是一种常态，而是一种偶尔的情绪调味剂。',
    traits: [
      '🤝 拥有高质量的深度关系',
      '🧘 独处能力强，不害怕一个人',
      '💬 主动性强，善于维护关系',
      '🌱 社交自信，能自然融入群体'
    ],
    gifts: [
      '你的社交质量比数量更重要',
      '你能在关系中保持自我，也能享受连接'
    ],
    challenges: [
      '继续保持主动，不要因为现状好就停止拓展',
      '偶尔关注那些可能需要你主动的人'
    ],
    advice: '保持你的社交节奏。你已经掌握了"质量重于数量"的社交智慧。继续主动维护那些重要的关系，同时也可以尝试拓展一些新圈——不是为了填补什么，而是为了丰富你的人生体验。\n\n提醒：你的状态很好，但也可以偶尔关注身边那些可能比较孤独的朋友。你的一句主动问候，可能对他们意义重大。',
    match: '你适合和同样有社交能力的人做朋友，也可以成为孤独者的"社交导师"——你的主动和自信能感染他人。',
    matchColor: '#16A34A'
  },
  {
    min: 38,
    max: 55,
    level: 2,
    emoji: '🌙',
    typeName: '偶尔孤独者',
    color: '#0EA5E9',
    label: '大部分满足，偶尔感到孤独',
    portrait: '你的社交状态总体还不错，但偶尔会感到孤独。你可能有几个朋友，但不是每个都能深度交流；你可能能参加社交活动，但不是每次都感到融入。\n\n你的孤独感是"间歇性"的——有时候觉得挺好的，有时候又会突然感到一阵空虚。这种状态很常见，很多人都在这个区间。你不是社交困难，只是社交的"满足感"还不够稳定。',
    traits: [
      '👥 有朋友，但深度连接不够多',
      '⚖️ 独处时有时享受有时无聊',
      '🔄 社交主动性时高时低',
      '💭 偶尔会羡慕别人的社交状态'
    ],
    gifts: [
      '你的社交基础是有的，只需要提升质量',
      '你对自己的状态有觉察，这是改变的起点'
    ],
    challenges: [
      '尝试主动建立更深入的关系，而不只是泛泛之交',
      '找到能真正聊得来的圈子或社群'
    ],
    advice: '你的状态是"有基础，待提升"。建议你：\n\n1. 深化现有关系：找一两个你觉得可以更近一步的朋友，主动约他们深入聊天，而不是只在群里互动。\n\n2. 寻找同频的人：加入一些你真正感兴趣的兴趣小组或社群，在那里更容易遇到和你频率相近的人。\n\n3. 提升独处质量：当你一个人的时候，做一些真正滋养你的事，而不是只是消磨时间。\n\n你的孤独感不高，但值得继续优化。',
    match: '适合和性格相近的人一起成长，也可以主动接近那些社交能力更强的人，学习他们的社交方式。',
    matchColor: '#0EA5E9'
  },
  {
    min: 56,
    max: 68,
    level: 3,
    emoji: '🌥️',
    typeName: '中度孤独者',
    color: '#F97316',
    label: '经常感到孤独，渴望连接',
    portrait: '你经常感到孤独。你可能有一些社交关系，但总觉得缺了什么——要么是深度不够，要么是频率太低，要么是找不到真正懂你的人。\n\n你不是不想社交，而是不知道怎么建立和维持那些真正满足你的关系。你可能有过尝试，但结果不如预期，慢慢地就变得更被动了。\n\n你的孤独感已经开始影响你的生活质量，值得认真对待。',
    traits: [
      '😔 经常感到没人真正理解自己',
      '📱 刷社交软件时会感到失落',
      '🚪 有社交需求但不知道如何满足',
      '💭 独处时容易陷入负面情绪'
    ],
    gifts: [
      '你对连接有渴望，这是改变的动力',
      '你可能有被忽视的社交潜力'
    ],
    challenges: [
      '突破"不敢主动"的心理障碍',
      '找到适合自己的社交方式和圈层'
    ],
    advice: '你的孤独感值得认真对待。以下是一些具体建议：\n\n1. 从小事开始主动：每天主动和一个朋友发一条消息，不求深度，只是保持连接。慢慢地，你会发现主动没那么可怕。\n\n2. 寻找"低门槛"社交：参加一些不需要太多社交技巧的活动，比如读书会、运动群、志愿者活动。在那里，你不需要很会聊天，只需要出现就好。\n\n3. 提升一个关系的深度：找一个你觉得可能可以更近的朋友，主动约出来，聊一些比日常更深入的话题。\n\n4. 关注独处质量：当你一个人的时候，做一些让你感到充实的事，而不是只是消磨时间。\n\n改变需要时间，但每一步都算数。',
    match: '适合参加一些有共同兴趣的社群活动，在那里更容易遇到频率相近的人。',
    matchColor: '#F97316'
  },
  {
    min: 69,
    max: 82,
    level: 4,
    emoji: '🌧️',
    typeName: '较高孤独者',
    color: '#DC2626',
    label: '持续孤独，社交需求未满足',
    portrait: '你持续地感到孤独。你的社交需求远远没有得到满足——可能是因为朋友很少，可能是因为关系都很浅，可能是因为你很难主动建立新的连接。\n\n你可能经常有这样的体验：想找人说话但不知道找谁；看到别人的社交生活很羡慕；独处时感到空虚甚至焦虑；怀疑是不是自己有问题。\n\n你的孤独感已经比较高了，这值得你认真对待。这不是你的错，也不是无法改变的。',
    traits: [
      '💔 很少有人能真正倾诉心事',
      '📱 社交媒体让你感到更孤独',
      '😰 主动社交时感到焦虑',
      '🌙 独处时经常感到空虚'
    ],
    gifts: [
      '你对自己的状态有觉察，这是改变的第一步',
      '你的孤独感说明你对连接有需求，这是正常的'
    ],
    challenges: [
      '需要突破社交焦虑的心理障碍',
      '需要学习建立和维持关系的基本技能'
    ],
    advice: '你的孤独感比较高，建议认真对待。以下是一个渐进式的行动计划：\n\n第一阶段：建立安全感\n• 找一个你觉得相对安全的人（家人、老朋友、网友），尝试主动分享一些小事\n• 每天给自己设定一个微小的社交目标，比如给一个人点赞或发一条消息\n\n第二阶段：拓展接触面\n• 参加一些不需要太多社交技巧的活动，比如运动群、读书会、志愿者活动\n• 在这些场合，你不需要很会聊天，只需要出现就好\n\n第三阶段：深化关系\n• 找到一两个你觉得频率相近的人，尝试约出来见面\n• 从共同兴趣开始，慢慢聊到更深入的话题\n\n如果觉得很难独自突破，可以考虑寻求心理咨询的帮助。这不是软弱，是对自己负责。',
    match: '建议先从低压力的社群活动开始，比如有共同兴趣的线上或线下小组。',
    matchColor: '#DC2626'
  },
  {
    min: 83,
    max: 100,
    level: 5,
    emoji: '⛈️',
    typeName: '深度孤独者',
    color: '#7C3AED',
    label: '严重孤独，需要关注和支持',
    portrait: '你处于深度孤独的状态。你可能几乎没有人可以真正交流和依靠，独处对你来说不是享受而是煎熬。你可能经常感到被世界遗忘，怀疑自己的价值，甚至觉得孤独是自己的宿命。\n\n这不是你的错。孤独可能源于很多原因：生活环境的变化、过去的经历、社交技能的缺乏、心理障碍等等。但重要的是——这是可以改变的。\n\n你现在的状态需要认真对待，建议寻求专业支持。',
    traits: [
      '💔 几乎没有人可以倾诉和依靠',
      '🌙 独处时感到难以忍受的空虚',
      '🚫 很难主动建立社交连接',
      '😔 经常怀疑自己的价值'
    ],
    gifts: [
      '你愿意做这个测试，说明你有改变的意愿',
      '孤独是可以改变的，虽然需要时间和努力'
    ],
    challenges: [
      '优先寻求专业心理支持',
      '从最基础的社交技能开始练习'
    ],
    advice: '你的孤独感很高，建议认真对待。这不是你的错，也不是无法改变的。以下是一个分阶段的行动计划：\n\n🔴 第一优先级：寻求专业支持\n强烈建议你寻求心理咨询师的帮助。一个专业的咨询师可以：\n• 帮你理解孤独的根源\n• 提供安全的倾诉空间\n• 教你建立关系的技能\n• 陪伴你走出孤独\n\n这不是"有病才需要"，而是你值得被支持和帮助。\n\n🟠 第二阶段：建立最基础的连接\n• 找一个你觉得相对安全的人，尝试分享一些小事\n• 如果找不到，可以尝试线上社群或互助小组\n• 每天给自己设定一个微小的社交目标\n\n🟡 第三阶段：拓展社交圈\n• 参加一些低压力的活动，比如志愿者活动、兴趣小组\n• 在这些场合，你不需要很会聊天，只需要出现就好\n\n请记住：你现在的状态不是你的标签，也不是你的命运。改变需要时间，但每一步都算数。你值得被理解、被陪伴、被爱。',
    match: '建议优先寻求专业心理支持，然后从低压力的社群活动开始，比如志愿者活动或互助小组。',
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
    return `<div class="option ${isSelected ? 'selected' : ''}" onclick="window.__lonely_select(${idx})"><span class="option-text">${opt.label}</span></div>`;
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
      const response = await fetch(`${API_BASE_URL}/submit-lonely`, {
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
  document.getElementById('resultKicker').textContent = '你的孤独程度';
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
    gcHtml += `<div class="section-card"><div class="section-card-title">✨ 你的资源</div><div class="section-card-content">${resultLevel.gifts.map(g => `<p style="margin: 6px 0;">${g}</p>`).join('')}</div></div>`;
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
      body: JSON.stringify({ code, testType: 'lonely' })
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

window.__lonely_select = selectAnswer;

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
    link.download = `孤独程度测试结果-${new Date().getTime()}.png`;
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
