const API_BASE_URL = '/api';

const ATTACHMENT_TYPES = {
  secure: { key: 'secure', label: '安全型', emoji: '🛡️' },
  anxious: { key: 'anxious', label: '焦虑型', emoji: '🔥' },
  dismissive: { key: 'dismissive', label: '疏离型', emoji: '❄️' },
  fearful: { key: 'fearful', label: '恐惧型', emoji: '⚡' }
};

const LOVE_STYLES = {
  eros: { key: 'eros', label: '激情型', color: '#E91E63' },
  storge: { key: 'storge', label: '友伴型', color: '#4CAF50' },
  ludus: { key: 'ludus', label: '游戏型', color: '#FF9800' },
  mania: { key: 'mania', label: '占有型', color: '#9C27B0' },
  pragma: { key: 'pragma', label: '理性型', color: '#2196F3' },
  agape: { key: 'agape', label: '奉献型', color: '#F44336' }
};

const EMOTIONAL_NEEDS = {
  safety: { key: 'safety', label: '安全感', color: '#E91E63' },
  being_seen: { key: 'being_seen', label: '被看见', color: '#9C27B0' },
  freedom: { key: 'freedom', label: '自由度', color: '#FF9800' },
  growth: { key: 'growth', label: '成长感', color: '#4CAF50' },
  belonging: { key: 'belonging', label: '归属感', color: '#2196F3' }
};

