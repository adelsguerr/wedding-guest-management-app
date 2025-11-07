# 🎊 Arquitectura Multi-Tenant - Plataforma SaaS de Gestión de Bodas

## 📋 Visión General

Transformar el sistema actual de gestión única en una **plataforma SaaS multi-tenant** donde múltiples parejas pueden gestionar sus bodas de forma independiente, con un super-administrador que supervisa todas las instancias.

---

## 🏗️ Arquitectura Propuesta

### Niveles de Usuarios

```
┌─────────────────────────────────────────────────────────────┐
│                       SUPER ADMIN                            │
│  - Ve todas las bodas (dashboard global)                    │
│  - Accede a cualquier gestión de boda                       │
│  - Gestiona suscripciones/planes                            │
│  - Estadísticas globales de la plataforma                   │
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
┌───────────▼──────┐ ┌─────▼──────┐ ┌─────▼──────┐
│   BODA #1        │ │  BODA #2   │ │  BODA #3   │
│                  │ │            │ │            │
│ Novio (owner)    │ │ Novia (owner)│ │ Novio (owner)│
│ Novia (owner)    │ │ Novio (owner)│ │ Novia (owner)│
│ └─ Editores      │ │ └─ Editores│ │ └─ Editores│
│    └─ Viewers    │ │    └─ Viewers│ │    └─ Viewers│
└──────────────────┘ └────────────┘ └────────────┘
```

---

## 🎯 Flujo de Registro (Onboarding)

### Paso 1: Landing Page Público
- Usuario visita `/` (página pública de marketing)
- Click en "Crear mi Gestión de Boda"

### Paso 2: Registro Inicial
```
┌─────────────────────────────────────────────┐
│  ¿Quién eres?                               │
│  ○ Novio                                    │
│  ○ Novia                                    │
│  ○ Otro organizador                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Tus datos:                                 │
│  Nombre: _____________________              │
│  Email: ______________________              │
│  Contraseña: __________________            │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Email de tu pareja (opcional):             │
│  Email: ______________________              │
│  📧 Le enviaremos invitación con acceso     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Detalles de la boda:                       │
│  Fecha: ___/___/______                      │
│  Nombre del evento: ___________________     │
│  Lugar (opcional): ____________________     │
└─────────────────────────────────────────────┘
```

### Paso 3: Creación Automática
1. Se crea un `Wedding` (nueva tabla)
2. Se crea el usuario como `owner`
3. Se envía invitación por email a la pareja (si proporcionó email)
4. Se genera contraseña temporal para la pareja
5. Redirige al dashboard de **su boda**

### Paso 4: Pareja acepta invitación
1. Recibe email: "Te han invitado a gestionar la boda de [Nombres]"
2. Click en enlace → `/accept-invite/{token}`
3. Cambia contraseña temporal
4. Accede al mismo dashboard compartido

---

## 🗄️ Cambios en Base de Datos

### Nuevo Modelo: `Wedding`

```prisma
model Wedding {
  id              String   @id @default(cuid())
  name            String   // "Boda de Juan y María"
  groomName       String?  // Nombre del novio
  brideName       String?  // Nombre de la novia
  weddingDate     DateTime
  venue           String?  // Lugar del evento
  status          WeddingStatus @default(ACTIVE) // ACTIVE, COMPLETED, CANCELLED
  plan            PlanType @default(FREE) // FREE, BASIC, PREMIUM
  maxGuests       Int      @default(50) // Límite según plan
  
  // Relaciones
  users           WeddingUser[] // Usuarios con acceso a esta boda
  families        FamilyHead[]
  tables          Table[]
  notifications   Notification[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([status])
  @@index([weddingDate])
}

enum WeddingStatus {
  ACTIVE      // En planificación
  COMPLETED   // Ya sucedió
  CANCELLED   // Cancelada
}

enum PlanType {
  FREE        // 50 invitados, 1 mes acceso
  BASIC       // 150 invitados, 6 meses acceso
  PREMIUM     // Ilimitado, acceso permanente
}
```

### Tabla Pivot: `WeddingUser`

```prisma
model WeddingUser {
  id          String   @id @default(cuid())
  weddingId   String
  userId      String
  role        WeddingRole @default(VIEWER)
  
  wedding     Wedding  @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  
  @@unique([weddingId, userId])
  @@index([weddingId])
  @@index([userId])
}

enum WeddingRole {
  OWNER       // Novio/Novia (control total)
  EDITOR      // Puede editar todo excepto eliminar boda
  VIEWER      // Solo lectura
}
```

