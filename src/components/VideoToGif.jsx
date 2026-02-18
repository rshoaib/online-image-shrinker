import { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, Download, Settings, Loader2 } from 'lucide-react';
import { fetchFile } from '@ffmpeg/util';
import { useFfmpeg } from '../hooks/useFfmpeg';

const VideoToGif = ({ file, onBack }) => {
  const { ffmpeg, loaded, message, setMessage, progress, setProgress } = useFfmpeg();
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(0);
  
  // Settings
  const [fps, setFps] = useState('15');
  const [width, setWidth] = useState('320'); // 320, 480, -1 (original)

  const processGif = async () => {
    if (!loaded || !ffmpeg) return;
    setProcessing(true);
    setProgress(0);
    setMessage('Loading video...');

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));

      setMessage('Generating palette (Step 1/2)...');
      
      // Complex filter for high quality GIF:
      // 1. fps filter
      // 2. scale filter
      // 3. split into two streams
      // 4. generate palette from stream 1
      // 5. use palette on stream 2
      const filter = `fps=${fps},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse`;
      
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-vf', filter,
        'output.gif'
      ]);

      setMessage('Reading output...');
      const data = await ffmpeg.readFile('output.gif');
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
      
      setOutputUrl(url);
      setOutputSize(data.byteLength);
      setMessage('Done!');
    } catch (error) {
      console.error('GIF error:', error);
      setMessage('Error converting to GIF.');
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
        <h3>Video to GIF Converter</h3>
      </div>

      <div className="main-content">
        <div className="preview-section">
           {outputUrl ? (
             <div className="result-wrapper">
               <img src={outputUrl} alt="Generated GIF" className="preview-media" loading="lazy" />
               <div className="file-info text-center">
                 <span className="success-text">Generated GIF ({formatSize(outputSize)})</span>
               </div>
             </div>
           ) : (
             <div className="video-wrapper">
               <video src={URL.createObjectURL(file)} controls className="preview-media" />
               <div className="file-info">
                 <span>Input: {formatSize(file.size)}</span>
               </div>
             </div>
           )}
        </div>

        <div className="settings-panel">
          <div className="settings-group">
             <label><Settings size={16}/> FPS (Smoothness)</label>
             <select value={fps} onChange={(e) => setFps(e.target.value)} disabled={processing}>
               <option value="10">10 FPS (Smaller Size)</option>
               <option value="15">15 FPS (Standard)</option>
               <option value="24">24 FPS (Smooth)</option>
             </select>
          </div>

          <div className="settings-group">
             <label>Width Size</label>
             <select value={width} onChange={(e) => setWidth(e.target.value)} disabled={processing}>
               <option value="320">320px (Social Media)</option>
               <option value="480">480px (Medium)</option>
               <option value="-1">Original Width (Large)</option>
             </select>
          </div>

          {!loaded && (
            <div className="engine-status">
               <Loader2 className="spin" size={20} />
               <span>Loading Engine...</span>
            </div>
          )}

          {loaded && !processing && !outputUrl && (
             <button className="primary-btn" onClick={processGif}>
               <ImageIcon size={20} /> Convert to GIF
             </button>
          )}

          {processing && (
            <div className="progress-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${progress}%`}}></div>
              </div>
              <p>{message}</p>
            </div>
          )}

          {outputUrl && (
             <a href={outputUrl} download={`converted_${file.name.split('.')[0]}.gif`} className="download-btn">
               <Download size={20} /> Download GIF
             </a>
          )}
        </div>
      </div>

      <style>{`
        .editor-container { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; animation: fadeIn 0.3s ease-out; }
        .toolbar { display: flex; align-items: center; gap: 16px; }
        .back-btn { background: none; border: none; display: flex; align-items: center; gap: 8px; color: var(--text-muted); cursor: pointer; font-weight: 500; }
        .main-content { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
        .preview-section { background: #000; border-radius: var(--radius-lg); padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; }
        .preview-media { max-width: 100%; max-height: 500px; border-radius: var(--radius-md); }
        .file-info { color: #fff; margin-top: 10px; font-size: 0.9rem; }
        .success-text { color: #10B981; font-weight: bold; }
        .settings-panel { background: var(--bg-panel); padding: 24px; border-radius: var(--radius-lg); border: 1px solid var(--border-light); display: flex; flex-direction: column; gap: 24px; height: fit-content; }
        .settings-group { display: flex; flex-direction: column; gap: 8px; }
        select { padding: 10px; border-radius: var(--radius-md); border: 1px solid var(--border-light); background: var(--bg-surface); color: var(--text-main); }
        .primary-btn, .download-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; border-radius: var(--radius-md); border: none; font-weight: 600; cursor: pointer; }
        .primary-btn { background: var(--primary); color: #000; }
        .download-btn { background: #10B981; color: #fff; text-decoration: none; }
        .engine-status { display: flex; align-items: center; gap: 10px; color: var(--text-muted); background: var(--bg-surface); padding: 12px; border-radius: var(--radius-md); }
        .progress-bar { height: 8px; background: var(--bg-surface); border-radius: 4px; overflow: hidden; margin-bottom: 8px; }
        .progress-fill { height: 100%; background: var(--primary); transition: width 0.3s ease; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .main-content { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
};

export default VideoToGif;
