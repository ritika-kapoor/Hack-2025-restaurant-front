"use client";

import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';

interface NewsAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  newsTitle: string;
  newsUrl: string;
  analysisResult?: string;
  recommendations?: string;
  isLoading: boolean;
  defaultEmail?: string;
}

const NewsAnalysisModal: React.FC<NewsAnalysisModalProps> = ({
  isOpen,
  onClose,
  newsTitle,
  newsUrl,
  analysisResult,
  recommendations,
  isLoading,
  defaultEmail = ''
}) => {
  const [emailAddress, setEmailAddress] = useState(defaultEmail);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // defaultEmailが変更されたときにemailAddressを更新
  useEffect(() => {
    if (defaultEmail) {
      setEmailAddress(defaultEmail);
    }
  }, [defaultEmail]);

  if (!isOpen) return null;

  const sendEmail = async () => {
    if (!emailAddress || !analysisResult || !recommendations) return;

    setIsSendingEmail(true);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const response = await fetch(`${apiBaseUrl}/api/v1/news/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress,
          news_id: "news-" + Date.now(),
          news_title: newsTitle,
          news_url: newsUrl,
          analysis_result: analysisResult,
          recommendations: recommendations,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        setTimeout(() => {
          setEmailSent(false);
          setEmailAddress('');
        }, 3000);
      } else {
        throw new Error('メール送信に失敗しました');
      }
    } catch (error) {
      console.error('Email error:', error);
      alert('メール送信に失敗しました');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-[#563124] to-[#F1B300] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#563124]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold">AI相談結果</h2>
              <p className="text-sm opacity-90">スーパーマーケット経営への提案</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
          >
            <X className="w-5 h-5 text-[#563124]" />
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* ニュース情報 */}
          <div className="bg-[#F7F4F4] p-4 rounded-lg mb-6">
            <h3 className="font-bold text-[#563124] mb-2">📰 分析対象ニュース</h3>
            <p className="text-sm text-[#563124] mb-1">
              <strong>タイトル:</strong> {newsTitle}
            </p>
            <p className="text-sm text-[#563124]">
              <strong>URL:</strong> 
              <a href={newsUrl} target="_blank" rel="noopener noreferrer" className="text-[#F1B300] hover:underline ml-1">
                記事を読む
              </a>
            </p>
          </div>

          {isLoading ? (
            /* シンプルで確実なローディング */
            <div className="flex flex-col items-center justify-center py-16">
              {/* メインローディングアイコン */}
              <div className="relative mb-8">
                {/* パルスアニメーション */}
                <div className="w-24 h-24 bg-gradient-to-br from-[#563124] to-[#F1B300] rounded-full opacity-20 animate-ping"></div>
                
                {/* 中央のAIアイコン */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#563124] to-[#F1B300] rounded-full flex items-center justify-center shadow-xl animate-pulse">
                    <span className="text-2xl font-bold text-white">🤖</span>
                  </div>
                </div>
              </div>

              {/* テキスト */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-[#563124] mb-3">AI分析中...</h3>
                
                {/* 分析対象ニュースタイトル */}
                <div className="bg-white bg-opacity-80 rounded-lg p-4 mb-4 max-w-md mx-auto">
                  <h4 className="text-sm font-bold text-[#563124] mb-2">📰 分析対象</h4>
                  <p className="text-sm text-[#563124] font-medium leading-relaxed">
                    {newsTitle}
                  </p>
                </div>
                
                <p className="text-sm text-[#563124] opacity-70 max-w-md leading-relaxed">
                  ニュース記事の内容を読み取り、<br />
                  スーパーマーケット経営に特化した<br />
                  具体的な対応策を分析しています
                </p>
              </div>

              {/* シンプルなドットローダー */}
              <div className="flex space-x-2 mb-8">
                <div className="w-3 h-3 bg-[#563124] rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-[#F1B300] rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-[#563124] rounded-full animate-bounce"></div>
              </div>

              {/* ステータス表示 */}
              <div className="bg-white bg-opacity-80 rounded-lg px-6 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#F1B300] rounded-full animate-ping"></div>
                  <span className="text-sm font-medium text-[#563124]">記事を解析しています...</span>
                </div>
              </div>
            </div>
          ) : analysisResult && recommendations ? (
            /* 分析結果表示 */
            <div className="space-y-6">
              {/* 記事分析 */}
              <div>
                <h3 className="font-bold text-[#563124] mb-3 text-lg border-b-2 border-[#563124] pb-2">
                  📊 記事分析
                </h3>
                <div className="bg-[#f8f9fa] p-4 rounded-lg border-l-4 border-[#563124]">
                  <p className="text-sm text-[#563124] leading-relaxed whitespace-pre-line">
                    {analysisResult}
                  </p>
                </div>
              </div>

              {/* 推奨対応策 */}
              <div>
                <h3 className="font-bold text-[#563124] mb-3 text-lg border-b-2 border-[#F1B300] pb-2">
                  💡 推奨対応策
                </h3>
                <div className="bg-gradient-to-r from-[#fffdf5] to-[#fefefe] p-4 rounded-lg border-l-4 border-[#F1B300]">
                  <p className="text-sm text-[#563124] leading-relaxed whitespace-pre-line">
                    {recommendations}
                  </p>
                </div>
              </div>

              {/* メール送信セクション */}
              <div className="bg-[#F7F4F4] p-4 rounded-lg">
                <h3 className="font-bold text-[#563124] mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  メール送信
                </h3>
                <p className="text-sm text-[#563124] opacity-70 mb-3">
                  この分析結果をメールで送信できます
                </p>
                
                {emailSent ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">メールを送信しました！</span>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="メールアドレスを入力"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F1B300] focus:border-transparent"
                    />
                    <button
                      onClick={sendEmail}
                      disabled={!emailAddress || isSendingEmail}
                      className="px-4 py-2 bg-[#F1B300] text-[#563124] font-medium rounded-md hover:bg-[#e6a000] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSendingEmail ? '送信中...' : '送信'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NewsAnalysisModal;
