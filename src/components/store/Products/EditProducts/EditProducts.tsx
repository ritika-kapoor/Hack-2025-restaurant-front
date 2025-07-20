"use client";

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
import axios from "axios";
import { useEffect } from "react";
import IsLoginOrNot from "@/components/isLoginOrNot/isLoginOrNot";

const EditProductSchema = z.object({
    id: z.number(),
    product_name: z.string().min(1, "商品名を入力してください"),
    price: z.coerce.number().min(0, "価格は0円以上で入力してください"),
    quantity: z.coerce.number().int().min(1, "在庫数は1以上で入力してください"),
    image_url: z.string().min(1, "画像をアップロードしてください"),
    status: z.enum(["在庫あり", "在庫なし"], {
        required_error: "商品の状態を選択してください",
    }),
});

type EditProductForm = z.infer<typeof EditProductSchema>;

export default function EditProducts() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EditProductForm>({ resolver: zodResolver(EditProductSchema) });

    useEffect(() => {
        const GetRegisteredFood = async () => {
            try {
                const response = await axios.get(`/api/registerdFood/2`);
                setValue("id", response.data.id);
                setValue("product_name", response.data.product_name);
                setValue("price", response.data.price);
                setValue("quantity", response.data.quantity);
                setValue("image_url", response.data.image_url);
                setValue("status", response.data.status);
            } catch (error) {
                console.error(error);
            }
        };
        GetRegisteredFood();
    }, [setValue]);

    const onSubmit = async (data: EditProductForm) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/api/registerdFood/${data.id}`, data, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            alert("商品を更新しました");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <IsLoginOrNot/>
            <Card>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="product_name">商品名</Label>
                            <Input id="product_name" {...register("product_name")} />
                            {errors.product_name && <p className="text-sm text-red-500">{errors.product_name.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="price">価格（円）</Label>
                            <Input id="price" type="number" {...register("price")} />
                            {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
                        </div>
                        <div>
                            <Label htmlFor="quantity">在庫数</Label>
                            <Input id="quantity" type="number" {...register("quantity")} />
                            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity.message}</p>}
                        </div>
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
                        <div>
                            <Label htmlFor="status">状態</Label>
                            <Select onValueChange={(value) => setValue("status", value, { shouldValidate: true })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="選択してください" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="在庫あり">在庫あり</SelectItem>
                                    <SelectItem value="在庫なし">在庫なし</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
                        </div>
                        <Button type="submit" className="w-full">
                            更新する
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}