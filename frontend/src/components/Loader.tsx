import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'medium',
  text = 'Loading...',
  color = 'blue-500',
}) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-2',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-${color} border-${color} border-opacity-25`}
      />
      {text && (
        <p className={`mt-2 text-${color} text-sm font-medium`}>{text}</p>
      )}
    </div>
  );
};

export default Loader;
