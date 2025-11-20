# 🌐 Guía Completa de Despliegue: Hostinger + Vercel

## 📋 Resumen de la Arquitectura

- **`amatweddings.com`** → Next.js en Vercel (panel admin + RSVP API)
- **`rebeca-adelso.amatweddings.com`** → WordPress en Hostinger (diseño de invitación)

---

## 🚀 PARTE 1: Desplegar Next.js en Vercel

### 1.1 Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con GitHub (usa la misma cuenta del proyecto)
3. Autoriza a Vercel acceso a tus repositorios

### 1.2 Importar Proyecto

1. En Vercel: **Add New** → **Project**
2. Busca tu repositorio: `wedding-guest-management-app`
3. Clic en **Import**

### 1.3 Configurar Variables de Entorno

En la sección **Environment Variables**, agrega:

```env
# Database (usa tu PostgreSQL de Neon, Supabase o Render)
DATABASE_URL=postgresql://user:password@host/wedding_db?sslmode=require

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Better Auth (genera una clave aleatoria)
BETTER_AUTH_SECRET=tu-clave-secreta-super-larga-y-segura

# URL de la app (por ahora deja la de Vercel, luego la actualizamos)
NEXT_PUBLIC_APP_URL=https://tu-app.vercel.app
```

**💡 Cómo generar BETTER_AUTH_SECRET:**
```bash
# En tu terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.4 Deploy

1. Clic en **Deploy**
2. Espera 2-3 minutos
3. Vercel te dará una URL temporal: `https://tu-proyecto.vercel.app`
4. Verifica que funcione abriendo la URL

---

## 🔧 PARTE 2: Configurar Dominio en Vercel

### 2.1 Agregar Dominio Personalizado

1. En tu proyecto de Vercel → **Settings** → **Domains**
2. Clic en **Add Domain**
3. Escribe: `amatweddings.com`
4. Clic en **Add**

### 2.2 Configurar DNS en Hostinger

Vercel te mostrará los registros DNS que necesitas agregar:

1. **Inicia sesión en Hostinger**
2. Ve a **Dominios** → Selecciona `amatweddings.com`
3. Clic en **DNS / Registros DNS**
4. Agrega los siguientes registros:

#### **Opción A: Con CNAME (Recomendado)**
```
Tipo: CNAME
Nombre: @
Destino: cname.vercel-dns.com.
TTL: 3600
```

```
Tipo: CNAME
Nombre: www
Destino: cname.vercel-dns.com.
TTL: 3600
```

#### **Opción B: Con A Record**
Si CNAME no funciona con `@`, usa:
```
Tipo: A
Nombre: @
Destino: 76.76.21.21
TTL: 3600
```

**⚠️ IMPORTANTE:** Borra cualquier registro A existente que apunte a la IP de Hostinger para `@` y `www`.

### 2.3 Verificar Dominio

1. En Vercel, espera 5-10 minutos
2. Vercel verificará automáticamente
3. SSL se configurará automáticamente (puede tardar hasta 24 horas)
4. Cuando veas ✅ en el dominio, está listo

### 2.4 Actualizar Variable de Entorno

1. En Vercel → **Settings** → **Environment Variables**
2. Edita `NEXT_PUBLIC_APP_URL`
3. Cambia a: `https://amatweddings.com`
4. Clic en **Save**
5. Vuelve a **Deployments** → Redeploy (usa los 3 puntos)

---

## 🏠 PARTE 3: Configurar WordPress en Hostinger

### 3.1 Crear Subdominio

1. En Hostinger → **Dominios** → **Subdominios**
2. Clic en **Crear Subdominio**
3. Nombre: `rebeca-adelso`
4. Dominio: Selecciona `amatweddings.com`
5. Ruta: Déjala por defecto o personaliza
6. Clic en **Crear**

### 3.2 Instalar WordPress

1. En el panel de Hostinger → **Website**
2. Encuentra el subdominio `rebeca-adelso.amatweddings.com`
3. Clic en **Instalar WordPress**
4. Completa los datos:
   - **Título**: Invitación de Boda - Rebeca & Adelso
   - **Usuario admin**: (tu elección)
   - **Contraseña**: (segura)
   - **Email**: tu email
