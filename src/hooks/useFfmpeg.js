import { useState, useEffect, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export const useFfmpeg = () => {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState('Loading Video Engine...');
  const [progress, setProgress] = useState(0);
  const messageRef = useRef('Initializing...');

  const load = async () => {
    if (loaded) return;

    const ffmpegInstance = new FFmpeg();

    ffmpegInstance.on('log', ({ message }) => {
      messageRef.current = message;
      // We could parse complex logs here if needed
    });

    ffmpegInstance.on('progress', ({ progress, time }) => {
        // FFmpeg progress can sometimes be > 1 or < 0 depending on the operation
        // We clamp it to make it look nice in UI
        const p = Math.max(0, Math.min(1, progress));
        setProgress(Math.round(p * 100));
    });

    try {
      const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
      await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });

      setFfmpeg(ffmpegInstance);
      setLoaded(true);
      setMessage('Ready');
    } catch (error) {
      console.error('FFmpeg load error:', error);
      setMessage('Error loading engine. Device not supported?');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { ffmpeg, loaded, message, setMessage, progress, setProgress };
};
