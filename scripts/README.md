# 🛠️ Scripts - Wedding Guest Management App

Colección de scripts útiles para administración, migración y mantenimiento del sistema.

---

## 📁 Estructura

```
scripts/
├── README.md                    # Este archivo
│
├── TypeScript Scripts/
│   ├── create-admin.ts         # Crear usuario administrador
│   └── delete-user.ts          # Eliminar usuarios
│
├── Shell Scripts (Linux/Mac)/
│   ├── setup.sh                # Setup inicial del proyecto
│   ├── migrate-to-cloud.sh     # Migración automática a cloud
│   ├── verify-migration.sh     # Verificar migración
│   └── restart-prisma.sh       # Reiniciar Prisma Client
│
└── Batch Scripts (Windows)/
    ├── setup.bat               # Setup inicial (Windows)
    ├── migrate-to-cloud.bat    # Migración a cloud (Windows)
    └── restart-prisma.bat      # Reiniciar Prisma (Windows)
```

---

## 🔧 Scripts TypeScript

### 1. `create-admin.ts` - Crear Usuario Administrador

**Descripción:** Crea un usuario con rol de administrador en el sistema.

**Uso:**
```bash
npx ts-node scripts/create-admin.ts
```

**Características:**
- ✅ Crea usuario con rol `admin`
- ✅ Genera contraseña segura compatible con Better Auth
- ✅ Valida email único
- ✅ Manejo de errores completo

**Documentación:** Ver [`docs/CREAR_ADMIN.md`](../docs/CREAR_ADMIN.md)

---

### 2. `delete-user.ts` - Eliminar Usuarios

**Descripción:** Elimina un usuario del sistema por email.

**Uso:**
```bash
npx ts-node scripts/delete-user.ts
```

**Características:**
- ✅ Elimina usuario y sesiones relacionadas
- ✅ Confirmación antes de eliminar
- ✅ Validación de email
- ✅ Mensajes de éxito/error claros

**Precaución:** ⚠️ Esta acción es irreversible. Úsalo con cuidado.

---

## 🐚 Scripts Shell

### 3. `setup.sh` - Setup Inicial del Proyecto

**Descripción:** Configura el proyecto desde cero.

