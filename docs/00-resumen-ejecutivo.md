# FirmWriter - Resumen Ejecutivo

## ¿Qué es?
FirmWriter es una aplicación web que corre en una Raspberry Pi y permite grabar
firmware en microcontroladores **ATtiny85** y **ESP8266** a través de una interfaz
web, usando los pines GPIO directos del Raspberry.

## Arquitectura general

```mermaid
graph TB
    subgraph Cliente["Navegador Web"]
        UI[("index.html + verdatos.html")]
    end

    subgraph RPi["Raspberry Pi"]
        subgraph Backend["Node.js (server.js)"]
            API[("Express REST API")]
            EJEC[("ejecutor.js - spawn")]
            LOGGER[("logger.js - CSV")]
        end

        subgraph Scripts["Scripts del sistema"]
            ESP[("grabofirmeimagen.bash")]
            ATTINY[("grabofirmattiny.bash")]
        end

        subgraph Python["Scripts Python GPIO"]
            MODE[("entroEnProgramacion2.py")]
            RESET[("reseteo.py")]
        end

        subgraph Tools["Herramientas de grabación"]
            AVRDUDE[("avrdude v8.0")]
            ARDUINO_CLI[("arduino-cli")]
            ESPTOOL[("esptool")]
        end

        subgraph GPIO["GPIO / UART"]
            PIN[("GPIO14-18")]
            UART[("/dev/ttyAMA0")]
        end
    end

    subgraph MCUs["Microcontroladores"]
        MCU1[("ESP8266")]
        MCU2[("ATtiny85")]
    end

    UI -->|HTTP| API
    API -->|spawn bash| EJEC
    EJEC -->|ejecuta| ESP
    EJEC -->|ejecuta| ATTINY
    ESP -->|entra en modo| MODE
    ESP -->|arduino-cli upload| ARDUINO_CLI
    ESP -->|esptool write_flash| ESPTOOL
    ESP -->|resetea| RESET
    ATTINY -->|avrdude -c raspberry_pi_gpio| AVRDUDE
    MODE -->|GPIO17, GPIO18| GPIO
    RESET -->|GPIO18| GPIO
    ARDUINO_CLI -->|UART| UART
    ESPTOOL -->|UART| UART
    AVRDUDE -->|GPIO bitbang| GPIO
    UART -->|TX/RX| MCU1
    GPIO -->|ISP| MCU2
    API -->|registra| LOGGER

## Estado final del proyecto
El proyecto fue instalado desde cero en una Raspberry Pi 4 con:
- **IP**: 192.168.0.156
- **Usuario**: ppc / pass: 1234
- **Hostname**: GrabFirmPPC
- **OS**: Debian 13 (Trixie) - 64 bits ARM

## Enlaces
- Web: http://192.168.0.156:3000/
- SSH: `ssh ppc@192.168.0.156`
