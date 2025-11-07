# 💒 Wedding Guest Management App

Aplicación completa para gestionar invitados de boda con notificaciones por WhatsApp y asignación de mesas.

## 🚀 Características

- ✅ Gestión de representantes de familia y sus invitados
- 👶 Distinción entre adultos y niños
- 📱 Notificaciones vía WhatsApp (Twilio)
- 🪑 Mapeo interactivo de mesas y asientos
- 🎨 Diferentes tipos de mesas (redondas, rectangulares, VIP)
- 📊 Dashboard completo de estadísticas
- 📝 Confirmación de asistencia online
- 🍽️ Gestión de restricciones alimentarias

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14, React, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Base de Datos**: PostgreSQL con Prisma ORM
- **Notificaciones**: Twilio WhatsApp API
- **Visualización**: React-Konva para mesas interactivas

## 📦 Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Edita `.env` con tus credenciales

4. Configura la base de datos:
   ```bash
   npm run db:push
   ```

5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

6. Abre [http://localhost:3000](http://localhost:3000)

## 🗄️ Base de Datos

El esquema incluye:
- **FamilyHead**: Representantes de familia (adultos)
- **Guest**: Invitados (adultos y niños)
- **Table**: Mesas del evento
- **Seat**: Asientos por mesa
- **Notification**: Historial de notificaciones

### Dual Database Setup

Esta aplicación soporta tanto PostgreSQL local como cloud (Neon):
- **Local**: Para desarrollo y respaldo (`localhost:5432/wedding_db`)
- **Cloud (Neon)**: Para producción y acceso remoto

### 🔄 Migración Local → Cloud

Si tienes datos en tu base de datos local y quieres migrarlos a la nube:

**Opción 1 - Script Automático (Recomendado):**
```bash
# Linux/Mac/Git Bash
chmod +x scripts/migrate-to-cloud.sh
./scripts/migrate-to-cloud.sh

# Windows CMD/PowerShell
scripts\migrate-to-cloud.bat
```

**Opción 2 - Manual:**
Consulta la guía completa en [`docs/MIGRACION_BD.md`](./docs/MIGRACION_BD.md)

El script automático:
- ✅ Crea backup de seguridad de la BD cloud
- ✅ Exporta dump de la BD local
- ✅ Restaura en la BD cloud con verificación
- ✅ Valida integridad de datos
- ✅ Genera logs detallados

## 📚 Documentación

Toda la documentación se encuentra en la carpeta [`docs/`](./docs/):

- **[INDEX.md](./docs/INDEX.md)** - 📋 Índice completo de documentación
- **[SETUP.md](./docs/SETUP.md)** - Guía de instalación detallada
- **[PROJECT_OVERVIEW.md](./docs/PROJECT_OVERVIEW.md)** - Visión general del proyecto
- **[CHANGELOG.md](./docs/CHANGELOG.md)** - Historial de cambios
- **[BETTER_AUTH.md](./docs/BETTER_AUTH.md)** - Sistema de autenticación
- **[DASHBOARD.md](./docs/DASHBOARD.md)** - Documentación del dashboard
- **[ZUSTAND.md](./docs/ZUSTAND.md)** - Gestión de estado
- **[BORRADO_LOGICO.md](./docs/BORRADO_LOGICO.md)** - Sistema de borrado lógico
- **[MIGRACION_BD.md](./docs/MIGRACION_BD.md)** - Migración de base de datos
- **[MULTI_TENANT_ARCHITECTURE.md](./docs/MULTI_TENANT_ARCHITECTURE.md)** - Arquitectura SaaS (futuro)

## 🛠️ Scripts Útiles

Todos los scripts se encuentran en la carpeta [`scripts/`](./scripts/):

**Ver documentación completa:** [`scripts/README.md`](./scripts/README.md)

### Scripts TypeScript:
```bash
npx ts-node scripts/create-admin.ts    # Crear usuario administrador
npx ts-node scripts/delete-user.ts     # Eliminar usuarios
```

### Scripts Shell (Linux/Mac/Git Bash):
```bash
chmod +x scripts/*.sh                   # Dar permisos de ejecución
./scripts/setup.sh                      # Setup inicial
./scripts/migrate-to-cloud.sh          # Migración a cloud
./scripts/verify-migration.sh          # Verificar migración
```

## 📂 Estructura del Proyecto

```
wedding-guest-management-app/
├── app/                    # Next.js 14 App Router
│   ├── (protected)/       # Rutas protegidas con middleware
│   │   ├── dashboard/     # Dashboard principal
│   │   ├── families/      # Gestión de familias
│   │   ├── guests/        # Gestión de invitados
│   │   └── tables/        # Gestión de mesas
│   ├── api/               # API routes
│   ├── login/             # Página de login/registro
│   └── layout.tsx         # Layout principal
│
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── header.tsx        # Header con navegación
│   ├── user-menu.tsx     # Menú de usuario
│   └── ...               # Otros componentes
│
├── lib/                   # Utilidades y configuración
│   ├── hooks/            # Custom React hooks
│   ├── stores/           # Zustand stores
│   ├── auth.ts           # Better Auth config
│   ├── auth-client.ts    # Auth client hooks
│   ├── prisma.ts         # Cliente Prisma
│   └── utils.ts          # Utilidades generales
│
├── prisma/               # Prisma ORM
│   └── schema.prisma     # Esquema de base de datos
│
├── docs/                 # 📚 Documentación completa
│   ├── INDEX.md          # Índice de documentación
│   ├── SETUP.md          # Guía de instalación
│   ├── CHANGELOG.md      # Historial de cambios
│   ├── BETTER_AUTH.md    # Sistema de autenticación
│   └── ...               # Más documentación
│
├── scripts/              # 🛠️ Scripts útiles
│   ├── README.md         # Documentación de scripts
│   ├── create-admin.ts   # Crear admin (TypeScript)
│   ├── setup.sh          # Setup inicial (Shell)
│   └── ...               # Más scripts
│
├── .env                  # Variables de entorno (no subir)
├── .env.example          # Ejemplo de variables
├── middleware.ts         # Middleware de autenticación
├── next.config.js        # Configuración de Next.js
├── package.json          # Dependencias npm
└── README.md             # Este archivo
```

## 📱 Configuración de WhatsApp (Twilio)

1. Crea una cuenta en [Twilio](https://www.twilio.com/)
2. Activa WhatsApp Business API
3. Obtén tus credenciales (Account SID y Auth Token)
4. Configura el número de WhatsApp
5. Agrega las credenciales al archivo `.env`

## 📋 Uso

### Gestión de Familias
- Agrega representantes de familia con sus datos de contacto
- Asigna cupos de invitados por familia
- Los representantes de familia solo pueden ser adultos

### Gestión de Invitados
- Registra invitados asociados a cada familia
- Marca si son adultos o niños
- Registra restricciones alimentarias

### Asignación de Mesas
- Crea mesas de diferentes tipos
- Asigna invitados arrastrando y soltando
- Visualiza la distribución del salón

### Notificaciones WhatsApp
- Envía Save the Date
- Solicita confirmación de asistencia
- Envía recordatorios automáticos
- Comparte detalles del evento

## 🔒 Seguridad

- Las variables de entorno están protegidas
- No subas el archivo `.env` al repositorio
- Mantén tus credenciales de Twilio seguras

## 📄 Licencia

MIT

## 👰🤵 ¡Felicidades por tu boda!
