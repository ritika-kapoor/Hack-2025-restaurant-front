
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

  const handleLike = () => {
    onLike(tweet.id);
    setIsLiked(!isLiked);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6" style={{borderColor: '#F1B300'}}>
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-lg" style={{color: '#563124'}}>{tweet.store_name}</span>
        <span className="text-gray-500 text-sm">{tweet.created_at}</span>
      </div>
      <p className="my-4 text-gray-800">{tweet.content}</p>
      <div className="flex justify-between items-center">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded-full text-white font-semibold transition-colors ${isLiked ? 'bg-red-500' : 'bg-yellow-500'}`}
          style={{backgroundColor: isLiked ? '#F1B300' : '#F1B300'}}
        >
          {isLiked ? 'いいね済み' : 'いいね'} ({tweet.likes})
        </button>
        {isOwner && (
          <button
            onClick={() => onDelete(tweet.id)}
            className="px-4 py-2 rounded-full bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition-colors">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
