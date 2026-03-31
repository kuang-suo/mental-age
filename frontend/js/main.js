// API 基础 URL
//const API_BASE_URL = 'http://localhost:3001/api';
const API_BASE_URL = '/api';
//const API_BASE_URL = 'https://mental-age-production.up.railway.app/api';
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
document.addEventListener('DOMContentLoaded', async () => {
  await loadQuestions();
});

// 加载题目
async function loadQuestions() {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`);
    const questions = await response.json();
    state.questions = questions;
    document.getElementById('totalQuestions').textContent = questions.length;
    state.answers = new Array(questions.length).fill(0);
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

    if (!state.exchangeCode || state.exchangeCode.length !== 8) {
      throw new Error('兑换码错误: ' + state.exchangeCode);
    }

    if (!state.realAge || state.realAge < 18 || state.realAge > 100) {
      throw new Error('年龄错误: ' + state.realAge);
    }

    // 显示加载状态
    document.getElementById('testScreen').classList.add('loading');
    document.getElementById('submitTestBtn').disabled = true;
    document.getElementById('submitTestBtn').textContent = '提交中...';

    const response = await fetch(`${API_BASE_URL}/submit-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: state.exchangeCode,
        answers: state.answers,
        realAge: state.realAge
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

    if (!data.result) {
      throw new Error('后端返回数据错误: 缺少result字段');
    }

    state.testResult = data.result;
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
      const percentage = parseFloat(score);  // score 已经是 0-100 的百分比
      return `
        <div class="dimension-bar">
          <div class="dimension-label">${dimInfo.emoji} ${dimInfo.name}</div>
          <div class="progress-container">
            <div class="progress-bar-fill" style="width: ${percentage}%"></div>
          </div>
          <div class="dimension-score">${score.toFixed(1)}</div>
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

    <!-- 模块二: 关键词标签 -->
    <div class="result-module module-keywords">
      <h3 class="module-title">✨ 核心特质</h3>
      <div class="keywords-container">
        ${keywordTags}
      </div>
    </div>

    <!-- 模块三: 雷达图 -->
    <div class="result-module module-radar">
      <h3 class="module-title">📊 能力雷达</h3>
      <div class="radar-container">
        <canvas id="radarChart" width="400" height="400"></canvas>
      </div>
    </div>

    <!-- 模块四: 维度详情 -->
    <div class="result-module module-dimensions">
      <h3 class="module-title">⚙️ 维度分析</h3>
      <div class="dimensions-list">
        ${dimensionBars}
      </div>
    </div>

    <!-- 模块五: 深度自我分析 -->
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

    <!-- 模块六: 社交与匹配 -->
    <div class="result-module module-matching">
      <h3 class="module-title">🌈 你的社交类型：${result.matchText.socialType || ''}</h3>

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
              // 显示 5 个圆圈（20, 40, 60, 80, 100）
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
