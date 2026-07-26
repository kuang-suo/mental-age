// 证件照排版工具 JS

const API_BASE = window.location.origin + '/api';

// 相纸尺寸配置（单位：mm）
const PAPER_SIZES = {
  '5inch': { name: '五寸相纸', width: 127, height: 89, desc: '3R | 12.7×8.9cm' },
  '6inch': { name: '六寸相纸', width: 152, height: 102, desc: '4R | 15.2×10.2cm' },
  '7inch': { name: '七寸相纸', width: 178, height: 127, desc: '5R | 17.8×12.7cm' },
  '8inch': { name: '八寸相纸', width: 203, height: 152, desc: '6R | 20.3×15.2cm' },
  '10inch': { name: '十寸相纸', width: 254, height: 203, desc: '8R | 25.4×20.3cm' },
  '12inch': { name: '十二寸相纸', width: 254, height: 305, desc: '25.4×30.48cm' },
  'A4': { name: 'A4纸', width: 210, height: 297, desc: '21.0×29.7cm' }
};

// 照片尺寸配置（单位：mm）
const PHOTO_SIZES = {
  '1inch': { name: '标准一寸', width: 25, height: 35 },
  '2inch': { name: '标准二寸', width: 35, height: 49 },
  'small2inch': { name: '小二寸', width: 35, height: 45 },
  'big2inch': { name: '大二寸', width: 35, height: 53 },
  'small1inch': { name: '小一寸', width: 22, height: 32 },
  'big1inch': { name: '大一寸', width: 33, height: 48 },
  'visa': { name: '签证照', width: 35, height: 45 },
  'usVisa': { name: '美国签证', width: 51, height: 51 },
  'passport': { name: '护照照', width: 33, height: 48 },
  'idcard': { name: '身份证', width: 26, height: 32 }
};

// DOM元素
const uploadArea = document.getElementById('uploadArea');
const photoInput = document.getElementById('photoInput');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const changePhotoBtn = document.getElementById('changePhotoBtn');
const paperSizeGrid = document.getElementById('paperSizeGrid');
const photoSizeGrid = document.getElementById('photoSizeGrid');
const previewSection = document.getElementById('previewSection');
const previewCanvas = document.getElementById('previewCanvas');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const codeInputSection = document.getElementById('codeInputSection');
const exchangeCodeInput = document.getElementById('exchangeCodeInput');

// 状态变量
let selectedFile = null;
let selectedPaperSize = null;
let selectedPhotoSize = null;
let uploadedImage = null;
let layoutData = null; // 存储排版数据
let hasWatermark = true; // 当前是否有水印

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
    alert('请上传 JPG、PNG 或 WEBP 格式的图片');
    return;
  }
  
  if (file.size > 10 * 1024 * 1024) {
    alert('图片大小不能超过 10MB');
    return;
  }
  
  selectedFile = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    uploadPlaceholder.style.display = 'none';
    previewContainer.style.display = 'block';
    uploadArea.classList.add('has-image');
    
    // 加载图片对象
    const img = new Image();
    img.onload = () => {
      uploadedImage = img;
      tryGenerateLayout();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// 相纸尺寸选择
document.querySelectorAll('#paperSizeGrid .option-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#paperSizeGrid .option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedPaperSize = card.dataset.paper;
    tryGenerateLayout();
  });
});

// 照片尺寸选择
document.querySelectorAll('#photoSizeGrid .option-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#photoSizeGrid .option-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedPhotoSize = card.dataset.photo;
    tryGenerateLayout();
  });
});

function tryGenerateLayout() {
  if (uploadedImage && selectedPaperSize && selectedPhotoSize) {
    generateLayout();
  }
}

function generateLayout() {
  showLoading();
  
  setTimeout(() => {
    try {
      const paper = PAPER_SIZES[selectedPaperSize];
      const photo = PHOTO_SIZES[selectedPhotoSize];
      
      // 计算排版（考虑边距和间距）
      const margin = 5; // 边距 mm
      const gap = 2; // 间距 mm
      
      // 计算可排版数量
      const layout = calculateLayout(paper, photo, margin, gap);
      
      // 存储排版数据
      layoutData = { paper, photo, layout, margin, gap };
      
      // 更新显示信息
      document.getElementById('paperSizeValue').textContent = paper.name;
      document.getElementById('photoSizeValue').textContent = photo.name;
      document.getElementById('layoutCountValue').textContent = layout.count + '张';
      
      // 绘制带水印的排版图
      drawLayout(paper, photo, layout, margin, gap, true);
      hasWatermark = true;
      
      // 显示兑换码输入框
      codeInputSection.style.display = 'block';
      exchangeCodeInput.value = '';
      
      previewSection.classList.add('show');
      previewSection.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('生成排版失败:', error);
      alert('生成排版失败，请重试');
    }
    hideLoading();
  }, 500);
}

