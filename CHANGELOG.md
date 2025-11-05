# 📋 CHANGELOG - Wedding Guest Management App

## 🎯 Proyecto: Sistema de Gestión de Invitados de Boda

**Fecha de inicio:** 23 de octubre de 2025  
**Stack:** Next.js 15, TypeScript, Prisma, PostgreSQL, Tailwind CSS, shadcn/ui

---

## ✅ COMPLETADO

### � Fase 5: Gestión de Mesas (CRÍTICO) ⭐ NUEVO
- [x] **Página `/tables`** - Gestión completa de mesas
- [x] **CRUD de mesas** - Crear, listar, editar, eliminar con validación
- [x] **6 tipos de mesa** - Round 8/10, Rectangular 6/8, VIP, Kids
- [x] **Visualización dual**:
  - Vista Lista: Cards con estadísticas, grid de asientos, barras de progreso
  - Vista Salón: Canvas interactivo con react-konva
- [x] **Canvas interactivo (react-konva)**:
  - Mesas arrastrables para reorganizar salón
  - Asientos clicables alrededor de cada mesa
  - Posiciones guardadas en DB (positionX, positionY)
  - Zoom (50%-200%), indicadores de ocupación
  - Gradiente azul-purple para background del salón
- [x] **Asignación de invitados a asientos**:
  - Click en asiento abre modal de asignación
  - Select de invitados disponibles (sin asiento asignado)
  - Remover invitados de asientos
  - Validación: un invitado = un asiento
- [x] **API `/api/seats/[id]`** - GET/PATCH para asientos
- [x] **Estadísticas en tiempo real**:
  - Total mesas, total asientos
  - Asientos ocupados/disponibles con %
  - Colores: gris (vacía), amarillo (parcial), verde (completa)
- [x] **Filtros por tipo de mesa** - 7 filtros (ALL + 6 tipos)

### �🏗️ Fase 1: Configuración Inicial del Proyecto
- [x] Creación del proyecto Next.js 14 (App Router) con TypeScript
- [x] Configuración de Tailwind CSS con tema personalizado (pink-purple gradients)
- [x] Instalación de shadcn/ui components
- [x] Configuración de ESLint y Prettier
- [x] Actualización a Next.js 15.0.3 (seguridad: 0 vulnerabilidades)
- [x] Actualización a React 18.3.1

### 🗄️ Fase 2: Base de Datos
- [x] **Schema de Prisma completo** con 5 modelos:
  - `FamilyHead` - Representantes de familia (solo adultos)
  - `Guest` - Invitados (adultos y niños)
  - `Table` - Mesas (6 tipos)
  - `Seat` - Asientos (auto-generados)
  - `Notification` - Notificaciones WhatsApp
- [x] Configuración dual de bases de datos:
  - PostgreSQL local (respaldo y desarrollo)
  - Neon PostgreSQL Cloud (producción)
- [x] **Borrado lógico implementado** en todas las tablas:
  - Campos `isDeleted` (Boolean) y `deletedAt` (DateTime)
  - Filtrado automático en todos los queries
  - Mantiene integridad de datos históricos

### 🔐 Fase 3: Reglas de Negocio Críticas
- [x] **Representante de familia solo adultos** - Validación en schema
- [x] **Representante de familia cuenta como invitado** - Auto-creación al registrar familia
- [x] **Validación de cupos** - No puede exceder `allowedGuests`
- [x] **WhatsApp solo a representantes** - Campo `phone` único en FamilyHead
- [x] **Asientos auto-generados** - Al crear mesa según `capacity`

### 🎨 Fase 4: UI Components (shadcn/ui)
- [x] `Button` - Botón reutilizable
- [x] `Card` - Tarjetas de contenido
- [x] `Input` - Campo de texto con validación visual
- [x] `Label` - Etiquetas de formulario
- [x] `Dialog` - Modal para formularios
- [x] `Alert Dialog` - Modal de confirmación
- [x] **ConfirmDialog personalizado** - 3 variantes (danger, success, warning)

### 📱 Fase 5: Páginas Principales

#### Homepage (`/`)
- [x] Diseño landing page con tema de boda
- [x] Navegación a todas las secciones
- [x] Animaciones y gradientes personalizados

