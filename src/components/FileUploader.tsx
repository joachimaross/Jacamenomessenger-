'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FaUpload } from 'react-icons/fa'

interface FileUploaderProps {
  onFileUpload: (files: File[]) => void
}

export default function FileUploader({ onFileUpload }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileUpload(acceptedFiles)
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div
      {...getRootProps()}
      className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <FaUpload className="h-8 w-8 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-blue-500">Drop the files here ...</p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        )}
      </div>
    </div>
  )
}
