@echo off
REM =========================================
REM Script de Migración BD Local a Cloud
REM Wedding Guest Management App
REM Windows Batch Version
REM =========================================

echo ========================================
echo   Migracion BD Local a Cloud (Neon)
echo ========================================
echo.

echo Este script es una version simplificada para Windows.
echo Para una experiencia completa, usa Git Bash con:
echo   chmod +x migrate-to-cloud.sh
echo   ./migrate-to-cloud.sh
echo.

echo Documentacion completa en: MIGRACION_BD.md
echo.

pause

REM Configuración
set LOCAL_HOST=localhost
set LOCAL_PORT=5432
set LOCAL_USER=postgres
set LOCAL_DB=wedding_db

echo.
echo === Paso 1: Verificar herramientas ===
echo.

REM Verificar pg_dump
where pg_dump >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] pg_dump no encontrado en PATH
    echo Instala PostgreSQL Client Tools desde:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo O agrega al PATH: C:\Program Files\PostgreSQL\15\bin
    pause
    exit /b 1
)

echo [OK] pg_dump encontrado
pg_dump --version

echo.
echo === Paso 2: Credenciales BD Local ===
echo.

set /p LOCAL_PASS="Contrasena BD Local [postgres]: "
set PGPASSWORD=%LOCAL_PASS%

echo.
echo === Paso 3: Crear dump de BD Local ===
echo.

REM Generar timestamp
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do (set mydate=%%c%%b%%a)
for /f "tokens=1-2 delims=: " %%a in ('time /t') do (set mytime=%%a%%b)
set TIMESTAMP=%mydate%_%mytime%

set DUMP_FILE=wedding_local_%TIMESTAMP%.dump

echo Exportando BD local...
echo Archivo: %DUMP_FILE%
echo.

pg_dump -h %LOCAL_HOST% -p %LOCAL_PORT% -U %LOCAL_USER% -Fc -f %DUMP_FILE% %LOCAL_DB%

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Fallo al crear dump
    pause
    exit /b 1
)

echo [OK] Dump creado exitosamente
dir %DUMP_FILE%
echo.

echo === Paso 4: Credenciales BD Cloud (Neon) ===
echo.
echo Necesitas tu connection string de Neon:
echo Ejemplo: postgresql://user:pass@host:port/db?sslmode=require
echo.

set /p CLOUD_CONN="Connection String Cloud completo: "

echo.
echo === Paso 5: Crear backup de BD Cloud (recomendado) ===
echo.

set BACKUP_FILE=cloud_backup_%TIMESTAMP%.dump

set /p DO_BACKUP="¿Crear backup de cloud? (s/n): "

if /i "%DO_BACKUP%"=="s" (
    echo Creando backup...
    pg_dump "%CLOUD_CONN%" -Fc -f %BACKUP_FILE%
    
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Backup creado: %BACKUP_FILE%
    ) else (
        echo [ERROR] Fallo al crear backup
        echo ¿Continuar sin backup? (no recomendado)
        pause
    )
)

echo.
echo === Paso 6: Restaurar en BD Cloud ===
echo.
echo ADVERTENCIA: Esto reemplazara datos existentes en cloud
set /p CONFIRM="¿Continuar? (s/n): "

if /i not "%CONFIRM%"=="s" (
    echo Operacion cancelada
    pause
    exit /b 0
)

echo.
echo Restaurando dump en cloud...
echo Esto puede tomar varios minutos...
echo.

pg_restore --verbose --clean --no-owner --no-acl --dbname="%CLOUD_CONN%" %DUMP_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Restauracion completada
) else (
    echo.
    echo [ADVERTENCIA] Restauracion completo con warnings
    echo Revisa el output para detalles
)

echo.
echo === Paso 7: Verificacion ===
echo.
echo Contando registros en cloud...
echo.

REM Nota: Necesitas escapar comillas en psql para Windows
psql "%CLOUD_CONN%" -c "SELECT 'family_heads' as tabla, COUNT(*) as total FROM family_heads UNION ALL SELECT 'guests' as tabla, COUNT(*) FROM guests;"

echo.
echo === Resumen ===
echo.
echo Archivos generados:
echo   - Dump local: %DUMP_FILE%
if exist %BACKUP_FILE% (
    echo   - Backup cloud: %BACKUP_FILE%
)
echo.
echo Proximos pasos:
echo 1. Actualizar DATABASE_URL en .env a cloud
echo 2. Ejecutar: npx prisma generate
echo 3. Ejecutar: npm run db:push
echo 4. Probar: npm run dev
echo 5. Verificar: http://localhost:3000/api/stats
echo.
echo Consulta MIGRACION_BD.md para mas detalles
echo.

pause

REM Limpiar variable de contraseña
set PGPASSWORD=
