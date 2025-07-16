import React from 'react';
import { AlertTriangle, RefreshCw, Wifi } from 'lucide-react';

export const ErrorBoundary = ({ error, retry, className = '' }) => {
  const getErrorIcon = () => {
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      return <Wifi className="w-12 h-12 text-red-500" />;
    }
    return <AlertTriangle className="w-12 h-12 text-red-500" />;
  };

  const getErrorTitle = () => {
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      return '연결 오류';
    }
    return '오류가 발생했습니다';
  };

  const getErrorMessage = () => {
    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      return '네트워크 연결을 확인하고 다시 시도해주세요.';
    }
    return error?.message || '알 수 없는 오류가 발생했습니다.';
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="animate-bounce mb-4">
        {getErrorIcon()}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {getErrorTitle()}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {getErrorMessage()}
      </p>
      
      {retry && (
        <button
          onClick={retry}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>다시 시도</span>
        </button>
      )}
    </div>
  );
};

export const InlineError = ({ message, onDismiss, type = 'error' }) => {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'info':
        return <Wifi className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`p-3 rounded-lg border flex items-start space-x-3 animate-slide-up ${getStyles()}`}>
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const EmptyState = ({ 
  title = '데이터가 없습니다', 
  description = '표시할 내용이 없습니다.',
  action,
  icon: Icon = AlertTriangle,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="mb-4 opacity-50">
        <Icon className="w-16 h-16 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-sm">
        {description}
      </p>
      
      {action}
    </div>
  );
};