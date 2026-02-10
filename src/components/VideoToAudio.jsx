import { useState } from 'react';
import { ArrowLeft, Music, Download, Settings, Loader2 } from 'lucide-react';
import { fetchFile } from '@ffmpeg/util';
import { useFfmpeg } from '../hooks/useFfmpeg';

const VideoToAudio = ({ file, onBack }) => {
  const { ffmpeg, loaded, message, setMessage, progress, setProgress } = useFfmpeg();
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState(null);
  const [outputSize, setOutputSize] = useState(0);
  
  // Settings
  const [bitrate, setBitrate] = useState('192k');

  const processAudio = async () => {
    if (!loaded || !ffmpeg) return;
    setProcessing(true);
    setProgress(0);
    setMessage('Extracting audio...');

    try {
      await ffmpeg.writeFile('input.mp4', await fetchFile(file));

      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-vn', // No video
        '-c:a', 'libmp3lame',
        '-b:a', bitrate,
        'output.mp3'
      ]);

      setMessage('Finalizing...');
      const data = await ffmpeg.readFile('output.mp3');
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
      
      setOutputUrl(url);
      setOutputSize(data.byteLength);
      setMessage('Done!');
    } catch (error) {
      console.error('Audio error:', error);
      setMessage('Error extracting audio.');
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
        <h3>Video to MP3 Converter</h3>
      </div>

      <div className="main-content">
        <div className="preview-section">
           <div className="icon-display">
             <Music size={64} color="#fff" />
             <p className="file-name">{file.name}</p>
             <p className="file-size">{formatSize(file.size)}</p>
           </div>
           
           {outputUrl && (
             <div className="audio-player-wrapper">
                <audio src={outputUrl} controls className="audio-player" />
                <span className="success-text">MP3 Ready ({formatSize(outputSize)})</span>
             </div>
           )}
        </div>

        <div className="settings-panel">
          <div className="settings-group">
             <label><Settings size={16}/> Audio Quality (Bitrate)</label>
             <select value={bitrate} onChange={(e) => setBitrate(e.target.value)} disabled={processing}>
               <option value="128k">128 kbps (Standard)</option>
               <option value="192k">192 kbps (High Quality)</option>
               <option value="320k">320 kbps (Max Quality)</option>
             </select>
          </div>

          {!loaded && (
            <div className="engine-status">
               <Loader2 className="spin" size={20} />
               <span>Loading Engine...</span>
            </div>
          )}

          {loaded && !processing && !outputUrl && (
             <button className="primary-btn" onClick={processAudio}>
               <Music size={20} /> Extract Audio
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
             <a href={outputUrl} download={`extracted_${file.name.split('.')[0]}.mp3`} className="download-btn">
               <Download size={20} /> Download MP3
             </a>
          )}
        </div>
      </div>

      <style>{`
        .editor-container { max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; animation: fadeIn 0.3s ease-out; }
        .toolbar { display: flex; align-items: center; gap: 16px; }
        .back-btn { background: none; border: none; display: flex; align-items: center; gap: 8px; color: var(--text-muted); cursor: pointer; font-weight: 500; }
        .main-content { display: grid; grid-template-columns: 1.5fr 1fr; gap: 32px; }
        .preview-section { background: linear-gradient(135deg, #3B82F6, #8B5CF6); border-radius: var(--radius-lg); padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; color: white; gap: 20px; text-align: center; }
        .icon-display { display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .file-name { font-weight: 600; font-size: 1.1rem; }
        .file-size { opacity: 0.8; font-size: 0.9rem; }
        .audio-player-wrapper { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; margin-top: 20px; }
        .audio-player { width: 100%; }
        .success-text { color: #fff; font-weight: bold; background: rgba(0,0,0,0.2); padding: 5px 10px; border-radius: 20px; font-size: 0.9rem; }
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

export default VideoToAudio;
