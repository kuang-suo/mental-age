// API 基础 URL
//本地
const API_BASE_URL = '/api';
//const API_BASE_URL = 'http://localhost:3001/api';
//服务器
//const API_BASE_URL = '/api';
//const API_BASE_URL = 'https://mental-age-production.up.railway.app/api';

// 8个维度的定义
const DIMENSIONS = {
  1: '情感稳定性',
  2: '社交开放性',
  3: '自我认知度',
  4: '责任感',
  5: '好奇心',
  6: '适应性',
  7: '乐观倾向',
  8: '压力应对'
};

// 8种人格类型映射
const PERSONALITY_TYPES = {
  1: {
    name: '温柔治愈者',
    archetype: '暖阳使者',
    celebrity: '特蕾莎修女',
    description: '富有同理心，擅长安抚他人，情感稳定且乐于助人。'
  },
  2: {
    name: '活力挑战者',
    archetype: '追风少年',
    celebrity: '理查德·布兰森',
    description: '热爱冒险，好奇心强，适应力高，永远充满能量。'
  },
  3: {
    name: '理性守望者',
    archetype: '智慧长者',
    celebrity: '苏格拉底',
    description: '冷静自持，责任感强，善于分析和规划。'
  },
  4: {
    name: '自由探索者',
    archetype: '星辰旅人',
    celebrity: '大卫·爱登堡',
    description: '好奇心旺盛，热爱自然与新知，独立不羁。'
  },
  5: {
    name: '温润调和者',
    archetype: '静水磐石',
    celebrity: '达赖喇嘛',
    description: '情绪稳定，善于化解冲突，乐观包容。'
  },
  6: {
    name: '理想远航者',
    archetype: '梦想建筑师',
    celebrity: '埃隆·马斯克',
    description: '高责任感与好奇心，敢于设定宏大目标并执行。'
  },
  7: {
    name: '敏锐洞察者',
    archetype: '暗夜灯塔',
    celebrity: '弗吉尼亚·伍尔芙',
    description: '自我认知深刻，情感细腻，对人性有敏锐洞察。'
  },
  8: {
    name: '快乐传播者',
    archetype: '阳光精灵',
    celebrity: '罗宾·威廉姆斯',
    description: '乐观外向，社交开放性高，善于带给他人欢笑。'
  }
};

// 关键词库
const KEYWORDS_POOL = {
  1: ['成熟', '稳定', '温暖', '可靠', '内敛'],
  2: ['热情', '开放', '社交', '活力', '外向'],
  3: ['深思', '自知', '内省', '敏感', '细腻'],
  4: ['责任', '执行', '可信', '严谨', '专注'],
  5: ['好奇', '探索', '创新', '学习', '开放'],
  6: ['适应', '灵活', '包容', '变通', '平衡'],
  7: ['乐观', '积极', '向上', '希望', '阳光'],
  8: ['抗压', '坚韧', '冷静', '理性', '沉着']
};

/**
 * 计算8个维度的得分
 * @param {Array} answers - 答案数组，长度20，每个值1-5
 * @returns {Object} 8个维度的得分（0-100）百分制
 */
function calculateDimensionScores(answers) {
  // 定义每个维度包含的题目索引（0-based）
  const dimensionQuestions = {
    1: [0, 8, 16],      // 情感稳定性 (3个问题)
    2: [1, 9, 17],      // 社交开放性 (3个问题)
    3: [2, 10, 18],     // 自我认知度 (3个问题)
    4: [3, 11, 19],     // 责任感 (3个问题)
    5: [4, 12],         // 好奇心 (2个问题)
    6: [5, 13],         // 适应性 (2个问题)
    7: [6, 14],         // 乐观倾向 (2个问题)
    8: [7, 15]          // 压力应对 (2个问题)
  };

  const scores = {};
  for (let dim = 1; dim <= 8; dim++) {
    const questionIndices = dimensionQuestions[dim];
    const sum = questionIndices.reduce((acc, idx) => acc + answers[idx], 0);
    // 计算原始得分（0-10分）
    const dimensionMaxScore = questionIndices.length * 5;
    const rawScore = (sum / dimensionMaxScore) * 10;
    
    // 使用非线性转换，提升低分，使平均分在6-7分左右
    // 公式：3 + (rawScore^2 / 10)，这样低分提升更多，高分提升较少
    const adjustedScore = 3 + (rawScore * rawScore / 10);
    
    // 确保分数在1-10之间
    const finalScore = Math.max(1, Math.min(10, adjustedScore));
    scores[dim] = Math.round(finalScore * 10) / 10;
  }
  return scores;
}

/**
 * 计算心理年龄
 * @param {Object} dimensionScores - 8个维度的得分
 * @returns {number} 心理年龄（18-60）
 */
function calculateMentalAge(dimensionScores) {
  const totalScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0);
  const avgScore = totalScore / 8;
  // 线性映射：0-10 -> 18-60
  const mentalAge = Math.round(18 + (avgScore / 10) * 42);
  return Math.max(18, Math.min(60, mentalAge));
}

/**
 * 判定人格类型
 * @param {Object} dimensionScores - 8个维度的得分
 * @returns {number} 人格类型ID（1-8）
 */
function determinePerssonalityType(dimensionScores) {
  // 找出最高的两个维度
  const sorted = Object.entries(dimensionScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([dim]) => parseInt(dim));

  const [dim1, dim2] = sorted;

  // 基于维度组合判定人格类型
  const typeMap = {
    '1,2': 1, '2,1': 1,  // 温柔治愈者
    '2,5': 2, '5,2': 2,  // 活力挑战者
    '4,3': 3, '3,4': 3,  // 理性守望者
    '5,6': 4, '6,5': 4,  // 自由探索者
    '1,7': 5, '7,1': 5,  // 温润调和者
    '4,5': 6, '5,4': 6,  // 理想远航者
    '3,1': 7, '1,3': 7,  // 敏锐洞察者
    '2,7': 8, '7,2': 8   // 快乐传播者
  };

  const key = `${dim1},${dim2}`;
  return typeMap[key] || (dim1 % 8) + 1;
}

/**
 * 生成关键词
 * @param {Object} dimensionScores - 8个维度的得分
 * @returns {Array} 3-5个关键词
 */