5. Clic en **Instalar**

### 3.3 Instalar Elementor

1. Accede a WordPress: `https://rebeca-adelso.amatweddings.com/wp-admin`
2. Inicia sesión con tus credenciales
3. Ve a **Plugins** → **Añadir nuevo**
4. Busca: `Elementor`
5. Instala **Elementor Website Builder**
6. Activa el plugin

### 3.4 Instalar Tema (Opcional)

Para mejor compatibilidad con Elementor:
1. **Plugins** → **Añadir nuevo**
2. Busca: `Astra` o `Hello Elementor`
3. Instala y activa

### 3.5 Crear Página de Invitación

1. **Páginas** → **Añadir nueva**
2. Título: `Inicio` (o el que prefieras)
3. Clic en **Editar con Elementor**

#### **Diseño Sugerido:**

**Sección 1: Header**
- Nombres de los novios
- Fecha de la boda
- Imagen de la pareja

**Sección 2: Contador Regresivo**
- Widget de cuenta regresiva (busca en Elementor addons)

**Sección 3: Detalles**
- Ubicación
- Hora de ceremonia
- Hora de recepción
- Mapa (widget de Google Maps)

**Sección 4: RSVP (Widget HTML)**
- Aquí irá el iframe con el formulario

**Sección 5: Galería (Opcional)**
- Fotos de la pareja

**Sección 6: Código de Vestimenta**
- Descripción

---

## 🎨 PARTE 4: Integrar RSVP con Iframe

### 4.1 Obtener Código HTML

1. Accede a tu panel: `https://amatweddings.com/dashboard`
2. Ve a **Configuración** → **Integración con WordPress**
3. **URL de WordPress**: `https://rebeca-adelso.amatweddings.com`
4. Activa **Habilitar Modo Embed**
5. Copia el código HTML que aparece

### 4.2 Agregar Widget HTML en Elementor

1. En Elementor, en la sección donde quieres el formulario
2. Busca el widget **HTML**
3. Arrástralo a tu página
4. Pega el código copiado
5. Ajusta la altura si es necesario: `height="900px"`
6. Clic en **Actualizar**

### 4.3 Configurar como Página de Inicio

1. **Ajustes** → **Lectura**
2. **Tu página de inicio muestra**: Selecciona "Una página estática"
3. **Página de inicio**: Selecciona la página que creaste
4. Guardar cambios

---

## 📱 PARTE 5: Configurar WhatsApp

### 5.1 Completar Configuración en Panel

1. Ve a `https://amatweddings.com/settings`
2. Completa todos los campos:
   - **Nombre del Evento**: Boda de Rebeca & Adelso
   - **Fecha de la Boda**: [tu fecha]
   - **Fecha límite RSVP**: [tu fecha límite]
   - **Ubicación**: [tu ubicación]
3. Activa los campos opcionales si los necesitas:
   - Restricciones dietéticas
   - Necesidades especiales
4. Guarda

### 5.2 Crear Familias de Prueba

1. Ve a **Familias** → **Agregar Familia**
2. Crea 2-3 familias con tu número de WhatsApp
3. Anota los códigos generados

### 5.3 Probar Flujo Completo

Abre en tu navegador:
```
https://rebeca-adelso.amatweddings.com?code=ABC12345
```

Deberías ver:
- ✅ Diseño de WordPress
- ✅ Formulario RSVP funcionando
- ✅ Puedes confirmar asistencia
- ✅ Te redirige a página de gracias

### 5.4 Enviar WhatsApp de Prueba

1. Ve a **WhatsApp** en el panel
2. Personaliza el mensaje
3. URL de invitación: `https://rebeca-adelso.amatweddings.com`
4. Envía un mensaje de prueba
5. Verifica que llegue y funcione el enlace

---

## ✅ PARTE 6: Checklist Pre-Lanzamiento

Antes de enviar invitaciones masivas:

