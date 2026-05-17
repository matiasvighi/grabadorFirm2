# Pinout - Conexión GPIO

El sistema usa los mismos pines GPIO del Raspberry para ambos microcontroladores.

## Diagrama de conexión

```mermaid
graph LR
    subgraph RPi["Raspberry Pi (BCM)"]
        direction LR
        P18[("GPIO18<br/>Pin 12")]
        P17[("GPIO17<br/>Pin 11")]
        P14[("GPIO14 - TX<br/>Pin 8")]
        P15[("GPIO15 - RX<br/>Pin 10")]
        GND[("GND")]
        VCC[("3.3V")]
    end

    subgraph ESP["ESP8266 (NodeMCU)"]
        RST_ESP["RESET"]
        GPIO0["GPIO0"]
        RX_ESP["RX"]
        TX_ESP["TX"]
        GND_ESP["GND"]
        VIN_ESP["VCC"]
    end

    subgraph ATTINY["ATtiny85"]
        RST_AT["RESET"]
        SCK["SCK"]
        SDO["SDO (MISO)"]
        SDI["SDI (MOSI)"]
        GND_AT["GND"]
        VCC_AT["VCC"]
    end

    P18 --- RST_ESP
    P18 --- RST_AT

    P17 --- GPIO0
    P17 --- SCK

    P14 --- RX_ESP
    P14 --- SDO

    P15 --- TX_ESP
    P15 --- SDI

    GND --- GND_ESP
    GND --- GND_AT

    VCC --- VIN_ESP
    VCC --- VCC_AT
```

## Mapa de pines (tabla)

| GPIO | Función ESP8266 | Función ATtiny85 | Pin físico RPi |
|---|---|---|---|
| GPIO18 | Reset | Reset | Pin 12 |
| GPIO17 | GPIO0 (modo flash) | SCK | Pin 11 |
| GPIO14 (TXD) | RX | SDO (MISO) | Pin 8 |
| GPIO15 (RXD) | TX | SDI (MOSI) | Pin 10 |
| GND | GND | GND | Pines 6, 14, 39 |
| 3.3V | VCC | VCC | Pines 1, 17 |

## Diagrama de tiempos para entrar en modo programación (ESP8266)

```mermaid
sequenceDiagram
    participant PY as entroEnProgramacion2.py
    participant GPIO17 as GPIO17 (GPIO0)
    participant GPIO18 as GPIO18 (RST)

    PY->>GPIO17: HIGH (estado inicial)
    PY->>GPIO18: HIGH (estado inicial)
    PY->>GPIO17: LOW
    Note over GPIO17: GPIO0 = LOW
    PY->>GPIO18: LOW
    Note over GPIO18: Reset activado
    PY->>GPIO18: HIGH
    Note over GPIO18: Reset liberado - ESP8266<br/>arranca en modo flash
    PY->>GPIO17: HIGH
    Note over GPIO17: GPIO0 liberado
```

## Notas
- La UART serie en `/dev/ttyAMA0` se usa para comunicación con el ESP8266
- El ATtiny85 se programa por ISP (bitbanging GPIO) a través de avrdude
- El cable es el mismo para ambos MCUs
