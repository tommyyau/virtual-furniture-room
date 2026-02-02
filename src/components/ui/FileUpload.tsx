import { useDropzone, type Accept } from 'react-dropzone';
import type { ReactNode } from 'react';
import './FileUpload.css';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Accept;
  maxSize?: number;
  children?: ReactNode;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
  maxSize = 10 * 1024 * 1024, // 10MB
  children,
  className = '',
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`file-upload ${isDragActive ? 'file-upload-active' : ''} ${isDragReject ? 'file-upload-reject' : ''} ${className}`}
    >
      <input {...getInputProps()} />
      {children || (
        <div className="file-upload-content">
          <div className="file-upload-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="file-upload-text">
            {isDragActive
              ? 'Drop the image here'
              : 'Drag & drop an image, or click to select'}
          </p>
          <p className="file-upload-hint">PNG, JPG, WEBP up to 10MB</p>
        </div>
      )}
    </div>
  );
}