function calculateLayout(paper, photo, margin, gap) {
  // 计算可用空间
  const availableWidth = paper.width - margin * 2;
  const availableHeight = paper.height - margin * 2;
  
  // 计算每行可放置的照片数量
  const cols = Math.floor((availableWidth + gap) / (photo.width + gap));
  const rows = Math.floor((availableHeight + gap) / (photo.height + gap));
  
  // 计算实际排版数量
  const count = cols * rows;
  
  return { cols, rows, count };
}

function drawLayout(paper, photo, layout, margin, gap, withWatermark) {
  const canvas = previewCanvas;
  const ctx = canvas.getContext('2d');
  
  // 设置画布分辨率（300 DPI 用于打印）
  const dpi = 300;
  const mmToPx = dpi / 25.4; // mm转像素
  
  const canvasWidth = Math.round(paper.width * mmToPx);
  const canvasHeight = Math.round(paper.height * mmToPx);
  
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  
  // 设置CSS尺寸以便显示
  const maxDisplayWidth = 600;
  const scale = maxDisplayWidth / canvasWidth;
  canvas.style.width = maxDisplayWidth + 'px';
  canvas.style.height = Math.round(canvasHeight * scale) + 'px';
  
  // 绘制白色背景
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // 计算照片在画布上的尺寸
  const photoWidthPx = Math.round(photo.width * mmToPx);
  const photoHeightPx = Math.round(photo.height * mmToPx);
  const marginPx = Math.round(margin * mmToPx);
  const gapPx = Math.round(gap * mmToPx);
  
  // 计算居中偏移
  const totalPhotosWidth = layout.cols * photoWidthPx + (layout.cols - 1) * gapPx;
  const totalPhotosHeight = layout.rows * photoHeightPx + (layout.rows - 1) * gapPx;
  const offsetX = marginPx + (paper.width * mmToPx - marginPx * 2 - totalPhotosWidth) / 2;
  const offsetY = marginPx + (paper.height * mmToPx - marginPx * 2 - totalPhotosHeight) / 2;
  
  // 绘制每张照片
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const x = offsetX + col * (photoWidthPx + gapPx);
      const y = offsetY + row * (photoHeightPx + gapPx);
      
      // 绘制照片
      drawPhoto(ctx, uploadedImage, x, y, photoWidthPx, photoHeightPx);
      
      // 绘制裁剪线（虚线）
      ctx.strokeStyle = '#CCCCCC';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, photoWidthPx, photoHeightPx);
      ctx.setLineDash([]);
    }
  }
  
  // 添加水印
  if (withWatermark) {
    drawWatermark(ctx, canvasWidth, canvasHeight);
  }
}

