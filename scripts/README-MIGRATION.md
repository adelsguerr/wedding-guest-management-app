# 🔄 Scripts de Migración de Base de Datos

Esta carpeta contiene herramientas para migrar datos de tu base de datos PostgreSQL local a la nube (Neon).

## 📁 Archivos Disponibles

| Archivo | Descripción | Plataforma |
|---------|-------------|------------|
| `MIGRACION_BD.md` | 📘 **Manual completo** (50+ páginas) con guía paso a paso | Todas |
| `migrate-to-cloud.sh` | 🚀 **Script automático** interactivo de migración | Linux/Mac/Git Bash |
| `migrate-to-cloud.bat` | 🚀 **Script automático** para Windows | Windows CMD/PowerShell |
| `verify-migration.sh` | ✅ Script de verificación post-migración | Linux/Mac/Git Bash |

---

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

#### En Linux/Mac/Git Bash:
```bash
# Dar permisos de ejecución
chmod +x migrate-to-cloud.sh

# Ejecutar
./migrate-to-cloud.sh
```

#### En Windows CMD/PowerShell:
```cmd
migrate-to-cloud.bat
```

**El script te guiará paso a paso:**
1. ✅ Solicita credenciales (local y cloud)
2. ✅ Verifica conexiones
3. ✅ Crea backup de seguridad de cloud
4. ✅ Exporta datos de BD local
5. ✅ Restaura en BD cloud
6. ✅ Verifica integridad de datos
7. ✅ Genera logs detallados

**Tiempo estimado:** 5-10 minutos

---

### Opción 2: Migración Manual

Si prefieres control total o el script falla, sigue el manual completo:

📖 **Lee:** [`MIGRACION_BD.md`](./MIGRACION_BD.md)

El manual incluye:
- Requisitos previos
- Comandos paso a paso
- Explicaciones detalladas
- Solución de problemas
- Procedimientos de rollback
- Mejores prácticas

---

## ✅ Verificación Post-Migración

Después de ejecutar la migración, verifica que todo funcionó correctamente:

```bash
# Dar permisos
chmod +x verify-migration.sh

# Ejecutar verificación
./verify-migration.sh
```

**Este script verifica:**
- ✅ Configuración de `.env`
- ✅ Conexión a la base de datos
- ✅ Conteos de registros (familias, invitados, mesas)
- ✅ Prisma Client generado
- ✅ Build de Next.js
- ✅ Endpoints API funcionando

---

## 📋 Requisitos Previos

### Software Necesario

1. **PostgreSQL Client Tools**
   ```bash
   # Verificar instalación
   pg_dump --version
   psql --version
   ```
   
   Si no están instalados:
   - Windows: [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)
   - Linux: `sudo apt-get install postgresql-client`
   - Mac: `brew install postgresql`

2. **Node.js y npm** (ya instalado en tu proyecto)
   ```bash
   node --version  # 22.21.0 o superior
   ```

3. **Bash Shell** (para scripts .sh)
   - Linux/Mac: Terminal nativa
   - Windows: Git Bash o WSL

### Información Necesaria

#### Base de Datos Local
- Host: `localhost`
- Puerto: `5432`
- Usuario: `postgres`
- Contraseña: (tu contraseña)
- Base de datos: `wedding_db`

