const API_BASE = '/api/admin';

let token = localStorage.getItem('adminToken');

const TEST_TYPE_NAMES = {
  'mental-age': '心理年龄',
  'mbti': 'MBTI',
  'sbti': 'SBTI',
  'nbti': 'NBTI恋爱',
  'disc': 'DISC',
  'avoidant': '回避型依恋',
  'city': '城市匹配'
};

const BAR_COLORS = ['#667eea', '#e74c3c', '#28a745', '#fd7e14', '#0ea5e9', '#6f42c1', '#20c997'];

function renderPagination(currentPage, totalPages, onClickCallback) {
  if (totalPages <= 1) return '';
  let html = '<div class="pagination">';
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="${onClickCallback}(${currentPage - 1})">上一页</button>`;
  if (start > 1) {
    html += `<button onclick="${onClickCallback}(1)">1</button>`;
    if (start > 2) html += '<span class="pagination-ellipsis">...</span>';
  }
  for (let i = start; i <= end; i++) {
    html += `<button class="${i === currentPage ? 'active' : ''}" onclick="${onClickCallback}(${i})">${i}</button>`;
  }
  if (end < totalPages) {
    if (end < totalPages - 1) html += '<span class="pagination-ellipsis">...</span>';
    html += `<button onclick="${onClickCallback}(${totalPages})">${totalPages}</button>`;
  }
  html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="${onClickCallback}(${currentPage + 1})">下一页</button>`;
  html += '</div>';
  return html;
}

function headers() {
  return { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers: { ...headers(), ...options.headers } });
  if (res.status === 401) { logout(); throw new Error('登录已过期'); }
  return res;
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');

  fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      token = data.token;
      localStorage.setItem('adminToken', token);
      showAdminScreen(username);
    } else {
      errorDiv.textContent = data.error || '登录失败';
      errorDiv.classList.add('show');
    }
  })
  .catch(() => {
    errorDiv.textContent = '网络错误';
    errorDiv.classList.add('show');
  });
}

function showAdminScreen(username) {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminScreen').classList.add('active');
  document.getElementById('adminName').textContent = username || '管理员';
  loadOverview();
  loadCodes();
}

function logout() {
  token = null;
  localStorage.removeItem('adminToken');
  document.getElementById('adminScreen').classList.remove('active');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
}

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');
  event.target.classList.add('active');

  if (tabName === 'overview') loadOverview();
  else if (tabName === 'codes') loadCodes();
  else if (tabName === 'results') loadResults();
  else if (tabName === 'monthly') loadMonthlyCards();
  else if (tabName === 'config') loadTestConfigs();
}

async function loadOverview() {
  try {
    const res = await apiFetch('/stats/overview');
    const data = await res.json();

    document.getElementById('statTotal').textContent = data.totalResults || 0;
    document.getElementById('statToday').textContent = data.todayNew || 0;
    document.getElementById('statCodes').textContent = data.totalCodes || 0;
    document.getElementById('statUsage').textContent = (data.codeUsageRate || 0) + '%';
    document.getElementById('statUsed').textContent = data.usedCodes || 0;
    document.getElementById('statUnused').textContent = (data.totalCodes || 0) - (data.usedCodes || 0);
    document.getElementById('statMonthly').textContent = data.monthlyCards || 0;
    document.getElementById('statMonthlyActive').textContent = data.activeMonthlyCards || 0;

    const chartEl = document.getElementById('testTypeChart');
    const byType = data.byTestType || [];
    const maxCount = byType.length > 0 ? byType[0].count : 1;

    chartEl.innerHTML = byType.map((item, i) => {
      const pct = maxCount > 0 ? Math.round((item.count / maxCount) * 100) : 0;
      const name = TEST_TYPE_NAMES[item.testType] || item.testType;
      const color = BAR_COLORS[i % BAR_COLORS.length];
      return `<div class="bar-row">
        <div class="bar-label">${name}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${color}">${item.count}</div></div>
        <div class="bar-count">${item.count}</div>
      </div>`;
    }).join('');

    if (byType.length === 0) {
      chartEl.innerHTML = '<div class="loading">暂无数据</div>';
    }
  } catch (e) {
    console.error('加载概览失败:', e);
  }
}

