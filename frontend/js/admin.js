const API_BASE_URL = 'http://localhost:3001/api/admin';

//const API_BASE_URL = 'https://mental-age-production.up.railway.app/api/admin';
let token = localStorage.getItem('adminToken');
let currentPage = 1;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    showAdminScreen();
    loadCodes();
  } else {
    showLoginScreen();
  }
});

// 显示登录界面
function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminScreen').classList.remove('active');
}

// 显示管理界面
function showAdminScreen() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminScreen').classList.add('active');
}

// 处理登录
async function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '登录失败');
    }

    const data = await response.json();
    token = data.token;
    localStorage.setItem('adminToken', token);
    errorDiv.classList.remove('show');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showAdminScreen();
    loadCodes();
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.add('show');
  }
}

// 退出登录
function logout() {
  token = null;
  localStorage.removeItem('adminToken');
  showLoginScreen();
}

// 生成兑换码
async function generateCodes() {
  const count = parseInt(document.getElementById('codeCount').value);
  const successDiv = document.getElementById('successMessage');
  const codesDiv = document.getElementById('generatedCodes');
  const codesTextarea = document.getElementById('codesTextarea');

  if (!count || count < 1 || count > 100) {
    alert('请输入1-100之间的数字');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/generate-codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ count })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || '生成失败');
    }

    const data = await response.json();
    codesTextarea.value = data.codes.join('\n');
    codesDiv.style.display = 'block';
    successDiv.textContent = `✓ 成功生成 ${data.count} 个兑换码`;
    successDiv.classList.add('show');
    setTimeout(() => successDiv.classList.remove('show'), 3000);
    loadCodes();
  } catch (error) {
    alert('生成失败: ' + error.message);
  }
}

// 渲染兑换码表格
function renderCodesTable(codes) {
  const container = document.getElementById('codesContainer');

  if (codes.length === 0) {
    container.innerHTML = '<p>暂无兑换码</p>';
    return;
  }

  const html = `
    <table class="codes-table">
      <thead>
        <tr>
          <th>兑换码</th>
          <th>状态</th>
          <th>使用时间</th>
          <th>心理年龄</th>
          <th>实际年龄</th>
          <th>人格类型</th>
          <th>创建时间</th>
        </tr>
      </thead>
      <tbody>
        ${codes.map(code => `
          <tr>
            <td><code>${code.code}</code></td>
            <td>
              <span class="status-badge ${code.used ? 'status-used' : 'status-unused'}">
                ${code.used ? '已使用' : '未使用'}
              </span>
            </td>
            <td>${code.usedAt ? new Date(code.usedAt).toLocaleString('zh-CN') : '-'}</td>
            <td>${code.testResult?.mentalAge || '-'}</td>
            <td>${code.testResult?.realAge || '-'}</td>
            <td>${code.testResult?.personalityType || '-'}</td>
            <td>${new Date(code.createdAt).toLocaleString('zh-CN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = html;
}

// 渲染分页
function renderPagination(page, pages) {
  const container = document.getElementById('codesContainer');
  if (pages <= 1) return;

  const paginationHtml = `
    <div class="pagination">
      <button onclick="loadCodes(1)" ${page === 1 ? 'disabled' : ''}>首页</button>
      <button onclick="loadCodes(${page - 1})" ${page === 1 ? 'disabled' : ''}>上一页</button>
      ${Array.from({ length: pages }, (_, i) => i + 1).map(p => `
        <button onclick="loadCodes(${p})" class="${p === page ? 'active' : ''}">${p}</button>
      `).join('')}
      <button onclick="loadCodes(${page + 1})" ${page === pages ? 'disabled' : ''}>下一页</button>
      <button onclick="loadCodes(${pages})" ${page === pages ? 'disabled' : ''}>末页</button>
    </div>
  `;

  container.innerHTML += paginationHtml;
}

// 复制到剪贴板
function copyToClipboard() {
  const textarea = document.getElementById('codesTextarea');
  textarea.select();
  document.execCommand('copy');
  alert('已复制到剪贴板');
}

// 加载兑换码列表
async function loadCodes(page = 1) {
  const container = document.getElementById('codesContainer');
  container.innerHTML = '<div class="loading">加载中...</div>';
  currentPage = page;

  try {
    if (!token) {
      throw new Error('请先登录');
    }

    console.log('正在加载兑换码列表, 页码:', page, 'Token:', token.substring(0, 20) + '...');

    const response = await fetch(`${API_BASE_URL}/codes?page=${page}&limit=50`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('响应状态:', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('认证失败，清除token并重新登录');
        logout();
        return;
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: 加载失败`);
    }

    const data = await response.json();
    console.log('加载成功，获得数据:', data);

    if (!data.codes || !Array.isArray(data.codes)) {
      throw new Error('返回的数据格式错误');
    }

    renderCodesTable(data.codes);
    if (data.pages && data.pages > 1) {
      renderPagination(data.page, data.pages);
    }
  } catch (error) {
    console.error('加载失败:', error);
    container.innerHTML = `<div style="color: red; padding: 20px; background: #ffe0e0; border-radius: 5px;">加载失败: ${error.message}</div>`;
  }
}

// 导出 CSV
async function exportCodes() {
  try {
    if (!token) {
      throw new Error('请先登录');
    }

    console.log('正在导出CSV...');

    const response = await fetch(`${API_BASE_URL}/export`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('响应状态:', response.status, response.statusText);

    if (!response.ok) {
      if (response.status === 401) {
        console.error('认证失败，清除token并重新登录');
        logout();
        return;
      }
      const errorData = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${errorData || '导出失败'}`);
    }

    const csv = await response.text();
    console.log('导出成功，CSV大小:', csv.length, '字节');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `兑换码_${new Date().getTime()}.csv`;
    link.click();

    console.log('文件下载完成');
  } catch (error) {
    console.error('导出失败:', error);
    alert('导出失败: ' + error.message);
  }
}
