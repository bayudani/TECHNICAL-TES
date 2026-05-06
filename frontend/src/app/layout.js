import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Garuda Cyber Test",
  description: "Aplikasi CRUD dengan Laravel dan Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-theme="light">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen bg-base-100 p-4 sm:p-10">
          {children}
        </main>
      </body>
    </html>
  );
}
