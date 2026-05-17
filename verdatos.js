async function cargarCSVs() {
  try {
    const response = await fetch('/listado/csvs');
    const csvs = await response.json();
    const contenedor = document.getElementById('contenedorCSVs');
    contenedor.innerHTML = '';
    if (csvs.length === 0) {
      contenedor.innerHTML = '<div class="sin-datos">📭 No hay archivos CSV disponibles</div>';
      return;
    }
    for (const csv of csvs) {
      await mostrarCSV(csv, contenedor);
    }
  } catch (error) {
    console.error('Error cargando CSVs:', error);
    document.getElementById('contenedorCSVs').innerHTML = '<div class="sin-datos">❌ Error al cargar los archivos CSV</div>';
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
    titulo.innerHTML = `📄 ${nombreArchivo} <span style="font-size:12px; font-weight:normal;">(${datos.length} registros)</span>`;
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
    divError.innerHTML = `<div class="nombre-csv">⚠️ ${nombreArchivo}</div><div class="sin-datos">No se pudo cargar este archivo</div>`;
    contenedor.appendChild(divError);
  }
}

function recargar() {
  document.getElementById('contenedorCSVs').innerHTML = '<div style="text-align:center; padding:40px;">🔄 Cargando...</div>';
  cargarCSVs();
}

function descargarCSV() {
  window.location.href = '/descargar';
}

function volverAlGestor() {
  window.location.href = '/';
}

window.addEventListener('DOMContentLoaded', cargarCSVs);
