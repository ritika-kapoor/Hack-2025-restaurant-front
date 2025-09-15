import { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F1B300" },
    { media: "(prefers-color-scheme: dark)", color: "#563124" },
  ],
};
