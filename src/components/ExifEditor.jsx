import { useState, useRef, useEffect } from 'react';
import { Upload, X, MapPin, Calendar, Camera, Download, ShieldCheck, Eye, RefreshCw } from 'lucide-react';
import EXIF from 'exif-js';
import Controls from './Controls';

const ExifEditor = ({ files, setFiles, onBack }) => {
  const [activeFile, setActiveFile] = useState(files[0] || null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cleanedUrl, setCleanedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (activeFile) {
      extractExif(activeFile);
      setCleanedUrl(null); // Reset cleaned state on new file
    }
  }, [activeFile]);

  // Extract EXIF Data using exif-js
  const extractExif = (file) => {
    setLoading(true);
    setMetadata(null);

    // Create a FileReader to read the file as an ArrayBuffer for exif-js
    const reader = new FileReader();
    reader.onload = function(e) {
        // EXIF.readFromBinaryFile is synchronous but efficient enough for client-side valid images
        // We use a small timeout to let the UI render state changes if needed
        setTimeout(() => {
             const data = EXIF.readFromBinaryFile(e.target.result);
             
             // Process and clean up the data for display
             if (data && Object.keys(data).length > 0) {
                 const formatted = {
                     Make: data.Make,
                     Model: data.Model,
                     DateTime: data.DateTimeOriginal || data.DateTime,
                     ExposureTime: data.ExposureTime ? `1/${Math.round(1/data.ExposureTime)}` : null,
                     FNumber: data.FNumber ? `f/${data.FNumber}` : null,
                     ISO: data.ISOSpeedRatings,
                     GPSLatitude: data.GPSLatitude,
                     GPSLongitude: data.GPSLongitude,
                     Software: data.Software,
                     raw: data // Keep raw for advanced view
                 };
                 
                 // Convert GPS to decimal if available
                 if (data.GPSLatitude && data.GPSLongitude) {
                     const toDecimal = (coords, ref) => {
                        let decimal = coords[0] + coords[1]/60 + coords[2]/3600;
                        if (ref === 'S' || ref === 'W') decimal = -decimal;
                        return decimal;
                     };
                     formatted.lat = toDecimal(data.GPSLatitude, data.GPSLatitudeRef);
                     formatted.lng = toDecimal(data.GPSLongitude, data.GPSLongitudeRef);
                 }
                 
                 setMetadata(formatted);
             } else {
                 setMetadata({ isEmpty: true });
             }
             setLoading(false);
        }, 10);
    };
    reader.readAsArrayBuffer(file);
  };

  const removeMetadata = () => {
    if (!activeFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Exporting as new Blob strips all EXIF data
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setCleanedUrl(url);
        setIsProcessing(false);
      }, activeFile.type, 0.92); // Keep high quality
    };
    img.src = URL.createObjectURL(activeFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="editor-container">
      {/* LEFT: Preview & Controls */}
      <div className="preview-area">
        <div className="image-preview-wrapper" style={{ background: 'var(--bg-card)' }}>
             <img 
               src={activeFile ? URL.createObjectURL(activeFile) : ''} 
               alt="Preview" 
               className="main-preview"
               style={{ maxHeight: '50vh', objectFit: 'contain' }}
             />
             {cleanedUrl && (
                 <div className="success-overlay">
                     <ShieldCheck size={48} color="#4ade80" />
                     <h3>Metadata Removed!</h3>
                     <p>Your image is now clean.</p>
                 </div>
             )}
        </div>

        <div className="action-bar">
             {!cleanedUrl ? (
                 <button 
                  className={`btn-primary ${isProcessing ? 'loading' : ''}`}
                  onClick={removeMetadata}
                  disabled={loading || isProcessing}
                 >
                    {isProcessing ? 'Cleaning...' : 'Remove Metadata & Clean File'}
                 </button>
             ) : (
                <div className="download-group">
                    <a href={cleanedUrl} download={`clean_${activeFile.name}`} className="btn-primary">
                        <Download size={18} /> Download Clean Image
                    </a>
                    <button className="btn-secondary" onClick={() => setCleanedUrl(null)}>
                        <RefreshCw size={18} /> Process Another
                    </button>
                </div>
             )}
        </div>
      </div>

      {/* RIGHT: Metadata Viewer */}
      <div className="controls-area">
        <div className="panel-header">
           <h2>EXIF Metadata</h2>
           <button onClick={onBack} className="close-btn"><X size={20} /></button>
        </div>

        <div className="metadata-scroll">
            {loading ? (
                <div className="loading-state">Scanning file...</div>
            ) : metadata?.isEmpty ? (
                <div className="empty-state">
                    <ShieldCheck size={48} style={{ opacity: 0.2 }} />
                    <p>No privacy-sensitive metadata found in this file.</p>
                </div>
            ) : metadata ? (
                <div className="metadata-grid">
                    {/* Privacy Alert */}
                    {(metadata.lat || metadata.Make) && (
                        <div className="alert warning">
                            <Eye size={16} />
                            <span>This image contains hidden personal data.</span>
                        </div>
                    )}

                    {/* GPS Section */}
                    {metadata.lat && (
                        <div className="meta-card gps">
                            <div className="card-lbl"><MapPin size={14} /> Location Data</div>
                            <div className="coords">
                                {metadata.lat.toFixed(4)}, {metadata.lng.toFixed(4)}
                            </div>
                            <a 
                              href={`https://www.google.com/maps?q=${metadata.lat},${metadata.lng}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="map-link"
                            >
                                View on Google Maps
                            </a>
                        </div>
                    )}

                    {/* Camera Info */}
                    {metadata.Make && (
                        <div className="meta-card">
                             <div className="card-lbl"><Camera size={14} /> Device Info</div>
                             <div className="meta-row"><span>Device</span> <b>{metadata.Make} {metadata.Model}</b></div>
                             <div className="meta-row"><span>Software</span> <b>{metadata.Software || 'N/A'}</b></div>
                        </div>
                    )}

                    {/* Settings */}
                    {(metadata.ISO || metadata.FNumber) && (
                        <div className="meta-card">
                             <div className="card-lbl"><RefreshCw size={14} /> Camera Settings</div>
                             <div className="grid-2">
                                 <div><span>ISO</span> <b>{metadata.ISO}</b></div>
                                 <div ><span>Aperture</span> <b>{metadata.FNumber}</b></div>
                                 <div ><span>Shutter</span> <b>{metadata.ExposureTime}</b></div>
                             </div>
                        </div>
                    )}

                    {/* Date */}
                    {metadata.DateTime && (
                         <div className="meta-card">
                             <div className="card-lbl"><Calendar size={14} /> Date Taken</div>
                             <div>{metadata.DateTime}</div>
                         </div>
                    )}

                    {/* File Info */}
                    <div className="meta-card">
                         <div className="card-lbl">File Info</div>
                         <div className="meta-row"><span>Name</span> <span className="truncate">{activeFile.name}</span></div>
                         <div className="meta-row"><span>Size</span> <b>{formatFileSize(activeFile.size)}</b></div>
                         <div className="meta-row"><span>Type</span> <b>{activeFile.type}</b></div>
                    </div>

                </div>
            ) : (
                <div className="empty-state">Select a file to extract data</div>
            )}
        </div>
      </div>

      <style>{`
        .editor-container {
          display: flex;
          height: calc(100vh - 80px);
          background: var(--bg-a);
        }
        .preview-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 20px;
          gap: 20px;
          align-items: center;
          justify-content: center;
        }
        .controls-area {
          width: 320px;
          background: var(--bg-surface);
          border-left: 1px solid var(--border);
          display: flex;
          flex-direction: column;
        }
        .image-preview-wrapper {
            position: relative;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 100%;
        }
        .success-overlay {
            position: absolute;
            inset: 0;
            background: rgba(255,255,255,0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            backdrop-filter: blur(5px);
            animation: fadeIn 0.3s ease;
        }
        .success-overlay h3 { margin: 10px 0 5px; color: #15803d; }
        .success-overlay p { color: #166534; }
        
        .action-bar {
            width: 100%;
            max-width: 400px;
        }
        .download-group {
            display: flex;
            gap: 10px;
            flex-direction: column;
        }
        .btn-primary {
            width: 100%;
            padding: 14px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: 0.2s;
            text-decoration: none;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .btn-secondary {
            width: 100%;
            padding: 12px;
            background: rgba(0,0,0,0.05);
            color: var(--text-main);
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn-secondary:hover { background: rgba(0,0,0,0.1); }

        .metadata-scroll {
            padding: 20px;
            overflow-y: auto;
            flex: 1;
        }
        .panel-header {
            padding: 20px;
            border-bottom: 1px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .panel-header h2 { font-size: 1.2rem; margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); }
        
        .metadata-grid { display: flex; flex-direction: column; gap: 16px; }
        .meta-card {
            background: var(--bg-card);
            border: 1px solid var(--border);
            padding: 12px;
            border-radius: 8px;
            font-size: 0.9rem;
        }
        .card-lbl { color: var(--text-muted); font-size: 0.75rem; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.8; }
        .alert {
            padding: 12px;
            border-radius: 8px;
            display: flex;
            gap: 10px;
            align-items: center;
            font-size: 0.9rem;
        }
        .alert.warning { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
        
        .meta-row { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .map-link {
            display: block;
            margin-top: 8px;
            color: var(--primary);
            text-decoration: underline;
            font-size: 0.85rem;
        }
        .truncate { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        @media (max-width: 768px) {
            .editor-container { flex-direction: column; height: auto; }
            .controls-area { width: 100%; border-left: none; border-top: 1px solid var(--border); }
        }
      `}</style>
    </div>
  );
};

export default ExifEditor;
