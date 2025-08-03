import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export interface Product {
  id: string;
  product_id: string;
  product_name: string;
  category: string;
  price: number;
  quantity: number;
  image_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  product_name: string;
  category: string;
  price: number;
  quantity: number;
  image_url: string;
  status: string;
}

export interface UpdateProductRequest {
  product_name: string;
  category: string;
  price: number;
  quantity: number;
  image_url: string;
  status: string;
}

const API_BASE = '/api/v1/products';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 認証ヘッダーを取得
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('store_token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }, []);

  // 商品一覧を取得
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE, {
        headers: getAuthHeaders(),
      });
      setProducts(response.data.data || []);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      console.error('商品一覧取得エラー:', err);
      setError(axiosError.response?.data?.error || '商品一覧の取得に失敗しました');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  // 商品を作成
  const createProduct = useCallback(async (productData: CreateProductRequest, imageFile?: File): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('product_name', productData.product_name);
      formData.append('category', productData.category);
      formData.append('price', productData.price.toString());
      formData.append('quantity', productData.quantity.toString());
      formData.append('status', productData.status);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const token = localStorage.getItem('store_token');
      const response = await axios.post(API_BASE, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const newProduct = response.data.data;
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      console.error('商品作成エラー:', err);
      setError(axiosError.response?.data?.error || '商品の作成に失敗しました');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 商品を更新
  const updateProduct = useCallback(async (id: string, productData: UpdateProductRequest, imageFile?: File): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('product_name', productData.product_name);
      formData.append('category', productData.category);
      formData.append('price', productData.price.toString());
      formData.append('quantity', productData.quantity.toString());
      formData.append('status', productData.status);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const token = localStorage.getItem('store_token');
      const response = await axios.put(`${API_BASE}/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedProduct = response.data.data;
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      console.error('商品更新エラー:', err);
      setError(axiosError.response?.data?.error || '商品の更新に失敗しました');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 商品を削除
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: getAuthHeaders(),
      });
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      console.error('商品削除エラー:', err);
      setError(axiosError.response?.data?.error || '商品の削除に失敗しました');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  // 特定の商品を取得
  const getProduct = useCallback(async (id: string): Promise<Product | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE}/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      console.error('商品取得エラー:', err);
      setError(axiosError.response?.data?.error || '商品の取得に失敗しました');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  // 初回読み込み
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    clearError: () => setError(null),
  };
}; 