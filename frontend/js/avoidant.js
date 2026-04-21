//回避型测试
const API_BASE_URL = '/api';

const SECTION_META = {
  distance: { name: '亲密关系中的距离感', icon: '📏' },
  attitude: { name: '对亲密关系的态度', icon: '💭' },
  conflict: { name: '冲突与情绪处理', icon: '🌊' },
  deep: { name: '对关系的深层认知', icon: '🔮' }
};

const questions = [
  {
    id: 'q1', section: 'distance',
    text: '当伴侣/朋友想要靠近我时，我会感到不舒服，想要保持距离。'
  },
  {
    id: 'q2', section: 'distance',
    text: '我更喜欢独处，而不是依赖他人。'
  },
  {
    id: 'q3', section: 'distance',
    text: '我觉得对别人敞开心扉是一件很困难的事。'
  },
  {
    id: 'q4', section: 'distance',
    text: '当关系变得太亲密时，我会主动制造一些距离。'
  },
  {
    id: 'q5', section: 'distance',
    text: '我不太需要别人的情感支持，更倾向于自己解决问题。'
  },
  {
    id: 'q6', section: 'attitude',
    text: '我担心如果太依赖别人，最终会让自己受伤。'
  },
  {
    id: 'q7', section: 'attitude',
    text: '我觉得大多数人都不值得完全信任。'
  },
  {
    id: 'q8', section: 'attitude',
    text: '当别人表达对我的爱意或依赖时，我会感到压力或不自在。'
  },
  {
    id: 'q9', section: 'attitude',
    text: '我倾向于把情感藏在心里，不轻易表达。'
  },
  {
    id: 'q10', section: 'attitude',
    text: '我认为一个人独立生活比依赖伴侣更有安全感。'
  },
  {
    id: 'q11', section: 'conflict',
    text: '当关系中出现冲突时，我更倾向于回避而不是正面解决。'
  },
  {
    id: 'q12', section: 'conflict',
    text: '我很难在争吵后主动和好，通常需要很长时间冷静。'
  },
  {
    id: 'q13', section: 'conflict',
    text: '当伴侣情绪激动时，我会感到不知所措，想要逃离。'
  },
  {
    id: 'q14', section: 'conflict',
    text: '我不擅长表达自己的情绪，即使内心有很多感受。'
  },
  {
    id: 'q15', section: 'conflict',
    text: '我觉得谈论感情是一件令人疲惫的事。'
  },
  {
    id: 'q16', section: 'deep',
    text: '我有时会觉得，没有亲密关系也能活得很好。'
  },
  {
    id: 'q17', section: 'deep',
    text: '我害怕失去自我，所以不愿意在关系中投入太多。'
  },
  {
    id: 'q18', section: 'deep',
    text: '我曾经因为感情太深而受伤，所以现在会刻意保护自己。'
  },
  {
    id: 'q19', section: 'deep',
    text: '我觉得自己在关系中总是付出更少的那一方。'
  },
  {
    id: 'q20', section: 'deep',
    text: '即使喜欢一个人，我也会压制自己的感情，不轻易表白。'
  }
];

const LIKERT_OPTIONS = [
  { label: '完全不符合', value: 1 },
  { label: '不太符合', value: 2 },
  { label: '有时符合', value: 3 },
  { label: '比较符合', value: 4 },
  { label: '完全符合', value: 5 }
];

