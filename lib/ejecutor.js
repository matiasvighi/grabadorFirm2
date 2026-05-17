const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const config = require('../config');

function ejecutarScript(scriptPath, firmPath, imagenPath, logId) {
  return new Promise((resolve, reject) => {
    const logFile = path.join(config.logsDir, `${logId}.log`);
    const stream = fs.createWriteStream(logFile, { flags: 'w' });

    const args = [scriptPath, firmPath];
    if (imagenPath) args.push(imagenPath);

    const proc = spawn('bash', args, {
      cwd: config.bashScriptsDir,
      env: { ...process.env, PATH: process.env.PATH },
    });

    const escribir = (data) => {
      const texto = data.toString();
      stream.write(texto);
      process.stdout.write(`[${logId}] ${texto}`);
    };

    proc.stdout.on('data', escribir);
    proc.stderr.on('data', escribir);

    proc.on('close', (code) => {
      stream.end();
      const mensaje = code === 0
        ? '\n✅ Proceso completado con éxito.\n'
        : `\n❌ Proceso finalizado con código de error: ${code}\n`;
      fs.appendFileSync(logFile, mensaje);
      resolve({ code, logFile });
    });

    proc.on('error', (err) => {
      stream.end();
      fs.appendFileSync(logFile, `\n❌ Error al ejecutar el proceso: ${err.message}\n`);
      reject(err);
    });
  });
}

function leerLog(logId) {
  const logFile = path.join(config.logsDir, `${logId}.log`);
  try {
    return fs.readFileSync(logFile, 'utf8');
  } catch {
    return '⏳ (esperando que el proceso inicie...)';
  }
}

module.exports = { ejecutarScript, leerLog };
