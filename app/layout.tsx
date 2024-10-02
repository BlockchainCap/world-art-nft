import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import { TopNavBar } from "@/components/TopNavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );
  return (
    <html lang="en">
      <body className="bg-black text-[#E2DFDA]">
        <NextAuthProvider>
          <ErudaProvider>
            <MiniKitProvider>
              <div className="flex flex-col min-h-screen">
                <TopNavBar />
                <main className="flex-1 mt-[10vh]">{children}</main>
              </div>
            </MiniKitProvider>
          </ErudaProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}

