import React, { ButtonHTMLAttributes } from 'react';
import Button from './Button';
import Loading from './Loading';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  disabled,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={isLoading || disabled}
    >
      <div className="flex items-center justify-center">
        {isLoading ? (
          <>
            <Loading size="sm" className="mr-2" />
            <span>{loadingText}</span>
          </>
        ) : (
          children
        )}
      </div>
    </Button>
  );
};

export default LoadingButton; 