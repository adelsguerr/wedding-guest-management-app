#!/bin/bash

echo "🧹 Limpiando caché de Next.js..."
rm -rf .next

echo "📦 Verificando dependencias..."
npm install

echo "🚀 Iniciando servidor de desarrollo..."
npm run dev
