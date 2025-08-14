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
import { Store, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

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
  const [isLoading, setIsLoading] = useState(false);

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

      // 新規登録後はトークンを保存せずに、メール確認画面を表示
      setSuccess(true);
      
      // 自動リダイレクトは削除（メールからのリンクでログインしてもらう）
    } catch (err: unknown) {
      const axiosError = err as { 
        response?: { 
          status?: number; 
          statusText?: string; 
          data?: { error?: string; message?: string } 
        };
        message?: string;
      };
      
      console.error("登録エラー詳細:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        response: axiosError?.response,
        status: axiosError?.response?.status,
        data: axiosError?.response?.data,
      });
      
      // サーバーからのエラーメッセージを優先的に表示
      if (axiosError.response?.data?.error) {
        setError(axiosError.response.data.error);
      } else if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else if (axiosError.response?.status) {
        setError(`リクエストエラー (${axiosError.response.status}): ${axiosError.response.statusText || '不明なエラー'}`);
      } else if (axiosError.message) {
        setError(`ネットワークエラー: ${axiosError.message}`);
      } else {
        setError("登録に失敗しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F7F4F4] flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
          <div className="bg-green-600 p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">登録完了！</h2>
            <p className="text-green-100 text-sm">確認メールを送信しました</p>
          </div>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-800 mb-3">次のステップ</h3>
                <div className="space-y-3 text-sm text-green-700">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <p className="text-left">登録されたメールアドレスをご確認ください</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <p className="text-left">確認メール内のリンクをクリックしてサービスにアクセスしてください</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <p className="text-left">店舗情報の詳細設定を行ってください</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F4F4] border border-orange-200 rounded-xl p-4">
                <p className="text-sm text-[#563124]">
                  <strong>メールが届かない場合：</strong>
                  <br />
                  迷惑メールフォルダをご確認いただくか、しばらくお待ちください。
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 text-[#563124] hover:text-[#F1B300] font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>ログイン画面に戻る</span>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4F4] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-[#563124] p-6 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <Store className="w-8 h-8 text-[#F1B300]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">新規店舗登録</h2>
          <p className="text-orange-100 text-sm">meguruで地域とつながりましょう</p>
        </div>

        <CardContent className="p-8">
          {/* ログインに戻るリンク */}
          <Link
            href="/login"
            className="flex items-center space-x-2 text-[#563124] hover:text-[#F1B300] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">ログイン画面に戻る</span>
          </Link>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-[#563124] font-medium">メールアドレス</Label>
                <Input 
                  id="email" 
                  type="email" 
                  {...register("email")} 
                  className="mt-1 rounded-xl border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]"
                  placeholder="store@example.com"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-[#563124] font-medium">パスワード</Label>
                <Input 
                  id="password" 
                  type="password" 
                  {...register("password")} 
                  className="mt-1 rounded-xl border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]"
                  placeholder="6文字以上のパスワード"
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>
            </div>

            <div className="bg-[#F7F4F4] border border-orange-200 rounded-xl p-4">
              <p className="text-sm text-[#563124]">
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
              className="w-full h-12 bg-[#F1B300] hover:bg-[#e6a000] text-[#563124] font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "登録中..." : "新規登録"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-[#563124]">
                アカウントをお持ちですか？{" "}
                <Link href="/login" className="text-[#563124] hover:text-[#F1B300] font-medium">
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