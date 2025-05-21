# Backend API - Sistema de Trazabilidad de Botellas en Blockchain

API backend para el sistema de trazabilidad de botellas basado en blockchain. Permite a diferentes actores (productores, productores secundarios, consumidores y recicladores) registrar y rastrear el ciclo de vida completo de las botellas, desde su producción hasta su reciclado, utilizando contratos inteligentes en blockchain para garantizar la inmutabilidad y transparencia de los datos.

Este repositorio contiene la implementación de la API RESTful en Node.JS utilizando Typescript y Express, así como la lógica de negocio e integraciones necesarias para interactuar con una base de datos SQL y con los contratos inteligentes desplegados en la red blockchain.

## Configuración del Entorno

### Requisitos Previos

- Node.js 16.x o superior
- npm 8.x o superior
- Acceso a una red blockchain Ethereum (local o remota) con los contratos inteligentes desplegados.
- Base de datos MariaDB (SQL), ya sea local o remota.

En el archivo `.env` se pueden configurar las variables de entorno necesarias para la conexión a la base de datos y a la red blockchain. En archivo `.env.sample` se listan las variables de entorno necesarias para el correcto funcionamiento de la API.

En el repositorio [blockchain](../blockchain/README.md) se encuentra la documentación de los contratos inteligentes, así como las instrucciones para desplegarlos en una red local o de pruebas utilizando Hardhat.

### Entorno de desarrollo

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Configurar las variables de entorno:

   - Crea un archivo `.env` para el entorno de desarrollo y completa las variables necesarias. Puedes usar el archivo `.env.sample` como referencia.

### Ejecutar el Proyecto

**Entorno de desarrollo:**

```bash
npm run dev
```

**Entorno de producción:**

```bash
npm run build
npm start
```

Nota: en ambos casos es requerido tener la base de datos y la red blockchain configuradas y en funcionamiento.

### Despliegue

Este repositorio está diseñado para ser desplegado en un entorno de producción. Se recomienda utilizar Docker para facilitar el despliegue y la gestión de dependencias. El proyecto ya incluye un `Dockerfile` funcional. A su vez, el proyecto incluye un archivo Jenkinsfile para facilitar la integración continua y el despliegue continuo (CI/CD) del proyecto utilizando el software Jenkins para la automatización de tareas en un entorno de producción.

## Estructura del Proyecto

```
backend-api/
├── src/
│   ├── cmd/               # Punto de entrada de la aplicación
│   ├── internal/          # Configuración del servidor y middleware
│   │   ├── routes/        # Configuración centralizada de rutas API
│   │   └── server.ts      # Configuración del servidor Express
│   ├── modules/           # Módulos del sistema separados por dominio (Clean Architecture)
│   │   ├── auth/          # Autenticación y autorización
│   │   ├── producer/      # Lógica para productores primarios
│   │   ├── secondaryProducer/ # Lógica para productores secundarios
│   │   ├── consumer/      # Lógica para consumidores
│   │   └── recycler/      # Lógica para recicladores
│   └── pkg/               # Paquetes compartidos y utilitarios
│       ├── constants/     # Constantes del sistema
│       └── helpers/       # Utilidades y funciones auxiliares
├── tests/                 # Tests organizados por tipo
│   ├── integration/       # Tests de integración end-to-end
│   ├── unit/              # Tests unitarios por módulo
│   └── utils.ts           # Utilidades compartidas para tests
└── scripts/               # Scripts de utilidad
```

### Estructura de Clean Architecture por Módulo

Cada módulo sigue los principios de Clean Architecture, organizados de la siguiente manera:

```
modules/ejemplo/
├── constants/           # Opcional: constantes específicas del módulo
├── domain/              # Entidades: objetos de dominio y DTOs
├── repositories/        # Repositorios para persistencia de datos
├── moduleHandler.ts     # Casos de uso y lógica de negocios
├── moduleRouter.ts      # Definición de rutas del módulo
```

### Cómo Agregar un Nuevo Módulo

1. **Crear estructura de carpetas**: En `src/modules/` crea una nueva carpeta siguiendo la estructura de Clean Architecture detallada arriba.

2. **Definir entidades del dominio**: Crea las entidades de dominio y DTOs en la carpeta `domain/`.

3. **Implementar casos de uso**: Añade la lógica de negocio para cada endpoint en el archivo `moduleHandler`.

4. **Crear repositorios**: Implementa los repositorios para acceso a datos en la carpeta `repositories/`. Incluye acceso a la base de datos SQL y a la blockchain.

5. **Definir router del módulo**: Configura las rutas de la API en el archivo `moduleRouter.ts`.

6. **Registrar el módulo en rutas centralizadas**: En [src/internal/routes/index.ts](./src/internal/server/routes.ts), importa y registra el router del nuevo módulo.

7. **Añadir tests**:
   - Tests unitarios en `tests/unit/modules/nuevoModulo.test.ts`. Prueba los endpoints y la lógica de negocio del módulo de la misma forma que otros servicios interactúan con la API, no pruebes por separado la lógica de negocio, los repositorios y los routers.
   - Tests de integración en `tests/integration/nuevoModulo.integration.test.ts` (si aplica interacción con otros módulos o blockchain).

## Pruebas

El proyecto incluye pruebas unitarias y pruebas de integración para verificar el funcionamiento correcto del sistema.

### Pruebas Unitarias

Las pruebas unitarias verifican el funcionamiento de componentes individuales del sistema sin dependencias externas.

**Ejecutar pruebas unitarias:**

```bash
npm run unit-test
```

Este comando ejecuta las pruebas unitarias en modo watch, lo que permite ver cambios en tiempo real durante el desarrollo.

**Generar informe de coverage de pruebas unitarias:**

```bash
npm run coverage
```

Este comando muestra un resumen de la cobertura (coverage) de código de las pruebas unitarias, útil para verificar la calidad del conjunto de pruebas.

### Pruebas de Integración

Las pruebas de integración verifican la interacción entre múltiples componentes del sistema. En este caso, incluyen la API, la base de datos SQL y la blockchain.

**Ejecutar pruebas de integración:**

```bash
npm run integration-test
```

Este comando:

1. Inicia un nodo local de Hardhat para simular la blockchain
2. Despliega los contratos inteligentes necesarios
3. Configura el entorno de prueba con las direcciones de los contratos
4. Ejecuta las pruebas de integración
5. Detiene automáticamente el nodo de Hardhat al finalizar (si no se detiene, puedes detenerlo manualmente cerrando la terminal).

### Cuándo ejecutar cada tipo de prueba

- **Pruebas unitarias (unit-test)**: útiles durante el desarrollo para verificar rápidamente cambios en componentes individuales. Son rápidas, atómicas y no tienen dependencias externas.

- **Cobertura de código (coverage)**: se debe ejecutar antes de subir cambios para asegurar que las pruebas cubran adecuadamente el código nuevo o modificado.

- **Pruebas de integración (integration-test)**: se deben ejecutar cuando sea necesario verificar el flujo completo de interacción con la blockchain o entre múltiples módulos. Son más lentas pero verifican el sistema de manera más completa. Es recomendable ejecutarlas antes de un despliegue a producción o al finalizar una funcionalidad que involucre múltiples módulos o interacciones con la blockchain.
