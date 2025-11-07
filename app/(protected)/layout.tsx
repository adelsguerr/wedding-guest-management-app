import { Header } from "@/components/header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />
      <main>{children}</main>
    </div>
  );
}
