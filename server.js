const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const crypto = require('crypto');
const config = require('./config');
const { ejecutarScript, leerLog } = require('./lib/ejecutor');
const { escribirRegistro } = require('./lib/logger');

const app = express();
app.use(express.json());
app.use(express.static(config.publicDir));

const procesosActivos = {};
let ultimoLog = null;

function crearUpload(subdir) {
  return multer({
    dest: path.join(config.uploadsDir, subdir),
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, path.join(config.uploadsDir, subdir)),
      filename: (req, file, cb) => cb(null, file.originalname),
    }),
  });
}

app.post('/upload/firms', crearUpload('firms').single('file'), (req, res) => {
  res.json({ ok: true, archivo: req.file?.originalname });
});

app.post('/upload/imagenes', crearUpload('imagenes').single('file'), (req, res) => {
  res.json({ ok: true, archivo: req.file?.originalname });
});

app.post('/upload/scripts', crearUpload('scripts').single('file'), (req, res) => {
  res.json({ ok: true, archivo: req.file?.originalname });
});

function listarArchivos(dir) {
  try {
    return fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isFile());
  } catch {
    return [];
  }
}

app.get('/listado/firms', (req, res) => res.json(listarArchivos(config.firmsDir)));
app.get('/listado/imagenes', (req, res) => res.json(listarArchivos(config.imagenesDir)));
app.get('/listado/scripts', (req, res) => res.json(listarArchivos(config.scriptsUploadDir)));
app.get('/listado/csvs', (req, res) => res.json(listarArchivos(config.csvsDir)));

app.post('/subirTodo', async (req, res) => {
  const { firm, imagen, script } = req.body;
  if (!firm) {
    return res.status(400).json({ error: 'Falta el parámetro "firm"' });
  }

  const firmPath = path.join(config.firmsDir, path.basename(firm));
  if (!fs.existsSync(firmPath)) {
    return res.status(400).json({ error: `El archivo "${firm}" no existe en firms/` });
  }

  let imagenPath = null;
  if (imagen) {
    imagenPath = path.join(config.imagenesDir, path.basename(imagen));
    if (!fs.existsSync(imagenPath)) {
      return res.status(400).json({ error: `El archivo "${imagen}" no existe en imagenes/` });
    }
  }

  let scriptPath;
  if (script) {
    scriptPath = path.join(config.scriptsUploadDir, path.basename(script));
    if (!fs.existsSync(scriptPath)) {
      return res.status(400).json({ error: `El archivo "${script}" no existe en scripts/` });
    }
  } else {
    scriptPath = path.join(config.bashScriptsDir, 'grabofirmeimagen.bash');
  }

  const logId = crypto.randomBytes(8).toString('hex');
  procesosActivos[logId] = true;

  res.json({ ok: true, logId });

  try {
    const { code } = await ejecutarScript(scriptPath, firmPath, imagenPath, logId);
    const resultado = code === 0 ? 'éxito' : 'error';
    escribirRegistro({ firm, imagen, script, resultado });
  } catch (err) {
    console.error('Error en ejecución:', err.message);
    escribirRegistro({ firm, imagen, script, resultado: 'error_al_ejecutar' });
  } finally {
    ultimoLog = leerLog(logId);
    delete procesosActivos[logId];
  }
});

app.get('/progreso', (req, res) => {
  const logId = Object.keys(procesosActivos)[0];
  if (logId) {
    return res.send(leerLog(logId));
  }
  if (ultimoLog) {
    return res.send(ultimoLog);
  }
  res.send('⏳ Sin actividad.');
});

app.get('/csv/:nombre', (req, res) => {
  const ruta = path.join(config.csvsDir, path.basename(req.params.nombre));
  if (!fs.existsSync(ruta)) return res.status(404).send('Archivo no encontrado');
  res.sendFile(ruta);
});

app.get('/descargar', (req, res) => {
  const archivo = path.join(config.logsDir, 'descarga.zip');
  const output = fs.createWriteStream(archivo);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => res.download(archivo));
  archive.on('error', (err) => { throw err; });
  archive.pipe(output);

  archive.directory(config.firmsDir, 'firms');
  archive.directory(config.imagenesDir, 'imagenes');
  archive.directory(config.scriptsUploadDir, 'scripts');
  archive.directory(config.csvsDir, 'csvs');
  archive.finalize();
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`FirmUploader corriendo en http://0.0.0.0:${config.port}`);
});
