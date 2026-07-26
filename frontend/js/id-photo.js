const API_BASE = window.location.origin + '/api';

const sizeGrid = document.getElementById('sizeGrid');
const backgroundGrid = document.getElementById('backgroundGrid');
const templateGrid = document.getElementById('templateGrid');
const uploadArea = document.getElementById('uploadArea');
const photoInput = document.getElementById('photoInput');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const changePhotoBtn = document.getElementById('changePhotoBtn');
const codeInput = document.getElementById('codeInput');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const resultSection = document.getElementById('resultSection');
const resultTitle = document.getElementById('resultTitle');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const loadingOverlay = document.getElementById('loadingOverlay');

let selectedSize = null;
let selectedBackground = null;
let selectedTemplate = null;
let selectedFile = null;
let customTemplateFile = null; // 自定义模板文件

const sizeNames = {
  '1寸': '1寸证件照',
  '2寸': '2寸证件照',
  '小2寸': '小2寸证件照'
};

const backgroundNames = {
  'white': '白色背景',
  'blue': '蓝色背景',
  'red': '红色背景'
};

// 尺寸选择
document.querySelectorAll('.size-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.size-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedSize = card.dataset.size;
    updateSubmitButton();
  });
});

// 背景色选择
document.querySelectorAll('.background-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.background-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedBackground = card.dataset.background;
    updateSubmitButton();
  });
});

// 服装模板选择
document.querySelectorAll('.template-card').forEach(card => {
  card.addEventListener('click', () => {
    // 如果点击的是自定义上传卡片
    if (card.dataset.template === 'custom') {
      const customInput = document.getElementById('customTemplateInput');
      customInput.click();
      return;
    }

    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedTemplate = card.dataset.template;
    customTemplateFile = null; // 清除自定义模板文件
    updateSubmitButton();
  });
});

// 自定义模板文件上传
document.getElementById('customTemplateInput').addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    const file = e.target.files[0];
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      showError('请上传 JPG、PNG 或 WEBP 格式的服装模板图片');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('服装模板图片大小不能超过 10MB');
      e.target.value = '';
      return;
    }

    customTemplateFile = file;
    selectedTemplate = 'custom';

    // 选中自定义卡片
    document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
    document.getElementById('customTemplateCard').classList.add('selected');

    // 更新自定义卡片的显示
    const customCard = document.getElementById('customTemplateCard');
    const previewDiv = customCard.querySelector('.template-preview');
    previewDiv.textContent = '✓';

    hideError();
    updateSubmitButton();
  }
});

// 上传区域点击
uploadArea.addEventListener('click', (e) => {
  if (e.target === changePhotoBtn || e.target.parentElement === changePhotoBtn) {
    return;
  }
  photoInput.click();
});

// 拖拽上传
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#4682B4';
  uploadArea.style.background = '#E8F4F8';
});

uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#87CEEB';
  uploadArea.style.background = '#F0F8FF';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#87CEEB';
  uploadArea.style.background = '#F0F8FF';
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

// 文件选择
photoInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

// 更换照片按钮
changePhotoBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  photoInput.click();
});

function handleFile(file) {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showError('请上传 JPG、PNG 或 WEBP 格式的图片');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) {
    showError('图片大小不能超过 10MB');
    return;
  }
  
  selectedFile = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    uploadPlaceholder.style.display = 'none';
    previewContainer.style.display = 'block';
    uploadArea.classList.add('has-image');
    updateSubmitButton();
  };
  reader.readAsDataURL(file);
  
  hideError();
}

// 兑换码输入
codeInput.addEventListener('input', () => {
  updateSubmitButton();
  hideError();
});

function updateSubmitButton() {
  // 如果选择了自定义模板，需要确保已上传自定义模板文件
  const templateValid = selectedTemplate && (selectedTemplate !== 'custom' || customTemplateFile);
  const isValid = selectedSize && selectedBackground && templateValid && selectedFile && codeInput.value.length === 8;
  submitBtn.disabled = !isValid;
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
}

function hideError() {
  errorMessage.classList.remove('show');
}

function showLoading() {
  loadingOverlay.classList.add('show');
}

function hideLoading() {
  loadingOverlay.classList.remove('show');
}

let isSubmitting = false;

// 提交按钮
submitBtn.addEventListener('click', async () => {
  if (isSubmitting) return;
  if (!selectedSize || !selectedBackground || !selectedTemplate || !selectedFile || codeInput.value.length !== 8) {
    return;
  }

  // 如果选择了自定义模板但没有上传文件
  if (selectedTemplate === 'custom' && !customTemplateFile) {
    showError('请上传自定义服装模板图片');
    return;
  }

  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.textContent = '提交中...';

  showLoading();
  hideError();

  const formData = new FormData();
  formData.append('code', codeInput.value.trim());
  formData.append('size', selectedSize);
  formData.append('background', selectedBackground);
  formData.append('template', selectedTemplate);
  formData.append('photo', selectedFile);

  // 如果有自定义模板文件，也上传
  if (selectedTemplate === 'custom' && customTemplateFile) {
    formData.append('customTemplate', customTemplateFile);
  }

  try {
    const response = await fetch(`${API_BASE}/submit-id-photo`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.errors?.[0]?.msg || '提交失败');
    }

    showResult(result);
  } catch (error) {
    showError(error.message);
  } finally {
    hideLoading();
    isSubmitting = false;
    submitBtn.disabled = false;
    submitBtn.textContent = '开始生成';
    updateSubmitButton();
  }
});

