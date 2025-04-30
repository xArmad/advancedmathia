import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fraction Explorer - Adaptive Learning for Kids",
  description: "An interactive and adaptive platform to help kids master fractions at their own pace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
