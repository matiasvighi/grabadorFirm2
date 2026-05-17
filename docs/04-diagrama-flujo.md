# Diagrama de Flujo

## Grabación ESP8266

```
Usuario en la web
      │
      ├── Sube firmware (.bin) a /upload/firms
      ├── Sube imagen FS (.bin) a /upload/imagenes
      └── Opcional: sube script custom a /upload/scripts
      
      Luego:
      ┌── POST /subirTodo { firm, imagen, script }
      │
      ▼
Backend Node.js (server.js)
      │
      ├── Busca script a ejecutar
      │   (custom o grabofirmeimagen.bash)
      │
      ├── Spawnea: bash script.bash firm.bin imagen.bin
      │
      ▼
grabofirmeimagen.bash
      │
      ├── Paso 1: entroEnProgramacion2.py
      │   ├── GPIO17 → LOW (GPIO0)
      │   ├── GPIO18 → LOW → HIGH (pulso Reset)
      │   └── GPIO17 → HIGH (suelta GPIO0)
      │
      ├── Paso 2: arduino-cli upload --input-file firm.bin
      │   └── Graba firmware por /dev/ttyAMA0
      │
      ├── Paso 3: entroEnProgramacion2.py (de nuevo)
      │
      ├── Paso 4: esptool write_flash 0x200000 imagen.bin
      │   └── Graba filesystem por /dev/ttyAMA0
      │
      └── Paso 5: reseteo.py
          └── GPIO18 → LOW → HIGH (pulso Reset)
      
      │
      ▼
Backend escribe CSV con resultado
      │
      ▼
Frontend muestra log en vivo (polling /progreso)
```

## Grabación ATtiny85

```
POST /subirTodo { firm: "firm.hex", imagen: ..., script: "..." }
      │
      ▼
grabofirmattiny.bash (cuando script seleccionado)
      │
      ├── Paso 1: avrdude -v -c raspberry_pi_gpio -p t85
      │   └── Verifica firma del dispositivo
      │
      └── Paso 2: avrdude -U flash:w:firm.hex
          └── Graba firmware por GPIO bitbanging
```
