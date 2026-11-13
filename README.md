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
| Repositorio | https://github.com/BrokeSaturn/G04_Lab1_TiendaCartasPokemon |

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

Importa en Postman `postman/G04_Lab2.postman_collection.json` y ejecuta **Run collection**.

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


# Laboratorio 3 · Relaciones, autenticación y despliegue

**Desarrollo Web Avanzada (A0R04) · ESPE · Unidad 1: Persistencia de datos y ORM**

| Dato | Valor |
|---|---|
| Grupo | G04 |
| Emprendimiento | Tienda online de cartas Pokémon |
| Integrantes | 1. Jardel Maza <br> 2. Esteban Recalde <br> 3. Nicolás Zurita |
| NRC | 36878 |
| Fecha | 25/10/2026 |
| URL Pública | https://<tu-url-de-railway>.up.railway.app |
| Repositorio | https://github.com/BrokeSaturn/G04_Lab1_TiendaCartasPokemon |

## Como ejecutar

```bash
npm install                                 # Instala dependencias
cp .env.example .env                        # En Windows: copy .env.example .env (configurar JWT_SECRET)
docker compose up -d                        # Levanta PostgreSQL 17 en Docker (opcional)
npx prisma migrate dev                      # Aplica las migraciones a PostgreSQL
npx prisma generate                         # Genera el cliente de Prisma
npx prisma db seed                          # Carga los datos iniciales
npm run dev                                 # http://localhost:3000
```

Importa en Postman `postman/G04_Lab3.postman_collection.json` y ejecuta **Run collection**.

## Estructura MVC en capas

```
prisma/
├─ schema.prisma             ← Definicion de modelos (User, Cliente, Carta, Pedido, DetallePedido)
├─ seed.js                   ← Carga de datos iniciales con usuarios, cartas y pedidos de prueba
└─ migrations/               ← Migraciones versionadas en SQL
src/
├─ app.js                    ← Arma la app: express.json, middlewares y prefijo /api
├─ server.js                 ← Conecta Prisma a PostgreSQL y levanta el servidor
├─ db/
│  └─ prisma.js              ← Instancia del cliente de Prisma Client
├─ routes/
│  ├─ index.js               ← Archivo principal: monta cada recurso (/api/<entidad>)
│  ├─ auth.routes.js         ← Autenticacion (/register, /login, /me)
│  ├─ carta.routes.js        ← CRUD de cartas y reportes admin
│  ├─ pedido.routes.js       ← Rutas protegidas de pedidos (/pedidos, /cancelar)
│  └─ admin.routes.js        ← Rutas administrativas (/reportes/top-cartas)
├─ controllers/
│  ├─ auth.controller.js     ← Manejo de peticiones de registro, login y perfil
│  ├─ carta.controller.js    ← Controladores del catalogo de cartas
│  ├─ pedido.controller.js   ← Controladores de gestion y cancelacion de pedidos
│  └─ admin.controller.js    ← Controladores de reportes del sistema
├─ services/
│  ├─ auth.service.js        ← Reglas de negocio de usuarios, hash de claves (bcrypt) y JWT
│  ├─ carta.service.js       ← Reglas de negocio del catalogo
│  ├─ pedido.service.js      ← Transacciones de pedidos ($transaction), stock y ROLLBACK
│  └─ admin.service.js       ← Consultas agregadas de reportes
├─ middlewares/
│  ├─ auth.js                ← Validacion de token JWT y control de roles (authenticateToken, requireRole)
│  ├─ logger.js              ← Registro de peticiones HTTP
│  ├─ notFound.js            ← Manejo de ruta no encontrada (404)
│  └─ errorHandler.js        ← Manejo global de errores (Prisma P2002 -> 409, P2025 -> 404)
└─ utils/httpError.js        ← Clase personalizada de errores
evidencias/
├─ postman-local.png         ← Captura del Run Collection local exitoso (39/39)
└─ railway-run.png           ← Captura del Run Collection ejecutado en la nube
postman/
├─ G04_Lab3.postman_collection.json ← Coleccion de Postman adaptada
└─ Railway.postman_environment.json ← Entorno para pruebas en la nube
```

