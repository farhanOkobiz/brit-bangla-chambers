import type { ReactNode } from "react";
import "../globals.css";
import Navbar from "@/components/Navbar/Navbar";

export const metadata = {
  title: "Help Center | Brit Bangla Chamber",
  description: "Frequently asked questions and support guides.",
};

export default function HelpCenterLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="bg-slate-950 text-white">
      <Navbar />
      {children}
    </div>
  );
}
