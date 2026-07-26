// 证件照压缩工具 - 功能逻辑

// API基础路径 - 与证件照排版保持一致
const API_BASE = window.location.origin + '/api';

// 状态管理
let state = {
  originalFile: null,
  originalImage: null,
  compressedBlob: null,
  compressedWithWatermark: null
};

// DOM元素
const elements = {
  codeInput: document.getElementById('redemptionCode'),
  uploadZone: document.getElementById('uploadZone'),
  fileInput: document.getElementById('fileInput'),
  settingsSection: document.getElementById('settingsSection'),
  previewSection: document.getElementById('previewSection'),
  downloadSection: document.getElementById('downloadSection'),
  originalPreview: document.getElementById('originalPreview'),
  compressedPreview: document.getElementById('compressedPreview'),
  originalInfo: document.getElementById('originalInfo'),
  compressedInfo: document.getElementById('compressedInfo'),
  targetWidth: document.getElementById('targetWidth'),
  targetHeight: document.getElementById('targetHeight'),
  targetSize: document.getElementById('targetSize'),
  targetSizeValue: document.getElementById('targetSizeValue'),
  quality: document.getElementById('quality'),
  qualityValue: document.getElementById('qualityValue'),
  formatSelect: document.getElementById('formatSelect'),
  downloadBtn: document.getElementById('downloadBtn'),
  resetBtn: document.getElementById('resetBtn'),
  loadingOverlay: document.getElementById('loadingOverlay'),
  loadingText: document.getElementById('loadingText'),
  presetBtns: document.querySelectorAll('.preset-btn')
};

// ==================== 文件上传 ====================

function setupUpload() {
  // 点击上传
  elements.uploadZone.addEventListener('click', () => {
    elements.fileInput.click();
  });

  // 文件选择
  elements.fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  });

  // 拖拽上传
  elements.uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.uploadZone.classList.add('dragover');
  });

  elements.uploadZone.addEventListener('dragleave', () => {
    elements.uploadZone.classList.remove('dragover');
  });

  elements.uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    elements.uploadZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });
}

async function handleFile(file) {
  // 验证文件类型
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    alert('请上传 JPG、PNG 或 WebP 格式的图片');
    return;
  }

  // 验证文件大小
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    alert('文件大小不能超过 10MB');
    return;
  }

  state.originalFile = file;

  // 读取图片
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      state.originalImage = img;
      showOriginalPreview();
      elements.settingsSection.classList.add('active');
      compressImage();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ==================== 图片压缩 ====================

