#!/bin/bash

#########################################################
# Script de Migración de Base de Datos Local a Cloud
# Wedding Guest Management App
# Fecha: 23 de octubre de 2025
#########################################################

set -e  # Detener en caso de error

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Migración BD Local → Cloud (Neon)${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Función para imprimir con color
print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }

# Función para pedir confirmación
confirm() {
    read -p "$1 (y/n): " -n 1 -r
    echo
    [[ $REPLY =~ ^[Yy]$ ]]
}

#########################################################
# PASO 1: CONFIGURACIÓN
#########################################################

print_info "Paso 1/6: Configuración de credenciales"
echo ""

# Credenciales BD Local (desde .env)
LOCAL_HOST="localhost"
LOCAL_PORT="5432"
LOCAL_USER="postgres"
LOCAL_DB="wedding_db"

echo "Credenciales BD Local (desde .env):"
echo "  Host: $LOCAL_HOST"
echo "  Puerto: $LOCAL_PORT"
echo "  Usuario: $LOCAL_USER"
echo "  Base de datos: $LOCAL_DB"
echo ""

# Pedir contraseña local
read -sp "Contraseña BD Local [$LOCAL_USER]: " LOCAL_PASS
echo ""
export PGPASSWORD="$LOCAL_PASS"

# Credenciales BD Cloud (Neon)
echo ""
print_info "Credenciales BD Cloud (Neon)"
echo "Ejemplo: postgresql://neondb_owner:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
echo ""

read -p "Host Cloud (ej: ep-young-thunder-xxxxx.us-east-2.aws.neon.tech): " CLOUD_HOST
read -p "Puerto Cloud [5432]: " CLOUD_PORT
CLOUD_PORT=${CLOUD_PORT:-5432}
read -p "Usuario Cloud (ej: neondb_owner): " CLOUD_USER
read -p "Base de datos Cloud (ej: neondb): " CLOUD_DB
read -sp "Contraseña Cloud: " CLOUD_PASS
echo ""

# Connection string cloud
CLOUD_CONN="postgresql://${CLOUD_USER}:${CLOUD_PASS}@${CLOUD_HOST}:${CLOUD_PORT}/${CLOUD_DB}?sslmode=require"

# Archivos de trabajo
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOCAL_DUMP="wedding_local_${TIMESTAMP}.dump"
CLOUD_BACKUP="wedding_cloud_backup_${TIMESTAMP}.dump"
LOG_FILE="migration_${TIMESTAMP}.log"

echo ""
print_success "Configuración completada"
echo "  - Dump local: $LOCAL_DUMP"
echo "  - Backup cloud: $CLOUD_BACKUP"
echo "  - Log: $LOG_FILE"
echo ""

#########################################################
# PASO 2: VERIFICAR CONEXIONES
#########################################################

print_info "Paso 2/6: Verificando conexiones..."
echo ""

# Verificar conexión local
print_info "Verificando conexión BD Local..."
if psql -h $LOCAL_HOST -p $LOCAL_PORT -U $LOCAL_USER -d $LOCAL_DB -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "Conexión local exitosa"
else
    print_error "Error: No se pudo conectar a BD Local"
    exit 1
fi

# Verificar conexión cloud
print_info "Verificando conexión BD Cloud..."
export PGPASSWORD="$CLOUD_PASS"
if psql "$CLOUD_CONN" -c "SELECT 1;" > /dev/null 2>&1; then
    print_success "Conexión cloud exitosa"
else
    print_error "Error: No se pudo conectar a BD Cloud"
    exit 1
fi

echo ""
print_success "Todas las conexiones verificadas"
echo ""

#########################################################
# PASO 3: BACKUP DE BD CLOUD (SEGURIDAD)
#########################################################

print_info "Paso 3/6: Backup de seguridad de BD Cloud"
echo ""

