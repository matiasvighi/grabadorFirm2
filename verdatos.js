const ICONO = {
  archivo: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  error: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  alerta: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  bandeja: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  reloj: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
};

async function cargarCSVs() {
  try {
    const response = await fetch('/listado/csvs');
    const csvs = await response.json();
    const contenedor = document.getElementById('contenedorCSVs');
    contenedor.innerHTML = '';
    if (csvs.length === 0) {
      contenedor.innerHTML = '<div class="sin-datos">' + ICONO.bandeja + ' No hay archivos CSV disponibles</div>';
      return;
    }
    for (const csv of csvs) {
      await mostrarCSV(csv, contenedor);
    }
  } catch (error) {
    console.error('Error cargando CSVs:', error);
    document.getElementById('contenedorCSVs').innerHTML = '<div class="sin-datos">' + ICONO.error + ' Error al cargar los archivos CSV</div>';
  }
}

async function mostrarCSV(nombreArchivo, contenedor) {
  try {
    const response = await fetch(`/csv/${nombreArchivo}`);
    const texto = await response.text();
    const lineas = texto.trim().split('\n');
    if (lineas.length === 0) return;
    const encabezados = lineas[0].split(';');
    const datos = lineas.slice(1).map(linea => linea.split(';'));

    const divCSV = document.createElement('div');
    divCSV.className = 'contenedor-csv';

    const titulo = document.createElement('div');
    titulo.className = 'nombre-csv';
    titulo.innerHTML = ICONO.archivo + ' ' + nombreArchivo + ' <span style="font-size:12px; font-weight:normal;">(' + datos.length + ' registros)</span>';
    divCSV.appendChild(titulo);

    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'tabla-scroll';

    const tabla = document.createElement('table');
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    for (let encabezado of encabezados) {
      const th = document.createElement('th');
      th.textContent = encabezado.trim();
      trHead.appendChild(th);
    }
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    for (let fila of datos) {
      const tr = document.createElement('tr');
      for (let celda of fila) {
        const td = document.createElement('td');
        let contenido = celda.trim();
        if (encabezados[tr.cells?.length] === 'Timestamp_Grabado' && !isNaN(parseInt(contenido)) && contenido.length > 5) {
          const fecha = new Date(parseInt(contenido) * 1000);
          if (!isNaN(fecha.getTime())) {
            contenido = `${contenido}<br><small>${fecha.toLocaleString('es-AR')}</small>`;
          }
        }
        td.innerHTML = contenido;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    tabla.appendChild(tbody);

    scrollDiv.appendChild(tabla);
    divCSV.appendChild(scrollDiv);
    contenedor.appendChild(divCSV);
  } catch (error) {
    console.error(`Error cargando ${nombreArchivo}:`, error);
    const divError = document.createElement('div');
    divError.className = 'contenedor-csv';
    divError.innerHTML = '<div class="nombre-csv">' + ICONO.alerta + ' ' + nombreArchivo + '</div><div class="sin-datos">No se pudo cargar este archivo</div>';
    contenedor.appendChild(divError);
  }
}

function recargar() {
  document.getElementById('contenedorCSVs').innerHTML = '<div style="text-align:center; padding:40px;">' + ICONO.reloj + ' Cargando...</div>';
  cargarCSVs();
}

function descargarCSV() {
  window.location.href = '/descargar';
}

function volverAlGestor() {
  window.location.href = '/';
}

window.addEventListener('DOMContentLoaded', cargarCSVs);