async function compressImage() {
  if (!state.originalImage) return;

  showLoading('正在压缩图片...');

  const targetWidth = parseInt(elements.targetWidth.value) || state.originalImage.width;
  const targetHeight = parseInt(elements.targetHeight.value) || state.originalImage.height;
  const targetSize = parseInt(elements.targetSize.value) * 1024; // KB to Bytes
  let quality = parseInt(elements.quality.value) / 100;

  try {
    // 创建canvas
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    // 绘制图片
    ctx.drawImage(state.originalImage, 0, 0, targetWidth, targetHeight);

    // 二分查找合适的质量参数以达到目标文件大小
    let minQuality = 0.1;
    let maxQuality = 1.0;
    let result = null;

    for (let i = 0; i < 10; i++) {
      const testQuality = (minQuality + maxQuality) / 2;
      const blob = await canvasToBlob(canvas, 'image/jpeg', testQuality);

      if (blob.size > targetSize) {
        maxQuality = testQuality;
      } else {
        minQuality = testQuality;
        result = blob;
      }
    }

    // 如果没有找到合适的结果，使用指定的质量
    if (!result) {
      result = await canvasToBlob(canvas, 'image/jpeg', quality);
    }

    state.compressedBlob = result;

    // 添加水印
    const withWatermark = await addWatermark(canvas, quality);
    state.compressedWithWatermark = withWatermark;

    // 显示预览
    showCompressedPreview();

    elements.previewSection.classList.add('active');
    elements.downloadSection.classList.add('active');
    elements.downloadBtn.disabled = false;

  } catch (error) {
    console.error('压缩失败:', error);
    alert('压缩失败，请重试');
  } finally {
    hideLoading();
  }
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

// ==================== 水印功能 ====================

async function addWatermark(canvas, quality) {
  const watermarkCanvas = document.createElement('canvas');
  watermarkCanvas.width = canvas.width;
  watermarkCanvas.height = canvas.height;
  const ctx = watermarkCanvas.getContext('2d');

  // 绘制原图
  ctx.drawImage(canvas, 0, 0);

  // 根据图片尺寸动态计算水印大小
  const minDimension = Math.min(canvas.width, canvas.height);
  const fontSize = Math.max(16, Math.round(minDimension * 0.04)); // 最小16px，或图片短边的4%
  
  // 添加水印
  const watermarkText = '仅供预览 - 请输入兑换码下载';
  ctx.font = `italic ${fontSize}px Arial`;
  ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  // 右下角
  const padding = Math.max(10, Math.round(minDimension * 0.02));
  ctx.fillText(watermarkText, watermarkCanvas.width - padding, watermarkCanvas.height - padding);

  return await canvasToBlob(watermarkCanvas, 'image/jpeg', quality);
}

// ==================== 预览显示 ====================

function showOriginalPreview() {
  const url = URL.createObjectURL(state.originalFile);
  elements.originalPreview.src = url;

  const sizeKB = (state.originalFile.size / 1024).toFixed(2);
  const width = state.originalImage.width;
  const height = state.originalImage.height;
  elements.originalInfo.innerHTML = `尺寸: <strong>${width}×${height}</strong> | 大小: <strong>${sizeKB} KB</strong>`;
}

function showCompressedPreview() {
  const url = URL.createObjectURL(state.compressedWithWatermark);
  elements.compressedPreview.src = url;

  const originalSize = state.originalFile.size;
  const compressedSize = state.compressedBlob.size;
  const sizeKB = (compressedSize / 1024).toFixed(2);
  const rate = ((1 - compressedSize / originalSize) * 100).toFixed(1);

  const width = parseInt(elements.targetWidth.value);
  const height = parseInt(elements.targetHeight.value);

  elements.compressedInfo.innerHTML = `
    尺寸: <strong>${width}×${height}</strong> |
    大小: <strong>${sizeKB} KB</strong>
    <span class="compression-rate">压缩 ${rate}%</span>
  `;
}

// ==================== 下载功能 - 需要兑换码 ====================

// 显示下载提示
function showDownloadTip(message) {
  let tip = document.getElementById('downloadTip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'downloadTip';
    tip.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:12px 20px;border-radius:8px;font-size:14px;z-index:3000;max-width:90%;text-align:center;line-height:1.5;';
    document.body.appendChild(tip);
  }
  tip.innerHTML = message;
  tip.style.display = 'block';
  setTimeout(() => {
    tip.style.display = 'none';
  }, 3000);
}

async function downloadImage() {
  const code = elements.codeInput.value.trim();
  if (!code || code.length !== 8) {
    showDownloadTip('⚠️ 请输入有效的8位兑换码');
    elements.codeInput.focus();
    return;
  }

  if (!state.compressedBlob) {
    showDownloadTip('⚠️ 请先上传并压缩图片');
    return;
  }

  // 保存按钮原始状态
  const originalText = elements.downloadBtn.innerHTML;
  elements.downloadBtn.innerHTML = '<span>⏳</span><span>验证中...</span>';
  elements.downloadBtn.disabled = true;

  try {
    // 先验证兑换码
    const validateResponse = await fetch(`${API_BASE}/validate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code,
        testType: 'id-photo-compress'
      })
    });

    const validateResult = await validateResponse.json();

    if (!validateResponse.ok) {
      throw new Error(validateResult.error || validateResult.errors?.[0]?.msg || '兑换码验证失败');
    }

    // 验证成功，准备下载
    elements.downloadBtn.innerHTML = '<span>⏳</span><span>准备下载...</span>';

    const format = elements.formatSelect.value;

    // 下载时不加水印
    let blob = state.compressedBlob;

    // 如果需要转换格式
    if (format !== 'jpeg') {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      await new Promise(resolve => img.onload = resolve);

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const mimeType = `image/${format}`;
      blob = await canvasToBlob(canvas, mimeType, 0.9);
    }

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `证件照_${Date.now()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    // 保存测试结果
    await saveTestResult(code);

    // 显示成功状态
    elements.downloadBtn.innerHTML = '<span>✅</span><span>下载成功</span>';
    showDownloadTip('✅ 图片已下载');

    // 3秒后恢复按钮
    setTimeout(() => {
      elements.downloadBtn.innerHTML = originalText;
      elements.downloadBtn.disabled = false;
    }, 3000);

  } catch (error) {
    console.error('下载失败:', error);
    showDownloadTip('❌ ' + (error.message || '下载失败，请重试'));
    elements.downloadBtn.innerHTML = originalText;
    elements.downloadBtn.disabled = false;
  }
}

async function saveTestResult(code) {
  try {
    const width = parseInt(elements.targetWidth.value);
    const height = parseInt(elements.targetHeight.value);
    const format = elements.formatSelect.value;
    const originalSize = state.originalFile.size;
    const compressedSize = state.compressedBlob.size;

    const response = await fetch(`${API_BASE}/submit-id-photo-compress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code,
        resultData: {
          originalSize: originalSize,
          compressedSize: compressedSize,
          targetWidth: width,
          targetHeight: height,
          format: format,
          compressionRate: ((1 - compressedSize / originalSize) * 100).toFixed(1)
        }
      })
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('保存结果失败:', result);
      throw new Error(result.error || '保存结果失败');
    }
    
    console.log('结果保存成功:', result);
  } catch (error) {
    console.error('保存结果失败:', error);
    // 不阻止下载，只记录错误
  }
}

// ==================== 重置功能 ====================

function reset() {
  state.originalFile = null;
  state.originalImage = null;
  state.compressedBlob = null;
  state.compressedWithWatermark = null;

  elements.fileInput.value = '';
  elements.settingsSection.classList.remove('active');
  elements.previewSection.classList.remove('active');
  elements.downloadSection.classList.remove('active');
  elements.downloadBtn.disabled = true;
  elements.originalPreview.src = '';
  elements.compressedPreview.src = '';
  elements.originalInfo.textContent = '-';
  elements.compressedInfo.textContent = '-';
}

// ==================== 设置事件 ====================

// 防抖定时器
let compressTimer = null;

function debounceCompress() {
  if (compressTimer) {
    clearTimeout(compressTimer);
  }
  compressTimer = setTimeout(() => {
    if (state.originalImage) {
      compressImage();
    }
    compressTimer = null;
  }, 300); // 300ms防抖
}

function setupSettings() {
  // 预设尺寸按钮
  elements.presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const width = parseInt(btn.dataset.width);
      const height = parseInt(btn.dataset.height);

      if (width > 0 && height > 0) {
        elements.targetWidth.value = width;
        elements.targetHeight.value = height;
        elements.targetWidth.disabled = true;
        elements.targetHeight.disabled = true;
      } else {
        elements.targetWidth.disabled = false;
        elements.targetHeight.disabled = false;
      }

      if (state.originalImage) {
        compressImage();
      }
    });
  });

  // 目标大小滑块 - 使用防抖
  elements.targetSize.addEventListener('input', () => {
    const value = elements.targetSize.value;
    elements.targetSizeValue.textContent = `${value} KB`;
    debounceCompress();
  });

  // 质量滑块 - 使用防抖
  elements.quality.addEventListener('input', () => {
    const value = elements.quality.value;
    elements.qualityValue.textContent = `${value}%`;
    debounceCompress();
  });

  // 尺寸输入框
  elements.targetWidth.addEventListener('change', () => {
    if (state.originalImage) compressImage();
  });
  elements.targetHeight.addEventListener('change', () => {
    if (state.originalImage) compressImage();
  });
}

// ==================== 加载状态 ====================

function showLoading(text) {
  elements.loadingText.textContent = text;
  elements.loadingOverlay.classList.add('active');
}

function hideLoading() {
  elements.loadingOverlay.classList.remove('active');
}

// ==================== 初始化 ====================

function init() {
  // 绑定事件
  elements.downloadBtn.addEventListener('click', downloadImage);
  elements.resetBtn.addEventListener('click', reset);

  // 设置上传和设置
  setupUpload();
  setupSettings();
}

// 启动
init();
