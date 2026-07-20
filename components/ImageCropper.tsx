'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0, size: 0 });
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    startCrop: { x: number; y: number; size: number };
    action: 'drag' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br' | null;
  }>({
    startX: 0,
    startY: 0,
    startCrop: { x: 0, y: 0, size: 0 },
    action: null
  });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const renderedWidth = img.clientWidth;
    const renderedHeight = img.clientHeight;
    
    setImgDimensions({ width: renderedWidth, height: renderedHeight });
    
    // Initialize crop box to be square, centered, taking up 60% of min dimension
    const minDim = Math.min(renderedWidth, renderedHeight);
    const size = Math.round(minDim * 0.6);
    const x = Math.round((renderedWidth - size) / 2);
    const y = Math.round((renderedHeight - size) / 2);
    
    setCrop({ x, y, size });
    setImageLoaded(true);
  };

  // Recalculate dimensions on window resize
  useEffect(() => {
    if (!imageLoaded) return;
    
    const handleResize = () => {
      if (imgRef.current) {
        const renderedWidth = imgRef.current.clientWidth;
        const renderedHeight = imgRef.current.clientHeight;
        
        setImgDimensions({ width: renderedWidth, height: renderedHeight });
        
        // Scale the crop box proportionally
        setCrop(prev => {
          const ratioX = renderedWidth / imgDimensions.width;
          const ratioY = renderedHeight / imgDimensions.height;
          const scale = Math.min(ratioX, ratioY);
          
          const newSize = Math.round(prev.size * scale);
          const newX = Math.round(prev.x * ratioX);
          const newY = Math.round(prev.y * ratioY);
          
          return {
            x: Math.max(0, Math.min(newX, renderedWidth - newSize)),
            y: Math.max(0, Math.min(newY, renderedHeight - newSize)),
            size: Math.max(50, Math.min(newSize, Math.min(renderedWidth, renderedHeight)))
          };
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [imageLoaded, imgDimensions]);

  // Mouse/Touch Drag and Resize Handlers
  const startDragOrResize = (e: React.MouseEvent | React.TouchEvent, action: 'drag' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br') => {
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      startCrop: { ...crop },
      action
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  };

  const handleDragResizeLogic = (clientX: number, clientY: number) => {
    const { startX, startY, startCrop, action } = dragStartRef.current;
    if (!action) return;

    const dx = clientX - startX;
    const dy = clientY - startY;
    
    const { width: imgW, height: imgH } = imgDimensions;

    if (action === 'drag') {
      const newX = Math.max(0, Math.min(startCrop.x + dx, imgW - startCrop.size));
      const newY = Math.max(0, Math.min(startCrop.y + dy, imgH - startCrop.size));
      setCrop(prev => ({ ...prev, x: newX, y: newY }));
    } else {
      // 1:1 Aspect Ratio Resize calculations
      let newSize = startCrop.size;
      let newX = startCrop.x;
      let newY = startCrop.y;

      if (action === 'resize-br') {
        const delta = Math.max(dx, dy); // Maintain square shape using larger drag
        newSize = Math.max(50, startCrop.size + delta);
        // Clamp newSize within remaining image boundaries
        newSize = Math.min(newSize, imgW - startCrop.x, imgH - startCrop.y);
      } else if (action === 'resize-tl') {
        const delta = Math.min(dx, dy); // Dragging top-left inward (positive dx/dy) shrinks it
        newSize = Math.max(50, startCrop.size - delta);
        newSize = Math.min(newSize, startCrop.x + startCrop.size, startCrop.y + startCrop.size);
        newX = startCrop.x + (startCrop.size - newSize);
        newY = startCrop.y + (startCrop.size - newSize);
      } else if (action === 'resize-tr') {
        const delta = Math.max(-dx, dy); // Dragging top-right inward shrinks it
        newSize = Math.max(50, startCrop.size - delta);
        newSize = Math.min(newSize, imgW - startCrop.x, startCrop.y + startCrop.size);
        newY = startCrop.y + (startCrop.size - newSize);
      } else if (action === 'resize-bl') {
        const delta = Math.max(dx, -dy); // Dragging bottom-left inward shrinks it
        newSize = Math.max(50, startCrop.size - delta);
        newSize = Math.min(newSize, startCrop.x + startCrop.size, imgH - startCrop.y);
        newX = startCrop.x + (startCrop.size - newSize);
      }

      setCrop({ x: newX, y: newY, size: newSize });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleDragResizeLogic(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (e.touches.length > 0) {
      handleDragResizeLogic(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleMouseUp = () => {
    dragStartRef.current.action = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleMouseUp);
  };

  // Clean up global listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, []);

  const handleCrop = async () => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    
    // Create an offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Calculate natural image coordinate scaling
    const scaleX = img.naturalWidth / imgDimensions.width;
    const scaleY = img.naturalHeight / imgDimensions.height;

    const sx = crop.x * scaleX;
    const sy = crop.y * scaleY;
    const sWidth = crop.size * scaleX;
    const sHeight = crop.size * scaleY;

    // Smooth scaling settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw cropped image onto canvas
    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, 512, 512);

    canvas.toBlob((blob) => {
      if (!blob) return;
      
      const file = new File([blob], 'cropped-avatar.png', {
        type: 'image/png',
        lastModified: Date.now()
      });
      
      onCropComplete(file);
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-100 max-w-md w-full overflow-hidden flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Crop Profile Picture</h4>
            <p className="text-[10px] text-neutral-400 mt-0.5">Drag to move and resize the square crop container.</p>
          </div>
          <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cropper Work Area */}
        <div className="flex-1 bg-neutral-950 p-6 flex items-center justify-center min-h-[300px] max-h-[400px]">
          <div ref={containerRef} className="relative select-none max-w-full max-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Source Crop"
              onLoad={handleImageLoad}
              className="max-w-full max-h-[300px] object-contain pointer-events-none"
            />
            
            {imageLoaded && (
              <div className="absolute inset-0 pointer-events-none bg-black/50">
                {/* Visual crop box area */}
                <div
                  className="absolute border-2 border-violet-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-auto cursor-move flex items-center justify-center"
                  style={{
                    left: `${crop.x}px`,
                    top: `${crop.y}px`,
                    width: `${crop.size}px`,
                    height: `${crop.size}px`
                  }}
                  onMouseDown={(e) => startDragOrResize(e, 'drag')}
                  onTouchStart={(e) => startDragOrResize(e, 'drag')}
                >
                  {/* 3x3 Grid Overlay (turn on 3x3 grids as requested) */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {/* Horizontal grid lines */}
                    <div className="border-b border-white/40 border-dashed col-span-3 row-start-1"></div>
                    <div className="border-b border-white/40 border-dashed col-span-3 row-start-2"></div>
                    
                    {/* Vertical grid lines */}
                    <div className="border-r border-white/40 border-dashed row-span-3 col-start-1"></div>
                    <div className="border-r border-white/40 border-dashed row-span-3 col-start-2"></div>
                  </div>

                  {/* Corner Resize Handles */}
                  {/* Top-Left */}
                  <div
                    className="absolute -top-1.5 -left-1.5 h-3 w-3 bg-white border-2 border-violet-600 rounded-full cursor-nwse-resize shadow-sm"
                    onMouseDown={(e) => { e.stopPropagation(); startDragOrResize(e, 'resize-tl'); }}
                    onTouchStart={(e) => { e.stopPropagation(); startDragOrResize(e, 'resize-tl'); }}
                  />
                  {/* Top-Right */}
                  <div
                    className="absolute -top-1.5 -right-1.5 h-3 w-3 bg-white border-2 border-violet-600 rounded-full cursor-nesw-resize shadow-sm"
                    onMouseDown={(e) => { e.stopPropagation(); startDragOrResize(e, 'resize-tr'); }}
                    onTouchStart={(e) => { e.stopPropagation(); startDragOrResize(e, 'resize-tr'); }}
                  />
                  {/* Bottom-Left */}
                  <div
                    className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-white border-2 border-violet-600 rounded-full cursor-nesw-resize shadow-sm"
                    onMouseDown={(e) => { e.stopPropagation(); startDragOrResize(e, 'resize-bl'); }}
                    onTouchStart={(e) => { e.stopPropagation(); startDragOrResize(e, 'resize-bl'); }}
                  />
                  {/* Bottom-Right */}
                  <div
                    className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-white border-2 border-violet-600 rounded-full cursor-nwse-resize shadow-sm"
                    onMouseDown={(e) => { e.stopPropagation(); startDragOrResize(e, 'resize-br'); }}
                    onTouchStart={(e) => { e.stopPropagation(); startDragOrResize(e, 'resize-br'); }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            disabled={!imageLoaded}
            className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50 transition-all cursor-pointer"
          >
            Crop & Apply
          </button>
        </div>

      </div>
    </div>
  );
}
