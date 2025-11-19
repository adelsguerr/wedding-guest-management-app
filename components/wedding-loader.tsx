export function WeddingLoader({
  message = "Cargando...",
}: {
  message?: string;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-8">
        {/* Anillo elegante con diamante */}
        <div className="relative w-32 h-32 mx-auto">
          {/* Anillo principal */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Aro dorado */}
              <div
                className="w-20 h-20 rounded-full border-[3px] border-transparent bg-gradient-to-br from-amber-200 via-yellow-300 to-amber-400 shadow-2xl animate-[spin_4s_linear_infinite]"
                style={{
                  boxShadow:
                    "0 0 30px rgba(251, 191, 36, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.5)",
                }}
              ></div>
              {/* Hueco interior */}
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"></div>
            </div>
          </div>

          {/* Partículas flotantes */}
          <div className="absolute inset-0 pointer-events-none"></div>
        </div>

        {/* Texto elegante */}
        <div className="space-y-3">
          <p className="text-base text-gray-600 font-light tracking-[0.2em] uppercase">
            {message}
          </p>
          {/* Línea decorativa */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
            <div className="w-1.5 h-1.5 bg-amber-300 rounded-full animate-pulse"></div>
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
