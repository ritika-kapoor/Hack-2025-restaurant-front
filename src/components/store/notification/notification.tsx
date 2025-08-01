"use client";

import { 
    CheckCircle,
    MessageCircle,
    Clock
  } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import IsLoginOrNot from "@/components/isLoginOrNot/isLoginOrNot"

export default function Notification() {

  // 今は仮のトークンをセットする
  // localStorage.setItem("store_token", "123")

  // console.log(localStorage.getItem("store_token"))

  
  const router = useRouter();
  
  const notifications = [
    {
      id: 1,
      title: '注文準備完了',
      description: '田中様のご注文（#1234）の商品準備が完了しました。',
      timestamp: '5分前',
      icon: <CheckCircle className="h-6 w-6" />,
      type: '準備完了',
      badgeColor: 'bg-green-100 text-green-800'
    },
    {
      id: 2,
      title: '新規メッセージ',
      description: '佐藤様より商品の在庫についてお問い合わせが届いています。',
      timestamp: '30分前',
      icon: <MessageCircle className="h-6 w-6" />,
      type: '未対応',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 3,
      title: '受け取り予定時刻変更',
      description: '鈴木様が受け取り時間を15:00から16:00に変更されました。',
      timestamp: '1時間前',
      icon: <Clock className="h-6 w-6" />,
      type: '時間変更',
      badgeColor: 'bg-yellow-100 text-yellow-800'
    }
  ];
  
  const handleRemoveToken = () => {
    localStorage.removeItem("store_token");
    router.push("/login");
  }

  return (
    <div>
      <IsLoginOrNot />
      <Button onClick={() => handleRemoveToken()}>ログアウト</Button>
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">お客様対応通知</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className="hover:bg-accent transition-colors">
                <CardContent className="flex items-start space-x-4 p-4">
                  <div className="flex-shrink-0">
                    {notification.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <Badge variant="secondary" className={notification.badgeColor}>
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.description}
                    </p>
                    <span className="text-xs text-muted-foreground mt-2 block">
                      {notification.timestamp}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
    </div>
  );
}