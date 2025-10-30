'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaFile, FaTrash } from 'react-icons/fa'

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = (file: File) => {
    setFiles(prev => prev.filter(f => f !== file))
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 dark:text-gray-400">
          {isDragActive
            ? 'Drop the files here ...'
            : "Drag 'n' drop some files here, or click to select files"}
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold">Selected Files:</h4>
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <FaFile className="h-5 w-5 text-gray-500" />
                <span className="text-sm">{file.name}</span>
              </div>
              <button
                onClick={() => removeFile(file)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <FaTrash className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onFileUpload(files)}
            className="w-full px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={files.length === 0}
          >
            Upload {files.length} {files.length === 1 ? 'file' : 'files'}
          </button>
        </div>
      )}
    </div>
  )
}
