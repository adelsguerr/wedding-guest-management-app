# 🎯 Zustand - Gestión de Estado Global

## 📚 Documentación Completa

### ✅ ¿Qué hemos implementado?

Se han creado **4 stores de Zustand** para gestión centralizada del estado global de la UI:

#### 1. **Modal Store** (`modal-store.ts`)
Controla el estado de apertura/cierre de todos los modales de la aplicación.

**Estados gestionados:**
- ✅ Modales de Familias (crear/editar)
- ✅ Modales de Invitados (crear/editar)
- ✅ Modales de Mesas (crear/editar)
- ✅ Modal de asignación de asientos
- ✅ Modal de notificaciones

**Funciones disponibles:**
```typescript
const { 
  openFamilyModal, 
  closeFamilyModal,
  familyModalMode, // 'create' | 'edit'
  selectedFamilyId 
} = useModalStore();

// Uso
openFamilyModal('create'); // Abrir para crear
openFamilyModal('edit', 'family-id'); // Abrir para editar
closeFamilyModal(); // Cerrar
```

#### 2. **Filter Store** (`filter-store.ts`)
Gestiona filtros y búsquedas con **persistencia en LocalStorage**.

**Características:**
- ✅ **Persistente** - Los filtros se guardan automáticamente
- ✅ Filtros separados para Guests, Families y Tables
- ✅ Búsqueda por texto
- ✅ Filtros por estado de confirmación
- ✅ Filtros por tipo

**Ejemplo de uso:**
```typescript
const { 
  guestTypeFilter,
  guestSearchQuery,
  setGuestTypeFilter,
  setGuestSearchQuery,
  clearGuestFilters
} = useFilterStore();

// Uso
setGuestTypeFilter('ADULT'); // Filtrar solo adultos
setGuestSearchQuery('Juan'); // Buscar 'Juan'
clearGuestFilters(); // Limpiar todos los filtros
```

**Filtros disponibles:**

**Guests:**
- `guestTypeFilter`: 'ALL' | 'ADULT' | 'CHILD'
- `guestSearchQuery`: string
- `guestConfirmationFilter`: 'ALL' | 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'NO_RESPONSE'

**Families:**
- `familySearchQuery`: string
- `familyConfirmationFilter`: estados de confirmación

**Tables:**
- `tableTypeFilter`: 'ALL' | 'ROUND' | 'RECTANGULAR' | 'VIP' | 'KIDS' | 'BUFFET'
- `tableSearchQuery`: string
- `tableLocationFilter`: string | null

#### 3. **Preferences Store** (`preferences-store.ts`)
Gestiona preferencias del usuario con **persistencia en LocalStorage**.

**Preferencias almacenadas:**
- ✅ Modo de vista (lista/grid/canvas)
- ✅ Tema visual
- ✅ Orden de columnas
- ✅ Items por página
- ✅ Mostrar/ocultar elementos eliminados
- ✅ Habilitar animaciones
- ✅ Estado del sidebar

**Ejemplo de uso:**
```typescript
const { 
  tablesViewMode,
  setTablesViewMode,
  theme,
  setTheme,
  enableAnimations,
  toggleAnimations
} = usePreferencesStore();

// Cambiar vista de mesas
setTablesViewMode('canvas'); // 'list' | 'grid' | 'canvas'

// Cambiar tema
setTheme('dark'); // 'light' | 'dark' | 'wedding'

// Toggle animaciones
toggleAnimations();
```

**Preferencias disponibles:**

| Preferencia | Tipo | Valores | Default |
|-------------|------|---------|---------|
| `tablesViewMode` | string | list/grid/canvas | list |
| `guestsViewMode` | string | list/grid | list |
| `familiesViewMode` | string | list/grid | list |
| `theme` | string | light/dark/wedding | wedding |
| `itemsPerPage` | number | 10/25/50/100 | 25 |
| `showDeletedItems` | boolean | true/false | false |
| `enableAnimations` | boolean | true/false | true |
| `isSidebarCollapsed` | boolean | true/false | false |

#### 4. **UI Store** (`ui-store.ts`)
Gestiona elementos de UI globales y temporales (NO persistente).

**Funcionalidades:**
- ✅ Loading global con overlay
- ✅ Sistema de toasts/notificaciones
- ✅ Diálogo de confirmación
- ✅ Breadcrumbs de navegación
- ✅ Título de página

**Ejemplo de uso:**

**Loading Global:**
```typescript
const { setGlobalLoading } = useUIStore();

setGlobalLoading(true, 'Guardando cambios...');
// ... operación async
setGlobalLoading(false);
```

