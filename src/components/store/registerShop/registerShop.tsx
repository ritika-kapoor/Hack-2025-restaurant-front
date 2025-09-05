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
import { Store, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

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

  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
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
      
      // 新規登録完了時に直接ログイン状態にする（ログインと同じ処理）
      const token = response.data.data?.token;
      if (token) {
        console.log("トークンが見つかりました:", token);
        
        // useAuthフックを使用してログイン状態にする（ログインと同じ方法）
        login(token);
        
        console.log("ログイン状態を設定しました");
        
        // ルーターを使ってリダイレクト（ログインと同じ方法）
        router.push("/store/");
      } else {
        console.log("トークンが見つかりません");
        console.log("response.data:", response.data);
        setError("登録には成功しましたが、自動ログインに失敗しました。ログインページからログインしてください。");
      }
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