#!/bin/bash

#########################################################
# Script de Verificación Post-Migración
# Wedding Guest Management App
# Verifica que la migración fue exitosa
#########################################################

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Verificación Post-Migración${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verificar que .env existe
if [ ! -f ".env" ]; then
    print_error "Archivo .env no encontrado"
    exit 1
fi

print_success "Archivo .env encontrado"
echo ""

# Leer DATABASE_URL del .env
DATABASE_URL=$(grep "^DATABASE_URL" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")

if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL no está configurado en .env"
    exit 1
fi

print_info "DATABASE_URL configurado:"
# Ocultar password en el output
SAFE_URL=$(echo "$DATABASE_URL" | sed 's/:[^@]*@/:****@/')
echo "  $SAFE_URL"
echo ""

# Verificar si es cloud (contiene aws o neon.tech)
if [[ "$DATABASE_URL" == *"aws"* ]] || [[ "$DATABASE_URL" == *"neon.tech"* ]]; then
    print_success "Detectada configuración CLOUD (Neon)"
    IS_CLOUD=true
else
    print_warning "Detectada configuración LOCAL"
    IS_CLOUD=false
fi

echo ""
print_info "Ejecutando verificaciones..."
echo ""

# Test 1: Verificar conexión con Prisma
print_info "Test 1/5: Conexión a base de datos"
if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
    print_success "Conexión exitosa"
else
    print_error "No se pudo conectar - Verifica DATABASE_URL"
    exit 1
fi

echo ""

# Test 2: Contar registros
print_info "Test 2/5: Conteo de registros"

FAMILIES=$(npx prisma db execute --stdin <<< 'SELECT COUNT(*) FROM family_heads WHERE "isDeleted" = false;' 2>/dev/null | tail -n 1)
GUESTS=$(npx prisma db execute --stdin <<< 'SELECT COUNT(*) FROM guests WHERE "isDeleted" = false;' 2>/dev/null | tail -n 1)
TABLES=$(npx prisma db execute --stdin <<< 'SELECT COUNT(*) FROM tables WHERE "isDeleted" = false;' 2>/dev/null | tail -n 1)

if [ -z "$FAMILIES" ]; then
    print_warning "No se pudieron contar registros con Prisma, intentando con psql..."
    
    # Intentar con psql directamente
    export PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    
    FAMILIES=$(psql "$DATABASE_URL" -t -c 'SELECT COUNT(*) FROM family_heads WHERE "isDeleted" = false;' 2>/dev/null | xargs)
    GUESTS=$(psql "$DATABASE_URL" -t -c 'SELECT COUNT(*) FROM guests WHERE "isDeleted" = false;' 2>/dev/null | xargs)
    TABLES=$(psql "$DATABASE_URL" -t -c 'SELECT COUNT(*) FROM tables WHERE "isDeleted" = false;' 2>/dev/null | xargs)
    
    unset PGPASSWORD
fi

echo "  Familias: ${FAMILIES:-0}"
echo "  Invitados: ${GUESTS:-0}"
echo "  Mesas: ${TABLES:-0}"

if [ "${FAMILIES:-0}" -gt 0 ]; then
    print_success "Se encontraron registros en la base de datos"
else
    print_warning "La base de datos está vacía"
fi

echo ""

# Test 3: Verificar Prisma Client
print_info "Test 3/5: Prisma Client"
if [ -d "node_modules/.prisma/client" ]; then
    print_success "Prisma Client generado"
else
    print_error "Prisma Client no encontrado"
    echo "  Ejecuta: npx prisma generate"
fi

echo ""

# Test 4: Verificar que el servidor puede iniciar
print_info "Test 4/5: Build de Next.js"
if npm run build > /dev/null 2>&1; then
    print_success "Build exitoso"
else
    print_warning "Build falló - Revisa errores con: npm run build"
fi

echo ""

# Test 5: Probar endpoint API
print_info "Test 5/5: Endpoint API (requiere servidor corriendo)"
print_info "Iniciando servidor temporalmente..."

# Iniciar servidor en background
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!

# Esperar a que el servidor inicie
sleep 5

# Probar endpoint
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/stats 2>/dev/null)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Endpoint /api/stats respondió correctamente"
    
    # Obtener datos
    STATS=$(curl -s http://localhost:3000/api/stats 2>/dev/null)
    echo "  Datos del dashboard:"
    echo "$STATS" | grep -o '"totalFamilies":[0-9]*' | cut -d ':' -f2 | xargs -I {} echo "    Total familias: {}"
    echo "$STATS" | grep -o '"totalGuests":[0-9]*' | cut -d ':' -f2 | xargs -I {} echo "    Total invitados: {}"
else
    print_warning "No se pudo acceder al endpoint (código: $HTTP_CODE)"
    print_info "Inicia manualmente con: npm run dev"
fi

# Detener servidor
kill $SERVER_PID 2>/dev/null

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Resumen de Verificación${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

if $IS_CLOUD; then
    print_success "✓ Configuración CLOUD activa"
    print_info "La app está usando la base de datos en la nube"
else
    print_warning "⚠ Configuración LOCAL activa"
    print_info "Para usar cloud, actualiza DATABASE_URL en .env"
fi

echo ""
print_info "Próximos pasos recomendados:"
echo "  1. Abrir Prisma Studio: npx prisma studio"
echo "  2. Revisar datos visualmente"
echo "  3. Iniciar app: npm run dev"
echo "  4. Probar UI en: http://localhost:3000"
echo ""

if $IS_CLOUD && [ "${FAMILIES:-0}" -gt 0 ]; then
    echo -e "${GREEN}¡Migración verificada exitosamente! 🎉${NC}"
else
    echo -e "${YELLOW}Revisa los warnings arriba si los hay.${NC}"
fi

echo ""
