const API_BASE_URL = '/api';

const questions = [
  {
    id: 'q1',
    text: '我会偷偷记住TA说过的话、喜欢的食物、想去的地方，甚至是一些很小的细节。',
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
    text: '看到TA和其他异性聊天或互动时，我会感到不舒服，甚至有点吃醋。',
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
    text: '我经常会在空闲的时候想起TA，想象和TA在一起的场景。',
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
    text: '如果TA需要帮助，我会愿意放下手头的事情去帮TA，即使有些麻烦。',
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
    text: '我想让TA知道我的心意，但又害怕被拒绝，这种矛盾让我很纠结。',
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
    text: '我会关注TA的社交媒体动态，看看TA最近在做什么、和谁在一起。',
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
    text: '见到TA的时候，我会感到紧张或心跳加速，不知道该说什么。',
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
    text: '我会因为TA的一句话或一个举动开心或难过很久。',
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
    text: '我会在TA面前刻意表现自己，希望给TA留下好印象。',
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
    text: '如果TA主动找我聊天，我会很开心，甚至会反复看聊天记录。',
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
    text: '我会找各种理由或机会接近TA，制造偶遇或共同话题。',
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
    text: '我会担心自己不够好，配不上TA，或者TA不会喜欢我这样的人。',
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
    text: '听到别人提起TA的名字，我会立刻竖起耳朵想知道说了什么。',
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
    text: '我会在心里默默比较自己和TA身边的其他人，想知道自己有没有机会。',
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
    text: '如果有一天TA突然有了对象，我会感到很难过或失落。',
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
    min: 15,
    max: 27,
    level: 1,
    emoji: '🤍',
    typeName: '暗恋小白',
    color: '#9CA3AF',
    label: '只是有点好感，还没到暗恋的程度',
    portrait: '你对TA有好感，但这份好感还在萌芽阶段。你会注意到TA的存在，偶尔会想起TA，但还没有到朝思暮想的地步。\n\n这种感觉更像是"有点心动"而不是"暗恋"。你保持着理性的距离，不会因为TA而影响自己的情绪和生活。这其实是一种很健康的状态——既有了心动的感觉，又不会被情感困扰。',
    traits: [
      '🌟 对TA有好感，但不会刻意关注',
      '💭 偶尔会想起TA，但不会频繁',
      '😊 见到TA会开心，但不会紧张',
      '🎯 生活重心在自己，TA只是加分项'
    ],
    timing: '现在的你，感情还处在"观察期"。建议你：\n\n1. 多创造和TA接触的机会，看看这份好感会不会加深\n2. 了解TA更多方面，确认自己是否真的喜欢\n3. 不急着表白，先从朋友做起，自然相处\n\n如果好感持续加深，再考虑下一步行动。',
    advice: '你的心态很健康，既有了心动的感觉，又不会被情感绑架。继续保持这种状态，顺其自然地发展。\n\n如果想让关系更进一步，可以：\n• 主动找TA聊天，增加了解\n• 邀请TA一起参加活动\n• 在TA面前展现真实的自己\n\n记住：好的感情是双向奔赴，不要一个人演独角戏。'
  },
  {
    min: 28,
    max: 42,
    level: 2,
    emoji: '💗',
    typeName: '暗恋新手',
    color: '#F472B6',
    label: '你开始心动了，但还在观望中',
    portrait: '你已经开始暗恋了，但还在试探和观望的阶段。你会关注TA的动态，在意TA对你的态度，但还没有到无法自拔的程度。\n\n你心里有TA的位置，但这个位置还不算太大。你会在意TA，但不会因为TA而影响自己的正常生活。你在等待一个合适的时机，或者更多的信号。',
    traits: [
      '👀 会偷偷关注TA的动态',
      '📱 TA的消息会让你开心很久',
      '🤔 会思考TA对你的态度',
      '⚖️ 在"表白"和"继续暗恋"之间犹豫'
    ],
    timing: '你处在暗恋的"观望期"，建议你：\n\n1. 先确认TA是否单身，有没有喜欢的人\n2. 观察TA对你的态度，是否有特别的好感\n3. 尝试增加互动，看看TA的反应\n\n如果TA对你也有好感，可以考虑在合适的时机表白。如果信号不明，可以先从好朋友做起。',
    advice: '你的暗恋还在可控范围内，这是最好的阶段——既有心动的感觉，又不会被情感折磨。\n\n建议：\n• 不要过度解读TA的每一个行为\n• 保持自己的生活和爱好，不要围着TA转\n• 如果想进一步，可以主动创造机会\n• 如果不确定，就先享受暗恋的美好\n\n暗恋本身就是一种美好的情感体验，不一定要有结果。'
  },
  {
    min: 43,
    max: 52,
    level: 3,
    emoji: '💖',
    typeName: '暗恋达人',
    color: '#EC4899',
    label: '你已经在暗恋了，而且藏得挺深',
    portrait: '你是一个标准的"暗恋达人"。TA已经占据了你相当多的心思，你会记住TA的喜好，关注TA的动态，在意TA的每一个反应。\n\n你把这份感情藏得很好，表面上和TA正常相处，内心却波涛汹涌。你既想靠近TA，又害怕暴露心意后连朋友都做不成。这种矛盾让你既甜蜜又煎熬。',
    traits: [
      '📝 记住了TA很多细节和喜好',
      '🔍 经常关注TA的社交动态',
      '😰 在TA面前会紧张，怕说错话',
      '🎭 表面淡定，内心戏很多'
    ],
    timing: '你的暗恋已经比较深了，建议你：\n\n1. 评估一下你们的关系基础，是否有足够的互动\n2. 观察TA是否对你有特别的关注或好感\n3. 如果关系不错，可以考虑试探性地表达好感\n\n表白时机：当你感觉到TA对你也有一定好感时，或者当你觉得"不表白会更后悔"时。',
    advice: '暗恋达人最需要的是"打破僵局"的勇气。你已经在心里演练了无数次，但现实中的行动却很少。\n\n建议：\n• 停止过度幻想，开始实际行动\n• 创造更多独处或深入交流的机会\n• 适当释放好感信号，看TA的反应\n• 如果长期没有进展，考虑表白或放下\n\n记住：暗恋最怕的不是被拒绝，而是永远停留在暗恋。'
  },
  {
    min: 53,
    max: 62,
    level: 4,
    emoji: '💕',
    typeName: '暗恋狂魔',
    color: '#DB2777',
    label: '你陷得很深，TA几乎占据了你所有心思',
    portrait: '你已经深深陷入暗恋中，TA几乎占据了你所有的心思。你会反复看TA的消息，分析TA的每一句话，幻想和TA在一起的未来。\n\n你的情绪很大程度上被TA影响——TA的一个微笑可以让你开心一整天，TA的冷淡可以让你难过很久。你活在一种甜蜜与煎熬交织的状态中。',
    traits: [
      '🔄 反复看TA的消息和动态',
      '🎭 在脑海里和TA"谈恋爱"',
      '📊 分析TA每一个行为背后的含义',
      '😢 情绪被TA严重影响'
    ],
    timing: '你的暗恋已经很深了，继续拖下去只会更痛苦。建议你：\n\n1. 给自己设定一个期限，比如3个月内要有行动\n2. 如果不确定TA的态度，可以先试探\n3. 如果觉得有机会，勇敢表白\n4. 如果觉得没希望，学会放下\n\n表白时机：越早越好。与其在心里煎熬，不如要一个结果——要么在一起，要么放下往前走。',
    advice: '暗恋狂魔最需要的是"行动"和"边界"。\n\n你需要做的：\n• 停止过度解读，这只会让你更焦虑\n• 把注意力从TA身上分一些给自己\n• 培养自己的爱好和社交圈\n• 给自己设定行动期限，不要无限等待\n\n暗恋应该是生活的调味剂，不是主菜。如果这份感情让你痛苦多于快乐，是时候做出改变了。'
  },
  {
    min: 63,
    max: 75,
    level: 5,
    emoji: '💘',
    typeName: '暗恋重症',
    color: '#BE185D',
    label: '你已经被暗恋折磨得无法自拔了',
    portrait: '你的暗恋已经到了"重症"的程度。TA几乎是你生活的全部重心，你无法控制自己不去想TA。你的情绪、你的决定、你的生活节奏，都被这份暗恋严重影响。\n\n你可能经常失眠，因为脑子里全是TA；你可能对其他事情提不起兴趣，因为只想和TA有关。这种状态既甜蜜又痛苦，你已经分不清是爱还是执念。',
    traits: [
      '🌙 经常因为想TA而失眠',
      '🎯 对其他事情失去兴趣',
      '⛓️ 感觉被这份感情困住',
      '💔 明知痛苦却无法放下'
    ],
    timing: '你的状态需要紧急行动。建议你：\n\n1. 【必须行动】给自己设定最后期限，一周内必须表白或放下\n2. 【寻求支持】和信任的朋友聊聊，不要一个人扛\n3. 【转移注意力】强制自己投入其他事情\n\n表白时机：现在。不要再等了。无论结果如何，你都需要一个结果来打破这个循环。被拒绝虽然痛苦，但至少可以开始走出来。',
    advice: '暗恋重症需要"自救"。你已经不是在暗恋，而是在自我折磨。\n\n紧急建议：\n• 承认自己的状态不健康，需要改变\n• 表白或放下，二选一，不要继续拖\n• 如果无法自己走出来，寻求朋友或专业人士的帮助\n• 重建自己的生活重心，TA不应该是全部\n\n记住：真正的爱应该是让你更好，而不是把你困住。如果这份感情让你痛苦，那它已经不是爱了，是执念。学会放手，也是爱自己的表现。'
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
    return `<div class="option ${isSelected ? 'selected' : ''}" onclick="window.__secret_crush_select(${idx})"><span class="option-text">${opt.label}</span></div>`;
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
      const response = await fetch(`${API_BASE_URL}/submit-secret-crush`, {
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
  document.getElementById('resultKicker').textContent = '你的暗恋程度';
  document.getElementById('resultTypeName').textContent = resultLevel.typeName;
  document.getElementById('resultTypeName').style.color = resultLevel.color;
  document.getElementById('resultTypeSub').textContent = resultLevel.label;
  document.getElementById('resultScore').textContent = totalScore;
  document.getElementById('resultScore').style.color = resultLevel.color;

  const scorePercent = ((totalScore - 15) / 60) * 100;
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

  const timingBox = document.getElementById('timingBox');
  timingBox.innerHTML = `<div class="timing-content">${resultLevel.timing.replace(/\n/g, '<br>')}</div>`;

  const adviceBox = document.getElementById('adviceBox');
  adviceBox.innerHTML = `<div class="advice-content">${resultLevel.advice.replace(/\n/g, '<br>')}</div>`;

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
      body: JSON.stringify({ code, testType: 'secret-crush' })
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

window.__secret_crush_select = selectAnswer;

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
    link.download = `暗恋程度测试结果-${new Date().getTime()}.png`;
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
