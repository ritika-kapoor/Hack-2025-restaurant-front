'use client';

import { useState } from 'react';

// Define the structure of the response data from the backend
interface FlyerResponse {
  id: string;
  image_data: string; // base64 encoded image
  flyer_data: {
    store: {
      name: string;
      address: string;
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
      const response = await fetch('http://localhost:8080/api/v1/flyer/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'アップロードに失敗しました');
      }

      setFlyerResponse(result.data);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">チラシ登録</h1>
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
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
        >
          {isUploading ? 'アップロード中...' : '登録'}
        </button>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      </form>

      {flyerResponse && (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4 text-green-600">登録完了</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">登録された画像</h3>
              <img 
                src={`data:image/png;base64,${flyerResponse.image_data}`} 
                alt="Registered Flyer" 
                className="max-w-full h-auto border rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">抽出情報</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold">店舗情報</h4>
                  <p>名前: {flyerResponse.flyer_data.store.name}</p>
                  <p>住所: {flyerResponse.flyer_data.store.address}</p>
                </div>
                <div>
                  <h4 className="font-bold">キャンペーン情報</h4>
                  <p>名前: {flyerResponse.flyer_data.campaign.name}</p>
                  <p>期間: {flyerResponse.flyer_data.campaign.start_date} ~ {flyerResponse.flyer_data.campaign.end_date}</p>
                </div>
                <div>
                  <h4 className="font-bold">掲載商品</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {flyerResponse.flyer_data.flyer_items.map((item, index) => (
                      <li key={index} className="p-2 border-b">
                        <p className="font-semibold">{item.product.name} ({item.product.category})</p>
                        <p>価格: {item.price_including_tax}円 (税抜: {item.price_excluding_tax}円)</p>
                        <p>単位: {item.unit}</p>
                        {item.restriction_note && <p className="text-sm text-red-500">{item.restriction_note}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