**Toasts:**
```typescript
const { addToast } = useUIStore();

// Success
addToast({
  type: 'success',
  title: 'Invitado creado',
  message: 'El invitado se ha creado exitosamente',
  duration: 3000
});

// Error
addToast({
  type: 'error',
  title: 'Error al guardar',
  message: 'Por favor intenta nuevamente'
});

// Warning
addToast({
  type: 'warning',
  title: 'Atención',
  message: 'Esta acción no se puede deshacer'
});

// Info
addToast({
  type: 'info',
  title: 'Información',
  message: 'Los cambios se guardarán automáticamente'
});
```

**Diálogo de Confirmación:**
```typescript
const { openConfirmDialog } = useUIStore();

openConfirmDialog(
  '¿Eliminar invitado?',
  'Esta acción no se puede deshacer',
  () => {
    // Acción a ejecutar si confirma
    deleteGuest(guestId);
  }
);
```

---

## 📦 Componentes UI Creados

### 1. `ToastContainer` ✅
Contenedor global de toasts en la esquina superior derecha.

**Características:**
- ✨ Animaciones de entrada/salida
- 🎨 Colores según tipo (success/error/warning/info)
- ⏱️ Auto-dismiss después de 5 segundos
- ❌ Botón de cierre manual

**Integración:**
Ya está integrado en `app/layout.tsx` - funciona automáticamente.

### 2. `GlobalLoadingOverlay` ✅
Overlay de loading que cubre toda la pantalla.

**Características:**
- 🌀 Spinner animado
- 💬 Mensaje personalizable
- 🎭 Backdrop blur
- 🚫 Bloquea interacción mientras carga

**Integración:**
Ya está integrado en `app/layout.tsx` - funciona automáticamente.

---

## 🚀 Cómo Usar en tus Componentes

### Ejemplo Completo: Modal de Crear Invitado

```typescript
"use client";

import { useModalStore, useUIStore } from '@/lib/stores';
import { useCreateGuest } from '@/lib/hooks/use-guests';

export function GuestsPage() {
  // Store hooks
  const { 
    isGuestModalOpen, 
    guestModalMode,
    openGuestModal, 
    closeGuestModal 
  } = useModalStore();
  
  const { setGlobalLoading, addToast } = useUIStore();
  
  // React Query hook
  const createGuest = useCreateGuest();

  const handleCreate = async (data: GuestData) => {
    setGlobalLoading(true, 'Creando invitado...');
    
    try {
      await createGuest.mutateAsync(data);
      
      addToast({
        type: 'success',
        title: 'Invitado creado',
        message: `${data.firstName} ${data.lastName} ha sido agregado`
      });
      
      closeGuestModal();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error al crear invitado',
        message: error.message
      });
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => openGuestModal('create')}>
        Nuevo Invitado
      </Button>
      
      <Dialog 
        open={isGuestModalOpen} 
        onOpenChange={(open) => !open && closeGuestModal()}
      >
        {/* Form content */}
      </Dialog>
    </div>
  );
}
```

### Ejemplo: Filtros Persistentes

```typescript
"use client";

import { useFilterStore } from '@/lib/stores';
import { useGuests } from '@/lib/hooks/use-guests';

export function GuestsPage() {
  // Filtros del store (persisten automáticamente)
  const { 
    guestTypeFilter,
    guestSearchQuery,
    setGuestTypeFilter,
    setGuestSearchQuery
  } = useFilterStore();
  
  // Datos
  const { data: guests = [] } = useGuests();
  
  // Aplicar filtros
  const filteredGuests = guests
    .filter(g => 
      guestTypeFilter === 'ALL' || g.guestType === guestTypeFilter
    )
    .filter(g => 
      `${g.firstName} ${g.lastName}`
        .toLowerCase()
        .includes(guestSearchQuery.toLowerCase())
    );

  return (
    <div>
      {/* Búsqueda */}
      <Input
        value={guestSearchQuery}
        onChange={(e) => setGuestSearchQuery(e.target.value)}
        placeholder="Buscar invitados..."
      />
      
      {/* Filtro por tipo */}
      <Select
        value={guestTypeFilter}
        onValueChange={setGuestTypeFilter}
      >
        <SelectItem value="ALL">Todos</SelectItem>
        <SelectItem value="ADULT">Adultos</SelectItem>
        <SelectItem value="CHILD">Niños</SelectItem>
      </Select>
      
      {/* Lista filtrada */}
      {filteredGuests.map(guest => (
        <div key={guest.id}>{guest.firstName}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 Ventajas de Zustand vs useState

### ❌ Antes (con useState local)

```typescript
// ❌ Estado duplicado en cada componente
const [searchTerm, setSearchTerm] = useState("");
const [filterType, setFilterType] = useState("ALL");