async function generateCodes() {
  const count = parseInt(document.getElementById('codeCount').value);
  if (!count || count < 1 || count > 100) { alert('数量必须在1-100之间'); return; }

  try {
    const res = await apiFetch('/generate-codes', {
      method: 'POST',
      body: JSON.stringify({ count })
    });
    const data = await res.json();

    if (data.codes) {
      document.getElementById('codesTextarea').value = data.codes.join('\n');
      document.getElementById('generatedCodes').style.display = 'block';
      const successEl = document.getElementById('codeSuccess');
      successEl.textContent = `成功生成 ${data.count} 个兑换码`;
      successEl.classList.add('show');
      setTimeout(() => successEl.classList.remove('show'), 3000);
      loadCodes();
    } else {
      alert(data.error || '生成失败');
    }
  } catch (e) {
    alert('生成失败: ' + e.message);
  }
}

function copyToClipboard() {
  const textarea = document.getElementById('codesTextarea');
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => alert('已复制到剪贴板'));
}

let codesPage = 1;

async function loadCodes(page) {
  if (page) codesPage = page;
  const container = document.getElementById('codesContainer');
  container.innerHTML = '<div class="loading">加载中...</div>';

  try {
    const res = await apiFetch(`/codes?page=${codesPage}&limit=20`);
    const data = await res.json();

    let html = '<table><thead><tr><th>兑换码</th><th>类型</th><th>状态</th><th>使用次数</th><th>关联测试</th><th>创建时间</th></tr></thead><tbody>';

    (data.codes || []).forEach(code => {
      const isMonthly = code.codeType === 'MONTHLY_CARD';
      let status = '';
      if (isMonthly) {
        const expired = code.expiresAt && new Date() > new Date(code.expiresAt);
        status = expired ? '<span class="status-badge status-expired">已过期</span>' : '<span class="status-badge status-active">有效</span>';
      } else {
        status = code.used ? '<span class="status-badge status-used">已使用</span>' : '<span class="status-badge status-unused">未使用</span>';
      }

      const testInfo = (code.testResults || []).map(r => TEST_TYPE_NAMES[r.testType] || r.testType).join(', ') || '-';

      html += `<tr>
        <td style="font-family:monospace;font-weight:700;">${code.code}</td>
        <td>${isMonthly ? '月卡' : '单次'}</td>
        <td>${status}</td>
        <td>${code.usedCount}</td>
        <td>${testInfo}</td>
        <td>${new Date(code.createdAt).toLocaleString('zh-CN')}</td>
      </tr>`;
    });

    html += '</tbody></table>';

    const totalPages = data.pages || 1;
    html += renderPagination(codesPage, totalPages, 'loadCodes');
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败</div>';
  }
}

function exportCodes() {
  window.open(`${API_BASE}/export?token=${token}`, '_blank');
}

let resultsPage = 1;

async function loadResults(page) {
  if (page) resultsPage = page;
  const testType = document.getElementById('filterTestType').value;
  const startDate = document.getElementById('filterStartDate').value;
  const endDate = document.getElementById('filterEndDate').value;
  const container = document.getElementById('resultsContainer');
  container.innerHTML = '<div class="loading">加载中...</div>';

  try {
    let url = `/results?page=${resultsPage}&limit=20&testType=${testType}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    const res = await apiFetch(url);
    const data = await res.json();

    let html = '<table><thead><tr><th>ID</th><th>测试类型</th><th>核心结果</th><th>兑换码</th><th>时间</th><th>操作</th></tr></thead><tbody>';

    (data.results || []).forEach(r => {
      const rd = r.resultData || {};
      let summary = '-';
      if (r.testType === 'mental-age') summary = `心理年龄 ${rd.mentalAge || '-'}`;
      else if (r.testType === 'mbti') summary = rd.mbtiType || '-';
      else if (r.testType === 'sbti') summary = `${rd.sbtiType || '-'} (${rd.sbtiName || '-'})`;
      else if (r.testType === 'nbti') summary = `${rd.nbtiType || '-'} (${rd.nbtiName || '-'})`;
      else if (r.testType === 'disc') summary = `${rd.primaryType || '-'}型`;
      else if (r.testType === 'avoidant') summary = `${rd.attachmentType || '-'} (${rd.score || '-'}分)`;
      else if (r.testType === 'city') summary = `${(rd.topCity || {}).name || '-'} (${(rd.topCity || {}).matchPercent || '-'}%)`;
      else summary = JSON.stringify(rd).slice(0, 40);

      const typeName = TEST_TYPE_NAMES[r.testType] || r.testType;
      const codeDisplay = r.exchangeCode ? r.exchangeCode.code : '-';

      html += `<tr>
        <td>${r.id}</td>
        <td>${typeName}</td>
        <td>${summary}</td>
        <td style="font-family:monospace;">${codeDisplay}</td>
        <td>${new Date(r.createdAt).toLocaleString('zh-CN')}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="viewResult(${r.id})">查看</button>
          <button class="btn btn-danger btn-sm" onclick="deleteResult(${r.id})">删除</button>
        </td>
      </tr>`;
    });

    html += '</tbody></table>';

    if ((data.results || []).length === 0) {
      html = '<div class="loading">暂无数据</div>';
    }

    const totalPages = data.pages || 1;
    html += renderPagination(resultsPage, totalPages, 'loadResults');
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败</div>';
  }
}

async function viewResult(id) {
  try {
    const res = await apiFetch(`/results/${id}`);
    const data = await res.json();

    let html = '';

    html += `<div class="detail-item"><div class="detail-key">测试类型</div><div class="detail-value">${TEST_TYPE_NAMES[data.testType] || data.testType}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">创建时间</div><div class="detail-value">${new Date(data.createdAt).toLocaleString('zh-CN')}</div></div>`;
    if (data.exchangeCode) {
      html += `<div class="detail-item"><div class="detail-key">兑换码</div><div class="detail-value">${data.exchangeCode.code} (${data.exchangeCode.codeType === 'MONTHLY_CARD' ? '月卡' : '单次'})</div></div>`;
    }

    const rd = data.resultData || {};
    Object.entries(rd).forEach(([key, value]) => {
      const display = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      html += `<div class="detail-item"><div class="detail-key">${key}</div><div class="detail-value"><pre style="margin:0;white-space:pre-wrap;font-size:13px;">${display}</pre></div></div>`;
    });

    if (data.rawAnswers) {
      html += `<div class="detail-item"><div class="detail-key">原始答题</div><div class="detail-value"><pre style="margin:0;white-space:pre-wrap;font-size:12px;color:#999;">${JSON.stringify(data.rawAnswers, null, 2)}</pre></div></div>`;
    }

    document.getElementById('resultDetailContent').innerHTML = html;
    document.getElementById('resultDetailModal').classList.add('active');
  } catch (e) {
    alert('加载详情失败: ' + e.message);
  }
}

