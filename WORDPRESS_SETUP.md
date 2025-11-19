# 🌐 Guía de Integración WordPress + Hostinger

## 📋 Resumen

Esta guía te ayudará a integrar tu página de invitación de WordPress con el sistema de RSVP de Next.js usando un iframe.

## 🎯 ¿Cómo funciona?

1. **WhatsApp** envía: `https://tudominio.com/invitacion?code=ABC12345`
2. **WordPress** (diseño bonito) muestra tu invitación
3. **Iframe** embebe el RSVP desde Next.js: `https://rsvp.tudominio.com/rsvp/embed?code=ABC12345`
4. Usuario confirma y ve página de agradecimiento

---

## 🚀 Paso 1: Configurar tu App Next.js

### 1.1 Configurar Variables de Entorno

Edita tu archivo `.env`:

```env
# URL pública de tu app Next.js (Vercel o Hostinger)
NEXT_PUBLIC_APP_URL=https://amatweddings.com
```

### 1.2 Desplegar en Vercel

1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Despliega la aplicación
4. Vercel te dará una URL: `https://tu-app.vercel.app`

### 1.3 Configurar en el Panel de Administración

1. Ve a **Configuración** (`/settings`)
2. En la sección "Integración con WordPress":
   - **URL de WordPress**: `https://rebeca-adelso.amatweddings.com`
   - **Habilitar Modo Embed**: ✅ Activado
3. Copia el código HTML que aparece

---

## 🏠 Paso 2: Configurar Hostinger + WordPress

### 2.1 Crear Página en WordPress

1. Entra a tu panel de WordPress en Hostinger
2. Crea el subdominio `rebeca-adelso.amatweddings.com` e instala WordPress ahí
3. Ve a **Páginas** > **Añadir nueva**
4. Título: "Invitación de Boda" (puedes usar la página de inicio)

### 2.2 Diseñar con Elementor

1. Clic en **Editar con Elementor**
2. Diseña tu invitación como quieras:
   - Agrega imágenes de la pareja
   - Información de la boda
   - Decoraciones y colores personalizados
3. Deja espacio para el formulario RSVP

### 2.3 Agregar Widget HTML

1. Arrastra el widget **HTML** de Elementor
2. Pega el siguiente código:

```html
<div id="rsvp-container" style="width: 100%; max-width: 800px; margin: 0 auto;">
  <iframe 
    id="rsvp-frame"
    src="" 
    width="100%" 
    height="900px" 
    frameborder="0"
    style="border: none; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
  </iframe>
</div>

<script>
  // Obtener código de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  
  // Configurar iframe con tu URL de Vercel
  const iframe = document.getElementById('rsvp-frame');
  
  if (code) {
    // Tu URL de producción en Vercel o Hostinger
    iframe.src = 'https://amatweddings.com/rsvp/embed?code=' + code;
  } else {
    iframe.innerHTML = '<div style="padding: 40px; text-align: center; color: #666;"><p>⚠️ Código de invitación no válido</p></div>';
  }
</script>
```

**🔴 IMPORTANTE:** La URL `https://amatweddings.com` ya está configurada. Asegúrate de desplegar en Vercel con ese dominio personalizado.

### 2.4 Publicar

1. Guarda los cambios
2. Publica la página
3. Tu URL será: `https://rebeca-adelso.amatweddings.com`

---

## 📱 Paso 3: Configurar Mensajes de WhatsApp

### 3.1 En el Panel de Administración

1. Ve a **WhatsApp** (`/notifications`)
2. Verás dos campos editables:
   - **URL de Invitación**: Pon tu URL de WordPress
   - **Mensaje**: Personaliza el texto

### 3.2 Mensaje Sugerido

```
¡Hola {familia}! 💒✨

Es momento de confirmar tu asistencia a nuestra boda.

👥 Tu familia tiene {cupos} {invitaciones}.

Por favor confirma aquí:
{enlace}

¡Esperamos contar contigo! 💕

Rebeca & Adelso
```

