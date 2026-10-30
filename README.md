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

## Taller Tarjeta C Flujo de estados con historial Jardel Maza

| Método | Ruta | Rol | Body | Respuestas |
|---|---|---|---|---|
| PATCH | /api/admin/pedidos/:id/estado | ADMIN | `{ "estado": "...", "nota": "..." }` | 200, 400 (estado inválido), 401, 403, 404, 409 (transición no permitida) |
| GET | /api/pedidos/:id/historial | Dueño o ADMIN | Ninguno | 200 (pedidoId, estado, historial), 401, 403 (no es el dueño), 404 |

- **Transiciones:** `PENDIENTE` → `PAGADO` → `ENVIADO`; `PENDIENTE` → `PAGADO` → `CANCELADO` (al cancelar se devuelve el stock).
- **409:** También se responde si el pedido cambió de estado mientras tanto. La `nota` admite máximo 200 caracteres.
- **Modelo:** `HistorialPedido` 1:N con `Pedido` (`Cascade`: si se borra el pedido se borra su historial) y 1:N con `User` como `cambiadoPor` (`Restrict`: no se puede borrar un usuario con registros en historial). Posee `@@index([pedidoId])`.
- El cambio de estado y el registro del historial se guardan juntos en una sola `$transaction`.