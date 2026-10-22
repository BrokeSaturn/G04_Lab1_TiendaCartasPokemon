# Modelo ER del emprendimiento · Grupo G04

# Grupo G04

> Actividad 3 de la sesión 4. Es la base del `schema.prisma` del Lab 2 y de las relaciones del Lab 3.

## Diagrama

```mermaid
erDiagram
    CLIENTE ||--o{ PEDIDO : realiza
    PEDIDO }o--o{ CARTA : contiene
    CARTA {
        int id PK
        string name UK "VarChar(80)"
        string expansion "opcional"
        string rarity "default Common"
        float price ">= 0"
        int stock "default 0"
        datetime createdAt
    }
    CLIENTE {
        int id PK
        string nombre
        string email UK
        string telefono "opcional"
        string direccion "opcional"
        datetime createdAt
    }
    PEDIDO {
        int id PK
        datetime fecha
        float total ">= 0"
        string estado "pendiente/pagado/enviado"
        int clienteId FK
    }
```
## Entidades

| Entidad | Atributos (tipo) | Clave primaria | Únicos / obligatorios / reglas |
|---|---|---|---|
| Carta | name(string), expansion (string), rarity (string), price (float), stock (int), createdAt (datetime) | id (int, autoincremental) | name único y obligatorio (>= 3 caracteres); price >= 0; stock entero >= 0; expansion opcional |
|Cliente | nombre (string), email (string), telefono (string), direccion (string), createdAt (datetime) | id (int, autoincremental) | email único y obligatorio; nombre obligatorio; telefono y direccion opcionales | |
| Pedido | fecha (datetime), total (float), estado (string), clienteId (int, FK) | id (int, autoincremental) | total >= 0; estado obligatorio; clienteId debe existir en Cliente |

## Relaciones

| Entidad A | Cardinalidad (1:1, 1:N, N:M) | Entidad B | Ejemplo en una frase |
|---|---|---|---|
| Cliente | 1:N | Pedido | Un cliente realiza muchos pedidos; cada pedido pertenece a un solo cliente |
| Pedido | N:M | Carta | Un pedido contiene varias cartas y una carta puede estar en muchos pedidos (Lab 3: tabla intermedia). |

## ¿Qué se implementa en cada laboratorio?

- **Lab 2:** Carta y Cliente sin relaciones.
- **Lab 3:** Pedido y las relaciones.
