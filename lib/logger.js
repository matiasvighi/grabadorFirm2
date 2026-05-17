const fs = require('fs');
const path = require('path');
const config = require('../config');

function escribirRegistro({ firm, imagen, script, resultado, timestamp }) {
  const ahora = timestamp || Math.floor(Date.now() / 1000);
  const nombreArchivo = `grabacion_${new Date().toISOString().slice(0, 10)}.csv`;
  const ruta = path.join(config.csvsDir, nombreArchivo);
  const encabezado = 'Timestamp_Grabado;Firmware;Imagen;Script;Resultado\n';
  const linea = `${ahora};${firm};${imagen};${script || ''};${resultado}\n`;

  if (!fs.existsSync(ruta)) {
    fs.writeFileSync(ruta, encabezado + linea);
  } else {
    fs.appendFileSync(ruta, linea);
  }
}

module.exports = { escribirRegistro };
