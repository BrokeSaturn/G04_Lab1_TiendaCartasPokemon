# Laboratorio 1 · Mini-API MVC con CRUD

**Desarrollo Web Avanzado (A0R04) · ESPE · Unidad 1: Persistencia de datos y ORM**

| Dato | Valor |
|---|---|
| Grupo | G04 |
| Emprendimiento | Tienda online de cartas Pokémon |
| Integrantes | 1. Jardel Maza <br> 2. Esteban Recalde <br> 3. Nicolás Zurita |
| NRC | 36878|
| Fecha | 19/10/2026 |
| Repositorio | https://github.com/BrokeSaturn/G04_Lab1_TiendaCartasPokemon

## Cómo ejecutar  

```bash
npm install
cp .env.example .env      # en Windows: copy .env.example .env
npm run dev               # http://localhost:3000
```

Importa en Postman `postman/G04_Lab1.postman_collection.json` y ejecuta **Run collection**.

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
| Nicolás Zurita | Actualizo el archivo carta.controller.js y las rutas para generar el crud, además de los middlewares errorHandler y logger. |
| Jardel Maza | Redactó la propuesta del proyecto en `PROPUESTA.md`. Adaptó la colección de pruebas en Postman con los datos de cartas y endpoints, ademas ejecutó el Run collection generando la captura de 13/13 pruebas y diagramó el mapa de arquitectura frontend-backend en `mapa.png`. Completó la documentación en `README.md`  |

## Declaración de uso de IA

- Herramienta(s) usada(s): Claude (o «No se usó IA»)
- Para qué la usamos (consultar, depurar, explicar un error…): La usamos para definir mejor las validaciones, ademas de pedirle la estructura para la generacion del diagrama en mermamid.live
- Qué verificamos o corregimos nosotros: En las validaciones verificamos que siga la estructura y el método dado por el ingeniero y que cumpla los objetivo.
- Comparaciones entre el código visto en clase de situaciones similares a las solicitadas con el contenido de la plantilla para mejorar el entendimiento del laboratorio y el contexto.

# Laboratorio 2 · Persistencia de Datos con Prisma y PostgreSQL

**Desarrollo Web Avanzado (A0R04) · ESPE · Unidad 1: Persistencia de datos y ORM**

| Dato | Valor |
|---|---|
| Grupo | G04 |
| Emprendimiento | Tienda online de cartas Pokemon |
| Integrantes | 1. Jardel Maza <br> 2. Esteban Recalde <br> 3. Nicolas Zurita |
| NRC | 36878 |
| Fecha | 22/10/2026 |
| Repositorio | https://github.com/BrokeSaturn/G05_Lab1_TiendaCaratasPokemon |

## Como ejecutar  

```bash
npm install                                # Instala dependencias (Prisma 7.10.1)
cp .env.example .env                       # En Windows: copy .env.example .env
docker compose up -d                       # Levanta PostgreSQL 17 en Docker (opcional)
npx prisma migrate dev                     # Aplica las migraciones a PostgreSQL
npx prisma generate                        # Genera el cliente de Prisma
npx prisma db seed                         # Carga los datos iniciales
npm run dev                                # http://localhost:3000
```

Importa en Postman `postman/G05_Lab2.postman_collection.json` y ejecuta **Run collection**.

## Estructura MVC en capas

