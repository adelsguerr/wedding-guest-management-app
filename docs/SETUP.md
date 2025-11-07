# 🚀 Guía de Instalación y Configuración

## Requisitos Previos

- Node.js 18+ instalado
- PostgreSQL instalado y corriendo
- Una cuenta en Twilio (para WhatsApp)
- Git (opcional)

## Paso 1: Instalar Dependencias

Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

## Paso 2: Configurar Base de Datos

### Opción A: PostgreSQL Local

1. Instala PostgreSQL si no lo tienes:
   - Windows: Descarga de https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `sudo apt install postgresql`

2. Crea una base de datos:
   ```bash
   psql -U postgres
   CREATE DATABASE wedding_db;
   \q
   ```

3. Copia el archivo de ejemplo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Edita `.env` y actualiza la cadena de conexión:
   ```
   DATABASE_URL="postgresql://postgres:tu_password@localhost:5432/wedding_db?schema=public"
   ```

### Opción B: PostgreSQL en la Nube (Neon, Supabase, etc.)

1. Crea una cuenta en [Neon](https://neon.tech) o [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la cadena de conexión
4. Pégala en tu archivo `.env`

## Paso 3: Configurar Twilio (WhatsApp)

1. Crea una cuenta en [Twilio](https://www.twilio.com/try-twilio)

2. Ve a la consola y obtén:
   - Account SID
   - Auth Token

3. Activa WhatsApp:
   - Ve a Messaging > Try it out > Try WhatsApp
   - Envía el código desde tu WhatsApp al número de Twilio
   - El número será algo como: `whatsapp:+14155238886`

4. Agrega las credenciales a tu archivo `.env`:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=tu_auth_token
   TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
   ```

**IMPORTANTE**: En la versión de prueba de Twilio, solo puedes enviar mensajes a números que hayan sido verificados en tu cuenta.

## Paso 4: Inicializar Base de Datos

Ejecuta las migraciones de Prisma:

```bash
npm run db:push
```

Esto creará todas las tablas necesarias.

## Paso 5: Iniciar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:3000

## Paso 6: Explorar la Aplicación

1. **Página Principal**: http://localhost:3000
2. **Dashboard**: http://localhost:3000/dashboard
3. **Gestión de Familias**: http://localhost:3000/families
4. **Gestión de Mesas**: http://localhost:3000/tables
5. **Notificaciones**: http://localhost:3000/notifications

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Base de datos
npm run db:push      # Sincronizar schema
npm run db:studio    # Abrir Prisma Studio (GUI)

# Linting
npm run lint
```

## 🗄️ Prisma Studio

Para visualizar y editar los datos directamente:

```bash
npm run db:studio
```

Esto abrirá una interfaz web en http://localhost:5555

## 📱 Configuración de WhatsApp en Producción

Para usar WhatsApp en producción necesitas:

1. **Cuenta Business verificada** en Twilio
2. **Plantillas de mensajes aprobadas** por WhatsApp
3. **Número de WhatsApp Business** dedicado

Costos aproximados:
- Conversaciones iniciadas por usuario: Gratis
- Conversaciones iniciadas por negocio: ~$0.005 - $0.05 USD por mensaje (varía por país)

## 🚀 Despliegue

### Vercel (Recomendado)

1. Haz push de tu código a GitHub
2. Ve a [Vercel](https://vercel.com)
3. Importa tu repositorio
4. Agrega las variables de entorno
5. Despliega

### Railway

1. Ve a [Railway](https://railway.app)
2. Crea un nuevo proyecto
3. Agrega PostgreSQL
4. Despliega desde GitHub
5. Agrega variables de entorno

## 🔒 Seguridad

**IMPORTANTE**: 

- ❌ **NUNCA** subas el archivo `.env` a GitHub
- ✅ El archivo `.gitignore` ya está configurado para protegerlo
- ✅ Usa variables de entorno en producción
- ✅ Mantén tus credenciales de Twilio seguras

## 🆘 Solución de Problemas

### Error: "Can't reach database server"
- Verifica que PostgreSQL esté corriendo
- Verifica la cadena de conexión en `.env`
- Asegúrate de que el puerto 5432 esté disponible

### Error: "Module not found"
- Ejecuta `npm install` de nuevo
- Elimina `node_modules` y `package-lock.json`, luego ejecuta `npm install`

### WhatsApp no envía mensajes
- Verifica que las credenciales de Twilio sean correctas
- En modo prueba, verifica que el número esté registrado en tu cuenta Twilio
- Revisa los logs de la API en `/app/api/notifications/route.ts`

### Base de datos no se sincroniza
- Ejecuta `npm run db:push` de nuevo
- Si persiste, elimina la base de datos y créala de nuevo

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)
- [shadcn/ui Components](https://ui.shadcn.com)

## 💡 Siguientes Pasos

1. Personaliza los colores en `tailwind.config.ts`
2. Actualiza los nombres de los novios en las plantillas de mensajes
3. Configura la fecha y lugar de la boda
4. Empieza a agregar familias e invitados
5. Crea las mesas según tu salón
6. ¡Envía las invitaciones!

## 🎉 ¡Listo!

Tu aplicación de gestión de boda está lista para usar. ¡Felicidades por tu boda! 👰🤵💒
