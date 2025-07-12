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

const registerSchema = z.object({
  name: z.string().min(1, "店舗名は必須です"),
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(6, "6文字以上のパスワードを入力してください"),
  phone_number: z.string().min(10, "電話番号を入力してください"),
  address_zipcode: z.string().min(7, "郵便番号を入力してください"),
  address_prefecture: z.string().min(1, "都道府県を入力してください"),
  address_city: z.string().min(1, "市区町村を入力してください"),
  address_street: z.string().min(1, "番地を入力してください"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function EditShop() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // 初期データ取得
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await axios.get("/api/mockStore");
        const store = response.data[0];

        setValue("name", store.name);
        setValue("email", store.email);
        setValue("password", store.password);
        setValue("phone_number", store.phone_number);
        setValue("address_zipcode", store.address_zipcode);
        setValue("address_prefecture", store.address_prefecture);
        setValue("address_city", store.address_city);
        setValue("address_street", store.address_street);
      } catch (err) {
        console.error("店舗情報の取得に失敗しました", err);
        setError("店舗情報の取得に失敗しました");
      }
    };

    fetchStore();
  }, [setValue]);

  const onSubmit = async (data: RegisterForm) => {
    setError("");
    setSuccessMessage("");
    try {
      const response = await axios.post("/api/mockStore", data);
      if (response.status === 200) {
        setSuccessMessage("店舗情報を更新しました");
      } else {
        setError("店舗情報の更新に失敗しました");
      }
    } catch (err) {
      console.error("更新エラー:", err);
      setError("店舗情報の更新に失敗しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">店舗名</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email">メールアドレス</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone_number">電話番号</Label>
              <Input id="phone_number" {...register("phone_number")} />
              {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number.message}</p>}
            </div>
            <div>
              <Label htmlFor="address_zipcode">郵便番号</Label>
              <Input id="address_zipcode" {...register("address_zipcode")} />
              {errors.address_zipcode && <p className="text-sm text-red-500">{errors.address_zipcode.message}</p>}
            </div>
            <div>
              <Label htmlFor="address_prefecture">都道府県</Label>
              <Input id="address_prefecture" {...register("address_prefecture")} />
              {errors.address_prefecture && <p className="text-sm text-red-500">{errors.address_prefecture.message}</p>}
            </div>
            <div>
              <Label htmlFor="address_city">市区町村</Label>
              <Input id="address_city" {...register("address_city")} />
              {errors.address_city && <p className="text-sm text-red-500">{errors.address_city.message}</p>}
            </div>
            <div>
              <Label htmlFor="address_street">番地</Label>
              <Input id="address_street" {...register("address_street")} />
              {errors.address_street && <p className="text-sm text-red-500">{errors.address_street.message}</p>}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}
            <Button type="submit" className="w-full">
              更新
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}