# Proceso de Instalación

## Resumen de lo que se instaló

| Componente | Método | Versión |
|---|---|---|
| Node.js | nodesource repo | v20.20.2 |
| npm dependencies | `npm install` | express, multer, archiver |
| arduino-cli | script oficial | v1.4.1 |
| ESP8266 core | `arduino-cli core install` | v3.1.2 |
| esptool | `pip3 install --user --break-system-packages` | v5.2.0 |
| avrdude | compilado desde fuente (v8.0) | v8.0 |
| Python GPIO | apt (lgpio, gpiozero) | ya instalados |

## Configuración de sistema

### Usuario
- Usuario: `ppc`
- Grupos: `ppc adm dialout cdrom sudo audio video plugdev games users input render netdev spi i2c gpio`
- `dialout` → acceso a `/dev/ttyAMA0` (UART)
- `gpio` → acceso a `/dev/gpiochip0`

### UART
Se habilitó en `/boot/firmware/config.txt`:
```
enable_uart=1
```
Requiere reboot para tomar efecto.

### Servicio systemd
```
/etc/systemd/system/firmuploader.service
→ /home/ppc/FirmUploader/firmuploader.service
```
- User: ppc
- WorkingDirectory: /home/ppc/FirmUploader
- ExecStart: /usr/bin/npm start
- Restart: always

### PATH del usuario ppc
Se agregó a `.bashrc`:
```bash
export PATH=$PATH:/home/ppc/bin:/home/ppc/.local/bin
```

## MCP SSH (opencode)

Para que la IA pueda conectarse a la RPi por SSH:

```json
{
  "mcp": {
    "ssh-pi": {
      "type": "local",
      "command": ["npx", "-y", "mcp-server-ssh"],
      "enabled": true
    }
  }
}
```

Archivo: `C:\Users\mvighi\.config\opencode\opencode.jsonc`

## Cómo reiniciar la RPi

```bash
ssh ppc@192.168.0.156
# pass: 1234
sudo reboot
```