Flujo de una peticion: **ruta → middleware (JWT) → controlador → servicio (Prisma) → PostgreSQL** y de vuelta. El proyecto usa CommonJS (`require` / `module.exports`).

## Usuarios de prueba (seed)

| Rol | Correo Electrónico | Contraseña |
|---|---|---|
| ADMIN | admin@tiendapokemon.com | Admin123* |
| USER | jardel@espe.com | Cliente123* |
| USER | esteban@espe.com | Cliente123* |

## Endpoints de la API

| Verbo | Ruta | Accion | Rol Requerido | Exito | Errores |
|---|---|---|---|---|---|
| POST | /api/auth/register | Registrar usuario y cliente (1:1) | Público | 201 | 400, 409 |
| POST | /api/auth/login | Autenticar usuario y emitir JWT | Público | 200 | 400, 401 |
| GET | /api/auth/me | Obtener perfil del usuario autenticado | Autenticado | 200 | 401 |
| GET | /api/cartas | Listar catalogo de cartas | Público | 200 | — |
| GET | /api/cartas/:id | Ver una carta por ID | Público | 200 | 400, 404 |
| POST | /api/cartas | Crear carta | ADMIN | 201 | 400, 401, 403, 409 |
| PUT | /api/cartas/:id | Actualizar carta | ADMIN | 200 | 400, 401, 403, 404, 409 |
| DELETE | /api/cartas/:id | Eliminar carta | ADMIN | 200 | 401, 403, 404 |
| POST | /api/pedidos | Crear pedido (Transaccion de stock) | USER | 201 | 400, 401, 409 |
| GET | /api/pedidos | Listar pedidos del usuario autenticado | USER | 200 | 401 |
| PATCH | /api/pedidos/:id/cancelar | Cancelar pedido y devolver stock | USER | 200 | 401, 403, 404, 409 |
| GET | /api/admin/reportes/top-cartas | Obtener top de cartas mas vendidas | ADMIN | 200 | 401, 403 |

## Relaciones de la base de datos y comportamiento onDelete

| Relacion | Tipo | Tablas Involucradas | Accion onDelete | Justificacion |
|---|---|---|---|---|
| Usuario - Cliente | 1:1 | `User` → `Cliente` | CASCADE | Al eliminar un usuario del sistema, su perfil de cliente asociado se elimina automaticamente. |
| Cliente - Pedido | 1:N | `Cliente` → `Pedido` | RESTRICT | No se puede eliminar un cliente con historial de compras para preservar los registros contables. |
| Pedido - DetallePedido | 1:N | `Pedido` → `DetallePedido` | CASCADE | Si se elimina un pedido, todos los detalles e items asociados se eliminan en cascada. |
| Carta - DetallePedido | 1:N | `Carta` → `DetallePedido` | RESTRICT | No se permite eliminar una carta si ya forma parte de un pedido registrado. |

## Validaciones del servicio

1. El registro exige correo valido, contrasena de al menos 8 caracteres y nombre completo (400). Si el correo ya existe (`P2002`), retorna 409 Conflict.
2. Al crear un pedido (`/api/pedidos`), se valida la disponibilidad de stock de cada carta mediante transacciones atómicas (`$transaction`).
3. Si el stock es insuficiente para cumplir el pedido, la transaccion aplica un **ROLLBACK** automatico y responde con error HTTP 409.
4. Al cancelar un pedido en estado `PENDIENTE`, el servicio devuelve atomicamente la cantidad de cartas compradas al stock disponible.
5. Las rutas protegidas validan el token JWT pasado en la cabecera `Authorization: Bearer <token>`. Retorna 401 si el token es invalido/ausente y 403 si el rol del usuario no tiene permisos suficientes.