### Actualización Modelo `User`

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  image         String?
  
  // Sistema multi-tenant
  isSuperAdmin  Boolean   @default(false) // Solo para el super admin de la plataforma
  weddings      WeddingUser[] // Bodas a las que tiene acceso
  
  // Better Auth fields
  accounts      Account[]
  sessions      Session[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

### Actualización Modelos Existentes

```prisma
model FamilyHead {
  id              String   @id @default(cuid())
  weddingId       String   // 🆕 Aislamiento por boda
  // ... campos existentes
  
  wedding         Wedding  @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  
  @@index([weddingId])
}

model Table {
  id              String   @id @default(cuid())
  weddingId       String   // 🆕 Aislamiento por boda
  // ... campos existentes
  
  wedding         Wedding  @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  
  @@index([weddingId])
}

model Notification {
  id              String   @id @default(cuid())
  weddingId       String   // 🆕 Aislamiento por boda
  // ... campos existentes
  
  wedding         Wedding  @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  
  @@index([weddingId])
}
```

---

## 🎨 Nuevas Interfaces UI

### 1. Landing Page (`/`)
- Página pública de marketing
- "Crear mi Gestión de Boda" (CTA principal)
- "Iniciar Sesión" (para usuarios existentes)
- Características, precios, testimonios

### 2. Onboarding Multi-Step (`/onboarding`)
- Wizard de 3-4 pasos
- Formulario con validación visual
- Preview del dashboard al final

### 3. Dashboard Super Admin (`/super-admin`)
Solo visible para `isSuperAdmin: true`

```
┌─────────────────────────────────────────────────────────┐
│  📊 Estadísticas Globales                               │
│                                                          │
│  Total Bodas: 47        Activas: 42      Completadas: 5 │
│  Total Usuarios: 156    Total Invitados: 3,420         │
│  Plan Free: 30  Basic: 12  Premium: 5                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  🎊 Bodas Activas                          [+ Nueva Boda]│
│                                                          │
│  Boda de Juan y María              [Ver Dashboard]      │
│  📅 15 Dic 2025 | 👥 120 invitados | 💎 Premium        │
│  ────────────────────────────────────────────────────   │
│  Boda de Pedro y Ana               [Ver Dashboard]      │
│  📅 20 Ene 2026 | 👥 80 invitados  | 🆓 Free          │
│  ────────────────────────────────────────────────────   │
│  Boda de Luis y Carmen             [Ver Dashboard]      │
│  📅 05 Feb 2026 | 👥 150 invitados | 📦 Basic         │
└─────────────────────────────────────────────────────────┘
```

### 4. Selector de Boda (para usuarios con múltiples bodas)
```
┌─────────────────────────────────────────┐
│  Tus Bodas:                             │
│                                         │
│  ○ Mi Boda (Owner)                     │
│    15 Dic 2025                         │
│                                         │
│  ○ Boda de mi hermano (Viewer)        │
│    20 Ene 2026                         │
└─────────────────────────────────────────┘
```

### 5. Configuración de Boda (`/wedding/settings`)
Solo para `OWNER`:
- Editar nombre de la boda
- Cambiar fecha
- Invitar colaboradores (enviar email)
- Gestionar roles de usuarios
- Eliminar boda (con confirmación)

---

## 🔐 Sistema de Autorización

### Middleware de Wedding Context

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  
  // 1. Verificar autenticación
  if (!session) return redirect('/login');
  
  // 2. Si es super admin, permitir todo
  if (session.user.isSuperAdmin) return NextResponse.next();
  
  // 3. Extraer weddingId de la URL
  const weddingId = extractWeddingId(request.url);
  
  // 4. Verificar acceso a esta boda
  const hasAccess = await checkWeddingAccess(session.user.id, weddingId);
  
  if (!hasAccess) return redirect('/no-access');
  
  // 5. Verificar permisos de rol para la acción
  const role = await getUserWeddingRole(session.user.id, weddingId);
  const canPerformAction = checkPermissions(role, request.method, request.url);
  
  if (!canPerformAction) return new Response('Forbidden', { status: 403 });
  
  return NextResponse.next();
}
```

### Hook de Wedding Context

```typescript
// lib/hooks/use-wedding-context.ts
export function useWeddingContext() {
  const { data: session } = useSession();
  const weddingId = useWeddingId(); // De URL o localStorage
  
  const { data: wedding } = useQuery({
    queryKey: ['wedding', weddingId],
    queryFn: () => fetch(`/api/weddings/${weddingId}`).then(r => r.json()),
  });
  
  const { data: userRole } = useQuery({
    queryKey: ['wedding-role', weddingId, session?.user.id],
    queryFn: () => fetch(`/api/weddings/${weddingId}/role`).then(r => r.json()),
  });
  
  return {
    wedding,
    role: userRole,
    isOwner: userRole === 'OWNER',
    canEdit: ['OWNER', 'EDITOR'].includes(userRole),
    canDelete: userRole === 'OWNER',
    isSuperAdmin: session?.user.isSuperAdmin,
  };
}
```

### Componente de Permisos

```typescript
// components/can.tsx
export function Can({ 
  perform, 
  children 
}: { 
  perform: 'view' | 'edit' | 'delete' | 'invite';
  children: React.ReactNode;
}) {
  const { role, isSuperAdmin } = useWeddingContext();
  
  const permissions = {
    view: ['OWNER', 'EDITOR', 'VIEWER'],
    edit: ['OWNER', 'EDITOR'],
    delete: ['OWNER'],
    invite: ['OWNER'],
  };
  
  const hasPermission = isSuperAdmin || permissions[perform].includes(role);
  
  if (!hasPermission) return null;
  
  return <>{children}</>;
}

