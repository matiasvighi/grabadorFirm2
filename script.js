const ICONO = {
  reloj: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  error: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  alerta: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
};

let intervaloLog = null;

async function cargarCombos() {
  const cargar = async (ruta, id) => {
    try {
      const datos = await fetch(ruta).then(res => res.json());
      const combo = document.getElementById(id);
      combo.innerHTML = '';
      if (datos.length === 0) {
        const opt = document.createElement('option');
        opt.text = '— sin archivos —';
        combo.add(opt);
      } else {
        datos.forEach(el => {
          const opt = document.createElement('option');
          opt.text = el;
          combo.add(opt);
        });
      }
    } catch (e) {
      console.error('Error cargando ' + ruta, e);
    }
  };
  await cargar('/listado/firms', 'comboFirm');
  await cargar('/listado/imagenes', 'comboImagen');
  await cargar('/listado/scripts', 'comboScript');
}

async function subirArchivo(inputId, ruta, comboId) {
  const input = document.getElementById(inputId);
  const archivo = input.files[0];
  if (!archivo) {
    alert('Seleccioná un archivo primero.');
    return;
  }
  const formData = new FormData();
  formData.append('file', archivo);
  try {
    const resp = await fetch(ruta, { method: 'POST', body: formData });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    input.value = '';
    await cargarCombos();
  } catch (e) {
    alert('Error al subir archivo: ' + e.message);
  }
}

function subirTodo() {
  const firm = document.getElementById('comboFirm').value;
  const imagen = document.getElementById('comboImagen').value;
  const script = document.getElementById('comboScript').value;

  if (!firm || firm === '— sin archivos —') {
    alert('No hay ningún firm seleccionado o disponible.');
    return;
  }
  const modal = document.getElementById('progresoModal');
  const textoPre = document.getElementById('resultadoTexto');
  textoPre.innerHTML = 'Conectando con el servidor...\n';
  modal.style.display = 'block';

  if (intervaloLog) clearInterval(intervaloLog);

  const boton = document.querySelector('.boton-grande[onclick="subirTodo()"]');
  if (boton) { boton.disabled = true; boton.classList.add('cargando'); }

  const normalizar = (v) => v && v !== '— sin archivos —' ? v : null;
  fetch('/subirTodo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firm, imagen: normalizar(imagen), script: normalizar(script) })
  })
  .then(response => {
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    intervaloLog = setInterval(cargarLog, 1000);
    setTimeout(() => {
      if (intervaloLog) {
        clearInterval(intervaloLog);
        intervaloLog = null;
        const textoArea = document.getElementById('resultadoTexto');
        textoArea.innerHTML += '\n\nTiempo de espera agotado. El proceso podría seguir ejecutándose en segundo plano.';
      }
    }, 120000);
  })
  .catch(error => {
    console.error('Error en subirTodo:', error);
    document.getElementById('resultadoTexto').innerHTML = 'Error al iniciar la subida: ' + error.message;
  })
  .finally(() => {
    if (boton) { boton.disabled = false; boton.classList.remove('cargando'); }
  });
}

function cargarLog() {
  fetch('/progreso')
    .then(res => {
      if (!res.ok) throw new Error('No se pudo obtener progreso');
      return res.text();
    })
    .then(data => {
      const lineas = data.split(/\r?\n/);
      const lineasProcesadas = [];
      for (let linea of lineas) {
        if (linea.includes('\r')) {
          const partes = linea.split('\r');
          if (lineasProcesadas.length > 0) lineasProcesadas.pop();
          lineasProcesadas.push(partes[partes.length - 1]);
        } else {
          lineasProcesadas.push(linea);
        }
      }
      const textoCompleto = lineasProcesadas.join('\n');
      const textoElemento = document.getElementById('resultadoTexto');
      textoElemento.textContent = textoCompleto;
      const modalContent = document.querySelector('.modal-contenido');
      if (modalContent) modalContent.scrollTop = modalContent.scrollHeight;
      if (textoCompleto.includes('completado') || textoCompleto.includes('finalizado') || textoCompleto.includes('error')) {
        if (intervaloLog) {
          clearInterval(intervaloLog);
          intervaloLog = null;
        }
      }
    })
    .catch(err => {
      console.warn('Error cargando progreso:', err);
      const textoElem = document.getElementById('resultadoTexto');
      if (textoElem && !textoElem.textContent.includes('(esperando datos)')) {
        textoElem.innerHTML += '\n(esperando actualización del servidor...)';
      }
    });
}

function cerrarModal() {
  if (intervaloLog) {
    clearInterval(intervaloLog);
    intervaloLog = null;
  }
  document.getElementById('progresoModal').style.display = 'none';
}

function descargarArchivos() {
  window.location.href = '/descargar';
}

window.addEventListener('DOMContentLoaded', () => {
  cargarCombos();
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('progresoModal');
      if (modal && modal.style.display === 'block') {
        cerrarModal();
      }
    }
  });
});
