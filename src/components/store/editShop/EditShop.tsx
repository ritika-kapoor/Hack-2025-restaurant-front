"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Store, MapPin, FileImage, Loader2, CheckCircle, AlertCircle, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const editStoreSchema = z.object({
  name: z.string().min(1, "店舗名は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  phone_number: z.string().optional(),
  zipcode: z.string().optional(),
  prefecture: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
});

type EditStoreForm = z.infer<typeof editStoreSchema>;

export default function EditShop() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditStoreForm>({
    resolver: zodResolver(editStoreSchema),
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressError, setAddressError] = useState("");
  const { isAuthenticated } = useAuth();

  // 郵便番号を監視
  const zipcode = watch("zipcode");

  // 郵便番号から住所を検索
  useEffect(() => {
    const searchAddress = async () => {
      // 郵便番号が7桁の数字でない場合は処理しない
      if (!zipcode || !/^\d{7}$/.test(zipcode)) {
        setAddressError("");
        return;
      }

      setIsSearchingAddress(true);
      setAddressError("");

      try {
        const response = await axios.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`);
        
        if (response.data.status === 200 && response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0];
          
          // 住所情報をフォームに設定
          setValue("prefecture", result.address1);
          setValue("city", result.address2);
          setValue("street", result.address3);
          
        } else {
          setAddressError("該当する住所が見つかりませんでした");
        }
      } catch (err) {
        console.error("住所検索エラー:", err);
        setAddressError("住所の検索に失敗しました");
      } finally {
        setIsSearchingAddress(false);
      }
    };

    // デバウンス処理（500ms待ってから実行）
    const timeoutId = setTimeout(searchAddress, 500);
    return () => clearTimeout(timeoutId);
  }, [zipcode, setValue]);

  // 店舗情報取得
  useEffect(() => {
    const fetchStoreProfile = async () => {
      if (!isAuthenticated) return;
      
      try {
        setIsLoading(true);
        const token = localStorage.getItem("store_token");
        
        const response = await axios.get("http://localhost:8080/api/v1/stores/profile", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const profile = response.data.data;
        
        // フォームに値をセット
        setValue("name", profile.name || "");
        setValue("email", profile.email || "");
        setValue("phone_number", profile.phone_number || "");
        setValue("zipcode", profile.zipcode || "");
        setValue("prefecture", profile.prefecture || "");
        setValue("city", profile.city || "");
        setValue("street", profile.street || "");
        
      } catch (err: any) {
        console.error("店舗情報の取得に失敗しました:", err);
        setError("店舗情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreProfile();
  }, [setValue, isAuthenticated]);

  const onSubmit = async (data: EditStoreForm) => {
    setError("");
    setSuccessMessage("");
    
    try {
      const token = localStorage.getItem("store_token");
      
      const response = await axios.put("http://localhost:8080/api/v1/stores/profile", data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccessMessage("店舗情報を更新しました");
      }
    } catch (err: any) {
      console.error("更新エラー:", err);
      setError(err.response?.data?.error || "店舗情報の更新に失敗しました");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-gray-600">店舗情報を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ヘッダー */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-full p-3">
            <Store className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">店舗情報管理</h1>
            <p className="text-orange-100">店舗の基本情報を編集できます</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインフォーム */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 基本情報セクション */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-4 border-b border-orange-100">
                    <Store className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold text-gray-800">基本情報</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">店舗名</Label>
                      <Input 
                        id="name" 
                        {...register("name")} 
                        className="mt-1 meguru-input"
                        placeholder="例：めぐるカフェ"
                      />
                      {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">メールアドレス</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        {...register("email")} 
                        className="mt-1 meguru-input"
                        placeholder="store@example.com"
                      />
                      {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="phone_number" className="text-gray-700 font-medium">電話番号</Label>
                      <Input 
                        id="phone_number" 
                        {...register("phone_number")} 
                        className="mt-1 meguru-input"
                        placeholder="090-1234-5678"
                      />
                      {errors.phone_number && <p className="text-sm text-red-500 mt-1">{errors.phone_number.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="zipcode" className="text-gray-700 font-medium">郵便番号</Label>
                      <div className="relative">
                        <Input 
                          id="zipcode" 
                          {...register("zipcode")} 
                          className="mt-1 meguru-input pr-10"
                          placeholder="1234567（ハイフンなし7桁）"
                          maxLength={7}
                        />
                        {isSearchingAddress && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                          </div>
                        )}
                        {!isSearchingAddress && zipcode && zipcode.length === 7 && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Search className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                      </div>
                      {errors.zipcode && <p className="text-sm text-red-500 mt-1">{errors.zipcode.message}</p>}
                      {addressError && <p className="text-sm text-red-500 mt-1">{addressError}</p>}
                      {!addressError && zipcode && zipcode.length === 7 && !isSearchingAddress && (
                        <p className="text-sm text-green-600 mt-1">✓ 住所を自動入力しました</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 住所情報セクション */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-4 border-b border-orange-100">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold text-gray-800">店舗所在地</h2>
                    {!addressError && zipcode && zipcode.length === 7 && !isSearchingAddress && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">自動入力済み</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="prefecture" className="text-gray-700 font-medium">都道府県</Label>
                      <Input 
                        id="prefecture" 
                        {...register("prefecture")} 
                        className="mt-1 meguru-input"
                        placeholder="東京都"
                      />
                      {errors.prefecture && <p className="text-sm text-red-500 mt-1">{errors.prefecture.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="city" className="text-gray-700 font-medium">市区町村</Label>
                      <Input 
                        id="city" 
                        {...register("city")} 
                        className="mt-1 meguru-input"
                        placeholder="渋谷区"
                      />
                      {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="street" className="text-gray-700 font-medium">番地</Label>
                      <Input 
                        id="street" 
                        {...register("street")} 
                        className="mt-1 meguru-input"
                        placeholder="代々木1-2-3"
                      />
                      {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street.message}</p>}
                    </div>
                  </div>
                </div>

                {/* メッセージ */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-600">{successMessage}</p>
                  </div>
                )}

                {/* 更新ボタン */}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full meguru-button h-12"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      更新中...
                    </>
                  ) : (
                    "店舗情報を更新"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* サイドバー - チラシ登録への導線 */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="bg-white rounded-full p-4 w-16 h-16 mx-auto flex items-center justify-center">
                  <FileImage className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">チラシで集客アップ！</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    魅力的なチラシを作成して、お客様にお得な情報をお届けしましょう。
                  </p>
                </div>
                <Link
                  href="/store/flyer"
                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  チラシで登録する
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3">💡 ヒント</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• 郵便番号（7桁）を入力すると住所が自動で入力されます</p>
                <p>• 正確な住所情報は、お客様がお店を見つけやすくします</p>
                <p>• 電話番号を登録すると、お客様からのお問い合わせを受けられます</p>
                <p>• チラシ機能を使って、セール情報を効果的にPRしましょう</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}