# Verificar si cloud tiene datos
export PGPASSWORD="$CLOUD_PASS"
CLOUD_TABLES=$(psql "$CLOUD_CONN" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';")
CLOUD_TABLES=$(echo $CLOUD_TABLES | xargs) # trim

if [ "$CLOUD_TABLES" -gt 0 ]; then
    print_warning "La BD Cloud tiene $CLOUD_TABLES tablas existentes"
    
    if confirm "¿Deseas crear un backup de seguridad antes de continuar?"; then
        print_info "Creando backup de BD Cloud..."
        pg_dump "$CLOUD_CONN" -Fc -f "$CLOUD_BACKUP" 2>&1 | tee -a "$LOG_FILE"
        
        if [ ${PIPESTATUS[0]} -eq 0 ]; then
            print_success "Backup cloud creado: $CLOUD_BACKUP"
            
            # Comprimir backup
            print_info "Comprimiendo backup..."
            gzip "$CLOUD_BACKUP"
            print_success "Backup comprimido: ${CLOUD_BACKUP}.gz"
        else
            print_error "Error al crear backup cloud"
            exit 1
        fi
    else
        print_warning "Continuando sin backup (no recomendado)"
    fi
else
    print_info "BD Cloud está vacía, no se necesita backup"
fi

echo ""

#########################################################
# PASO 4: EXPORTAR DUMP DE BD LOCAL
#########################################################

print_info "Paso 4/6: Exportando BD Local"
echo ""

export PGPASSWORD="$LOCAL_PASS"

# Contar registros en local
print_info "Contando registros en BD Local..."
FAMILIES=$(psql -h $LOCAL_HOST -p $LOCAL_PORT -U $LOCAL_USER -d $LOCAL_DB -t -c "SELECT COUNT(*) FROM family_heads WHERE \"isDeleted\" = false;")
GUESTS=$(psql -h $LOCAL_HOST -p $LOCAL_PORT -U $LOCAL_USER -d $LOCAL_DB -t -c "SELECT COUNT(*) FROM guests WHERE \"isDeleted\" = false;")
FAMILIES=$(echo $FAMILIES | xargs)
GUESTS=$(echo $GUESTS | xargs)

echo "  Familias: $FAMILIES"
echo "  Invitados: $GUESTS"
echo ""

if ! confirm "¿Deseas exportar estos datos a Cloud?"; then
    print_warning "Migración cancelada por el usuario"
    exit 0
fi

print_info "Creando dump de BD Local..."
pg_dump -h $LOCAL_HOST -p $LOCAL_PORT -U $LOCAL_USER -Fc -f "$LOCAL_DUMP" $LOCAL_DB 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    DUMP_SIZE=$(du -h "$LOCAL_DUMP" | cut -f1)
    print_success "Dump local creado: $LOCAL_DUMP ($DUMP_SIZE)"
else
    print_error "Error al crear dump local"
    exit 1
fi

echo ""

#########################################################
# PASO 5: RESTAURAR EN BD CLOUD
#########################################################

print_info "Paso 5/6: Restaurando en BD Cloud"
echo ""

print_warning "IMPORTANTE: Esta operación reemplazará los datos existentes en Cloud"
if ! confirm "¿Estás seguro de continuar?"; then
    print_warning "Restauración cancelada"
    exit 0
fi

export PGPASSWORD="$CLOUD_PASS"

print_info "Restaurando dump en BD Cloud..."
echo "  Opciones: --clean (eliminar objetos existentes), --no-owner, --no-acl"
echo ""

pg_restore --verbose --clean --no-owner --no-acl \
  --dbname="$CLOUD_CONN" \
  "$LOCAL_DUMP" 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -eq 0 ] || [ ${PIPESTATUS[0]} -eq 1 ]; then
    # pg_restore retorna 1 si hay warnings pero la restauración fue exitosa
    print_success "Restauración completada (revisa warnings en $LOG_FILE)"
else
    print_error "Error en restauración"
    print_warning "Puedes restaurar el backup con: pg_restore --clean --no-owner --no-acl --dbname='$CLOUD_CONN' ${CLOUD_BACKUP}.gz"
    exit 1
fi

echo ""

#########################################################
# PASO 6: VERIFICACIÓN
#########################################################

print_info "Paso 6/6: Verificando integridad de datos"
echo ""

export PGPASSWORD="$CLOUD_PASS"

# Contar registros en cloud
print_info "Contando registros en BD Cloud..."
CLOUD_FAMILIES=$(psql "$CLOUD_CONN" -t -c "SELECT COUNT(*) FROM family_heads WHERE \"isDeleted\" = false;" 2>/dev/null)
CLOUD_GUESTS=$(psql "$CLOUD_CONN" -t -c "SELECT COUNT(*) FROM guests WHERE \"isDeleted\" = false;" 2>/dev/null)
CLOUD_FAMILIES=$(echo $CLOUD_FAMILIES | xargs)
CLOUD_GUESTS=$(echo $CLOUD_GUESTS | xargs)

