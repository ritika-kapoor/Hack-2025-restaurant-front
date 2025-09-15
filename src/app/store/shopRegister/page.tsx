import StoreRegister from "@/components/store/registerShop/registerShop";
import { generateMetadata, META_PRESETS, generateBreadcrumbs } from "@/lib/seo";
import { StructuredData, createBreadcrumbStructuredData } from "@/components/seo/StructuredData";

export const metadata = generateMetadata({
  ...META_PRESETS.register,
  url: "/store/shopRegister"
});

export default function ShopRegisterPage() {
  const breadcrumbs = generateBreadcrumbs("/store/shopRegister");
  
  return (
    <div>
      <StoreRegister />
      
      {/* パンくずリスト構造化データ */}
      <StructuredData data={createBreadcrumbStructuredData(breadcrumbs)} />
      
      {/* WebPage構造化データ */}
      <StructuredData 
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "新規店舗登録",
          "description": "meguruでフードロス削減を始めるための店舗登録ページ",
          "url": "https://meguru-food.com/store/shopRegister",
          "isPartOf": {
            "@type": "WebSite",
            "name": "meguru",
            "url": "https://meguru-food.com"
          },
          "potentialAction": {
            "@type": "RegisterAction",
            "target": "https://meguru-food.com/store/shopRegister",
            "object": "店舗アカウント",
            "result": {
              "@type": "CreateAction",
              "object": "店舗プロフィール"
            }
          }
        }}
      />
      
      {/* Offer構造化データ（無料登録） */}
      <StructuredData 
        data={{
          "@context": "https://schema.org",
          "@type": "Offer",
          "name": "meguru店舗登録",
          "description": "無料でmeguruに店舗登録してフードロス削減を始める",
          "price": "0",
          "priceCurrency": "JPY",
          "availability": "https://schema.org/InStock",
          "url": "https://meguru-food.com/store/shopRegister",
          "seller": {
            "@type": "Organization",
            "name": "meguru"
          },
          "itemOffered": {
            "@type": "Service",
            "name": "店舗管理プラットフォーム",
            "description": "チラシ配信、在庫管理、地域コミュニティ連携サービス"
          }
        }}
      />
    </div>
  );
}