#### Base de Datos Cloud (Neon)
Obtén tu **connection string** de [Neon Console](https://console.neon.tech):
```
postgresql://neondb_owner:PASSWORD@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
```

---

## 🎯 Flujo de Migración

```
┌─────────────────┐
│  BD Local       │
│  (localhost)    │
│  15 familias    │
│  45 invitados   │
└────────┬────────┘
         │
         │ 1. pg_dump (export)
         ▼
┌─────────────────┐
│  Dump File      │
│  .dump / .sql   │
└────────┬────────┘
         │
         │ 2. pg_restore (import)
         ▼
┌─────────────────┐
│  BD Cloud       │
│  (Neon)         │
│  ✓ 15 familias  │
│  ✓ 45 invitados │
└─────────────────┘
         │
         │ 3. Actualizar .env
         ▼
┌─────────────────┐
│  Next.js App    │
│  DATABASE_URL → │
│  Cloud          │
└─────────────────┘
```

---

## 🛡️ Seguridad y Backups

### Antes de Migrar

✅ **El script SIEMPRE crea un backup de la BD cloud** antes de restaurar  
✅ **Tu BD local NO se modifica** durante el proceso  
✅ **Puedes revertir** usando el backup si algo sale mal

### Archivos Generados

Después de ejecutar el script, tendrás:

```
wedding_local_20251023_143022.dump       # Export de BD local
cloud_backup_20251023_143022.dump.gz     # Backup de BD cloud (si tenía datos)
migration_20251023_143022.log            # Log detallado de la operación
.env.cloud                               # Configuración de referencia
```

### Rollback (Revertir Cambios)

Si necesitas volver atrás:

**Opción 1 - Volver a usar BD local:**
```bash
# Editar .env y cambiar DATABASE_URL a local
# DATABASE_URL="postgresql://postgres:password@localhost:5432/wedding_db?schema=public"

npx prisma generate
npm run dev
```

**Opción 2 - Restaurar backup de cloud:**
```bash
export PGPASSWORD='tu_password_cloud'
pg_restore --clean --no-owner --no-acl \
  --dbname="postgresql://user:pass@host/db?sslmode=require" \
  cloud_backup_20251023_143022.dump.gz
```

---

## 📝 Pasos Post-Migración

Después de una migración exitosa:

### 1. Actualizar `.env`
```env
# Comentar BD local
# DATABASE_URL="postgresql://postgres:password@localhost:5432/wedding_db?schema=public"

# Activar BD cloud
DATABASE_URL="postgresql://neondb_owner:PASSWORD@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require"
```

### 2. Regenerar Prisma Client
```bash
npx prisma generate
npm run db:push
```

### 3. Verificar con Prisma Studio
```bash
npx prisma studio
```
Abre `http://localhost:5555` y verifica que los datos estén allí.

### 4. Iniciar la Aplicación
```bash
npm run dev
```

### 5. Probar Endpoints
```bash
# Estadísticas
curl http://localhost:3000/api/stats

# Familias
curl http://localhost:3000/api/families

# Dashboard en navegador
open http://localhost:3000/dashboard
```

---

## 🔍 Solución de Problemas

### Error: "pg_dump: command not found"

**Solución:**
Instala PostgreSQL Client Tools y agrégalo al PATH.

Windows (Git Bash):
```bash
export PATH="/c/Program Files/PostgreSQL/15/bin:$PATH"
```

---

### Error: "connection refused"

**Causa:** PostgreSQL no está corriendo.

**Solución:**
```bash
# Windows
net start postgresql-x64-14

# Linux/Mac
sudo systemctl start postgresql
```

---

### Error: "SSL connection required"

**Causa:** Neon requiere SSL pero tu connection string no lo especifica.

**Solución:**
Agrega `?sslmode=require` al final de la connection string:
```
postgresql://user:pass@host:port/db?sslmode=require
```

---

### Los conteos no coinciden

**Causa:** Puede haber registros con `isDeleted = true` (borrado lógico).

**Solución:**
Verifica conteos totales (incluye eliminados):
```bash
psql "CONNECTION_STRING" -c "SELECT COUNT(*) FROM family_heads;"
```

---

## 📚 Documentación Adicional

- 📘 [`MIGRACION_BD.md`](./MIGRACION_BD.md) - Manual completo (50+ páginas)
- 📖 [`CHANGELOG.md`](./CHANGELOG.md) - Historial del proyecto
- 📄 [`.env.example`](./.env.example) - Plantilla de configuración
- 🔗 [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- 🔗 [Neon Documentation](https://neon.tech/docs)
- 🔗 [Prisma Documentation](https://www.prisma.io/docs)

---

## 🆘 Soporte

Si encuentras problemas:

1. **Consulta el manual completo:** [`MIGRACION_BD.md`](./MIGRACION_BD.md)
2. **Revisa el log generado:** `migration_TIMESTAMP.log`
3. **Verifica errores comunes:** Sección "Solución de Problemas" en el manual
4. **Usa el script de verificación:** `./verify-migration.sh`

---

## ✅ Checklist Rápido

Antes de ejecutar la migración:

- [ ] PostgreSQL Client Tools instalados (`pg_dump`, `psql`)
- [ ] Credenciales de BD local disponibles
- [ ] Connection string de Neon cloud disponible
- [ ] Copia de seguridad de datos importantes
- [ ] Tiempo estimado: 10-15 minutos

Durante la migración:

- [ ] Sigue las instrucciones del script
- [ ] Confirma cuando se solicite
- [ ] Anota el nombre del archivo de backup generado

Después de la migración:

- [ ] Ejecutar `verify-migration.sh`
- [ ] Actualizar `.env` con URL cloud
- [ ] Ejecutar `npx prisma generate`
- [ ] Probar la app con `npm run dev`
- [ ] Verificar datos en Prisma Studio
- [ ] Guardar backups en lugar seguro
- [ ] Eliminar dumps si ya no son necesarios

---

**¡Listo para migrar! 🚀**

Ejecuta el script y sigue las instrucciones en pantalla:
```bash
chmod +x migrate-to-cloud.sh
./migrate-to-cloud.sh
```

---

*Última actualización: 23 de octubre de 2025*  
*Wedding Guest Management App*
