"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const registerSchema = z.object({
    store_id: z.string(),
    product_type: z.enum(["惣菜", "食材"], {
        required_error: "商品の種類を選択してください",
    }),
    product_name: z.string().min(1, "商品名を入力してください"),
    price: z.coerce.number().min(0, "価格は0円以上で入力してください"),
    expiration_date: z.coerce.date({
        required_error: "賞味期限を入力してください",
        invalid_type_error: "有効な日付を入力してください",
    }),
    quantity: z.coerce.number().int().min(1, "在庫数は1以上で入力してください"),
    image_url: z.string().min(1, "画像をアップロードしてください"),
    status: z.enum(["在庫あり", "在庫なし"], {
        required_error: "商品の状態を選択してください",
    }),
});

type RegisterForm = z.infer<typeof registerSchema>;

const DUMMY_RESPONSE = {
    success: true,
    message: "商品を登録しました。",
    data: { token: "dummy.jwt.token" },
};

export default function ProductRegister() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const onSubmit = async (data: RegisterForm) => {
        setError("");
        try {
            console.log("送信データ:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const response = DUMMY_RESPONSE;

            if (response.data?.token) {
                localStorage.setItem("store_token", response.data.token);
            }

            setSuccessMessage(response.message);
            setSuccess(true);
        } catch {
            setError("登録に失敗しました");
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md p-6 text-center">
                    <CardContent>
                        <h2 className="text-xl font-bold mb-2">登録完了</h2>
                        <p className="text-sm">{successMessage}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md p-6">
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <input type="hidden" {...register("store_id")} value="1" />
                        {errors.store_id && <p className="text-sm text-red-500">{errors.store_id.message}</p>}

                        {/* 商品種別 */}
                        <div>
                            <Label htmlFor="product_type">商品種別</Label>
                            <Select
                                onValueChange={(value) => setValue("product_type", value as RegisterForm["product_type"], { shouldValidate: true })}
                            >
                                <SelectTrigger className="w-full" id="product_type">
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="惣菜">惣菜</SelectItem>
                                    <SelectItem value="食材">食材</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.product_type && <p className="text-sm text-red-500">{errors.product_type.message}</p>}
                        </div>
                        {/* 商品名 */}
                        <div>
                            <Label htmlFor="product_name">商品名</Label>
                            <Input id="product_name" {...register("product_name")} />
                            {errors.product_name && <p className="text-sm text-red-500">{errors.product_name.message}</p>}
                        </div>

                        {/* 商品価格 */}
                        <div>
                            <Label htmlFor="price">価格（円）</Label>
                            <Input id="price" type="number" {...register("price")} />
                            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                        </div>

                        {/* 賞味期限 */}
                        <div>
                            <Label htmlFor="expiration_date">賞味期限</Label>
                            <Input id="expiration_date" type="date" {...register("expiration_date")} />
                            {errors.expiration_date && <p className="text-sm text-red-500">{errors.expiration_date.message}</p>}
                        </div>

                        {/* 在庫数 */}
                        <div>
                            <Label htmlFor="quantity">在庫数</Label>
                            <Input id="quantity" type="number" {...register("quantity")} />
                            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
                        </div>

                        {/* 商品画像 */}
                        <div>
                            <Label htmlFor="image_url">商品画像</Label>
                            <Input
                                id="image_url"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            if (typeof reader.result === "string") {
                                                setValue("image_url", reader.result, { shouldValidate: true });
                                            }
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            {errors.image_url && <p className="text-sm text-red-500">{errors.image_url.message}</p>}
                        </div>

                        {/* 商品状態 */}
                        <div>
                            <Label htmlFor="status">状態</Label>
                            <Select
                                onValueChange={(value) => setValue("status", value as RegisterForm["status"], { shouldValidate: true })}
                            >
                                <SelectTrigger className="w-full" id="status">
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="在庫あり">在庫あり</SelectItem>
                                    <SelectItem value="在庫なし">在庫なし</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}
                        <Button type="submit" className="w-full">登録</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}