const questions = [
  {
    id: 'q1', module: 'attachment', type: 'likert',
    text: '当伴侣没有及时回复消息时，我会反复查看手机并感到不安',
    scoring: { anxiety: 1.0, avoidance: 0, secure: 0 }
  },
  {
    id: 'q2', module: 'attachment', type: 'likert',
    text: '我享受与伴侣的亲密，但不会因此失去自我空间',
    scoring: { anxiety: -0.5, avoidance: -0.5, secure: 1.0 }
  },
  {
    id: 'q3', module: 'attachment', type: 'likert',
    text: '当关系变得太过亲密时，我会本能地想拉开距离',
    scoring: { anxiety: 0, avoidance: 1.0, secure: 0 }
  },
  {
    id: 'q4', module: 'attachment', type: 'likert',
    text: '我经常需要伴侣反复确认"ta是爱我的"',
    scoring: { anxiety: 1.0, avoidance: 0, secure: 0 }
  },
  {
    id: 'q5', module: 'attachment', type: 'likert',
    text: '我很难完全信任一个人，即使我们在一起很久了',
    scoring: { anxiety: 0.5, avoidance: 1.0, secure: 0 }
  },
  {
    id: 'q6', module: 'attachment', type: 'likert',
    text: '分开时我会想念，但在一起久了又觉得需要空间',
    scoring: { anxiety: 0.5, avoidance: 1.0, secure: 0 }
  },
  {
    id: 'q7', module: 'attachment', type: 'likert',
    text: '伴侣的冷淡会让我陷入自我怀疑："是不是我不够好"',
    scoring: { anxiety: 1.0, avoidance: 0, secure: 0 }
  },
  {
    id: 'q8', module: 'attachment', type: 'likert',
    text: '我觉得依赖别人是一种软弱',
    scoring: { anxiety: 0, avoidance: 1.0, secure: 0 }
  },
  {
    id: 'q9', module: 'attachment', type: 'likert',
    text: '我会不自觉地试探伴侣的真心（比如故意不联系看对方反应）',
    scoring: { anxiety: 1.0, avoidance: 0, secure: 0 }
  },
  {
    id: 'q10', module: 'attachment', type: 'likert',
    text: '独处时我感到安心，不太需要伴侣陪伴',
    scoring: { anxiety: 0, avoidance: 1.0, secure: 0 }
  },
  {
    id: 'q11', module: 'attachment', type: 'likert',
    text: '我害怕表达真实需求，因为怕对方觉得我"太作了"',
    scoring: { anxiety: 1.0, avoidance: 0, secure: 0 }
  },
  {
    id: 'q12', module: 'attachment', type: 'likert',
    text: '我愿意在关系中展现脆弱的一面',
    scoring: { anxiety: 0, avoidance: -0.5, secure: 1.0 }
  },
  {
    id: 'q13', module: 'style', type: 'choice',
    text: '你更容易被什么吸引？',
    options: [
      { label: '一见钟情的心动感，眼神交汇就知道是ta', style: { eros: 2 } },
      { label: '日久生情的安心感，慢慢发现ta的好', style: { storge: 2 } },
      { label: '灵魂共鸣的默契感，觉得ta"懂我"', style: { agape: 2 } }
    ]
  },
  {
    id: 'q14', module: 'style', type: 'choice',
    text: '恋爱初期，你最享受的是：',
    options: [
      { label: '心跳加速、手心出汗的悸动', style: { eros: 2 } },
      { label: '在一起就觉得世界很安静', style: { storge: 2 } },
      { label: '发现彼此有聊不完的话题，三观高度契合', style: { pragma: 2 } }
    ]
  },
  {
    id: 'q15', module: 'style', type: 'choice',
    text: '你理想的关系起点是：',
    options: [
      { label: '先做朋友，自然而然走到一起', style: { storge: 2 } },
      { label: '互相吸引，确认关系后深入了解', style: { eros: 2 } },
      { label: '有明确的好感信号，主动出击但不急于确定', style: { ludus: 2 } }
    ]
  },
  {
    id: 'q16', module: 'style', type: 'choice',
    text: '你觉得最舒服的恋爱状态是：',
    options: [
      { label: '像最好的朋友，有说不完的废话', style: { storge: 2 } },
      { label: '各有各的世界，交集处很甜', style: { pragma: 2 } },
      { label: '时刻知道对方在想什么，深度连接', style: { agape: 2 } }
    ]
  },
  {
    id: 'q17', module: 'style', type: 'choice',
    text: '关于"暧昧"，你的态度是：',
    options: [
      { label: '享受暧昧的朦胧感，不喜欢太快确定', style: { ludus: 2 } },
      { label: '不喜欢暧昧，要么在一起要么算了', style: { mania: 2 } },
      { label: '暧昧可以，但心里要有明确的心动感才值得', style: { eros: 2 } }
    ]
  },
  {
    id: 'q18', module: 'style', type: 'choice',
    text: '你怎么看待恋爱中的"自由"：',
    options: [
      { label: '很重要，不想被一个人绑住所有精力', style: { ludus: 2 } },
      { label: '自由在于信任，不是不约束', style: { storge: 2 } },
      { label: '自由是双方各自独立且有清晰的边界', style: { pragma: 2 } }
    ]
  },
  {
    id: 'q19', module: 'style', type: 'choice',
    text: '看到伴侣和异性互动很好，你会：',
    options: [
      { label: '表面淡定，内心翻江倒海', style: { mania: 2 } },
      { label: '直接表达不舒服，希望对方注意边界', style: { agape: 1, mania: 1 } },
      { label: '觉得正常，信任是基础', style: { storge: 2 } }
    ]
  },
  {
    id: 'q20', module: 'style', type: 'choice',
    text: '你怎么看待"查手机"：',
    options: [
      { label: '想看但忍住，看了又后悔', style: { mania: 2 } },
      { label: '不看，因为信任，也尊重隐私', style: { storge: 2 } },
      { label: '不在意，每个人都有自己的空间', style: { ludus: 2 } }
    ]
  },
  {
    id: 'q21', module: 'style', type: 'choice',
    text: '选择伴侣时，你更看重：',
    options: [
      { label: '感觉对不对，其他不重要', style: { eros: 2 } },
      { label: '三观、生活习惯、未来规划是否匹配', style: { pragma: 2 } },
      { label: '有趣、有魅力，在一起开心就好', style: { ludus: 2 } }
    ]
  },
  {
    id: 'q22', module: 'style', type: 'choice',
    text: '你怎么看待"门当户对"：',
    options: [
      { label: '太现实了，爱能跨越一切', style: { eros: 2 } },
      { label: '有道理，相似背景相处更轻松', style: { pragma: 2 } },
      { label: '不绝对，但共同语言确实很重要', style: { storge: 2 } }
    ]
  },
  {
    id: 'q23', module: 'style', type: 'choice',
    text: '伴侣低谷时，你会：',
    options: [
      { label: '全心全意陪伴，自己的事先放一放', style: { agape: 2 } },
      { label: '提供支持，但也会照顾好自己的节奏', style: { pragma: 2 } },
      { label: '默默守在身边，ta需要什么就给什么', style: { storge: 2 } }
    ]
  },
  {
    id: 'q24', module: 'style', type: 'choice',
    text: '你在关系中更习惯：',
    options: [
      { label: '付出多一些，觉得"给"比"要"更快乐', style: { agape: 2 } },
      { label: '互相给予，保持平衡', style: { pragma: 2 } },
      { label: '付出很多，但也希望对方同等回报', style: { mania: 2 } }
    ]
  },
  {
    id: 'q25', module: 'needs', type: 'choice',
    text: '恋爱中，你最不能忍受的是：',
    options: [
      { label: '被忽视，感觉不到存在感', need: { being_seen: 2 } },
      { label: '被控制，失去自己的空间', need: { freedom: 2 } },
      { label: '不确定对方的心意', need: { safety: 2 } }
    ]
  },
  {
    id: 'q26', module: 'needs', type: 'choice',
    text: '你最向往的恋爱瞬间是：',
    options: [
      { label: 'ta记得你随口说的小事', need: { being_seen: 2 } },
      { label: '两个人各自安静待着也不尴尬', need: { belonging: 2 } },
      { label: '因为ta，你变成了更好的自己', need: { growth: 2 } }
    ]
  },
  {
    id: 'q27', module: 'needs', type: 'choice',
    text: '吵架后，你更希望：',
    options: [
      { label: '先冷静，再好好聊', need: { freedom: 2 } },
      { label: '马上解决，受不了冷战的焦虑', need: { safety: 2 } },
      { label: '不需要完美解决，只要确认还爱彼此就行', need: { belonging: 2 } }
    ]
  },
  {
    id: 'q28', module: 'needs', type: 'choice',
    text: '你在关系中最容易觉得"不够"的是：',
    options: [
      { label: '陪伴的时间和注意力', need: { being_seen: 2 } },
      { label: '被理解的感觉', need: { safety: 2 } },
      { label: '独立做自己的许可', need: { freedom: 2 } }
    ]
  },
  {
    id: 'q29', module: 'needs', type: 'choice',
    text: '你觉得好的爱情应该让你：',
    options: [
      { label: '感到安全，不用提心吊胆', need: { safety: 2 } },
      { label: '感到自由，可以做真实的自己', need: { freedom: 2 } },
      { label: '感到成长，在爱里变更好', need: { growth: 2 } }
    ]
  },
  {
    id: 'q30', module: 'needs', type: 'choice',
    text: '如果伴侣突然变得很忙冷落你，你的第一反应是：',
    options: [
      { label: '是不是我做错了什么', need: { safety: 2 } },
      { label: '有点失落，但会找自己的事做', need: { freedom: 2 } },
      { label: '直接告诉ta你感到被忽略', need: { being_seen: 2 } }
    ]
  },
  {
    id: 'q31', module: 'needs', type: 'choice',
    text: '你更喜欢哪种表达爱的方式：',
    options: [
      { label: '语言确认——"我爱你""我在"', need: { safety: 2 } },
      { label: '行动付出——默默为你做很多事', need: { belonging: 2 } },
      { label: '陪伴在场——不需要做什么，在就好', need: { being_seen: 2 } }
    ]
  },
  {
    id: 'q32', module: 'needs', type: 'choice',
    text: '你对"灵魂伴侣"的理解：',
    options: [
      { label: '不说话也懂彼此', need: { belonging: 2 } },
      { label: '让我成为最好版本的自己', need: { growth: 2 } },
      { label: '无论如何不会离开的人', need: { safety: 2 } }
    ]
  },
  {
    id: 'q33', module: 'needs', type: 'choice',
    text: '关系稳定后，你最怕：',
    options: [
      { label: '失去新鲜感，变成室友', need: { growth: 2 } },
      { label: '对方不再用心经营', need: { being_seen: 2 } },
      { label: '自己在这段关系里变得不像自己', need: { freedom: 2 } }
    ]
  },
  {
    id: 'q34', module: 'needs', type: 'choice',
    text: '你怎么看待"为对方改变"：',
    options: [
      { label: '爱就要愿意为对方调整', need: { belonging: 2 } },
      { label: '改变应该是自发的成长，不是委曲求全', need: { growth: 2 } },
      { label: '有些可以妥协，但核心不能丢', need: { freedom: 2 } }
    ]
  },
  {
    id: 'q35', module: 'needs', type: 'choice',
    text: '伴侣最打动你的时刻是：',
    options: [
      { label: 'ta注意到你的情绪变化', need: { being_seen: 2 } },
      { label: 'ta支持你做想做的事', need: { growth: 2 } },
      { label: 'ta在你脆弱时接住了你', need: { safety: 2 } }
    ]
  },
  {
    id: 'q36', module: 'needs', type: 'choice',
    text: '如果给恋爱打分，你最看重：',
    options: [
      { label: '舒适度——在一起舒不舒服', need: { belonging: 2 } },
      { label: '深度——有没有真正懂彼此', need: { being_seen: 2 } },
      { label: '稳定度——能走多远', need: { safety: 2 } }
    ]
  }
];

