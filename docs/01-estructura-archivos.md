# Estructura de Archivos

## En la Raspberry Pi

```
/home/ppc/
├── FirmUploader/                 ← App principal (Node.js)
│   ├── server.js                 ← Servidor Express con todas las rutas
│   ├── config.js                 ← Configuración centralizada
│   ├── package.json              ← Dependencias Node.js
│   │
│   ├── lib/
│   │   ├── ejecutor.js           ← Spawnea bash scripts y captura salida
│   │   └── logger.js             ← Escribe registros en CSV
│   │
│   ├── public/
│   │   ├── index.html            ← Interfaz principal (cargar/grabar firm)
│   │   └── verdatos.html         ← Visualizador de CSV
│   │
│   ├── scripts/
│   │   ├── grabofirmattiny.bash   ← Graba ATtiny85 con avrdude
│   │   └── grabofirmeimagen.bash  ← Graba ESP8266 con arduino-cli + esptool
│   │
│   ├── uploads/
│   │   ├── firms/                ← Firmwares subidos (.hex, .bin)
│   │   ├── imagenes/             ← Imágenes de FS (.bin, .spiffs, .littlefs)
│   │   ├── scripts/              ← Scripts bash subidos por usuario
│   │   └── csvs/                 ← Historial de grabaciones
│   │
│   ├── logs/progreso/            ← Logs temporales de ejecución (polling)
│   ├── avrdude.conf              ← Config custom para programmer GPIO
│   └── firmuploader.service      ← Archivo de servicio systemd
│
├── ScriptsPython/                ← Scripts auxiliares para GPIO
│   ├── entroEnProgramacion2.py   ← Pone el ESP en modo flash (GPIO17 + Reset)
│   └── reseteo.py                ← Resetea el ESP (solo Reset)
│
└── .bashrc                       ← PATH extendido con ~/bin y ~/.local/bin
```

## En la PC local (Windows)

```
C:\Users\mvighi\Documents\pruebadeia\
├── index.html                ← Frontend (copia local)
├── verdatos.html             ← Visualizador (copia local)
├── grabofirmattiny.bash      ← Script ATtiny85 original
├── grabofirmeimagen.bash     ← Script ESP8266 original
├── entroEnProgramacion2.py   ← Script Python GPIO
├── reseteo.py                ← Script Python reset
├── firmuploader.service      ← Systemd service
├── aclaraciones.txt          ← Notas de hardware originales
├── partewewaclaraciones.txt  ← Descripción del proyecto
│
└── docs/                     ← Esta documentación
    ├── 00-resumen-ejecutivo.md
    ├── 01-estructura-archivos.md
    ├── 02-api-endpoints.md
    ├── 03-hardware-pinout.md
    ├── 04-diagrama-flujo.md
    ├── 05-instalacion.md
    └── 06-seguridad.md

C:\Users\mvighi\.config\opencode\opencode.jsonc  ← Config MCP SSH
```
