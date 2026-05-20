const API_BASE = window.location.origin + '/api';

const analysisGrid = document.getElementById('analysisGrid');
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

let selectedType = null;
let selectedFile = null;

const analysisNames = {
  '1': '综合形象分析',
  '2': '穿搭分析',
  '3': '妆容分析',
  '4': '发型分析',
  '5': '色彩分析',
  '6': '气质风格定位分析',
  '7': '五官风格拆解',
  '8': '显瘦显脸小策略',
  '9': '拍照表现力分析',
  '10': '个人品牌感分析',
  '11': '体型比例分析',
  '12': '发色分析'
};

document.querySelectorAll('.analysis-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.analysis-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedType = card.dataset.type;
    updateSubmitButton();
  });
});

uploadArea.addEventListener('click', (e) => {
  if (e.target === changePhotoBtn || e.target.parentElement === changePhotoBtn) {
    return;
  }
  photoInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#FF69B4';
  uploadArea.style.background = '#FFF0F5';
});

uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#FFB6C1';
  uploadArea.style.background = '#FFF8F5';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#FFB6C1';
  uploadArea.style.background = '#FFF8F5';
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

photoInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) {
    handleFile(e.target.files[0]);
  }
});

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

codeInput.addEventListener('input', () => {
  updateSubmitButton();
  hideError();
});

function updateSubmitButton() {
  const isValid = selectedType && selectedFile && codeInput.value.length === 8;
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

submitBtn.addEventListener('click', async () => {
  if (isSubmitting) return;
  if (!selectedType || !selectedFile || codeInput.value.length !== 8) {
    return;
  }
  
  isSubmitting = true;
  submitBtn.disabled = true;
  submitBtn.textContent = '提交中...';
  
  showLoading();
  hideError();
  
  const formData = new FormData();
  formData.append('code', codeInput.value.trim());
  formData.append('analysisType', selectedType);
  formData.append('photo', selectedFile);
  
  try {
    const response = await fetch(`${API_BASE}/submit-image-analysis`, {
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
    submitBtn.textContent = '开始分析';
    updateSubmitButton();
  }
});

function showResult(result) {
  resultTitle.textContent = `${result.analysisName || '分析'}完成`;
  resultImage.src = result.resultImageUrl;
  downloadBtn.dataset.imageUrl = result.resultImageUrl;
  resultSection.classList.add('show');
  
  resultSection.scrollIntoView({ behavior: 'smooth' });
}

downloadBtn.addEventListener('click', async function(e) {
  e.preventDefault();
  
  var imageUrl = downloadBtn.dataset.imageUrl;
  if (!imageUrl) return;
  
  var fullUrl = imageUrl;
  if (imageUrl.startsWith('/')) {
    fullUrl = window.location.origin + imageUrl;
  }
  
  try {
    await navigator.clipboard.writeText(fullUrl);
  } catch (err) {
    console.log('复制链接失败:', err);
  }
  
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
    tempLink.download = `形象分析_${Date.now()}.png`;
    tempLink.style.display = 'none';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    
    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 1000);
    
    downloadBtn.innerHTML = '<span>✅</span><span>下载成功</span>';
    showDownloadTip();
    setTimeout(function() {
      downloadBtn.innerHTML = originalText;
      downloadBtn.style.pointerEvents = '';
    }, 3000);
  } catch (error) {
    console.error('下载失败:', error);
    
    var tempLink = document.createElement('a');
    tempLink.href = imageUrl;
    tempLink.download = `形象分析_${Date.now()}.png`;
    tempLink.target = '_blank';
    tempLink.click();
    
    downloadBtn.innerHTML = '<span>📋</span><span>链接已复制</span>';
    showDownloadTip();
    setTimeout(function() {
      downloadBtn.innerHTML = originalText;
      downloadBtn.style.pointerEvents = '';
    }, 3000);
  }
});

function showDownloadTip() {
  var tip = document.getElementById('downloadTip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'downloadTip';
    tip.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:12px 20px;border-radius:8px;font-size:14px;z-index:3000;max-width:90%;text-align:center;line-height:1.5;';
    document.body.appendChild(tip);
  }
  tip.innerHTML = '📋 链接已复制<br>如下载失败，可在浏览器打开链接下载';
  tip.style.display = 'block';
  setTimeout(function() {
    tip.style.display = 'none';
  }, 4000);
}

newAnalysisBtn.addEventListener('click', () => {
  selectedType = null;
  
  document.querySelectorAll('.analysis-card').forEach(c => c.classList.remove('selected'));
  
  resultSection.classList.remove('show');
  
  hideError();
  updateSubmitButton();
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function openImageModal(imgElement) {
  var modal = document.getElementById('imageModal');
  var modalImg = document.getElementById('imageModalImg');
  modalImg.src = imgElement.src;
  modalImg.alt = imgElement.alt;
  modalImg.style.transform = 'scale(1)';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeImageModal(event) {
  if (event) {
    var target = event.target;
    if (target.classList.contains('image-modal-img')) return;
  }
  var modal = document.getElementById('imageModal');
  var modalImg = document.getElementById('imageModalImg');
  modal.classList.remove('active');
  modalImg.style.transform = 'scale(1)';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var modal = document.getElementById('imageModal');
    if (modal && modal.classList.contains('active')) {
      var modalImg = document.getElementById('imageModalImg');
      modal.classList.remove('active');
      modalImg.style.transform = 'scale(1)';
      document.body.style.overflow = '';
    }
  }
});

document.getElementById('imageModal').addEventListener('wheel', function(e) {
  var modal = document.getElementById('imageModal');
  if (!modal.classList.contains('active')) return;
  
  var modalImg = document.getElementById('imageModalImg');
  var currentTransform = modalImg.style.transform;
  var currentScale = 1;
  
  if (currentTransform && currentTransform.indexOf('scale') !== -1) {
    var match = currentTransform.match(/scale\(([^)]+)\)/);
    if (match) {
      currentScale = parseFloat(match[1]);
    }
  }
  
  var delta = e.deltaY > 0 ? -0.1 : 0.1;
  var newScale = currentScale + delta;
  
  if (newScale < 0.5) newScale = 0.5;
  if (newScale > 5) newScale = 5;
  
  modalImg.style.transform = 'scale(' + newScale + ')';
  e.preventDefault();
});
