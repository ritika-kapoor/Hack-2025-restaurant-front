
"use client";

import { useEffect, useState } from 'react';
import Tweet from './Tweet';

interface TweetData {
  id: string;
  store_id: string;
  content: string;
  likes: number;
  created_at: string;
  store_name: string;
}

interface RawTweetData {
  id: string;
  store_id: string;
  content: string;
  likes: number;
  created_at: string;
}

interface StoreData {
  id: string;
  name: string;
}

export default function TweetFeed() {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [stores, setStores] = useState<Record<string, string>>({});
  const [newTweetContent, setNewTweetContent] = useState('');
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);

  const fetchTweets = async (currentStores?: Record<string, string>) => {
    const storesToUse = currentStores || stores;
    try {
      const response = await fetch('http://localhost:8080/api/v1/tweets');
      const data = await response.json();
      if (data.data) {
        const tweetsWithStoreNames = data.data.map((tweet: RawTweetData) => ({
          ...tweet,
          store_name: storesToUse[tweet.store_id] || 'Unknown Store',
        }));
        setTweets(tweetsWithStoreNames);
      }
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/stores');
      const data = await response.json();
      const storeMap = data.data.reduce((acc: Record<string, string>, store: StoreData) => {
        acc[store.id] = store.name;
        return acc;
      }, {});
      setStores(storeMap);
      fetchTweets(storeMap);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  };

  const fetchCurrentStoreId = async () => {
    try {
      // 現在のユーザーの投稿を取得してstore_idを特定
      const response = await fetch('http://localhost:8080/api/v1/tweets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('store_token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // 最新の投稿からstore_idを取得（投稿作成時の認証済みユーザーの投稿）
        if (data.data && data.data.length > 0) {
          const userTweets = data.data.filter(() => {
            // 認証されたユーザーの投稿かどうかは、サーバーサイドで判定される
            return true; // サーバーが認証済みユーザーの投稿のみを返すと仮定
          });
          
          if (userTweets.length > 0) {
            const storeId = userTweets[0].store_id;
            localStorage.setItem('store_id', storeId);
            setCurrentStoreId(storeId);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch current store_id:', error);
    }
  };

  useEffect(() => {
    fetchStores();
    // 現在ログイン中のstore_idを取得
    const storeId = localStorage.getItem('store_id');
    setCurrentStoreId(storeId);
    
    // store_idが見つからない場合、現在の投稿からstore_idを推定
    if (!storeId) {
      fetchCurrentStoreId();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/tweets/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('store_token')}`,
        },
      });
      if (response.ok) {
        fetchTweets();
      }
    } catch (error) {
      console.error('Failed to like tweet:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/tweets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('store_token')}`,
        },
      });
      if (response.ok) {
        fetchTweets();
      }
    } catch (error) {
      console.error('Failed to delete tweet:', error);
    }
  };

  const handleCreateTweet = async () => {
    if (!newTweetContent.trim()) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('store_token')}`,
        },
        body: JSON.stringify({ content: newTweetContent }),
      });
      if (response.ok) {
        setNewTweetContent('');
        fetchTweets();
        // 投稿後に最新のstore_idを再取得
        const storeId = localStorage.getItem('store_id');
        setCurrentStoreId(storeId);
      }
    } catch (error) {
      console.error('Failed to create tweet:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto" style={{backgroundColor: '#F7F4F4'}}>
      {/* 投稿作成セクション */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-4" style={{color: '#563124'}}>
          💡 フードロス情報を共有
        </h2>
        <textarea
          value={newTweetContent}
          onChange={(e) => setNewTweetContent(e.target.value)}
          className="w-full p-4 border-2 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
          style={{
            borderColor: '#F1B300'
          }}
          placeholder="フードロスに役立つ情報を共有しよう！&#10;例：&#10;・特価セール情報&#10;・食材の保存方法&#10;・レシピのアイデア"
          maxLength={300}
          rows={4}
        />
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-500">
            {newTweetContent.length}/300文字
          </span>
          <button
            onClick={handleCreateTweet}
            disabled={!newTweetContent.trim()}
            className="px-6 py-3 rounded-full text-white font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{backgroundColor: '#563124'}}
          >
            📢 情報共有
          </button>
        </div>
      </div>

      {/* ツイート一覧セクション */}
      <div className="space-y-0">
        {tweets.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <div className="text-gray-400 text-lg mb-2">📝</div>
            <p className="text-gray-500">まだ投稿がありません</p>
            <p className="text-gray-400 text-sm">最初の情報共有をしてみましょう！</p>
          </div>
        ) : (
          tweets.map((tweet) => {
            const isOwner = Boolean(currentStoreId && tweet.store_id === currentStoreId);
            
            return (
              <Tweet
                key={tweet.id}
                tweet={tweet}
                onLike={handleLike}
                onDelete={handleDelete}
                isOwner={isOwner}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
