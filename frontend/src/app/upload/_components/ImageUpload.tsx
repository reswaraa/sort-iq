import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { notifyError, notifyWarning } from './ToastProvider';

interface ImageUploadProps {
  onImageCapture: (imageData: string) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageCapture,
  isLoading,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      notifyError({
        type: 'image',
        message: 'Image is too large. Please upload an image less than 5MB.',
      });
      event.target.value = '';
      return;
    }

    if (!ALLOWED_FORMATS.includes(file.type)) {
      notifyWarning(
        'Unsupported image format. Please use JPEG, PNG, WebP, or HEIC formats.'
      );
      event.target.value = '';
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const base64String = e.target?.result as string;
        onImageCapture(base64String);
      } catch (error) {
        console.error('Error processing image:', error);
        notifyError({
          type: 'image',
          message: 'Failed to process the image. Please try a different file.',
        });
      }
    };

    reader.onerror = () => {
      notifyError({
        type: 'image',
        message: 'Failed to read the image file. Please try again.',
      });
    };

    reader.readAsDataURL(file);
  };

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 w-full max-w-lg mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLoading}
      />

      {previewUrl ? (
        <div className="w-full mb-4">
          <Image
            src={previewUrl}
            alt="Waste preview"
            className="rounded-lg mx-auto max-h-64 object-contain"
            width={500}
            height={500}
            onError={() => {
              notifyError({
                type: 'image',
                message: 'Failed to display the image. Please try another one.',
              });
              setPreviewUrl(null);
            }}
          />
        </div>
      ) : (
        <div className="text-center mb-4">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p className="mt-2 text-gray-600">
            Take a photo or upload an image of the waste item
          </p>
        </div>
      )}

      <button
        onClick={handleCaptureClick}
        disabled={isLoading}
        className={`
          px-4 py-2 bg-green-500 text-white rounded-lg 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'} 
          transition
        `}
      >
        {isLoading
          ? 'Processing...'
          : previewUrl
          ? 'Change Image'
          : 'Capture Image'}
      </button>
    </div>
  );
};

export default ImageUpload;
