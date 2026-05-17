const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  user: 'ppc',
  baseDir: '/home/ppc/FirmUploader',
  scriptsDir: '/home/ppc/ScriptsPython',

  get publicDir() { return path.join(this.baseDir, 'public'); },
  get uploadsDir() { return path.join(this.baseDir, 'uploads'); },
  get firmsDir() { return path.join(this.uploadsDir, 'firms'); },
  get imagenesDir() { return path.join(this.uploadsDir, 'imagenes'); },
  get scriptsUploadDir() { return path.join(this.uploadsDir, 'scripts'); },
  get csvsDir() { return path.join(this.uploadsDir, 'csvs'); },
  get logsDir() { return path.join(this.baseDir, 'logs', 'progreso'); },
  get bashScriptsDir() { return path.join(this.baseDir, 'scripts'); },
};
