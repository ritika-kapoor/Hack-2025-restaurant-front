"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Store, UserPlus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string().min(6, { message: "パスワードは6文字以上必要です" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function StoreLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const onSubmit = async (data: LoginForm) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const response = await axios.post(`${apiBaseUrl}/api/v1/stores/signin`, data);
      
      // 認証フックを使用してトークンとstore_idを保存
      const { token, store_id } = response.data.data;
      
      // store_idが取得できない場合のフォールバック処理
      if (!store_id) {
        console.warn("store_id not found in login response, will be set later");
      }
      
      login(token, store_id);
      
      router.push("/store/");
    } catch (error) {
      setError("ログインに失敗しました");
      console.error(error);
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
          <h2 className="text-2xl font-bold text-white mb-2">店舗ログイン</h2>
          <p className="text-orange-100 text-sm">meguruにおかえりなさい</p>
        </div>

        <CardContent className="p-8">
          {/* Development note: Use email: store@example.com, password: password123 */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-[#563124] font-medium">メールアドレス</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="store@example.com"
                  {...register("email")} 
                  className="mt-1 rounded-xl border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-[#563124] font-medium">パスワード</Label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="パスワード"
                  {...register("password")} 
                  className="mt-1 rounded-xl border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]"
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full h-12 bg-[#F1B300] hover:bg-[#e6a000] text-[#563124] font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "ログイン中..." : "ログイン"}
            </Button>
          </form>

          {/* 新規登録への導線 */}
          <div className="mt-8 pt-6 border-t border-orange-100">
            <div className="text-center">
              <p className="text-sm text-[#563124] mb-4">
                まだアカウントをお持ちでない方は
              </p>
              <Link
                href="/store/shopRegister"
                className="flex items-center justify-center space-x-2 w-full h-12 bg-white border-2 border-[#563124] text-[#563124] font-semibold rounded-xl hover:bg-[#F7F4F4] transition-all duration-200 hover:scale-105"
              >
                <UserPlus className="w-5 h-5" />
                <span>新規店舗登録</span>
              </Link>
            </div>
          </div>

          {/* 簡単登録の説明 */}
          <div className="mt-6 bg-[#F7F4F4] border border-orange-200 rounded-xl p-4">
            <p className="text-sm text-[#563124] text-center">
              <strong>簡単登録：</strong>Emailとパスワードだけで今すぐ始められます
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}