const API_BASE = '/api/admin';

let token = localStorage.getItem('adminToken');

const TEST_TYPE_NAMES = {
  'mental-age': '心理年龄',
  'mbti': 'MBTI',
  'sbti': 'SBTI',
  'nbti': 'NBTI恋爱',
  'disc': 'DISC',
  'avoidant': '回避型依恋',
  'city': '城市匹配',
  'anxious': '焦虑型依恋',
  'love-depth': '恋爱深度解析',
  'secret-crush': '暗恋程度测试',
  'lonely': '孤独程度测试',
  'city-report': '城市报告',
  'image-analysis': '个人形象分析',
  'image-analysis-1': '综合形象分析',
  'image-analysis-2': '穿搭分析',
  'image-analysis-3': '妆容分析',
  'image-analysis-4': '发型分析',
  'image-analysis-5': '色彩分析',
  'image-analysis-6': '气质风格定位',
  'image-analysis-7': '五官风格拆解',
  'image-analysis-8': '显瘦显脸小',
  'image-analysis-9': '拍照表现力',
  'image-analysis-10': '个人品牌感',
  'image-analysis-11': '体型比例分析',
  'image-analysis-12': '发色分析',
  'id-photo': '个人证件照生成',
  'id-photo-1': '高智感职业证件照',
  'id-photo-2': '蓝色背景2寸证件照',
  'id-photo-3': '韩式风格证件照',
  'id-photo-layout': '证件照排版',
  'id-photo-compress': '证件照压缩'
};

const IMAGE_ANALYSIS_NAMES = {
  '1': '综合形象分析',
  '2': '穿搭分析',
  '3': '妆容分析',
  '4': '发型分析',
  '5': '色彩分析',
  '6': '气质风格定位',
  '7': '五官风格拆解',
  '8': '显瘦显脸小',
  '9': '拍照表现力',
  '10': '个人品牌感',
  '11': '体型比例分析',
  '12': '发色分析'
};

const ID_PHOTO_NAMES = {
  '1': '高智感职业证件照',
  '2': '蓝色背景2寸证件照',
  '3': '韩式风格证件照'
};

const BAR_COLORS = ['#667eea', '#e74c3c', '#28a745', '#fd7e14', '#0ea5e9', '#6f42c1', '#20c997'];

const ALL_TEST_TYPES = [
  'mental-age', 'mbti', 'sbti', 'nbti', 'disc', 'avoidant', 'city',
  'anxious', 'love-depth', 'secret-crush', 'lonely', 'city-report',
  'image-analysis', 'id-photo', 'id-photo-compress'
];

