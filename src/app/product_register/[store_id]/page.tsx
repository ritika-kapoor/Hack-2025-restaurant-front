
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  name: string;
  category: string;
}

interface FlyerItem {
  product: Product;
  price_excluding_tax: number;
  price_including_tax: number;
  unit: string;
  restriction_note: string;
}

interface Campaign {
  name: string;
  start_date: string;
  end_date: string;
}

interface Store {
  name: string;
  address: string;
}

interface FlyerData {
  id: string;
  image_data: string;
  flyer_data: {
    store: Store;
    campaign: Campaign;
    flyer_items: FlyerItem[];
  } | null;
  created_at: string;
}

const FlyerPage = () => {
  const params = useParams();
  const storeId = params.store_id;
  const [flyerData, setFlyerData] = useState<FlyerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchFlyerData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/flyer/${storeId}`);
        if (response.status === 404) {
          setError('チラシが見つかりませんでした。');
          return;
        }
        if (!response.ok) {
          throw new Error('データの取得に失敗しました。');
        }
        const result = await response.json();
        console.log("result", result);
        
        setFlyerData(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFlyerData();
  }, [storeId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">読み込み中...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  if (!flyerData || !flyerData.flyer_data) {
    return <div className="flex justify-center items-center h-screen">チラシデータがありません。</div>;
  }

  const { flyer_data, image_data, created_at } = flyerData;
  const { campaign, store, flyer_items } = flyer_data;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{campaign.name}</h1>
          <p className="text-md text-gray-600">{store.name} ({store.address})</p>
          <p className="text-sm text-gray-500">期間: {campaign.start_date} ~ {campaign.end_date}</p>
          <p className="text-xs text-gray-400 mt-1">登録日時: {new Date(created_at).toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">チラシ画像</h2>
            <img
              src={`data:image/png;base64,${image_data}`}
              alt="Flyer"
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">掲載商品</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格(税抜)</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">単位</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">備考</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {flyer_items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                        <p className="text-xs text-gray-500">{item.product.category}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">¥{item.price_excluding_tax.toLocaleString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.unit}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.restriction_note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlyerPage;