function closeModal() {
  document.getElementById('resultDetailModal').classList.remove('active');
}

async function deleteResult(id) {
  if (!confirm('确定删除此结果？')) return;
  try {
    await apiFetch(`/results/${id}`, { method: 'DELETE' });
    loadResults();
  } catch (e) {
    alert('删除失败: ' + e.message);
  }
}

function exportResults() {
  const testType = document.getElementById('filterTestType').value;
  const startDate = document.getElementById('filterStartDate').value;
  const endDate = document.getElementById('filterEndDate').value;
  let url = `${API_BASE}/results-export?testType=${testType}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  window.open(url, '_blank');
}

async function createMonthlyCards() {
  const count = parseInt(document.getElementById('monthlyCount').value);
  const validDays = parseInt(document.getElementById('monthlyDays').value) || 30;
  const useLimitVal = document.getElementById('monthlyLimit').value;
  const useLimit = useLimitVal ? parseInt(useLimitVal) : null;
  const remark = document.getElementById('monthlyRemark').value || null;

  if (!count || count < 1 || count > 100) { alert('数量必须在1-100之间'); return; }

  try {
    const res = await apiFetch('/create-monthly-cards', {
      method: 'POST',
      body: JSON.stringify({ count, validDays, useLimit, remark })
    });
    const data = await res.json();

    if (data.codes) {
      document.getElementById('monthlyCodesTextarea').value = data.codes.join('\n');
      document.getElementById('generatedMonthlyCodes').style.display = 'block';
      const successEl = document.getElementById('monthlySuccess');
      successEl.textContent = `成功创建 ${data.count} 张月卡，有效期至 ${new Date(data.expiresAt).toLocaleString('zh-CN')}`;
      successEl.classList.add('show');
      setTimeout(() => successEl.classList.remove('show'), 5000);
      loadMonthlyCards();
    } else {
      alert(data.error || '创建失败');
    }
  } catch (e) {
    alert('创建失败: ' + e.message);
  }
}

function copyMonthlyToClipboard() {
  const textarea = document.getElementById('monthlyCodesTextarea');
  textarea.select();
  navigator.clipboard.writeText(textarea.value).then(() => alert('已复制到剪贴板'));
}

let monthlyPage = 1;

async function loadMonthlyCards(page) {
  if (page) monthlyPage = page;
  const container = document.getElementById('monthlyCardsContainer');
  container.innerHTML = '<div class="loading">加载中...</div>';

  try {
    const res = await apiFetch(`/monthly-cards?page=${monthlyPage}&limit=20`);
    const data = await res.json();

    let html = '<table><thead><tr><th>卡号</th><th>有效期至</th><th>使用次数</th><th>限制</th><th>状态</th><th>关联测试</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';

    (data.cards || []).forEach(card => {
      const expired = card.expiresAt && new Date() > new Date(card.expiresAt);
      const status = expired ? '<span class="status-badge status-expired">已过期</span>' : '<span class="status-badge status-active">有效</span>';
      const limitText = card.useLimit ? `${card.usedCount}/${card.useLimit}` : `${card.usedCount}/∞`;
      const testInfo = (card.testResults || []).map(r => TEST_TYPE_NAMES[r.testType] || r.testType).join(', ') || '-';
      const testCount = (card.testResults || []).length;

      html += `<tr>
        <td style="font-family:monospace;font-weight:700;">${card.code}</td>
        <td>${card.expiresAt ? new Date(card.expiresAt).toLocaleDateString('zh-CN') : '永久'}</td>
        <td>${limitText}</td>
        <td>${card.useLimit ? card.useLimit + '次' : '不限'}</td>
        <td>${status}</td>
        <td>${testInfo}</td>
        <td>${new Date(card.createdAt).toLocaleString('zh-CN')}</td>
        <td>${testCount > 0 ? `<button class="btn-small" onclick="toggleMonthlyResults(${card.id})">查看结果(${testCount})</button>` : '-'}</td>
      </tr>
      <tr id="monthly-results-${card.id}" class="monthly-results-row" style="display:none;">
        <td colspan="8" style="padding:0;background:#f8f9fa;">
          <div id="monthly-results-content-${card.id}" style="padding:10px;"></div>
        </td>
      </tr>`;
    });

    html += '</tbody></table>';

    if ((data.cards || []).length === 0) {
      html = '<div class="loading">暂无月卡</div>';
    }

    const totalPages = data.pages || 1;
    html += renderPagination(monthlyPage, totalPages, 'loadMonthlyCards');
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败</div>';
  }
}

async function toggleMonthlyResults(cardId) {
  const row = document.getElementById(`monthly-results-${cardId}`);
  const content = document.getElementById(`monthly-results-content-${cardId}`);
  
  if (row.style.display === 'none') {
    row.style.display = 'table-row';
    if (!content.innerHTML) {
      content.innerHTML = '<div class="loading">加载中...</div>';
      try {
        const res = await apiFetch(`/monthly-cards/${cardId}/results`);
        const results = await res.json();
        
        if (results.length === 0) {
          content.innerHTML = '<div style="color:#999;">暂无测试结果</div>';
        } else {
          let html = '<table style="width:100%;font-size:13px;"><thead><tr><th>测试类型</th><th>测试时间</th><th>结果摘要</th><th>操作</th></tr></thead><tbody>';
          results.forEach(r => {
            const summary = getTestResultSummary(r);
            html += `<tr>
              <td>${TEST_TYPE_NAMES[r.testType] || r.testType}</td>
              <td>${new Date(r.createdAt).toLocaleString('zh-CN')}</td>
              <td>${summary}</td>
              <td><button class="btn-small" onclick="viewResult(${r.id})">详情</button></td>
            </tr>`;
          });
          html += '</tbody></table>';
          content.innerHTML = html;
        }
      } catch (e) {
        content.innerHTML = '<div style="color:red;">加载失败</div>';
      }
    }
  } else {
    row.style.display = 'none';
  }
}

function getTestResultSummary(result) {
  const rd = result.resultData || {};
  if (result.testType === 'mbti' || result.testType === 'sbti' || result.testType === 'nbti') {
    return rd.type || rd.mbtiType || '-';
  } else if (result.testType === 'mental-age') {
    return `心理年龄: ${rd.mentalAge || '-'}`;
  } else if (result.testType === 'city') {
    return `匹配城市: ${rd.matchedCity || '-'}`;
  } else if (result.testType === 'avoidant') {
    return `依恋类型: ${rd.attachmentStyle || '-'}`;
  } else if (result.testType === 'disc') {
    return `DISC类型: ${rd.discType || '-'}`;
  }
  return '-';
}

async function loadTestConfigs() {
  const container = document.getElementById('testConfigContainer');
  container.innerHTML = '<div class="loading">加载中...</div>';

  try {
    let configs = await apiFetch('/test-configs').then(r => r.json());

    if (configs.length === 0) {
      const seedResult = await apiFetch('/test-configs/seed', { method: 'POST' }).then(r => r.json());
      if (seedResult.seeded > 0) {
        configs = await apiFetch('/test-configs').then(r => r.json());
      }
    }

    let html = '<table><thead><tr><th>ID</th><th>测试名称</th><th>TypeKey</th><th>页面文件</th><th>结果数</th><th>状态</th><th>排序</th><th>操作</th></tr></thead><tbody>';

    configs.forEach(cfg => {
      const statusBadge = cfg.enabled
        ? '<span class="status-badge status-unused">✅ 启用</span>'
        : '<span class="status-badge status-used">❌ 禁用</span>';

      html += `<tr>
        <td>${cfg.id}</td>
        <td style="font-weight:600;">${cfg.name}</td>
        <td style="font-family:monospace;color:#667eea;">${cfg.typeKey}</td>
        <td style="font-family:monospace;font-size:12px;">${cfg.page || '-'}</td>
        <td>${cfg.resultCount}</td>
        <td>${statusBadge}</td>
        <td>${cfg.order}</td>
        <td>
          <button class="btn btn-sm ${cfg.enabled ? 'btn-secondary' : 'btn-success'}" onclick="toggleTestConfig(${cfg.id}, ${!cfg.enabled})">${cfg.enabled ? '禁用' : '启用'}</button>
          <button class="btn btn-primary btn-sm" onclick="editTestConfig(${cfg.id}, '${cfg.name}', '${cfg.page || ''}', ${cfg.order})">编辑</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTestConfigItem(${cfg.id}, '${cfg.name}')">删除</button>
        </td>
      </tr>`;
    });

    html += '</tbody></table>';

    if (configs.length === 0) {
      html = '<div class="loading">暂无测试配置</div>';
    }

    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败: ' + e.message + '</div>';
  }
}

async function toggleTestConfig(id, enabled) {
  try {
    await apiFetch(`/test-configs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ enabled })
    });
    loadTestConfigs();
  } catch (e) {
    alert('操作失败: ' + e.message);
  }
}

