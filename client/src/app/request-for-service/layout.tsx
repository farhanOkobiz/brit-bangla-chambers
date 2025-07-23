import Navbar from "@/components/Navbar/Navbar";
import "../globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Contact | Brit Bangla Chamber",
  description: "Get in touch with us for legal and consultancy services.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-black text-white antialiased">
      <Navbar />
      {children}
    </div>
  );
}