function getSelectedTestTypes(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return [];
  const checkboxes = container.querySelectorAll('input[type="checkbox"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

function formatAllowedTestTypes(allowedTestTypes) {
  if (!allowedTestTypes || !Array.isArray(allowedTestTypes) || allowedTestTypes.length === 0) {
    return '<span style="color:#999;">全部</span>';
  }
  // 检查是否选择了所有测试类型
  const sortedSelected = [...allowedTestTypes].sort();
  const sortedAll = [...ALL_TEST_TYPES].sort();
  const isAllSelected = sortedSelected.length === sortedAll.length &&
    sortedSelected.every((val, idx) => val === sortedAll[idx]);

  if (isAllSelected) {
    return '<span style="color:#999;">全部</span>';
  }

  return allowedTestTypes.map(t => TEST_TYPE_NAMES[t] || t).join(', ');
}

let testGroupsCache = [];

async function loadGroupSelects() {
  try {
    const res = await apiFetch('/test-groups');
    testGroupsCache = await res.json();

    const codeSelect = document.getElementById('codeGroupSelect');
    const monthlySelect = document.getElementById('monthlyGroupSelect');
    const filterSelect = document.getElementById('filterCodeGroup');

    const options = '<option value="">不选择分组</option>' + 
      testGroupsCache.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
    
    const filterOptions = '<option value="">全部分组</option>' +
      '<option value="none">未分组</option>' +
      testGroupsCache.map(g => `<option value="${g.id}">${g.name}</option>`).join('');

    if (codeSelect) codeSelect.innerHTML = options;
    if (monthlySelect) monthlySelect.innerHTML = options;
    if (filterSelect) filterSelect.innerHTML = filterOptions;
  } catch (e) {
    console.error('加载分组列表失败:', e);
  }
}

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
  if (!res.ok) {
    let msg = `请求失败(${res.status})`;
    try { const data = await res.json(); msg = data.error || msg; } catch {}
    throw new Error(msg);
  }
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
  loadGroupSelects();
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

function toggleSubmenu(el) {
  el.classList.toggle('open');
  const submenu = el.nextElementSibling;
  if (submenu && submenu.classList.contains('sidebar-submenu')) {
    submenu.classList.toggle('open');
  }
}

function switchTab(tabName) {
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById(`tab-${tabName}`).classList.add('active');

  const clickedItem = event.target.closest('.sidebar-item');
  if (clickedItem && !clickedItem.classList.contains('has-submenu')) {
    clickedItem.classList.add('active');
  }

  if (tabName === 'overview') loadOverview();
  else if (tabName === 'codes') loadCodes();
  else if (tabName === 'results') loadResults();
  else if (tabName === 'image-analysis') loadImageAnalysisResults();
  else if (tabName === 'id-photo') loadIdPhotoResults();
  else if (tabName === 'id-photo-layout') loadIdPhotoLayoutResults();
  else if (tabName === 'id-photo-compress') loadIdPhotoCompressResults();
  else if (tabName === 'monthly') loadMonthlyCards();
  else if (tabName === 'groups') loadTestGroups();
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

    loadVisitStats();
  } catch (e) {
    console.error('加载概览失败:', e);
  }
}

async function loadVisitStats() {
  try {
    const res = await apiFetch('/visit-stats?days=7');
    const data = await res.json();

    document.getElementById('statTodayVisits').textContent = data.todayVisits || 0;
    document.getElementById('statWeekVisits').textContent = data.totalVisits || 0;

    const visitChartEl = document.getElementById('visitChart');
    const dailyData = data.dailyChart || [];
    const maxVisits = dailyData.length > 0 ? Math.max(...dailyData.map(d => d.visits)) : 1;

    if (dailyData.length > 0) {
      visitChartEl.innerHTML = dailyData.map((item, i) => {
        const pct = maxVisits > 0 ? Math.round((item.visits / maxVisits) * 100) : 0;
        const dateLabel = item.date.slice(5);
        const color = '#667eea';
        return `<div class="bar-row">
          <div class="bar-label">${dateLabel}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct, 5)}%;background:${color}">${item.visits}</div></div>
          <div class="bar-count">${item.visits}</div>
        </div>`;
      }).join('');
    } else {
      visitChartEl.innerHTML = '<div class="loading">暂无访问数据</div>';
    }

    const topPagesEl = document.getElementById('topPagesChart');
    const topPages = data.topPages || [];
    const maxPageVisits = topPages.length > 0 ? topPages[0].visits : 1;

    if (topPages.length > 0) {
      topPagesEl.innerHTML = topPages.map((item, i) => {
        const pct = maxPageVisits > 0 ? Math.round((item.visits / maxPageVisits) * 100) : 0;
        const color = BAR_COLORS[i % BAR_COLORS.length];
        return `<div class="bar-row">
          <div class="bar-label">${item.page}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.max(pct, 5)}%;background:${color}">${item.visits}</div></div>
          <div class="bar-count">${item.visits}</div>
        </div>`;
      }).join('');
    } else {
      topPagesEl.innerHTML = '<div class="loading">暂无数据</div>';
    }
  } catch (e) {
    console.error('加载访问统计失败:', e);
  }
}

async function generateCodes() {
  const count = parseInt(document.getElementById('codeCount').value);
  if (!count || count < 1 || count > 100) { alert('数量必须在1-100之间'); return; }

  const groupId = document.getElementById('codeGroupSelect').value;
  const groupIdNum = groupId ? parseInt(groupId) : null;

  try {
    const res = await apiFetch('/generate-codes', {
      method: 'POST',
      body: JSON.stringify({ count, groupId: groupIdNum })
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
let selectedCodeIds = new Set();

function isCodeEditable(code) {
  if (code.codeType === 'SINGLE_USE' && code.used) return false;
  if (code.codeType === 'MONTHLY_CARD' && code.expiresAt && new Date() > new Date(code.expiresAt)) return false;
  return true;
}

function updateBatchUI() {
  const scopeBtn = document.getElementById('batchScopeBtn');
  const deleteBtn = document.getElementById('batchDeleteBtn');
  const countEl = document.getElementById('selectedCount');
  if (selectedCodeIds.size > 0) {
    if (scopeBtn) scopeBtn.style.display = 'inline-flex';
    if (deleteBtn) deleteBtn.style.display = 'inline-flex';
    countEl.textContent = `已选 ${selectedCodeIds.size} 个`;
  } else {
    if (scopeBtn) scopeBtn.style.display = 'none';
    if (deleteBtn) deleteBtn.style.display = 'none';
    countEl.textContent = '';
  }
}

function toggleCodeSelect(codeId, el) {
  if (selectedCodeIds.has(codeId)) {
    selectedCodeIds.delete(codeId);
  } else {
    selectedCodeIds.add(codeId);
  }
  updateBatchUI();
}

function clearCodeFilters() {
  document.getElementById('codeSearch').value = '';
  document.getElementById('filterCodeType').value = '';
  document.getElementById('filterCodeStatus').value = '';
  document.getElementById('filterCodeGroup').value = '';
  selectedCodeIds.clear();
  updateBatchUI();
  loadCodes();
}

async function loadCodes(page) {
  if (page) codesPage = page;
  const container = document.getElementById('codesContainer');
  container.innerHTML = '<div class="loading">加载中...</div>';

  const search = document.getElementById('codeSearch').value.trim();
  const codeType = document.getElementById('filterCodeType').value;
  const status = document.getElementById('filterCodeStatus').value;
  const groupId = document.getElementById('filterCodeGroup').value;

  let url = `/codes?page=${codesPage}&limit=100`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (codeType) url += `&codeType=${codeType}`;
  if (status) url += `&status=${status}`;
  if (groupId) url += `&groupId=${groupId}`;

  try {
    const res = await apiFetch(url);
    const data = await res.json();

    let html = '<table><thead><tr><th><input type="checkbox" id="selectAllCodes" onchange="toggleSelectAll(this)"></th><th>兑换码</th><th>类型</th><th>状态</th><th>分组</th><th>使用次数</th><th>关联测试</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';

    (data.codes || []).forEach(code => {
      const isMonthly = code.codeType === 'MONTHLY_CARD';
      const editable = isCodeEditable(code);
      const hasResults = (code.testResults || []).length > 0;

      let statusHtml = '';
      if (isMonthly) {
        const expired = code.expiresAt && new Date() > new Date(code.expiresAt);
        statusHtml = expired ? '<span class="status-badge status-expired">已过期</span>' : '<span class="status-badge status-active">有效</span>';
      } else {
        statusHtml = code.used ? '<span class="status-badge status-used">已使用</span>' : '<span class="status-badge status-unused">未使用</span>';
      }

      const testInfo = (code.testResults || []).map(r => TEST_TYPE_NAMES[r.testType] || r.testType).join(', ') || '-';
      const groupName = code.group?.name || '<span style="color:#999;">未分组</span>';
      const checked = selectedCodeIds.has(code.id) ? 'checked' : '';

      const groupEditBtn = editable
        ? `<button class="btn-small" onclick="editCodeGroup(${code.id}, ${code.group?.id || 'null'})" style="float:right;">改</button>`
        : '';

      const deleteBtn = !hasResults
        ? `<button class="btn-small" style="background:#e74c3c;color:white;border-color:#e74c3c;" onclick="deleteCode(${code.id}, '${code.code}')">删</button>`
        : '';

      html += `<tr>
        <td><input type="checkbox" ${checked} ${!editable ? 'disabled title="已使用/已过期不可选"' : ''} onchange="toggleCodeSelect(${code.id}, this)"></td>
        <td style="font-family:monospace;font-weight:700;">${code.code}</td>
        <td>${isMonthly ? '月卡' : '单次'}</td>
        <td>${statusHtml}</td>
        <td>${groupEditBtn}${groupName}</td>
        <td>${code.usedCount}</td>
        <td>${testInfo}</td>
        <td>${new Date(code.createdAt).toLocaleString('zh-CN')}</td>
        <td>${deleteBtn}</td>
      </tr>`;
    });

    html += '</tbody></table>';

    if ((data.codes || []).length === 0) {
      html = '<div class="loading">暂无数据</div>';
    }

    const totalPages = data.pages || 1;
    html += renderPagination(codesPage, totalPages, 'loadCodes');
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败</div>';
  }
}

function toggleSelectAll(el) {
  const checkboxes = document.querySelectorAll('#codesContainer tbody input[type="checkbox"]:not(:disabled)');
  checkboxes.forEach(cb => {
    cb.checked = el.checked;
    const id = parseInt(cb.getAttribute('onchange').match(/toggleCodeSelect\((\d+)/)[1]);
    if (el.checked) {
      selectedCodeIds.add(id);
    } else {
      selectedCodeIds.delete(id);
    }
  });
  updateBatchUI();
}

function batchEditScope() {
  if (selectedCodeIds.size === 0) { alert('请先选择兑换码'); return; }
  document.getElementById('editScopeCodeId').value = '';
  document.getElementById('editScopeModal').classList.add('active');
}

function exportCodes() {
  window.open(`${API_BASE}/export?token=${token}`, '_blank');
}

function editCodeGroup(codeId, currentGroupId) {
  document.getElementById('editScopeCodeId').value = codeId;
  const select = document.getElementById('editScopeGroupSelect');
  if (!select) {
    const container = document.getElementById('editScopeCheckboxes').parentElement;
    container.innerHTML = `
      <input type="hidden" id="editScopeCodeId" value="${codeId}">
      <div class="form-group">
        <label>选择分组</label>
        <select id="editScopeGroupSelect" style="padding:8px 12px;border:1px solid #ddd;border-radius:8px;font-size:13px;min-width:200px;">
          <option value="">不选择分组</option>
          ${testGroupsCache.map(g => `<option value="${g.id}" ${g.id === currentGroupId ? 'selected' : ''}>${g.name}</option>`).join('')}
        </select>
      </div>
      <div style="display:flex;gap:10px;margin-top:16px;">
        <button class="btn btn-primary" onclick="saveCodeGroup()">保存</button>
        <button class="btn btn-secondary" onclick="closeEditScopeModal()">取消</button>
      </div>
    `;
  } else {
    select.value = currentGroupId || '';
  }
  document.getElementById('editScopeModal').classList.add('active');
}

function closeEditScopeModal() {
  document.getElementById('editScopeModal').classList.remove('active');
}

function scopeSelectAll() {}

function scopeInvertSelect() {}

async function saveCodeGroup() {
  const codeIdStr = document.getElementById('editScopeCodeId').value;
  const groupId = document.getElementById('editScopeGroupSelect')?.value;
  const groupIdNum = groupId ? parseInt(groupId) : null;

  try {
    if (codeIdStr) {
      await apiFetch(`/codes/${codeIdStr}/scope`, {
        method: 'PUT',
        body: JSON.stringify({ groupId: groupIdNum })
      });
    } else {
      await apiFetch('/codes/batch-scope', {
        method: 'PUT',
        body: JSON.stringify({ ids: Array.from(selectedCodeIds), groupId: groupIdNum })
      });
      selectedCodeIds.clear();
      updateBatchUI();
    }
    closeEditScopeModal();
    loadCodes();
    loadMonthlyCards();
  } catch (e) {
    alert('修改失败: ' + e.message);
  }
}

async function deleteCode(codeId, codeStr) {
  if (!confirm(`确定删除兑换码「${codeStr}」？\n\n注意：已有关联测试结果的兑换码不能删除。`)) return;

  try {
    await apiFetch(`/codes/${codeId}`, { method: 'DELETE' });
    loadCodes();
  } catch (e) {
    alert('删除失败: ' + e.message);
  }
}

async function batchDeleteCodes() {
  if (selectedCodeIds.size === 0) { alert('请先选择要删除的兑换码'); return; }

  if (!confirm(`确定删除选中的 ${selectedCodeIds.size} 个兑换码？\n\n注意：已有关联测试结果的兑换码不能删除。`)) return;

  try {
    const res = await apiFetch('/codes/batch-delete', {
      method: 'POST',
      body: JSON.stringify({ ids: Array.from(selectedCodeIds) })
    });
    const data = await res.json();

    alert(`成功删除 ${data.deleted} 个兑换码`);
    selectedCodeIds.clear();
    updateBatchUI();
    loadCodes();
  } catch (e) {
    alert('删除失败: ' + e.message);
  }
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
    if (testType === 'image-analysis') {
      await loadImageAnalysisResults(page);
      return;
    }

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
      else if (r.testType === 'love-depth') summary = `${(rd.personality || {}).name || '-'} · ${(rd.personality || {}).nickname || '-'}`;
      else if (r.testType === 'secret-crush') summary = `${rd.typeName || '-'} (${rd.totalScore || '-'}分)`;
      else if (r.testType === 'lonely') summary = `${rd.typeName || '-'} (${rd.totalScore || '-'}分)`;
      else if (r.testType === 'image-analysis') summary = IMAGE_ANALYSIS_NAMES[rd.analysisType] || `类型${rd.analysisType}`;
      else summary = JSON.stringify(rd).slice(0, 40);

      const typeName = TEST_TYPE_NAMES[r.testType] || r.testType;
      const codeDisplay = r.exchangeCode ? r.exchangeCode.code : '-';
      const isImage = r._type === 'image' || r.testType === 'image-analysis';

      html += `<tr>
        <td>${r.id}</td>
        <td>${typeName}</td>
        <td>${summary}</td>
        <td style="font-family:monospace;">${codeDisplay}</td>
        <td>${new Date(r.createdAt).toLocaleString('zh-CN')}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="viewResult(${r.id}, '${r.testType}', ${isImage})">查看</button>
          <button class="btn btn-danger btn-sm" onclick="deleteResult(${r.id}, '${r.testType}', ${isImage})">删除</button>
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

async function loadImageAnalysisResults(page) {
  if (page) resultsPage = page;
  const startDate = document.getElementById('filterImageAnalysisStartDate').value;
  const endDate = document.getElementById('filterImageAnalysisEndDate').value;
  const container = document.getElementById('imageAnalysisResultsContainer');

  try {
    let url = `/image-analysis-results?page=${resultsPage}&limit=20`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    const res = await apiFetch(url);
    const data = await res.json();

    let html = '<table><thead><tr><th>ID</th><th>分析类型</th><th>兑换码</th><th>结果图片</th><th>过期时间</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';

    (data.results || []).forEach(r => {
      const typeName = IMAGE_ANALYSIS_NAMES[r.analysisType] || `类型${r.analysisType}`;
      const codeDisplay = r.exchangeCode ? r.exchangeCode.code : '-';
      const resultImageLink = r.resultImage ? `<a href="${r.resultImage}" target="_blank" style="color:#667eea;">查看图片</a>` : '-';
      const expiresAt = r.expiresAt ? new Date(r.expiresAt).toLocaleString('zh-CN') : '-';

      html += `<tr>
        <td>${r.id}</td>
        <td>${typeName}</td>
        <td style="font-family:monospace;">${codeDisplay}</td>
        <td>${resultImageLink}</td>
        <td>${expiresAt}</td>
        <td>${new Date(r.createdAt).toLocaleString('zh-CN')}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="viewImageAnalysisResult(${r.id})">详情</button>
          <button class="btn btn-danger btn-sm" onclick="deleteImageAnalysisResult(${r.id})">删除</button>
        </td>
      </tr>`;
    });

    html += '</tbody></table>';

    if ((data.results || []).length === 0) {
      html = '<div class="loading">暂无数据</div>';
    }

    const totalPages = data.pages || 1;
    html += renderPagination(resultsPage, totalPages, 'loadImageAnalysisResults');
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败: ' + e.message + '</div>';
  }
}

async function viewImageAnalysisResult(id) {
  try {
    const res = await apiFetch(`/image-analysis-results/${id}`);
    const data = await res.json();

    let html = '';
    html += `<div class="detail-item"><div class="detail-key">分析类型</div><div class="detail-value">${IMAGE_ANALYSIS_NAMES[data.analysisType] || `类型${data.analysisType}`}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">创建时间</div><div class="detail-value">${new Date(data.createdAt).toLocaleString('zh-CN')}</div></div>`;
    if (data.exchangeCode) {
      html += `<div class="detail-item"><div class="detail-key">兑换码</div><div class="detail-value">${data.exchangeCode.code} (${data.exchangeCode.codeType === 'MONTHLY_CARD' ? '月卡' : '单次'})</div></div>`;
    }
    html += `<div class="detail-item"><div class="detail-key">原始照片</div><div class="detail-value"><a href="${data.originalPhoto}" target="_blank" style="color:#667eea;">${data.originalPhoto}</a></div></div>`;
    html += `<div class="detail-item"><div class="detail-key">结果图片</div><div class="detail-value"><a href="${data.resultImage}" target="_blank" style="color:#667eea;">${data.resultImage}</a></div></div>`;
    html += `<div class="detail-item"><div class="detail-key">过期时间</div><div class="detail-value">${data.expiresAt ? new Date(data.expiresAt).toLocaleString('zh-CN') : '-'}</div></div>`;

    document.getElementById('resultDetailContent').innerHTML = html;
    document.getElementById('resultDetailModal').classList.add('active');
  } catch (e) {
    alert('加载详情失败: ' + e.message);
  }
}

async function deleteImageAnalysisResult(id) {
  if (!confirm('确定删除此结果？')) return;
  try {
    await apiFetch(`/image-analysis-results/${id}`, { method: 'DELETE' });
    loadImageAnalysisResults();
  } catch (e) {
    alert('删除失败: ' + e.message);
  }
}

let idPhotoResultsPage = 1;

async function loadIdPhotoResults(page) {
  if (page) idPhotoResultsPage = page;
  const startDate = document.getElementById('filterIdPhotoStartDate').value;
  const endDate = document.getElementById('filterIdPhotoEndDate').value;
  const container = document.getElementById('idPhotoResultsContainer');

  try {
    let url = `/id-photo-results?page=${idPhotoResultsPage}&limit=20`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    const res = await apiFetch(url);
    const data = await res.json();

    let html = '<table><thead><tr><th>ID</th><th>尺寸</th><th>模板</th><th>兑换码</th><th>结果图片</th><th>过期时间</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';

    (data.results || []).forEach(r => {
      const codeDisplay = r.exchangeCode ? r.exchangeCode.code : '-';
      const resultImageLink = r.resultImage ? `<a href="${r.resultImage}" target="_blank" style="color:#667eea;">查看图片</a>` : '-';
      const expiresAt = r.expiresAt ? new Date(r.expiresAt).toLocaleString('zh-CN') : '-';
      const templateName = r.styleType || '无';

      html += `<tr>
        <td>${r.id}</td>
        <td>${r.gender || '-'}</td>
        <td>${templateName}</td>
        <td style="font-family:monospace;">${codeDisplay}</td>
        <td>${resultImageLink}</td>
        <td>${expiresAt}</td>
        <td>${new Date(r.createdAt).toLocaleString('zh-CN')}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="viewIdPhotoResult(${r.id})">详情</button>
          <button class="btn btn-danger btn-sm" onclick="deleteIdPhotoResult(${r.id})">删除</button>
        </td>
      </tr>`;
    });

    html += '</tbody></table>';

    if ((data.results || []).length === 0) {
      html = '<div class="loading">暂无数据</div>';
    }

    const totalPages = data.pages || 1;
    html += renderPagination(idPhotoResultsPage, totalPages, 'loadIdPhotoResults');
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败: ' + e.message + '</div>';
  }
}

async function viewIdPhotoResult(id) {
  try {
    const res = await apiFetch(`/id-photo-results/${id}`);
    const data = await res.json();

    let html = '';
    html += `<div class="detail-item"><div class="detail-key">性别</div><div class="detail-value">${data.gender || '-'}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">模板</div><div class="detail-value">${data.styleType || '无'}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">创建时间</div><div class="detail-value">${new Date(data.createdAt).toLocaleString('zh-CN')}</div></div>`;
    if (data.exchangeCode) {
      html += `<div class="detail-item"><div class="detail-key">兑换码</div><div class="detail-value">${data.exchangeCode.code} (${data.exchangeCode.codeType === 'MONTHLY_CARD' ? '月卡' : '单次'})</div></div>`;
    }
    html += `<div class="detail-item"><div class="detail-key">原始照片</div><div class="detail-value"><a href="${data.originalPhoto}" target="_blank" style="color:#667eea;">${data.originalPhoto}</a></div></div>`;
    html += `<div class="detail-item"><div class="detail-key">结果图片</div><div class="detail-value"><a href="${data.resultImage}" target="_blank" style="color:#667eea;">${data.resultImage}</a></div></div>`;
    html += `<div class="detail-item"><div class="detail-key">过期时间</div><div class="detail-value">${data.expiresAt ? new Date(data.expiresAt).toLocaleString('zh-CN') : '-'}</div></div>`;

    document.getElementById('resultDetailContent').innerHTML = html;
    document.getElementById('resultDetailModal').classList.add('active');
  } catch (e) {
    alert('加载详情失败: ' + e.message);
  }
}

async function deleteIdPhotoResult(id) {
  if (!confirm('确定删除此结果？')) return;
  try {
    await apiFetch(`/id-photo-results/${id}`, { method: 'DELETE' });
    loadIdPhotoResults();
  } catch (e) {
    alert('删除失败: ' + e.message);
  }
}

async function viewResult(id, testType, isImage) {
  try {
    let data;
    if (isImage) {
      const res = await apiFetch(`/image-analysis-results/${id}`);
      data = await res.json();
      data.testType = 'image-analysis';
      data.resultData = { analysisType: data.analysisType, resultImage: data.resultImage, originalPhoto: data.originalPhoto };
    } else {
      const res = await apiFetch(`/results/${id}`);
      data = await res.json();
    }

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

async function deleteResult(id, testType, isImage) {
  if (!confirm('确定删除此结果？')) return;
  try {
    if (isImage) {
      await apiFetch(`/image-analysis-results/${id}`, { method: 'DELETE' });
    } else {
      await apiFetch(`/results/${id}`, { method: 'DELETE' });
    }
    loadResults();
  } catch (e) {
    alert('删除失败: ' + e.message);
  }
}

function exportResults() {
  const testType = document.getElementById('filterTestType').value;
  const startDate = document.getElementById('filterStartDate').value;
  const endDate = document.getElementById('filterEndDate').value;
  
  if (testType === 'image-analysis') {
    let url = `${API_BASE}/image-analysis-results-export?`;
    if (startDate) url += `startDate=${startDate}&`;
    if (endDate) url += `endDate=${endDate}`;
    window.open(url, '_blank');
    return;
  }
  
  let url = `${API_BASE}/results-export?testType=${testType}`;
  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  window.open(url, '_blank');
}

function exportImageAnalysisResults() {
  const startDate = document.getElementById('filterImageAnalysisStartDate').value;
  const endDate = document.getElementById('filterImageAnalysisEndDate').value;
  let url = `${API_BASE}/image-analysis-results-export?`;
  if (startDate) url += `startDate=${startDate}&`;
  if (endDate) url += `endDate=${endDate}`;
  window.open(url, '_blank');
}

async function createMonthlyCards() {
  const count = parseInt(document.getElementById('monthlyCount').value);
  const validDays = parseInt(document.getElementById('monthlyDays').value) || 30;
  const useLimitVal = document.getElementById('monthlyLimit').value;
  const useLimit = useLimitVal ? parseInt(useLimitVal) : null;
  const remark = document.getElementById('monthlyRemark').value || null;
  const groupId = document.getElementById('monthlyGroupSelect').value;
  const groupIdNum = groupId ? parseInt(groupId) : null;

  if (!count || count < 1 || count > 100) { alert('数量必须在1-100之间'); return; }

  try {
    const res = await apiFetch('/create-monthly-cards', {
      method: 'POST',
      body: JSON.stringify({ count, validDays, useLimit, remark, groupId: groupIdNum })
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

    let html = '<table><thead><tr><th>卡号</th><th>有效期至</th><th>分组</th><th>使用次数</th><th>限制</th><th>状态</th><th>关联测试</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';

    (data.cards || []).forEach(card => {
      const expired = card.expiresAt && new Date() > new Date(card.expiresAt);
      const status = expired ? '<span class="status-badge status-expired">已过期</span>' : '<span class="status-badge status-active">有效</span>';
      const limitText = card.useLimit ? `${card.usedCount}/${card.useLimit}` : `${card.usedCount}/∞`;
      const testInfo = (card.testResults || []).map(r => TEST_TYPE_NAMES[r.testType] || r.testType).join(', ') || '-';
      const testCount = (card.testResults || []).length;
      const groupName = card.group?.name || '<span style="color:#999;">未分组</span>';

      html += `<tr>
        <td style="font-family:monospace;font-weight:700;">${card.code}</td>
        <td>${card.expiresAt ? new Date(card.expiresAt).toLocaleDateString('zh-CN') : '永久'}</td>
        <td><button class="btn-small" onclick="editCodeGroup(${card.id}, ${card.group?.id || 'null'})" style="float:right;">改</button>${groupName}</td>
        <td>${limitText}</td>
        <td><button class="btn-small" onclick="editMonthlyLimit(${card.id}, ${card.useLimit || 'null'})" style="float:right;">改</button>${card.useLimit ? card.useLimit + '次' : '不限'}</td>
        <td>${status}</td>
        <td>${testInfo}</td>
        <td>${new Date(card.createdAt).toLocaleString('zh-CN')}</td>
        <td>${testCount > 0 ? `<button class="btn-small" onclick="toggleMonthlyResults(${card.id})">查看结果(${testCount})</button>` : '-'}</td>
      </tr>
      <tr id="monthly-results-${card.id}" class="monthly-results-row" style="display:none;">
        <td colspan="9" style="padding:0;background:#f8f9fa;">
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
  } else if (result.testType === 'love-depth') {
    return `恋爱人格: ${(rd.personality || {}).name || '-'} · ${(rd.personality || {}).nickname || '-'}`;
  } else if (result.testType === 'secret-crush') {
    return `暗恋程度: ${rd.typeName || '-'} (${rd.totalScore || '-'}分)`;
  } else if (result.testType === 'lonely') {
    return `孤独程度: ${rd.typeName || '-'} (${rd.totalScore || '-'}分)`;
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

function editMonthlyLimit(codeId, currentLimit) {
  document.getElementById('editLimitCodeId').value = codeId;
  document.getElementById('editLimitValue').value = currentLimit && currentLimit !== 'null' ? currentLimit : '';
  document.getElementById('editLimitModal').classList.add('active');
}

function closeEditLimitModal() {
  document.getElementById('editLimitModal').classList.remove('active');
}

async function saveMonthlyLimit() {
  const codeId = document.getElementById('editLimitCodeId').value;
  const useLimit = document.getElementById('editLimitValue').value;
  try {
    await apiFetch(`/monthly-cards/${codeId}/limit`, {
      method: 'PUT',
      body: JSON.stringify({ useLimit: useLimit ? parseInt(useLimit) : null })
    });
    closeEditLimitModal();
    loadMonthlyCards();
  } catch (e) {
    alert('修改失败: ' + e.message);
  }
}

async function loadTestGroups() {
  const container = document.getElementById('testGroupsContainer');
  container.innerHTML = '<div class="loading">加载中...</div>';

  try {
    const res = await apiFetch('/test-groups');
    const groups = await res.json();
    testGroupsCache = groups;

    let html = '<table><thead><tr><th>ID</th><th>分组名称</th><th>描述</th><th>包含测试</th><th>关联兑换码数</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';

    groups.forEach(g => {
      const tests = (g.allowedTestTypes || []).map(t => TEST_TYPE_NAMES[t] || t).join(', ') || '<span style="color:#999;">全部</span>';
      html += `<tr>
        <td>${g.id}</td>
        <td style="font-weight:700;">${g.name}</td>
        <td>${g.description || '-'}</td>
        <td style="max-width:300px;">${tests}</td>
        <td>${g.codeCount || 0}</td>
        <td>${new Date(g.createdAt).toLocaleString('zh-CN')}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="editTestGroup(${g.id})">编辑</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTestGroup(${g.id}, '${g.name}')">删除</button>
        </td>
      </tr>`;
    });

    html += '</tbody></table>';

    if (groups.length === 0) {
      html = '<div class="loading">暂无分组，请点击"初始化默认分组"或手动添加</div>';
    }

    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败</div>';
  }
}

async function addTestGroup() {
  const name = document.getElementById('newGroupName').value.trim();
  const description = document.getElementById('newGroupDesc').value.trim();
  const allowedTestTypes = getSelectedTestTypes('newGroupTests');

  if (!name) {
    alert('分组名称不能为空');
    return;
  }

  try {
    await apiFetch('/test-groups', {
      method: 'POST',
      body: JSON.stringify({ name, description: description || null, allowedTestTypes })
    });

    const successEl = document.getElementById('addGroupSuccess');
    successEl.textContent = `分组「${name}」添加成功！`;
    successEl.classList.add('show');
    setTimeout(() => successEl.classList.remove('show'), 3000);

    document.getElementById('newGroupName').value = '';
    document.getElementById('newGroupDesc').value = '';
    document.getElementById('newGroupTests').querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    loadTestGroups();
    loadGroupSelects();
  } catch (e) {
    alert('添加失败: ' + e.message);
  }
}

async function editTestGroup(id) {
  try {
    const res = await apiFetch(`/test-groups/${id}`);
    const group = await res.json();

    document.getElementById('editGroupId').value = group.id;
    document.getElementById('editGroupName').value = group.name;
    document.getElementById('editGroupDesc').value = group.description || '';

    const container = document.getElementById('editGroupTests');
    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.checked = (group.allowedTestTypes || []).includes(cb.value);
    });

    document.getElementById('editGroupModal').classList.add('active');
  } catch (e) {
    alert('获取分组信息失败: ' + e.message);
  }
}

function closeEditGroupModal() {
  document.getElementById('editGroupModal').classList.remove('active');
}

function editGroupSelectAll() {
  document.getElementById('editGroupTests').querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = true;
  });
}

function editGroupInvertSelect() {
  document.getElementById('editGroupTests').querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.checked = !cb.checked;
  });
}

async function saveEditGroup() {
  const id = document.getElementById('editGroupId').value;
  const name = document.getElementById('editGroupName').value.trim();
  const description = document.getElementById('editGroupDesc').value.trim();
  const allowedTestTypes = getSelectedTestTypes('editGroupTests');

  if (!name) {
    alert('分组名称不能为空');
    return;
  }

  try {
    await apiFetch(`/test-groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description: description || null, allowedTestTypes })
    });

    closeEditGroupModal();
    loadTestGroups();
    loadGroupSelects();
  } catch (e) {
    alert('保存失败: ' + e.message);
  }
}

async function deleteTestGroup(id, name) {
  if (!confirm(`确定删除分组「${name}」？如果该分组下有关联的兑换码，需要先转移或移除这些兑换码。`)) return;

  try {
    await apiFetch(`/test-groups/${id}`, { method: 'DELETE' });
    loadTestGroups();
    loadGroupSelects();
  } catch (e) {
    alert('删除失败: ' + e.message);
  }
}

async function seedDefaultGroups() {
  if (!confirm('确定初始化默认分组？已存在的同名分组不会被覆盖。')) return;

  try {
    const res = await apiFetch('/test-groups/seed', { method: 'POST' });
    const data = await res.json();

    alert(`初始化完成，新增 ${data.seeded} 个默认分组`);
    loadTestGroups();
    loadGroupSelects();
  } catch (e) {
    alert('初始化失败: ' + e.message);
  }
}

// 证件照排版结果查询
let idPhotoLayoutResultsPage = 1;

const PAPER_SIZE_NAMES = {
  '5inch': '五寸相纸',
  '6inch': '六寸相纸',
  '7inch': '七寸相纸',
  '8inch': '八寸相纸',
  '10inch': '十寸相纸',
  '12inch': '十二寸相纸',
  'A4': 'A4纸'
};

const PHOTO_SIZE_NAMES = {
  '1inch': '标准一寸',
  '2inch': '标准二寸',
  'small2inch': '小二寸',
  'big2inch': '大二寸',
  'small1inch': '小一寸',
  'big1inch': '大一寸',
  'visa': '签证照',
  'usVisa': '美国签证',
  'passport': '护照照',
  'idcard': '身份证'
};

async function loadIdPhotoLayoutResults(page) {
  if (page) idPhotoLayoutResultsPage = page;
  const startDate = document.getElementById('filterIdPhotoLayoutStartDate').value;
  const endDate = document.getElementById('filterIdPhotoLayoutEndDate').value;
  const container = document.getElementById('idPhotoLayoutResultsContainer');

  try {
    let url = `/id-photo-layout-results?page=${idPhotoLayoutResultsPage}&limit=20`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    const res = await apiFetch(url);
    const data = await res.json();

    let html = '<table><thead><tr><th>ID</th><th>相纸尺寸</th><th>照片尺寸</th><th>排版数量</th><th>兑换码</th><th>结果图片</th><th>过期时间</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';

    (data.results || []).forEach(r => {
      const codeDisplay = r.exchangeCode ? r.exchangeCode.code : '-';
      const resultImageLink = r.resultImage ? `<a href="${r.resultImage}" target="_blank" style="color:#667eea;">查看图片</a>` : '-';
      const expiresAt = r.expiresAt ? new Date(r.expiresAt).toLocaleString('zh-CN') : '-';
      const paperName = PAPER_SIZE_NAMES[r.paperSize] || r.paperSize;
      const photoName = PHOTO_SIZE_NAMES[r.photoSize] || r.photoSize;

      html += `<tr>
        <td>${r.id}</td>
        <td>${paperName}</td>
        <td>${photoName}</td>
        <td>${r.layoutCount}张</td>
        <td style="font-family:monospace;">${codeDisplay}</td>
        <td>${resultImageLink}</td>
        <td>${expiresAt}</td>
        <td>${new Date(r.createdAt).toLocaleString('zh-CN')}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="viewIdPhotoLayoutResult(${r.id})">详情</button>
          <button class="btn btn-danger btn-sm" onclick="deleteIdPhotoLayoutResult(${r.id})">删除</button>
        </td>
      </tr>`;
    });

    html += '</tbody></table>';

    if ((data.results || []).length === 0) {
      html = '<div class="loading">暂无数据</div>';
    }

    const totalPages = data.pages || 1;
    html += renderPagination(idPhotoLayoutResultsPage, totalPages, 'loadIdPhotoLayoutResults');
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败: ' + e.message + '</div>';
  }
}

async function viewIdPhotoLayoutResult(id) {
  try {
    const res = await apiFetch(`/id-photo-layout-results/${id}`);
    const data = await res.json();

    const paperName = PAPER_SIZE_NAMES[data.paperSize] || data.paperSize;
    const photoName = PHOTO_SIZE_NAMES[data.photoSize] || data.photoSize;

    let html = '';
    html += `<div class="detail-item"><div class="detail-key">相纸尺寸</div><div class="detail-value">${paperName}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">照片尺寸</div><div class="detail-value">${photoName}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">排版数量</div><div class="detail-value">${data.layoutCount}张</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">创建时间</div><div class="detail-value">${new Date(data.createdAt).toLocaleString('zh-CN')}</div></div>`;
    if (data.exchangeCode) {
      html += `<div class="detail-item"><div class="detail-key">兑换码</div><div class="detail-value">${data.exchangeCode.code} (${data.exchangeCode.codeType === 'MONTHLY_CARD' ? '月卡' : '单次'})</div></div>`;
    }
    html += `<div class="detail-item"><div class="detail-key">原始照片</div><div class="detail-value"><a href="${data.originalPhoto}" target="_blank" style="color:#667eea;">${data.originalPhoto}</a></div></div>`;
    html += `<div class="detail-item"><div class="detail-key">结果图片</div><div class="detail-value"><a href="${data.resultImage}" target="_blank" style="color:#667eea;">${data.resultImage}</a></div></div>`;
    html += `<div class="detail-item"><div class="detail-key">过期时间</div><div class="detail-value">${data.expiresAt ? new Date(data.expiresAt).toLocaleString('zh-CN') : '-'}</div></div>`;

    document.getElementById('resultDetailContent').innerHTML = html;
    document.getElementById('resultDetailModal').classList.add('active');
  } catch (e) {
    alert('加载详情失败: ' + e.message);
  }
}

async function deleteIdPhotoLayoutResult(id) {
  if (!confirm('确定删除此结果？')) return;
  try {
    await apiFetch(`/id-photo-layout-results/${id}`, { method: 'DELETE' });
    loadIdPhotoLayoutResults();
  } catch (e) {
    alert('删除失败: ' + e.message);
  }
}

// 证件照压缩结果
let idPhotoCompressResultsPage = 1;

async function loadIdPhotoCompressResults(page) {
  if (page) idPhotoCompressResultsPage = page;
  const startDate = document.getElementById('filterIdPhotoCompressStartDate').value;
  const endDate = document.getElementById('filterIdPhotoCompressEndDate').value;
  const container = document.getElementById('idPhotoCompressResultsContainer');

  try {
    let url = `/results?page=${idPhotoCompressResultsPage}&limit=20&testType=id-photo-compress`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;

    const res = await apiFetch(url);
    const data = await res.json();

    let html = '<table><thead><tr><th>ID</th><th>原始大小</th><th>压缩后</th><th>压缩率</th><th>目标尺寸</th><th>格式</th><th>兑换码</th><th>创建时间</th><th>操作</th></tr></thead><tbody>';

    (data.results || []).forEach(r => {
      const codeDisplay = r.exchangeCode ? r.exchangeCode.code : '-';
      const resultData = r.resultData || {};
      const originalSize = resultData.originalSize ? (resultData.originalSize / 1024).toFixed(2) + ' KB' : '-';
      const compressedSize = resultData.compressedSize ? (resultData.compressedSize / 1024).toFixed(2) + ' KB' : '-';
      const compressionRate = resultData.compressionRate ? resultData.compressionRate + '%' : '-';
      const targetSize = resultData.targetWidth && resultData.targetHeight ? `${resultData.targetWidth}×${resultData.targetHeight}` : '-';
      const format = resultData.format ? resultData.format.toUpperCase() : '-';

      html += `<tr>
        <td>${r.id}</td>
        <td>${originalSize}</td>
        <td>${compressedSize}</td>
        <td>${compressionRate}</td>
        <td>${targetSize}</td>
        <td>${format}</td>
        <td style="font-family:monospace;">${codeDisplay}</td>
        <td>${new Date(r.createdAt).toLocaleString('zh-CN')}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="viewIdPhotoCompressResult(${r.id})">详情</button>
          <button class="btn btn-danger btn-sm" onclick="deleteResult(${r.id})">删除</button>
        </td>
      </tr>`;
    });

    html += '</tbody></table>';

    if ((data.results || []).length === 0) {
      html = '<div class="loading">暂无数据</div>';
    }

    const totalPages = data.pages || 1;
    html += renderPagination(idPhotoCompressResultsPage, totalPages, 'loadIdPhotoCompressResults');
    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = '<div class="loading">加载失败: ' + e.message + '</div>';
  }
}

async function viewIdPhotoCompressResult(id) {
  try {
    const res = await apiFetch(`/results/${id}`);
    const data = await res.json();
    const resultData = data.resultData || {};

    let html = '';
    html += `<div class="detail-item"><div class="detail-key">原始大小</div><div class="detail-value">${resultData.originalSize ? (resultData.originalSize / 1024).toFixed(2) + ' KB' : '-'}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">压缩后大小</div><div class="detail-value">${resultData.compressedSize ? (resultData.compressedSize / 1024).toFixed(2) + ' KB' : '-'}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">压缩率</div><div class="detail-value">${resultData.compressionRate ? resultData.compressionRate + '%' : '-'}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">目标尺寸</div><div class="detail-value">${resultData.targetWidth && resultData.targetHeight ? `${resultData.targetWidth}×${resultData.targetHeight}` : '-'}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">输出格式</div><div class="detail-value">${resultData.format ? resultData.format.toUpperCase() : '-'}</div></div>`;
    html += `<div class="detail-item"><div class="detail-key">创建时间</div><div class="detail-value">${new Date(data.createdAt).toLocaleString('zh-CN')}</div></div>`;
    if (data.exchangeCode) {
      html += `<div class="detail-item"><div class="detail-key">兑换码</div><div class="detail-value">${data.exchangeCode.code} (${data.exchangeCode.codeType === 'MONTHLY_CARD' ? '月卡' : '单次'})</div></div>`;
    }

    document.getElementById('resultDetailContent').innerHTML = html;
    document.getElementById('resultDetailModal').classList.add('active');
  } catch (e) {
    alert('加载详情失败: ' + e.message);
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