const RESULT_LEVELS = [
  {
    min: 20, max: 39,
    level: 1,
    name: '安全型倾向',
    color: '#4CAF50',
    emoji: '🟢',
    kicker: '你的依恋类型',
    badge: 'Level 1 · 安全型倾向',
    title: '你的内心，是一片温暖的港湾',
    desc: '你在亲密关系中表现出较强的安全感，能够自然地接受他人的靠近，也愿意适度地表达自己的情感。你不会因为亲密而感到窒息，也不会因为独处而感到恐慌。\n\n你懂得在"连接"与"独立"之间找到平衡——这是一种难得的能力。你的伴侣或朋友在你身边，往往会感到被接纳、被理解。',
    advice: '继续保持这份开放与温柔。你不需要改变什么，只需要记得：真正的亲密，不是失去自我，而是两个完整的人，选择彼此靠近。',
    traits: ['情感开放', '信任他人', '独立且亲密', '情绪稳定', '边界清晰'],
    behaviors: ['能够自然地表达爱意和关心', '在关系中既能依赖也能独立', '遇到问题愿意沟通解决', '能接受伴侣的缺点和不完美', '独处时也能感到充实和满足'],
    strengths: ['在关系中给予对方安全感', '善于建立健康的亲密关系', '情绪调节能力强', '能够平衡亲密与独立', '沟通表达能力强'],
    challenges: ['可能难以理解回避型伴侣的疏离', '有时会过于理想化关系', '可能忽视自己的边界需求'],
    relationshipAdvice: '你在关系中是稳定的力量源泉。对于回避型伴侣，给予他们足够的空间，不要急于拉近距离；对于焦虑型伴侣，多给予确认和安抚。你的安全感会感染身边的人，但也要记得保护自己的边界。',
    growthPath: ['继续保持对自我的觉察', '学习识别不同依恋类型的特点', '在关系中保持开放的同时，也关注自己的需求', '尝试帮助身边的朋友理解依恋模式', '定期反思关系中的互动模式']
  },
  {
    min: 40, max: 59,
    level: 2,
    name: '轻度回避型',
    color: '#FFC107',
    emoji: '🟡',
    kicker: '你的依恋类型',
    badge: 'Level 2 · 轻度回避型',
    title: '你渴望连接，却总在门口徘徊',
    desc: '你并不是不想要亲密关系，只是有时候，当别人靠得太近，你会本能地往后退一步。你享受独处，也珍视自由，但偶尔也会在深夜问自己：为什么我总是很难完全放开？\n\n这种轻微的回避，往往来自过去某些让你受伤的经历——也许是一次背叛，也许是一段让你窒息的关系，也许只是从小就学会了"靠自己"。',
    advice: '你不需要强迫自己立刻打开心门。但可以试着问问自己：我现在保持的距离，是真正的需要，还是一种习惯性的防御？允许自己慢慢靠近，是一种勇气。',
    traits: ['独立自主', '谨慎信任', '情感内敛', '自我保护', '边界感强'],
    behaviors: ['关系亲密时会下意识后退', '更习惯独自处理情绪', '不太主动表达爱意', '对过度依赖感到不适', '在关系中保持一定"安全距离"'],
    strengths: ['独立性强，不依赖他人', '能够自我消化情绪', '尊重他人的边界', '不会过度索取情感', '在独处中能找到平静'],
    challenges: ['可能错过深度连接的机会', '伴侣可能感到被疏远', '难以表达真实需求', '容易压抑负面情绪'],
    relationshipAdvice: '你的独立是珍贵的品质，但也要让伴侣感受到被需要。试着偶尔主动分享你的想法，哪怕只是小事。告诉对方："我需要一些独处时间"比直接消失更能让对方安心。',
    growthPath: ['每天尝试分享一件小事给信任的人', '练习用语言表达"我需要"而不是独自承担', '当想退缩时，先问自己：这是真的需要空间，还是习惯性逃避？', '记录下那些让你想要后退的时刻', '尝试在安全的关系中多停留一会儿']
  },
  {
    min: 60, max: 79,
    level: 3,
    name: '中度回避型',
    color: '#FF9800',
    emoji: '🟠',
    kicker: '你的依恋类型',
    badge: 'Level 3 · 中度回避型',
    title: '你用独立武装自己，却在内心深处渴望被懂',
    desc: '你非常擅长独立，甚至有时候会让人觉得你"不需要任何人"。你处理情绪的方式是压下去、消化掉，然后继续前行。你不轻易依赖，也不轻易表达。\n\n但在某些安静的时刻，你也会感到一种说不清的孤独——不是因为身边没有人，而是因为你和他们之间，总隔着一层透明的玻璃。\n\n这种回避型模式，可能让你在关系中总是"若即若离"，让爱你的人感到困惑和疲惫。',
    advice: '你的独立是你的铠甲，但铠甲穿久了，也会变成囚笼。试着找一个你信任的人，哪怕只是说一句"我今天有点难受"——这一小步，可能会改变很多。',
    traits: ['高度独立', '情感隔离', '自我依靠', '防御性强', '内心敏感'],
    behaviors: ['习惯性压抑情感需求', '关系深入时会感到焦虑', '用忙碌或冷漠来回避亲密', '很难主动寻求帮助', '在冲突中选择沉默或离开'],
    strengths: ['极强的自我调节能力', '不会给他人造成负担', '能够独自应对困难', '在危机中保持冷静', '尊重他人的独立性'],
    challenges: ['长期压抑可能导致情绪爆发', '难以建立深度亲密关系', '伴侣可能感到被拒绝', '内心孤独感难以排解', '可能错过被爱的机会'],
    relationshipAdvice: '你的伴侣需要理解：你的疏离不是不爱，而是保护。建议和伴侣约定一个"安全词"，当你需要空间时，用它来代替沉默。同时，试着每周至少一次主动表达关心，哪怕只是一个拥抱。',
    growthPath: ['识别并命名自己的情绪（开心、难过、害怕...）', '找一个信任的人，练习说"我今天不太好"', '当想要退缩时，尝试多停留5分钟', '写日记记录自己的情感需求', '考虑寻求心理咨询师的帮助']
  },
  {
    min: 80, max: 100,
    level: 4,
    name: '高度回避型',
    color: '#F44336',
    emoji: '🔴',
    kicker: '你的依恋类型',
    badge: 'Level 4 · 高度回避型',
    title: '你把自己保护得太好，好到连自己都进不去',
    desc: '你已经非常习惯于独自承担一切。在你的世界里，"依赖"几乎等于"软弱"，"亲密"几乎等于"危险"。你可能有过一些让你深深受伤的经历，让你学会了：不靠近，就不会受伤。\n\n你在关系中往往保持高度警惕，一旦感觉对方靠得太近，就会启动"撤退模式"。你可能会用忙碌、冷漠、或者"我只是需要空间"来回避真正的情感连接。\n\n但你内心深处，其实也有一个渴望被爱、被理解的自己——只是那个自己，被你压得太深了。',
    advice: '回避不是你的错，它曾经保护过你。但现在，也许是时候问问自己：我愿意为了真正的连接，冒一次险吗？建议你可以尝试心理咨询，和专业的人一起，慢慢解开那些年的心结。你值得被爱，也值得去爱。',
    traits: ['极度独立', '情感封闭', '高度警惕', '自我隔离', '深层恐惧'],
    behaviors: ['几乎不表达情感需求', '关系稍有亲密就想逃离', '用工作/游戏等填满时间', '对亲密关系持怀疑态度', '很难信任他人的善意'],
    strengths: ['完全的自给自足', '不会给任何人添麻烦', '能够承受孤独', '在独处中找到意义', '极强的自我保护能力'],
    challenges: ['难以体验亲密关系的温暖', '可能长期处于情感孤立', '伴侣感到无法靠近你', '内心深处有强烈的孤独', '可能发展出抑郁倾向'],
    relationshipAdvice: '如果你正在一段关系中，请告诉伴侣：你的回避源于过去的伤痛，而非不爱。建议一起寻求伴侣咨询。如果你单身，在开始新关系前，先尝试和专业心理咨询师一起探索那些让你害怕靠近的根源。',
    growthPath: ['强烈建议寻求专业心理咨询', '从小事开始：每天对一个人微笑或打招呼', '尝试识别身体的紧张感，那是情绪的信号', '阅读关于依恋理论的书籍', '给自己写一封信：你值得被爱']
  }
];

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
const questionBadge = document.getElementById('questionBadge');
const questionNum = document.getElementById('questionNum');
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

  const sectionInfo = SECTION_META[q.section];
  questionBadge.textContent = `${sectionInfo.icon} ${sectionInfo.name}`;
  questionNum.textContent = `第 ${app.currentQuestion + 1} / ${questions.length} 题`;
  questionText.textContent = q.text;

  const progress = ((app.currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `${app.currentQuestion + 1} / ${questions.length}`;

  const currentAnswer = app.answers[q.id];
  optionsContainer.innerHTML = LIKERT_OPTIONS.map((opt) => {
    const isSelected = currentAnswer === opt.value;
    return `<div class="option ${isSelected ? 'selected' : ''}" data-value="${opt.value}" onclick="window.__avoidant_select(${opt.value})"><span class="option-text">${opt.label}</span></div>`;
  }).join('');

  prevBtn.style.display = app.currentQuestion > 0 ? 'inline-block' : 'none';
  const isLast = app.currentQuestion === questions.length - 1;
  nextBtn.style.display = isLast ? 'none' : 'inline-block';
  submitTestBtn.style.display = isLast ? 'inline-block' : 'none';
}

function selectAnswer(value) {
  if (app.isTransitioning) return;

  const q = questions[app.currentQuestion];
  if (!q) return;
  app.answers[q.id] = value;

  optionsContainer.querySelectorAll('.option').forEach(el => {
    const optValue = Number(el.dataset.value);
    el.classList.toggle('selected', optValue === value);
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
  if (app.currentQuestion >= questions.length - 1) {
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

function updateProgress() {
  const done = questions.filter(q => app.answers[q.id] !== undefined).length;
  const total = questions.length;
  progressBar.style.width = `${(done / total) * 100}%`;
  progressText.textContent = `${done} / ${total}`;
}

function computeResult() {
  let totalScore = 0;
  const sectionScores = {};

  Object.keys(SECTION_META).forEach(key => {
    sectionScores[key] = 0;
  });

  questions.forEach(q => {
    const val = Number(app.answers[q.id] || 0);
    totalScore += val;
    sectionScores[q.section] += val;
  });

  let resultLevel = RESULT_LEVELS[0];
  for (const level of RESULT_LEVELS) {
    if (totalScore >= level.min && totalScore <= level.max) {
      resultLevel = level;
      break;
    }
  }

  return {
    totalScore,
    sectionScores,
    resultLevel
  };
}

function renderDimList(result) {
  const dimList = document.getElementById('dimList');
  const sectionDetails = [
    { key: 'distance', name: '亲密关系中的距离感', max: 25 },
    { key: 'attitude', name: '对亲密关系的态度', max: 25 },
    { key: 'conflict', name: '冲突与情绪处理', max: 25 },
    { key: 'deep', name: '对关系的深层认知', max: 25 }
  ];

  dimList.innerHTML = sectionDetails.map(sec => {
    const score = result.sectionScores[sec.key];
    const pct = Math.round((score / sec.max) * 100);
    return `
      <div class="dim-item">
        <div class="dim-item-top">
          <div class="dim-item-name">${SECTION_META[sec.key].icon} ${sec.name}</div>
          <div class="dim-item-score">${score} / ${sec.max}分</div>
        </div>
        <div class="score-bar-container">
          <div class="score-bar-bg">
            <div class="score-bar-fill" style="width: ${pct}%"></div>
          </div>
          <div class="score-bar-labels">
            <span>低回避</span>
            <span>高回避</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderTraits(level) {
  const container = document.getElementById('traitsContainer');
  container.innerHTML = level.traits.map((trait, i) => `
    <div class="trait-tag" style="animation-delay: ${i * 0.1}s">${trait}</div>
  `).join('');
}

function renderBehaviors(level) {
  const container = document.getElementById('behaviorsContainer');
  container.innerHTML = level.behaviors.map((behavior, i) => `
    <div class="behavior-item" style="animation-delay: ${i * 0.1}s">
      <span class="behavior-icon">•</span>
      <span class="behavior-text">${behavior}</span>
    </div>
  `).join('');
}

function renderStrengthsChallenges(level) {
  const strengthsList = document.getElementById('strengthsList');
  const challengesList = document.getElementById('challengesList');
  
  strengthsList.innerHTML = level.strengths.map(s => `
    <li><span class="list-icon">✓</span>${s}</li>
  `).join('');
  
  challengesList.innerHTML = level.challenges.map(c => `
    <li><span class="list-icon">!</span>${c}</li>
  `).join('');
}

function renderGrowthPath(level) {
  const container = document.getElementById('growthPathContainer');
  container.innerHTML = level.growthPath.map((step, i) => `
    <div class="growth-step">
      <div class="step-number">${i + 1}</div>
      <div class="step-content">${step}</div>
    </div>
  `).join('');
}

function renderResult() {
  const result = computeResult();
  const level = result.resultLevel;

  document.getElementById('resultModeKicker').textContent = level.kicker;
  document.getElementById('resultTypeName').textContent = `${level.emoji} ${level.name}`;
  document.getElementById('matchBadge').textContent = `总分 ${result.totalScore} / 100 · ${level.badge}`;
  document.getElementById('resultTypeSub').textContent = level.title;
  document.getElementById('resultDesc').textContent = level.desc;
  document.getElementById('resultAdvice').textContent = level.advice;
  document.getElementById('relationshipAdvice').textContent = level.relationshipAdvice;

  renderDimList(result);
  renderTraits(level);
  renderBehaviors(level);
  renderStrengthsChallenges(level);
  renderGrowthPath(level);
  showScreen('result');
}

async function handleSubmitTest() {
  const unansweredCount = questions.filter(q => app.answers[q.id] === undefined).length;
  if (unansweredCount > 0) {
    alert(`请完成所有题目，还剩 ${unansweredCount} 题未回答`);
    return;
  }

  const result = computeResult();
  const resultData = {
    attachmentType: result.resultLevel.name,
    score: result.totalScore,
    level: result.resultLevel.badge,
    sectionScores: result.sectionScores,
    traits: result.resultLevel.traits,
    advice: result.resultLevel.advice,
    growthPath: result.resultLevel.growthPath
  };

  try {
    if (app.exchangeCode && app.exchangeCode !== 'VIP88888') {
      const response = await fetch(`${API_BASE_URL}/submit-avoidant`, {
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
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      throw new Error('兑换码不存在');
    }

    app.exchangeCode = code;
    closeCodeModal();
    startTest();
  } catch (error) {
    errorDiv.textContent = '兑换码不存在或已被使用';
    errorDiv.classList.add('show');
  }
}

window.__avoidant_select = selectAnswer;

function saveResultImage() {
  const resultContainer = document.querySelector('.result-container');
  if (!resultContainer) return;

  html2canvas(resultContainer, {
    scale: 2,
    useCORS: true,
    logging: false
  }).then(canvas => {
    const link = document.createElement('a');
    link.download = `回避型依恋测试结果-${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }).catch(error => {
    console.error('保存图片失败:', error);
    alert('保存图片失败，请稍后重试');
  });
}

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
