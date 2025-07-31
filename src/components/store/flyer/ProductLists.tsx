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
        return <div>フライヤーデータを読み込み中...</div>;
    }

    if (error) {
        return <div>エラー: {error.message}</div>;
    }

    return (
        <div>
            <h1>商品一覧</h1>
            {flyerData ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <h2>店舗情報</h2>
                    <p>店舗名: {flyerData.store.name}</p>
                    <p>住所: {flyerData.store.prefecture} {flyerData.store.city} {flyerData.store.street}</p>

                    <h2>キャンペーン情報</h2>
                    <p>キャンペーン名: {flyerData.campaign.name}</p>
                    <p>期間: {flyerData.campaign.start_date} ~ {flyerData.campaign.end_date}</p>

                    <h2>フライヤーアイテム</h2>
                    {flyerData.flyer_items && flyerData.flyer_items.length > 0 ? (
                        <ul>
                            {flyerData.flyer_items.map((item, index) => (
                                <li key={index} className="border p-2 mb-2 rounded-md">
                                    <p>商品名: {item.product.name} ({item.product.category})</p>
                                    <p>税抜価格: {item.price_excluding_tax}円</p>
                                    <p>税込価格: {item.price_including_tax}円</p>
                                    <p>単位: {item.unit}</p>
                                    {item.restriction_note && <p>制限事項: {item.restriction_note}</p>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>このフライヤーにはアイテムがありません。</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {isSubmitting ? "保存中..." : "保存"}
                    </button>
                </form>
            ) : (
                <div>このストアのフライヤーは見つかりませんでした。</div>
            )}
        </div>
    );
}