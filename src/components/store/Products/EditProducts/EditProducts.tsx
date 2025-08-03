"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { useProducts, Product, CreateProductRequest, UpdateProductRequest } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Edit2, Trash2, Package, Store } from "lucide-react";

const ProductSchema = z.object({
    product_name: z.string().min(1, "商品名を入力してください"),
    category: z.string().min(1, "カテゴリを入力してください"),
    price: z.coerce.number().min(0, "価格は0円以上で入力してください"),
    quantity: z.coerce.number().int().min(0, "在庫数は0以上で入力してください"),
    image_url: z.string(),
    status: z.enum(["在庫あり", "在庫なし"], {
        required_error: "商品の状態を選択してください",
    }),
});

type ProductForm = z.infer<typeof ProductSchema>;

export default function EditProducts() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const {
        products,
        isLoading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        clearError,
    } = useProducts();

    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductForm>({ 
        resolver: zodResolver(ProductSchema),
        defaultValues: {
            status: "在庫あり",
            image_url: "",
        }
    });

    // 認証チェック
    if (authLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-orange-600">認証状態を確認中...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="text-center p-8">
                <div className="text-red-600">ログインが必要です</div>
            </div>
        );
    }

    // 新規作成フォームを表示
    const handleAddProduct = () => {
        setIsEditing(true);
        setEditingProduct(null);
        reset({
            product_name: "",
            category: "",
            price: 0,
            quantity: 0,
            image_url: "",
            status: "在庫あり",
        });
        
        // ページの一番上にスクロール
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 編集フォームを表示
    const handleEditProduct = (product: Product) => {
        setIsEditing(true);
        setEditingProduct(product);
        reset({
            product_name: product.product_name,
            category: product.category,
            price: product.price,
            quantity: product.quantity,
            image_url: product.image_url,
            status: product.status as "在庫あり" | "在庫なし",
        });
        
        // ページの一番上にスクロール
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 編集をキャンセル
    const handleCancel = () => {
        setIsEditing(false);
        setEditingProduct(null);
        setImageFile(null);
        reset();
        clearError();
    };

    // 商品削除
    const handleDeleteProduct = async (product: Product) => {
        if (!window.confirm(`${product.product_name} を削除してもよろしいですか？`)) {
            return;
        }

        const success = await deleteProduct(product.id);
        if (success) {
            alert("商品を削除しました");
        }
    };

    // フォーム送信
    const onSubmit = async (data: ProductForm) => {
        try {
            if (editingProduct) {
                // 更新
                const updated = await updateProduct(editingProduct.id, data as UpdateProductRequest, imageFile || undefined);
                if (updated) {
                    alert("商品を更新しました");
                    handleCancel();
                }
            } else {
                // 新規作成
                const created = await createProduct(data as CreateProductRequest, imageFile || undefined);
                if (created) {
                    alert("商品を登録しました");
                    handleCancel();
                }
            }
        } catch (err) {
            console.error("フォーム送信エラー:", err);
        }
    };

    // 画像ファイル処理
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            // プレビュー用にBase64も生成
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setValue("image_url", reader.result, { shouldValidate: true });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* ヘッダー */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Store className="w-8 h-8 text-orange-600" />
                    <h1 className="text-3xl font-bold text-gray-800">商品管理</h1>
                </div>
                <p className="text-gray-600">店舗の商品を登録・編集・削除できます。チラシから登録された商品も編集可能です。</p>
            </div>

            {/* エラー表示 */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{error}</p>
                    <Button variant="outline" size="sm" onClick={clearError} className="mt-2">
                        エラーを閉じる
                    </Button>
                </div>
            )}

            {/* 商品登録/編集フォーム */}
            {isEditing && (
                <Card className="mb-6">
                    <CardHeader className="bg-orange-50">
                        <CardTitle className="flex items-center gap-2 text-orange-700">
                            <Package className="w-5 h-5" />
                            {editingProduct ? "商品編集" : "新規商品登録"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="product_name">商品名 *</Label>
                                    <Input 
                                        id="product_name" 
                                        {...register("product_name")} 
                                        className="border-orange-200 focus:border-orange-400"
                                    />
                                    {errors.product_name && (
                                        <p className="text-sm text-red-500">{errors.product_name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="category">カテゴリ *</Label>
                                    <Input 
                                        id="category" 
                                        {...register("category")} 
                                        placeholder="例: 野菜、肉類、パン"
                                        className="border-orange-200 focus:border-orange-400"
                                    />
                                    {errors.category && (
                                        <p className="text-sm text-red-500">{errors.category.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="price">価格（円） *</Label>
                                    <Input 
                                        id="price" 
                                        type="number" 
                                        {...register("price")} 
                                        className="border-orange-200 focus:border-orange-400"
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-red-500">{errors.price.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="quantity">在庫数 *</Label>
                                    <Input 
                                        id="quantity" 
                                        type="number" 
                                        {...register("quantity")} 
                                        className="border-orange-200 focus:border-orange-400"
                                    />
                                    {errors.quantity && (
                                        <p className="text-sm text-red-500">{errors.quantity.message}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="image_file">商品画像</Label>
                                <Input
                                    id="image_file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="border-orange-200 focus:border-orange-400"
                                />
                                {watch("image_url") && (
                                    <div className="mt-2">
                                        <img 
                                            src={watch("image_url")} 
                                            alt="プレビュー" 
                                            className="w-32 h-32 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="status">状態 *</Label>
                                <Select onValueChange={(value) => setValue("status", value as "在庫あり" | "在庫なし", { shouldValidate: true })}>
                                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
                                        <SelectValue placeholder="選択してください" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="在庫あり">在庫あり</SelectItem>
                                        <SelectItem value="在庫なし">在庫なし</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-red-500">{errors.status.message}</p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                >
                                    {isSubmitting ? "保存中..." : editingProduct ? "更新する" : "登録する"}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleCancel}
                                    className="border-orange-600 text-orange-600 hover:bg-orange-50"
                                >
                                    キャンセル
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* 商品一覧 */}
            <Card>
                <CardHeader className="bg-orange-50">
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2 text-orange-700">
                            <Package className="w-5 h-5" />
                            登録済み商品一覧
                        </CardTitle>
                        {!isEditing && (
                            <Button 
                                onClick={handleAddProduct}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                新規登録
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="text-orange-600">商品を読み込み中...</div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">まだ商品が登録されていません</p>
                            <Button 
                                onClick={handleAddProduct}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                最初の商品を登録
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product) => (
                                <Card key={product.id} className="border border-orange-100 hover:shadow-lg transition-shadow">
                                    <CardContent className="p-4">
                                        {product.image_url && (
                                            <img 
                                                src={product.image_url} 
                                                alt={product.product_name}
                                                className="w-full h-32 object-cover rounded-lg mb-3"
                                            />
                                        )}
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-gray-800 text-lg">{product.product_name}</h3>
                                                <Badge 
                                                    variant={product.status === "在庫あり" ? "default" : "secondary"}
                                                    className={product.status === "在庫あり" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                                >
                                                    {product.status}
                                                </Badge>
                                            </div>
                                            <p className="text-gray-600 text-sm">{product.category}</p>
                                            <p className="text-xl font-bold text-orange-600">¥{product.price.toLocaleString()}</p>
                                            <p className="text-gray-600 text-sm">在庫: {product.quantity}個</p>
                                            
                                            <div className="flex gap-2 pt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditProduct(product)}
                                                    className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
                                                >
                                                    <Edit2 className="w-4 h-4 mr-1" />
                                                    編集
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteProduct(product)}
                                                    className="border-red-600 text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}