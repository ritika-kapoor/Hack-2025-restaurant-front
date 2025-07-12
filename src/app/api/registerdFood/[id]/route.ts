import { NextResponse } from "next/server";


export const dummyRegisteredFoods = [
    {
        id: 1,
        product_name: "ダミー商品",
        price: 100,
        quantity: 1,
        product_image: "https://dummyimage.com/100x100/000/fff.png&text=100x100",
        status: "true",
        registered_date: "2025-01-01",
    },
    {
        id: 2,
        product_name: "ダミー商品2",
        price: 200,
        quantity: 2,
        product_image: "https://dummyimage.com/100x100/000/fff.png&text=200x200",
        status: "true",
        registered_date: "2025-01-02",
    },
    {
        id: 3,
        product_name: "ダミー商品3",
        price: 300,
        quantity: 3,
        product_image: "https://dummyimage.com/100x100/000/fff.png&text=300x300",
        status: "true",
        registered_date: "2025-01-03",
    }
];

// GET /api/registerdFood/[id]
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id);
    const food = dummyRegisteredFoods.find((f) => f.id === id);

    if (!food) {
        return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
    }

    return NextResponse.json(food);
}


// 商品の追加
export async function POST(req: Request) {
    try {
        const registeredFood = await req.json();
        dummyRegisteredFoods.push(registeredFood);
        return NextResponse.json({ message: "登録成功", registeredFood });
    } catch (error) {
        console.error("登録エラー:", error);
        return NextResponse.json(
            { error: "登録に失敗しました" },
            { status: 500 }
        );
    }
}


// 商品の編集

export async function PUT(req: Request) {
    try {
        const updatedFood = await req.json();
        const index = dummyRegisteredFoods.findIndex((food) => food.id === updatedFood.id);
        if (index !== -1) {
            dummyRegisteredFoods[index] = {
                ...dummyRegisteredFoods[index],
                ...updatedFood,
            };
            return NextResponse.json({ message: "更新成功", registeredFood: dummyRegisteredFoods[index] });
        } else {
            return NextResponse.json({ error: "商品が見つかりません" }, { status: 404 });
        }
    } catch (error) {
        console.error("更新エラー:", error);
        return NextResponse.json(
            { error: "更新に失敗しました" },
            { status: 500 }
        );
    }
}
