import { NextResponse } from "next/server";

// ダミーストアデータ（通常はDBに保存）
export const dummyStores = [
  {
    id: 1,
    name: "ダミーストア",
    email: "dummy@example.com",
    password: "dummypassword123",
    phone_number: "090-0000-0000",
    address_zipcode: "150-0041",
    address_prefecture: "東京都",
    address_city: "渋谷区",
    address_street: "神南1-1-1",
  },
];

// GETリクエスト: ダミーストア一覧を返す
export async function GET() {
  return NextResponse.json(dummyStores);
}

// POSTリクエスト: ダミーストアを更新（1件目を上書き）
export async function POST(req: Request) {
  try {
    const updatedStore = await req.json();

    // IDが1のダミーデータを更新
    dummyStores[0] = {
      ...dummyStores[0],
      ...updatedStore,
    };

    return NextResponse.json({ message: "更新成功", store: dummyStores[0] });
  } catch (error) {
    console.error("更新エラー:", error);
    return NextResponse.json(
      { error: "更新に失敗しました" },
      { status: 500 }
    );
  }
}