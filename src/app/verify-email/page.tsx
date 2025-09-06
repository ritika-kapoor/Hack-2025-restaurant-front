'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('メールアドレスを認証しています...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      fetch(`${apiBaseUrl}/store/verify-email?token=${token}`)
        .then(async (res) => {
          if (res.ok) {
            setStatus('success');
            setMessage('メール認証が成功しました！ログインページに移動します。');
            setTimeout(() => {
              router.push('/login');
            }, 3000);
          } else {
            setStatus('error');
            const errorData = await res.json().catch(() => ({ error: 'サーバーからの応答が不正です。' }));
            setMessage(errorData.error || '不明なエラーが発生しました。');
          }
        })
        .catch((err) => {
          setStatus('error');
          setMessage(`ネットワークエラーが発生しました: ${err.message}`);
        });
    } else {
      setStatus('error');
      setMessage('認証トークンが見つかりません。');
    }
  }, [searchParams, router]);

  const StatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />;
      case 'success':
        return <CheckCircle2 className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
    }
  };

  const cardHeaderClass = () => {
    switch (status) {
        case 'loading': return 'from-orange-500 to-orange-600';
        case 'success': return 'from-green-500 to-green-600';
        case 'error': return 'from-red-500 to-red-600';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <div className={`bg-gradient-to-r ${cardHeaderClass()} p-8 text-center`}>
            <div className="flex justify-center mb-4">
                <div className="bg-white rounded-full p-4 shadow-lg">
                    <StatusIcon />
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white">メール認証</h2>
        </div>
        <CardContent className="p-8 text-center">
          <p className="text-lg text-gray-700 mb-8">{message}</p>
          {status !== 'loading' && (
            <Button asChild variant="outline">
                <Link href="/login" className="flex items-center space-x-2">
                    <ArrowLeft className="w-4 h-4" />
                    <span>ログイン画面に戻る</span>
                </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};


const VerifyEmailPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    )
}

export default VerifyEmailPage;
