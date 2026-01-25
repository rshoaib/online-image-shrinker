import { useState, useCallback } from 'react';
import heic2any from 'heic2any';

const useImageProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const processImage = useCallback(async (file, settings) => {
    setIsProcessing(true);
    setProgress(5); // Start

    return new Promise(async (resolve, reject) => {
      try {
        let imageSource = file;

        // Handle HEIC conversion
        if (file.type === 'image/heic' || file.type === 'image/heif' || file.name.toLowerCase().endsWith('.heic')) {
          setProgress(15); // Converting HEIC
          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: 'image/jpeg',
              quality: 0.9
            });
            imageSource = convertedBlob;
            // Handle edge case where heic2any returns array
            if (Array.isArray(imageSource)) imageSource = imageSource[0];
          } catch (e) {
            console.error("HEIC conversion failed", e);
            reject(new Error("Could not convert HEIC file."));
            return;
          }
        }

        const img = new Image();
        
        // Use ObjectURL for everything (faster/cleaner than FileReader)
        img.src = URL.createObjectURL(imageSource);

        img.onerror = reject;

        img.onload = () => {
          setProgress(50); // Image parsed
          
          // Simulate a small delay for UI feel if needed, usually canvas is sync but heavy
          requestAnimationFrame(() => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
    
              // Set dimensions
              canvas.width = settings.width;
              canvas.height = settings.height;
    
              // Better quality scaling
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
    
              // Draw image
              ctx.drawImage(img, 0, 0, settings.width, settings.height);

              // --------------------------------------------------------
              // WATERMARK LOGIC
              // --------------------------------------------------------
              if (settings.watermark && settings.watermark.text) {
                  const { text, color = '#ffffff', opacity = 0.5, size = 48, position = 'center' } = settings.watermark;
                  
                  // Scale font size relative to image width (using 1000px as base)
                  // This ensures consistency across different image sizes in the batch
                  const scale = Math.max(settings.width, settings.height) / 1000;
                  const fontSize = size * scale;

                  ctx.font = `bold ${fontSize}px sans-serif`;
                  ctx.fillStyle = color;
                  ctx.globalAlpha = opacity;
                  
                  // Calculate Position
                  let x = settings.width / 2;
                  let y = settings.height / 2;
                  const padding = 50 * scale;

                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';

                  if (position === 'tl') { 
                    x = padding; 
                    y = padding; 
                    ctx.textAlign = 'left'; 
                    ctx.textBaseline='top'; 
                  }
                  else if (position === 'tr') { 
                    x = settings.width - padding; 
                    y = padding; 
                    ctx.textAlign = 'right'; 
                    ctx.textBaseline='top'; 
                  }
                  else if (position === 'bl') { 
                    x = padding; 
                    y = settings.height - padding; 
                    ctx.textAlign = 'left'; 
                    ctx.textBaseline='bottom'; 
                  }
                  else if (position === 'br') { 
                    x = settings.width - padding; 
                    y = settings.height - padding; 
                    ctx.textAlign = 'right'; 
                    ctx.textBaseline='bottom'; 
                  }

                  ctx.fillText(text, x, y);
                  
                  // Reset alpha for safety
                  ctx.globalAlpha = 1.0;
              }

              setProgress(75); // Drawn
    
              // Compress and Convert
              const mimeType = `image/${settings.format}`;
              const quality = settings.quality / 100;
    
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    setProgress(100); // Done
                    resolve({ 
                      blob, 
                      url, 
                      size: blob.size,
                      width: settings.width,
                      height: settings.height
                    });
                  } else {
                    reject(new Error('Compression failed'));
                  }
                  setIsProcessing(false);
                  setTimeout(() => setProgress(0), 500); // Reset
                  
                  // Cleanup original ObjectURL if we made one from HEIC
                  if (imageSource !== file) {
                    URL.revokeObjectURL(img.src);
                  }
                },
                mimeType,
                quality
              );
          });
        };
      } catch (err) {
        setIsProcessing(false);
        reject(err);
      }
    });
  }, []);

  const getImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
    });
  };

  return {
    processImage,
    isProcessing,
    progress,
    getImageDimensions
  };
};

export default useImageProcessor;
