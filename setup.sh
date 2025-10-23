#!/bin/bash

echo "🎉 Iniciando configuración del proyecto Wedding Guest Management..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js no está instalado. Por favor instálalo desde https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

echo ""

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
    echo ""
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales:"
    echo "   - DATABASE_URL: Cadena de conexión de PostgreSQL"
    echo "   - TWILIO_ACCOUNT_SID: Account SID de Twilio"
    echo "   - TWILIO_AUTH_TOKEN: Auth Token de Twilio"
    echo "   - TWILIO_WHATSAPP_NUMBER: Número de WhatsApp de Twilio"
    echo ""
else
    echo "ℹ️  El archivo .env ya existe"
fi

echo ""
echo "🎯 Siguiente paso: Configura tu base de datos"
echo ""
echo "Para PostgreSQL local:"
echo "  1. Instala PostgreSQL si no lo tienes"
echo "  2. Crea una base de datos: psql -U postgres -c 'CREATE DATABASE wedding_db;'"
echo "  3. Actualiza DATABASE_URL en .env"
echo ""
echo "Para PostgreSQL en la nube:"
echo "  1. Crea una cuenta en Neon.tech o Supabase"
echo "  2. Copia la cadena de conexión"
echo "  3. Actualiza DATABASE_URL en .env"
echo ""
echo "Después ejecuta:"
echo "  npm run db:push    # Para crear las tablas"
echo "  npm run dev        # Para iniciar la aplicación"
echo ""
echo "📚 Para más detalles, consulta SETUP.md"
echo ""
echo "✨ ¡Todo listo! ¡Que tengas una boda maravillosa! 💒👰🤵"
