# Laboratorio 1 · Mini-API MVC con CRUD

**Desarrollo Web Avanzado (A0R04) · ESPE · Unidad 1: Persistencia de datos y ORM**

| Dato | Valor |
|---|---|
| Grupo | G05 |
| Emprendimiento | Tienda online de cartas Pokémon |
| Integrantes | 1. Jardel Maza <br> 2. Esteban Recalde <br> 3. Nicolás Zurita |
| NRC | 36878|
| Fecha | 19/10/2026 |
| Repositorio | https://github.com/BrokeSaturn/G05_Lab1_TiendaCartasPokemon |

## Cómo ejecutar  

```bash
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run dev               # http://localhost:3000
```

Importa en Postman `postman/G05_Lab1.postman_collection.json` y ejecuta **Run collection**.

## Estructura MVC en capas

```
src/
├─ app.js            ← arma la app: express.json, middlewares y prefijo /api
├─ server.js         ← solo levanta el servidor (lee .env)
├─ routes/
│  ├─ index.js       ← archivo principal: monta cada recurso (/api/<entidad>)
│  └─ <entidad>.routes.js  ← verbo + URL → acción del controlador
├─ controllers/      ← lee req, llama al servicio, decide código + JSON
├─ services/         ← reglas de negocio, validaciones y acceso a datos
├─ models/           ← campos de la entidad y archivo JSON (Lab 2: schema.prisma)
├─ middlewares/      ← logger, notFound, errorHandler
└─ utils/httpError.js
data/                ← archivo JSON con los registros
```

Flujo de una petición: **ruta → controlador → servicio → modelo** y de vuelta. El proyecto usa CommonJS (`require` / `module.exports`).

## Endpoints de la entidad

| Verbo | Ruta | Acción | Éxito | Errores |
|---|---|---|---|---|
| GET | /api/cartas | Listar | 200 | — |
| GET | /api/cartas/:id | Ver uno | 200 | 400, 404 |
| POST | /api/cartas | Crear | 201 | 400 |
| PUT | /api/cartas/:id | Actualizar | 200 | 400, 404 |
| DELETE | /api/cartas/:id | Eliminar | 204 | 404 |

## Validaciones del servicio

1. El nombre es obligatorio y debe tener al menos 3 caracteres (400).
2. El precio debe ser un número mayor o igual a 0 (400).
3. El stock debe ser un entero mayor o igual a 0 (400).

## Aporte de cada integrante

| Integrante | Qué hizo (archivos / pasos) |
|---|---|
| Esteban Recalde | Creo el repositorio en github. Definió el tema y los datos en cada modelo (data/cartas.json, src/models/carta.model.js: campos name, expansion, rarity, price, stock). Tanmbién hizo las validaciones y el CRUD del servicio.|
| Nicolás Zurita |   |
| Jardel Maza | Redactó la propuesta del proyecto en `PROPUESTA.md` y diagramó el mapa de arquitectura frontend-backend en `mapa.png`. Completó la documentación en `README.md`  |

## Declaración de uso de IA

- Herramienta(s) usada(s): Claude (o «No se usó IA»)
- Para qué la usamos (consultar, depurar, explicar un error…): La usamos para definir mejor las validaciones, ademas de pedirle la estructura para la generacion del diagrama en mermamid.live
- Qué verificamos o corregimos nosotros: En las validaciones verificamos que siga la estructura y el método dado por el ingeniero y que cumpla los objetivo.
