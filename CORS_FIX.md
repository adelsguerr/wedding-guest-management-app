# Corrección de Error "No se pudo conectar con el servidor"

## ⚠️ SOLUCIÓN RÁPIDA

**IMPORTANTE**: Después de hacer cambios en archivos de configuración, DEBES reiniciar el servidor:

```bash
# 1. Detén el servidor (Ctrl+C en la terminal)
# 2. Limpia la caché de Next.js:
rm -rf .next

# 3. Reinicia el servidor:
npm run dev
```

## Cambios Aplicados (Última Versión)

### 1. Auth Client Mejorado (`lib/auth-client.ts`)
- ✅ Usa `window.location.origin` para detectar automáticamente la URL base
- ✅ Evita problemas de CORS usando rutas relativas
- ✅ Fallback a `NEXT_PUBLIC_APP_URL` en servidor

### 2. API Auth Simplificada (`app/api/auth/[...all]/route.ts`)
- ✅ Removido wrapper CORS personalizado (causaba conflictos)
- ✅ CORS manejado globalmente por `next.config.js`

### 3. Next.js Headers Globales (`next.config.js`)
- ✅ Headers CORS para todas las rutas `/api/*`
- ✅ Credenciales permitidas
- ✅ Todos los orígenes permitidos (`*`)

### 4. Better Auth Config (`lib/auth.ts`)
- ✅ Múltiples orígenes confiables:
  - `http://localhost:3000`
  - `http://192.168.1.180:3000`
  - Variable de entorno `NEXT_PUBLIC_APP_URL`

## Pasos para Aplicar la Corrección

### 1. Detener el servidor (si está corriendo)
```bash
# Presiona Ctrl+C en la terminal donde corre el servidor
```

### 2. Reiniciar el servidor
```bash
npm run dev
```

### 3. Probar el login
1. Navega a http://localhost:3000 o http://192.168.1.180:3000
2. Haz clic en "Iniciar Sesión"
3. Ingresa tus credenciales
4. El login debería funcionar sin errores de CORS

## Verificar que Funciona

### Mensajes que YA NO deberías ver:
- ❌ "Failed to fetch"
- ❌ "CORS policy"
- ❌ "Network error"

### Mensajes que DEBERÍAS ver:
- ✅ "Sesión iniciada correctamente" (si credenciales válidas)
- ✅ "Email o contraseña incorrectos" (si credenciales inválidas)

## Si el Problema Persiste

1. **Limpia la caché del navegador**:
   - Chrome/Edge: `Ctrl + Shift + Delete`
   - Elimina cookies y caché

2. **Verifica las variables de entorno** (`.env`):
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   # O si usas IP local:
   NEXT_PUBLIC_APP_URL=http://192.168.1.180:3000
   ```

3. **Reinicia completamente**:
   ```bash
   # Detén el servidor
   # Elimina .next
   rm -rf .next
   # Reinstala dependencias
   npm install
   # Reinicia
   npm run dev
   ```

4. **Revisa la consola del navegador** (F12 → Console):
   - Si ves errores de CORS, copia el mensaje completo
   - Si ves "404" o "500", el problema es diferente

## Notas Técnicas

- Los cambios en `next.config.js` requieren reiniciar el servidor
- Los cambios en archivos de configuración (`.ts`) pueden requerir limpiar `.next`
- Better Auth usa cookies para sesiones, asegúrate de que tu navegador las acepte

## Estado Actual

- ✅ CORS configurado para desarrollo local
- ✅ Múltiples orígenes permitidos
- ✅ Headers explícitos en todas las APIs
- ⚠️ En producción, ajusta `trustedOrigins` a tu dominio real
