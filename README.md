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
chmod +x migrate-to-cloud.sh
./migrate-to-cloud.sh

# Windows CMD/PowerShell
migrate-to-cloud.bat
```

**Opción 2 - Manual:**
Consulta la guía completa en [`MIGRACION_BD.md`](./MIGRACION_BD.md)

El script automático:
- ✅ Crea backup de seguridad de la BD cloud
- ✅ Exporta dump de la BD local
- ✅ Restaura en la BD cloud con verificación
- ✅ Valida integridad de datos
- ✅ Genera logs detallados

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
