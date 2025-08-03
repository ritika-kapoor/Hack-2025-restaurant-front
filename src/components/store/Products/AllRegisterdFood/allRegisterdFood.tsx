"use client"

import Image from 'next/image';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import Link from 'next/link';

// ダミーデータの作成
const dummyFoods = [
    { id: 1, name: 'キャベツ', price: 100, image_url: '/images/food1.jpg' },
    { id: 2, name: '白菜', price: 200, image_url: '/images/food2.jpg' },
    { id: 3, name: 'にんじん', price: 150, image_url: '/images/food3.jpg' },
    // 他の商品も追加
];

export default function AllRegisterdFood() {
    const handleDelete = (food: typeof dummyFoods[0]) => {
        // Implement delete logic here
        console.log('Delete:', food);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">商品一覧</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummyFoods.map((food) => (
                    <Card key={food.id} className="relative hover:shadow-xl transition-shadow duration-300 shadow-md">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" className="absolute right-2 top-2 p-2">
                                    <MoreVertical className="h-5 w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{food.name}</DialogTitle>
                                    <DialogDescription>
                                        商品の編集または削除を選択してください。
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-center gap-4">
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDelete(food)}
                                        className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <Trash className="h-4 w-4" />
                                        削除
                                    </Button>
                                    <Link href={`/store/products/${food.id}/edit`}>
                                    <Button

                                        className="flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        編集
                                    </Button>
                                    </Link>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <CardHeader>
                            <CardTitle className="text-lg">{food.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative w-full h-48 shadow-inner">
                                <Image
                                    src={food.image_url}
                                    alt={food.name}
                                    fill
                                    className="object-cover rounded-md"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <p className="text-lg font-bold">{food.price}円</p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}