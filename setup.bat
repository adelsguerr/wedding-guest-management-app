@echo off
echo 🎉 Iniciando configuración del proyecto Wedding Guest Management...
echo.

REM Verificar Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js encontrado
node --version
echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo ✅ Dependencias instaladas correctamente
) else (
    echo ❌ Error al instalar dependencias
    exit /b 1
)

echo.

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env...
    copy .env.example .env >nul
    echo ✅ Archivo .env creado
    echo.
    echo ⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales:
    echo    - DATABASE_URL: Cadena de conexión de PostgreSQL
    echo    - TWILIO_ACCOUNT_SID: Account SID de Twilio
    echo    - TWILIO_AUTH_TOKEN: Auth Token de Twilio
    echo    - TWILIO_WHATSAPP_NUMBER: Número de WhatsApp de Twilio
    echo.
) else (
    echo ℹ️  El archivo .env ya existe
)

echo.
echo 🎯 Siguiente paso: Configura tu base de datos
echo.
echo Para PostgreSQL local:
echo   1. Instala PostgreSQL si no lo tienes
echo   2. Crea una base de datos usando pgAdmin o:
echo      psql -U postgres -c "CREATE DATABASE wedding_db;"
echo   3. Actualiza DATABASE_URL en .env
echo.
echo Para PostgreSQL en la nube:
echo   1. Crea una cuenta en Neon.tech o Supabase
echo   2. Copia la cadena de conexión
echo   3. Actualiza DATABASE_URL en .env
echo.
echo Después ejecuta:
echo   npm run db:push    # Para crear las tablas
echo   npm run dev        # Para iniciar la aplicación
echo.
echo 📚 Para más detalles, consulta SETUP.md
echo.
echo ✨ ¡Todo listo! ¡Que tengas una boda maravillosa! 💒👰🤵
echo.
pause
