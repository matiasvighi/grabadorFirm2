# API Endpoints del Backend

## Flujo de subida y ejecución

```mermaid
sequenceDiagram
    actor User as Usuario
    participant UI as index.html
    participant API as server.js
    participant FS as Archivos

    User->>UI: Selecciona archivo
    User->>UI: Click "Subir Firm"
    UI->>API: POST /upload/firms (FormData)
    API->>FS: Guarda en uploads/firms/
    API-->>UI: { ok: true }
    UI->>UI: Refresca comboFirm

    User->>UI: Selecciona firm del combo
    User->>UI: Click "Subir Firm e Imagen"
    UI->>API: POST /subirTodo {firm, imagen, script}
    API->>API: Spawnea bash script
    API-->>UI: { ok: true, logId }

    loop Cada 1 segundo
        UI->>API: GET /progreso
        API-->>UI: Log de ejecución
    end

    API->>FS: Escribe CSV en uploads/csvs/
    API-->>UI: Log completo con resultado
    UI->>UI: Detiene polling al ver "completado"
```

## Subida de archivos

| Método | Ruta | Función |
|---|---|---|
| POST | `/upload/firms` | Subir firmware |
| POST | `/upload/imagenes` | Subir imagen de FS |
| POST | `/upload/scripts` | Subir script bash |

Todas usan `multipart/form-data` con campo `file`.

## Listados

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/listado/firms` | `["archivo1.bin", ...]` |
| GET | `/listado/imagenes` | `["imagen1.bin", ...]` |
| GET | `/listado/scripts` | `["script.sh", ...]` |
| GET | `/listado/csvs` | `["grabacion_2026-05-17.csv", ...]` |

## Ejecución

| Método | Ruta | Body | Descripción |
|---|---|---|---|
| POST | `/subirTodo` | `{ firm, imagen, script }` | Ejecuta el bash script correspondiente |

**Lógica de selección de script:**
- Si `script` está presente → ejecuta el script subido por el usuario
- Si `script` está vacío → ejecuta `grabofirmeimagen.bash` (ESP8266 por defecto)
- El script recibe `firm` e `imagen` como parámetros posicionales ($1, $2)

## Progreso en vivo

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/progreso` | Devuelve el log de la ejecución actual |

El frontend hace **polling** cada 1 segundo a esta ruta mientras dura la ejecución.
Se detiene automáticamente al detectar "completado", "finalizado" o "error".

## Descargas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/descargar` | Descarga ZIP con firms/scripts/imagenes/csvs |
| GET | `/csv/:nombre` | Devuelve contenido de un CSV específico |
