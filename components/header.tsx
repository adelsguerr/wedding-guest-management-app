"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./user-menu";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Familias", href: "/families" },
  { name: "Invitados", href: "/guests" },
  { name: "Mesas", href: "/tables" },
  { name: "WhatsApp", href: "/notifications" },
  { name: "Configuración", href: "/settings" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo (izquierda) */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline">
              Gestión de Boda
            </span>
          </Link>

          {/* Navigation y User Menu (derecha) */}
          {isPending ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-6">
              {/* Navigation - visible si hay sesión */}
              <nav className="hidden md:flex items-center gap-6">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-pink-600",
                        isActive
                          ? "text-pink-600"
                          : "text-gray-600"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
              {/* User Menu */}
              <UserMenu />
            </div>
          ) : (
            <nav className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600">
                  Comenzar Gratis
                </Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
