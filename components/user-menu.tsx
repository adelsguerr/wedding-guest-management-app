"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { toast } from "sonner";

export function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Sesión cerrada", {
        description: "Has cerrado sesión correctamente",
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Error", {
        description: "No se pudo cerrar la sesión",
      });
    }
  };

  if (isPending) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!session?.user) {
    return null;
  }

  const initials = session.user.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : session.user.email?.slice(0, 2).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
            <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name || "Usuario"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
            {session.user.role && (
              <p className="text-xs leading-none text-muted-foreground capitalize">
                Rol: {session.user.role}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/settings")} className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