### Base de Datos
- [ ] PostgreSQL funcionando (Neon/Supabase)
- [ ] Migración aplicada (`prisma db push`)
- [ ] Datos de prueba creados

### Dominios
- [ ] `amatweddings.com` apuntando a Vercel (DNS configurado)
- [ ] SSL activo en `amatweddings.com` ✅
- [ ] `rebeca-adelso.amatweddings.com` funcionando
- [ ] SSL activo en subdominio ✅

### Configuración
- [ ] Variables de entorno en Vercel
- [ ] Twilio configurado y probado
- [ ] Configuración del evento completa
- [ ] URL de WordPress configurada

### WordPress
- [ ] Diseño de invitación completo
- [ ] Iframe funcionando correctamente
- [ ] Página configurada como inicio
- [ ] Responsive (se ve bien en móvil)

### Pruebas
- [ ] Flujo completo probado (WhatsApp → Invitación → RSVP → Gracias)
- [ ] Probado en diferentes navegadores
- [ ] Probado en móvil
- [ ] WhatsApp de prueba enviado y verificado

### Familias
- [ ] Todas las familias creadas
- [ ] Todos tienen código único (`inviteCode`)
- [ ] Números de WhatsApp correctos (formato: +52...)
- [ ] Cupos de invitados verificados

---

## 🆘 Solución de Problemas Comunes

### DNS no actualiza

- **Solución**: Esperar hasta 24 horas
- **Verificar**: Usa [whatsmydns.net](https://www.whatsmydns.net)
- **Limpiar caché**: `ipconfig /flushdns` (Windows) o `sudo dscacheutil -flushcache` (Mac)

### SSL no activa en Vercel

- **Causa**: DNS no propagado completamente
- **Solución**: Esperar y verificar que CNAME esté correcto
- **Forzar**: En Vercel → Domains → Renew Certificate

### Iframe no carga (X-Frame-Options)

- **Causa**: WordPress bloqueando iframe
- **Solución**: Ya configurado en el código, pero si persiste:
  1. Instalar plugin "Embed Any Document" en WordPress
  2. O agregar en `wp-config.php`: `define('ALLOW_UNFILTERED_UPLOADS', true);`

### WhatsApp no envía

- **Causa 1**: Números no unidos al sandbox
- **Solución**: Cada número debe enviar `join <codigo>` a Twilio
- **Causa 2**: Credenciales incorrectas
- **Solución**: Verificar ACCOUNT_SID y AUTH_TOKEN

### Error de Base de Datos

- **Causa**: DATABASE_URL incorrecto o DB no accesible
- **Solución**: Verificar connection string y que DB esté activa
- **Neon**: Asegúrate de agregar `?sslmode=require`

---

## 📊 Monitoreo Post-Lanzamiento

### En Vercel
- **Analytics**: Ver tráfico en tiempo real
- **Logs**: Runtime logs para errores
- **Functions**: Tiempo de ejecución de APIs

### En tu Panel
- **Dashboard**: Estadísticas de confirmaciones
- **Invitados**: Ver quién ha confirmado
- **Notificaciones**: Historial de WhatsApp enviados

---

## 🎉 ¡Listo para Producción!

Una vez completados todos los pasos, tu sistema estará listo para:

1. **Enviar invitaciones masivas** desde el panel
2. **Recibir confirmaciones** automáticamente
3. **Gestionar invitados** en tiempo real
4. **Asignar mesas** según confirmaciones

**¡Felicitaciones y disfruten su boda!** 💍✨

---

## 📞 Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs

# Redeploy desde terminal
vercel --prod

# Verificar variables de entorno
vercel env ls

# Verificar DNS
nslookup amatweddings.com
nslookup rebeca-adelso.amatweddings.com
```

---

## 🔗 Enlaces Rápidos

- **Panel Admin**: https://amatweddings.com/dashboard
- **Invitación**: https://rebeca-adelso.amatweddings.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Hostinger Panel**: https://hpanel.hostinger.com
- **Twilio Console**: https://console.twilio.com