function generateKeywords(dimensionScores) {
  const sorted = Object.entries(dimensionScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const keywords = [];
  for (const [dim, score] of sorted) {
    if (score >= 5) {  // 在0-10范围内，5分以上算较高
      const pool = KEYWORDS_POOL[dim];
      keywords.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  return keywords.slice(0, 5);
}

/**
 * 生成深度自我分析（结构化）
 * @param {number} mentalAge - 心理年龄
 * @param {number} realAge - 实际年龄
 * @param {Object} dimensionScores - 8个维度的得分
 * @param {number} typeId - 人格类型ID
 * @returns {Object} 分析数据对象
 */
function generateAnalysisText(mentalAge, realAge, dimensionScores, typeId) {
  const type = PERSONALITY_TYPES[typeId];
  const ageDiff = mentalAge - realAge;
  const ageDiffText = ageDiff > 0 ? `比实际年龄成熟${ageDiff}岁` : `比实际年龄年轻${Math.abs(ageDiff)}岁`;

  const topDim = Object.entries(dimensionScores)
    .sort((a, b) => b[1] - a[1])[0];
  const topDimName = DIMENSIONS[topDim[0]];

  return {
    coreTraits: `你的心理年龄是${mentalAge}岁，${ageDiffText}。作为一个${type.name}，你${type.description}你在${topDimName}方面表现突出，这使得你具有独特的人生智慧。`,
    blindSpots: `你的内心世界丰富而深邃，看似坚强的外表下可能隐藏着对被理解的渴望。有时候你可能过度关注他人的感受，而忽略了自己的真实需求。学会在给予和接受之间找到平衡，会让你的人际关系更加健康。`,
    growthAdvice: `建议你在日常生活中多停留片刻，倾听自己内心的声音。通过冥想、日记或心理咨询等方式，可以帮你更深入地了解自己的潜在动机。同时，勇敢地表达你的真实想法，不要总是扮演完美的角色。你的${type.archetype}特质让你在生活中散发独特的魅力，但真实的你更加珍贵。`
  };
}

/**
 * 生成社交与匹配信息（结构化）
 * @param {number} typeId - 人格类型ID
 * @returns {Object} 社交信息对象
 */
function generateMatchText(typeId) {
  const socialTypes = {
    1: '温暖陪伴者',
    2: '冒险同伴',
    3: '思想伙伴',
    4: '自由灵魂',
    5: '和谐调和者',
    6: '梦想建造者',
    7: '灵魂知己',
    8: '快乐传播者'
  };

  const socialStyles = {
    1: '你是一个天生的倾听者，在与人相处时总能表现出真诚的关心。你的陪伴让人感到温暖和安全，朋友们喜欢在你身边倾诉心事。',
    2: '你是一个充满热情的冒险家，总能带动周围的人去尝试新事物。你的能量感染力很强，能够激发他人的活力和勇气。',
    3: '你是一个深度思考者，喜欢与人进行有意义的对话。在智力碰撞中，你能找到快乐和共鸣。',
    4: '你是一个独立自主的个体，尊重他人的自由，也需要被理解。你的存在提醒人们生活可以有无限的可能性。',
    5: '你是一个天生的和平使者，能够在不同观点之间找到平衡。你的包容心让人们感到被接纳和理解。',
    6: '你是一个有远见的梦想家，能够感染和激励身边的人。你相信通过努力可以改变世界。',
    7: '你是一个敏感的灵魂，能够捕捉到他人的微妙情绪。深层次的连接是你追求的关系模式。',
    8: '你是一个自然的快乐传播者，你的热情和幽默总能化解尴尬。与你相处永远充满欢笑。'
  };

  const bestMatches = {
    1: '与你互补最好的是有强烈目标感的人，他们能鼓励你勇敢表达自己的想法。同时，与同样温暖的人相处也能互相滋养。',
    2: '与你匹配最好的是有冷静理性的人，能够在你冒险时提供稳定的支撑。共同的价值观会让你们的冒险更有意义。',
    3: '与你最匹配的是同样喜欢思考的人，你们可以进行无止境的对话。另外，感性的人也能补充你的理性不足。',
    4: '与你最好搭配的是同样独立的人，你们能够给彼此充分的空间。又或者与安全感强的人在一起，能让你感到被接纳。',
    5: '与你最有缘分的是具有同样包容心的人。两个温和的灵魂能创造出和谐的关系氛围。',
    6: '与你最搭配的是有共同梦想的人，你们能携手创造属于彼此的未来。或者找一个能理解你野心的伙伴。',
    7: '与你最契合的是同样敏感细腻的人，能够深入理解你的内心世界。深度的精神连接是你们关系的基础。',
    8: '与你最匹配的是同样热情开朗的人，你们能互相点燃生活的火焰。稳定的人也能帮你落实梦想。'
  };

  const relationshipReminders = {
    1: '提醒：不要总是优先考虑他人，你的需求同样重要。学会温柔但坚定地表达界限，真正的关系应该是双向的。',
    2: '提醒：在冒险中也要留下时间和精力给重要的人。深度的陪伴有时比新鲜感更珍贵。',
    3: '提醒：记住不是所有人都喜欢深度对话，有时候简单的陪伴也是爱。不要让理性冷却了感情。',
    4: '提醒：独立很好，但也要记得与人建立真正的联系。完全的自足可能会让人感到被拒绝。',
    5: '提醒：调和他人的同时，不要失去自己的声音。你的观点和感受同样值得被听见。',
    6: '提醒：在追逐梦想时，不要忽略身边人的感受。最伟大的成就也需要爱的陪伴。',
    7: '提醒：你的敏感是天赋，也可能成为负担。学会保护自己的心理边界，不要过度吸收他人的情绪。',
    8: '提醒：快乐的背后有时隐藏着脆弱，允许自己在亲密的人面前显露真实的情绪。'
  };

  return {
    socialType: socialTypes[typeId] || '独特的灵魂',
    socialStyle: socialStyles[typeId] || '你有独特的社交风格，人们被你吸引。',
    bestMatch: bestMatches[typeId] || '与志同道合的人相处最舒适。',
    relationshipReminder: relationshipReminders[typeId] || '在关系中保持真实和尊重。'
  };
}

// 全局状态
let state = {
  questions: [],
  answers: [],
  currentQuestion: 0,
  exchangeCode: null,
  realAge: null,
  testResult: null,
  isTransitioning: false  // 防止快速点击导致的跳题
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  const startTime = performance.now();
  console.log('开始初始化...');
  
  const loadQuestionsStart = performance.now();
  loadQuestions();
  const loadQuestionsEnd = performance.now();
  console.log(`加载题目耗时: ${(loadQuestionsEnd - loadQuestionsStart).toFixed(2)}ms`);
  
  const endTime = performance.now();
  console.log(`初始化总耗时: ${(endTime - startTime).toFixed(2)}ms`);
  console.log('初始化完成');
});

// 题目数据
const QUESTIONS = [
  { "id": 1, "title": "当遇到挫折时，我能很快调整心态继续前进", "dimension": 1, "order": 1 },
  { "id": 2, "title": "我喜欢在社交场合中与陌生人交流", "dimension": 2, "order": 2 },
  { "id": 3, "title": "我对自己的优缺点有清晰的认识", "dimension": 3, "order": 3 },
  { "id": 4, "title": "我会主动承担工作中的责任", "dimension": 4, "order": 4 },
  { "id": 5, "title": "我对新事物充满好奇心", "dimension": 5, "order": 5 },
  { "id": 6, "title": "面对变化，我能快速适应新环境", "dimension": 6, "order": 6 },
  { "id": 7, "title": "我对生活的未来充满乐观", "dimension": 7, "order": 7 },
  { "id": 8, "title": "在压力下，我能保持冷静思考", "dimension": 8, "order": 8 },
  { "id": 9, "title": "我很少因为小事而感到烦恼", "dimension": 1, "order": 9 },
  { "id": 10, "title": "我是朋友圈中的活跃分子", "dimension": 2, "order": 10 },
  { "id": 11, "title": "我经常反思自己的行为和决定", "dimension": 3, "order": 11 },
  { "id": 12, "title": "我会按时完成承诺的事情", "dimension": 4, "order": 12 },
  { "id": 13, "title": "我喜欢学习新的知识和技能", "dimension": 5, "order": 13 },
  { "id": 14, "title": "我能轻松接受他人的不同意见", "dimension": 6, "order": 14 },
  { "id": 15, "title": "即使困难重重，我也相信会有好结果", "dimension": 7, "order": 15 },
  { "id": 16, "title": "我有有效的方法来缓解压力", "dimension": 8, "order": 16 },
  { "id": 17, "title": "我的情绪波动不会影响日常生活", "dimension": 1, "order": 17 },
  { "id": 18, "title": "我喜欢参加各种社交活动", "dimension": 2, "order": 18 },
  { "id": 19, "title": "我了解自己真正想要什么", "dimension": 3, "order": 19 },
  { "id": 20, "title": "我会为自己的错误承担后果", "dimension": 4, "order": 20 }
];

// 加载题目
function loadQuestions() {
  try {
    state.questions = QUESTIONS;
    document.getElementById('totalQuestions').textContent = QUESTIONS.length;
    state.answers = new Array(QUESTIONS.length).fill(0);
  } catch (error) {
    console.error('加载题目失败:', error);
    alert('加载题目失败，请刷新页面重试');
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
      body: JSON.stringify({ code, testType: 'mental-age' })
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
  state.isTransitioning = false;  // 重置跳转标志
  displayQuestion();
}

// 显示题目
function displayQuestion() {
  const question = state.questions[state.currentQuestion];
  document.getElementById('questionText').textContent = question.title;
  document.getElementById('currentQuestion').textContent = state.currentQuestion + 1;

  // 更新进度条
  const progress = ((state.currentQuestion + 1) / state.questions.length) * 100;
  document.getElementById('progressFill').style.width = progress + '%';

  // 清除选中状态
  document.querySelectorAll('input[name="answer"]').forEach(input => {
    input.checked = false;
  });

  // 恢复之前的答案
  if (state.answers[state.currentQuestion] > 0) {
    document.querySelector(`input[value="${state.answers[state.currentQuestion]}"]`).checked = true;
  }

  // 启用所有选项
  document.querySelectorAll('.option').forEach(option => {
    option.classList.remove('disabled');
  });

  // 更新按钮状态
  const isLastQuestion = state.currentQuestion === state.questions.length - 1;
  document.getElementById('prevBtn').style.display = state.currentQuestion > 0 ? 'block' : 'none';
  document.getElementById('submitTestBtn').style.display = isLastQuestion ? 'block' : 'none';

  // 第20题时显示年龄输入框
  const ageInputBox = document.getElementById('ageInputBox');
  if (isLastQuestion) {
    ageInputBox.style.display = 'block';
  } else {
    ageInputBox.style.display = 'none';
  }
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
  const unansweredCount = state.answers.filter(a => a === 0).length;
  if (unansweredCount > 0) {
    alert(`请完成所有题目，还剩 ${unansweredCount} 题未回答`);
    return;
  }

  // 验证年龄输入
  const ageInput = document.getElementById('realAgeInput');
  const ageValue = ageInput.value.trim();

  if (!ageValue) {
    alert('请输入您的实际年龄');
    ageInput.focus();
    return;
  }

  const age = parseInt(ageValue);
  if (isNaN(age) || age < 18 || age > 100) {
    alert('请输入有效的年龄 (18-100)');
    ageInput.focus();
    return;
  }

  // 保存年龄并提交
  state.realAge = age;
  submitTest();
}

// 提交测试
async function submitTest() {
  try {
    // 清除跳转标志
    state.isTransitioning = false;

    // 检查数据完整性
    console.log('提交测试:', {
      code: state.exchangeCode,
      answersCount: state.answers.length,
      answersContent: state.answers,
      realAge: state.realAge
    });

    // 验证答案数据
    if (state.answers.length !== 20) {
      throw new Error(`答案数量错误: 期望20个，实际${state.answers.length}个`);
    }

    if (state.answers.some(a => a < 1 || a > 5)) {
      throw new Error('答案格式错误: 每个答案必须在1-5之间');
    }

    if (!state.exchangeCode || (state.exchangeCode !== 'VIP88888' && state.exchangeCode.length !== 8)) {
      throw new Error('兑换码错误: ' + state.exchangeCode);
    }

    if (!state.realAge || state.realAge < 18 || state.realAge > 100) {
      throw new Error('年龄错误: ' + state.realAge);
    }

    // 显示加载状态
    document.getElementById('testScreen').classList.add('loading');
    document.getElementById('submitTestBtn').disabled = true;
    document.getElementById('submitTestBtn').textContent = '提交中...';

    // 对于VIP88888测试码，跳过后端API调用
    if (state.exchangeCode === 'VIP88888') {
      // 模拟后端返回数据
      const mockData = {
        result: {
          mentalAge: 25,
          personalityType: '平和型',
          dimensionScores: {
            1: 75,
            2: 80,
            3: 65,
            4: 85,
            5: 70,
            6: 60,
            7: 75,
            8: 80
          },
          keywords: ['稳重', '理性', '友善', '负责'],
          analysisText: {
            coreTraits: '你是一个稳重、理性的人，善于思考和分析问题。',
            blindSpots: '有时候可能过于谨慎，缺乏冒险精神。',
            growthAdvice: '尝试更多地拥抱变化，培养创新思维。'
          },
          matchText: {
            socialType: '和平使者',
            socialStyle: '你善于倾听，能够理解他人的观点。',
            bestMatch: '与积极向上、有责任感的人相处融洽。',
            relationshipReminder: '在关系中保持平衡，既要照顾他人感受，也要关注自己的需求。'
          },
          archetype: '守护者',
          matchedCelebrity: '钟南山'
        }
      };
      state.testResult = mockData.result;
      showResultScreen();
      return;
    }

    const dimensionScores = calculateDimensionScores(state.answers);
    const mentalAge = calculateMentalAge(dimensionScores);
    const personalityTypeId = determinePerssonalityType(dimensionScores);
    const personalityType = PERSONALITY_TYPES[personalityTypeId];
    const keywords = generateKeywords(dimensionScores);
    const analysisText = generateAnalysisText(mentalAge, state.realAge, dimensionScores, personalityTypeId);
    const matchText = generateMatchText(personalityTypeId);

    state.testResult = {
      mentalAge,
      realAge: state.realAge,
      dimensionScores,
      personalityType: personalityType.name,
      archetype: personalityType.archetype,
      matchedCelebrity: personalityType.celebrity,
      keywords,
      analysisText,
      matchText
    };

    const response = await fetch(`${API_BASE_URL}/submit-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: state.exchangeCode,
        rawAnswers: state.answers,
        resultData: state.testResult
      })
    });

    console.log('提交响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('后端错误:', errorData);
    }

    showResultScreen();
  } catch (error) {
    console.error('提交测试异常:', error);
    alert(`提交失败:\n${error.message}`);
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

// 维度信息配置
const DIMENSIONS_INFO = {
  1: { emoji: '💪', name: '情感稳定性' },
  2: { emoji: '🤝', name: '社交开放性' },
  3: { emoji: '🔍', name: '自我认知度' },
  4: { emoji: '✅', name: '责任感' },
  5: { emoji: '💡', name: '好奇心' },
  6: { emoji: '🌊', name: '适应性' },
  7: { emoji: '☀️', name: '乐观倾向' },
  8: { emoji: '⚡', name: '压力应对' }
};

// 分数解释
const SCORE_EXPLANATIONS = {
  low: '1-3分：需要关注和改进的领域',
  medium: '4-6分：平均水平',
  good: '7-8分：良好水平',
  excellent: '9-10分：优秀水平'
};

// 行动建议
const ACTION_SUGGESTIONS = {
  1: {
    low: {
      title: '情绪稳定性待提升',
      text: '你的情绪波动较大，容易受外界影响。这是很多人都会面临的挑战，通过有意识的练习完全可以改善。',
      actions: ['每天进行10分钟正念冥想，专注呼吸，让内心逐渐平静', '准备一个"情绪日记"，记录每次情绪波动的原因和感受，寻找规律', '当感到情绪来袭时，先做5次深呼吸，给自己一个缓冲的间隙', '减少咖啡因和糖分摄入，保持规律作息，从生理层面稳定情绪']
    },
    medium: {
      title: '情绪管理有进步空间',
      text: '你已经具备一定的情绪觉察力，但在压力情境下仍可能出现情绪失控。继续练习，你会越来越从容。',
      actions: ['学习"情绪ABC理论"——改变对事件的看法，就能改变情绪反应', '每天睡前回顾3件让你感恩的事，培养积极情绪的惯性', '尝试渐进式肌肉放松法，从脚趾到头顶逐步放松全身', '设定"情绪暂停键"：当情绪升温时，先离开现场5分钟再回应']
    },
    good: {
      title: '情绪管理能力良好',
      text: '你能较好地管理自己的情绪，在大多数情况下保持冷静和理性。这是一个非常宝贵的能力。',
      actions: ['尝试帮助身边的朋友管理情绪，教学相长会让你更上一层楼', '学习更高级的情绪调节策略，如认知重评和情绪转化', '在高压场景中刻意练习保持冷静，挑战自己的情绪极限', '记录你成功管理情绪的案例，建立自己的"情绪工具箱"']
    },
    excellent: {
      title: '情绪稳定达人',
      text: '你拥有出色的情绪稳定性，是身边人的"定海神针"。这种内在力量非常珍贵，值得好好运用。',
      actions: ['考虑成为情绪支持的志愿者，用你的经验帮助更多人', '将你的情绪智慧转化为领导力，在团队中发挥稳定军心的作用', '探索冥想或瑜伽的深层练习，让内心平静成为你的超能力', '写一本情绪管理手册，把你的方法论分享给需要的人']
    }
  },
  2: {
    low: {
      title: '社交开放性可提升',
      text: '你在社交方面比较谨慎和内向，这并不是缺点，但适度拓展社交圈能为生活带来更多可能性。',
      actions: ['从最简单的开始——每天对一个人微笑或说一句问候', '加入一个兴趣小组，在共同话题中自然地认识新朋友', '每周主动联系一位久未联络的朋友，重新建立连接', '参加小型聚会时，给自己设定"认识1个新朋友"的小目标']
    },
    medium: {
      title: '社交能力有潜力',
      text: '你在社交中表现中等，有时自如有时拘谨。通过有针对性的练习，你可以变得更加自信和从容。',
      actions: ['练习"主动倾听"——用提问和回应让对方感受到你的关注', '每周尝试一次与陌生人交流，比如和咖啡师聊两句', '学习一些破冰技巧，准备3个万能话题应对社交场合', '参加不同类型的社交活动，找到最适合你的社交方式']
    },
    good: {
      title: '社交能力出色',
      text: '你在社交中表现得体，能自如地与不同类型的人交流。你的社交能力是很多人羡慕的。',
      actions: ['尝试组织一次聚会或活动，锻炼你的社交领导力', '拓展跨圈层的社交，认识不同行业和背景的朋友', '学习深度社交技巧——如何从寒暄过渡到有意义的对话', '在社交中尝试成为"连接者"，帮助朋友们互相认识']
    },
    excellent: {
      title: '社交达人',
      text: '你是天生的社交高手，无论什么场合都能如鱼得水。你的人脉资源是一笔巨大的财富。',
      actions: ['考虑组织定期的社交活动，成为朋友圈的核心枢纽', '将社交优势转化为职业机会，拓展人脉的商业价值', '学习如何维护深层关系，而不仅仅是广度社交', '帮助社交困难的朋友融入群体，用你的天赋温暖他人']
    }
  },
  3: {
    low: {
      title: '自我认知需要加强',
      text: '你可能还没有花足够的时间去了解自己。自我认知是一切成长的起点，越了解自己，越能做出正确的选择。',
      actions: ['每天花10分钟独处，安静地问自己"我真正想要什么？"', '尝试写日记，哪怕只是几句话，记录今天的感受和想法', '列出你的3个优点和3个想改进的地方，诚实面对自己', '做一次性格测试，从科学的角度了解自己的特质']
    },
    medium: {
      title: '自我认知正在成长',
      text: '你对自己有一定的了解，但可能还有一些盲区。继续探索，你会发现一个更完整的自己。',
      actions: ['尝试"360度反馈"——询问3位亲近的人对你的真实看法', '每周写一篇深度反思，回顾自己的行为模式和情绪触发点', '探索你的核心价值观：什么对你来说是最重要的？', '留意你在压力下的反应模式，这是了解真实自我的窗口']
    },
    good: {
      title: '自我认知清晰',
      text: '你对自己有清晰的认识，知道自己的优势和不足。这种自知之明是成熟的标志。',
      actions: ['深入探索你的潜意识模式，尝试冥想或心理咨询', '将自我认知转化为行动——制定与自我特质匹配的目标', '帮助朋友进行自我探索，教学相长会让你认识更深的自己', '定期重新评估自己的价值观和人生目标，保持认知的更新']
    },
    excellent: {
      title: '自我认知大师',
      text: '你拥有非凡的自我觉察能力，能精准地感知自己的每一个情绪和动机。这是一种稀缺的智慧。',
      actions: ['考虑成为人生教练或导师，帮助他人提升自我认知', '将你的洞察力用于创造性工作，如写作、艺术或咨询', '探索灵性成长，将自我认知提升到更高的维度', '记录你的人生哲学，你的思考可能启发很多人']
    }
  },
  4: {
    low: {
      title: '责任感可培养',
      text: '你可能在责任和承诺方面有些逃避，这很常见。从小事开始培养责任感，你会逐渐感受到它带来的力量。',
      actions: ['从最小的承诺开始——说到做到，哪怕只是"明天早起"', '每天完成3件必须做的事，不拖延不找借口', '找一个责任感强的伙伴互相监督，让外部约束帮助你养成习惯', '为自己设定一个30天挑战，坚持完成一件小事']
    },
    medium: {
      title: '责任感有提升空间',
      text: '你在某些方面有责任感，但在其他方面可能还不够稳定。一致性是关键——让靠谱成为你的标签。',
      actions: ['制定每日计划并严格执行，训练自己的执行力', '学会说"不"——对做不到的事不轻易承诺，承诺了就一定做到', '每次完成任务后给自己一个小奖励，建立正向反馈循环', '找一个你敬佩的榜样，观察他们是如何履行责任的']
    },
    good: {
      title: '责任感强',
      text: '你是一个值得信赖的人，对承诺的事情总能认真负责。这是你非常宝贵的品质。',
      actions: ['尝试承担更大的责任，比如领导一个项目或组织', '学会区分"我的责任"和"不是我的责任"，避免过度承担', '培养团队责任感——不仅对自己负责，也对团队的结果负责', '将责任感与热情结合，找到让你心甘情愿全力以赴的事']
    },
    excellent: {
      title: '责任担当典范',
      text: '你是责任感的标杆，说到做到，从不让人失望。你的可靠让身边的人感到安心。',
      actions: ['考虑成为团队或项目的领导者，你的可靠性是最强的领导力', '帮助他人培养责任感，分享你的经验和方法', '学会在承担责任的同时照顾好自己，避免燃尽', '将你的责任感升华为使命感——找到比个人更大的事业去担当']
    }
  },
  5: {
    low: {
      title: '好奇心待激发',
      text: '你可能对周围的事物缺乏探索欲，生活容易陷入重复。好奇心是快乐的源泉，也是成长的动力。',
      actions: ['每天学习一个新知识，哪怕只是一个有趣的冷知识', '尝试一件你从未做过的事——新菜品、新路线、新爱好', '遇到不懂的事不要跳过，花5分钟去搜索和了解', '和不同领域的人聊天，听听他们的世界是什么样的']
    },
    medium: {
      title: '好奇心可拓展',
      text: '你对某些事物有好奇心，但可能局限于舒适区。拓展好奇的范围，你会发现世界比想象中更精彩。',
      actions: ['每月读一本完全不同领域的书，拓宽知识边界', '参加一次讲座或工作坊，接触你从未了解的主题', '养成提问的习惯——对一切保持"为什么"的态度', '尝试"30天新事物挑战"，每天做一件从未做过的小事']
    },
    good: {
      title: '好奇心旺盛',
      text: '你拥有旺盛的好奇心，对世界充满探索欲。这种品质让你的生活丰富多彩，也让你不断成长。',
      actions: ['将好奇心转化为深度学习，选择1-2个领域深入钻研', '尝试创新项目，用你的好奇心解决实际问题', '和同样好奇的人组队探索，碰撞出更大的火花', '记录你的发现和灵感，建立自己的"创意素材库"']
    },
    excellent: {
      title: '好奇心探索家',
      text: '你是一个不折不扣的探索者，对世界有着永不满足的好奇心。这是创新者和创造者的核心特质。',
      actions: ['考虑从事需要创新和探索的工作，如研究、设计或创业', '将你的好奇心成果化——写文章、做视频、开课程分享你的发现', '挑战自己去探索完全陌生的领域，突破认知边界', '培养"跨界思维"，将不同领域的知识融会贯通']
    }
  },
  6: {
    low: {
      title: '适应性可提升',
      text: '面对变化时你可能感到不安和抗拒。这很正常，但学会适应变化是现代生活的必备技能。',
      actions: ['每周做一个小改变——换一条上班路线、尝试新的午餐地点', '当变化来临时，先问自己"这个变化中有什么机会？"', '练习"如果……就……"思维，提前为可能的变化做准备', '接受"计划赶不上变化"的现实，学会享受不确定性']
    },
    medium: {
      title: '适应性有潜力',
      text: '你能应对一些变化，但较大的变动可能让你不适。提升适应性，让你在任何风浪中都能稳住方向。',
      actions: ['主动尝试新的工作方式或工具，锻炼适应能力', '每次面对变化时，写下3个可能的积极结果', '练习"快速原型思维"——先行动再调整，而不是等到完美', '和适应力强的人多交流，学习他们面对变化的心态']
    },
    good: {
      title: '适应能力出色',
      text: '你能灵活应对各种变化，在不确定的环境中依然保持效率。这是非常难得的能力。',
      actions: ['挑战自己去适应完全陌生的环境，如独自旅行或短期外派', '在团队中成为"变革推动者"，帮助他人适应变化', '学习敏捷方法论，将适应力系统化、方法论化', '培养"反脆弱"能力——不仅适应变化，还能从变化中获益']
    },
    excellent: {
      title: '适应力超强者',
      text: '你拥有超强的适应力，变化对你来说不是威胁而是机会。你是那种"越混乱越出色"的人。',
      actions: ['考虑从事需要快速适应的工作，如创业、咨询或危机管理', '将你的适应经验总结成方法论，帮助更多人应对变化', '在稳定时期也要保持"适度混乱"，避免舒适区陷阱', '探索极限环境下的适应力，挑战自己的适应边界']
    }
  },
  7: {
    low: {
      title: '乐观心态可培养',
      text: '你可能倾向于看到事物的消极面，这会让你错过很多美好。乐观不是盲目积极，而是相信问题总有解决办法。',
      actions: ['每天写下3件好事，哪怕是很小的事——阳光很好、咖啡很香', '当消极想法出现时，问自己"有没有另一种看问题的角度？"', '减少接触负面信息，多关注积极向上的内容', '和乐观的人多相处，积极情绪是会传染的']
    },
    medium: {
      title: '乐观心态可增强',
      text: '你有时乐观有时悲观，情绪容易受环境影响。培养稳定的乐观心态，会让你更从容地面对生活。',
      actions: ['学习"解释风格"理论——乐观者把挫折看作暂时的、特定的', '设定可实现的小目标，每次完成都会增强你的信心', '练习"最好未来"想象：花5分钟想象一切顺利的美好画面', '在困难面前先问"我能做什么？"而不是"为什么是我？"']
    },
    good: {
      title: '乐观积极',
      text: '你拥有积极乐观的心态，能从困难中看到希望。这种心态是你面对挑战时最强大的武器。',
      actions: ['在乐观的同时培养现实感，做到"理性乐观"', '用你的乐观感染身边的人，成为团队的"能量源"', '记录你用乐观心态克服困难的经历，建立"胜利档案"', '学习"心理韧性"训练，让乐观更加坚不可摧']
    },
    excellent: {
      title: '乐观传播者',
      text: '你是真正的乐观主义者，无论什么困境都能看到光明面。你的正能量会感染身边的每一个人。',
      actions: ['考虑成为积极心态的传播者——写博客、做演讲或开设课程', '将乐观转化为社会影响力，参与公益或社区服务', '在极端困难中保持乐观的同时，也允许自己偶尔脆弱', '帮助悲观的朋友重建信心，用你的光照亮他人']
    }
  },
  8: {
    low: {
      title: '压力应对需加强',
      text: '面对压力时你可能感到不知所措，这很正常。压力管理是可以学习的技能，从小步骤开始就能看到改变。',
      actions: ['学习4-7-8呼吸法：吸气4秒、屏息7秒、呼气8秒，快速缓解紧张', '每天进行30分钟有氧运动，这是最天然的压力释放方式', '将大任务拆分成小步骤，逐个击破，减少压迫感', '确保每天有15分钟纯粹的"我时间"，做让自己放松的事']
    },
    medium: {
      title: '压力应对可提升',
      text: '你能应对一定程度的压力，但压力过大时可能影响表现。增强抗压能力，让你在关键时刻更出色。',
      actions: ['建立你的"压力急救包"——列出5个能快速让你放松的方法', '学习时间管理技巧，减少因拖延造成的压力', '练习"压力接种"——主动暴露在适度压力下，逐步增强耐受力', '培养一个减压爱好，如画画、跑步或弹琴，给压力一个出口']
    },
    good: {
      title: '压力应对能力良好',
      text: '你拥有不错的压力应对能力，能在压力下保持较好的表现。这是职场和生活中非常实用的能力。',
      actions: ['学习将压力转化为动力——"这不是压力，这是挑战"', '帮助压力大的同事或朋友，分享你的减压经验', '在高压力场景中刻意练习，挑战自己的抗压极限', '建立压力预警系统，在压力过大前主动调整']
    },
    excellent: {
      title: '压力管理高手',
      text: '你是压力管理的大师，越有压力越能发挥出色。这种能力让你在竞争激烈的环境中脱颖而出。',
      actions: ['考虑从事高压力高回报的工作，如急诊医生、交易员或创业者', '将你的压力管理经验系统化，写成指南或开设工作坊', '在高压中也要注意身心信号，避免长期超负荷运转', '培养"压力后恢复"的仪式，确保每次高压后都能彻底放松']
    }
  }
};

// 职业建议
const CAREER_ADVICE = {
  '温柔治愈者': {
    careers: ['心理咨询师', '社会工作者', '教师', '护士', '志愿者'],
    strengths: '善于倾听和理解他人，富有同理心'
  },
  '活力挑战者': {
    careers: ['创业者', '销售', '营销', '运动员', '冒险家'],
    strengths: '充满活力和热情，喜欢挑战'
  },
  '理性守望者': {
    careers: ['分析师', '工程师', '科学家', '会计师', '律师'],
    strengths: '逻辑思维强，善于分析和规划'
  },
  '自由探索者': {
    careers: ['旅行家', '摄影师', '作家', '艺术家', '研究员'],
    strengths: '好奇心强，喜欢探索和发现'
  },
  '温润调和者': {
    careers: ['调解员', '人力资源', '顾问', '公关', '客服'],
    strengths: '善于调和矛盾，保持和谐'
  },
  '理想远航者': {
    careers: ['企业家', '设计师', '策划师', '导演', '发明家'],
    strengths: '有远见，敢于追求宏大目标'
  },
  '敏锐洞察者': {
    careers: ['作家', '心理学家', '艺术家', '分析师', '顾问'],
    strengths: '洞察力强，善于理解人性'
  },
  '快乐传播者': {
    careers: ['演员', '主持人', '教师', '培训师', '营销'],
    strengths: '乐观外向，善于带给他人快乐'
  }
};

// 关系建议
const RELATIONSHIP_ADVICE = {
  '温柔治愈者': '在关系中，你善于照顾他人，但也要记得照顾自己的需求。',
  '活力挑战者': '你的活力和热情很有感染力，但要注意给对方足够的空间。',
  '理性守望者': '你的理性和逻辑思维很有价值，但要学会表达情感。',
  '自由探索者': '你的独立和好奇心很吸引人，但要记得保持与他人的联系。',
  '温润调和者': '你的包容和理解很珍贵，但要学会表达自己的意见。',
  '理想远航者': '你的远见和抱负很令人钦佩，但要注意与现实的平衡。',
  '敏锐洞察者': '你的洞察力和敏感度很有深度，但要避免过度分析。',
  '快乐传播者': '你的乐观和幽默很有魅力，但要学会面对和处理负面情绪。'
};

// 计算情绪健康指数
function calculateEmotionalHealthIndex(dimensionScores) {
  const scores = Object.values(dimensionScores);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  // 检查得分是10分制还是100分制
  let normalizedAverage;
  if (average > 10) {
    // 如果平均值大于10，认为是100分制，直接使用
    normalizedAverage = average;
  } else {
    // 否则认为是10分制，转换为100分制
    normalizedAverage = (average / 10) * 100;
  }
  
  // 确保健康指数在0-100之间
  const healthIndex = Math.round(Math.max(0, Math.min(100, normalizedAverage)));
  return healthIndex;
}

// 获取健康指数等级
function getHealthIndexLevel(index) {
  if (index >= 80) return { level: '优秀', color: '#4CAF50', advice: '你的情绪健康状态非常好，继续保持！' };
  if (index >= 60) return { level: '良好', color: '#8BC34A', advice: '你的情绪健康状态不错，还有提升空间。' };
  if (index >= 40) return { level: '一般', color: '#FFC107', advice: '你的情绪健康状态需要关注，建议采取积极措施改善。' };
  return { level: '需要关注', color: '#FF5722', advice: '你的情绪健康状态需要特别关注，建议寻求专业帮助。' };
}

// 获取分数等级
function getScoreLevel(score) {
  if (score >= 9) return 'excellent';
  if (score >= 7) return 'good';
  if (score >= 4) return 'medium';
  return 'low';
}

// 生成个性化行动建议
function generateActionSuggestions(dimensionScores) {
  const suggestions = [];
  Object.entries(dimensionScores).forEach(([dim, score]) => {
    const level = getScoreLevel(score);
    const dimInfo = DIMENSIONS_INFO[dim];
    const suggestionData = ACTION_SUGGESTIONS[dim][level];
    suggestions.push({
      dimension: dimInfo.name,
      emoji: dimInfo.emoji,
      level: level,
      title: suggestionData.title,
      text: suggestionData.text,
      actions: suggestionData.actions
    });
  });
  return suggestions;
}

// 获取职业与关系建议
function getCareerAndRelationshipAdvice(personalityType) {
  const career = CAREER_ADVICE[personalityType] || {
    careers: ['根据你的兴趣和能力探索适合的职业'],
    strengths: '每个人都有独特的优势'
  };
  const relationship = RELATIONSHIP_ADVICE[personalityType] || '建立健康的关系需要相互理解和尊重。';
  return { career, relationship };
}

// 渲染结果
function renderResult() {
  const result = state.testResult;
  const ageDiff = result.mentalAge - state.realAge;
  const ageDiffText = ageDiff > 0
    ? `你的内心比实际年龄成熟 ${ageDiff} 岁，是个小老灵魂 🌿`
    : `你的内心比实际年龄年轻 ${Math.abs(ageDiff)} 岁，是个小天使 ✨`;

  // 生成维度进度条 HTML
  const dimensionBars = Object.entries(result.dimensionScores)
    .map(([dim, score]) => {
      const dimInfo = DIMENSIONS_INFO[dim];
      const scoreValue = parseFloat(score);
      const percentage = scoreValue > 10 ? scoreValue : scoreValue * 10;  // 确保百分比计算正确
      const scoreOutOf10 = scoreValue > 10 ? (scoreValue / 10).toFixed(1) : scoreValue.toFixed(1);  // 确保显示为10分制
      return `
        <div class="dimension-bar">
          <div class="dimension-label">${dimInfo.emoji} ${dimInfo.name}</div>
          <div class="progress-container">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="dimension-score">${scoreOutOf10}</div>
        </div>
      `;
    })
    .join('');

  // 生成关键词标签（多种颜色）
  const keywordColors = ['#FFB6C1', '#FFE4B5', '#F0E68C', '#B0E0E6', '#FFB6E1'];
  const keywordTags = result.keywords
    .map((kw, idx) => {
      const bgColor = keywordColors[idx % keywordColors.length];
      return `<span class="keyword-tag" style="background: ${bgColor}; color: white;">${kw}</span>`;
    })
    .join('');

  const html = `
    <!-- 模块一: 年龄对比 + 人格类型 -->
    <div class="result-module module-age-comparison">
      <div class="age-display">
        <div class="age-numbers">
          <div class="age-item">
            <div class="age-value">${result.mentalAge}</div>
            <div class="age-label">心理年龄（岁）</div>
          </div>
          <div class="age-divider">VS</div>
          <div class="age-item">
            <div class="age-value">${state.realAge}</div>
            <div class="age-label">实际年龄（岁）</div>
          </div>
        </div>
        <div class="age-insight">${ageDiffText}</div>
      </div>
      <div class="personality-highlight">
        <div class="personality-label">你的人格类型</div>
        <div class="personality-name">${result.personalityType}</div>
      </div>
    </div>

    <!-- 模块二: 情绪健康指数 -->
    <div class="result-module module-emotional-health">
      <h3 class="module-title">❤️ 情绪健康指数</h3>
      <div class="health-index-container">
        ${(() => {
          const healthIndex = calculateEmotionalHealthIndex(result.dimensionScores);
          const healthLevel = getHealthIndexLevel(healthIndex);
          return `
            <div class="health-index-display">
              <div class="health-index-value" style="color: ${healthLevel.color};">${healthIndex}</div>
              <div class="health-index-level" style="color: ${healthLevel.color};">${healthLevel.level}</div>
            </div>
            <div class="health-index-advice">
              <p>${healthLevel.advice}</p>
            </div>
          `;
        })()}
      </div>
    </div>

    <!-- 模块三: 核心特质 -->
    <div class="result-module module-keywords">
      <h3 class="module-title">✨ 核心特质</h3>
      <div class="keywords-container">
        ${keywordTags}
      </div>
    </div>

    <!-- 模块四: 能力雷达 -->
    <div class="result-module module-radar">
      <h3 class="module-title">📊 能力雷达</h3>
      <div class="radar-container">
        <canvas id="radarChart" width="400" height="400"></canvas>
      </div>
    </div>



    <!-- 模块六: 分数解释说明 -->
    <div class="result-module module-score-explanation">
      <h3 class="module-title">📊 分数解释说明</h3>
      <div class="score-explanations">
        <div class="score-range">
          <span class="score-label">1-3分</span>
          <span class="score-description">需要关注和改进的领域</span>
        </div>
        <div class="score-range">
          <span class="score-label">4-6分</span>
          <span class="score-description">平均水平</span>
        </div>
        <div class="score-range">
          <span class="score-label">7-8分</span>
          <span class="score-description">良好水平</span>
        </div>
        <div class="score-range">
          <span class="score-label">9-10分</span>
          <span class="score-description">优秀水平</span>
        </div>
      </div>
    </div>

    <!-- 模块七: 深度自我分析 -->
    <div class="result-module module-analysis">
      <h3 class="module-title">🌟 深度自我分析</h3>

      <div class="analysis-section">
        <h4 class="section-subtitle">💎 核心特质</h4>
        <p class="section-content">${result.analysisText.coreTraits || ''}</p>
      </div>

      <div class="analysis-section">
        <h4 class="section-subtitle">🔮 内在盲区</h4>
        <p class="section-content">${result.analysisText.blindSpots || ''}</p>
      </div>

      <div class="analysis-section">
        <h4 class="section-subtitle">🌱 成长建议</h4>
        <p class="section-content">${result.analysisText.growthAdvice || ''}</p>
      </div>
    </div>

    <!-- 模块八: 社交与匹配 -->
    <div class="result-module module-matching">
      <h3 class="module-title">💫 你的社交类型：${result.matchText.socialType || ''}</h3>

      <div class="matching-section">
        <h4 class="section-subtitle">🎭 社交风格</h4>
        <p class="section-content">${result.matchText.socialStyle || ''}</p>
      </div>

      <div class="matching-section">
        <h4 class="section-subtitle">💑 最佳匹配</h4>
        <p class="section-content">${result.matchText.bestMatch || ''}</p>
      </div>

      <div class="matching-section">
        <h4 class="section-subtitle">💬 关系提醒</h4>
        <p class="section-content">${result.matchText.relationshipReminder || ''}</p>
      </div>

      <div class="archetype-info">
        <div class="info-item">
          <span class="info-label">原型角色：</span>
          <span class="info-value">${result.archetype}</span>
        </div>
        <div class="info-item">
          <span class="info-label">匹配名人：</span>
          <span class="info-value">${result.matchedCelebrity}</span>
        </div>
      </div>
    </div>

    <!-- 模块九: 职业与关系建议 -->
    <div class="result-module module-career-relationship">
      <h3 class="module-title">💼 职业与关系建议</h3>
      
      <div class="career-section">
        <h4 class="section-subtitle">🌟 适合职业</h4>
        <div class="career-list">
          ${(() => {
            const { career } = getCareerAndRelationshipAdvice(result.personalityType);
            return career.careers.map(c => `<span class="career-tag">${c}</span>`).join('');
          })()}
        </div>
        <div class="strengths">
          <h5 class="strengths-label">核心优势:</h5>
          <p class="strengths-content">${(() => {
            const { career } = getCareerAndRelationshipAdvice(result.personalityType);
            return career.strengths;
          })()}</p>
        </div>
      </div>

      <div class="relationship-section">
        <h4 class="section-subtitle">💖 关系建议</h4>
        <p class="relationship-content">${(() => {
          const { relationship } = getCareerAndRelationshipAdvice(result.personalityType);
          return relationship;
        })()}</p>
      </div>
    </div>

    <!-- 模块十: 个性化行动建议 -->
    <div class="result-module module-action-suggestions">
      <h3 class="module-title">🎯 个性化行动建议</h3>
      <div class="suggestions-list">
        ${(() => {
          const suggestions = generateActionSuggestions(result.dimensionScores);
          const levelLabels = { low: '待提升', medium: '可进步', good: '良好', excellent: '优秀' };
          const levelColors = { low: '#FF5722', medium: '#FFC107', good: '#8BC34A', excellent: '#4CAF50' };
          return suggestions.map(suggestion => `
            <div class="suggestion-item">
              <div class="suggestion-header">
                <span class="suggestion-emoji">${suggestion.emoji}</span>
                <span class="suggestion-dimension">${suggestion.dimension}</span>
                <span class="suggestion-level" style="background: ${levelColors[suggestion.level]};">${levelLabels[suggestion.level]}</span>
              </div>
              <div class="suggestion-title">${suggestion.title}</div>
              <div class="suggestion-text">${suggestion.text}</div>
              <div class="suggestion-actions">
                <div class="actions-label">📋 行动指南：</div>
                ${suggestion.actions.map((action, idx) => `
                  <div class="action-step">
                    <span class="action-step-num">${idx + 1}</span>
                    <span class="action-step-text">${action}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('');
        })()}
      </div>
    </div>

    <!-- 模块十一: 友情提示 -->
    <div class="result-module module-disclaimer">
      <h3 class="module-title">💡 友情提示</h3>
      <p class="disclaimer-content">本测试仅供娱乐，不构成任何专业建议。</p>
    </div>
  `;

  document.getElementById('resultContent').innerHTML = html;

  // 延迟绘制雷达图，确保 DOM 已更新
  setTimeout(() => {
    drawRadarChart(result.dimensionScores);
  }, 300);
}

// 绘制雷达图
function drawRadarChart(scores) {
  try {
    if (typeof Chart === 'undefined') {
      console.error('Chart.js 未加载');
      return;
    }
    const canvas = document.getElementById('radarChart');
    if (!canvas) {
      console.error('Canvas 元素不存在');
      return;
    }

    console.log('雷达图原始数据:', scores);

    const ctx = canvas.getContext('2d');
    const labels = ['情感稳定性', '社交开放性', '自我认知度', '责任感', '好奇心', '适应性', '乐观倾向', '压力应对'];

    // 将 dimensionScores 对象转换为数组（按维度1-8的顺序）
    const rawData = [];
    for (let i = 1; i <= 8; i++) {
      const score = scores[i] || 0;
      rawData.push(parseFloat(score));
    }
    console.log('雷达图转换后数据:', rawData);

    // 归一化数据到0-10范围（兼容0-100和0-10两种输入格式）
    const maxVal = Math.max(...rawData, 1);
    const data = rawData.map(v => {
      let normalized = v;
      if (maxVal > 10) {
        normalized = (v / 100) * 10;
      }
      return Math.max(0, Math.min(10, normalized));
    });
    console.log('雷达图归一化后数据:', data);

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
          backgroundColor: 'rgba(255, 182, 193, 0.25)',
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
            max: 10,
            ticks: {
              // 显示 5 个圆圈（2, 4, 6, 8, 10）
              stepSize: 2,
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
    link.download = `心理年龄测试结果_${new Date().getTime()}.png`;
    link.click();
  } catch (error) {
    alert('保存图片失败: ' + error.message);
  }
}

// 返回首页
function backToStart() {
  window.location.href = 'home.html';
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
