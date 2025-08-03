'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FileImage, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  Camera, 
  Sparkles, 
  Store,
  Eye,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

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
      } catch (error: unknown) {
        // 404の場合は既存チラシがないということなので、エラーにしない
        const axiosError = error as { response?: { status?: number } };
        if (axiosError?.response?.status !== 404) {
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
    } catch (error: unknown) {
      console.error('Upload error:', error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      const errorMessage = error instanceof Error 
        ? error.message 
        : axiosError?.response?.data?.error || 'アップロードに失敗しました';
      setErrorMessage(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  // 認証状態をチェック
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-orange-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600 mb-4" />
            <p className="text-gray-600">認証状態を確認中...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-50 to-orange-100">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">ログインが必要です</h2>
            <p className="text-gray-600 mb-6">チラシ登録機能をご利用いただくには、ログインしてください。</p>
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <a href="/login">ログインページへ</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI チラシ分析</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            チラシをアップロードすると、AI分析により店舗情報と商品が自動的に更新されます
          </p>
        </div>

        {/* 既存チラシ確認中 */}
        {checkingExistingFlyer && (
          <Card className="mb-6 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                <span className="text-gray-600">既存チラシを確認中...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 既存チラシがある場合 */}
        {existingFlyer && !checkingExistingFlyer && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2 text-blue-800">
                <FileImage className="w-5 h-5" />
                <span>既存のチラシがあります</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-700">店舗名:</span>
                    <p className="text-blue-600">{existingFlyer.flyer_data.store.name}</p>
                  </div>
                  {existingFlyer.flyer_data.campaign.name && (
                    <div>
                      <span className="font-medium text-blue-700">キャンペーン:</span>
                      <p className="text-blue-600">{existingFlyer.flyer_data.campaign.name}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-blue-700">登録日:</span>
                    <p className="text-blue-600">{new Date(existingFlyer.created_at).toLocaleDateString('ja-JP')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-700">商品数:</span>
                    <p className="text-blue-600">{existingFlyer.flyer_data.flyer_items.length}商品</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full sm:w-auto border-blue-300 text-blue-700 hover:bg-blue-100">
                  <a href={`/store/flyer/${currentStoreId}`} className="flex items-center justify-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>チラシ詳細を見る</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* チラシアップロードフォーム */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>新しいチラシをアップロード</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ファイル選択エリア */}
              <div className="space-y-2">
                <Label htmlFor="flyer_image" className="text-gray-700 font-medium">
                  チラシ画像を選択
                </Label>
                <div className="relative">
                  <Input
                    type="file"
                    id="flyer_image"
                    name="flyer_image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                  {!selectedFile && (
                    <div className="mt-4 p-8 border-2 border-dashed border-orange-300 rounded-xl bg-orange-50 text-center">
                      <Upload className="w-12 h-12 text-orange-400 mx-auto mb-3" />
                      <p className="text-orange-600 font-medium">画像をドラッグ＆ドロップ</p>
                      <p className="text-orange-500 text-sm">または上のボタンから選択してください</p>
                    </div>
                  )}
                </div>
              </div>

              {/* プレビュー */}
              {previewUrl && (
                <div className="space-y-3">
                  <Label className="text-gray-700 font-medium">プレビュー</Label>
                  <div className="relative rounded-xl overflow-hidden border-2 border-orange-200 bg-white shadow-sm">
                    <img 
                      src={previewUrl} 
                      alt="チラシプレビュー" 
                      className="w-full h-auto max-h-96 object-contain"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="bg-white rounded-full p-2 shadow-md">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* エラーメッセージ */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 text-sm">{errorMessage}</p>
                </div>
              )}

              {/* 送信ボタン */}
              <Button
                type="submit"
                disabled={isUploading || !selectedFile}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg disabled:from-gray-400 disabled:to-gray-400"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    AI分析中...しばらくお待ちください
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    AI分析で店舗情報を更新
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 成功時の表示 */}
        {flyerResponse && (
          <Card className="border-green-200 bg-green-50 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>✨ 分析完了！店舗情報が更新されました</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* 店舗情報 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-800 flex items-center space-x-2">
                      <Store className="w-4 h-4" />
                      <span>更新された店舗情報</span>
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>店舗名:</strong> {flyerResponse.flyer_data.store.name}</p>
                      <p><strong>住所:</strong> {flyerResponse.flyer_data.store.prefecture} {flyerResponse.flyer_data.store.city} {flyerResponse.flyer_data.store.street}</p>
                    </div>
                  </div>
                  
                  {flyerResponse.flyer_data.campaign.name && (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-green-800">キャンペーン情報</h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>キャンペーン名:</strong> {flyerResponse.flyer_data.campaign.name}</p>
                        {flyerResponse.flyer_data.campaign.start_date && (
                          <p><strong>期間:</strong> {flyerResponse.flyer_data.campaign.start_date} 〜 {flyerResponse.flyer_data.campaign.end_date}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-green-800">商品情報</h3>
                  <p className="text-sm text-green-700">
                    {flyerResponse.flyer_data.flyer_items.length}商品が自動登録されました
                  </p>
                </div>

                {/* アクションボタン */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button asChild className="flex-1 bg-green-600 hover:bg-green-700">
                    <a href={`/store/flyer/${flyerResponse.store_id}`} className="flex items-center justify-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>チラシ詳細を見る</span>
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 border-green-600 text-green-700 hover:bg-green-50">
                    <a href="/store/editShop" className="flex items-center justify-center space-x-2">
                      <Store className="w-4 h-4" />
                      <span>店舗情報を編集</span>
                    </a>
                  </Button>
                  <Button 
                    onClick={() => {
                      setFlyerResponse(null);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setErrorMessage('');
                    }}
                    variant="outline" 
                    className="flex-1 border-orange-600 text-orange-700 hover:bg-orange-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    新しいチラシを登録
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 使い方のヒント */}
        {!flyerResponse && (
          <Card className="mt-8 bg-orange-50 border-orange-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-orange-800 mb-3 flex items-center space-x-2">
                <FileImage className="w-5 h-5" />
                <span>💡 使い方のコツ</span>
              </h3>
              <div className="space-y-2 text-sm text-orange-700">
                <p>• 商品名や価格がはっきり写っているチラシが最適です</p>
                <p>• 店舗名や住所が記載されている場合、自動で更新されます</p>
                <p>• JPG、PNG形式の画像ファイルをご使用ください</p>
                <p>• 分析には数秒〜数十秒かかる場合があります</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
