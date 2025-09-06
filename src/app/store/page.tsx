"use client";

import { useEffect, useState, useCallback } from "react";

import Link from "next/link";
import axios from "axios";

// API Base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Clock, 
  ExternalLink, 
  Store, 
  Newspaper,
  Users,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye
} from "lucide-react";

import TweetFeed from "@/components/tweet/TweetFeed";
import NewsAnalysisModal from "@/components/NewsAnalysisModal";

// 型定義
interface Store {
  id: string;
  name: string;
  city: string;
  prefecture: string;
  street: string;
}

interface FlyerItem {
  product: {
    name: string;
    category: string;
  };
  price_excluding_tax: number;
  price_including_tax: number;
  unit: string;
  restriction_note: string;
}

interface Campaign {
  name: string;
  start_date: string;
  end_date: string;
}

interface FlyerData {
  store: Store;
  campaign: Campaign;
  flyer_items: FlyerItem[];
}

interface Flyer {
  id: string;
  store_id: string;
  image_data: string;
  flyer_data: FlyerData | null;
  display_expiry_date: string | null;
  created_at: string;
}

interface NewsArticle {
  id: string;
  title: string;
  link: string;
  published: string;
  content: string;
  image?: string;
  viewCount?: number;
}

const StoreHomePage = () => {
  const [nearbyFlyers, setNearbyFlyers] = useState<Flyer[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [flyersLoading, setFlyersLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [userCity, setUserCity] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [consultingNews, setConsultingNews] = useState<string | null>(null);
  const [consultationResult, setConsultationResult] = useState<{
    newsId: string;
    newsTitle: string;
    newsUrl: string;
    analysisResult: string;
    recommendations: string;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  // HTMLタグとHTMLエンティティを削除してテキストのみを抽出するヘルパー関数
  const stripHtmlTags = (html: string): string => {
    return html
      .replace(/<[^>]*>/g, '') // HTMLタグを削除
      .replace(/&nbsp;/g, ' ') // 非改行スペースを通常のスペースに変換
      .replace(/&amp;/g, '&') // &エンティティをアンパサンドに変換
      .replace(/&lt;/g, '<') // <エンティティを<に変換
      .replace(/&gt;/g, '>') // >エンティティを>に変換
      .replace(/&quot;/g, '"') // "エンティティを"に変換
      .replace(/&#39;/g, "'") // 'エンティティを'に変換
      .replace(/&[a-zA-Z0-9#]+;/g, '') // その他のHTMLエンティティを削除
      .replace(/\s+/g, ' ') // 連続するスペースを1つに統合
      .trim();
  };

  // 期限状況を判定するヘルパー関数
  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const expiryDateOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.ceil((expiryDateOnly.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return { status: 'urgent', text: '本日まで', color: 'bg-red-100 text-red-700' };
    } else if (diffDays === 1) {
      return { status: 'tomorrow', text: '明日まで', color: 'bg-orange-100 text-orange-700' };
    } else if (diffDays <= 3) {
      return { status: 'warning', text: `${diffDays}日後まで`, color: 'bg-yellow-100 text-yellow-700' };
    }
    return null;
  };

  // 記事の画像を取得するヘルパー関数
  const fetchOgImage = async (url: string): Promise<string | undefined> => {
    try {
      const ogImageUrl = `/api/og-image?url=${encodeURIComponent(url)}`;
      const response = await fetch(ogImageUrl);
      if (response.ok) {
        const data = await response.json();
        return data.imageUrl || undefined;
      }
      return undefined;
    } catch (error) {
      console.error('Failed to fetch OG image:', error);
      return undefined;
    }
  };

  // フードロス関連記事を取得
  const fetchNewsArticles = useCallback(async () => {
    try {
      setNewsLoading(true);
      
      try {
        // Next.jsのAPIルートを呼び出し（フロントエンド側）
        const rssUrl = '/api/rss-proxy?url=' + encodeURIComponent(
          'https://www.google.co.jp/alerts/feeds/04259291457760078544/5113707285348150825'
        );
        console.log('Fetching RSS from:', rssUrl);
        const response = await fetch(rssUrl);
        
        if (response.ok) {
          const xmlText = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
          const entries = Array.from(xmlDoc.querySelectorAll('entry'));
          
          const articles = await Promise.all(entries.slice(0, 5).map(async (entry, index) => {
            const title = entry.querySelector('title')?.textContent || '';
            let link = entry.querySelector('link')?.getAttribute('href') || '';
            const published = entry.querySelector('published')?.textContent || '';
            const content = entry.querySelector('content')?.textContent?.replace(/<[^>]*>/g, '') || '';
            
            // Google Alertsのリダイレクトリンクの場合、実際のURLを抽出
            if (link.includes('google.com/url')) {
              const urlParams = new URL(link).searchParams;
              const actualUrl = urlParams.get('url');
              if (actualUrl) {
                link = actualUrl;
              }
            }
            
            const image = await fetchOgImage(link);
            return {
              id: `rss-${index + 1}`,
              title: title.replace(/&lt;[^&]*&gt;/g, '').replace(/&[^;]*;/g, ''),
              link,
              published,
              content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
              image
            };
          }));
          
          // RSS記事が取得できた場合、閲覧数も一緒に取得
          await fetchNewsViewCounts(articles);
          return;
        }
      } catch (rssError) {
        console.error('RSS fetch failed, using fallback data:', rssError);
      }
      
      // RSSフィード取得に失敗した場合のダミーデータ
      const dummyArticles: NewsArticle[] = [
        {
          id: '1',
          title: 'フードロス削減に向けた新たな取り組み',
          link: 'https://news.example.com/foodloss1',
          published: '2025-08-10T14:48:15Z',
          content: '食品廃棄量を30%削減することを目標に、AI技術を活用した需要予測システムを導入',
          image: undefined // OG画像が取得できない場合のテスト用
        },
        {
          id: '2',
          title: '地域コミュニティで広がるフードシェアリング',
          link: 'https://news.example.com/foodshare',
          published: '2025-08-10T10:15:00Z',
          content: '近隣住民同士で余った食材を共有するプラットフォームが注目を集めています',
          image: undefined
        },
        {
          id: '3',
          title: 'フードロス対策アプリが若者に人気',
          link: 'https://news.example.com/app',
          published: '2025-08-09T20:30:00Z',
          content: '賞味期限が近い商品を安価で購入できるアプリの利用者が急増しています',
          image: undefined
        }
      ];

      // ダミーデータの場合も閲覧数を取得
      await fetchNewsViewCounts(dummyArticles);
    } catch (error) {
      console.error('Failed to fetch news articles:', error);
      setNewsArticles([]);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // ニュース閲覧数を取得
  const fetchNewsViewCounts = useCallback(async (articles: NewsArticle[]) => {
    try {
      const newsIDs = articles.map(article => article.id);
      const response = await axios.post(`${API_BASE_URL}/api/v1/news/view-counts`, {
        news_ids: newsIDs
      });
      
      const viewCounts = response.data.view_counts || {};
      
      // 記事に閲覧数を追加
      const articlesWithCounts = articles.map(article => ({
        ...article,
        viewCount: viewCounts[article.id] || 0
      }));
      
      setNewsArticles(articlesWithCounts);
    } catch (error) {
      console.error('Failed to fetch news view counts:', error);
      // エラーの場合は閲覧数なしで記事を設定
      setNewsArticles(articles);
    }
  }, []);

  // AI相談機能
  const consultWithAI = useCallback(async (article: NewsArticle) => {
    try {
      setConsultingNews(article.id);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/news/consult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          news_url: article.link,
          news_title: article.title,
          news_id: article.id,
        }),
      });

      if (!response.ok) {
        throw new Error("AI相談に失敗しました");
      }

      const result = await response.json();
      setConsultationResult({
        newsId: article.id,
        newsTitle: article.title,
        newsUrl: article.link,
        analysisResult: result.analysis_result,
        recommendations: result.recommendations,
      });
      setShowModal(true);
    } catch (error) {
      console.error("AI相談エラー:", error);
      alert("AI相談に失敗しました。しばらく時間をおいて再試行してください。");
    } finally {
      setConsultingNews(null);
    }
  }, []);

  // ニュース閲覧を記録
  const recordNewsView = useCallback(async (article: NewsArticle) => {
    try {
      const token = localStorage.getItem('store_token');
      if (!token) {
        console.log('No token found, skipping news view recording');
        return;
      }

      await axios.post(`${API_BASE_URL}/api/v1/news/view`, {
        news_url: article.link,
        news_title: article.title,
        news_id: article.id
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // 閲覧記録後、その記事の閲覧数を更新
      const response = await axios.get(`${API_BASE_URL}/api/v1/news/view-count/${article.id}`);
      const newViewCount = response.data.view_count || 0;
      
      // 状態を更新して閲覧数を反映
      setNewsArticles(prev => prev.map(a => 
        a.id === article.id ? { ...a, viewCount: newViewCount } : a
      ));
      
      console.log('News view recorded successfully:', article.title);
    } catch (error) {
      console.error('Failed to record news view:', error);
    }
  }, []);

  // 近隣店舗のチラシを取得
  const fetchNearbyFlyers = useCallback(async () => {
    try {
      setFlyersLoading(true);
      
      // ログインしているstoreの情報から都市を取得
      let currentUserCity = '';
      try {
        const token = localStorage.getItem('store_token');
        
        if (token) {
          const response = await axios.get(`${API_BASE_URL}/api/v1/stores/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          // EditShop.tsxと同じ構造でデータを取得
          if (response.data && response.data.data) {
            currentUserCity = response.data.data.city || '';
            setUserCity(currentUserCity);
            setUserEmail(response.data.data.email || '');
          }
        } else {
        }
        
        // 都市情報が取得できない場合は処理を停止
        if (!currentUserCity) {
          console.log('User city not found, skipping nearby flyers fetch');
          console.log('Final currentUserCity value:', currentUserCity);
          setNearbyFlyers([]);
          return;
        }
        
        console.log('Using city for nearby flyers search:', currentUserCity);
      } catch (profileError) {
        console.error('Failed to get user profile:', profileError);
        if (axios.isAxiosError(profileError)) {
          console.error('Profile API error details:', profileError.response?.data);
        }
        setNearbyFlyers([]);
        return;
      }

      // 実際のAPIを呼び出し
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/flyer/nearby?city=${encodeURIComponent(currentUserCity)}&limit=3`);
        if (response.ok) {
          const result = await response.json();
          console.log('Nearby flyers API response:', result);
          setNearbyFlyers(result.data || []);
        } else {
          console.error('API response not ok:', response.status, response.statusText);
          setNearbyFlyers([]);
        }
      } catch (apiError) {
        console.error('API call failed:', apiError);
        setNearbyFlyers([]);
      }
    } catch (error) {
      console.error('Failed to fetch nearby flyers:', error);
      setNearbyFlyers([]);
    } finally {
      setFlyersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNearbyFlyers();
    fetchNewsArticles();
  }, [fetchNearbyFlyers, fetchNewsArticles, fetchNewsViewCounts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F4F4] via-white to-orange-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
            <Store className="w-6 h-6 sm:w-8 sm:h-8 text-[#F1B300]" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#563124] whitespace-nowrap">店舗管理ホーム</h1>
            <Store className="w-6 h-6 sm:w-8 sm:h-8 text-[#F1B300]" />
          </div>
          <div className="flex items-center justify-center gap-2 text-[#563124] opacity-70">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{userCity ? `${userCity}の地域情報` : '地域情報を取得中...'}</span>
          </div>
        </div>

      

        {/* 近隣店舗のチラシセクション */}
        {(flyersLoading || nearbyFlyers.length > 0) && (
          <section>
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F1B300] rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#563124]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#563124] leading-tight">近隣店舗コミュニティ</h2>
                    <p className="text-xs sm:text-sm text-[#563124] opacity-70 hidden sm:block">地域の取り組みをチェック</p>
                  </div>
                </div>
                {nearbyFlyers.length >= 4 && (
                  <Button asChild variant="outline" className="border-[#563124] text-[#563124] hover:bg-[#F7F4F4] flex-shrink-0 ml-2">
                    <Link href="/stores" className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm">全て見る</span>
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Link>
                  </Button>
                )}
              </div>
              <p className="text-xs text-[#563124] opacity-70 mt-1 sm:hidden">地域の取り組みをチェック</p>
            </div>

            {flyersLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#F1B300]" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
                {nearbyFlyers.slice(0, 3).map((flyer) => {
                  const expiryStatus = getExpiryStatus(flyer.display_expiry_date || undefined);
                  return (
                    <Card key={flyer.id} className="group hover:shadow-lg transition-shadow duration-300 border-orange-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3 gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-[#563124] text-sm mb-1 truncate">
                              {flyer.flyer_data?.store.name}
                            </h3>
                            <p className="text-xs text-[#563124] opacity-60 line-clamp-2 leading-tight">
                              {flyer.flyer_data?.campaign.name}
                            </p>
                          </div>
                          {expiryStatus && (
                            <Badge className={`text-xs px-1.5 py-0.5 ${expiryStatus.color} flex-shrink-0`}>
                              {expiryStatus.text}
                            </Badge>
                          )}
                        </div>
                        <div className="aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-gray-100">
                          <img
                            src={`data:image/png;base64,${flyer.image_data}`}
                            alt={`${flyer.flyer_data?.store.name}のチラシ`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <Button asChild size="sm" className="w-full bg-[#F1B300] hover:bg-[#e6a000] text-[#563124]">
                          <Link href={`/store/flyer/${flyer.store_id}`}>
                            詳細を見る
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* フードロス関連ニュースセクション */}
        <section>
          <div className="mb-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F1B300] rounded-full flex items-center justify-center flex-shrink-0">
                <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-[#563124]" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#563124] leading-tight">フードロス関連ニュース</h2>
                <p className="text-xs sm:text-sm text-[#563124] opacity-70 hidden sm:block">業界の最新情報</p>
              </div>
            </div>
            <p className="text-xs text-[#563124] opacity-70 mt-1 sm:hidden">業界の最新情報</p>
          </div>

          {newsLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#F1B300]" />
            </div>
          ) : newsArticles.length > 0 ? (
            <div className="space-y-3">
              {newsArticles.slice(0, 5).map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow duration-300 border-orange-200">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex gap-3 sm:gap-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#F1B300] to-[#e6a000] rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {article.image ? (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // 画像読み込みエラーの場合、アイコンを表示
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<svg class="w-6 h-6 text-[#563124]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                              }
                            }}
                          />
                        ) : (
                          <Newspaper className="w-4 h-4 sm:w-6 sm:h-6 text-[#563124]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[#563124] mb-1 sm:mb-2 line-clamp-2 text-xs sm:text-sm leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-xs text-[#563124] opacity-70 mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2">
                          {stripHtmlTags(article.content)}
                        </p>
                        <div className="flex items-center justify-between mb-1 sm:mb-2">
                          <div className="flex items-center gap-1 sm:gap-2 text-xs text-[#563124] opacity-60">
                            <Clock className="w-3 h-3" />
                            <span className="hidden sm:inline">{formatDate(article.published)}</span>
                            <span className="sm:hidden">{formatDate(article.published).split(' ')[0]}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-[#563124] opacity-60">
                            <Eye className="w-3 h-3" />
                            <span className="hidden sm:inline">{article.viewCount ?? 0} 回閲覧</span>
                            <span className="sm:hidden">{article.viewCount ?? 0}回</span>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[#563124] hover:text-[#563124] hover:bg-[#F7F4F4] px-2 py-1 h-auto text-xs border border-[#563124] border-opacity-30"
                            onClick={() => consultWithAI(article)}
                            disabled={consultingNews === article.id}
                          >
                            <div className="flex items-center gap-1">
                              {consultingNews === article.id ? (
                                <>
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>分析中...</span>
                                </>
                              ) : (
                                <>
                                  <span>AIに相談</span>
                                </>
                              )}
                            </div>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-[#F1B300] hover:text-[#e6a000] hover:bg-[#F7F4F4] px-2 py-1 h-auto text-xs"
                            onClick={async () => {
                              // ニュース閲覧を記録
                              await recordNewsView(article);
                              // 新しいタブでリンクを開く
                              window.open(article.link, '_blank', 'noopener,noreferrer');
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <span>読む</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <p className="text-[#563124] opacity-70 text-sm">ニュース記事の取得に失敗しました</p>
            </Card>
          )}
        </section>

        {/* Tweet Feed Section */}
        <section>
          <TweetFeed />
        </section>
        </div>

              {/* AI相談モーダル */}
      <NewsAnalysisModal
        isOpen={showModal || consultingNews !== null}
        onClose={() => {
          setShowModal(false);
          setConsultationResult(null);
        }}
        newsTitle={consultationResult?.newsTitle || ""}
        newsUrl={consultationResult?.newsUrl || ""}
        analysisResult={consultationResult?.analysisResult}
        recommendations={consultationResult?.recommendations}
        isLoading={consultingNews !== null}
        defaultEmail={userEmail}
      />
      </div>
    );
};

export default StoreHomePage;