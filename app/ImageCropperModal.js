'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const ASPECT_RATIOS = [
  { id: 'free', label: 'Freeform', value: null },
  { id: '16:9', label: '16:9 (Hero)', value: 16 / 9 },
  { id: '4:3', label: '4:3 (Card)', value: 4 / 3 },
  { id: '1:1', label: '1:1 (Square)', value: 1 },
  { id: '3:2', label: '3:2 (Photo)', value: 3 / 2 },
  { id: '2:1', label: '2:1 (Banner)', value: 2 }
];

export default function ImageCropperModal({
  isOpen,
  initialSrc,
  initialAlt = '',
  defaultRatio = 'free',
  onClose,
  onComplete
}) {
  const [imageSrc, setImageSrc] = useState(initialSrc || '');
  const [altText, setAltText] = useState(initialAlt);
  const [ratioKey, setRatioKey] = useState(defaultRatio || 'free');
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 200, h: 150 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const dragRef = useRef(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  // Initialize crop box to center of image
  const initCrop = useCallback((dispW, dispH, ratioVal) => {
    if (!dispW || !dispH) return;
    let w, h;
    if (ratioVal) {
      if (dispW / dispH > ratioVal) {
        h = dispH * 0.85;
        w = h * ratioVal;
      } else {
        w = dispW * 0.85;
        h = w / ratioVal;
      }
    } else {
      w = dispW * 0.88;
      h = dispH * 0.88;
    }
    const x = Math.max(0, (dispW - w) / 2);
    const y = Math.max(0, (dispH - h) / 2);
    setCrop({ x, y, w, h });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setImageSrc(initialSrc || '');
      setAltText(initialAlt || '');
      setRatioKey(defaultRatio || 'free');
      setRotation(0);
      setFlipH(false);
      setErrorMessage('');
    }
  }, [isOpen, initialSrc, initialAlt, defaultRatio]);

  // Load natural dimensions and display dimensions
  function handleImageLoad(e) {
    const img = e.target;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    const dw = img.clientWidth;
    const dh = img.clientHeight;

    setNaturalSize({ w: nw, h: nh });
    setImgSize({ w: dw, h: dh });

    const rObj = ASPECT_RATIOS.find(r => r.id === ratioKey);
    initCrop(dw, dh, rObj?.value || null);
  }

  // Handle local file selection
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setRotation(0);
      setFlipH(false);
      setErrorMessage('');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  // Ratio switch
  function handleRatioSelect(id) {
    setRatioKey(id);
    const rObj = ASPECT_RATIOS.find(r => r.id === id);
    if (imgSize.w && imgSize.h) {
      initCrop(imgSize.w, imgSize.h, rObj?.value || null);
    }
  }

  // Fit entire image into crop box
  function handleFitAll() {
    if (!imgSize.w || !imgSize.h) return;
    setRatioKey('free');
    setCrop({ x: 0, y: 0, w: imgSize.w, h: imgSize.h });
  }

  // Rotate 90 degrees
  function handleRotate() {
    setRotation(r => (r + 90) % 360);
  }

  // Flip horizontally
  function handleFlip() {
    setFlipH(f => !f);
  }

  // Pointer drag start
  function handlePointerDown(e, handleType) {
    e.preventDefault();
    e.stopPropagation();

    dragRef.current = {
      type: handleType,
      startX: e.clientX,
      startY: e.clientY,
      startCrop: { ...crop }
    };
  }

  // Pointer move
  const onPointerMove = useCallback((e) => {
    if (!dragRef.current || !imgSize.w || !imgSize.h) return;

    const { type, startX, startY, startCrop } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const activeRatioObj = ASPECT_RATIOS.find(r => r.id === ratioKey);
    const activeRatio = activeRatioObj?.value || null;
    const minSize = 35;

    let { x, y, w, h } = startCrop;

    // Moving the whole crop box
    if (type === 'move') {
      x = Math.max(0, Math.min(imgSize.w - w, startCrop.x + dx));
      y = Math.max(0, Math.min(imgSize.h - h, startCrop.y + dy));
      setCrop({ x, y, w, h });
      return;
    }

    // Dragging right edge / corners
    if (type.includes('e')) {
      w = Math.max(minSize, Math.min(imgSize.w - startCrop.x, startCrop.w + dx));
    }
    // Dragging bottom edge / corners
    if (type.includes('s')) {
      h = Math.max(minSize, Math.min(imgSize.h - startCrop.y, startCrop.h + dy));
    }
    // Dragging left edge / corners
    if (type.includes('w')) {
      const maxDelta = startCrop.w - minSize;
      const appliedDx = Math.max(-startCrop.x, Math.min(maxDelta, dx));
      x = startCrop.x + appliedDx;
      w = startCrop.w - appliedDx;
    }
    // Dragging top edge / corners
    if (type.includes('n')) {
      const maxDelta = startCrop.h - minSize;
      const appliedDy = Math.max(-startCrop.y, Math.min(maxDelta, dy));
      y = startCrop.y + appliedDy;
      h = startCrop.h - appliedDy;
    }

    // Constrain ratio if a specific ratio is selected
    if (activeRatio) {
      if (type === 'e' || type === 'w' || type === 'ne' || type === 'se') {
        h = w / activeRatio;
        if (y + h > imgSize.h) {
          h = imgSize.h - y;
          w = h * activeRatio;
        }
      } else if (type === 's' || type === 'n' || type === 'sw' || type === 'nw') {
        w = h * activeRatio;
        if (x + w > imgSize.w) {
          w = imgSize.w - x;
          h = w / activeRatio;
        }
      }
      if (type.includes('n')) {
        y = startCrop.y + (startCrop.h - h);
      }
      if (type.includes('w')) {
        x = startCrop.x + (startCrop.w - w);
      }
    }

    // Bounds safety clamping
    x = Math.max(0, Math.min(imgSize.w - w, x));
    y = Math.max(0, Math.min(imgSize.h - h, y));

    setCrop({ x, y, w, h });
  }, [imgSize, ratioKey]);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  // Canvas Crop & Upload
  async function handleApplyAndUpload() {
    if (!imgRef.current || !imgSize.w || !imgSize.h) return;
    setUploading(true);
    setErrorMessage('');

    try {
      const img = imgRef.current;

      // 1. Create transformed source canvas to handle rotation and flip
      const srcCanvas = document.createElement('canvas');
      const isRotated90 = rotation === 90 || rotation === 270;
      srcCanvas.width = isRotated90 ? naturalSize.h : naturalSize.w;
      srcCanvas.height = isRotated90 ? naturalSize.w : naturalSize.h;
      const sCtx = srcCanvas.getContext('2d');

      sCtx.translate(srcCanvas.width / 2, srcCanvas.height / 2);
      sCtx.rotate((rotation * Math.PI) / 180);
      if (flipH) sCtx.scale(-1, 1);
      sCtx.drawImage(img, -naturalSize.w / 2, -naturalSize.h / 2);

      // 2. Map display crop to transformed source pixels
      const scaleX = srcCanvas.width / imgSize.w;
      const scaleY = srcCanvas.height / imgSize.h;

      const cropX = crop.x * scaleX;
      const cropY = crop.y * scaleY;
      const cropW = crop.w * scaleX;
      const cropH = crop.h * scaleY;

      // 3. Output canvas
      const outCanvas = document.createElement('canvas');
      outCanvas.width = Math.round(cropW);
      outCanvas.height = Math.round(cropH);
      const outCtx = outCanvas.getContext('2d');
      outCtx.imageSmoothingQuality = 'high';

      outCtx.drawImage(
        srcCanvas,
        cropX,
        cropY,
        cropW,
        cropH,
        0,
        0,
        outCanvas.width,
        outCanvas.height
      );

      // 4. Convert to blob and send to upload API
      const blob = await new Promise(resolve => {
        outCanvas.toBlob(resolve, 'image/jpeg', 0.92);
      });

      if (!blob) throw new Error('Failed to generate image blob');

      const formData = new FormData();
      formData.append('file', blob, 'cropped_image.jpg');
      formData.append('alt', altText);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Upload failed with status ${res.status}`);
      }

      const data = await res.json();

      onComplete({
        src: data.url,
        alt: altText,
        provider: data.provider,
        id: data.id
      });
      onClose();
    } catch (err) {
      console.error('Crop & Upload Error:', err);
      setErrorMessage(`Upload error: ${err.message}. If using an external image URL, please choose a local image.`);
    } finally {
      setUploading(false);
    }
  }

  if (!isOpen) return null;

  // Calculate live output resolution
  const scale = imgSize.w ? naturalSize.w / imgSize.w : 1;
  const outputPixelW = Math.round(crop.w * scale);
  const outputPixelH = Math.round(crop.h * scale);

  return (
    <div className="crop-modal-overlay" onClick={onClose}>
      <div className="crop-modal-dialog" onClick={e => e.stopPropagation()}>
        <header className="crop-modal-header">
          <div>
            <h3>Flexible Image Cropper</h3>
            <p>Drag the crop handles or box freely. Rotate, flip, or lock aspect ratios.</p>
          </div>
          <button className="crop-modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </header>

        <div className="crop-modal-body">
          {/* Top Action Toolbar */}
          <div className="crop-flexible-toolbar">
            <div className="crop-tool-section">
              <span className="crop-toolbar-label">Aspect Ratio:</span>
              <div className="ratio-pills">
                {ASPECT_RATIOS.map(ratio => (
                  <button
                    key={ratio.id}
                    type="button"
                    className={`ratio-pill ${ratioKey === ratio.id ? 'is-active' : ''}`}
                    onClick={() => handleRatioSelect(ratio.id)}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="crop-tool-section crop-quick-actions">
              <button type="button" className="crop-util-btn" onClick={handleFitAll} title="Fit crop box to full image">
                ⤢ Fit Whole Image
              </button>
              <button type="button" className="crop-util-btn" onClick={handleRotate} title="Rotate 90 degrees">
                ↻ Rotate 90°
              </button>
              <button type="button" className="crop-util-btn" onClick={handleFlip} title="Flip horizontally">
                ⇄ Flip
              </button>
              <label className="crop-util-btn crop-change-file-btn">
                <span>📁 Replace Image</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>

          {/* Interactive Crop Stage */}
          <div className="crop-stage-container">
            {imageSrc ? (
              <div className="crop-canvas-wrapper">
                <img
                  ref={imgRef}
                  crossOrigin="anonymous"
                  src={imageSrc}
                  alt="Crop preview"
                  className="crop-source-image"
                  onLoad={handleImageLoad}
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`,
                    transition: 'transform 0.15s ease'
                  }}
                  draggable={false}
                />

                {/* Shading Mask Outside Crop Box */}
                {imgSize.w > 0 && (
                  <div className="crop-mask-container">
                    <div className="crop-mask top" style={{ top: 0, left: 0, right: 0, height: crop.y }} />
                    <div className="crop-mask bottom" style={{ top: crop.y + crop.h, left: 0, right: 0, bottom: 0 }} />
                    <div className="crop-mask left" style={{ top: crop.y, left: 0, width: crop.x, height: crop.h }} />
                    <div className="crop-mask right" style={{ top: crop.y, left: crop.x + crop.w, right: 0, height: crop.h }} />
                  </div>
                )}

                {/* Interactive Resizable & Draggable Crop Box */}
                {imgSize.w > 0 && (
                  <div
                    className="crop-box-element"
                    style={{
                      left: crop.x,
                      top: crop.y,
                      width: crop.w,
                      height: crop.h
                    }}
                    onPointerDown={e => handlePointerDown(e, 'move')}
                  >
                    {/* Rule of Thirds Grid */}
                    <div className="crop-rule-grid">
                      <div className="rule-line v1" />
                      <div className="rule-line v2" />
                      <div className="rule-line h1" />
                      <div className="rule-line h2" />
                    </div>

                    {/* Corner Resize Handles */}
                    <div className="crop-handle nw" onPointerDown={e => handlePointerDown(e, 'nw')} />
                    <div className="crop-handle ne" onPointerDown={e => handlePointerDown(e, 'ne')} />
                    <div className="crop-handle se" onPointerDown={e => handlePointerDown(e, 'se')} />
                    <div className="crop-handle sw" onPointerDown={e => handlePointerDown(e, 'sw')} />

                    {/* Edge Resize Handles */}
                    <div className="crop-handle n" onPointerDown={e => handlePointerDown(e, 'n')} />
                    <div className="crop-handle s" onPointerDown={e => handlePointerDown(e, 's')} />
                    <div className="crop-handle e" onPointerDown={e => handlePointerDown(e, 'e')} />
                    <div className="crop-handle w" onPointerDown={e => handlePointerDown(e, 'w')} />
                  </div>
                )}
              </div>
            ) : (
              <div className="crop-empty-state">
                <p>No image loaded</p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="crop-file-btn">
                  Choose Image
                </button>
              </div>
            )}
          </div>

          {/* Live Resolution Readout & Alt Text */}
          <div className="crop-info-bar">
            <span className="crop-res-tag">
              📐 Output: <strong>{outputPixelW} × {outputPixelH} px</strong>
              {ratioKey !== 'free' && ` (${ratioKey})`}
            </span>
            <span className="crop-hint">💡 Drag any corner or edge handle to resize. Drag center to reposition.</span>
          </div>

          <div className="crop-alt-group">
            <label>
              <span>Image Alt Text (SEO &amp; Accessibility)</span>
              <input
                type="text"
                placeholder="Describe this image for SEO and screen readers..."
                value={altText}
                onChange={e => setAltText(e.target.value)}
              />
            </label>
          </div>

          {errorMessage && (
            <div className="crop-error-banner">{errorMessage}</div>
          )}
        </div>

        <footer className="crop-modal-footer">
          <button type="button" className="crop-cancel-btn" onClick={onClose} disabled={uploading}>
            Cancel
          </button>
          <button
            type="button"
            className="crop-submit-btn"
            onClick={handleApplyAndUpload}
            disabled={uploading || !imageSrc}
          >
            {uploading ? 'Processing & Uploading...' : 'Apply Crop & Upload ⤓'}
          </button>
        </footer>
      </div>
    </div>
  );
}