function showResult(result) {
  const sizeText = result.sizeName || sizeNames[selectedSize] || '证件照';
  const backgroundText = result.backgroundName || backgroundNames[selectedBackground] || '背景';
  resultTitle.textContent = `${sizeText} - ${backgroundText} 生成完成`;
  
  // 处理图片URL，确保使用完整URL
  let imageUrl = result.resultImageUrl;
  if (imageUrl && imageUrl.startsWith('/')) {
    imageUrl = window.location.origin + imageUrl;
  }
  
  resultImage.src = imageUrl;
  
  // 添加图片加载错误处理
  resultImage.onerror = function() {
    console.error('图片加载失败:', imageUrl);
    showError('图片加载失败，请刷新页面重试');
  };
  
  downloadBtn.dataset.imageUrl = result.resultImageUrl;
  resultSection.classList.add('show');
  
  resultSection.scrollIntoView({ behavior: 'smooth' });
}

// 下载按钮
downloadBtn.addEventListener('click', async function(e) {
  e.preventDefault();
  
  var imageUrl = downloadBtn.dataset.imageUrl;
  if (!imageUrl) return;
  
  var originalText = downloadBtn.innerHTML;
  downloadBtn.innerHTML = '<span>⏳</span><span>准备下载...</span>';
  downloadBtn.style.pointerEvents = 'none';
  
  try {
    var response = await fetch(imageUrl);
    if (!response.ok) throw new Error('下载失败');
    
    var blob = await response.blob();
    var url = URL.createObjectURL(blob);
    
    var tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.download = `证件照_${Date.now()}.png`;
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    
    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 1000);
    
    downloadBtn.innerHTML = '<span>✅</span><span>下载成功</span>';
    setTimeout(function() {
      downloadBtn.innerHTML = originalText;
      downloadBtn.style.pointerEvents = '';
    }, 3000);
  } catch (error) {
    console.error('下载失败:', error);
    
    var fullUrl = imageUrl;
    if (imageUrl.startsWith('/')) {
      fullUrl = window.location.origin + imageUrl;
    }
    
    var tempLink = document.createElement('a');
    tempLink.href = fullUrl;
    tempLink.download = `证件照_${Date.now()}.png`;
    tempLink.target = '_blank';
    tempLink.click();
    
    downloadBtn.innerHTML = '<span>📥</span><span>下载失败，请复制链接</span>';
    setTimeout(function() {
      downloadBtn.innerHTML = originalText;
      downloadBtn.style.pointerEvents = '';
    }, 3000);
  }
});

// 复制链接按钮
var copyLinkBtn = document.getElementById('copyLinkBtn');
copyLinkBtn.addEventListener('click', async function() {
  var imageUrl = downloadBtn.dataset.imageUrl;
  if (!imageUrl) return;
  
  var fullUrl = imageUrl;
  if (imageUrl.startsWith('/')) {
    fullUrl = window.location.origin + imageUrl;
  }
  
  var originalText = copyLinkBtn.innerHTML;
  
  try {
    await navigator.clipboard.writeText(fullUrl);
    copyLinkBtn.innerHTML = '<span>✅</span><span>链接已复制</span>';
  } catch (err) {
    // 降级方案：使用textarea复制
    var textarea = document.createElement('textarea');
    textarea.value = fullUrl;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      copyLinkBtn.innerHTML = '<span>✅</span><span>链接已复制</span>';
    } catch (e) {
      copyLinkBtn.innerHTML = '<span>❌</span><span>复制失败</span>';
    }
    document.body.removeChild(textarea);
  }
  
  showCopyTip();
  
  setTimeout(function() {
    copyLinkBtn.innerHTML = originalText;
  }, 3000);
});

function showCopyTip() {
  var tip = document.getElementById('downloadTip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'downloadTip';
    tip.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:12px 20px;border-radius:8px;font-size:14px;z-index:3000;max-width:90%;text-align:center;line-height:1.5;';
    document.body.appendChild(tip);
  }
  tip.innerHTML = '📋 链接已复制到剪贴板<br>可在浏览器打开链接查看或下载图片';
  tip.style.display = 'block';
  setTimeout(function() {
    tip.style.display = 'none';
  }, 4000);
}

// 重新生成按钮
newAnalysisBtn.addEventListener('click', () => {
  selectedSize = null;
  selectedBackground = null;
  selectedTemplate = null;
  
  document.querySelectorAll('.size-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.background-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
  
  resultSection.classList.remove('show');
  
  hideError();
  updateSubmitButton();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
