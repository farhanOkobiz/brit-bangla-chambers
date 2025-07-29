import Navbar from "@/components/Navbar/Navbar";
import "../globals.css";

export const metadata = {
  title: "Brit Bangla Chambers",
  description: "Law consultancy platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
