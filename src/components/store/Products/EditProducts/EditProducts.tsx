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
import { Plus, Edit2, Trash2, Package, Store, ChevronLeft, ChevronRight } from "lucide-react";

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
    
    // ページング用のstate
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // ページング計算
    const totalItems = products.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);
    
    // ページング関数
    const goToPage = (page: number) => {
        setCurrentPage(page);
        // ページ変更時にフォームを閉じる
        if (isEditing) {
            handleCancel();
        }
    };
    
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    };
    
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    };

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
            
            // 削除後のページング調整
            const newTotalItems = totalItems - 1;
            const newTotalPages = Math.ceil(newTotalItems / itemsPerPage);
            
            // 現在のページが最後のページで、そのページが空になった場合は前のページに移動
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }
        }
    };

    // フォーム送信
    const onSubmit = async (data: ProductForm) => {
        try {
            if (editingProduct) {
                // 更新時は画像URLをフォームデータから除外し、画像ファイルのみを使用
                const updateData = {
                    product_name: data.product_name,
                    category: data.category,
                    price: data.price,
                    quantity: data.quantity,
                    status: data.status,
                    image_url: '', // 空文字にして既存画像を保持
                };
                const updated = await updateProduct(editingProduct.id, updateData, imageFile || undefined);
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
                    <Store className="w-8 h-8 text-[#F1B300]" />
                    <h1 className="text-3xl font-bold text-[#563124]">商品管理</h1>
                </div>
                <p className="text-[#563124] opacity-80">店舗の商品を登録・編集・削除できます。チラシから登録された商品も編集可能です。</p>
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
                    <CardHeader className="bg-[#F7F4F4]">
                        <CardTitle className="flex items-center gap-2 text-[#563124]">
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
                                        className="border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]"
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
                                        className="border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]"
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
                                        className="border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]"
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
                                        className="border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]"
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
                                        className="border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]"
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
                                <Select 
                                    value={watch("status")} 
                                    onValueChange={(value) => setValue("status", value as "在庫あり" | "在庫なし", { shouldValidate: true })}
                                >
                                    <SelectTrigger className="border-orange-200 focus:border-[#F1B300] focus:ring-[#F1B300]">
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
                                    className="bg-[#F1B300] hover:bg-[#e6a000] text-[#563124] font-semibold"
                                >
                                    {isSubmitting ? "保存中..." : editingProduct ? "更新する" : "登録する"}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={handleCancel}
                                    className="border-[#563124] text-[#563124] hover:bg-[#F7F4F4] font-medium"
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
                <CardHeader className="bg-[#F7F4F4]">
                    <div className="items-center">
                        <CardTitle className="flex items-center gap-2 text-[#563124]">
                            <Package className="w-5 h-5" />
                            登録済み商品一覧
                        </CardTitle>
                        {!isEditing && (
                            <Button 
                                onClick={handleAddProduct}
                                className="bg-[#F1B300] hover:bg-[#e6a000] text-[#563124] font-semibold mt-4"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                新規登録
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {/* ページング情報 */}
                    {!isLoading && products.length > 0 && (
                        <div className="flex justify-between items-center mb-4 text-sm text-[#563124] opacity-70">
                            <div>
                                {totalItems}件中 {Math.min(startIndex + 1, totalItems)}-{Math.min(endIndex, totalItems)}件を表示
                            </div>
                            <div>
                                ページ {currentPage} / {totalPages}
                            </div>
                        </div>
                    )}
                    
                    {isLoading ? (
                        <div className="text-center py-8">
                            <div className="text-[#563124]">商品を読み込み中...</div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-[#563124] opacity-70 mb-4">まだ商品が登録されていません</p>
                            <Button 
                                onClick={handleAddProduct}
                                className="bg-[#F1B300] hover:bg-[#e6a000] text-[#563124] font-semibold"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                最初の商品を登録
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {currentProducts.map((product) => (
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
                                                <h3 className="font-semibold text-[#563124] text-lg">{product.product_name}</h3>
                                                <Badge 
                                                    variant={product.status === "在庫あり" ? "default" : "secondary"}
                                                    className={product.status === "在庫あり" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                                >
                                                    {product.status}
                                                </Badge>
                                            </div>
                                            <p className="text-[#563124] opacity-70 text-sm">{product.category}</p>
                                            <p className="text-xl font-bold text-[#F1B300]">¥{product.price.toLocaleString()}</p>
                                            <p className="text-[#563124] opacity-70 text-sm">在庫: {product.quantity}個</p>
                                            
                                            <div className="flex gap-2 pt-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditProduct(product)}
                                                    className="flex-1 border-[#563124] text-[#563124] hover:bg-[#F7F4F4] font-medium"
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
                    
                    {/* ページング操作 */}
                    {!isLoading && products.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            {/* 前へボタン */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToPreviousPage}
                                disabled={currentPage === 1}
                                className="border-[#563124] text-[#563124] hover:bg-[#F7F4F4] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                前へ
                            </Button>
                            
                            {/* ページ番号ボタン */}
                            <div className="flex space-x-1">
                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;
                                    
                                    // 表示するページ番号の制限（現在のページ周辺のみ表示）
                                    if (
                                        pageNumber === 1 ||
                                        pageNumber === totalPages ||
                                        (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                                    ) {
                                        return (
                                            <Button
                                                key={pageNumber}
                                                variant={currentPage === pageNumber ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => goToPage(pageNumber)}
                                                className={
                                                    currentPage === pageNumber
                                                        ? "bg-[#F1B300] hover:bg-[#e6a000] text-[#563124] font-semibold"
                                                        : "border-[#563124] text-[#563124] hover:bg-[#F7F4F4]"
                                                }
                                            >
                                                {pageNumber}
                                            </Button>
                                        );
                                    } else if (
                                        pageNumber === currentPage - 3 ||
                                        pageNumber === currentPage + 3
                                    ) {
                                        return (
                                            <span key={pageNumber} className="px-2 py-1 text-[#563124] opacity-50">
                                                ...
                                            </span>
                                        );
                                    }
                                    
                                    return null;
                                })}
                            </div>
                            
                            {/* 次へボタン */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={goToNextPage}
                                disabled={currentPage === totalPages}
                                className="border-[#563124] text-[#563124] hover:bg-[#F7F4F4] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                次へ
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}