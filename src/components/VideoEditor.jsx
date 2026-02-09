import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Video, Download, Settings, Loader2, AlertTriangle, Play } from 'lucide-react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const VideoEditor = ({ file, onBack }) => {
  const [ffmpeg, setFfmpeg] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Loading FFmpeg core...');
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(0);
  const videoRef = useRef(null);
  const messageRef = useRef('Initializing...');

  // Settings
  const [quality, setQuality] = useState('medium'); // low, medium, high
  const [resolution, setResolution] = useState('original'); // original, 720p, 480p

  const loadFfmpeg = async () => {
    const ffmpegInstance = new FFmpeg();
    
    ffmpegInstance.on('log', ({ message }) => {
      messageRef.current = message;
      // Parse progress if possible (complex for ffmpeg raw logs, but cleaner to just show message)
    });

    ffmpegInstance.on('progress', ({ progress, time }) => {
      setProgress(Math.round(progress * 100));
    });

    try {
      // Load ffmpeg.wasm from unpkg (standard CDN approach)
      // We need to use toBlobURL to bypass some CSP/MIME issues in certain envs
      const baseURL = 'https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm';
      
      await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript'),
      });

      setFfmpeg(ffmpegInstance);
      setLoaded(true);
      setMessage('Ready to compress');
    } catch (error) {
      console.error('FFmpeg load error:', error);
      setMessage('Error loading video engine. Your browser might not support SharedArrayBuffer.');
    }
  };

  useEffect(() => {
    loadFfmpeg();
  }, []);

  const getCompressionArgs = () => {
    // Basic compression mapping
    // Medium is the sweet spot: crf 23-28
    let crf = '23'; // Medium
    let preset = 'medium';

    if (quality === 'low') {
      crf = '28'; // Lower quality, smaller size
      preset = 'faster';
    } else if (quality === 'high') {
      crf = '18'; // Higher quality, larger size
      preset = 'slow';
    }

    const args = [
      '-i', 'input.mp4',
      '-c:v', 'libx264',
      '-crf', crf,
      '-preset', preset,
      '-c:a', 'aac',
      '-b:a', '128k',
    ];

    if (resolution === '720p') {
      args.push('-vf', 'scale=-2:720');
    } else if (resolution === '480p') {
      args.push('-vf', 'scale=-2:480');
    }

    args.push('output.mp4');
    return args;
  };

  const processVideo = async () => {
    if (!loaded || !ffmpeg) return;
    setProcessing(true);
    setProgress(0);
    setMessage('Writing file to memory...');

    try {
      // 1. Write file to ffmpeg memory
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));

      // 2. Run compression
      setMessage('Compressing... this may take a while.');
      const args = getCompressionArgs();
      await ffmpeg.exec(args);

      // 3. Read output
      setMessage('Finalizing...');
      const data = await ffmpeg.readFile('output.mp4');
      
      // 4. Create URL
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
      setOutputUrl(url);
      setOutputSize(data.byteLength);
      setMessage('Done!');
    } catch (error) {
      console.error('Compression error:', error);
      setMessage('Error during compression.');
    } finally {
      setProcessing(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="editor-container">
      <div className="toolbar">
        <button onClick={onBack} className="back-btn">
          <ArrowLeft size={20} /> Back
        </button>
        <h3>Video Compressor</h3>
      </div>

      <div className="main-content">
        <div className="preview-section">
          <div className="video-wrapper">
             {/* Show original or output */}
             <video 
               ref={videoRef} 
               src={outputUrl ? outputUrl : URL.createObjectURL(file)} 
               controls 
               className="video-player"
             />
             <div className="file-info">
               <span>Input: {formatSize(file.size)}</span>
               {outputUrl && <span className="success-text">Output: {formatSize(outputSize)} (Saved {Math.round((1 - outputSize/file.size)*100)}%)</span>}
             </div>
          </div>
        </div>

        <div className="settings-panel">
          <div className="settings-group">
             <label><Settings size={16}/> Compression Quality</label>
             <select value={quality} onChange={(e) => setQuality(e.target.value)} disabled={processing}>
               <option value="medium">Balanced (Recommended)</option>
               <option value="low">Max Compression (Lower Quality)</option>
               <option value="high">High Quality (Larger Size)</option>
             </select>
          </div>

          <div className="settings-group">
             <label>Resolution</label>
             <select value={resolution} onChange={(e) => setResolution(e.target.value)} disabled={processing}>
               <option value="original">Original</option>
               <option value="720p">720p HD</option>
               <option value="480p">480p SD</option>
             </select>
          </div>

          {!loaded && (
            <div className="engine-status">
               <Loader2 className="spin" size={20} />
               <span>Loading Compression Engine...</span>
            </div>
          )}

          {loaded && !processing && !outputUrl && (
             <button className="primary-btn" onClick={processVideo}>
               <Video size={20} /> Compress Video
             </button>
          )}

          {processing && (
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${progress}%`}}></div>
              </div>
              <p>{message} ({progress}%)</p>
            </div>
          )}

          {outputUrl && (
             <a href={outputUrl} download={`compressed_${file.name}`} className="download-btn">
               <Download size={20} /> Download Compressed Video
             </a>
          )}
        </div>
      </div>

      <style>{`
        .editor-container {
          max-width: 1000px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        .toolbar {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          cursor: pointer;
          font-weight: 500;
        }

        .main-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 32px;
        }

        .video-wrapper {
          background: #000;
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .video-player {
          width: 100%;
          border-radius: var(--radius-md);
          max-height: 500px;
        }

        .file-info {
          display: flex;
          justify-content: space-between;
          color: #fff;
          font-size: 0.9rem;
        }

        .success-text {
          color: #10B981;
          font-weight: bold;
        }

        .settings-panel {
          background: var(--bg-panel);
          padding: 24px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
          display: flex;
          flex-direction: column;
          gap: 24px;
          height: fit-content;
        }

        .settings-group {
           display: flex;
           flex-direction: column;
           gap: 8px;
        }

        .settings-group label {
           display: flex;
           align-items: center;
           gap: 8px;
           font-weight: 500;
           color: var(--text-main);
        }

        select {
          padding: 10px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          background: var(--bg-surface);
          color: var(--text-main);
          font-size: 0.95rem;
        }

        .primary-btn, .download-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px;
          border-radius: var(--radius-md);
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
        }

        .primary-btn {
          background: var(--primary);
          color: #000;
        }

        .download-btn {
          background: #10B981;
          color: #fff;
          text-decoration: none;
        }

        .engine-status {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--text-muted);
          font-size: 0.9rem;
          background: var(--bg-surface);
          padding: 12px;
          border-radius: var(--radius-md);
        }

        .progress-container {
          text-align: center;
        }

        .progress-bar {
          height: 8px;
          background: var(--bg-surface);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: var(--primary);
          transition: width 0.3s ease;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }

        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoEditor;