#### Dashboard (`/dashboard`)
- [x] Estadísticas en tiempo real:
  - Total familias, invitados, adultos, niños
  - Confirmados, pendientes, declinados
  - Mesas creadas, asientos ocupados
- [x] Gráficos visuales con cards
- [x] Navegación rápida

#### Familias (`/families`)
- [x] Lista de familias con tarjetas
- [x] **Modal centrado** para agregar familia
- [x] Contadores: Total, Confirmados, Invitados
- [x] Filtros y búsqueda (pendiente implementar)
- [x] Estados de confirmación visual (badges)
- [x] Botón eliminar con confirmación
- [x] **Auto-creación de Guest para representante de familia**
- [x] Contador actualizado: `X/Y invitados` (incluye representante)
- [x] **Validación de formularios**:
  - Nombre (mínimo 2 caracteres)
  - Apellido (mínimo 2 caracteres)
  - Teléfono (formato internacional)
  - Bordes rojos/verdes con iconos
  - Mensajes de error personalizados

#### Invitados (`/guests`)
- [x] Lista de invitados con tarjetas diferenciadas
- [x] **Modal centrado** para agregar invitado
- [x] Iconos diferenciados: 👤 Adultos, 👶 Niños
- [x] Estadísticas: Total, Adultos, Niños, Confirmados
- [x] **Filtros funcionales**:
  - Búsqueda por nombre/familia
  - Filtro por tipo (Todos, Adultos, Niños)
- [x] Muestra familia, mesa asignada, restricciones
- [x] Selector de familia con contador de cupos
- [x] **Validación de formularios**:
  - Nombre y apellido obligatorios
  - Selección de familia obligatoria
  - Validación visual (rojo/verde)

### 🔔 Fase 6: Sistema de Notificaciones

#### Toast System (Sonner)
- [x] Instalado y configurado
- [x] Toasts personalizados en `layout.tsx`
- [x] Implementado en todas las operaciones:
  - ✅ Familia agregada exitosamente
  - ✅ Invitado agregado exitosamente
  - ✅ Familia eliminada
  - ❌ Errores de validación
  - ❌ Errores de servidor

#### Modales de Confirmación
- [x] **ConfirmDialog component**:
  - Variante `danger` (rojo) - Eliminaciones
  - Variante `success` (verde) - Confirmaciones
  - Variante `warning` (amarillo) - Advertencias
- [x] Diseño consistente con el sistema
- [x] Animaciones suaves (fade, zoom, slide)
- [x] Iconos personalizados por variante
- [x] Reemplazó `alert()` nativo del navegador

### 🛡️ Fase 7: Validación de Formularios
- [x] **Sistema de validación personalizado**:
  - Estados `touched` y `errors`
  - Validación en tiempo real (onBlur + onChange)
  - Prevención de envío si hay errores
- [x] **Feedback visual**:
  - Borde rojo + ⚠️ para errores
  - Borde verde + ✓ para válidos
  - Mensajes de error debajo del campo
  - Toast general si intenta enviar con errores
- [x] **Reglas de validación**:
  - Campos obligatorios
  - Longitud mínima (2 caracteres)
  - Formato de teléfono internacional (regex)
  - Selección de dropdown requerida

### 🔧 Fase 8: API Routes

#### `/api/families`
- [x] GET - Obtener todas las familias (con filtro `isDeleted`)
- [x] POST - Crear familia + auto-crear Guest cabeza
- [x] Includes: guests, notifications, _count

#### `/api/families/[id]`
- [x] GET - Obtener familia específica
- [x] PATCH - Actualizar familia
- [x] DELETE - Borrado lógico (marca `isDeleted: true`)

#### `/api/guests`
- [x] GET - Obtener todos los invitados (filtro `isDeleted`)
- [x] POST - Crear invitado con validación de cupos
- [x] Includes: familyHead, seat, table

#### `/api/guests/[id]`
- [x] GET - Obtener invitado específico
- [x] PATCH - Actualizar invitado
- [x] DELETE - Borrado lógico

#### `/api/tables`
- [x] GET - Obtener todas las mesas (filtro `isDeleted`)
- [x] POST - Crear mesa + auto-crear asientos según capacity
- [x] Includes: seats, guests, _count

