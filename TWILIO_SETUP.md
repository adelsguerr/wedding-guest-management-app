# 📱 Configuración de WhatsApp con Twilio

## 1. Crear Cuenta en Twilio

1. Ve a [https://www.twilio.com/try-twilio](https://www.twilio.com/try-twilio)
2. Regístrate con tu email
3. Verifica tu cuenta

## 2. Obtener Credenciales

### Account SID y Auth Token
1. En el dashboard de Twilio: [https://console.twilio.com](https://console.twilio.com)
2. Copia el **Account SID** (comienza con "AC")
3. Copia el **Auth Token** (haz clic en "show" para verlo)

### Configurar WhatsApp Sandbox (Modo Prueba)

1. Ve a **Messaging** > **Try it out** > **Send a WhatsApp message**
2. Sigue las instrucciones para unir tu WhatsApp personal al sandbox
3. Envía el mensaje que te indican desde tu WhatsApp a: `+1 415 523 8886`
   - Ejemplo: `join <tu-codigo-unico>`
4. Copia el número del sandbox: `whatsapp:+14155238886`

## 3. Configurar Variables de Entorno

Edita tu archivo `.env` (o crea uno si no existe):

\`\`\`env
# Twilio WhatsApp API
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# URL de tu app
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

## 4. Reiniciar el Servidor

Después de configurar las variables:

\`\`\`bash
# Detener el servidor (Ctrl+C)
# Iniciar de nuevo
npm run dev
\`\`\`

## 5. Probar el Envío

1. Inicia sesión en tu app
2. Ve a **WhatsApp** en el menú
3. Haz clic en "Enviar Invitaciones a Todas las Familias"
4. Verifica que lleguen los mensajes a los números registrados

## 📌 Notas Importantes

### Modo Sandbox (Desarrollo)
- ✅ Gratis e ilimitado
- ⚠️ Solo funciona con números que se hayan unido al sandbox
- ⚠️ Los mensajes incluyen "Sent from your Twilio trial account"

### Modo Producción
Para usar en producción necesitas:
1. **Verificar tu número de WhatsApp Business**
   - Costo: ~$15-25 USD mensuales
   - Proceso: 1-2 semanas de aprobación
2. **Enviar plantillas pre-aprobadas**
   - Twilio debe aprobar tus mensajes
   - No puedes enviar texto libre

### Límites del Trial Account
- 500 SMS/WhatsApp gratis
- Solo puedes enviar a números verificados
- Para producción necesitas agregar saldo

## 🔧 Solución de Problemas

### Error: "Account SID must start with AC"
- Verifica que copiaste correctamente el Account SID

### Error: "Authentication failed"
- Revisa que el Auth Token sea correcto
- Asegúrate de no tener espacios extras

### Los mensajes no llegan
1. Verifica que el número esté en formato internacional: `+52XXXXXXXXXX`
2. Asegúrate de que el número se haya unido al sandbox
3. Revisa los logs en Twilio Console > Monitor > Logs

### Error: "The 'To' phone number is not verified"
- En modo sandbox, cada número debe unirse primero
- Envía `join <codigo>` desde cada WhatsApp

## 📚 Recursos

- [Documentación Twilio WhatsApp](https://www.twilio.com/docs/whatsapp)
- [Console Twilio](https://console.twilio.com)
- [Precios WhatsApp](https://www.twilio.com/whatsapp/pricing)
