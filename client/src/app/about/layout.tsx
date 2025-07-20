import Navbar from "@/components/Navbar/Navbar";
import "../globals.css";

export const metadata = {
  title: "Advocate Site",
  description: "Advocate portfolio",
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
