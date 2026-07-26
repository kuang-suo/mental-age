/**
 * 测试页面生成器
 * 
 * 使用方法：
 * node generate-test.js
 * 
 * 然后按照提示输入测试信息
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 颜色主题预设
const COLOR_PRESETS = {
  pink: {
    primary: '#FF69B4',
    secondary: '#FFE4E1',
    accent: '#FFB6C1',
    lightBg: '#FFF8F0',
    gradientBg: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4E1 100%)',
    gradientPrimary: 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
    gradientSecondary: 'linear-gradient(135deg, #FFF8F0, #FFE4E1)'
  },
  purple: {
    primary: '#7C3AED',
    secondary: '#F0E6FF',
    accent: '#FFE9F0',
    lightBg: '#FFFDF7',
    gradientBg: 'linear-gradient(145deg, #F9F6FF 0%, #EFE6FF 100%)',
    gradientPrimary: 'linear-gradient(135deg, #9333EA, #7C3AED)',
    gradientSecondary: 'linear-gradient(135deg, #F0E6FF, #E9DFFF)'
  },
  blue: {
    primary: '#0EA5E9',
    secondary: '#E0F2FE',
    accent: '#7DD3FC',
    lightBg: '#F0F9FF',
    gradientBg: 'linear-gradient(145deg, #F0F9FF 0%, #E0F2FE 100%)',
    gradientPrimary: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    gradientSecondary: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)'
  },
  gold: {
    primary: '#D4A017',
    secondary: '#FFF3D6',
    accent: '#F5C542',
    lightBg: '#FFFDF5',
    gradientBg: 'linear-gradient(145deg, #FFFCF0 0%, #FFF3D6 100%)',
    gradientPrimary: 'linear-gradient(135deg, #E8B830, #D4A017)',
    gradientSecondary: 'linear-gradient(135deg, #FFF3D6, #FFE9B0)'
  },
  green: {
    primary: '#10B981',
    secondary: '#D1FAE5',
    accent: '#6EE7B7',
    lightBg: '#ECFDF5',
    gradientBg: 'linear-gradient(145deg, #ECFDF5 0%, #D1FAE5 100%)',
    gradientPrimary: 'linear-gradient(135deg, #34D399, #10B981)',
    gradientSecondary: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)'
  },
  red: {
    primary: '#E91E63',
    secondary: '#FCE4EC',
    accent: '#F48FB1',
    lightBg: '#FFF5F8',
    gradientBg: 'linear-gradient(145deg, #FFF5F8 0%, #FCE4EC 100%)',
    gradientPrimary: 'linear-gradient(135deg, #E91E63, #C2185B)',
    gradientSecondary: 'linear-gradient(135deg, #FCE4EC, #F8BBD0)'
  }
};

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  console.log('\n🚀 测试页面生成器\n');
  console.log('请输入以下信息：\n');

  const testId = await question('测试ID (英文，用于文件名，如 mytest): ');
  const testName = await question('测试名称 (如：我的测试): ');
  const testSubtitle = await question('测试副标题 (如：发现真实的自己): ');
  const testIcon = await question('测试图标 (如：🎯): ');
  const questionCount = await question('题目数量 (如：20): ');
  
  console.log('\n可选颜色主题：');
  console.log('  pink, purple, blue, gold, green, red\n');
  const colorTheme = await question('颜色主题 (默认 pink): ') || 'pink';
  
  const features = await question('功能特点 (用逗号分隔，如：性格分析,职业建议): ');
  
  const category = await question('分类 (personality/love/attachment/career/city/ai): ');

  rl.close();

  // 获取颜色配置
  const colors = COLOR_PRESETS[colorTheme] || COLOR_PRESETS.pink;

  // 生成功能列表 HTML
  const featureList = features.split(',').map(f => 
    `<li>✨ ${f.trim()}</li>`
  ).join('\n            ');

  // 读取模板
  const templateDir = path.join(__dirname, 'templates');
  let htmlTemplate = fs.readFileSync(path.join(templateDir, 'test-template.html'), 'utf8');
  let jsTemplate = fs.readFileSync(path.join(templateDir, 'js-template.js'), 'utf8');

  // 替换占位符
  const replacements = {
    '{{TEST_NAME}}': testName,
    '{{TEST_SUBTITLE}}': testSubtitle,
    '{{TEST_ICON}}': testIcon,
    '{{TEST_CLASS}}': `${testId}-test`,
    '{{QUESTION_COUNT}}': questionCount,
    '{{FEATURE_LIST}}': featureList,
    '{{JS_FILE}}': `${testId}.js`,
    '{{QUESTIONS_FILE}}': `${testId}-questions.json`,
    '{{PRIMARY_COLOR}}': colors.primary,
    '{{SECONDARY_COLOR}}': colors.secondary,
    '{{ACCENT_COLOR}}': colors.accent,
    '{{LIGHT_BG}}': colors.lightBg,
    '{{GRADIENT_BG}}': colors.gradientBg,
    '{{GRADIENT_PRIMARY}}': colors.gradientPrimary,
    '{{GRADIENT_SECONDARY}}': colors.gradientSecondary
  };

  Object.entries(replacements).forEach(([key, value]) => {
    htmlTemplate = htmlTemplate.split(key).join(value);
    jsTemplate = jsTemplate.split(key).join(value);
  });

  // 写入文件
  const frontendDir = path.join(__dirname, 'frontend');
  const jsDir = path.join(frontendDir, 'js');
  const dataDir = path.join(frontendDir, 'data');

  fs.writeFileSync(path.join(frontendDir, `${testId}.html`), htmlTemplate);
  fs.writeFileSync(path.join(jsDir, `${testId}.js`), jsTemplate);
  
  // 创建示例题目文件
  const sampleQuestions = Array(parseInt(questionCount)).fill(null).map((_, i) => ({
    question: `问题 ${i + 1}`,
    options: ['选项A', '选项B', '选项C', '选项D']
  }));
  fs.writeFileSync(path.join(dataDir, `${testId}-questions.json`), JSON.stringify(sampleQuestions, null, 2));

  console.log('\n✅ 生成完成！\n');
  console.log('生成的文件：');
  console.log(`  📄 frontend/${testId}.html`);
  console.log(`  📄 frontend/js/${testId}.js`);
  console.log(`  📄 frontend/data/${testId}-questions.json`);
  console.log('\n下一步：');
  console.log(`  1. 编辑 data/${testId}-questions.json 添加实际题目`);
  console.log(`  2. 编辑 js/${testId}.js 实现计算逻辑和结果展示`);
  console.log(`  3. 在 home.html 中添加测试卡片入口`);
  console.log('\n');
}

main().catch(console.error);
