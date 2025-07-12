"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { useRouter } from "next/navigation";

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
  const [error, setError] = useState("");

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/stores/signin", data);
      localStorage.setItem("store_token", response.data.token);
      router.push("/store/");
    }catch (error) {
      setError("ログインに失敗しました");
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">店舗ログイン</h2>
          {/* Development note: Use email: store@example.com, password: password123 */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input type="email" placeholder="メールアドレス" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Input type="password" placeholder="パスワード" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "ログイン中..." : "ログイン"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}