'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

// Define the structure of the response data from the backend
interface FlyerResponse {
  id: string;
  store_id: string;
  image_data: string; // base64 encoded image
  flyer_data: {
    store: {
      name: string;
      prefecture: string;
      city: string;
      street: string;
    };
    campaign: {
      name: string;
      start_date: string;
      end_date: string;
    };
    flyer_items: {
      product: {
        name: string;
        category: string;
      };
      price_excluding_tax: number;
      price_including_tax: number;
      unit: string;
      restriction_note: string;
    }[];
  };
  created_at: string;
}

export default function ProductRegister() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [flyerResponse, setFlyerResponse] = useState<FlyerResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setFlyerResponse(null); // Reset previous response
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setErrorMessage('ログインが必要です');
      return;
    }

    if (!selectedFile) {
      setErrorMessage('画像を選択してください');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');
    setFlyerResponse(null);

    const formData = new FormData();
    formData.append('flyer_image', selectedFile);

    try {
      // localStorageからトークンを取得（必須）- EditShopと同じキーを使用
      const token = localStorage.getItem('store_token');
      console.log('Token from localStorage:', token); // デバッグログ
      
      if (!token) {
        throw new Error('認証トークンが見つかりません。再ログインしてください。');
      }

      console.log('Sending request with Authorization header:', `Bearer ${token}`); // デバッグログ

      // EditShopと同じようにaxiosを使用（FormDataの場合はContent-Type自動設定）
      const response = await axios.post('http://localhost:8080/api/v1/flyer/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status); // デバッグログ

      setFlyerResponse(response.data.data);
      
      // 店舗情報更新の成功メッセージ
      alert('店舗情報が正常に更新されました！');
      
      // 店舗編集ページへリダイレクト
      window.location.href = `/store/editShop`;
    } catch (error: unknown) {
      console.error('Upload error:', error); // デバッグログ
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error && typeof error === 'object' && 'response' in error && 
           error.response && typeof error.response === 'object' && 'data' in error.response &&
           error.response.data && typeof error.response.data === 'object' && 'error' in error.response.data)
          ? String(error.response.data.error)
          : 'アップロードに失敗しました';
      setErrorMessage(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // 認証状態をチェック
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-lg text-red-500 mb-4">ログインが必要です</div>
        <a href="/login" className="text-blue-500 hover:underline">
          ログインページへ
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">チラシで店舗情報を更新</h1>
      <p className="text-gray-600 mb-6">
        チラシをアップロードすると、AI分析により店舗情報が自動的に更新されます。
      </p>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="flyer_image" className="block text-sm font-medium text-gray-700">
            チラシ画像
          </label>
          <input
            type="file"
            id="flyer_image"
            name="flyer_image"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
        </div>

        {previewUrl && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">プレビュー</h2>
            <img src={previewUrl} alt="Preview" className="max-w-full h-auto border rounded-lg" />
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 bg-orange-500 text-white rounded-md disabled:bg-gray-400 hover:bg-orange-600"
        >
          {isUploading ? 'AI分析中...' : '店舗情報を更新'}
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </form>

      {flyerResponse && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2 text-green-800">✅ 店舗情報が更新されました</h2>
          <div className="text-sm text-green-700">
            <p><strong>店舗名:</strong> {flyerResponse.flyer_data.store.name}</p>
            <p><strong>住所:</strong> {flyerResponse.flyer_data.store.prefecture} {flyerResponse.flyer_data.store.city} {flyerResponse.flyer_data.store.street}</p>
          </div>
        </div>
      )}
    </div>
  );
}
