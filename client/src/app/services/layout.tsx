import Navbar from "@/components/Navbar/Navbar";
import "../globals.css";

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white min-h-screen">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
