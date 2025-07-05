"use client";
import type { Metadata } from "next";
import { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered with scope:", registration.scope);

          // プッシュ通知の購読ロジック
          if ("PushManager" in window) {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") {
                registration.pushManager.getSubscription().then((subscription) => {
                  if (subscription) {
                    // 既に購読済み
                    console.log("Already subscribed:", subscription);
                    sendSubscriptionToBackend(subscription);
                  } else {
                    // 新規購読
                    registration.pushManager.subscribe({
                      userVisibleOnly: true,
                      applicationServerKey: urlBase64ToUint8Array("BNCeYBXGZPLsE8vPl-WZ4fi-wqIYNs35WsF2uqL1iTRamcwnd4fVxdyDEatst9UrlCjC2Zd1js8QsfFL8MriUvQ"), // ここにVAPID公開鍵を設定
                    }).then((newSubscription) => {
                      console.log("New subscription:", newSubscription);
                      sendSubscriptionToBackend(newSubscription);
                    }).catch((error) => {
                      console.error("Failed to subscribe the user:", error);
                    });
                  }
                });
              } else {
                console.warn("Notification permission denied.");
              }
            });
          }
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  // 購読情報をバックエンドに送信する関数
  const sendSubscriptionToBackend = async (subscription: PushSubscription) => {
    try {
      const subscriptionData = subscription.toJSON();
      const payload = {
        endpoint: subscriptionData.endpoint,
        p256dh: subscriptionData.keys.p256dh,
        auth: subscriptionData.keys.auth,
      };

      const response = await fetch("http://localhost:8080/api/v1/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        console.log("Subscription sent to backend successfully.");
      } else {
        console.error("Failed to send subscription to backend.");
      }
    } catch (error) {
      console.error("Error sending subscription to backend:", error);
    }
  };

  // VAPID公開鍵をUint8Arrayに変換するヘルパー関数
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
