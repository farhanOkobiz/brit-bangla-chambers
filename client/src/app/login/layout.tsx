import Navbar from "@/components/Navbar/Navbar";
import "../globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Brit Bangla Chambers",
  description: "Law Consultancy Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={inter.className}>
      <Navbar />
      {children}
    </div>
  );
}
