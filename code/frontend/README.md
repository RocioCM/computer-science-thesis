# Frontend - Sistema de Trazabilidad de Botellas en Blockchain

Esta aplicación web provee la interfaz de usuario para el sistema de trazabilidad de botellas basado en blockchain, permitiendo a los diferentes actores (productores primarios, productores secundarios, consumidores y recicladores) interactuar con los datos almacenados en la blockchain a través de una interfaz amigable.

El frontend está desarrollado con [Next.js](https://nextjs.org/), un framework de React que ofrece server side rendering (SSR) y otras optimizaciones para crear aplicaciones web modernas y de alto rendimiento.

## Requisitos Previos

- Node.js 18.x o superior
- npm 8.x o superior o yarn
- API backend en ejecución (local o remota)

## Inicio Rápido

La primera vez que abras este repositorio, instala las dependencias:

```bash
npm install
# o
yarn install
```

Luego, puedes ejecutar el servidor de desarrollo cuando lo necesites:

```bash
npm run dev
# o
yarn dev
```

Abre [http://localhost:3000/app](http://localhost:3000/) en tu navegador para ver el resultado.

Puedes comenzar a editar las páginas modificando los archivos en la carpeta `pages/`. La página se actualiza automáticamente mientras editas el archivo.

## Despliegue

Este proyecto está configurado para ser desplegado fácilmente usando Docker. El repositorio incluye un `Dockerfile` para construir la imagen y un archivo `Jenkinsfile` para la integración continua.

Para construir la imagen Docker:

```bash
docker build -t frontend-bottle-tracing .
```

Para ejecutar el contenedor:

```bash
docker run -p 3000:3000 frontend-bottle-tracing
```

Para desplegar en producción, asegúrate de tener configuradas las variables de entorno necesarias (listadas en [.env.sample](./.env.sample) y [Jenkinsfile](./Jenkinsfile)) en tu entorno de producción.

Variables de entorno necesarias:

- `BASE_PATH`: Ruta a la API backend (ejemplo: `http://localhost:8080/api`)
- `NEXT_PUBLIC_FIREBASE_CONFIG`: JSON de configuración del cliente de Firebase para autenticación y almacenamiento.

## Entorno de Desarrollo

### Ejecución de Pruebas

Para ejecutar las pruebas unitarias en modo observación (actualización automática con los cambios):

```bash
npm run test
```

Para generar un informe de cobertura de código:

```bash
npm run coverage
```

El informe de cobertura se genera en la carpeta `coverage/` y proporciona métricas detalladas sobre qué partes del código están cubiertas por pruebas. Este proyecto debe tener una cobertura de al menos 60% para todo el repo.

### Validación de Código

Para verificar errores de linting y tipado:

```bash
npm run check
```

Para verificar solo errores de tipado TypeScript:

```bash
npm run type-check
```

## Estructura del Proyecto

Hay dos carpetas principales en la raíz del proyecto utilizadas para almacenar componentes, servicios y toda la lógica: `/common` y `/modules`.

La carpeta `/common` se utiliza para componentes y funcionalidades compartidas en toda la aplicación, mientras que la carpeta `/modules` es para componentes específicos de un módulo particular. La estructura dentro de la carpeta `/common` es similar a la estructura dentro de una carpeta de módulo individual.

### Estructura de la Carpeta Common

Dentro de la carpeta common, solo hay subcarpetas, no archivos sueltos. Cada subcarpeta contiene un conjunto de archivos relacionados. La siguiente es la estructura de la carpeta `/common`:

- **/components**: Componentes comunes utilizados en múltiples módulos. Se pueden crear subcarpetas para organizar componentes, como `/Inputs`, `/tinyComponents`, `/ModalsChildren`, etc.
- **/services**: Archivos de servicios reutilizables a nivel global.
- **/utils**: Funciones reutilizables sin estado. Cada archivo puede contener múltiples funciones, o una carpeta puede contener múltiples archivos para funcionalidades más complejas. Si se implementa una biblioteca de funcionalidades, debería ir en la carpeta `/libraries` en lugar de `utils`.
- **/libraries**: cada biblioteca debe tener su propia carpeta con múltiples archivos, y la carpeta debe tener el nombre de la biblioteca. Las bibliotecas implementan funcionalidades complejas que pueden usarse en múltiples módulos o globalmente.
- **/hooks**: Hooks personalizados reutilizables. Los hooks complejos que incluyen múltiples archivos pueden organizarse en subcarpetas.
- **/constants**: Constantes globales o aquellas utilizadas varias veces dentro de la aplicación. Se pueden crear archivos y carpetas para conjuntos relacionados de constantes. Los archivos de tipos globales pueden separarse en una subcarpeta `types`.
- **/styles**: Estilos globales para la aplicación. Estos son archivos no modulares aplicados a toda la aplicación e importados en el archivo [\_app.tsx](./pages/_app.tsx).
- **/context**: Archivos relacionados con el contexto global de la aplicación, incluidos los hooks de estado global utilizados dentro del contexto.

Puedes crear nuevas carpetas en la carpeta `/common` para organizar tu código. La estructura es flexible y puede adaptarse a tus necesidades. Solo recuerda usar esta carpeta para componentes y funcionalidades compartidas en toda la aplicación o múltiples módulos, no coloques código específico de un módulo aquí.

### Módulos y Páginas

Los archivos añadidos a la carpeta `/pages` se mapean automáticamente a nuevas rutas. Cada archivo en `/pages` debe corresponder a un módulo en la carpeta `/modules`. Los archivos en `/pages` no deben incluir lógica de negocio; solo deben llamar a la vista desde el módulo.

Los módulos separan la lógica de negocio de la lógica de vista, organizando el código de una manera más mantenible. Utiliza `npm run cast <nombre-modulo> -- --module` para crear un nuevo esqueleto de módulo y su página correspondiente.

### Estructura de Carpeta de Módulos

Los módulos implementan la arquitectura MVC utilizando Componentes de Orden Superior (HOC) de React. Cada módulo tiene una carpeta con la siguiente estructura:

- **index.ts**: Exporta el componente de vista para ser utilizado en la página.
- **types.ts**: Incluye los tipos utilizados en el módulo. Se puede crear una carpeta `/types` para organizar tipos complejos.
- **services.ts**: Incluye los servicios utilizados en el módulo. Se puede crear una carpeta `/services` para organizar múltiples archivos de servicios.
- **ModuleView.tsx**: Implementa la vista del módulo como un componente funcional que recibe props del controlador y devuelve JSX.
- **withModuleController.tsx**: Implementa el controlador del módulo como un HOC funcional que recibe props de la página y devuelve el componente de vista con las props.
- **/components**: Incluye los componentes utilizados en el módulo. Se pueden crear subcarpetas para organizar componentes.
- **/views**: Si el módulo incluye múltiples sub-vistas o paneles, se pueden organizar en esta carpeta en lugar de colocar todo en el archivo `ModuleView.tsx` o en la carpeta de componentes. Cada vista puede tener una estructura de componente simple o ser como un sub-módulo con su propia vista, controlador y otros archivos si es necesario, como tipos o componentes.

### Servicios y Rutas API

Utiliza la carpeta `/services` para archivos relacionados con servicios y constantes globales. Los servicios deben obtener datos de las rutas API, y las rutas API deben interactuar con los endpoints del backend. Todas las rutas API están en la carpeta `/pages/api`, con cada archivo mapeado a un endpoint de ruta API.

### Herramientas y Configuraciones

- **ESLint y Prettier**: Utilizados para mantener un código limpio y formateado de manera consistente. Ejecuta `npm run lint` para ver errores y advertencias en tu código.
- **Verificación de Tipos**: Ejecuta `npm run check` para ejecutar ESLint y validar errores de TypeScript en todo el proyecto, o `npm run type-check` para ejecutar solo la validación de TypeScript.
- **Tailwind CSS**: Utilizado para aplicar estilos alineados con nuestro sistema de diseño en Figma.

## Scripts Personalizados para Generar Código (npm run cast)

Este repositorio incluye scripts npm personalizados para ayudarte a crear páginas, componentes, servicios y módulos. Utiliza los siguientes comandos para generar rápidamente plantillas de código.

#### 1. Crear un Nuevo Componente

Para generar un nuevo componente, utiliza el siguiente comando:

```bash
npm run cast <NombreComponente> [<directorio>]
```

- Los nombres de los componentes deben estar en **PascalCase**.

Esto creará un nuevo componente en la carpeta `/common/components`. Si deseas crear un componente dentro de una carpeta diferente, puedes pasar el nombre de la carpeta como segundo argumento.

Por ejemplo, si deseas crear un componente llamado `Button` dentro de la carpeta `/common/components`, puedes simplemente ejecutar `npm run cast Button`.

Esto creará este esqueleto simple:

```bash
common/components
└───Button
		│   index.ts
		│   Button.tsx
```

Si deseas crear un componente llamado `GoogleButton` dentro de una carpeta diferente, por ejemplo, la carpeta `/modules/auth/login/components`, puedes ejecutar `npm run cast GoogleButton modules/auth/login/components`.

#### 2. Crear un Nuevo Módulo

Para crear un módulo completo (incluidos múltiples componentes o servicios), utiliza este comando:

```bash
npm run cast <NombreModulo> [<ruta-pagina>] -- --module
```

- Los nombres de los módulos deben estar en **PascalCase**.
- La bandera --module especifica que estás creando un módulo completo, no solo una página o componente.

Este comando creará un esqueleto de módulo simple en la carpeta `/modules` y un archivo de página en la carpeta `/pages` importando el módulo.

Por ejemplo, si deseas crear un componente llamado `Login`, puedes ejecutar `npm run cast Login -- --module`. Este comando creará el siguiente esqueleto:

```bash
modules
└───Login
		│   index.ts
		│   LoginView.tsx
		│   withLoginController.tsx
		│   types.ts
		│   services.ts
		└───components
		└───views
		└───hooks
pages
		│   login.tsx
```

Si deseas crear una página con una ruta diferente, puedes pasar la ruta como segundo argumento. Por ejemplo, si deseas crear un módulo llamado `Login` con una ruta de página `/auth/login`, puedes ejecutar `npm run cast Login auth/login -- --module`.

#### 3. Crear una Nueva Página

Para generar una nueva página vacía en tu proyecto, ejecuta:

```bash
npm run cast <ruta-pagina> -- --page
```

- La ruta de página debe estar en **kebab-case**.
- La bandera --page especifica que estás creando una nueva página.

Por ejemplo, si deseas crear una página llamada `AboutApp` con la ruta `/menu/about-app`, puedes simplemente ejecutar `npm run cast menu/about-app -- --page`.

#### 4. Crear un Nuevo Servicio

Para crear un servicio, puedes utilizar el siguiente comando:

```bash
npm run cast <NombreServicio> -- --service
```

- Los nombres de los servicios pueden estar en **PascalCase**, **camelCase** o **kebab-case**.

Esto creará un nuevo servicio en la carpeta `/common/services` con el nombre específico que proporcionaste. El nombre no debe incluir la palabra "Services", ya que se agregará automáticamente.

Por ejemplo, si deseas crear un servicio llamado `EmailServices`, puedes simplemente ejecutar `npm run cast email -- --service`.

Esto creará el archivo `/common/services/EmailService.js` con los siguientes métodos CRUD básicos para que los edites:

```javascript
import request from '.';

const EmailServices = {
  get: (id) => request(`/email/${id}`),
  create: (payload) =>
    request(`/email`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) =>
    request(`/email/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id) => request(`/email/${id}`, { method: 'DELETE' }),
};

export default EmailServices;
```

## Documentación

Puedes encontrar documentación sobre cada biblioteca y hook en su propio archivo README.md si es necesario. Si creas una nueva biblioteca o hook, recuerda agregar un README.md o comentarios JavaDoc para documentarlo.

Para más información sobre las integraciones con el backend y la blockchain, consulta la documentación en los repositorios [backend-api](../backend-api/) y [blockchain](../blockchain/).
