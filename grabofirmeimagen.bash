#!/bin/bash


echo "Este es el script común para grabar firmware E imágen"
echo " ....  "


# Verificar que se hayan proporcionado los 2 parámetros necesarios
if [ "$#" -ne 2 ]; then
    echo "Error: Debes proporcionar exactamente 2 parametros."
    echo "Uso: $0  <firm> <imagen>"
    exit 1
fi

# Asignar los parámetros a variables
firm="$1"
imagen="$2"

# Imprimir los parámetros en la consola
echo "Parámetros recibidos:"

echo "1. firm: $firm"
echo "2. imagen: $imagen"

#Entro en modo programación

python3 /home/lab/ScriptsPython/entroEnProgramacion2.py

echo "entré en modo flash"

#Grabo el firmware
#/home/lab/bin/arduino-cli core install esp8266:esp8266  #esto está por que hice lio con spawn y las variables de entorno, si usas exec anda todo de una

/home/lab/bin/arduino-cli  upload -p /dev/ttyAMA0  --fqbn esp8266:esp8266:nodemcuv2 --input-file $firm

# 2>&1 | grep --line-buffered -o -E '[0-9]+%'

echo "grabé el firm"

#Entro en modo programación denuevo (por algún motivo se tilda aveces)

python3 /home/lab/ScriptsPython/entroEnProgramacion2.py




#Grabo la imágen de flash

sudo esptool  --port /dev/ttyAMA0 write_flash 0x200000 $imagen

echo "grabé la flash"


#Reseteo para volver al uso normal.

python3 /home/lab/ScriptsPython/reseteo.py


echo "Ha finalizado el script"






