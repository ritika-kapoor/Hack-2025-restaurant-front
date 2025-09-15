import Link from 'next/link';
import { generateMetadata, generateBreadcrumbs } from "@/lib/seo";
import { StructuredData, createBreadcrumbStructuredData } from "@/components/seo/StructuredData";

export const metadata = generateMetadata({
  title: "参加店舗一覧",
  description: "meguruに参加してフードロス削減に取り組む店舗一覧。地域の持続可能な取り組みを支援する店舗を見つけて、お得な情報やタイムセールをチェックしましょう。",
  keywords: ["参加店舗", "店舗一覧", "フードロス削減", "地域店舗", "持続可能性", "タイムセール", "お得情報"],
  url: "/stores",
  image: "/og-stores.png"
});

interface Store {
  id: string;
  name: string;
  prefecture: string;
  city: string;
  street: string;
}

async function getStores(): Promise<Store[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const res = await fetch(`${apiBaseUrl}/api/v1/stores`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch stores');
  }
  const data = await res.json();
  return data.data;
}

export default async function StoresPage() {
  const stores = await getStores();
  const breadcrumbs = generateBreadcrumbs("/stores");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">参加店舗一覧</h1>
      <p className="text-gray-600 mb-6">
        meguruに参加してフードロス削減に取り組む地域の店舗をご紹介します。
      </p>
      
      <ul className="space-y-2">
        {stores.map((store) => (
          <li key={store.id} className="p-4 border rounded-md shadow-sm hover:bg-gray-50">
            <Link href={`/product_register/${store.id}`} className="block">
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">{store.name}</h2>
              <p className="text-gray-600">{store.prefecture} {store.city} {store.street}</p>
              <p className="text-sm text-green-600 mt-2">フードロス削減取り組み店舗</p>
            </Link>
          </li>
        ))}
      </ul>
      
      {/* パンくずリスト構造化データ */}
      <StructuredData data={createBreadcrumbStructuredData(breadcrumbs)} />
      
      {/* ItemList構造化データ */}
      <StructuredData 
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "meguru参加店舗一覧",
          "description": "フードロス削減に取り組む地域店舗のリスト",
          "numberOfItems": stores.length,
          "itemListElement": stores.map((store, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "LocalBusiness",
              "name": store.name,
              "address": {
                "@type": "PostalAddress",
                "addressRegion": store.prefecture,
                "addressLocality": store.city,
                "streetAddress": store.street,
                "addressCountry": "JP"
              },
              "description": `${store.name}はmeguruでフードロス削減に取り組んでいる地域店舗です`,
              "url": `https://meguru-food.com/product_register/${store.id}`,
              "knowsAbout": ["フードロス削減", "持続可能性", "地域貢献"]
            }
          }))
        }}
      />
      
      {/* CollectionPage構造化データ */}
      <StructuredData 
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "meguru参加店舗一覧",
          "description": "フードロス削減に取り組む地域店舗のコレクション",
          "url": "https://meguru-food.com/stores",
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": stores.length,
            "name": "参加店舗リスト"
          },
          "isPartOf": {
            "@type": "WebSite",
            "name": "meguru",
            "url": "https://meguru-food.com"
          }
        }}
      />
    </div>
  );
}
