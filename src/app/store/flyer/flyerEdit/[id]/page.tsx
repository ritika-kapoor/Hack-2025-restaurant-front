
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { FlyerResponse } from '@/types/flyer';

const FlyerPage = () => {
  const params = useParams();
  const storeId = params.store_id;

  // 期限状況を判定するヘルパー関数（日付ベースに修正）
  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    
    // 日付のみで比較（時間は無視）
    const expiryDateOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffDays = Math.ceil((expiryDateOnly.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'expired', text: '期限切れ', color: 'text-red-600 bg-red-100' };
    } else if (diffDays === 0) {
      return { status: 'today', text: '本日期限切れ', color: 'text-orange-600 bg-orange-100' };
    } else if (diffDays === 1) {
      return { status: 'tomorrow', text: '明日期限切れ', color: 'text-yellow-600 bg-yellow-100' };
    } else if (diffDays <= 3) {
      return { status: 'warning', text: `${diffDays}日後に期限切れ`, color: 'text-yellow-600 bg-yellow-100' };
    } else {
      return { status: 'active', text: `${diffDays}日後に期限切れ`, color: 'text-green-600 bg-green-100' };
    }
  };

  // 期限の日時を表示用にフォーマットするヘルパー関数
  const formatExpiryDate = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const date = new Date(expiryDate);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const [flyerData, setFlyerData] = useState<FlyerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;

    const fetchFlyerData = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
        const response = await fetch(`${apiBaseUrl}/api/v1/flyer/${storeId}`);
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

  const { flyer_data, image_data, created_at, display_expiry_date } = flyerData;
  const { campaign, store, flyer_items } = flyer_data;
  
  const expiryStatus = getExpiryStatus(display_expiry_date);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{campaign.name}</h1>
              <p className="text-md text-gray-600">{store.name}</p>
              <p className="text-sm text-gray-500">期間: {campaign.start_date} ~ {campaign.end_date}</p>
              <p className="text-xs text-gray-400 mt-1">登録日時: {new Date(created_at).toLocaleString()}</p>
            </div>
            
            {/* 表示期限情報 */}
            <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col items-start sm:items-end">
              {display_expiry_date && (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>表示期限: {formatExpiryDate(display_expiry_date)}</span>
                  </div>
                  {expiryStatus && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${expiryStatus.color}`}>
                      {expiryStatus.status === 'expired' && <AlertTriangle className="w-4 h-4" />}
                      {expiryStatus.status !== 'expired' && <Clock className="w-4 h-4" />}
                      {expiryStatus.text}
                    </div>
                  )}
                </>
              )}
              {!display_expiry_date && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-blue-100">
                  <Clock className="w-4 h-4" />
                  期限なし
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">チラシ画像</h2>
            <Image
                  src={`data:image/png;base64,${image_data}`}
                  alt="チラシ"
                  width={500}
                  height={707}
                  className="w-full h-auto rounded-lg border"
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
