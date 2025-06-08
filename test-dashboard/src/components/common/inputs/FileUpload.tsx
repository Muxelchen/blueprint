import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, File, Image, Video, Music, FileText, AlertCircle, Check } from 'lucide-react';

export interface FileUploadFile {
  id: string;
  file: File;
  preview?: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  allowedTypes?: string[];
  disabled?: boolean;
  required?: boolean;
  variant?: 'default' | 'dropzone' | 'button' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  error?: string;
  showPreview?: boolean;
  showProgress?: boolean;
  previewSize?: 'sm' | 'md' | 'lg';
  dragActiveText?: string;
  dragInactiveText?: string;
  buttonText?: string;
  removeText?: string;
  files?: FileUploadFile[];
  onChange?: (files: FileUploadFile[]) => void;
  onFileAdd?: (file: FileUploadFile) => void;
  onFileRemove?: (fileId: string) => void;
  onValidationError?: (error: string, file: File) => void;
  className?: string;
  dropzoneClassName?: string;
  previewClassName?: string;
  name?: string;
  id?: string;
}

export interface FileUploadState {
  files: FileUploadFile[];
  isDragActive: boolean;
  isDragOver: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 10,
  allowedTypes = [],
  disabled = false,
  required = false,
  variant = 'dropzone',
  size = 'md',
  label,
  description,
  error,
  showPreview = true,
  showProgress = true,
  previewSize = 'md',
  dragActiveText = 'Drop files here...',
  dragInactiveText = 'Drag & drop files here, or click to select',
  buttonText = 'Choose Files',
  removeText = 'Remove',
  files: controlledFiles,
  onChange,
  onFileAdd,
  onFileRemove,
  onValidationError,
  className = '',
  dropzoneClassName = '',
  previewClassName = '',
  name,
  id,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledFiles !== undefined;

  const [state, setState] = useState<FileUploadState>({
    files: controlledFiles || [],
    isDragActive: false,
    isDragOver: false,
  });

  // Update state when controlled files change
  useEffect(() => {
    if (isControlled && controlledFiles) {
      setState(prev => ({ ...prev, files: controlledFiles }));
    }
  }, [controlledFiles, isControlled]);

  // Generate unique ID for file
  const generateFileId = useCallback(() => {
    return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Validate file
  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file size
      if (file.size > maxSize) {
        return `File size must be less than ${formatFileSize(maxSize)}`;
      }

      // Consolidate file type validation - use accept attribute as primary validation
      if (accept && accept !== '*/*') {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

        const isAccepted = acceptTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension === type;
          }
          if (type.includes('/')) {
            // Handle exact MIME type or wildcard (e.g., 'image/*')
            return fileType === type || fileType.startsWith(type.replace('*', ''));
          }
          return false;
        });

