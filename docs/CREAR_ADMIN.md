# 🔧 Crear Usuario Admin

## Opción 1: Desde la Interfaz Web (Recomendado)

1. **Asegúrate de que el servidor esté corriendo:**
   ```bash
   npm run dev
   ```

2. **Ve a la página de registro:**
   ```
   http://localhost:3000/login
   ```

3. **Regístrate con estas credenciales:**
   - **Nombre:** Administrador
   - **Email:** admin@wedding.com
   - **Contraseña:** admin123
   - **Confirmar Contraseña:** admin123

4. **Actualizar el rol a admin manualmente en la base de datos:**
   ```sql
   UPDATE "users" SET role = 'admin' WHERE email = 'admin@wedding.com';
   ```

   O desde Prisma Studio:
   ```bash
   npx prisma studio
   ```
   - Abre el modelo `User`
   - Busca tu usuario recién creado
   - Cambia el campo `role` de `"guest"` a `"admin"`
   - Guarda los cambios

5. **Cierra sesión y vuelve a iniciar sesión** para que el nuevo rol se aplique.

---

## Opción 2: Registro Directo (Más Fácil)

Si ya creaste un usuario, simplemente:

1. **Abre Prisma Studio:**
   ```bash
   npx prisma studio
   ```

2. **Navega a la tabla `users`**

3. **Encuentra tu usuario y cambia el `role` a `"admin"`**

4. **Guarda y recarga la página**

---

## ✅ Verificar que Funciona

1. Inicia sesión en http://localhost:3000/login
2. Deberías ver tu nombre y rol en el UserMenu (esquina superior derecha)
3. El rol debería mostrar "admin"

---

## 🔐 Credenciales de Admin Sugeridas

- **Email:** admin@wedding.com
- **Contraseña:** admin123

⚠️ **IMPORTANTE:** Cambia estas credenciales en producción por seguridad.
