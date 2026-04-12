// API 基础 URL
//本地
const API_BASE_URL = 'http://localhost:3001/api';
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

// 快速测试
function quickTest() {
  // 生成随机的真实年龄（20-40岁）
  const mockRealAge = Math.floor(Math.random() * 21) + 20;
  
  // 生成随机的心理年龄（18-45岁）
  const mockMentalAge = Math.floor(Math.random() * 28) + 18;
  
  // 生成随机的维度得分（4-10分）
  const generateRandomScore = () => {
    return Math.round((Math.random() * 6 + 4) * 10) / 10;
  };
  
  const mockDimensionScores = {
    1: generateRandomScore(),
    2: generateRandomScore(),
    3: generateRandomScore(),
    4: generateRandomScore(),
    5: generateRandomScore(),
    6: generateRandomScore(),
    7: generateRandomScore(),
    8: generateRandomScore()
  };
  
  // 随机选择人格类型
  const personalityTypeKeys = Object.keys(PERSONALITY_TYPES);
  const randomKey = personalityTypeKeys[Math.floor(Math.random() * personalityTypeKeys.length)];
  const mockPersonalityType = PERSONALITY_TYPES[randomKey];
  
  // 关键词列表
  const allKeywords = ['稳重', '理性', '友善', '负责', '活力', '创新', '独立', '协作', '乐观', '谨慎', '勇敢', '智慧', '同理心', '创造力', '领导力', '洞察力', '耐心', '自信', '开放', '专注'];
  // 随机选择4个关键词
  const mockKeywords = [];
  while (mockKeywords.length < 4) {
    const keyword = allKeywords[Math.floor(Math.random() * allKeywords.length)];
    if (!mockKeywords.includes(keyword)) {
      mockKeywords.push(keyword);
    }
  }
  
  // 生成随机分析文本
  const coreTraitTexts = [
    `你的心理年龄是${mockMentalAge}岁，比实际年龄${mockMentalAge > mockRealAge ? '成熟' : '年轻'}${Math.abs(mockMentalAge - mockRealAge)}岁。作为一个${mockPersonalityType.name}，你${mockKeywords.join('、')}，具有独特的人生智慧。`,
    `你的心理年龄是${mockMentalAge}岁，${mockMentalAge > mockRealAge ? '比实际年龄更加成熟' : '保持着年轻的心态'}。你是一个${mockPersonalityType.name}，${mockKeywords.join('、')}，展现出独特的个人魅力。`
  ];
  
  const blindSpotTexts = [
    '你的内心世界丰富而深邃，有时候可能会过度思考。学会在理性和感性之间找到平衡，会让你更加自在。',
    '你有着强烈的自我要求，有时候可能会给自己过多的压力。记得给自己一些放松的空间，接受不完美的自己。',
    '你善于观察和分析，有时候可能会过度分析他人的行为。学会信任直觉，减少过度思考，会让你的人际关系更加自然。',
    '你充满活力和热情，有时候可能会过于冲动。学会在行动前思考，会让你更加从容。'
  ];
  
  const growthAdviceTexts = [
    '建议你在日常生活中多关注自己的内心需求，通过冥想、日记等方式，更深入地了解自己。',
    '勇敢地表达你的真实想法，不要总是在意他人的看法。你的独特性正是你的魅力所在。',
    '学会在给予和接受之间找到平衡，你的需求同样重要。',
    '尝试新的事物和挑战，不断拓展自己的舒适区，会让你获得更多的成长。'
  ];
  
  const socialTypeTexts = ['温暖陪伴者', '活力领导者', '理性思考者', '自由探索者', '和谐协调者'];
  
  const socialStyleTexts = [
    '你是一个天生的倾听者，在与人相处时总能表现出真诚的关心。',
    '你充满活力和热情，总能带动周围的氛围，是社交场合的焦点。',
    '你理性而沉稳，善于分析和解决问题，是朋友们的可靠顾问。',
    '你独立而好奇，喜欢探索新事物，总是能带给他人新鲜的视角。',
    '你善于调和矛盾，保持和谐，是团队中的黏合剂。'
  ];
  
  const bestMatchTexts = [
    '与你互补最好的是有强烈目标感的人，他们能鼓励你勇敢表达自己的想法。',
    '与你最匹配的是同样充满活力和创意的人，你们可以一起探索更多可能性。',
    '与你最合拍的是善于倾听和理解的人，你们可以深入交流思想。',
    '与你互补的是稳重而有耐心的人，他们能给你提供稳定的支持。'
  ];
  
  const relationshipReminderTexts = [
    '提醒：不要总是优先考虑他人，你的需求同样重要。学会温柔但坚定地表达界限。',
    '提醒：保持开放的心态，尊重他人的不同观点，会让你的人际关系更加和谐。',
    '提醒：在关系中保持独立的自我，不要过度依赖他人，这样会让关系更加健康。',
    '提醒：学会表达感激和欣赏，这会让你的关系更加稳固和幸福。'
  ];
  
  const mockAnalysisText = {
    coreTraits: coreTraitTexts[Math.floor(Math.random() * coreTraitTexts.length)],
    blindSpots: blindSpotTexts[Math.floor(Math.random() * blindSpotTexts.length)],
    growthAdvice: growthAdviceTexts[Math.floor(Math.random() * growthAdviceTexts.length)]
  };
  
  const mockMatchText = {
    socialType: socialTypeTexts[Math.floor(Math.random() * socialTypeTexts.length)],
    socialStyle: socialStyleTexts[Math.floor(Math.random() * socialStyleTexts.length)],
    bestMatch: bestMatchTexts[Math.floor(Math.random() * bestMatchTexts.length)],
    relationshipReminder: relationshipReminderTexts[Math.floor(Math.random() * relationshipReminderTexts.length)]
  };
  
  // 设置测试结果
  state.realAge = mockRealAge;
  state.testResult = {
    mentalAge: mockMentalAge,
    realAge: mockRealAge,
    dimensionScores: mockDimensionScores,
    personalityType: mockPersonalityType.name,
    archetype: mockPersonalityType.archetype,
    matchedCelebrity: mockPersonalityType.celebrity,
    keywords: mockKeywords,
    analysisText: mockAnalysisText,
    matchText: mockMatchText
  };
  
  // 跳转到结果页面
  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('resultScreen').classList.add('active');
  showResultScreen();
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

    const response = await fetch(`${API_BASE_URL}/submit-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: state.exchangeCode
      })
    });

    // 记录响应状态
    console.log('提交响应状态:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('后端错误:', errorData);
      throw new Error(errorData.error || `HTTP ${response.status}: 提交失败`);
    }

    const data = await response.json();
    console.log('提交成功:', data);

    // 前端计算测试结果
    const dimensionScores = calculateDimensionScores(state.answers);
    const mentalAge = calculateMentalAge(dimensionScores);
    const personalityTypeId = determinePerssonalityType(dimensionScores);
    const personalityType = PERSONALITY_TYPES[personalityTypeId];
    const keywords = generateKeywords(dimensionScores);
    const analysisText = generateAnalysisText(mentalAge, state.realAge, dimensionScores, personalityTypeId);
    const matchText = generateMatchText(personalityTypeId);

    // 构建测试结果
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
    low: '尝试每天进行10分钟的冥想，帮助稳定情绪。',
    medium: '学习情绪管理技巧，如深呼吸和积极思考。',
    good: '继续保持情绪稳定，尝试帮助他人管理情绪。',
    excellent: '考虑成为情绪支持的志愿者，分享你的经验。'
  },
  2: {
    low: '从小规模社交活动开始，逐渐扩大社交圈。',
    medium: '尝试主动与陌生人交流，提升社交技能。',
    good: '继续拓展社交网络，尝试不同类型的社交活动。',
    excellent: '考虑组织社交活动，成为社交的核心人物。'
  },
  3: {
    low: '每天花时间反思自己的行为和感受。',
    medium: '尝试写日记，记录自己的想法和情绪。',
    good: '继续深入了解自己，尝试新的自我探索方式。',
    excellent: '考虑帮助他人进行自我认知，分享你的经验。'
  },
  4: {
    low: '从小事做起，培养责任感和执行力。',
    medium: '制定计划并严格执行，提升责任感。',
    good: '继续保持高度责任感，尝试承担更多责任。',
    excellent: '考虑成为团队或项目的领导者。'
  },
  5: {
    low: '尝试学习新事物，培养好奇心。',
    medium: '探索不同领域的知识，保持学习热情。',
    good: '继续保持好奇心，尝试创新和探索。',
    excellent: '考虑从事需要创新和探索的工作。'
  },
  6: {
    low: '从小变化开始，逐渐适应变化。',
    medium: '尝试新的方法和思路，提升适应性。',
    good: '继续保持适应性，尝试面对更大的挑战。',
    excellent: '考虑从事需要快速适应的工作。'
  },
  7: {
    low: '尝试寻找生活中的积极面，培养乐观心态。',
    medium: '学习积极思考，提升乐观倾向。',
    good: '继续保持乐观，尝试影响周围的人。',
    excellent: '考虑成为积极心态的传播者。'
  },
  8: {
    low: '学习压力管理技巧，如深呼吸和运动。',
    medium: '尝试不同的压力缓解方法，提升压力应对能力。',
    good: '继续保持良好的压力应对能力，尝试帮助他人。',
    excellent: '考虑从事高压力环境下的工作。'
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
  // 转换为0-100的健康指数
  const healthIndex = Math.round((average / 10) * 100);
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
    const suggestion = ACTION_SUGGESTIONS[dim][level];
    suggestions.push({ dimension: dimInfo.name, emoji: dimInfo.emoji, suggestion });
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
      <h3 class="module-title">� 你的社交类型：${result.matchText.socialType || ''}</h3>

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
      <h3 class="module-title">� 个性化行动建议</h3>
      <div class="suggestions-list">
        ${(() => {
          const suggestions = generateActionSuggestions(result.dimensionScores);
          return suggestions.map(suggestion => `
            <div class="suggestion-item">
              <div class="suggestion-header">
                <span class="suggestion-emoji">${suggestion.emoji}</span>
                <span class="suggestion-dimension">${suggestion.dimension}</span>
              </div>
              <div class="suggestion-content">${suggestion.suggestion}</div>
            </div>
          `).join('');
        })()}
      </div>
    </div>
  `;

  document.getElementById('resultContent').innerHTML = html;

  // 延迟绘制雷达图，确保 DOM 已更新
  setTimeout(() => {
    drawRadarChart(result.dimensionScores);
  }, 100);
}

// 绘制雷达图
function drawRadarChart(scores) {
  try {
    const canvas = document.getElementById('radarChart');
    if (!canvas) {
      console.error('Canvas 元素不存在');
      return;
    }

    const ctx = canvas.getContext('2d');
    const labels = ['情感稳定性', '社交开放性', '自我认知度', '责任感', '好奇心', '适应性', '乐观倾向', '压力应对'];

    // 将 dimensionScores 对象转换为数组（按维度1-8的顺序）
    const data = [];
    for (let i = 1; i <= 8; i++) {
      const score = scores[i] || 0;
      data.push(parseFloat(score));
    }

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
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointBackgroundColor: '#FFB6C1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: false
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
  state = {
    questions: state.questions,
    answers: new Array(state.questions.length).fill(0),
    currentQuestion: 0,
    exchangeCode: null,
    realAge: null,
    testResult: null,
    isTransitioning: false
  };
  document.getElementById('resultScreen').classList.remove('active');
  document.getElementById('startScreen').classList.add('active');
}