## Aporte de cada integrante

| Integrante | Que hizo (archivos / pasos) |
|---|---|
| Esteban Recalde | Sincronizo la rama `lab3`, configuro la conexion a PostgreSQL en Railway, aplico las migraciones de Prisma en la nube y gestiono el despliegue de la aplicacion en el entorno de produccion. |
| Nicolas Zurita | Implemento los modulos de autenticacion (`auth.routes.js`, `auth.controller.js`, `auth.service.js`), el middleware de verificacion de tokens y roles JWT (`auth.js`), y el modulo de reportes administrativos (`admin.routes.js`, `admin.service.js`). |
| Jardel Maza | Adapto la estructura del modulo de pedidos (`pedido.routes.js`, `pedido.controller.js`, `pedido.service.js`), la logica de transacciones con ROLLBACK de stock, actualizo la coleccion de Postman al dominio de cartas Pokemon, ejecuto las suites de pruebas generando las capturas de evidencia (`evidencias/postman-local.png` y `evidencias/railway-run.png`) y redacto la documentacion final en `README.md`. |

## Declaracion de uso de IA

- Herramienta(s) usada(s): Gemini.
- La usamos para consultar, depurar, explicar un errores: Se uso para resolver errores de sintaxis y tipado en consultas complejas de Prisma `$transaction`, ajustar el manejo de errores en middlewares y adaptar las aserciones de pruebas en Postman al idioma español.
- Que verificamos o corregimos nosotros: Verificamos la correcta ejecucion del flujo MVC en todas las capas, comprobamos que las transacciones atomicen adecuadamente los cambios en la base de datos y validamos el paso exitoso de las 39 pruebas tanto en entorno local como en Railway.

## Taller Nuevas funcionalidades

## Taller Tarjeta A Reseñas Nicolás Zurita

| Método | Ruta | Rol | Body | Respuestas |
|--------|------|-----|------|------------|
| POST | /api/cartas/:id/resenas | Autenticado | { rating: 1-5, comment? } | 201 · 400 rating o comment · 401 · 404 carta · 409 ya reseñó |
| GET | /api/cartas/:id/resenas | Público | — (query: page, limit) | 200 { cartaId, average, total, page, limit, pages, data } · 404 |
| DELETE | /api/resenas/:id | Autor o ADMIN | — | 204 · 401 sin token · 403 no es el autor · 404 |

Modelo: Resena (1:N con User y 1:N con Carta), @@unique([userId, cartaId]): una sola reseña por usuario y carta.
comment admite máximo 300 caracteres.
onDelete Cascade en ambos lados porque una reseña no tiene sentido si se borra su autor o su carta.

## Taller Tarjeta B Categorías y búsqueda Esteban Recalde

| Método | Ruta | Rol | Body | Respuestas |
|--------|------|-----|------|------------|
| POST | /api/categorias | ADMIN | { name } | 201 · 400 name vacío · 401 sin token · 403 no ADMIN · 409 duplicada |
| GET | /api/categorias | Público | — | 200 [ { id, name, _count: { cartas } } ] |
| PUT | /api/cartas/:id/categorias | ADMIN | { categoriaIds: [1, 2] } | 200 · 400 no es arreglo de enteros · 401 · 403 · 404 carta o categoría |
| GET | /api/cartas/search | Público | — (query: q, category, min, max, sort, page, limit) | 200 { page, limit, total, pages, data } · 400 sort |

Modelo: Categoria N:M implícita con Carta (Prisma crea la tabla _CartaToCategoria porque no guarda datos propios),
name @unique. sort acepta price_asc, price_desc o name. /search se declara antes de /:id.
## Taller Tarjeta C Flujo de estados con historial Jardel Maza

