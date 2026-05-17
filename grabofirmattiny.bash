#!/bin/bash

echo "========================================="
echo "Script para grabar firmware en ATtiny85"
echo "========================================="

# Verificar que se haya proporcionado el parámetro del firmware
if [ "$#" -lt 1 ]; then
    echo "Error: tenés que proporcionar al menos 1 parametro."
    echo "Uso: $0 <firmware.hex> [ignorado]"
    echo "  - firmware.hex: archivo HEX a grabar en el ATtiny85"
    echo "  - segundo parámetro (imagen): será ignorado (ATtiny no tiene FS)"
    exit 1
fi

# Asignar el primer parámetro a la variable firmware
firmware="$1"

# Verificar que el archivo HEX existe
if [ ! -f "$firmware" ]; then
    echo "Error: El archivo $firmware no existe."
    exit 1
fi

# Si hay segundo parámetro, mostrar advertencia de que se ignora
if [ "$#" -ge 2 ]; then
    imagen="$2"
    echo "Advertencia: Segundo parámetro '$imagen' será ignorado."
    echo "  (ATtiny85 no tiene sistema de archivos para imágenes)"
fi

echo ""
echo "Parámetros recibidos:"
echo "1. firmware: $firmware"
echo ""

# ============================================
# PASO 1: Corroborar la conexión con el MCU
# ============================================
echo "Paso 1: Verificando conexión con ATtiny85..."
echo "Ejecutando: sudo avrdude -C /usr/local/etc/avrdude.conf -c raspberry_pi_gpio -p t85 -B 10kHz -v"

# Ejecutar avrdude para verificar conexión y capturar la salida
conexion_output=$(sudo avrdude -C /usr/local/etc/avrdude.conf -c raspberry_pi_gpio -p t85 -B 10kHz -v 2>&1)

# Mostrar la salida completa del comando (opcional)
echo "Salida completa de verificación de conexión:"
echo "$conexion_output"
echo ""

# Verificar si la conexión fue exitosa buscando la firma del dispositivo
if echo "$conexion_output" | grep -q "Device signature = 0x"; then
    # Extraer la firma del dispositivo para mostrarla
    signature=$(echo "$conexion_output" | grep -oP 'Device signature = \K0x[0-9a-fA-F,]+')
    echo "✅ Conexión exitosa! Firma del dispositivo: $signature"
else
    echo "❌ Error: No se pudo establecer comunicación con el ATtiny85."
    echo "   Verifica las conexiones físicas y la alimentación."
    exit 1
fi

echo ""

# ============================================
# PASO 2: Grabar el firmware en la flash
# ============================================
echo "Paso 2: Grabando firmware $firmware en ATtiny85..."
echo "Ejecutando: sudo avrdude -C /usr/local/etc/avrdude.conf -c raspberry_pi_gpio -p t85 -U flash:w:$firmware"

# Ejecutar avrdude para grabar el firmware y capturar la salida
grabado_output=$(sudo avrdude -C /usr/local/etc/avrdude.conf -c raspberry_pi_gpio -p t85 -U flash:w:"$firmware" 2>&1)

# Mostrar la salida completa del comando
echo "Salida completa del grabado:"
echo "$grabado_output"
echo ""

# Verificar si el grabado fue exitoso
if echo "$grabado_output" | grep -q "avrdude done.  Thank you."; then
    echo "✅ Firmware grabado exitosamente!"
    
    # Opcional: Mostrar resumen de bytes escritos
    if echo "$grabado_output" | grep -q "bytes of flash written"; then
        bytes_written=$(echo "$grabado_output" | grep -oP '\d+ bytes of flash written')
        echo "   $bytes_written"
    fi
else
    echo "❌ Error: Falló el grabado del firmware."
    echo "   Revisa el archivo HEX y la conexión con el ATtiny."
    exit 1
fi

echo ""
echo "========================================="
echo "Proceso completado con éxito!"
echo "========================================="