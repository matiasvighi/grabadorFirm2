# Seguridad

## ⚠️ ADVERTENCIA IMPORTANTE

La aplicación permite **subir y ejecutar scripts bash arbitrarios**.
Esto significa que cualquiera que acceda a la web puede ejecutar
cualquier comando en la Raspberry Pi.

**NUNCA EXPONGAS ESTA PÁGINA EN INTERNET.**

## Riesgos

1. **Ejecución remota de código sin restricciones**
   - Un atacante puede subir un script malicioso y tomar control de la RPi
   - Puede acceder a toda la red local

2. **Sin autenticación**
   - La web no tiene login ni contraseña
   - Cualquiera en la red local puede acceder

3. **Acceso GPIO y serial**
   - El usuario ppc tiene acceso a GPIO, I2C, SPI y UART
   - Un atacante podría dañar hardware conectado

## Medidas recomendadas

### Mínimas
- No publicar la página en internet
- Usar solo en red local de confianza
- Firewall en la RPi bloqueando puertos externos

### Deseables
- Agregar autenticación HTTP básica (express middleware)
- Usar HTTPS con certificado self-signed
- Limitar IPs permitidas (iptables/ufw)

### A futuro
- Reemplazar CSV por base de datos SQLite
- Agregar logs de auditoría de accesos
- Firmado digital de firmwares