```
prisma/
├─ schema.prisma             ← Definicion de modelos (Carta y Cliente)
├─ seed.js                   ← Carga de datos iniciales
└─ migrations/               ← Migraciones versionadas en SQL
prisma.config.ts             ← Configuracion global de Prisma 7
src/
├─ app.js                    ← Arma la app: express.json, middlewares y prefijo /api
├─ server.js                 ← Conecta Prisma a PostgreSQL y levanta el servidor
├─ db/
│  └─ prisma.js              ← Instancia del cliente de Prisma Client
├─ routes/
│  ├─ index.js               ← Archivo principal: monta cada recurso (/api/<entidad>)
│  └─ carta.routes.js        ← Verbo + URL → accion del controlador (incluye /lote)
├─ controllers/ 
│  └─ carta.controller.js    ← Lee req, llama al servicio, maneja req.body y respuestas
├─ services/ 
│  └─ carta.service.js       ← Reglas de negocio, validaciones y queries con Prisma ($transaction)
├─ middlewares/ 
│  ├─ logger.js              ← Registro de peticiones HTTP
│  ├─ notFound.js            ← Manejo de ruta no encontrada (404)
│  └─ errorHandler.js        ← Manejo global de errores (Prisma P2002 -> 409, P2025 -> 404)
└─ utils/httpError.js        ← Clase personalizada de errores
evidencias/ 
├─ postman-run.png           ← Captura del Run Collection exitoso (13/13)
└─ prisma-studio.png         ← Captura de registros en Prisma Studio
```

Flujo de una peticion: **ruta → controlador → servicio (Prisma) → PostgreSQL** y de vuelta. El proyecto usa CommonJS (`require` / `module.exports`).

## Endpoints de la entidad

| Verbo | Ruta | Accion | Exito | Errores |
|---|---|---|---|---|
| GET | /api/cartas | Listar | 200 | — |
| GET | /api/cartas/:id | Ver uno | 200 | 400, 404 |
| POST | /api/cartas | Crear | 201 | 400, 409 |
| POST | /api/cartas/lote | Crear en lote (Transaccion) | 201 | 400, 409 |
| PUT | /api/cartas/:id | Actualizar | 200 | 400, 404, 409 |
| DELETE | /api/cartas/:id | Eliminar | 204 | 404 |

## Validaciones del servicio

1. El nombre es obligatorio y debe tener al menos 3 caracteres (400).
2. El precio debe ser un numero mayor o igual a 0 (400).
3. El stock debe ser un entero mayor o igual a 0 (400).
4. Si el nombre de la carta se repite (`@unique`), Prisma lanza un error `P2002` que el `errorHandler` convierte en un error HTTP (409 Conflict).
5. En la insercion masiva (`/lote`), si un solo elemento falla por validaciones (400) o duplicidad (409), se aplica un **ROLLBACK** y no se guarda ninguna carta.

## Aporte de cada integrante

| Integrante | Que hizo (archivos / pasos) |
|---|---|
| Esteban Recalde | Etiqueto el Lab 1 (`lab1`), creo la rama `lab2` e instalo Prisma 7.10.1 con PostgreSQL. Copio los archivos base del kit, verifico la conexion en `src/server.js` y adapto `src/services/carta.service.js` para usar Prisma con transacciones (`$transaction`). Elimino la carpeta `data/` y los modelos obsoletos en `src/models/`, e incluyo la captura de Prisma Studio en `evidencias/prisma-studio.png`. Tambien configuro el `schema.prisma` con los modelos Carta y Cliente, creo la migracion `init` e implemento la funcion `createMany`. |
| Nicolas Zurita | Realizo las pruebas del programa para verificar el correcto funcionamiento de la aplicacion y sus endpoints. |
| Jardel Maza | Diseno el modelo Entidad-Relacion en `MODELO_ER.md`, adapto la coleccion de pruebas en Postman para probar los endpoints y los casos de COMMIT y ROLLBACK, ejecuto el Run collection generando las capturas de evidencia y redacto la documentacion en `README.md`. |

## Declaracion de uso de IA

- Herramienta(s) usada(s): Claude y ChatGPT.
- La usamos para consultar, depurar, explicar un errores: Se uso para consultar dudas sobre la configuracion de Prisma 7, resolver errores en las migraciones de PostgreSQL y organizar la estructura del documento.
- Que verificamos o corregimos nosotros: Revisamos que el codigo cumpla con la arquitectura MVC solicitada, verificamos las validaciones en los servicios y probamos que todos los endpoints respondan correctamente en Postman.