function editTestConfig(id, currentName, currentPage, currentOrder) {
  document.getElementById('editTestId').value = id;
  document.getElementById('editTestName').value = currentName;
  document.getElementById('editTestPage').value = currentPage || '';
  document.getElementById('editTestOrder').value = currentOrder;
  document.getElementById('editTestConfigModal').classList.add('active');
}

function closeEditModal() {
  document.getElementById('editTestConfigModal').classList.remove('active');
}

async function saveEditTestConfig() {
  const id = parseInt(document.getElementById('editTestId').value);
  const name = document.getElementById('editTestName').value.trim();
  const page = document.getElementById('editTestPage').value.trim();
  const order = parseInt(document.getElementById('editTestOrder').value) || 0;

  if (!name) {
    alert('测试名称不能为空');
    return;
  }

  const data = { name, page: page || null, order };

  try {
    await apiFetch(`/test-configs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    closeEditModal();
    loadTestConfigs();
  } catch (e) {
    alert('更新失败: ' + e.message);
  }
}

async function deleteTestConfigItem(id, name) {
  if (!confirm(`确定删除测试「${name}」的配置？此操作不会删除已有的测试结果数据。`)) return;
  try {
    await apiFetch(`/test-configs/${id}`, { method: 'DELETE' });
    loadTestConfigs();
  } catch (e) {
    alert('删除失败: ' + e.message);
  }
}

async function addTestConfig() {
  const name = document.getElementById('newTestName').value.trim();
  const typeKey = document.getElementById('newTestTypeKey').value.trim();
  const page = document.getElementById('newTestPage').value.trim();
  const order = parseInt(document.getElementById('newTestOrder').value) || 0;

  if (!name || !typeKey) {
    alert('测试名称和TypeKey不能为空');
    return;
  }

  if (!/^[a-z][a-z0-9-]*$/.test(typeKey)) {
    alert('TypeKey只能包含小写字母、数字和连字符，且以字母开头');
    return;
  }

  try {
    await apiFetch('/test-configs', {
      method: 'POST',
      body: JSON.stringify({ typeKey, name, page: page || null, order })
    });

    const successEl = document.getElementById('addTestSuccess');
    successEl.textContent = `测试「${name}」(${typeKey})添加成功！`;
    successEl.classList.add('show');
    setTimeout(() => successEl.classList.remove('show'), 3000);

    document.getElementById('newTestName').value = '';
    document.getElementById('newTestTypeKey').value = '';
    document.getElementById('newTestPage').value = '';
    document.getElementById('newTestOrder').value = '0';

    loadTestConfigs();
  } catch (e) {
    alert('添加失败: ' + e.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      showAdminScreen(payload.username);
    } catch (e) {
      logout();
    }
  }
});
