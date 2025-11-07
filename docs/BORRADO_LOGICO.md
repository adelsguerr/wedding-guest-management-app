# 🔄 Implementación de Borrado Lógico

## ✅ Cambios Realizados

Se ha implementado **borrado lógico** en todas las tablas del sistema para mantener el historial y permitir recuperación de datos.

### 📊 Campos agregados a todas las tablas:
- `isDeleted`: Boolean (default: false)
- `deletedAt`: DateTime (nullable)

### 🗂️ Tablas actualizadas:
1. ✅ **FamilyHead** (Familias)
2. ✅ **Guest** (Invitados)
3. ✅ **Table** (Mesas)
4. ✅ **Seat** (Asientos)
5. ✅ **Notification** (Notificaciones)

### 🔧 APIs actualizadas:

#### Families (`/api/families`)
- GET: Filtra `isDeleted: false`
- DELETE: Marca `isDeleted: true` + `deletedAt`

#### Guests (`/api/guests`)
- GET: Filtra `isDeleted: false`
- DELETE: Marca `isDeleted: true` + `deletedAt`

#### Tables (`/api/tables`)
- GET: Filtra `isDeleted: false`
- DELETE: Marca `isDeleted: true` + `deletedAt`

---

## 🚨 IMPORTANTE: Regenerar Prisma Client

Debido a que agregamos nuevos campos al schema, **DEBES regenerar el cliente de Prisma** antes de ejecutar la aplicación.

### Opción 1: Script Automático (Windows)
```bash
./restart-prisma.bat
```

### Opción 2: Manual
1. **Cerrar TODOS los procesos de Node.js** (servidor dev, Prisma Studio, etc.)
2. Ejecutar:
   ```bash
   npx prisma generate
   ```
3. Iniciar el servidor nuevamente:
   ```bash
   npm run dev
   ```

### Opción 3: Si da error EPERM en Windows
1. Cierra VS Code completamente
2. Abre una terminal CMD como administrador
3. Navega a la carpeta del proyecto:
   ```cmd
   cd C:\Proyectos\wedding-guest-management-app
   ```
4. Ejecuta:
   ```cmd
   taskkill /F /IM node.exe /T
   npx prisma generate
   ```

---

## 🧪 Cómo Probar

1. **Crear una familia:**
   ```
   POST /api/families
   ```

2. **Eliminarla (borrado lógico):**
   ```
   DELETE /api/families/{id}
   ```

3. **Verificar que no aparece:**
   ```
   GET /api/families
   ```
   ✅ No debería aparecer en la lista

4. **Verificar en la base de datos:**
   ```bash
   npm run db:studio
   ```
   ✅ El registro existe pero `isDeleted = true` y tiene `deletedAt`

---

## 🎯 Beneficios del Borrado Lógico

1. **Historial completo**: Nunca perdemos datos
2. **Auditoría**: Sabemos cuándo y qué se eliminó
3. **Recuperación**: Podemos restaurar datos si es necesario
4. **Integridad**: Las relaciones se mantienen intactas
5. **Análisis**: Podemos analizar datos históricos

---

## 📝 Próximos pasos

- [ ] Crear endpoint para **restaurar** registros eliminados
- [ ] Crear vista de **papelera** para administradores
- [ ] Implementar **eliminación física** después de X días
- [ ] Agregar **logs de auditoría** para rastrear cambios

---

## ⚠️ Errores Conocidos

Si ves errores de TypeScript como:
```
La propiedad 'isDeleted' no existe en el tipo...
```

**Solución**: Regenera Prisma Client siguiendo los pasos de arriba.