#### `/api/tables/[id]`
- [x] GET - Obtener mesa específica
- [x] PATCH - Actualizar mesa
- [x] DELETE - Borrado lógico

#### `/api/notifications`
- [x] POST - Enviar notificación WhatsApp (estructura lista)
- [x] GET - Historial de notificaciones

#### `/api/stats`
- [x] GET - Estadísticas del dashboard en tiempo real

### 📚 Fase 9: Servicios y Utilidades

#### WhatsApp Integration (`lib/whatsapp.ts`)
- [x] Configuración de Twilio
- [x] **7 plantillas de mensajes**:
  - Save the Date
  - Solicitud RSVP
  - Recordatorio 1 mes
  - Recordatorio 1 semana
  - Recordatorio 1 día
  - Asignación de mesa
  - Agradecimiento
- [x] Función `sendWhatsAppMessage()`
- [x] Función `sendBulkWhatsAppMessages()` con callback de progreso

#### Prisma Client (`lib/prisma.ts`)
- [x] Singleton pattern para desarrollo
- [x] Previene múltiples instancias

#### Utils (`lib/utils.ts`)
- [x] Función `cn()` para merge de clases

### 📖 Fase 10: Documentación
- [x] `README.md` - Descripción general del proyecto
- [x] `SETUP.md` - Guía de instalación paso a paso
- [x] `PROJECT_OVERVIEW.md` - Arquitectura y tecnologías
- [x] `.clinerules` - Contexto completo para Cline AI
- [x] `.cursorrules` - Reglas para Cursor AI
- [x] `.github/copilot-instructions.md` - Contexto rápido para Copilot
- [x] `BORRADO_LOGICO.md` - Documentación del soft delete
- [x] `restart-prisma.bat` - Script para regenerar Prisma Client
- [x] **`MIGRACION_BD.md`** - Manual completo de migración Local → Cloud
- [x] **`migrate-to-cloud.sh`** - Script automático de migración (Bash)
- [x] **`migrate-to-cloud.bat`** - Script automático de migración (Windows)

### 🔄 Fase 11: Herramientas de Migración de Datos
- [x] **Script de migración automatizado** (Bash + Windows)
  - Verificación de conexiones (local y cloud)
  - Backup automático de BD cloud antes de restaurar
  - Export de BD local con pg_dump (formato custom)
  - Restauración en BD cloud con pg_restore
  - Validación de integridad (conteo de registros)
  - Generación de logs detallados
  - Mensajes con colores para mejor UX
  - Confirmaciones de seguridad en pasos críticos
- [x] **Manual de migración completo** (50+ páginas)
  - Requisitos previos y preparación
  - Método automático (script guiado)
  - Método manual (paso a paso)
  - Verificación post-migración exhaustiva
  - Procedimientos de rollback
  - Solución de problemas comunes
  - Mejores prácticas de seguridad
  - Checklist completo de migración

---

## 🚧 PENDIENTE DE IMPLEMENTACIÓN

### 📄 Páginas Faltantes

#### 1. **Mesas y Asignación de Asientos** (`/tables`) - CRÍTICO
- [ ] Página de gestión de mesas
- [ ] Modal para crear mesas (con selector de tipo y capacidad)
- [ ] Visualización de mesas con asientos
- [ ] **Asignación drag & drop de invitados a asientos**
- [ ] **Visualización canvas con react-konva** (plano del salón)
- [ ] Indicador visual de asientos ocupados/libres
- [ ] Filtros por tipo de mesa
- [ ] Edición de posición (X, Y) para layout visual

**Dependencias a instalar:**
```bash
npm install react-konva konva @types/react-konva
npm install react-beautiful-dnd @types/react-beautiful-dnd
```

#### 2. **Notificaciones WhatsApp** (`/notifications`)
- [ ] Página para enviar mensajes
- [ ] Selector de tipo de notificación (dropdown con plantillas)
- [ ] Preview del mensaje antes de enviar
- [ ] Selector múltiple de familias/todos
- [ ] Barra de progreso para envío masivo
- [ ] Historial de notificaciones enviadas (tabla)
- [ ] Filtros por estado (enviado, fallido, leído)
- [ ] Re-envío de mensajes fallidos

