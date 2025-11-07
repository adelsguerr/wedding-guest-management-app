@echo off
echo Deteniendo procesos de Node.js...
taskkill /F /IM node.exe /T 2>nul
timeout /t 3 /nobreak >nul

echo Regenerando cliente de Prisma...
call npx prisma generate

echo.
echo ===================================
echo Prisma regenerado exitosamente
echo Ahora puedes ejecutar: npm run dev
echo ===================================
pause
