"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// バックエンドのFlyerData DTOに合わせたスキーマを定義
const storeSchema = z.object({
    name: z.string(),
    prefecture: z.string(),
    city: z.string(),
    street: z.string(),
});

const campaignSchema = z.object({
    name: z.string(),
    start_date: z.string(),
    end_date: z.string(),
});

const productSchema = z.object({
    name: z.string(),
    category: z.string().optional(),
});

const flyerItemSchema = z.object({
    product: productSchema,
    price_excluding_tax: z.number(),
    price_including_tax: z.number(),
    unit: z.string().optional(),
    restriction_note: z.string().optional(),
});

const flyerDataSchema = z.object({
    store: storeSchema,
    campaign: campaignSchema,
    flyer_items: z.array(flyerItemSchema),
});

type FlyerData = z.infer<typeof flyerDataSchema>;

export default function ProductLists() {
    // FlyerData型を使用
    const [flyerData, setFlyerData] = useState<FlyerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // useFormの型もFlyerDataに合わせる
    const { handleSubmit, reset } = useForm<FlyerData>({
        resolver: zodResolver(flyerDataSchema),
        // デフォルト値もFlyerDataの構造に合わせる
        defaultValues: {
            store: { name: "", prefecture: "", city: "", street: "" },
            campaign: { name: "", start_date: "", end_date: "" },
            flyer_items: [],
        },
    });

    // localstorageにstore_idがあると思うのでそれを取得する。
    // const storeId = localStorage.getItem("store_id");
    const storeId = 'a0000000-0000-0000-0000-000000000001'; 

    useEffect(() => {
        const fetchFlyerData = async () => {
            try {
                const response = await axios.get(`/api/v1/flyer/${storeId}`);
                // APIレスポンスの構造が { data: { flyerData: ... } } のようになっている可能性があるので調整
                const fetchedData = response.data.data.flyer_data; 
                setFlyerData(fetchedData);
                // フォームの値をAPIから取得したデータでリセットします。
                reset(fetchedData); 
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(new Error(err.response?.data?.error || err.message));
                } else if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error("An unknown error occurred"));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFlyerData();
    }, [storeId, reset]); // reset関数も依存配列に追加します

    const onSubmit = async (values: FlyerData) => {
        setIsSubmitting(true);
        try {
            // ここでフライヤーデータを更新するAPIを叩きます。
            // 例: await axios.put(`/api/v1/flyer/${storeId}`, values);
            console.log("Form submitted with values:", values);
            alert("フォームが送信されました！コンソールを確認してください。");
            // 成功した場合、必要に応じてUIを更新します。
        } catch (submitError: unknown) {
            if (axios.isAxiosError(submitError)) {
                setError(new Error(submitError.response?.data?.error || submitError.message));
            } else if (submitError instanceof Error) {
                setError(submitError);
            } else {
                setError(new Error("フォーム送信中に不明なエラーが発生しました"));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-[400px] text-[#563124]">フライヤーデータを読み込み中...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-[400px] text-red-600">エラー: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-[#563124] mb-6">商品一覧</h1>
            {flyerData ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-[#563124] mb-4">店舗情報</h2>
                        <p className="text-[#563124] opacity-80">店舗名: {flyerData.store.name}</p>
                        <p className="text-[#563124] opacity-80">住所: {flyerData.store.prefecture} {flyerData.store.city} {flyerData.store.street}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-[#563124] mb-4">キャンペーン情報</h2>
                        <p className="text-[#563124] opacity-80">キャンペーン名: {flyerData.campaign.name}</p>
                        <p className="text-[#563124] opacity-80">期間: {flyerData.campaign.start_date} ~ {flyerData.campaign.end_date}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold text-[#563124] mb-4">フライヤーアイテム</h2>
                        {flyerData.flyer_items && flyerData.flyer_items.length > 0 ? (
                            <div className="grid gap-4">
                                {flyerData.flyer_items.map((item, index) => (
                                    <div key={index} className="border border-orange-100 p-4 rounded-lg bg-[#F7F4F4]">
                                        <p className="font-semibold text-[#563124]">商品名: {item.product.name} ({item.product.category})</p>
                                        <p className="text-[#F1B300] font-bold">税抜価格: {item.price_excluding_tax}円</p>
                                        <p className="text-[#F1B300] font-bold">税込価格: {item.price_including_tax}円</p>
                                        <p className="text-[#563124] opacity-70">単位: {item.unit}</p>
                                        {item.restriction_note && <p className="text-[#563124] opacity-70">制限事項: {item.restriction_note}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#563124] opacity-70">このフライヤーにはアイテムがありません。</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#F1B300] hover:bg-[#e6a000] text-[#563124] font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50"
                    >
                        {isSubmitting ? "保存中..." : "保存"}
                    </button>
                </form>
            ) : (
                <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
                    <p className="text-[#563124] opacity-70">このストアのフライヤーは見つかりませんでした。</p>
                </div>
            )}
        </div>
    );
}