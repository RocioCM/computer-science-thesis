# Documentación API con Swagger

Este proyecto utiliza [express-jsdoc-swagger](https://www.npmjs.com/package/express-jsdoc-swagger) para generar documentación automática de la API a partir de comentarios JSDoc en el código.

## Acceso a la documentación

Una vez que el servidor esté en funcionamiento, puedes acceder a la documentación Swagger en: [http://localhost:8080/api/blockchain-test/api-docs](http://localhost:8080/api/blockchain-test/api-docs)

## Estructura de comentarios JSDoc para endpoints

Para documentar un endpoint, se utilizan comentarios JSDoc antes de cada función manejadora de rutas:

```typescript
/**
 * GET /api/endpoint/{parametro}
 * @summary Breve descripción del endpoint
 * @tags Nombre del grupo - Descripción opcional del grupo
 * @param {tipo} parametro.path.required - Descripción del parámetro en la ruta
 * @param {tipo} parametro.query - Descripción del parámetro de consulta
 * @param {TipoObjeto} request.body.required - Descripción del cuerpo de la solicitud
 * @security BearerAuth
 * @return {TipoRespuesta} 200 - Descripción de respuesta exitosa
 * @return {ErrorResponse} 400 - Descripción de error
 * @example request - Ejemplo de solicitud (opcional)
 * {
 *   "propiedad": "valor"
 * }
 */
async function nombreFuncion(req, res) {
  // Implementación...
}
```

## Definición de esquemas

Los esquemas de datos se definen en el archivo [src/pkg/constants/swagger-schemas.ts](../src/pkg/constants/swagger-schemas.ts) utilizando comentarios JSDoc:

```typescript
/**
 * @typedef {object} NombreEsquema
 * @property {tipo} propiedad.required - Descripción de la propiedad
 * @property {tipo} otraPropiedad - Descripción de otra propiedad
 */
```

## Actualización de la documentación

La documentación se genera automáticamente en tiempo de ejecución a partir de los comentarios JSDoc. Para actualizar la documentación:

1. Añade o modifica los comentarios JSDoc en los archivos de router (`*Router.ts`)
2. Si necesitas nuevos esquemas, añádelos en `swagger-schemas.ts`
3. Reinicia la aplicación

No se requiere ningún paso de compilación adicional para generar la documentación.

## Referencias

Para más información sobre las anotaciones disponibles, consulta:

- [Documentación de express-jsdoc-swagger](https://brikev.github.io/express-jsdoc-swagger-docs/#/)
- [Especificación OpenAPI](https://swagger.io/specification/)