| Método | Ruta | Rol | Body | Respuestas |
|---|---|---|---|---|
| PATCH | /api/admin/pedidos/:id/estado | ADMIN | `{ "estado": "...", "nota": "..." }` | 200, 400 (estado inválido), 401, 403, 404, 409 (transición no permitida) |
| GET | /api/pedidos/:id/historial | Dueño o ADMIN | Ninguno | 200 (pedidoId, estado, historial), 401, 403 (no es el dueño), 404 |

- **Transiciones:** `PENDIENTE` → `PAGADO` → `ENVIADO`; `PENDIENTE` → `PAGADO` → `CANCELADO` (al cancelar se devuelve el stock).
- **409:** También se responde si el pedido cambió de estado mientras tanto. La `nota` admite máximo 200 caracteres.
- **Modelo:** `HistorialPedido` 1:N con `Pedido` (`Cascade`: si se borra el pedido se borra su historial) y 1:N con `User` como `cambiadoPor` (`Restrict`: no se puede borrar un usuario con registros en historial). Posee `@@index([pedidoId])`.
- El cambio de estado y el registro del historial se guardan juntos en una sola `$transaction`.

## Unidad 2 – MongoDB

En esta unidad se integra **MongoDB 8** junto con **Mongoose 9.11.4** dentro del mismo repositorio, manteniendo intacta la arquitectura relacional de **PostgreSQL + Prisma** (sin alterar `schema.prisma` ni las migraciones existentes). 

Para esta implementación se eligió la colección documental **`fichas`**, diseñada para almacenar las especificaciones técnicas de cada carta Pokémon (HP, tipos, ataques embebidos y efecto), cuya estructura varía dinámicamente según su supertipo (`pokemon`, `entrenador`, `energia`). La vinculación con PostgreSQL se realiza únicamente mediante referencia lógica a través del campo `cartaId`, evitando duplicar datos transaccionales como precio o stock.

---

## 1. Ejecución en entorno local

1. **Configurar variables de entorno:**
   Asegúrate de incluir la cadena de conexión en tu archivo `.env` local (se especifica `authSource=admin` porque el usuario root `espe_user` del contenedor se autentica contra dicha base):
   ```env
   MONGODB_URI="mongodb://espe_user:espe_password@localhost:27017/tiendapokemon?authSource=admin"
   ```

2. **Instalar dependencias e iniciar la API:**
   ```bash
   npm install
   npm install -E mongoose@9.11.4 validator@13.15.35
   npm run dev
   ```
   * **Comportamiento esperado:** Si ambas bases de datos conectan con éxito, la terminal mostrará `PostgreSQL y MongoDB conectados`. Si MongoDB no está disponible, `connectMongo` lanza una excepción y la aplicación detiene su ejecución (`No se pudo iniciar la API`) sin llamar a `app.listen()`.

---

## 2. Endpoints de la Unidad 2 (`/api/fichas`)

