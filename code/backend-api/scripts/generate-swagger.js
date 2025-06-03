const expressJSDocSwagger = require('express-jsdoc-swagger');
const express = require('express');
const fs = require('fs');
const path = require('path');

// Configuración similar a la del servidor
const options = {
  info: {
    version: '1.0.0',
    title: 'Sistema de Trazabilidad de Botellas API',
    description:
      'API para el seguimiento del ciclo de vida de botellas en blockchain',
    contact: {
      name: 'UNCuyo LCC',
    },
  },
  security: {
    BearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  baseDir: path.join(__dirname, '..', 'src'), // Patrones de archivos para buscar comentarios JSDoc
  filesPattern: [
    './modules/**/*Router.ts',
    './modules/**/swaggerSchemas.ts',
    './pkg/interfaces/swaggerSchemas.ts',
  ],
  swaggerUIPath: '/api-docs',
  apiDocsPath: '/api-docs.json',
};

// Crear una aplicación express temporal para generar la documentación
const app = express();
const outputPath = path.resolve(__dirname, '..', 'public', 'swagger.json');

// Generar la documentación y guardarla
const instance = expressJSDocSwagger(app)(options);

// Esperar a que la definición de Swagger esté disponible
instance.on('finish', function (data) {
  // Crear la carpeta public si no existe
  const publicDir = path.dirname(outputPath);
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Guardar la definición de Swagger como un archivo JSON
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`Swagger documentation generated at ${outputPath}`);
  process.exit(0);
});

// En caso de error
instance.on('error', function (err) {
  console.error('Error generating Swagger documentation:', err);
  process.exit(1);
});
