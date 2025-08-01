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

// Dummy data for testing
// const DUMMY_RESPONSE = {
//   success: true,
//   message: "登録確認メールを送信しました。メールをご確認ください。",
//   data: {
//     token: "dummy.jwt.token"
//   }
// };

/*
API Implementation Notes:
POST /api/store/register
Headers: {
  'Content-Type': 'application/json'
}
Request Body: {
  name: string,
  email: string,
  password: string,
  phone_number: string,
  address_zipcode: string,
  address_prefecture: string,
  address_city: string,
  address_street: string
}
Response: {
  success: boolean,
  message: string,
  data: {
    token: string // JWT token
  }
}
*/

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
  const router = useRouter();

 const onSubmit = async (data: RegisterForm) => {
  setError("");
  try {
    console.log("送信データ:", data);

    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone_number: data.phone_number,
      zipcode: data.address_zipcode,
      prefecture: data.address_prefecture,
      city: data.address_city,
      street: data.address_street,
    };

    const response = await axios.post("http://localhost:8080/api/v1/stores/signup", payload);

    if (response.data?.data?.token) {
      localStorage.setItem("store_token", response.data.data.token);
    }

    setSuccessMessage(response.data.message);
    setSuccess(true);
    router.push("/store/");
  } catch (err: any) {
    console.error("登録エラー:", err.response?.data);
    setError("登録に失敗しました");
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
              <Input id="address_zipcode" {...register("address_zipcode")} placeholder="1234567" />
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
            <Button type="submit" className="w-full">
              登録
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}