// ❌ Se pierde al cambiar de página
// ❌ No comparte entre componentes
// ❌ Más código repetitivo
```

### ✅ Ahora (con Zustand)

```typescript
// ✅ Estado centralizado
const { guestSearchQuery, setGuestSearchQuery } = useFilterStore();

// ✅ Persiste en LocalStorage
// ✅ Compartido entre componentes
// ✅ Menos código
```

---

## 📊 Comparativa

| Característica | useState | Zustand |
|---------------|----------|---------|
| **Persistencia** | ❌ Se pierde | ✅ LocalStorage |
| **Compartir estado** | ❌ Props drilling | ✅ Cualquier componente |
| **Código** | 😐 Más verboso | ✅ Conciso |
| **DevTools** | ❌ No | ✅ Sí |
| **TypeScript** | ✅ Sí | ✅ Mejor tipado |
| **Performance** | ✅ Buena | ✅ Excelente |

---

## 🔧 Configuración Actual

### LocalStorage Keys:
- `wedding-filters-storage` - Filtros
- `wedding-preferences-storage` - Preferencias

### Persistencia:
- ✅ **Filter Store** - Persiste
- ✅ **Preferences Store** - Persiste
- ❌ **Modal Store** - NO persiste (correcto)
- ❌ **UI Store** - NO persiste (correcto)

---

## 🎯 Próximos Pasos de Integración

### Fase 1: Refactorizar Modales ✅ (Preparado)
```typescript
// En lugar de:
const [showForm, setShowForm] = useState(false);

// Usar:
const { isGuestModalOpen, openGuestModal, closeGuestModal } = useModalStore();
```

### Fase 2: Implementar Filtros Persistentes 🔄 (Opcional)
Reemplazar `useState` de filtros con `useFilterStore`.

### Fase 3: Añadir Toasts 🔄 (Opcional)
Reemplazar `toast` de sonner con `useUIStore().addToast`.

### Fase 4: Preferencias de Usuario 🔄 (Futuro)
- Toggle vista lista/grid
- Selección de tema
- Items por página

---

## 📚 Ejemplos de Uso Rápido

### 1. Modal Simple
```typescript
const { isGuestModalOpen, openGuestModal, closeGuestModal } = useModalStore();

<Button onClick={() => openGuestModal('create')}>Nuevo</Button>
<Dialog open={isGuestModalOpen} onOpenChange={(o) => !o && closeGuestModal()}>
  {/* ... */}
</Dialog>
```

### 2. Toast de Éxito
```typescript
const { addToast } = useUIStore();

addToast({
  type: 'success',
  title: 'Guardado',
  message: 'Los cambios se guardaron correctamente'
});
```

### 3. Loading Global
```typescript
const { setGlobalLoading } = useUIStore();

const saveData = async () => {
  setGlobalLoading(true, 'Guardando...');
  await api.save();
  setGlobalLoading(false);
};
```

### 4. Confirmación
```typescript
const { openConfirmDialog } = useUIStore();

const handleDelete = () => {
  openConfirmDialog(
    '¿Eliminar?',
    'Esta acción no se puede deshacer',
    () => deleteItem()
  );
};
```

### 5. Filtros Persistentes
```typescript
const { guestSearchQuery, setGuestSearchQuery } = useFilterStore();

<Input 
  value={guestSearchQuery}
  onChange={(e) => setGuestSearchQuery(e.target.value)}
/>
```

---

## 🐛 Troubleshooting

### ❓ Los filtros no persisten
**Solución:** Verifica que estés usando `useFilterStore` o `usePreferencesStore` (tienen `persist`).

### ❓ Estado no se actualiza
**Solución:** Asegúrate de estar usando el setter del store, no mutando directamente.

### ❓ Toasts no aparecen
**Solución:** Verifica que `<ToastContainer />` esté en `layout.tsx`.

### ❓ Loading overlay no se muestra
**Solución:** Verifica que `<GlobalLoadingOverlay />` esté en `layout.tsx`.

---

## 🎓 Recursos Adicionales

- [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
- [TypeScript Guide](https://docs.pmnd.rs/zustand/guides/typescript)

---

**Última actualización:** Noviembre 2025  
**Versión:** 1.0 - Zustand Stores Implementados  
**Estado:** ✅ LISTO PARA USAR