**Uso:**
```bash
# Linux/Mac/Git Bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

**Funcionalidades:**
- ✅ Verifica dependencias (Node, npm, PostgreSQL)
- ✅ Instala paquetes npm
- ✅ Configura archivo .env
- ✅ Inicializa base de datos
- ✅ Genera cliente Prisma

---

### 4. `migrate-to-cloud.sh` - Migración Automática a Cloud

**Descripción:** Migra datos de PostgreSQL local a Neon Cloud.

**Uso:**
```bash
# Linux/Mac/Git Bash
chmod +x scripts/migrate-to-cloud.sh
./scripts/migrate-to-cloud.sh
```

**Proceso:**
1. ✅ Backup de base de datos cloud
2. ✅ Exporta dump de BD local
3. ✅ Restaura en BD cloud
4. ✅ Valida integridad de datos
5. ✅ Genera logs detallados

**Documentación:** Ver [`docs/MIGRACION_BD.md`](../docs/MIGRACION_BD.md)

**Logs generados:**
- `migration_[timestamp].log` - Log completo
- `backup_cloud_[timestamp].sql` - Backup de cloud
- `dump_local_[timestamp].sql` - Dump de local

---

### 5. `verify-migration.sh` - Verificar Migración

**Descripción:** Verifica que la migración se completó correctamente.

**Uso:**
```bash
# Linux/Mac/Git Bash
chmod +x scripts/verify-migration.sh
./scripts/verify-migration.sh
```

**Validaciones:**
- ✅ Cuenta registros en todas las tablas
- ✅ Compara local vs cloud
- ✅ Verifica integridad referencial
- ✅ Genera reporte de diferencias

---

## 🪟 Windows

Para ejecutar scripts shell en Windows, usa una de estas opciones:

### Opción 1: Git Bash (Recomendado)
```bash
# Desde Git Bash
./scripts/setup.sh
./scripts/migrate-to-cloud.sh
./scripts/verify-migration.sh
```

### Opción 2: WSL (Windows Subsystem for Linux)
```bash
# Desde WSL terminal
bash scripts/setup.sh
bash scripts/migrate-to-cloud.sh
bash scripts/verify-migration.sh
```

### Opción 3: PowerShell (adaptación necesaria)
Los scripts `.sh` necesitan adaptarse para PowerShell o crear versiones `.ps1`

---

## 📋 Requisitos

### Para Scripts TypeScript:
- ✅ Node.js 18+
- ✅ npm o pnpm
- ✅ ts-node instalado (`npm install -g ts-node`)
- ✅ Variables de entorno configuradas (`.env`)

### Para Scripts Shell:
- ✅ Bash shell (Linux/Mac/Git Bash/WSL)
- ✅ PostgreSQL client tools (`psql`, `pg_dump`)
- ✅ Permisos de ejecución (`chmod +x`)

---

## 🔒 Seguridad

⚠️ **Importante:**
- Nunca subas archivos `.sql` con datos sensibles al repositorio
- Los backups se generan en la raíz del proyecto (añadidos a `.gitignore`)
- Mantén tus credenciales de base de datos seguras
- Los scripts de eliminación son irreversibles

---

## 🪟 Scripts Batch (Windows)

### 6. `setup.bat` - Setup Inicial (Windows)

**Descripción:** Versión Windows del script de configuración inicial.

**Uso:**
```cmd
scripts\setup.bat
```

**Funcionalidades:**
- ✅ Verifica Node.js y npm
- ✅ Instala dependencias
- ✅ Configura .env
- ✅ Inicializa Prisma

---

### 7. `restart-prisma.bat` - Reiniciar Prisma (Windows)

**Descripción:** Reinicia y regenera el cliente de Prisma en Windows.

**Uso:**
```cmd
scripts\restart-prisma.bat
```

**Funcionalidades:**
- ✅ Limpia archivos generados
- ✅ Regenera cliente Prisma
- ✅ Sincroniza schema con DB

---

### 8. `migrate-to-cloud.bat` - Migración a Cloud (Windows)

**Descripción:** Versión Windows del script de migración a Neon Cloud.

**Uso:**
```cmd
scripts\migrate-to-cloud.bat
```

**Funcionalidades:**
- ✅ Exporta datos locales
- ✅ Migra a Neon Cloud
- ✅ Verifica integridad

**Nota:** Requiere PostgreSQL Client Tools instalado en Windows.

---

## 🐛 Troubleshooting

### Error: "Permission denied"
```bash
chmod +x scripts/*.sh
```

### Error: "ts-node: command not found"
```bash
npm install -g ts-node
# O usa npx:
npx ts-node scripts/create-admin.ts
```

### Error: "psql: command not found"
Instala PostgreSQL client tools:
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS (Homebrew)
brew install postgresql

# Windows
# Descarga desde postgresql.org
```

### Error en migración: "Dump file not found"
Verifica que:
1. PostgreSQL local esté corriendo
2. Las credenciales en `.env` sean correctas
3. Tengas permisos de lectura en la BD local

---

## 📚 Documentación Relacionada

- **[Setup completo](../docs/SETUP.md)** - Guía de instalación
- **[Migración BD](../docs/MIGRACION_BD.md)** - Guía detallada de migración
- **[Crear Admin](../docs/CREAR_ADMIN.md)** - Documentación de usuarios admin
- **[Project Overview](../docs/PROJECT_OVERVIEW.md)** - Visión general del proyecto

---

## 🆘 Ayuda

Si necesitas ayuda con algún script:
1. Lee la documentación relacionada en [`docs/`](../docs/)
2. Revisa los logs generados (archivos `.log`)
3. Verifica que todas las variables de entorno estén configuradas
4. Asegúrate de tener los permisos necesarios

---

**Última actualización:** 5 de noviembre de 2025  
**Versión:** 1.0.0
