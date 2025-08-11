
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  FileImage, 
  Store, 
  Calendar, 
  Package,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Eye,
  ShoppingCart,
  Clock
} from 'lucide-react';
import { FlyerResponse, FlyerItem } from '@/types/flyer';

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
  const [flyerDataList, setFlyerDataList] = useState<FlyerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  // 画像モーダルを開く関数
  const openImageModal = (imageData: string) => {
    setSelectedImage(imageData);
    setIsImageModalOpen(true);
  };

  useEffect(() => {
    if (!storeId) return;

    const fetchFlyerData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/flyer/all/${storeId}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました。');
        }
        const result = await response.json();
        console.log("result", result);
        
        // データが配列として返される
        setFlyerDataList(Array.isArray(result.data) ? result.data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFlyerData();
  }, [storeId]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-orange-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600">チラシ情報を読み込み中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-orange-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">エラーが発生しました</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} className="bg-orange-600 hover:bg-orange-700">
              再読み込み
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (flyerDataList.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-orange-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <FileImage className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">チラシがありません</h2>
            <p className="text-gray-600 mb-6">この店舗にはまだチラシが登録されていません。</p>
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <Link href="/store/flyer">チラシを登録する</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => window.history.back()} className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>戻る</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">登録済みチラシ一覧</h1>
              <p className="text-gray-600 mt-1">
                {flyerDataList[0]?.flyer_data?.store?.name && `${flyerDataList[0].flyer_data.store.name} - `}
                {flyerDataList.length}件のチラシが登録されています
              </p>
            </div>
          </div>
        </div>

        {/* チラシ一覧 */}
        <div className="space-y-8">
          {flyerDataList.map((flyerData, flyerIndex) => {
            if (!flyerData.flyer_data) return null;
            
            const { flyer_data, image_data, created_at } = flyerData;
            const { campaign, store, flyer_items } = flyer_data;

            return (
              <Card key={flyerData.id} className="shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileImage className="w-6 h-6" />
                      <div>
                        <h2 className="text-xl font-bold">
                          {campaign.name || `チラシ #${flyerIndex + 1}`}
                        </h2>
                        <p className="text-orange-100 text-sm">
                          登録日: {new Date(created_at).toLocaleDateString('ja-JP')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-orange-100 text-sm">
                        <Store className="w-4 h-4" />
                        <span>{store.name}</span>
                      </div>
                      {campaign.start_date && (
                        <div className="flex items-center space-x-2 text-orange-100 text-sm mt-1">
                          <Calendar className="w-4 h-4" />
                          <span>{campaign.start_date} 〜 {campaign.end_date}</span>
                        </div>
                      )}
                      {flyerData.display_expiry_date && (
                        <div className="flex items-center space-x-2 text-orange-100 text-sm mt-1">
                          <Clock className="w-4 h-4" />
                          <span>表示期限: {formatExpiryDate(flyerData.display_expiry_date)}</span>
                        </div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6">
                  {/* 表示期限ステータス */}
                  {flyerData.display_expiry_date && (() => {
                    const expiryStatus = getExpiryStatus(flyerData.display_expiry_date);
                    return expiryStatus ? (
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${expiryStatus.color}`}>
                        <Clock className="w-4 h-4" />
                        {expiryStatus.text}
                      </div>
                    ) : null;
                  })()}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* チラシ画像 */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-orange-600" />
                        <h3 className="text-lg font-semibold text-gray-800">チラシ画像</h3>
                      </div>
                      <div 
                        className="relative rounded-xl overflow-hidden border-2 border-orange-200 bg-white shadow-sm cursor-pointer hover:border-orange-300 transition-colors duration-200 group"
                        onClick={() => openImageModal(image_data)}
                      >
                        <Image
                          src={`data:image/png;base64,${image_data}`}
                          alt={`チラシ ${flyerIndex + 1}`}
                          width={0}
                          height={0}
                          sizes="100vw"
                          style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '24rem' }}
                          className="w-full h-auto object-contain max-h-96"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-orange-600 text-white px-3 py-1.5 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>拡大表示</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 商品情報 */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Package className="w-5 h-5 text-orange-600" />
                          <h3 className="text-lg font-semibold text-gray-800">掲載商品</h3>
                        </div>
                        <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                          {flyer_items.length}商品
                        </div>
                      </div>
                      
                      {flyer_items.length > 0 ? (
                        <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                          <div className="space-y-3">
                            {flyer_items.map((item: FlyerItem, index: number) => (
                              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                                    <p className="text-sm text-gray-500">{item.product.category}</p>
                                    {item.restriction_note && (
                                      <p className="text-xs text-orange-600 mt-1">{item.restriction_note}</p>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <p className="font-semibold text-gray-900">
                                      ¥{item.price_excluding_tax.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">{item.unit}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-xl p-8 text-center">
                          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">商品情報がありません</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* フッターアクション */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-orange-600 hover:bg-orange-700">
            <Link href="/store/flyer" className="flex items-center justify-center space-x-2">
              <FileImage className="w-4 h-4" />
              <span>新しいチラシを登録</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-orange-600 text-orange-700 hover:bg-orange-50">
            <a href="/store/editShop" className="flex items-center justify-center space-x-2">
              <Store className="w-4 h-4" />
              <span>店舗情報を編集</span>
            </a>
          </Button>
        </div>
      </div>

      {/* 画像モーダル */}
      <Dialog 
        open={isImageModalOpen} 
        onOpenChange={(open) => {
          setIsImageModalOpen(open);
          if (!open) {
            setSelectedImage('');
          }
        }}
      >
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>チラシ画像の拡大表示</DialogTitle>
          </DialogHeader>
          {/* カスタムヘッダー */}
          <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 flex items-center space-x-2">
            <Eye className="w-5 h-5 text-white" />
            <h2 className="text-white text-lg font-semibold">チラシ画像</h2>
          </div>
          <div className="flex items-center justify-center bg-gray-50 p-4 max-h-[calc(90vh-80px)] overflow-auto">
            {selectedImage && (
              <Image
                src={`data:image/png;base64,${selectedImage}`}
                alt="チラシ拡大表示"
                width={0}
                height={0}
                sizes="100vw"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlyerPage;