        if (!isAccepted) {
          return `File type not accepted. Accepted types: ${accept}`;
        }
      }
      // Fallback to allowedTypes only if accept is not specified
      else if (allowedTypes.length > 0) {
        const fileType = file.type;
        const fileExtension = file.name.split('.').pop()?.toLowerCase();

        const isTypeAllowed = allowedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension === type.slice(1);
          }
          if (type.includes('/')) {
            return fileType === type || fileType.startsWith(type.replace('*', ''));
          }
          return fileType.startsWith(type);
        });

        if (!isTypeAllowed) {
          return `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
        }
      }

      return null;
    },
    [maxSize, allowedTypes, accept]
  );

  // Create file preview
  const createFilePreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise(resolve => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target?.result as string);
        reader.onerror = () => resolve(undefined);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  }, []);

  // Process files
  const processFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const newFiles: FileUploadFile[] = [];

      // Check max files limit
      const currentFileCount = state.files.length;
      const totalFiles = currentFileCount + fileArray.length;

      if (!multiple && fileArray.length > 1) {
        onValidationError?.('Only one file is allowed', fileArray[0]);
        return;
      }

      if (totalFiles > maxFiles) {
        onValidationError?.(`Maximum ${maxFiles} files allowed`, fileArray[0]);
        return;
      }

      for (const file of fileArray) {
        const validationError = validateFile(file);

        if (validationError) {
          onValidationError?.(validationError, file);
          continue;
        }

        const fileId = generateFileId();
        const preview = await createFilePreview(file);

        const uploadFile: FileUploadFile = {
          id: fileId,
          file,
          preview,
          progress: 0,
          status: 'pending',
        };

        newFiles.push(uploadFile);
        onFileAdd?.(uploadFile);

        // Simulate upload progress (in real app, this would be actual upload)
        simulateUpload(uploadFile);
      }

      if (newFiles.length > 0) {
        const updatedFiles = multiple ? [...state.files, ...newFiles] : newFiles;

        if (!isControlled) {
          setState(prev => ({ ...prev, files: updatedFiles }));
        }

        onChange?.(updatedFiles);
      }
    },
    [
      state.files,
      multiple,
      maxFiles,
      validateFile,
      createFilePreview,
      generateFileId,
      onValidationError,
      onFileAdd,
      onChange,
      isControlled,
    ]
  );

  // Simulate file upload
  const simulateUpload = useCallback(
    (uploadFile: FileUploadFile) => {
      const updateProgress = (
        progress: number,
        status: FileUploadFile['status'],
        error?: string
      ) => {
        if (!isControlled) {
          setState(prev => ({
            ...prev,
            files: prev.files.map(f =>
              f.id === uploadFile.id ? { ...f, progress, status, error } : f
            ),
          }));
        }

        // Also update the original file object for controlled components
        uploadFile.progress = progress;
        uploadFile.status = status;
        if (error) uploadFile.error = error;
      };

      updateProgress(0, 'uploading');

      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;

        if (progress >= 100) {
          clearInterval(interval);
          // Simulate random success/error
          const isSuccess = Math.random() > 0.1; // 90% success rate
          updateProgress(
            100,
            isSuccess ? 'success' : 'error',
            isSuccess ? undefined : 'Upload failed. Please try again.'
          );
        } else {
          updateProgress(Math.min(progress, 95), 'uploading');
        }
      }, 200);
    },
    [isControlled]
  );

  // Handle file input change
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        processFiles(files);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = '';
    },
    [processFiles]
  );

  // Handle file remove
  const handleFileRemove = useCallback(
    (fileId: string) => {
      const updatedFiles = state.files.filter(f => f.id !== fileId);

      if (!isControlled) {
        setState(prev => ({ ...prev, files: updatedFiles }));
      }

      onChange?.(updatedFiles);
      onFileRemove?.(fileId);
    },
    [state.files, isControlled, onChange, onFileRemove]
  );

  // Handle click to select files
  const handleClick = useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  }, [disabled]);

  // Drag and drop handlers
  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!disabled) {
        setState(prev => ({ ...prev, isDragActive: true, isDragOver: true }));
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set drag state to false if we're leaving the dropzone entirely
    if (!dropzoneRef.current?.contains(e.relatedTarget as Node)) {
      setState(prev => ({ ...prev, isDragActive: false, isDragOver: false }));
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

      setState(prev => ({ ...prev, isDragActive: false, isDragOver: false }));

      if (!disabled) {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
          processFiles(files);
        }
      }
    },
    [disabled, processFiles]
  );

  // Format file size
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Size configurations
  const getSizeConfig = () => {
    const configs = {
      sm: {
        dropzone: 'p-4 min-h-24',
        button: 'px-3 py-1.5 text-sm',
        preview: 'w-16 h-16',
        icon: 'w-4 h-4',
        text: 'text-sm',
      },
      md: {
        dropzone: 'p-6 min-h-32',
        button: 'px-4 py-2 text-base',
        preview: 'w-20 h-20',
        icon: 'w-5 h-5',
        text: 'text-base',
      },
      lg: {
        dropzone: 'p-8 min-h-40',
        button: 'px-6 py-3 text-lg',
        preview: 'w-24 h-24',
        icon: 'w-6 h-6',
        text: 'text-lg',
      },
    };
    return configs[size];
  };

  const sizeConfig = getSizeConfig();
  const inputId = id || name || `file-upload-${Math.random().toString(36).substr(2, 9)}`;

  // Render different variants
  const renderDropzone = () => (
    <div
      ref={dropzoneRef}
      className={`
        border-2 border-dashed rounded-lg transition-colors cursor-pointer
        ${sizeConfig.dropzone}
        ${
          state.isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${dropzoneClassName}
      `}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <Upload className={`${sizeConfig.icon} text-gray-400 mb-2`} />
        <p className={`${sizeConfig.text} text-gray-600 mb-1`}>
          {state.isDragActive ? dragActiveText : dragInactiveText}
        </p>
        {!state.isDragActive && (
          <p className="text-xs text-gray-500">
            {accept ? `Accepted: ${accept}` : 'All file types accepted'}
            {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
          </p>
        )}
      </div>
    </div>
  );

  const renderButton = () => (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center gap-2 bg-blue-600 text-white rounded-md
        hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${sizeConfig.button}
      `}
    >
      <Upload className={sizeConfig.icon} />
      {buttonText}
    </button>
  );

  const renderMinimal = () => (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors underline ${sizeConfig.text}
      `}
    >
      {buttonText}
    </button>
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Description */}
      {description && !error && (
        <p className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        id={inputId}
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        required={required && state.files.length === 0}
        onChange={handleFileInputChange}
        className="sr-only"
      />

      {/* Upload UI */}
      <div>
        {variant === 'dropzone' && renderDropzone()}
        {variant === 'button' && renderButton()}
        {variant === 'minimal' && renderMinimal()}
        {variant === 'default' && renderDropzone()}
      </div>

      {/* File Preview */}
      {showPreview && state.files.length > 0 && (
        <div className={`space-y-2 ${previewClassName}`}>
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({state.files.length})
          </h4>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {state.files.map(uploadFile => (
              <FilePreviewItem
                key={uploadFile.id}
                uploadFile={uploadFile}
                onRemove={handleFileRemove}
                showProgress={showProgress}
                previewSize={previewSize}
                removeText={removeText}
                disabled={disabled}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-600 flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}

      {/* File Count Info */}
      {multiple && maxFiles > 1 && (
        <p className="text-xs text-gray-500">
          {state.files.length} of {maxFiles} files selected
        </p>
      )}
    </div>
  );
};

// File Preview Item Component
interface FilePreviewItemProps {
  uploadFile: FileUploadFile;
  onRemove: (fileId: string) => void;
  showProgress: boolean;
  previewSize: 'sm' | 'md' | 'lg';
  removeText: string;
  disabled: boolean;
}

const FilePreviewItem: React.FC<FilePreviewItemProps> = ({
  uploadFile,
  onRemove,
  showProgress,
  previewSize,
  removeText,
  disabled,
}) => {
  const { file, preview, progress, status, error } = uploadFile;

  const sizeConfig = {
    sm: { preview: 'w-10 h-10', icon: 'w-4 h-4' },
    md: { preview: 'w-12 h-12', icon: 'w-5 h-5' },
    lg: { preview: 'w-16 h-16', icon: 'w-6 h-6' },
  }[previewSize];

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'uploading':
        return (
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return null;
    }
  };

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      {/* File Preview/Icon */}
      <div className={`${sizeConfig.preview} flex-shrink-0 rounded overflow-hidden bg-gray-200`}>
        {preview ? (
          <img src={preview} alt={file.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getFileIcon(file, sizeConfig.icon)}
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)}
          {status === 'uploading' && ` • ${Math.round(progress)}%`}
        </p>

        {/* Progress Bar */}
        {showProgress && status === 'uploading' && (
          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>

      {/* Status Icon */}
      <div className="flex items-center space-x-2">
        {getStatusIcon()}

        {/* Remove Button */}
        {!disabled && (
          <button
            type="button"
            onClick={() => onRemove(uploadFile.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title={removeText}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Hook for managing file upload state
export const useFileUpload = (options?: { maxFiles?: number; maxSize?: number }) => {
  const [files, setFiles] = useState<FileUploadFile[]>([]);

  const addFiles = useCallback(
    (newFiles: FileUploadFile[]) => {
      setFiles(prev => {
        const combined = [...prev, ...newFiles];
        return options?.maxFiles ? combined.slice(0, options.maxFiles) : combined;
      });
    },
    [options?.maxFiles]
  );

  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const getFileById = useCallback(
    (fileId: string) => {
      return files.find(f => f.id === fileId);
    },
    [files]
  );

  const getSuccessfulFiles = useCallback(() => {
    return files.filter(f => f.status === 'success');
  }, [files]);

  const getFailedFiles = useCallback(() => {
    return files.filter(f => f.status === 'error');
  }, [files]);

  const getTotalSize = useCallback(() => {
    return files.reduce((total, file) => total + file.file.size, 0);
  }, [files]);

  return {
    files,
    setFiles,
    addFiles,
    removeFile,
    clearFiles,
    getFileById,
    getSuccessfulFiles,
    getFailedFiles,
    getTotalSize,
  };
};

// Example usage component
export const ExampleFileUploads: React.FC = () => {
  const [files1, setFiles1] = useState<FileUploadFile[]>([]);
  const [files2, setFiles2] = useState<FileUploadFile[]>([]);
  const [files3, setFiles3] = useState<FileUploadFile[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleValidationError = useCallback((error: string, file: File) => {
    setValidationErrors(prev => [...prev, `${file.name}: ${error}`]);
    // Clear error after 5 seconds
    setTimeout(() => {
      setValidationErrors(prev => prev.slice(1));
    }, 5000);
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">File Upload Examples</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload */}
          <div>
            <h4 className="font-medium mb-4">Image Upload</h4>
            <FileUpload
              label="Upload Images"
              description="Upload one or more image files"
              accept="image/*"
              multiple
              maxFiles={5}
              maxSize={5 * 1024 * 1024} // 5MB
              files={files1}
              onChange={setFiles1}
              onValidationError={handleValidationError}
              variant="dropzone"
              showPreview
              previewSize="md"
            />
          </div>

          {/* Document Upload */}
          <div>
            <h4 className="font-medium mb-4">Document Upload</h4>
            <FileUpload
              label="Upload Document"
              description="Upload a single document file"
              accept=".pdf,.doc,.docx,.txt"
              multiple={false}
              maxSize={10 * 1024 * 1024} // 10MB
              files={files2}
              onChange={setFiles2}
              onValidationError={handleValidationError}
              variant="dropzone"
              size="sm"
            />
          </div>

          {/* Button Variant */}
          <div>
            <h4 className="font-medium mb-4">Button Upload</h4>
            <FileUpload
              label="Choose Files"
              description="Click button to select files"
              multiple
              maxFiles={3}
              files={files3}
              onChange={setFiles3}
              onValidationError={handleValidationError}
              variant="button"
              buttonText="Select Files"
              showProgress
            />
          </div>

          {/* Different Sizes */}
          <div>
            <h4 className="font-medium mb-4">Size Variants</h4>
            <div className="space-y-4">
              <FileUpload
                label="Small Upload"
                variant="dropzone"
                size="sm"
                dragInactiveText="Small dropzone"
              />

              <FileUpload
                label="Medium Upload"
                variant="dropzone"
                size="md"
                dragInactiveText="Medium dropzone"
              />

              <FileUpload
                label="Large Upload"
                variant="dropzone"
                size="lg"
                dragInactiveText="Large dropzone"
              />
            </div>
          </div>

          {/* Different Variants */}
          <div>
            <h4 className="font-medium mb-4">Upload Variants</h4>
            <div className="space-y-4">
              <FileUpload
                label="Dropzone"
                variant="dropzone"
                dragInactiveText="Drag & drop files here"
              />

              <FileUpload label="Button" variant="button" buttonText="Choose Files" />

              <FileUpload label="Minimal" variant="minimal" buttonText="Upload Files" />
            </div>
          </div>

          {/* States */}
          <div>
            <h4 className="font-medium mb-4">Different States</h4>
            <div className="space-y-4">
              <FileUpload
                label="Required Upload"
                required
                error="Please upload at least one file"
                variant="dropzone"
              />

              <FileUpload
                label="Disabled Upload"
                disabled
                variant="dropzone"
                dragInactiveText="Upload disabled"
              />
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Validation Errors</h4>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Current State Display */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Upload Status</h4>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Images:</strong> {files1.length} files uploaded
            </p>
            <p>
              <strong>Documents:</strong> {files2.length} files uploaded
            </p>
            <p>
              <strong>Other Files:</strong> {files3.length} files uploaded
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function getFileIcon(file: File, iconClass?: string) {
  const fileType = file.type;
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  // For known image types, show a generic image icon
  if (fileType.startsWith('image/')) {
    return <Image className={iconClass} />;
  }

  // For known video types, show a generic video icon
  if (fileType.startsWith('video/')) {
    return <Video className={iconClass} />;
  }

  // For known audio types, show a generic audio icon
  if (fileType.startsWith('audio/')) {
    return <Music className={iconClass} />;
  }

  // For common document types, show a document icon
  if (fileExtension && ['pdf', 'doc', 'docx', 'txt'].includes(fileExtension)) {
    return <FileText className={iconClass} />;
  }

  // For other file types, show a generic file icon
  return <File className={iconClass} />;
}

export default FileUpload;