Los placeholders `{familia}`, `{cupos}`, `{invitaciones}` y `{enlace}` se reemplazan automáticamente.

---

## 🧪 Paso 4: Probar el Sistema

### 4.1 Obtener Código de Prueba

1. Ve a **Familias** en tu panel
2. Crea una familia de prueba con tu número de WhatsApp
3. Anota el código único generado (ej: `ABC12345`)

### 4.2 Probar en el Navegador

Abre en tu navegador:
```
https://rebeca-adelso.amatweddings.com?code=ABC12345
```

Deberías ver:
- Tu diseño de WordPress
- El formulario RSVP embebido funcionando

### 4.3 Probar el Flujo Completo

1. Envía un mensaje de WhatsApp de prueba
2. Haz clic en el enlace
3. Confirma la asistencia
4. Verifica que llegue a la página de agradecimiento

---

## ⚙️ Configuración Avanzada

### Ajustar Altura del Iframe

Si el contenido se corta o sobra espacio:

```html
<iframe 
  height="1200px"  <!-- Cambia este valor -->
  ...
>
```

### Ocultar Header/Footer de WordPress

Si quieres que solo se vea tu diseño sin menú:

1. En Elementor, activa "Canvas" como template
2. Esto elimina header y footer de WordPress

### Dominio Personalizado

✅ **Ya configurado**: Estás usando `rebeca-adelso.amatweddings.com` como subdominio.

En Hostinger:
1. Panel → **Dominios** → **Subdominios**
2. Crear: `rebeca-adelso`
3. Instalar WordPress en ese subdominio
4. Configurar Elementor y diseñar tu invitación

---

## 🔒 Seguridad

### Permitir Iframe desde WordPress

El sistema ya está configurado para permitir iframes. Si tienes problemas:

1. Verifica que la URL en el iframe sea HTTPS
2. Asegúrate de que ambos dominios tengan SSL activo
3. Revisa la consola del navegador para errores

---

## 📊 Verificar Confirmaciones

Para ver quién ha confirmado:

1. Ve a **Dashboard** en tu panel
2. Verás estadísticas en tiempo real
3. Ve a **Invitados** para ver la lista completa

---

## 🆘 Problemas Comunes

### El iframe no carga

- ✅ Verifica que la URL de Vercel esté correcta
- ✅ Asegúrate de que el código esté en la URL: `?code=ABC123`
- ✅ Revisa la consola del navegador (F12)

### El código no funciona

- ✅ Verifica que la familia tenga un código asignado
- ✅ El código es sensible a mayúsculas/minúsculas

### Los cambios no se ven

- ✅ Limpia caché del navegador (Ctrl + F5)
- ✅ Limpia caché de WordPress (si usas plugins de caché)
- ✅ Limpia caché de Hostinger

---

## 🎨 Personalización del Diseño

El diseño del RSVP embebido es minimalista a propósito para que combine con cualquier diseño de WordPress.

Si quieres personalizarlo más:
1. Los colores principales son rosa-púrpura (tema de boda)
2. Puedes ajustar el CSS en el código del iframe
3. O modificar directamente en el código fuente de Next.js

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en Vercel
2. Revisa la consola del navegador
3. Verifica que PostgreSQL esté corriendo
4. Consulta la documentación de Twilio

---

## ✅ Checklist Final

Antes de enviar invitaciones masivas, verifica:

- [ ] Base de datos funcionando
- [ ] App desplegada en Vercel
- [ ] Variables de entorno configuradas
- [ ] Página de WordPress publicada
- [ ] Iframe funcionando correctamente
- [ ] Twilio configurado y probado
- [ ] Mensaje de WhatsApp personalizado
- [ ] Prueba completa con tu número
- [ ] Todas las familias tienen código único

---

## 🎉 ¡Listo!

Tu sistema está completo y listo para usar. Los invitados recibirán un enlace hermoso que abre tu diseño de WordPress con el formulario RSVP integrado perfectamente.

**¡Felicidades y disfruten su boda!** 💍✨