function drawPhoto(ctx, img, x, y, width, height) {
  // 计算图片缩放和裁剪，保持比例填充
  const imgRatio = img.width / img.height;
  const targetRatio = width / height;
  
  let sx, sy, sw, sh;
  
  if (imgRatio > targetRatio) {
    // 图片更宽，裁剪左右
    sh = img.height;
    sw = sh * targetRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    // 图片更高，裁剪上下
    sw = img.width;
    sh = sw / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  
  ctx.drawImage(img, sx, sy, sw, sh, x, y, width, height);
}

function drawWatermark(ctx, width, height) {
  // 设置水印样式
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#666666';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = '预览水印 - 请输入兑换码下载无水印图片';
  
  // 计算文本宽度
  const textWidth = ctx.measureText(text).width;
  
  // 绘制多条斜线水印，确保覆盖整个画布
  const angle = -Math.PI / 12;
  const spacing = 100;
  
  // 计算需要多少行才能覆盖整个画布高度
  const rows = Math.ceil(height / spacing) + 4;
  
  for (let i = -Math.floor(rows / 2); i <= Math.floor(rows / 2); i++) {
    const y = height / 2 + i * spacing;
    
    // 计算需要多少列才能覆盖整个画布宽度
    const cols = Math.ceil(width / (textWidth * 0.8)) + 2;
    
    for (let j = -Math.floor(cols / 2); j <= Math.floor(cols / 2); j++) {
      const x = width / 2 + j * (textWidth * 0.9);
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }
  }
  
  ctx.restore();
}

// 下载按钮 - 需要兑换码
downloadBtn.addEventListener('click', async () => {
  const code = exchangeCodeInput.value.trim();
  if (!code || code.length !== 8) {
    alert('请输入有效的8位兑换码');
    exchangeCodeInput.focus();
    return;
  }

  showLoading();

  try {
    // 先生成无水印的排版图片
    const { paper, photo, layout, margin, gap } = layoutData;

    // 创建临时canvas生成无水印图片
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const dpi = 300;
    const mmToPx = dpi / 25.4;

    tempCanvas.width = Math.round(paper.width * mmToPx);
    tempCanvas.height = Math.round(paper.height * mmToPx);

    // 复制绘制逻辑但不加水印
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    const photoWidthPx = Math.round(photo.width * mmToPx);
    const photoHeightPx = Math.round(photo.height * mmToPx);
    const marginPx = Math.round(margin * mmToPx);
    const gapPx = Math.round(gap * mmToPx);

    const totalPhotosWidth = layout.cols * photoWidthPx + (layout.cols - 1) * gapPx;
    const totalPhotosHeight = layout.rows * photoHeightPx + (layout.rows - 1) * gapPx;
    const offsetX = marginPx + (paper.width * mmToPx - marginPx * 2 - totalPhotosWidth) / 2;
    const offsetY = marginPx + (paper.height * mmToPx - marginPx * 2 - totalPhotosHeight) / 2;

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; col++) {
        const x = offsetX + col * (photoWidthPx + gapPx);
        const y = offsetY + row * (photoHeightPx + gapPx);

        drawPhoto(tempCtx, uploadedImage, x, y, photoWidthPx, photoHeightPx);

        tempCtx.strokeStyle = '#CCCCCC';
        tempCtx.setLineDash([5, 5]);
        tempCtx.lineWidth = 1;
        tempCtx.strokeRect(x, y, photoWidthPx, photoHeightPx);
        tempCtx.setLineDash([]);
      }
    }

    // 将canvas转换为Blob
    const layoutImageBlob = await new Promise((resolve) => {
      tempCanvas.toBlob(resolve, 'image/png', 1.0);
    });

    // 验证兑换码并保存结果（包含排版后的图片）
    const formData = new FormData();
    formData.append('code', code.trim());
    formData.append('paperSize', selectedPaperSize);
    formData.append('photoSize', selectedPhotoSize);
    formData.append('layoutCount', layoutData.layout.count);
    formData.append('photo', selectedFile);
    formData.append('layoutImage', layoutImageBlob, 'layout.png'); // 添加排版后的图片

    const response = await fetch(`${API_BASE}/submit-id-photo-layout`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.errors?.[0]?.msg || '提交失败');
    }

    // 下载无水印图片
    const link = document.createElement('a');
    const filename = `证件照排版_${selectedPaperSize}_${selectedPhotoSize}_${Date.now()}.png`;
    const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
    link.download = filename;
    link.href = dataUrl;
    link.click();

    // 复制下载链接到剪贴板
    try {
      await navigator.clipboard.writeText(dataUrl);
      alert('下载链接已复制到剪贴板！\n\n如果下载失败，请在浏览器地址栏粘贴下载链接进行下载。');
    } catch (e) {
      // 如果无法复制dataURL，提示用户
      console.log('无法复制到剪贴板');
    }

  } catch (error) {
    alert(error.message || '下载失败，请重试');
  } finally {
    hideLoading();
  }
});

// 重置按钮
resetBtn.addEventListener('click', () => {
  selectedPaperSize = null;
  selectedPhotoSize = null;
  selectedFile = null;
  uploadedImage = null;
  layoutData = null;
  hasWatermark = true;
  
  document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  uploadPlaceholder.style.display = 'block';
  previewContainer.style.display = 'none';
  uploadArea.classList.remove('has-image');
  previewSection.classList.remove('show');
  codeInputSection.style.display = 'none';
  exchangeCodeInput.value = '';
  photoInput.value = '';
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function showLoading() {
  loadingOverlay.classList.add('show');
}

function hideLoading() {
  loadingOverlay.classList.remove('show');
}
