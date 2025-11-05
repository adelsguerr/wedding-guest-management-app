"use client";

import { useUIStore } from "@/lib/stores/ui-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, XCircle } from "lucide-react";

export function GlobalConfirmDialog() {
  const {
    isConfirmDialogOpen,
    confirmDialogTitle,
    confirmDialogMessage,
    confirmAction,
    closeConfirmDialog,
  } = useUIStore();

  return (
    <AlertDialog open={isConfirmDialogOpen} onOpenChange={closeConfirmDialog}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="items-center space-y-4">
          {/* Ícono circular con fondo rosa */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <Trash2 className="w-10 h-10 text-red-500" />
          </div>
          
          <AlertDialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            {confirmDialogTitle}
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-center text-gray-600 text-base">
            {confirmDialogMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2 sm:justify-center">
          <AlertDialogCancel className="w-full sm:w-auto flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50">
            <XCircle className="w-4 h-4" />
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={confirmAction} 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Sí, eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
