import "../globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import ReduxProvider from "@/Provider/ReduxProvider";

export const metadata: Metadata = {
  title: "Your Site Title",
  description: "Your site description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <ReduxProvider>{children} </ReduxProvider>
      <Footer />
    </div>
  );
}
