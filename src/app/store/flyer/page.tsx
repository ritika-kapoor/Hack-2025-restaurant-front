import ProductLists from "@/components/store/flyer/ProductLists";
import Link from "next/link";
// ここには新規登録、編集、一覧表示のページを作成する。


// 新規登録、編集のボタンが存在し　下には現在開催しているチラシの一覧表示がある。

export default function Page() {
    return (
        <div>
            <Link href="/store/flyer/register">チラシから商品登録</Link>
            <ProductLists />
        </div>
    )
}