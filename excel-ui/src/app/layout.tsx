// app/layout.tsx
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";


export const metadata = {
  title: "Dashboard",
  description: "Next.js + Shadcn + Tailwind + Ngrok UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex bg-gray-900 text-green-400 min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6">{children}</main>
      </body>
    </html>
  );
}
