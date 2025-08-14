
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

interface StoreData {
  id: string;
  name: string;
}

export default function TweetFeed() {
  const [tweets, setTweets] = useState<TweetData[]>([]);
  const [stores, setStores] = useState<Record<string, string>>({});
  const [newTweetContent, setNewTweetContent] = useState('');

  useEffect(() => {
    fetchStores();
  }, []);

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

  const fetchTweets = async (currentStores?: Record<string, string>) => {
    const storesToUse = currentStores || stores;
    try {
      const response = await fetch('http://localhost:8080/api/v1/tweets');
      const data = await response.json();
      if (data.data) {
        const tweetsWithStoreNames = data.data.map((tweet: any) => ({
          ...tweet,
          store_name: storesToUse[tweet.store_id] || 'Unknown Store',
        }));
        setTweets(tweetsWithStoreNames);
      }
    } catch (error) {
      console.error('Failed to fetch tweets:', error);
    }
  };

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
      }
    } catch (error) {
      console.error('Failed to create tweet:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl" style={{backgroundColor: '#F7F4F4'}}>
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <textarea
          value={newTweetContent}
          onChange={(e) => setNewTweetContent(e.target.value)}
          className="w-full p-4 border rounded-lg"
          placeholder="What's happening?"
          maxLength={300}
          style={{borderColor: '#F1B300'}}
        />
        <button
          onClick={handleCreateTweet}
          className="mt-4 px-6 py-3 rounded-full text-white font-semibold transition-colors"
          style={{backgroundColor: '#563124'}}
        >
          情報共有
        </button>
      </div>
      {tweets.map((tweet) => (
        <Tweet
          key={tweet.id}
          tweet={tweet}
          onLike={handleLike}
          onDelete={handleDelete}
          isOwner={tweet.store_id === localStorage.getItem('store_id')}
        />
      ))}
    </div>
  );
}