// Uso:
<Can perform="edit">
  <Button>Editar Familia</Button>
</Can>
```

---

## 🛣️ Rutas Actualizadas

### Públicas
- `/` - Landing page
- `/login` - Inicio de sesión
- `/register` - Registro (redirige a onboarding)
- `/pricing` - Planes y precios

### Onboarding
- `/onboarding` - Wizard de creación de boda
- `/accept-invite/{token}` - Aceptar invitación de pareja

### Super Admin
- `/super-admin` - Dashboard global
- `/super-admin/weddings` - Lista de todas las bodas
- `/super-admin/weddings/{id}` - Ver boda específica
- `/super-admin/users` - Gestión de usuarios

### Wedding Scoped (requiere weddingId)
- `/w/{weddingId}/dashboard` - Dashboard de la boda
- `/w/{weddingId}/families` - Gestión de familias
- `/w/{weddingId}/guests` - Gestión de invitados
- `/w/{weddingId}/tables` - Gestión de mesas
- `/w/{weddingId}/settings` - Configuración (solo OWNER)
- `/w/{weddingId}/team` - Gestión de colaboradores (solo OWNER)

### Selector de Boda
- `/weddings` - Lista de bodas del usuario
- Al seleccionar → redirige a `/w/{weddingId}/dashboard`

---

## 📧 Sistema de Invitaciones

### Email a la Pareja

```
Asunto: Te han invitado a gestionar vuestra boda 💍

Hola [Nombre],

[Nombre de quien invita] te ha invitado a gestionar juntos su boda 
programada para el [Fecha].

Datos de acceso:
Email: [email]
Contraseña temporal: [generated-password]

[Botón: Acceder a mi Boda]

Por seguridad, te recomendamos cambiar tu contraseña al iniciar sesión.

