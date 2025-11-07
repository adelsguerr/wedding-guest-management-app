# 📚 Índice de Documentación - Wedding Guest Management App

Bienvenido a la documentación completa del sistema de gestión de invitados de boda.

---

## 🚀 Inicio Rápido

1. **[SETUP.md](./SETUP.md)** - Guía de instalación paso a paso
   - Requisitos del sistema
   - Instalación de dependencias
   - Configuración de variables de entorno
   - Setup de base de datos

2. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Visión general del proyecto
   - Descripción general
   - Stack tecnológico
   - Estructura del proyecto
   - Características principales

---

## 📖 Guías de Uso

### Autenticación
- **[BETTER_AUTH.md](./BETTER_AUTH.md)** - Sistema de autenticación
  - Configuración de Better Auth
  - Login y registro de usuarios
  - Gestión de sesiones
  - Roles y permisos
  - Protección de rutas

- **[CREAR_ADMIN.md](./CREAR_ADMIN.md)** - Crear usuario administrador
  - Proceso manual de creación
  - Scripts de automatización

### Funcionalidades Core

- **[DASHBOARD.md](./DASHBOARD.md)** - Dashboard de estadísticas
  - Métricas principales
  - Gráficos y visualizaciones
  - Tarjetas de información

- **[ZUSTAND.md](./ZUSTAND.md)** - Gestión de estado
  - Stores centralizados
  - Hooks personalizados
  - Patrón de uso

- **[BORRADO_LOGICO.md](./BORRADO_LOGICO.md)** - Sistema de borrado lógico
  - Implementación de soft delete
  - Recuperación de registros
  - Mejores prácticas

---

## 🗄️ Base de Datos

- **[MIGRACION_BD.md](./MIGRACION_BD.md)** - Migración de base de datos
  - Migración Local → Cloud (Neon)
  - Método automático y manual
  - Verificación de integridad
  - Troubleshooting

**Scripts de Migración:** Ver [`/scripts/README-MIGRATION.md`](../scripts/README-MIGRATION.md)

---

## 📝 Desarrollo

- **[CHANGELOG.md](./CHANGELOG.md)** - Historial de cambios
  - Fase 1: Dashboard con estadísticas
  - Fase 2: CRUD de Familias
  - Fase 3: CRUD de Invitados
  - Fase 4: Gestión de Mesas
  - Fase 5: Refactorización con Zustand
  - Fase 6: Consolidación de Toasts
  - Fase 7: Autenticación con Better Auth
  - Stack tecnológico actualizado
  - Próximas fases planificadas
---

## 🔮 Arquitectura Futura

- **[MULTI_TENANT_ARCHITECTURE.md](./MULTI_TENANT_ARCHITECTURE.md)** - Plataforma SaaS Multi-Tenant
  - Visión general de arquitectura
  - Modelos de base de datos multi-tenant
  - Sistema de roles por boda
  - Onboarding de novios
  - Dashboard Super Admin
  - Sistema de planes (Free, Basic, Premium)
  - Plan de implementación
  - Migración desde single-tenant

---

## 🗂️ Estructura de la Documentación

```
docs/
├── INDEX.md                         # Este archivo
├── SETUP.md                         # Instalación inicial
├── PROJECT_OVERVIEW.md              # Visión general
├── CHANGELOG.md                     # Historial de cambios
│
├── Autenticación/
│   ├── BETTER_AUTH.md              # Sistema de auth
│   └── CREAR_ADMIN.md              # Crear admin
│
├── Funcionalidades/
│   ├── DASHBOARD.md                # Dashboard
│   ├── ZUSTAND.md                  # Estado global
│   └── BORRADO_LOGICO.md           # Soft delete
│
├── Base de Datos/
│   ├── MIGRACION_BD.md             # Migración
│   └── SCRIPTS_MIGRACION.md        # Scripts
│
└── Futuro/
    └── MULTI_TENANT_ARCHITECTURE.md # SaaS multi-tenant
```

---

## 🔍 Búsqueda Rápida por Tema

### Instalación y Setup
→ [SETUP.md](./SETUP.md)

### Autenticación y Seguridad
→ [BETTER_AUTH.md](./BETTER_AUTH.md)  
→ [CREAR_ADMIN.md](./CREAR_ADMIN.md)

### Base de Datos
→ [MIGRACION_BD.md](./MIGRACION_BD.md)  
→ [../scripts/README-MIGRATION.md](../scripts/README-MIGRATION.md)

### Desarrollo
→ [CHANGELOG.md](./CHANGELOG.md)  
→ [ZUSTAND.md](./ZUSTAND.md)  
→ [BORRADO_LOGICO.md](./BORRADO_LOGICO.md)

### UI/UX
→ [DASHBOARD.md](./DASHBOARD.md)

### Arquitectura y Planificación
→ [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)  
→ [MULTI_TENANT_ARCHITECTURE.md](./MULTI_TENANT_ARCHITECTURE.md)

---

## 📞 Soporte

Si tienes preguntas o encuentras algún problema:
1. Revisa la documentación correspondiente
2. Consulta el [CHANGELOG.md](./CHANGELOG.md) para ver si hay actualizaciones
3. Verifica los scripts en la carpeta [`../scripts/`](../scripts/)

---

**Última actualización:** 5 de noviembre de 2025  
**Versión del proyecto:** 1.0.0 (Fase 7 completada)