| Método | Endpoint | Descripción | Códigos de Estado |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/fichas` | Lista todas las fichas técnicas almacenadas en MongoDB, incluyendo el campo virtual `resumen`. | `200 OK` |
| `POST` | `/api/fichas` | Valida mediante Mongoose y registra una nueva ficha técnica en la colección `fichas`. | `201 Created` / `400 Bad Request` |

## 3. Arquitectura en Capas y Middlewares

El proyecto mantiene una separación estricta de responsabilidades para el nuevo recurso:

1. **Modelo (`src/models/ficha.model.js`):** Define el esquema de Mongoose (`fichaSchema`), subdocumentos embebidos (`ataqueSchema`), validaciones declarativas y personalizadas, el campo virtual `resumen` y el middleware de documento. Ocupa el equivalente a `schema.prisma` + `PrismaClient`, sin reemplazar la capa de servicios.
2. **Servicio (`src/services/ficha.service.js`):** Encapsula las operaciones de acceso a datos (`Ficha.find()` y `Ficha.create(data)`).
3. **Controlador (`src/controllers/ficha.controller.js`):** Gestiona las peticiones HTTP (`list` y `create`), delega la lógica al servicio y propaga errores mediante `next(err)`.
4. **Enrutamiento (`src/routes/ficha.routes.js` y `src/routes/index.js`):** Expone las rutas `GET /` y `POST /` bajo el prefijo `/api/fichas`.

#### Ubicación y función de los Middlewares

* **Middlewares de Express (`src/middlewares/`):**
  Operan sobre el ciclo de petición-respuesta `(req, res, next)` (`logger.js`, `notFound.js`, `auth.js` y `errorHandler.js`). En esta unidad se amplió **`errorHandler.js`** para interceptar las excepciones `ValidationError` y `CastError` lanzadas por Mongoose, transformándolas en respuestas HTTP `400 Bad Request` estructuradas.
* **Middleware de Mongoose (`src/models/ficha.model.js`):**
  Se implementó el hook **`fichaSchema.pre("validate")`**, el cual actúa directamente sobre la instancia del documento (`this`) antes de ejecutar las validaciones del esquema (sin recibir el parámetro `next`, acorde a la sintaxis de Mongoose 9). Su función es construir automáticamente el `slug` (ej. `charizard-4-102`) a partir del nombre y número de carta, además de sanitizar el arreglo `tipos` aplicando `.trim().toLowerCase()`.

---

## 4. Entregables y Evidencias de la Unidad 2

* **`docs/u2/hito1.md`:** Justificación de selección NoSQL (comparativa entre modelos Documental, Clave-Valor y Columnar) y delimitación de datos entre PostgreSQL y MongoDB.
* **`docs/u2/hito2.md`:** Análisis de *workload* (patrones de lectura/escritura), matriz de decisión para embeber (`ataques`) vs. referenciar (`expansiones`, `cartaId`) y diagrama Entidad-Relación en Mermaid.
* **`docs/u2/grupo4.mongodb.js`:** Playground ejecutable en VS Code sobre la base `tiendapokemon_lab` con validación nativa `$jsonSchema` (enum, rango y arreglo), pruebas de inserción válidas/rechazadas y agregación con `$lookup` + `$unwind`.
* **`postman/G04_LabU2_Hito3.postman_collection.json`:** Colección de Postman con pruebas automatizadas (`pm.test`) para creación exitosa (`201`), validación de campos obligatorios (`400`) y validación de formatos/reglas de negocio (`400`).
* **`docs/u2/postman_hito3.png`:** Evidencia de ejecución exitosa (en verde) de la colección de Postman.
* **`docs/u2/compass_fichas.png`:** Evidencia en MongoDB Compass de los documentos persistidos en `tiendapokemon.fichas`.

---
---
## 5. Consideraciones Finales

* **Conclusión:** La implementación de MongoDB como base de datos NoSQL permitió una mayor flexibilidad en la gestión de los datos de las fichas de cartas, facilitando la inclusión de información adicional sin necesidad de modificar la estructura del esquema.
* **Lecciones aprendidas:** Se aprendió la importancia de planificar cuidadosamente el diseño del esquema y las validaciones antes de implementar el sistema, así como la necesidad de mantener una comunicación efectiva entre los miembros del equipo para garantizar la calidad del código y la coherencia en la documentación.

## 6. Declaración de uso de Inteligencia Artificial

* **Herramienta utilizada:** Claude .
* **Alcance y propósito:** Asistencia en la creacion de nuevos archivos, verificación de sintaxis para reglas de validación en `$jsonSchema` y Mongoose 9, y estructuración de aserciones de prueba en Postman.
* **Validación realizada por el grupo:** Todos los integrantes verificaron y ejecutaron de forma manual el levantamiento de contenedores en Docker, la conexión simultánea de PostgreSQL y MongoDB al iniciar la API, el correcto funcionamiento de los endpoints y middlewares mediante Postman, y la persistencia real de los datos en MongoDB Compass.