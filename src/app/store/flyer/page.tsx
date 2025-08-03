'use client';

import { useState, useEffect } from 'react';
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
  const [existingFlyer, setExistingFlyer] = useState<FlyerResponse | null>(null);
  const [checkingExistingFlyer, setCheckingExistingFlyer] = useState(false);
  const [currentStoreId, setCurrentStoreId] = useState<string | null>(null);

  // ページロード時に既存チラシをチェック
  useEffect(() => {
    const checkExistingFlyer = async () => {
      if (!isAuthenticated) return;

      try {
        setCheckingExistingFlyer(true);
        const token = localStorage.getItem('store_token');
        if (!token) return;

        // まず現在の店舗IDを取得
        const profileResponse = await axios.get('http://localhost:8080/api/v1/stores/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const storeId = profileResponse.data.data.id;
        setCurrentStoreId(storeId);

        // 既存チラシをチェック
        const flyerResponse = await axios.get(`http://localhost:8080/api/v1/flyer/${storeId}`);
        
        if (flyerResponse.data.data) {
          setExistingFlyer(flyerResponse.data.data);
        }
      } catch (error: any) {
        // 404の場合は既存チラシがないということなので、エラーにしない
        if (error.response?.status !== 404) {
          console.error('Failed to check existing flyer:', error);
        }
      } finally {
        setCheckingExistingFlyer(false);
      }
    };

    checkExistingFlyer();
  }, [isAuthenticated]);

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
      // EditShopと同じパターンでトークンを取得
      const token = localStorage.getItem('store_token');
      if (!token) {
        throw new Error('認証トークンが見つかりません。再ログインしてください。');
      }

      // EditShopと同じパターンでaxiosを使用
      const response = await axios.post('http://localhost:8080/api/v1/flyer/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setFlyerResponse(response.data.data);
      
      // 成功後に既存チラシ情報を更新
      setExistingFlyer(response.data.data);
      
      // 成功メッセージをUIで表示（alertは削除）
      // 自動リダイレクトは削除し、ユーザーが選択できるようにする
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrorMessage(error.response?.data?.error || error.message || 'アップロードに失敗しました');
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

      {/* 既存チラシがある場合の動線 */}
      {checkingExistingFlyer && (
        <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
            <span className="text-gray-600">既存チラシを確認中...</span>
          </div>
        </div>
      )}

      {existingFlyer && !checkingExistingFlyer && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800 mb-2">📄 既存のチラシがあります</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>店舗名:</strong> {existingFlyer.flyer_data.store.name}</p>
                {existingFlyer.flyer_data.campaign.name && (
                  <p><strong>キャンペーン:</strong> {existingFlyer.flyer_data.campaign.name}</p>
                )}
                <p><strong>登録日:</strong> {new Date(existingFlyer.created_at).toLocaleDateString('ja-JP')}</p>
              </div>
            </div>
            <a
              href={`/store/flyer/${currentStoreId}`}
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              チラシ詳細を見る
            </a>
          </div>
        </div>
      )}
      
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