¡Felicidades! 🎉
```

### Tabla de Invitaciones

```prisma
model WeddingInvite {
  id          String   @id @default(cuid())
  weddingId   String
  email       String
  role        WeddingRole @default(OWNER)
  token       String   @unique
  expiresAt   DateTime
  acceptedAt  DateTime?
  
  wedding     Wedding  @relation(fields: [weddingId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  
  @@index([token])
  @@index([weddingId])
}
```

---

## 💳 Sistema de Planes (Futuro)

### Límites por Plan

| Feature               | Free | Basic  | Premium    |
|-----------------------|------|--------|------------|
| Máx. Invitados        | 50   | 150    | Ilimitado  |
| Mesas                 | 5    | 20     | Ilimitado  |
| Colaboradores         | 1    | 3      | Ilimitado  |
| Notificaciones WhatsApp| ❌   | ✅ 50  | ✅ Ilimitado|
| Exportar PDF/Excel    | ❌   | ✅     | ✅         |
| Soporte prioritario   | ❌   | ❌     | ✅         |
| Acceso post-boda      | 1 mes| 6 meses| Permanente |
| Portal RSVP personalizado| ❌ | ✅     | ✅ + dominio|

### Validación de Límites

```typescript
// lib/plan-limits.ts
export async function canAddGuest(weddingId: string): Promise<boolean> {
  const wedding = await prisma.wedding.findUnique({
    where: { id: weddingId },
    include: { _count: { select: { families: true } } }
  });
  
  const limits = {
    FREE: 50,
    BASIC: 150,
    PREMIUM: Infinity
  };
  
  const totalGuests = await getTotalGuests(weddingId);
  return totalGuests < limits[wedding.plan];
}
```

---

## 🚀 Plan de Implementación

### Fase 8: Multi-Tenant Básico (2-3 días)
1. ✅ Crear modelo `Wedding` y migración
2. ✅ Actualizar modelos existentes con `weddingId`
3. ✅ Crear onboarding flow
4. ✅ Sistema de invitaciones por email
5. ✅ Middleware de wedding context
6. ✅ Actualizar todas las queries con filtro `weddingId`

### Fase 9: Super Admin Dashboard (1-2 días)
1. ✅ Dashboard global
2. ✅ Lista de bodas
3. ✅ Acceso a weddings como super admin
4. ✅ Estadísticas globales

### Fase 10: Sistema de Roles (1 día)
1. ✅ Implementar `WeddingUser` y roles
2. ✅ Componente `<Can>` para permisos
3. ✅ Protección de rutas y APIs
4. ✅ UI de gestión de colaboradores

### Fase 11: Planes y Límites (2 días)
1. ✅ Implementar validación de límites
2. ✅ Página de planes/pricing
3. ✅ Upgrade/downgrade de planes
4. ✅ Integración de pagos (Stripe)

---

## 🎨 Landing Page (Marketing)

### Secciones

1. **Hero**
   ```
   Organiza la Boda de tus Sueños
   Gestiona invitados, mesas y confirmaciones en un solo lugar
   
   [Crear Mi Boda Gratis] [Ver Demo]
   ```

2. **Características**
   - 📋 Gestión de invitados
   - 🪑 Organización de mesas
   - 📱 Confirmaciones por WhatsApp
   - 📊 Estadísticas en tiempo real

3. **Planes y Precios**
   - Free, Basic, Premium
   - Tabla comparativa

4. **Testimonios**
   - Opiniones de parejas

5. **Footer**
   - Contacto, Legal, Social

---

## 🔄 Migración de Datos Actuales

Si ya tienes datos en el sistema actual:

```typescript
// scripts/migrate-to-multi-tenant.ts
async function migrate() {
  // 1. Crear una boda "default"
  const defaultWedding = await prisma.wedding.create({
    data: {
      name: "Mi Boda",
      weddingDate: new Date('2026-06-15'),
      status: 'ACTIVE',
      plan: 'PREMIUM'
    }
  });
  
  // 2. Asociar todas las familias existentes
  await prisma.familyHead.updateMany({
    data: { weddingId: defaultWedding.id }
  });
  
  // 3. Asociar todas las mesas
  await prisma.table.updateMany({
    data: { weddingId: defaultWedding.id }
  });
  
  // 4. Convertir usuario actual en owner
  const currentUser = await prisma.user.findFirst();
  await prisma.weddingUser.create({
    data: {
      weddingId: defaultWedding.id,
      userId: currentUser.id,
      role: 'OWNER'
    }
  });
}
```

---

## 📊 Métricas de Negocio (SaaS)

### KPIs a Trackear
- **MRR** (Monthly Recurring Revenue)
- **Tasa de conversión** Free → Paid
- **Churn rate** (cancelaciones)
- **CAC** (Customer Acquisition Cost)
- **LTV** (Lifetime Value)
- Bodas activas vs completadas
- Invitados promedio por boda
- Tasa de confirmación (% confirmados)

### Analytics Dashboard (Super Admin)
```
┌─────────────────────────────────────────┐
│  💰 Revenue                             │
│  MRR: $1,240 (+12% este mes)           │
│  ARR: $14,880                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  📈 Growth                              │
│  Nuevas bodas (mes): 8                 │
│  Conversión Free→Paid: 18%             │
│  Churn: 2%                             │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  👥 Usage Stats                         │
│  Invitados totales: 3,420              │
│  Confirmaciones: 78%                   │
│  Mesas creadas: 156                    │
└─────────────────────────────────────────┘
```

---

## 🔮 Futuras Mejoras

1. **White Label**
   - Wedding planners con su propia marca
   - Dominio personalizado
   - Logo y colores custom

2. **Marketplace de Proveedores**
   - Directorio de vendors (catering, fotógrafos, etc)
   - Booking integrado
   - Comisiones por referral

3. **Mobile App**
   - React Native para novios y invitados
   - Notificaciones push
   - QR scanner para check-in

4. **IA Features**
   - Sugerencia de distribución de mesas
   - Generación de textos para invitaciones
   - Análisis de patrones (mejores horarios, etc)

5. **Integraciones**
   - Calendar sync (Google, Apple)
   - Registry integraciones (Amazon, Liverpool)
   - Payment gateways para regalos

---

## 🎯 Próximos Pasos Inmediatos

1. **¿Comenzamos con la Fase 8 (Multi-Tenant Básico)?**
   - Crear modelos de base de datos
   - Implementar onboarding
   - Sistema de invitaciones

2. **¿O prefieres primero completar features para una boda única?**
   - Portal RSVP público
   - Notificaciones WhatsApp
   - Exportación PDF/Excel

**Tu decisión determina el roadmap. ¿Qué prefieres priorizar?** 🤔
