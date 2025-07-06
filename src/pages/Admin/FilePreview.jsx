import React from "react";
import "../../styles/FilePreview.css"; 

const FilePreview = ({ files, currentIndex, onClose, onNext, onPrev, onDelete }) => {
  const file = files?.[currentIndex];
  if (!file) return null;

  return (
    <div className="file-preview-overlay">
      <div className="file-preview-modal">
        <button className="file-preview-close" onClick={onClose}>✖</button>

        <div className="file-preview-navigation">
          <button onClick={onPrev} disabled={currentIndex === 0} className="nav-arrow">⬅</button>

          <div className="file-preview-content">
            <p className="file-name">{file.name}</p>
            {file.type?.startsWith("image/") ? (
  <img src={file.base64} alt={file.name} className="file-preview-img" />
) : file.type === "application/pdf" ? (
  <embed src={file.base64} type="application/pdf" width="100%" height="400px" />
) : (
  <a href={file.base64} target="_blank" rel="noopener noreferrer">Open File</a>
)}

          </div>

          <button onClick={onNext} disabled={currentIndex === files.length - 1} className="nav-arrow">➡</button>
        </div>

        <button className="file-preview-delete" onClick={() => onDelete(currentIndex)}>
          🗑 Delete This File
        </button>
      </div>
    </div>
  );
};

export default FilePreview;