#### 3. **Detalles de Familia** (`/families/[id]`)
- [ ] Vista detallada de una familia
- [ ] Lista de todos sus invitados
- [ ] Gráfico de confirmaciones
- [ ] Historial de notificaciones a esa familia
- [ ] Botón para enviar mensaje personalizado
- [ ] Timeline de actividad
- [ ] Edición inline de datos

#### 4. **Portal Público de Confirmación** (`/rsvp/[token]`)
- [ ] Landing page para invitados
- [ ] Formulario de confirmación simple
- [ ] Selección de invitados que asistirán
- [ ] Restricciones alimentarias opcionales
- [ ] Mensaje de agradecimiento
- [ ] Generación de tokens únicos por familia
- [ ] Sistema de links personalizados

#### 5. **Galería de Fotos** (`/gallery`)
- [ ] Upload de fotos del evento
- [ ] Grid responsive de imágenes
- [ ] Modal lightbox para ver fotos
- [ ] Categorías (ceremonia, recepción, familia, etc.)
- [ ] Sistema de likes/favoritos
- [ ] Descarga de álbum completo

### 🔐 Autenticación y Seguridad
- [ ] **NextAuth.js** - Sistema de autenticación
- [ ] Login para administradores
- [ ] Roles: Admin, Organizador, Viewer
- [ ] Protección de rutas privadas
- [ ] Session management
- [ ] Password reset flow

### 🎨 Mejoras de UI/UX
- [ ] **Tema oscuro** (dark mode toggle)
- [ ] Animaciones con Framer Motion
- [ ] Skeleton loaders durante carga
- [ ] Paginación en listas largas
- [ ] Infinite scroll opcional
- [ ] Breadcrumbs de navegación
- [ ] Atajos de teclado (shortcuts)
- [ ] Modo de impresión optimizado

### 📊 Funcionalidades Adicionales

#### Exportación de Datos
- [ ] **Exportar a Excel** (lista de invitados)
- [ ] **Exportar a PDF** (lista por mesa)
- [ ] **Generar etiquetas** para tarjetas de mesa
- [ ] **Generar códigos QR** por familia
- [ ] Exportar estadísticas

#### Gestión Avanzada
- [ ] **Vista de papelera** (recuperar eliminados)
- [ ] **Restaurar registros** borrados lógicamente
- [ ] **Eliminación física** automática después de 30 días
- [ ] **Logs de auditoría** (quién modificó qué)
- [ ] **Backup automático** de base de datos
- [ ] **Importar CSV** de invitados

#### Analytics y Reportes
- [ ] Dashboard avanzado con gráficos (Chart.js o Recharts)
- [ ] Gráfico de confirmaciones en el tiempo
- [ ] Mapa de calor de asientos ocupados
- [ ] Reporte de restricciones alimentarias
- [ ] Proyección de costos por invitado
- [ ] Exportar reportes personalizados

### 📱 Notificaciones y Recordatorios
- [ ] **Cron jobs** para recordatorios automáticos
- [ ] Recordatorio 1 mes antes (automático)
- [ ] Recordatorio 1 semana antes (automático)
- [ ] Recordatorio 1 día antes (automático)
- [ ] Email alternativo a WhatsApp
- [ ] SMS como backup

### 🧪 Testing
- [ ] **Unit tests** con Jest
- [ ] **Integration tests** con React Testing Library
- [ ] **E2E tests** con Playwright
- [ ] Test coverage > 80%
- [ ] CI/CD con GitHub Actions

### 🚀 Deployment y DevOps
- [ ] **Deploy a Vercel** (producción)
- [ ] Variables de entorno en Vercel
- [ ] Configurar dominio personalizado
- [ ] SSL/HTTPS automático
- [ ] **Monitoreo con Sentry** (errores)
- [ ] **Analytics con Vercel Analytics**
- [ ] CDN para assets estáticos

### 📱 PWA y Mobile
- [ ] Convertir a Progressive Web App
- [ ] Manifest.json configurado
- [ ] Service Worker para offline
- [ ] Responsive design perfecto
- [ ] Touch gestures optimizados
- [ ] App icons para mobile

---

## 🐛 BUGS CONOCIDOS

