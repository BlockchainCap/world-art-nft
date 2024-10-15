import "./globals.css";
import "./fonts.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";

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
      <body className="bg-white text-custom-black font-twk-lausanne">
        <NextAuthProvider>
          {/* <ErudaProvider> */}
            <MiniKitProvider>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1 my-[6vh] pt-[1vh]">{children}</main>

              </div>
            </MiniKitProvider>
          {/* </ErudaProvider> */}
        </NextAuthProvider>
      </body>
    </html>
  );
}

