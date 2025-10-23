# 💒 Wedding Guest Management App - Resumen del Proyecto

## 📋 Estructura del Proyecto

```
wedding-guest-management-app/
├── app/                          # Aplicación Next.js (App Router)
│   ├── api/                      # API Routes (Backend)
│   │   ├── families/            # CRUD de familias
│   │   ├── guests/              # CRUD de invitados
│   │   ├── tables/              # CRUD de mesas
│   │   ├── notifications/       # Envío de WhatsApp
│   │   └── stats/               # Estadísticas
│   ├── dashboard/               # Dashboard principal
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                 # Página de inicio
├── components/
│   └── ui/                      # Componentes de UI (shadcn)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── label.tsx
├── lib/
│   ├── prisma.ts                # Cliente de Prisma
│   ├── whatsapp.ts              # Integración con Twilio
│   └── utils.ts                 # Utilidades
├── prisma/
│   └── schema.prisma            # Esquema de base de datos
├── .env.example                 # Variables de entorno (ejemplo)
├── package.json                 # Dependencias
├── tailwind.config.ts           # Configuración de Tailwind
└── tsconfig.json                # Configuración de TypeScript
```

## 🗄️ Modelo de Datos

### FamilyHead (Cabeza de Familia)
- ✅ Solo adultos
- 📱 Teléfono (WhatsApp)
- 👥 Número de invitados permitidos
- ✔️ Estado de confirmación
- 🔗 Relación con invitados y notificaciones

### Guest (Invitado)
- 👤 Información personal
- 🎂 Tipo (ADULTO/NIÑO)
- 🍽️ Restricciones alimentarias
- 🪑 Asiento asignado
- 🔗 Pertenece a una familia

### Table (Mesa)
- 🏷️ Nombre/Número
- 📊 Tipo (redonda, rectangular, VIP, infantil)
- 👥 Capacidad
- 📍 Ubicación y coordenadas
- 🔗 Contiene asientos

### Seat (Asiento)
- 🔢 Número de asiento
- ✅ Estado (ocupado/disponible)
- 🔗 Pertenece a mesa y puede tener invitado

### Notification (Notificación)
- 📱 Tipo (Save the Date, RSVP, Recordatorios, etc.)
- ✉️ Mensaje y estado
- 📅 Fecha de envío
- 🔗 Asociada a cabeza de familia

## 🎯 Funcionalidades Principales

### 1. Gestión de Familias (/families)
- ➕ Crear cabezas de familia (solo adultos)
- 📝 Editar información
- 👁️ Ver detalles con invitados
- 🗑️ Eliminar familias
- 📊 Validación de cupos

### 2. Gestión de Invitados (/guests)
- ➕ Agregar invitados por familia
- 👶 Marcar como ADULTO o NIÑO
- 🍽️ Registrar restricciones alimentarias
- 🪑 Asignar a mesas
- ⚠️ Validación de límites por familia

### 3. Gestión de Mesas (/tables)
- ➕ Crear mesas con diferentes tipos:
  - 🔵 Mesa redonda 8 personas
  - 🔵 Mesa redonda 10 personas
  - 🟦 Mesa rectangular 6 personas
  - 🟦 Mesa rectangular 8 personas
  - ⭐ Mesa VIP (novios, padrinos)
  - 🎈 Mesa infantil
- 🗺️ Visualización interactiva del salón
- 🖱️ Drag & Drop para asignar invitados
- 📍 Posicionamiento con coordenadas

### 4. Notificaciones WhatsApp (/notifications)
- 📱 Integración con Twilio WhatsApp API
- 📝 Plantillas predefinidas:
  - 💌 Save the Date
  - ✅ Solicitud de RSVP
  - ⏰ Recordatorio 1 mes antes
  - ⏰ Recordatorio 1 semana antes
  - ⏰ Recordatorio 1 día antes
  - 🪑 Asignación de mesa
  - 💕 Agradecimiento post-evento
  - ✏️ Mensaje personalizado
- 📊 Historial de notificaciones
- ✉️ Envío masivo con progreso

### 5. Dashboard (/dashboard)
- 📊 Estadísticas en tiempo real
- 👥 Total de familias e invitados
- 🪑 Ocupación de mesas
- ✅ Estado de confirmaciones
- 📱 Notificaciones recientes

## 🔌 API Endpoints

### Familias
- `GET /api/families` - Listar todas
- `POST /api/families` - Crear nueva
- `GET /api/families/[id]` - Ver una
- `PATCH /api/families/[id]` - Actualizar
- `DELETE /api/families/[id]` - Eliminar

### Invitados
- `GET /api/guests` - Listar todos
- `POST /api/guests` - Crear nuevo

### Mesas
- `GET /api/tables` - Listar todas
- `POST /api/tables` - Crear nueva

### Notificaciones
- `GET /api/notifications` - Historial
- `POST /api/notifications` - Enviar nueva

### Estadísticas
- `GET /api/stats` - Dashboard stats

## 🚀 Inicio Rápido

### Windows
```bash
setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

### Manual
```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales

# 3. Configurar base de datos
npm run db:push

# 4. Iniciar aplicación
npm run dev
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui
- **Base de Datos**: PostgreSQL + Prisma ORM
- **API Externa**: Twilio (WhatsApp)
- **Visualización**: React-Konva (mapas interactivos)
- **Deployment**: Vercel/Railway (recomendado)

## 📱 Configuración de WhatsApp

### Modo Desarrollo (Twilio Sandbox)
1. Cuenta gratis en Twilio
2. Números limitados (solo verificados)
3. Perfecto para pruebas

### Modo Producción
1. Cuenta Business en Twilio
2. Número dedicado de WhatsApp
3. Plantillas aprobadas por WhatsApp
4. Costo por mensaje (~$0.005-$0.05 USD)

## 🔒 Seguridad

- ✅ Variables de entorno protegidas
- ✅ `.env` en `.gitignore`
- ✅ Validación de datos en API
- ✅ Sanitización de inputs
- ✅ Manejo de errores

## 📈 Próximas Características (Roadmap)

- [ ] Autenticación de usuarios
- [ ] Portal público para confirmación
- [ ] Generación de códigos QR
- [ ] Exportar lista de invitados a PDF/Excel
- [ ] Integración con lista de regalos
- [ ] Galería de fotos post-evento
- [ ] Múltiples eventos por cuenta
- [ ] Plantillas personalizables de mensajes
- [ ] Análisis avanzado de respuestas
- [ ] App móvil (React Native)

## 🐛 Solución de Problemas

Consulta `SETUP.md` para guía detallada de instalación y solución de problemas comunes.

## 📄 Licencia

MIT License - Libre para uso personal y comercial

## 👰🤵 ¡Felicidades por tu Boda!

Esta aplicación fue diseñada con amor para hacer tu planificación de boda más sencilla y organizada. ¡Que tengas un día maravilloso! 💒✨

---

**Desarrollado con** ❤️ **para parejas que se van a casar**
