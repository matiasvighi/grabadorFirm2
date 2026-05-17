
from gpiozero import DigitalOutputDevice
from time import sleep

# Pin de reset

RST = DigitalOutputDevice(18)    # GPIO18 para RESET del ESP

# Lógica para resetea

RST.on()     # Llevar RST a LOW
sleep(0.1)
RST.off()    # Soltar RST (HIGH)