let PERSONALITIES = {};
let personalitiesLoaded = false;

async function loadPersonalities() {
  try {
    const resp = await fetch('data/love-depth-personalities.json');
    PERSONALITIES = await resp.json();
    personalitiesLoaded = true;
  } catch(e) {
    console.error('Failed to load personalities:', e);
  }
}

loadPersonalities();


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
const questionSub = document.getElementById('questionSub');
const moduleBadge = document.getElementById('moduleBadge');
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

function getModuleInfo(moduleKey) {
  const map = {
    attachment: { label: '📎 模块一：依恋模式', sub: '1=完全不符合 → 5=完全符合' },
    style: { label: '💕 模块二：恋爱风格', sub: '请选择最符合你的选项' },
    needs: { label: '🎯 模块三：情感需求', sub: '请选择最符合你的选项' }
  };
  return map[moduleKey] || { label: '', sub: '' };
}

function displayQuestion() {
  const q = questions[app.currentQuestion];
  if (!q) return;

  const moduleInfo = getModuleInfo(q.module);
  moduleBadge.textContent = moduleInfo.label;
  questionSub.textContent = moduleInfo.sub;
  questionText.textContent = `Q${app.currentQuestion + 1}. ${q.text}`;

  const progress = ((app.currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${app.currentQuestion + 1} / ${questions.length}`;

  const currentAnswer = app.answers[q.id];

  if (q.type === 'likert') {
    const likertLabels = ['完全不符合', '不太符合', '一般', '比较符合', '完全符合'];
    optionsContainer.innerHTML = '';
    optionsContainer.className = 'likert-scale';
    likertLabels.forEach((label, idx) => {
      const score = idx + 1;
      const isSelected = currentAnswer === score;
      const div = document.createElement('div');
      div.className = `likert-option${isSelected ? ' selected' : ''}`;
      div.innerHTML = `<div class="likert-dot"></div><span class="likert-label">${label}</span><span class="likert-score">${score}</span>`;
      div.onclick = () => selectLikert(score);
      optionsContainer.appendChild(div);
    });
  } else {
    const optionCodes = ['A', 'B', 'C'];
    optionsContainer.innerHTML = '';
    optionsContainer.className = 'options';
    q.options.forEach((opt, idx) => {
      const isSelected = currentAnswer === idx;
      const div = document.createElement('div');
      div.className = `option${isSelected ? ' selected' : ''}`;
      div.innerHTML = `<span class="option-code">${optionCodes[idx]}</span><span class="option-text">${opt.label}</span>`;
      div.onclick = () => selectChoice(idx);
      optionsContainer.appendChild(div);
    });
  }

  prevBtn.style.display = app.currentQuestion > 0 ? 'inline-block' : 'none';
  const isLast = app.currentQuestion === questions.length - 1;
  nextBtn.style.display = isLast ? 'none' : 'inline-block';
  submitTestBtn.style.display = isLast ? 'inline-block' : 'none';
}

function selectLikert(score) {
  if (app.isTransitioning) return;
  const q = questions[app.currentQuestion];
  app.answers[q.id] = score;

  optionsContainer.querySelectorAll('.likert-option').forEach((el, idx) => {
    el.classList.toggle('selected', idx + 1 === score);
  });

  const isLastQuestion = app.currentQuestion === questions.length - 1;
  if (!isLastQuestion) {
    goToNext();
  }
}

function selectChoice(optionIndex) {
  if (app.isTransitioning) return;
  const q = questions[app.currentQuestion];
  app.answers[q.id] = optionIndex;

  optionsContainer.querySelectorAll('.option').forEach((el, idx) => {
    el.classList.toggle('selected', idx === optionIndex);
  });

  const isLastQuestion = app.currentQuestion === questions.length - 1;
  if (!isLastQuestion) {
    goToNext();
  }
}

function goToNext() {
  const q = questions[app.currentQuestion];
  if (!q) return;
  if (app.answers[q.id] === undefined) {
    alert('请先选择当前题目的选项');
    return;
  }
  if (app.currentQuestion >= questions.length - 1) return;
  app.isTransitioning = true;
  optionsContainer.querySelectorAll('.option, .likert-option').forEach(opt => opt.classList.add('disabled'));
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
    optionsContainer.querySelectorAll('.option, .likert-option').forEach(opt => opt.classList.remove('disabled'));
    displayQuestion();
  }
}

function computeScores() {
  let anxietyRaw = 0, avoidanceRaw = 0, secureRaw = 0;
  for (let i = 0; i < 12; i++) {
    const q = questions[i];
    const ans = app.answers[q.id];
    if (ans === undefined) continue;
    const score = q.type === 'likert' ? ans : (ans + 1);
    anxietyRaw += q.scoring.anxiety * score;
    avoidanceRaw += q.scoring.avoidance * score;
    secureRaw += q.scoring.secure * score;
  }

  const anxietyMin = 3.5, anxietyMax = 32.5;
  const avoidanceMin = 3.9, avoidanceMax = 33.9;
  const anxietyScore = Math.round(Math.max(0, Math.min(100, ((anxietyRaw - anxietyMin) / (anxietyMax - anxietyMin)) * 100)));
  const avoidanceScore = Math.round(Math.max(0, Math.min(100, ((avoidanceRaw - avoidanceMin) / (avoidanceMax - avoidanceMin)) * 100)));
  const secureScore = Math.round(Math.max(0, Math.min(100, ((secureRaw - 2) / (10 - 2)) * 100)));

  let attachmentType;
  if (anxietyScore < 50 && avoidanceScore < 50) attachmentType = 'secure';
  else if (anxietyScore >= 50 && avoidanceScore < 50) attachmentType = 'anxious';
  else if (anxietyScore < 50 && avoidanceScore >= 50) attachmentType = 'dismissive';
  else attachmentType = 'fearful';

  const styleScores = { eros: 0, storge: 0, ludus: 0, mania: 0, pragma: 0, agape: 0 };
  for (let i = 12; i < 24; i++) {
    const q = questions[i];
    const ans = app.answers[q.id];
    if (ans === undefined) continue;
    const opt = q.options[ans];
    if (opt && opt.style) {
      Object.entries(opt.style).forEach(([k, v]) => {
        styleScores[k] += v;
      });
    }
  }

  const styleTotal = Object.values(styleScores).reduce((a, b) => a + b, 0) || 1;
  const styleDistribution = {};
  Object.entries(styleScores).forEach(([k, v]) => {
    styleDistribution[k] = Math.round((v / styleTotal) * 1000) / 10;
  });

  const sortedStyles = Object.entries(styleScores).sort((a, b) => b[1] - a[1]);
  const primaryStyle = sortedStyles[0][0];
  const secondaryStyle = sortedStyles[1][0];

  const needScores = { safety: 0, being_seen: 0, freedom: 0, growth: 0, belonging: 0 };
  for (let i = 24; i < 36; i++) {
    const q = questions[i];
    const ans = app.answers[q.id];
    if (ans === undefined) continue;
    const opt = q.options[ans];
    if (opt && opt.need) {
      Object.entries(opt.need).forEach(([k, v]) => {
        needScores[k] += v;
      });
    }
  }

  const needTotal = Object.values(needScores).reduce((a, b) => a + b, 0) || 1;
  const needRanking = Object.entries(needScores)
    .map(([k, v]) => ({ key: k, label: EMOTIONAL_NEEDS[k].label, score: v, percentage: Math.round((v / needTotal) * 1000) / 10, color: EMOTIONAL_NEEDS[k].color }))
    .sort((a, b) => b.score - a.score);

  const personalityCode = `${attachmentType}_${primaryStyle}`;
  const personality = PERSONALITIES[personalityCode] || PERSONALITIES['secure_eros'];

  return {
    attachment: {
      type: attachmentType,
      typeLabel: ATTACHMENT_TYPES[attachmentType].label,
      anxietyScore,
      avoidanceScore,
      secureScore
    },
    loveStyle: {
      primary: primaryStyle,
      primaryLabel: LOVE_STYLES[primaryStyle].label,
      secondary: secondaryStyle,
      secondaryLabel: LOVE_STYLES[secondaryStyle].label,
      distribution: styleDistribution
    },
    emotionalNeeds: {
      ranking: needRanking
    },
    personality
  };
}

function renderResult() {
  const scores = computeScores();
  const p = scores.personality;

  const fallback = !p.name;
  document.getElementById('resultPersonalityName').textContent = p.name || p.code || '解读中';
  document.getElementById('resultNickname').textContent = p.nickname ? `· ${p.nickname} ·` : '';
  document.getElementById('resultOneLiner').textContent = p.oneLiner ? `"${p.oneLiner}"` : '该人格解读正在完善中，敬请期待';

  const keywordsEl = document.getElementById('resultKeywords');
  keywordsEl.innerHTML = (p.keywords && p.keywords.length > 0) ? p.keywords.map(k => `<span class="personality-keyword">${k}</span>`).join('') : '';

  const traitsEl = document.getElementById('coreTraits');
  const traitIcons = ['💫', '❤️', '⭐', '⚠️'];
  traitsEl.innerHTML = (p.coreTraits && p.coreTraits.length > 0) ? p.coreTraits.map((t, i) => `
    <div class="core-trait-item">
      <span class="core-trait-icon">${traitIcons[i] || '·'}</span>
      <span class="core-trait-text">${t}</span>
    </div>
  `).join('') : '<p style="text-align:center;color:#999;">该人格解读正在完善中</p>';

  const attachEl = document.getElementById('attachmentBars');
  const attachData = [
    { label: '焦虑度', score: scores.attachment.anxietyScore, desc: '对亲密关系的不安全感程度' },
    { label: '回避度', score: scores.attachment.avoidanceScore, desc: '对亲密关系的回避程度' },
    { label: '安全感', score: scores.attachment.secureScore, desc: '内在安全感水平' }
  ];
  attachEl.innerHTML = attachData.map(d => `
    <div class="dim-bar-item">
      <div class="dim-bar-top">
        <span class="dim-bar-name">${d.label}</span>
        <span class="dim-bar-score">${d.score}/100</span>
      </div>
      <div class="dim-bar-bg"><div class="dim-bar-fill" style="width:${d.score}%"></div></div>
    </div>
  `).join('');

  document.getElementById('attachmentDeep').innerHTML = `
    ${(p.attachmentDeep || [p.attachmentInterpretation]).map(para => `<p>${para}</p>`).join('')}
    <div class="insight-quote">📌 ${p.attachmentInsight}</div>
  `;

  drawRadarChart(scores.loveStyle.distribution);

  document.getElementById('styleDeep').innerHTML = `
    ${(p.styleDeep || [p.styleInterpretation]).map(para => `<p>${para}</p>`).join('')}
    <div class="insight-quote">📌 ${p.styleInsight}</div>
  `;

  const needEl = document.getElementById('needRanking');
  needEl.innerHTML = scores.emotionalNeeds.ranking.map((n, i) => `
    <div class="need-rank-item">
      <div class="need-rank-num rank-${i + 1}">${i + 1}</div>
      <div class="need-rank-info">
        <div class="need-rank-name">${n.label}</div>
        <div class="need-rank-bar-bg"><div class="need-rank-bar-fill" style="width:${n.percentage}%;background:${n.color}"></div></div>
      </div>
      <div class="need-rank-pct">${n.percentage}%</div>
    </div>
  `).join('');

  const needsDeepEl = document.getElementById('needsDeep');
  if (p.needsDeep && p.needsDeep.length > 0) {
    needsDeepEl.innerHTML = `<div class="need-deep-list">${p.needsDeep.map(n => `
      <div class="need-deep-item">
        <div class="need-deep-name">${n.name}</div>
        <div class="need-deep-desc">${n.desc}</div>
      </div>
    `).join('')}</div>`;
  } else {
    needsDeepEl.innerHTML = `<div class="insight-box"><p>${p.needsInterpretation}</p></div>`;
  }

  const cycleEl = document.getElementById('cycleFlow');
  cycleEl.innerHTML = p.cycleSteps.map((s, i) => {
    const arrow = i < p.cycleSteps.length - 1 ? '<span class="cycle-arrow">→</span>' : '<span class="cycle-arrow">↻</span>';
    return `<span class="cycle-step">${s}</span>${arrow}`;
  }).join('');

  document.getElementById('cycleHealthyDetail').innerHTML = p.cycleHealthyDetail
    ? `<p><strong>✅ 健康循环：</strong></p><p>${p.cycleHealthyDetail}</p>`
    : '';

  document.getElementById('cycleStuckDetail').innerHTML = p.cycleStuckDetail
    ? `<p><strong>⚠️ 可能的卡点：</strong></p><p>${p.cycleStuckDetail}</p>`
    : '';

  document.getElementById('breakthrough').innerHTML = `<strong>💡 破局关键：</strong>${p.breakthroughDetail || p.breakthrough}`;

  const matchEl = document.getElementById('matchAnalysis');
  matchEl.innerHTML = `
    <div class="match-card best">
      <div class="match-card-header">
        <span class="match-card-icon">✅</span>
        <div>
          <div class="match-card-title">最佳匹配：${p.bestMatch.name} · ${p.bestMatch.nickname}</div>
        </div>
      </div>
      <div class="match-card-reason">${p.bestMatch.reason}</div>
      ${p.bestMatch.detail ? `<div class="match-card-detail">${p.bestMatch.detail}</div>` : ''}
    </div>
    <div class="match-card challenge">
      <div class="match-card-header">
        <span class="match-card-icon">⚠️</span>
        <div>
          <div class="match-card-title">挑战匹配：${p.challengeMatch.name} · ${p.challengeMatch.nickname}</div>
        </div>
      </div>
      <div class="match-card-reason">${p.challengeMatch.reason}</div>
      ${p.challengeMatch.detail ? `<div class="match-card-detail">${p.challengeMatch.detail}</div>` : ''}
    </div>
  `;

  const growthEl = document.getElementById('growthMap');
  const blindSpotHtml = p.blindSpotDetail
    ? p.blindSpotDetail.map(para => `<p style="margin:8px 0;font-size:14px;line-height:1.9;color:#666;">${para}</p>`).join('')
    : `<div class="growth-step-content">${p.blindSpot}</div>`;
  const practicesHtml = p.growthPracticesDetail
    ? p.growthPracticesDetail.map(pr => `
      <div class="growth-practice-item">
        <div class="growth-practice-title">${pr.title}</div>
        <div class="growth-practice-content">${pr.content}</div>
      </div>
    `).join('')
    : `<div class="growth-step-content"><ol>${p.growthPractices.map(pr => `<li>${pr}</li>`).join('')}</ol></div>`;
  growthEl.innerHTML = `
    <div class="growth-step">
      <div class="growth-step-title">🪞 盲点觉察</div>
      ${blindSpotHtml}
    </div>
    <div class="growth-step">
      <div class="growth-step-title">🌱 第一步：接纳</div>
      <div class="growth-quote">${p.growthStep1}</div>
      ${p.growthAcceptanceDetail ? `<div class="growth-step-content" style="margin-top:10px;">${p.growthAcceptanceDetail}</div>` : ''}
    </div>
    <div class="growth-step">
      <div class="growth-step-title">🛤️ 第二步：练习</div>
      ${practicesHtml}
    </div>
    <div class="growth-step">
      <div class="growth-step-title">🌈 第三步：蜕变</div>
      <div class="growth-quote">${p.growthVision}</div>
      ${p.growthTransformationDetail ? `<div class="growth-step-content" style="margin-top:10px;">${p.growthTransformationDetail}</div>` : ''}
    </div>
  `;

  const closingHtml = p.closingDetail
    ? p.closingDetail.map(para => `<p>${para}</p>`).join('')
    : `<p>${p.closingMessage}</p>`;
  document.getElementById('closingBox').innerHTML = closingHtml;

  showScreen('result');
}

function drawRadarChart(distribution) {
  const canvas = document.getElementById('radarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 440, H = 440;
  canvas.width = W;
  canvas.height = H;
  const cx = W / 2, cy = H / 2;
  const R = Math.min(W, H) / 2 - 35;
  const keys = Object.keys(LOVE_STYLES);
  const n = keys.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  ctx.clearRect(0, 0, W, H);

  const values = keys.map(k => distribution[k] || 0);
  const maxVal = Math.max(...values, 1);

  for (let level = 1; level <= 5; level++) {
    const r = (R / 5) * level;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = startAngle + angleStep * (i % n);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.stroke();

    const levelVal = Math.round((maxVal / 5) * level);
    ctx.fillStyle = '#bbb';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(levelVal + '%', cx + 5, cy - r - 8);
  }

  for (let i = 0; i < n; i++) {
    const angle = startAngle + angleStep * i;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle));
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  ctx.beginPath();
  keys.forEach((k, i) => {
    const val = (distribution[k] || 0) / maxVal;
    const r = Math.max(R * 0.08, R * val);
    const angle = startAngle + angleStep * i;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(194, 24, 91, 0.2)';
  ctx.fill();
  ctx.strokeStyle = '#C2185B';
  ctx.lineWidth = 2;
  ctx.stroke();

  keys.forEach((k, i) => {
    const val = (distribution[k] || 0) / maxVal;
    const r = Math.max(R * 0.08, R * val);
    const angle = startAngle + angleStep * i;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#C2185B';
    ctx.fill();

    const labelR = R + 18;
    const lx = cx + labelR * Math.cos(angle);
    const ly = cy + labelR * Math.sin(angle);
    ctx.fillStyle = '#5a5a5a';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(LOVE_STYLES[k].label, lx, ly);
  });
}

async function handleSubmitTest() {
  const unansweredCount = questions.filter(q => app.answers[q.id] === undefined).length;
  if (unansweredCount > 0) {
    alert(`请完成所有题目，还剩 ${unansweredCount} 题未回答`);
    return;
  }

  if (!personalitiesLoaded) {
    await loadPersonalities();
  }

  const scores = computeScores();

  const resultData = {
    personality: { code: scores.personality.code, name: scores.personality.name, nickname: scores.personality.nickname },
    attachment: scores.attachment,
    loveStyle: { primary: scores.loveStyle.primary, secondary: scores.loveStyle.secondary, distribution: scores.loveStyle.distribution },
    emotionalNeeds: { ranking: scores.emotionalNeeds.ranking.map(n => ({ key: n.key, percentage: n.percentage })) }
  };

  try {
    if (app.exchangeCode && app.exchangeCode !== 'VIP88888') {
      const response = await fetch(`${API_BASE_URL}/submit-love-depth`, {
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

  renderResult();
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
      body: JSON.stringify({ code, testType: 'love-depth' })
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

function startTest() {
  app.currentQuestion = 0;
  app.answers = {};
  app.isTransitioning = false;
  displayQuestion();
  showScreen('test');
}

function saveResultImage() {
  const resultContainer = document.querySelector('.result-layout');
  if (!resultContainer) return;

  html2canvas(resultContainer, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    allowTaint: true
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `恋爱深度解析结果-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(err => {
    console.error('保存图片失败:', err);
    alert('保存图片失败，请尝试截图保存');
  });
}

function openImageModal(imgElement) {
  var modal = document.getElementById('imageModal');
  var modalImg = document.getElementById('imageModalImg');
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

document.getElementById('startBtn').addEventListener('click', showCodeModal);
document.getElementById('codeCancelBtn').addEventListener('click', closeCodeModal);
document.getElementById('codeValidateBtn').addEventListener('click', validateCode);
document.getElementById('prevBtn').addEventListener('click', previousQuestion);
document.getElementById('nextBtn').addEventListener('click', goToNext);
document.getElementById('submitTestBtn').addEventListener('click', handleSubmitTest);
document.getElementById('saveResultBtn').addEventListener('click', saveResultImage);

document.getElementById('codeInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') validateCode();
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var modal = document.getElementById('codeModal');
    if (modal && modal.classList.contains('active')) {
      closeCodeModal();
    }
    var imageModal = document.getElementById('imageModal');
    if (imageModal && imageModal.classList.contains('active')) {
      closeImageModal(e);
    }
  }
});
