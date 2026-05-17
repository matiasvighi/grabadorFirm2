# Pinout - Conexión GPIO

El sistema usa los mismos pines GPIO del Raspberry para ambos microcontroladores.

## Mapa de pines

| GPIO | Función ESP8266 | Función ATtiny85 | Pin físico |
|---|---|---|---|
| GPIO18 | Reset | Reset | Pin 12 |
| GPIO17 | GPIO0 (modo flash) | SCK | Pin 11 |
| GPIO14 | TX | SDO (MISO) | Pin 8 |
| GPIO15 | RX | SDI (MOSI) | Pin 10 |
| GND | GND | GND | Pin 6, 14, etc. |
| 3.3V | VCC | VCC | Pin 1, 17 |

## Diagrama simplificado

```
Raspberry Pi            ESP8266 / ATtiny85
───────────            ─────────────────
 GPIO18 ────────────── RESET
 GPIO17 ────────────── GPIO0 / SCK
 GPIO14 (TX) ───────── RX / SDO
 GPIO15 (RX) ───────── TX / SDI
 GND     ───────────── GND
 3.3V    ───────────── VCC
```

## Notas
- La UART serie en `/dev/ttyAMA0` se usa para comunicación con el ESP8266
- El ATtiny85 se programa por ISP (bitbanging GPIO) a través de avrdude
- El cable es el mismo para ambos MCUs
