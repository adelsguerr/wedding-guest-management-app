# Wedding Guest Management App

## Contexto Rápido para IA

Este es un sistema de gestión de invitados de boda con Next.js 14, TypeScript, Prisma y WhatsApp.

### Reglas Críticas del Negocio
1. **REPRESENTANTES DE FAMILIA SOLO SON ADULTOS** - Nunca crear FamilyHead con guestType CHILD
2. **Validar cupos** - Un FamilyHead con allowedGuests=3 solo puede tener 3 Guests máximo
3. **WhatsApp solo a representantes** - Notificaciones solo se envían a FamilyHead.phone
4. **Asientos auto-generados** - Al crear Table, crear Seat[] automáticamente según capacity

### Stack
- Next.js 14 (App Router) + TypeScript
- Prisma + PostgreSQL
- Tailwind CSS + shadcn/ui
- Twilio WhatsApp API
- React-Konva (mesas interactivas)

### Estructura DB
```prisma
FamilyHead (solo adultos)
  └── Guest[] (adultos y niños)
        └── Seat?
              └── Table

Notification[] → FamilyHead
```

### APIs Disponibles
- `/api/families` - CRUD familias
- `/api/guests` - CRUD invitados (valida cupos)
- `/api/tables` - CRUD mesas (auto-crea asientos)
- `/api/notifications` - Envío WhatsApp
- `/api/stats` - Dashboard

### Comandos Clave
```bash
npm run dev        # Desarrollo
npm run db:push    # Sincronizar DB
npm run db:studio  # GUI Prisma
```

### Archivos Importantes
- `prisma/schema.prisma` - Modelo de datos
- `lib/whatsapp.ts` - Plantillas WhatsApp
- `lib/prisma.ts` - Cliente DB
- `.env` - Configuración (no subir a git)

### Patrón de Código
- Componentes cliente: `"use client"` al inicio
- Siempre incluir tipos TypeScript
- Validaciones en API routes
- Errores manejados con try-catch + NextResponse
- UI con componentes shadcn/ui de `components/ui/`

### Temas de Color (Wedding)
- Primary: Pink-600 a Purple-600 (gradientes)
- Background: Pink-50, Purple-50, Blue-50
- Estados: Green (confirmado), Red (declinado), Yellow (pendiente)

Ver `.clinerules` para contexto completo.