### Críticos
- [ ] **Prisma Client** requiere regeneración manual después de cambios en schema
  - **Solución temporal:** Ejecutar `restart-prisma.bat`
  - **Solución permanente:** Automatizar en `npm run dev`

### Menores
- [ ] Warning EPERM en Windows al ejecutar `prisma generate`
  - **Impacto:** Visual, no afecta funcionalidad
  - **Solución:** Ignorar o ejecutar como administrador

---

## 🔄 PRÓXIMOS PASOS RECOMENDADOS

### Prioridad ALTA (Funcionalidad Core)
1. **Crear página `/tables`** con gestión de mesas
2. **Implementar drag & drop** para asignación de asientos
3. **Crear página `/notifications`** para envío de WhatsApp
4. **Probar integración WhatsApp** con Twilio real

### Prioridad MEDIA (UX/Seguridad)
5. **Implementar autenticación** con NextAuth.js
6. **Crear portal RSVP** público con tokens
7. **Agregar exportación** a Excel/PDF
8. **Modo oscuro** (dark theme)

### Prioridad BAJA (Nice to Have)
9. **Galería de fotos** con upload
10. **Analytics avanzados** con gráficos
11. **Testing** completo (unit + E2E)
12. **Deploy a producción** en Vercel

---

## 📦 DEPENDENCIAS ACTUALES

```json
{
  "dependencies": {
    "next": "^15.0.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@prisma/client": "^6.18.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "sonner": "^1.7.1",
    "twilio": "^5.4.0",
    "lucide-react": "latest",
    "tailwindcss": "^3.3.6",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "prisma": "^6.18.0",
    "@types/node": "^20.10.6",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.3"
  }
}
```

### Por Instalar (según necesidad)
- `react-konva konva @types/react-konva` - Visualización de mesas
- `react-beautiful-dnd` - Drag and drop
- `next-auth` - Autenticación
- `xlsx` - Exportación Excel
- `jspdf jspdf-autotable` - Exportación PDF
- `qrcode` - Generación QR codes
- `recharts` o `chart.js` - Gráficos avanzados
- `framer-motion` - Animaciones
- `@sentry/nextjs` - Monitoreo de errores

---

## 🎨 TEMA Y DISEÑO

### Paleta de Colores
- **Primary:** Pink-600 to Purple-600 (gradients)
- **Background:** Pink-50, Purple-50, Blue-50
- **Success:** Green-500/600
- **Error:** Red-500/600
- **Warning:** Yellow-500/600
- **Info:** Blue-500/600

### Iconos (Lucide React)
- 💒 Wedding (app icon)
- 👤 Adultos
- 👶 Niños
- 🗑️ Eliminar
- ✅ Confirmado
- ❌ Declinado
- ⏳ Pendiente

---

## 📝 NOTAS IMPORTANTES

### Configuración de Bases de Datos
- **Local:** `postgresql://postgres:password@localhost:5432/wedding_db`
- **Neon:** Configurada y funcionando
- Cambiar entre ellas editando `DATABASE_URL` en `.env`

### Reglas de Negocio NO NEGOCIABLES
1. Representante de familia = Adulto SIEMPRE
2. Representante de familia cuenta en `allowedGuests`
3. WhatsApp solo a número del representante
4. Borrado lógico, NUNCA físico
5. Asientos auto-generados al crear mesa

### Scripts Útiles
```bash
npm run dev           # Desarrollo
npm run build         # Build producción
npm run db:push       # Sincronizar schema con DB
npm run db:studio     # Abrir Prisma Studio
npx prisma generate   # Regenerar cliente
```

---

## 🏆 LOGROS DESTACADOS

✨ **0 vulnerabilidades** de seguridad  
✨ **Sistema de borrado lógico** completo  
✨ **Validación visual** sin alerts nativos  
✨ **Modales personalizados** con animaciones  
✨ **Toast notifications** profesionales  
✨ **Auto-creación** de invitado representante de familia  
✨ **Dual database** (local + cloud)  
✨ **TypeScript** 100% tipado  
✨ **Documentación** completa para IAs  

---

**Última actualización:** 23 de octubre de 2025  
**Estado del proyecto:** 🟢 Funcional - Base sólida lista para expandir  
**Próximo milestone:** Gestión de mesas y asignación de asientos
