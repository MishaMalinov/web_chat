import { useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploadModal = ({ show, onClose, onFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);     // 🆕 keep chosen files

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: 100 * 1024 * 1024, // 100 MB
    multiple: true,
    onDrop: (files) => setSelectedFiles((prev) => [...prev, ...files]), // 🆕
  });

  const handleSend = () => {
    if (selectedFiles.length) onFiles(selectedFiles); // pass to parent
    setSelectedFiles([]);                             // reset
    onClose();                                        // close modal
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,.6)" }}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()} /* keep clicks inside */
      >
        <div className="modal-content">
          <div className="modal-header py-2">
            <h5 className="modal-title">Attach files</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div
              {...getRootProps({
                className:
                  "border border-secondary rounded d-flex flex-column align-items-center justify-content-center p-4 text-center",
              })}
              style={{ cursor: "pointer" }}
            >
              <input {...getInputProps()} />
              <p className="mb-2">
                {isDragActive
                  ? "Drop files here…"
                  : "Drag & drop files here or tap to browse"}
              </p>
              <small className="text-muted">Max size 100 MB</small>
            </div>

            {/* 🆕 list selected files */}
            {selectedFiles.length > 0 && (
              <ul className="list-group mt-3">
                {selectedFiles.map((f, i) => (
                  <li key={i} className="list-group-item py-1">
                    {f.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🆕 footer with Send */}
          <div className="modal-footer py-2">
            <button
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              disabled={!selectedFiles.length}
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
