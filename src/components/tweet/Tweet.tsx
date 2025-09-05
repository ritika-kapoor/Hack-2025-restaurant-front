
"use client";

import { useState } from 'react';

interface TweetProps {
  tweet: {
    id: string;
    store_id: string;
    content: string;
    likes: number;
    created_at: string;
    store_name: string;
  };
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  isOwner: boolean;
}

export default function Tweet({ tweet, onLike, onDelete, isOwner }: TweetProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleLike = () => {
    onLike(tweet.id);
    setIsLiked(!isLiked);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(tweet.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  // 日付をフォーマットする関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md mb-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* ヘッダー部分 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{backgroundColor: '#563124'}}>
              {tweet.store_name.charAt(0)}
            </div>
            <div>
              <span className="font-bold text-lg" style={{color: '#563124'}}>{tweet.store_name}</span>
              {isOwner && (
                <span className="ml-2 px-2 py-1 text-xs rounded-full text-white" style={{backgroundColor: '#F1B300'}}>
                  自分の投稿
                </span>
              )}
            </div>
          </div>
          <span className="text-gray-500 text-sm">{formatDate(tweet.created_at)}</span>
        </div>
      </div>

      {/* コンテンツ部分 */}
      <div className="p-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{tweet.content}</p>
      </div>

      {/* アクション部分 */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center">
          <button
            onClick={handleLike}
            className="flex items-center space-x-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: isLiked ? '#F1B300' : '#f3f4f6',
              color: isLiked ? 'white' : '#563124'
            }}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span>{isLiked ? 'いいね済み' : 'いいね'}</span>
            <span className="ml-1">({tweet.likes})</span>
          </button>
          
          {isOwner && !showDeleteConfirm && (
            <button
              onClick={handleDeleteClick}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
            >
              <span>🗑️</span>
              <span>削除</span>
            </button>
          )}

          {/* 削除確認モーダル */}
          {isOwner && showDeleteConfirm && (
            <div className="flex items-center space-x-2">
              <span className="text-red-600 font-medium">本当に削除しますか？</span>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                削除
              </button>
              <button
                onClick={cancelDelete}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
              >
                キャンセル
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
