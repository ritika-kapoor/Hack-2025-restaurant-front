"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Store, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const registerSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "6文字以上のパスワードを入力してください"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function StoreRegister() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    setIsLoading(true);
    try {
      console.log("送信データ:", data);

      // Emailとパスワードで簡単な登録
      const payload = {
        email: data.email,
        password: data.password,
      };

      console.log("送信ペイロード:", payload);

      const response = await axios.post("http://localhost:8080/store/shopRegister", payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("レスポンス:", response.data);

      if (response.data?.data?.token) {
        // 認証フックを使用してトークンを保存
        login(response.data.data.token);
      }

      setSuccessMessage(response.data.message || "新規登録が完了しました");
      setSuccess(true);
      
      // 少し待ってから店舗情報設定画面へリダイレクト
      setTimeout(() => {
        router.push("/store/editShop");
      }, 1500);
    } catch (err: any) {
      console.error("登録エラー詳細:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
      });
      
      // サーバーからのエラーメッセージを優先的に表示
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status) {
        setError(`リクエストエラー (${err.response.status}): ${err.response.statusText || '不明なエラー'}`);
      } else if (err.message) {
        setError(`ネットワークエラー: ${err.message}`);
      } else {
        setError("登録に失敗しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Store className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">登録完了！</h2>
            <p className="text-green-100 text-sm">{successMessage}</p>
          </div>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 mb-4">店舗情報設定画面に移動します...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Store className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">新規店舗登録</h2>
          <p className="text-orange-100 text-sm">めぐるで地域とつながりましょう</p>
        </div>

        <CardContent className="p-8">
          {/* ログインに戻るリンク */}
          <Link
            href="/login"
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">ログイン画面に戻る</span>
          </Link>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">メールアドレス</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register("email")} 
                  className="mt-1 rounded-xl border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  placeholder="store@example.com"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">パスワード</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...register("password")} 
                  className="mt-1 rounded-xl border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                  placeholder="6文字以上のパスワード"
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-orange-800">
                <strong>簡単登録：</strong>Emailとパスワードだけですぐに始められます。店舗の詳細情報は後から設定できます。
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "登録中..." : "新規登録"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                アカウントをお持ちですか？{" "}
                <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                  ログイン
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}