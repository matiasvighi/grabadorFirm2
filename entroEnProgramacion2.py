import lgpio
import time

h = lgpio.gpiochip_open(0)  # Abrimos el gpiochip principal

# Configurar pines como salida
lgpio.gpio_claim_output(h, 17, 1)  # GPIO0 HIGH
lgpio.gpio_claim_output(h, 18, 1)  # RST HIGH

# Llevar GPIO0 a LOW
lgpio.gpio_write(h, 17, 0)
time.sleep(0.1)

# Pulsar reset
lgpio.gpio_write(h, 18, 0)
time.sleep(0.1)
lgpio.gpio_write(h, 18, 1)
time.sleep(0.5)

# Soltar GPIO0
lgpio.gpio_write(h, 17, 1)

# No cerramos h si querés mantener pines activos
# lgpio.gpiochip_close(h)