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
