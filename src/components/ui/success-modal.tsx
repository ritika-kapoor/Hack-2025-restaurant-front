'use client';

import { useEffect } from 'react';
import { CheckCircle, X, Package, Edit3, Trash2 } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type: 'edit' | 'delete' | 'create';
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type, 
  autoClose = true, 
  autoCloseDelay = 3000 
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'edit':
        return <Edit3 className="w-8 h-8 text-[#F1B300]" />;
      case 'delete':
        return <Trash2 className="w-8 h-8 text-[#F1B300]" />;
      case 'create':
        return <Package className="w-8 h-8 text-[#F1B300]" />;
      default:
        return <CheckCircle className="w-8 h-8 text-[#F1B300]" />;
    }
  };

  const getAnimation = () => {
    switch (type) {
      case 'edit':
        return 'animate-bounce';
      case 'delete':
        return 'animate-pulse';
      case 'create':
        return 'animate-bounce';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 max-w-md w-full mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#563124] transition-colors duration-200 rounded-full hover:bg-[#F7F4F4]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon with animation */}
          <div className="mx-auto mb-6 w-16 h-16 bg-[#F7F4F4] rounded-full flex items-center justify-center">
            <div className={getAnimation()}>
              {getIcon()}
            </div>
          </div>

          {/* Success checkmark */}
          <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 animate-pulse" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-[#563124] mb-3">
            {title}
          </h3>

          {/* Message */}
          <p className="text-[#563124] opacity-80 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Progress bar */}
          {autoClose && (
            <div className="w-full bg-[#F7F4F4] rounded-full h-1 mb-4">
              <div 
                className="bg-[#F1B300] h-1 rounded-full transition-all duration-100 ease-linear"
                style={{
                  animation: `shrink ${autoCloseDelay}ms linear`
                }}
              />
            </div>
          )}

          {/* Action button */}
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#F1B300] hover:bg-[#e6a000] text-[#563124] font-semibold rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            確認
          </button>
        </div>
      </div>

      {/* Custom CSS for progress bar animation */}
      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// 使いやすいヘルパー関数
export const showSuccessModal = (
  setModal: (modal: { isOpen: boolean; title: string; message: string; type: 'edit' | 'delete' | 'create' }) => void
) => ({
  edit: (productName: string) => {
    setModal({
      isOpen: true,
      title: '編集完了！',
      message: `「${productName}」の情報を正常に更新しました。`,
      type: 'edit'
    });
  },
  delete: (productName: string) => {
    setModal({
      isOpen: true,
      title: '削除完了！',
      message: `「${productName}」を正常に削除しました。`,
      type: 'delete'
    });
  },
  create: (productName: string) => {
    setModal({
      isOpen: true,
      title: '登録完了！',
      message: `「${productName}」を正常に登録しました。`,
      type: 'create'
    });
  }
});
