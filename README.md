# Level UP — API REST v1.0

API REST para la tienda virtual de **Level UP**, empresa colombiana especializada en venta de Videojuegos.
Construida con **Node.js + Express** | Curso Lenguajes de Programación para Móviles — FUMC 2026

>   **Cumplimiento legal:**  
> - Ley 1581 de 2012 — Protección de datos personales (Habeas Data)  
> - Ley 527 de 1999 — Comercio electrónico y transacciones digitales

---

## Requisitos

- Node.js v20 LTS
- npm 10.x

---

## Instalación y ejecución

```bash
git clone https://github.com/TU-USUARIO/coquito-amarillo-api-LPM01-201-3.git
npm install
npm run dev   # Servidor en http://localhost:3000
```

---

## Endpoints disponibles

### Productos `/api/productos`

| Método | Ruta | Descripción | Código HTTP |
|--------|------|-------------|-------------|
| GET | `/api/productos` | Listar todos los productos. Filtro opcional: `?categoria=bebidas` | 200 |
| GET | `/api/productos/:id` | Obtener producto por ID | 200 / 404 |
| POST | `/api/productos` | Crear producto. Body: `{ nombre, precio, descripcion, stock, categoria }` | 201 |
| PUT | `/api/productos/:id` | Actualizar producto. Body: campos a modificar | 200 / 404 |
| DELETE | `/api/productos/:id` | Desactivar producto (soft delete: `activo = false`) | 204 |

---

### Pedidos `/api/pedidos`

| Método | Ruta | Descripción | Código HTTP |
|--------|------|-------------|-------------|
| GET | `/api/pedidos` | Listar todos los pedidos. Filtro opcional: `?estado=pendiente` | 200 |
| GET | `/api/pedidos/:id` | Obtener pedido por ID | 200 / 404 |
| POST | `/api/pedidos` | Crear pedido. El `total` se calcula automáticamente en el servidor. Body: `{ clienteId, items, direccionEnvio }` | 201 |
| PUT | `/api/pedidos/:id/estado` | Cambiar estado del pedido. Body: `{ estado: "confirmado" }` | 200 / 404 |
| DELETE | `/api/pedidos/:id` | Cancelar pedido (soft delete: `estado = "cancelado"`) | 204 |

**Estados válidos:** `pendiente` · `confirmado` · `entregado` · `cancelado`

**Ejemplo body POST `/api/pedidos`:**
```json
{
  "clienteId": "per-001",
  "items": [
    { "productoId": "prod-001", "cantidad": 2, "precioUnitario": 4500 }
  ],
  "direccionEnvio": "Calle 10 #5-20, Medellín"
}
```

---

### Personas (Clientes) `/api/personas`

>  **Ley 1581 de 2012 — Habeas Data:** Los campos `numDoc`, `email` y `telefono` aparecen enmascarados en el listado general. Solo se exponen completos en `GET /api/personas/:id`. El `numDoc` no puede modificarse una vez registrado. El borrado es lógico (`activo = false`), los datos no se eliminan físicamente.

| Método | Ruta | Descripción | Código HTTP |
|--------|------|-------------|-------------|
| GET | `/api/personas` | Listar clientes. `numDoc`, `email` y `telefono` enmascarados (Ley 1581). Filtro: `?activo=true` | 200 |
| GET | `/api/personas/:id` | Obtener cliente por ID con datos completos | 200 / 404 |
| POST | `/api/personas` | Registrar cliente. Valida unicidad de `numDoc` y `email`. Body: `{ tipoDoc, numDoc, nombres, apellidos, email, telefono, ciudad }` | 201 / 409 |
| PUT | `/api/personas/:id` | Actualizar datos del cliente (`numDoc` protegido) | 200 / 404 |
| DELETE | `/api/personas/:id` | Desactivar cliente (soft delete: `activo = false`) (Ley 1581 Art. 9) | 204 |

**Tipos de documento válidos:** `CC` · `CE` · `NIT` · `PA`

**Ejemplo body POST `/api/personas`:**
```json
{
  "tipoDoc": "CC",
  "numDoc": "1023456789",
  "nombres": "Carlos Andrés",
  "apellidos": "Mejía Restrepo",
  "email": "ca.mejia@gmail.com",
  "telefono": "+573001234567",
  "ciudad": "Medellín"
}
```

---

### Pagos PSE `/api/pagos-pse`

>  **Ley 527 de 1999 — Comercio electrónico:** Cada transacción genera una referencia única para garantizar trazabilidad. La `urlRespuesta` es obligatoria y debe usar HTTPS para asegurar el retorno seguro del resultado al comercio (Art. 12).

| Método | Ruta | Descripción | Código HTTP |
|--------|------|-------------|-------------|
| POST | `/api/pagos-pse` | Iniciar transacción PSE simulada. Genera referencia única `TXN-YYYYMMDD-XXXX`. Body: ver abajo | 200 / 400 |
| GET | `/api/pagos-pse/:referencia` | Consultar estado de una transacción por su referencia | 200 / 404 |
| PUT | `/api/pagos-pse/:referencia/estado` | Simular resultado del banco. Body: `{ estado: "APROBADO" }` | 200 / 404 |

**Estados PSE válidos:** `PENDIENTE` · `APROBADO` · `RECHAZADO`

**Bancos ACH Colombia disponibles:**

| Código | Banco |
|--------|-------|
| 1007 | Bancolombia |
| 1006 | Banco de Bogotá |
| 1009 | Citibank Colombia |
| 1013 | BBVA Colombia |
| 1040 | Banco Agrario |
| 1051 | Davivienda |
| 1023 | Banco de Occidente |

**Ejemplo body POST `/api/pagos-pse`:**
```json
{
  "pedidoId": "ped-001",
  "bancoCodigo": "1007",
  "tipoPersona": "N",
  "tipoDocumento": "CC",
  "numeroDocumento": "1023456789",
  "monto": 17000,
  "descripcion": "Compra tienda Coquito Amarillo",
  "urlRespuesta": "https://coquito.com/pagos/respuesta"
}
```

---

##  Marco legal

| Ley | Descripción | Aplicación en el sistema |
|-----|-------------|--------------------------|
| **Ley 1581 de 2012** | Protección de datos personales (Habeas Data) | `numDoc`, `email` y `telefono` enmascarados en listados; soft delete en vez de eliminación física; `numDoc` protegido contra modificación |
| **Ley 527 de 1999** | Comercio electrónico y transacciones digitales | Referencia única por transacción PSE; `urlRespuesta` obligatoria con HTTPS; trazabilidad completa en respuestas de pago |

---

##  Estructura del proyecto

```
src/
├── controllers/
│   ├── productos.controller.js
│   ├── pedidos.controller.js
│   ├── personas.controller.js
│   └── pagos.controller.js
├── models/
│   ├── productos.model.js
│   ├── pedidos.model.js
│   ├── personas.model.js
│   └── pagos.model.js
├── routes/
│   ├── productos.routes.js
│   ├── pedidos.routes.js
│   ├── personas.routes.js
│   └── pagos.routes.js
├── middlewares/
│   └── validacion.js
│   public/
│   ├── index.html
    ├── style.css
└── app.js
```

---

##  Autores

Santiago Isaac Garcia Angarita,
Hector Andres Moreno Mosquera,
Mateo Cuesta Mosquera — FUMC Ingeniería de Software 2026  
