"use client";

import { useUIStore } from '@/lib/stores';
import { Loader2 } from 'lucide-react';

export function GlobalLoadingOverlay() {
  const { isGlobalLoading, loadingMessage } = useUIStore();

  if (!isGlobalLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-4">
        <div className="flex flex-col items-center text-center space-y-4">
          <Loader2 className="h-12 w-12 text-pink-600 animate-spin" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {loadingMessage || 'Procesando...'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Por favor espera un momento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
