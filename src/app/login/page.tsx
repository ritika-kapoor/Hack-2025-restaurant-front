import StoreLogin from "@/components/store/login/login";
import { generateMetadata, META_PRESETS, generateBreadcrumbs } from "@/lib/seo";
import { StructuredData, createBreadcrumbStructuredData } from "@/components/seo/StructuredData";

export const metadata = generateMetadata({
  ...META_PRESETS.login,
  url: "/login"
});

export default function LoginPage() {
  const breadcrumbs = generateBreadcrumbs("/login");
  
  return (
    <div>
      <StoreLogin />
      
      {/* パンくずリスト構造化データ */}
      <StructuredData data={createBreadcrumbStructuredData(breadcrumbs)} />
      
      {/* WebPage構造化データ */}
      <StructuredData 
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "店舗ログイン",
          "description": "meguruの店舗向けプラットフォームログインページ",
          "url": "https://meguru-food.com/login",
          "isPartOf": {
            "@type": "WebSite",
            "name": "meguru",
            "url": "https://meguru-food.com"
          },
          "potentialAction": {
            "@type": "LoginAction",
            "target": "https://meguru-food.com/login",
            "object": "店舗アカウント"
          }
        }}
      />
    </div>
  );
}