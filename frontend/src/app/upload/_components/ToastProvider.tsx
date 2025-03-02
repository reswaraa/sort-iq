'use client';

import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from 'axios';

export type ErrorType =
  | 'classification'
  | 'weight'
  | 'network'
  | 'image'
  | 'session'
  | 'unknown';

interface NotifyErrorProps {
  type: ErrorType;
  message?: string;
}

export const notifyError = ({ type, message }: NotifyErrorProps) => {
  const errorMessages = {
    classification:
      'Failed to classify the image. Please try again with a clearer photo.',
    weight: 'Failed to update the waste weight. Please try again.',
    network: 'Network error. Please check your connection and try again.',
    image: 'Error processing the image. Please try a different image.',
    session: 'Failed to start or reset the session. Please refresh the page.',
    unknown: 'An unexpected error occurred. Please try again.',
  };

  toast.error(message || errorMessages[type], {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: true,
    theme: 'light',
  });
};

export const notifySuccess = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: true,
    theme: 'light',
  });
};

export const notifyWarning = (message: string) => {
  toast.warning(message, {
    position: 'top-right',
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    closeButton: true,
    theme: 'light',
  });
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      {children}
      <ToastContainer
        closeButton={true}
        newestOnTop={true}
        limit={3}
        style={{ zIndex: 9999 }}
      />
    </>
  );
};

export const handleApiError = (error: AxiosError): ErrorType => {
  if (!error) return 'unknown';

  if (!navigator.onLine || error.message === 'Network Error') {
    return 'network';
  }

  if (error.response) {
    const { status } = error.response;

    if (status === 415 || status === 413) {
      return 'image';
    }

    if (status === 422 || status === 400) {
      return 'classification';
    }

    if (status === 403) {
      return 'session';
    }
  }

  return 'unknown';
};
