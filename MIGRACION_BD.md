# 📘 Manual de Migración: Base de Datos Local → Cloud (Neon)

**Wedding Guest Management App**  
**Fecha:** 23 de octubre de 2025  
**Versión:** 1.0

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#-resumen-ejecutivo)
2. [Requisitos Previos](#-requisitos-previos)
3. [Método Automático (Recomendado)](#-método-automático-recomendado)
4. [Método Manual (Paso a Paso)](#-método-manual-paso-a-paso)
5. [Verificación Post-Migración](#-verificación-post-migración)
6. [Rollback y Recuperación](#-rollback-y-recuperación)
7. [Solución de Problemas](#-solución-de-problemas)
8. [Mejores Prácticas](#-mejores-prácticas)

---

## 🎯 Resumen Ejecutivo

Este manual documenta el proceso completo para migrar los datos de invitados de boda desde una base de datos **PostgreSQL local** hacia una base de datos **PostgreSQL en la nube (Neon)**.

### ¿Qué hace este proceso?

1. **Exporta** todos los registros de tu base de datos local (familias, invitados, mesas, etc.)
2. **Crea un backup** de seguridad de la base de datos cloud (si tiene datos)
3. **Restaura** los datos locales en la base de datos cloud
4. **Verifica** la integridad de los datos migrados
5. **Actualiza** la configuración de la aplicación para usar la cloud

### Tiempo estimado
- **Método automático:** 5-10 minutos
- **Método manual:** 15-30 minutos

### Datos que se migran
✅ Familias (FamilyHead)  
✅ Invitados (Guest)  
✅ Mesas (Table)  
✅ Asientos (Seat)  
✅ Notificaciones (Notification)  
✅ Relaciones entre tablas  
✅ Índices y constraints

---

## 🔧 Requisitos Previos

### Software necesario

1. **PostgreSQL Client Tools** (pg_dump, pg_restore, psql)
   ```bash
   # Verificar instalación
   pg_dump --version
   psql --version
   ```
   
   **Si no están instalados:**
   - Windows: [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - Con Git Bash: Asegúrate de que `pg_dump` esté en el PATH

2. **Bash Shell**
   - Git Bash (Windows)
   - WSL (Windows Subsystem for Linux)
   - Terminal nativa (Linux/Mac)

3. **Node.js y npm** (ya instalado en tu proyecto)
   ```bash
   node --version  # 22.21.0 o superior
   npm --version
   ```

### Información necesaria

#### Base de Datos Local
- ✅ Host: `localhost`
- ✅ Puerto: `5432`
- ✅ Usuario: `postgres`
- ✅ Contraseña: (la que configuraste)
- ✅ Base de datos: `wedding_db`

#### Base de Datos Cloud (Neon)
Necesitas tu **connection string** de Neon:
```
postgresql://neondb_owner:PASSWORD@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

**¿Dónde obtenerla?**
1. Ve a [Neon Console](https://console.neon.tech)
2. Selecciona tu proyecto
3. Ve a "Connection Details"
4. Copia la connection string (formato: `postgresql://...`)

---

## 🚀 Método Automático (Recomendado)

### Ventajas
✅ Proceso guiado paso a paso  
✅ Validaciones automáticas  
✅ Backup de seguridad automático  
✅ Verificación de integridad  
✅ Log detallado de la operación  
✅ Colores y mensajes claros

### Pasos

#### 1. Preparar el script

El script `migrate-to-cloud.sh` ya está creado en la raíz del proyecto.

**Darle permisos de ejecución:**
```bash
chmod +x migrate-to-cloud.sh
```

#### 2. Ejecutar el script

```bash
./migrate-to-cloud.sh
```

#### 3. Seguir las instrucciones interactivas

El script te pedirá:

**a) Contraseña de BD Local:**
```
Contraseña BD Local [postgres]: ********
```
*Escribe la contraseña de tu PostgreSQL local*

**b) Credenciales de BD Cloud (Neon):**
```
Host Cloud (ej: ep-young-thunder-xxxxx.us-east-2.aws.neon.tech): 
```
*Ejemplo: `ep-young-thunder-ae9n4d9p-pooler.c-2.us-east-2.aws.neon.tech`*

```
Puerto Cloud [5432]: 
```
*Presiona Enter para usar 5432*

```
Usuario Cloud (ej: neondb_owner): 
```
*Ejemplo: `neondb_owner`*

```
Base de datos Cloud (ej: neondb): 
```
*Ejemplo: `neondb`*

```
Contraseña Cloud: ********
```
*Tu contraseña de Neon*

**c) Confirmaciones de seguridad:**

El script te mostrará cuántos registros tiene tu BD local:
```
Familias: 15
Invitados: 45

¿Deseas exportar estos datos a Cloud? (y/n):
```
*Escribe `y` y presiona Enter*

Si la BD cloud tiene datos existentes:
```
⚠ La BD Cloud tiene 5 tablas existentes
¿Deseas crear un backup de seguridad antes de continuar? (y/n):
```
*Recomendado: escribe `y`*

Antes de restaurar:
```
⚠ IMPORTANTE: Esta operación reemplazará los datos existentes en Cloud
¿Estás seguro de continuar? (y/n):
```
*Escribe `y` para proceder*

#### 4. El script ejecutará automáticamente

1. ✅ Verificación de conexiones (local y cloud)
2. ✅ Backup de BD cloud (si tiene datos)
3. ✅ Export de BD local (`wedding_local_TIMESTAMP.dump`)
4. ✅ Restauración en BD cloud
5. ✅ Verificación de conteos (familias, invitados)
6. ✅ Reporte de tablas migradas
7. ✅ Creación de `.env.cloud` (referencia)

#### 5. Resultado esperado

```
========================================
  ✓ MIGRACIÓN COMPLETADA
========================================

📊 Resumen:
  • Familias migradas: 15
  • Invitados migrados: 45
  • Dump local: wedding_local_20251023_143022.dump
  • Backup cloud: wedding_cloud_backup_20251023_143022.dump.gz
  • Log completo: migration_20251023_143022.log

📝 Próximos pasos:
  1. Actualizar DATABASE_URL en .env (apuntar a cloud)
  2. Ejecutar: npx prisma generate
  3. Ejecutar: npm run db:push
  4. Probar la app: npm run dev
  5. Verificar endpoints: /api/stats, /api/families

¡Migración exitosa! 🎉
```

---

## 🛠️ Método Manual (Paso a Paso)

Si prefieres control total o el script automático falla, usa este método.

### Paso 1: Verificar conexiones

#### Verificar BD Local
```bash
export PGPASSWORD='tu_password_local'
psql -h localhost -p 5432 -U postgres -d wedding_db -c "SELECT 1;"
```
**Resultado esperado:** `?column? 1` (conexión exitosa)

#### Verificar BD Cloud
```bash
export PGPASSWORD='tu_password_cloud'
psql "postgresql://usuario@host:puerto/db?sslmode=require" -c "SELECT 1;"
```
**Resultado esperado:** `?column? 1` (conexión exitosa)

### Paso 2: Contar registros en BD Local

```bash
export PGPASSWORD='tu_password_local'

# Contar familias
psql -h localhost -p 5432 -U postgres -d wedding_db -t -c \
  "SELECT COUNT(*) FROM family_heads WHERE \"isDeleted\" = false;"

# Contar invitados
psql -h localhost -p 5432 -U postgres -d wedding_db -t -c \
  "SELECT COUNT(*) FROM guests WHERE \"isDeleted\" = false;"
```

**Anota estos números** para verificar después.

### Paso 3: Backup de BD Cloud (MUY RECOMENDADO)

```bash
export PGPASSWORD='tu_password_cloud'

# Crear backup con timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cloud_backup_${TIMESTAMP}.dump"

pg_dump "postgresql://usuario:password@host:puerto/db?sslmode=require" \
  -Fc -f "$BACKUP_FILE"

# Comprimir backup
gzip "$BACKUP_FILE"

echo "Backup creado: ${BACKUP_FILE}.gz"
```

**Guardar este archivo** en un lugar seguro. Lo necesitarás si algo sale mal.

### Paso 4: Exportar BD Local

```bash
export PGPASSWORD='tu_password_local'
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DUMP_FILE="wedding_local_${TIMESTAMP}.dump"

pg_dump -h localhost -p 5432 -U postgres \
  -Fc -f "$DUMP_FILE" wedding_db

echo "Dump creado: $DUMP_FILE"
ls -lh "$DUMP_FILE"
```

**Verificar el tamaño del archivo.** Debe ser > 0 bytes.

### Paso 5: Restaurar en BD Cloud

```bash
export PGPASSWORD='tu_password_cloud'

pg_restore --verbose --clean --no-owner --no-acl \
  --dbname="postgresql://usuario:password@host:puerto/db?sslmode=require" \
  "$DUMP_FILE"
```

**Opciones explicadas:**
- `--verbose`: Muestra progreso detallado
- `--clean`: Elimina objetos existentes antes de crear
- `--no-owner`: No intenta restaurar ownership (evita errores de roles)
- `--no-acl`: No restaura permisos (evita conflictos)

**Nota:** Verás algunos warnings como `role "xxx" does not exist` - esto es normal y se puede ignorar.

### Paso 6: Verificar conteos en BD Cloud

```bash
export PGPASSWORD='tu_password_cloud'

# Contar familias en cloud
psql "postgresql://usuario:password@host:puerto/db?sslmode=require" -t -c \
  "SELECT COUNT(*) FROM family_heads WHERE \"isDeleted\" = false;"

# Contar invitados en cloud
psql "postgresql://usuario:password@host:puerto/db?sslmode=require" -t -c \
  "SELECT COUNT(*) FROM guests WHERE \"isDeleted\" = false;"
```

**Comparar con los números del Paso 2.** Deben coincidir exactamente.

### Paso 7: Verificar todas las tablas

```bash
export PGPASSWORD='tu_password_cloud'

psql "postgresql://usuario:password@host:puerto/db?sslmode=require" -c "
SELECT 
    'family_heads' as tabla, COUNT(*) as total 
FROM family_heads
UNION ALL SELECT 
    'guests', COUNT(*) 
FROM guests
UNION ALL SELECT 
    'tables', COUNT(*) 
FROM tables
UNION ALL SELECT 
    'seats', COUNT(*) 
FROM seats
UNION ALL SELECT 
    'notifications', COUNT(*) 
FROM notifications;
"
```

**Resultado esperado:**
```
     tabla      | total 
----------------+-------
 family_heads   |    15
 guests         |    45
 tables         |     8
 seats          |    64
 notifications  |     3
```

### Paso 8: Actualizar `.env`

**Editar el archivo `.env` en la raíz del proyecto:**

```bash
# Abrir con tu editor preferido
code .env
# o
nano .env
# o
vim .env
```

**Cambiar:**
```env
# Comentar la línea local:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/wedding_db?schema=public"

# Descomentar y actualizar la línea cloud:
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"
```

**Guardar el archivo.**

### Paso 9: Regenerar Prisma Client

```bash
# En el directorio del proyecto
npx prisma generate
```

**Resultado esperado:**
```
✔ Generated Prisma Client (v6.18.0) to ./node_modules/@prisma/client
```

### Paso 10: Sincronizar schema (si es necesario)

```bash
npm run db:push
# o directamente:
npx prisma db push
```

**Resultado esperado:**
```
The database is already in sync with the Prisma schema.
```

---

## ✅ Verificación Post-Migración

### 1. Abrir Prisma Studio

```bash
npx prisma studio
```

Abre el navegador en `http://localhost:5555` y verifica:
- ✅ Familias se muestran correctamente
- ✅ Invitados se muestran con sus relaciones
- ✅ Mesas y asientos están presentes

### 2. Iniciar la aplicación

```bash
npm run dev
```

### 3. Probar endpoints

**a) Estadísticas del dashboard:**
```bash
curl http://localhost:3000/api/stats
```

**Resultado esperado:** JSON con conteos de familias, invitados, mesas, etc.

**b) Lista de familias:**
```bash
curl http://localhost:3000/api/families
```

**Resultado esperado:** Array JSON con familias y sus invitados.

### 4. Probar UI

Abre el navegador en `http://localhost:3000` y verifica:

1. **Dashboard** (`/dashboard`):
   - ✅ Estadísticas muestran números correctos
   - ✅ Cards de familias/invitados son correctas

2. **Familias** (`/families`):
   - ✅ Lista de familias se muestra
   - ✅ Contadores (`X/Y invitados`) son correctos
   - ✅ Puedes editar una familia sin errores

3. **Invitados** (`/guests`):
   - ✅ Lista de invitados se muestra
   - ✅ Filtros funcionan (Todos, Adultos, Niños)
   - ✅ Búsqueda funciona

### 5. Verificar logs

Revisa el archivo `migration_TIMESTAMP.log` generado por el script para ver si hubo warnings o errores.

```bash
# Ver últimas 50 líneas del log
tail -n 50 migration_*.log
```

---

## 🔄 Rollback y Recuperación

### Escenario 1: Algo salió mal, quiero volver a local

**Paso 1:** Editar `.env` y cambiar `DATABASE_URL` de vuelta a local:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/wedding_db?schema=public"
```

**Paso 2:** Regenerar Prisma:
```bash
npx prisma generate
npm run db:push
```

**Paso 3:** Reiniciar la app:
```bash
npm run dev
```

**Tu BD local sigue intacta.** No se eliminó nada.

### Escenario 2: Necesito restaurar el backup de cloud

Si creaste un backup de la BD cloud antes de migrar:

```bash
export PGPASSWORD='tu_password_cloud'

pg_restore --verbose --clean --no-owner --no-acl \
  --dbname="postgresql://usuario:password@host:puerto/db?sslmode=require" \
  cloud_backup_TIMESTAMP.dump.gz
```

Esto restaurará la BD cloud al estado previo a la migración.

### Escenario 3: Quiero migrar de nuevo desde cero

1. **Restaurar backup cloud** (o limpiar tablas manualmente)
2. **Ejecutar el script de nuevo:**
   ```bash
   ./migrate-to-cloud.sh
   ```

---

## 🔍 Solución de Problemas

### Error: "role does not exist"

**Síntoma:**
```
ERROR: role "postgres" does not exist
```

**Solución:**
Esto es normal. El flag `--no-owner` evita que afecte la restauración. Puedes ignorar este warning.

---

### Error: "connection refused"

**Síntoma:**
```
psql: error: could not connect to server: Connection refused
```

**Causa:** PostgreSQL no está corriendo o las credenciales son incorrectas.

**Solución:**

**Para BD Local:**
```bash
# Windows (verificar servicio)
net start postgresql-x64-14

# Linux/Mac
sudo systemctl start postgresql
# o
pg_ctl start
```

**Para BD Cloud:**
- Verifica que la connection string sea correcta
- Verifica que incluya `?sslmode=require`
- Comprueba que tu IP esté permitida en Neon Console

---

### Error: "pg_dump: command not found"

**Síntoma:**
```
bash: pg_dump: command not found
```

**Causa:** PostgreSQL client tools no están instalados o no están en el PATH.

**Solución:**

**Windows:**
1. Descarga PostgreSQL desde [postgresql.org](https://www.postgresql.org/download/windows/)
2. Instala solo "Command Line Tools"
3. Agrega al PATH: `C:\Program Files\PostgreSQL\15\bin`

**Git Bash (Windows):**
Añade al PATH de forma temporal:
```bash
export PATH="/c/Program Files/PostgreSQL/15/bin:$PATH"
```

O permanente, añade a `~/.bashrc`:
```bash
echo 'export PATH="/c/Program Files/PostgreSQL/15/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

---

### Error: "too many clients"

**Síntoma:**
```
FATAL: sorry, too many clients already
```

**Causa:** Neon tiene un límite de conexiones concurrentes (free tier: ~100).

**Solución:**
1. Cierra conexiones abiertas (Prisma Studio, pgAdmin, etc.)
2. Espera unos minutos y reintenta
3. Usa connection pooling (Neon Pooler): cambia el host a `xxxxx-pooler.neon.tech`

---

### Los conteos no coinciden

**Síntoma:**
```
Familias en Cloud: 12 (Local: 15)
Invitados en Cloud: 40 (Local: 45)
```

**Posibles causas:**
1. La restauración no completó correctamente
2. Hay registros con `isDeleted = true` (borrado lógico)
3. Constraints fallaron (claves foráneas)

**Solución:**

**Verificar conteos totales (incluye eliminados):**
```bash
psql "CONNECTION_STRING" -c "SELECT COUNT(*) FROM family_heads;"
```

**Verificar solo no eliminados:**
```bash
psql "CONNECTION_STRING" -c "SELECT COUNT(*) FROM family_heads WHERE \"isDeleted\" = false;"
```

**Revisar el log:**
```bash
grep -i error migration_*.log
```

Si hay errores de constraint, puede que necesites restaurar en orden específico o desactivar temporalmente constraints.

---

### Error: "SSL connection required"

**Síntoma:**
```
FATAL: SSL connection required
```

**Causa:** Neon requiere SSL pero la connection string no lo especifica.

**Solución:**
Agregar `?sslmode=require` al final de la connection string:
```
postgresql://user:pass@host:port/db?sslmode=require
```

O exportar variable de entorno:
```bash
export PGSSLMODE=require
```

---

## 💡 Mejores Prácticas

### 1. Seguridad

✅ **NUNCA** subas credenciales a Git  
✅ Usa variables de entorno para passwords  
✅ Limpia el historial de comandos después de usarlos:
```bash
history -c
unset PGPASSWORD
```

✅ Elimina dumps después de migrar:
```bash
rm wedding_local_*.dump
rm cloud_backup_*.dump.gz
```

✅ Encripta backups si los guardas:
```bash
gpg -c cloud_backup.dump.gz  # pide contraseña
```

### 2. Planificación

✅ **Haz la migración en horario de bajo tráfico**  
✅ Avisa a los usuarios que habrá mantenimiento  
✅ Detén la aplicación durante la migración para evitar escrituras concurrentes  
✅ Prueba primero en una BD de staging/pruebas  

### 3. Backups

✅ **Siempre** crea un backup antes de restaurar  
✅ Guarda backups en múltiples ubicaciones (local + cloud storage)  
✅ Verifica que los backups se puedan restaurar (prueba de fuego)  
✅ Automatiza backups diarios:
```bash
# Cron job ejemplo (Linux)
0 3 * * * pg_dump "CONNECTION_STRING" -Fc > /backups/wedding_$(date +\%Y\%m\%d).dump
```

### 4. Verificación

✅ No confíes solo en los conteos - verifica datos reales  
✅ Prueba todas las funcionalidades críticas después de migrar  
✅ Compara checksums de dumps (si es posible)  
✅ Verifica relaciones entre tablas (foreign keys)

### 5. Monitoreo

✅ Revisa logs de errores después de migrar  
✅ Monitorea uso de CPU/RAM en Neon después de migrar  
✅ Configura alertas si los queries son más lentos  
✅ Usa herramientas como Neon Console para ver métricas

### 6. Documentación

✅ Documenta la fecha/hora de migración  
✅ Guarda los logs de migración  
✅ Anota cualquier problema encontrado y su solución  
✅ Actualiza este manual con lecciones aprendidas

---

## 📊 Checklist de Migración

Usa esta lista para asegurar que no olvidas ningún paso:

### Pre-Migración
- [ ] Verificar que PostgreSQL client tools están instalados
- [ ] Obtener credenciales de BD cloud (Neon)
- [ ] Probar conexión a BD local
- [ ] Probar conexión a BD cloud
- [ ] Contar registros en BD local (anotar números)
- [ ] Avisar a usuarios sobre mantenimiento (si aplica)
- [ ] Detener aplicación para evitar escrituras

### Durante Migración
- [ ] Crear backup de BD cloud (si tiene datos)
- [ ] Exportar dump de BD local
- [ ] Verificar que el dump se creó correctamente (tamaño > 0)
- [ ] Restaurar dump en BD cloud
- [ ] Revisar warnings/errors del log

### Post-Migración
- [ ] Contar registros en BD cloud (comparar con local)
- [ ] Verificar todas las tablas (family_heads, guests, tables, seats, notifications)
- [ ] Actualizar `.env` con connection string de cloud
- [ ] Ejecutar `npx prisma generate`
- [ ] Ejecutar `npm run db:push` (si es necesario)
- [ ] Iniciar aplicación
- [ ] Probar endpoint `/api/stats`
- [ ] Probar endpoint `/api/families`
- [ ] Abrir Prisma Studio y verificar datos
- [ ] Probar UI (dashboard, familias, invitados)
- [ ] Verificar que se pueden crear/editar/eliminar registros
- [ ] Revisar logs de aplicación por errores
- [ ] Eliminar dumps locales (si todo funciona)
- [ ] Guardar backup de cloud en lugar seguro
- [ ] Documentar lecciones aprendidas

### Rollback (si es necesario)
- [ ] Cambiar `.env` de vuelta a local
- [ ] Regenerar Prisma Client
- [ ] Reiniciar aplicación
- [ ] O restaurar backup de cloud si se necesita revertir cambios

---

## 📞 Soporte y Recursos

### Documentación Oficial
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pg_dump Documentation](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore Documentation](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [Neon Documentation](https://neon.tech/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Comandos de Ayuda
```bash
# Ver ayuda de pg_dump
pg_dump --help

# Ver ayuda de pg_restore
pg_restore --help

# Ver ayuda de psql
psql --help
```

### Logs y Debugging
```bash
# Ver log completo de migración
cat migration_*.log

# Buscar errores en el log
grep -i error migration_*.log

# Ver warnings
grep -i warning migration_*.log

# Ver solo líneas importantes
grep -E "(ERROR|WARNING|FATAL)" migration_*.log
```

---

## 📝 Notas Adicionales

### Diferencias entre Local y Cloud

| Característica | Local | Cloud (Neon) |
|----------------|-------|--------------|
| **Conexión** | Sin SSL | Requiere SSL (`?sslmode=require`) |
| **Host** | `localhost` | `ep-xxxxx.region.aws.neon.tech` |
| **Roles/Usuarios** | Puedes crear roles | Roles pre-configurados |
| **Extensions** | Puedes instalar cualquiera | Solo algunas disponibles |
| **Backups** | Manual | Automático (Neon) + Manual |
| **Escalabilidad** | Limitada por hardware | Auto-scaling |
| **Latencia** | ~1-5ms | ~20-100ms (depende región) |

### Consideraciones de Performance

Después de migrar a cloud, puedes notar:
- **Queries ligeramente más lentos** (latencia de red)
- **Connection pooling** es crítico (usa Neon Pooler)
- **Índices** son aún más importantes
- **N+1 queries** afectan más (usa `include` de Prisma)

**Optimizaciones recomendadas:**
```typescript
// Malo: N+1 queries
const families = await prisma.familyHead.findMany();
for (const family of families) {
  const guests = await prisma.guest.findMany({ 
    where: { familyHeadId: family.id } 
  });
}

// Bueno: 1 query con include
const families = await prisma.familyHead.findMany({
  include: { guests: true }
});
```

### Costos

**Neon Free Tier:**
- 0.5 GB storage (suficiente para ~10,000 invitados)
- 100 horas compute/mes
- ~100 conexiones concurrentes

**Si superas el free tier:**
- Plan Pro: $19/mes
- Plan Scale: Custom pricing

**Monitorea tu uso en:** [Neon Console → Usage](https://console.neon.tech)

---

## ✅ Conclusión

Este manual te ha guiado a través de:
1. ✅ Migración automática con script
2. ✅ Migración manual paso a paso
3. ✅ Verificación exhaustiva
4. ✅ Rollback y recuperación
5. ✅ Solución de problemas comunes
6. ✅ Mejores prácticas de seguridad

**¿Siguiente paso?**  
Ejecuta el script automático y sigue las instrucciones en pantalla:
```bash
chmod +x migrate-to-cloud.sh
./migrate-to-cloud.sh
```

**¿Problemas?**  
Consulta la sección [Solución de Problemas](#-solución-de-problemas) o revisa el log de migración.

---

**¡Buena suerte con tu migración! 🚀**

---

*Última actualización: 23 de octubre de 2025*  
*Versión del manual: 1.0*  
*Proyecto: Wedding Guest Management App*
