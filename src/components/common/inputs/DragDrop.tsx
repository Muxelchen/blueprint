import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText } from 'lucide-react';

export interface DragDropFile {
  id: string;
  file: File;
  preview?: string;
  progress?: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
}

export interface DragDropProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onFilesAdded?: (files: DragDropFile[]) => void;
  onFileRemoved?: (fileId: string) => void;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const DragDrop: React.FC<DragDropProps> = ({
  accept = '*/*',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  onFilesAdded,
  onFileRemoved,
  className = '',
  disabled = false,
  children,
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState<DragDropFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const createFileObject = (file: File): DragDropFile => {
    const fileObj: DragDropFile = {
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      status: 'pending',
    };

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        setFiles(prev =>
          prev.map(f => (f.id === fileObj.id ? { ...f, preview: e.target?.result as string } : f))
        );
      };
      reader.readAsDataURL(file);
    }

    return fileObj;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File "${file.name}" is too large. Maximum size is ${formatFileSize(maxSize)}.`;
    }

    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isValidType = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes('/*')) {
          const category = type.split('/')[0];
          return file.type.startsWith(category);
        }
        return file.type === type;
      });

      if (!isValidType) {
        return `File "${file.name}" is not a valid file type. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const processFiles = useCallback(
    (fileList: FileList) => {
      setError(null);
      const newFiles: DragDropFile[] = [];
      const errors: string[] = [];

      if (files.length + fileList.length > maxFiles) {
        setError(
          `Maximum ${maxFiles} files allowed. Current: ${files.length}, Adding: ${fileList.length}`
        );
        return;
      }

      Array.from(fileList).forEach(file => {
        const validationError = validateFile(file);
        if (validationError) {
          errors.push(validationError);
        } else {
          newFiles.push(createFileObject(file));
        }
      });

      if (errors.length > 0) {
        setError(errors.join(' '));
        return;
      }

      setFiles(prev => [...prev, ...newFiles]);
      onFilesAdded?.(newFiles);
    },
    [files.length, maxFiles, maxSize, accept, onFilesAdded]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragActive(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragActive(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      dragCounter.current = 0;

      if (disabled) return;

      const { files: droppedFiles } = e.dataTransfer;
      if (droppedFiles && droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [disabled, processFiles]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files: selectedFiles } = e.target;
      if (selectedFiles && selectedFiles.length > 0) {
        processFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [processFiles]
  );

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    onFileRemoved?.(fileId);
    setError(null);
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.includes('text/') || file.type.includes('document'))
      return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  return (
    <div className={`drag-drop-container ${className}`}>
      {/* Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : disabled
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {children || (
          <div className="text-center">
            <Upload
              className={`w-12 h-12 mx-auto mb-4 ${
                isDragActive ? 'text-blue-500' : 'text-gray-400'
              }`}
            />
            <p
              className={`text-lg font-medium mb-2 ${
                isDragActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              {isDragActive ? 'Drop files here' : 'Drop files here or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              {accept !== '*/*' && `Accepted types: ${accept}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {maxFiles && ` • Max files: ${maxFiles}`}
            </p>
          </div>
        )}

        {/* Drag overlay */}
        {isDragActive && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 rounded-lg flex items-center justify-center">
            <div className="text-blue-600 font-medium">Drop files here</div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Files ({files.length}/{maxFiles})
          </h4>
          <div className="space-y-2">
            {files.map(fileObj => (
              <div
                key={fileObj.id}
                className="flex items-center p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                {/* File icon or preview */}
                <div className="flex-shrink-0 mr-3">
                  {fileObj.preview ? (
                    <img
                      src={fileObj.preview}
                      alt={fileObj.file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                      {getFileIcon(fileObj.file)}
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{fileObj.file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(fileObj.file.size)}</p>
                </div>

                {/* Status indicator */}
                <div className="flex-shrink-0 ml-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      fileObj.status === 'success'
                        ? 'bg-green-500'
                        : fileObj.status === 'error'
                          ? 'bg-red-500'
                          : fileObj.status === 'uploading'
                            ? 'bg-blue-500 animate-pulse'
                            : 'bg-gray-300'
                    }`}
                  />
                </div>

                {/* Remove button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    removeFile(fileObj.id);
                  }}
                  className="flex-shrink-0 ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DragDrop;
