// 8个维度的定义
export const DIMENSIONS = {
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
export const PERSONALITY_TYPES = {
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
export function calculateDimensionScores(answers) {
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
    // 百分制计算：(sum / (题目数 * 5)) * 100
    const dimensionMaxScore = questionIndices.length * 5;
    scores[dim] = Math.round((sum / dimensionMaxScore) * 100 * 10) / 10;
  }
  return scores;
}

/**
 * 计算心理年龄
 * @param {Object} dimensionScores - 8个维度的得分
 * @returns {number} 心理年龄（18-60）
 */
export function calculateMentalAge(dimensionScores) {
  const totalScore = Object.values(dimensionScores).reduce((a, b) => a + b, 0);
  const avgScore = totalScore / 8;
  // 线性映射：0-100 -> 18-60
  const mentalAge = Math.round(18 + (avgScore / 100) * 42);
  return Math.max(18, Math.min(60, mentalAge));
}

/**
 * 判定人格类型
 * @param {Object} dimensionScores - 8个维度的得分
 * @returns {number} 人格类型ID（1-8）
 */
export function determinePerssonalityType(dimensionScores) {
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
export function generateKeywords(dimensionScores) {
  const sorted = Object.entries(dimensionScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const keywords = [];
  for (const [dim, score] of sorted) {
    if (score >= 50) {  // 在0-100范围内，50分以上算较高
      const pool = KEYWORDS_POOL[dim];
      keywords.push(pool[Math.floor(Math.random() * pool.length)]);
    }
  }

  return keywords.slice(0, 5);
}

/**
 * 生成个性化分析文字
 * @param {number} mentalAge - 心理年龄
 * @param {number} realAge - 实际年龄
 * @param {Object} dimensionScores - 8个维度的得分
 * @param {number} typeId - 人格类型ID
 * @returns {string} 分析文字
 */
/**
 * 生成深度自我分析（结构化）
 * @param {number} mentalAge - 心理年龄
 * @param {number} realAge - 实际年龄
 * @param {Object} dimensionScores - 8个维度的得分
 * @param {number} typeId - 人格类型ID
 * @returns {Object} 分析数据对象
 */
export function generateAnalysisText(mentalAge, realAge, dimensionScores, typeId) {
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
export function generateMatchText(typeId) {
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