echo "  Familias en Cloud: $CLOUD_FAMILIES (Local: $FAMILIES)"
echo "  Invitados en Cloud: $CLOUD_GUESTS (Local: $GUESTS)"
echo ""

if [ "$CLOUD_FAMILIES" = "$FAMILIES" ] && [ "$CLOUD_GUESTS" = "$GUESTS" ]; then
    print_success "✓ Conteos coinciden - Migración exitosa"
else
    print_warning "⚠ Los conteos difieren - Revisa el log: $LOG_FILE"
fi

echo ""
print_info "Verificando tablas críticas..."
psql "$CLOUD_CONN" -c "SELECT 
    'family_heads' as tabla, COUNT(*) as total 
    FROM family_heads
UNION ALL SELECT 
    'guests' as tabla, COUNT(*) 
    FROM guests
UNION ALL SELECT 
    'tables' as tabla, COUNT(*) 
    FROM tables
UNION ALL SELECT 
    'seats' as tabla, COUNT(*) 
    FROM seats
UNION ALL SELECT 
    'notifications' as tabla, COUNT(*) 
    FROM notifications;" 2>&1 | tee -a "$LOG_FILE"

echo ""

#########################################################
# PASO 7: ACTUALIZAR .ENV
#########################################################

print_info "Actualización del archivo .env"
echo ""
print_warning "IMPORTANTE: Debes actualizar manualmente el archivo .env"
echo ""
echo "1. Abre el archivo .env en tu editor"
echo "2. Comenta la línea de DATABASE_URL local:"
echo "   # DATABASE_URL=\"postgresql://postgres:password@localhost:5432/wedding_db?schema=public\""
echo ""
echo "3. Descomenta y actualiza la línea de DATABASE_URL cloud:"
echo "   DATABASE_URL=\"$CLOUD_CONN\""
echo ""
echo "4. Guarda el archivo y ejecuta:"
echo "   npx prisma generate"
echo "   npm run db:push"
echo ""

if confirm "¿Deseas que se cree un archivo .env.cloud de respaldo con la configuración?"; then
    cat > .env.cloud << EOF
# ===================================
# DATABASE CONFIGURATION - CLOUD
# ===================================

# 🌐 NEON.TECH (Cloud) - ACTIVO
DATABASE_URL="$CLOUD_CONN"

# 💻 POSTGRESQL LOCAL - DESHABILITADO
# DATABASE_URL="postgresql://postgres:password@localhost:5432/wedding_db?schema=public"

# ===================================
# TWILIO WHATSAPP API
# ===================================
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
    print_success "Archivo .env.cloud creado como referencia"
fi

echo ""

#########################################################
# RESUMEN FINAL
#########################################################

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  ✓ MIGRACIÓN COMPLETADA${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📊 Resumen:"
echo "  • Familias migradas: $FAMILIES"
echo "  • Invitados migrados: $GUESTS"
echo "  • Dump local: $LOCAL_DUMP"
if [ -f "${CLOUD_BACKUP}.gz" ]; then
    echo "  • Backup cloud: ${CLOUD_BACKUP}.gz"
fi
echo "  • Log completo: $LOG_FILE"
echo ""
echo "📝 Próximos pasos:"
echo "  1. Actualizar DATABASE_URL en .env (apuntar a cloud)"
echo "  2. Ejecutar: npx prisma generate"
echo "  3. Ejecutar: npm run db:push"
echo "  4. Probar la app: npm run dev"
echo "  5. Verificar endpoints: /api/stats, /api/families"
echo ""
echo "🔄 Rollback (si es necesario):"
if [ -f "${CLOUD_BACKUP}.gz" ]; then
    echo "  pg_restore --clean --no-owner --no-acl --dbname='$CLOUD_CONN' ${CLOUD_BACKUP}.gz"
else
    echo "  No se creó backup, restaurar desde dump local si es necesario"
fi
echo ""
print_success "¡Migración exitosa! 🎉"
echo ""

# Limpiar variable de contraseña
unset PGPASSWORD
