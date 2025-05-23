/**
 * Global schemas definition for Swagger documentation
 */

/**
 * Empty success response
 * @typedef {object} SuccessResponse
 * @property {number} status.required - HTTP status code
 * @property {object|null} data.required - Response data - example: null
 */

/**
 * Generic error response
 * @typedef {object} ErrorResponse
 * @property {number} status.required - HTTP status code
 * @property {string|null} data.required - Error message
 */

/**
 * Bad Request Error (400)
 * @typedef {object} ErrorResponse400
 * @property {number} status.required - HTTP status code - example: 400
 * @property {string|null} data.required - Error message
 */

/**
 * Unauthorized Error (401)
 * @typedef {object} ErrorResponse401
 * @property {number} status.required - HTTP status code - example: 401
 * @property {string|null} data.required - Error message
 */

/**
 * Not Found Error (404)
 * @typedef {object} ErrorResponse404
 * @property {number} status.required - HTTP status code - example: 404
 * @property {string|null} data.required - Error message
 */

/**
 * Conflict Error (409)
 * @typedef {object} ErrorResponse409
 * @property {number} status.required - HTTP status code - example: 409
 * @property {string|null} data.required - Error message
 */

/**
 * Parameters for pagination
 * @typedef {object} PaginationParams
 * @property {number} page - Número de página - default: 1
 * @property {number} limit - Número de elementos por página - default: 10
 */

/**
 * Material composition
 * @typedef {object} Material
 * @property {string} name.required - Nombre del material
 * @property {number} amount.required - Cantidad del material
 * @property {string} measureUnit.required - Unidad de medida
 */

/**
 * Bottle type definition
 * @typedef {object} Bottle
 * @property {number} weight.required - Peso de la botella en gramos
 * @property {string} color.required - Color de la botella
 * @property {number} thickness.required - Espesor de la botella en milímetros
 * @property {string} shapeType.required - Forma de la botella
 * @property {string} originLocation.required - Lugar de origen
 * @property {string} extraInfo.required - Información adicional
 * @property {array<Material>} composition.required - Composición de materiales
 */

/**
 * Base bottles batch data structure
 * @typedef {object} BaseBottlesBatch
 * @property {number} id.required - ID del lote
 * @property {number} quantity.required - Cantidad de botellas en el lote
 * @property {Bottle} bottleType.required - Tipo de botella
 * @property {string} owner.required - Dirección del propietario
 * @property {number} soldQuantity.required - Cantidad de botellas vendidas
 * @property {string} createdAt - Fecha de creación
 * @property {string} deletedAt - Fecha de eliminación
 */

/**
 * Base bottles batch response
 * @typedef {object} BaseBottlesBatchResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {BaseBottlesBatch} data.required - Datos del lote de botellas
 */

/**
 * Base bottles batches list response
 * @typedef {object} BaseBottlesBatchListResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {BaseBottlesBatch[]} data.required - Lista de lotes de botellas
 */

/**
 * Recycled Material Batch model
 * @typedef {object} RecycledMaterialBatch
 * @property {number} id.required - ID del lote de material reciclado
 * @property {number} weight.required - Peso del material reciclado en kg
 * @property {string} size.required - Tamaño del material reciclado
 * @property {string} materialType.required - Tipo de material reciclado
 * @property {array<Material>} composition.required - Composición del material reciclado
 * @property {string} extraInfo.required - Información adicional
 * @property {string} buyerOwner.required - Dirección Ethereum del comprador
 * @property {string} creator.required - Dirección Ethereum del creador
 * @property {number[]} wasteBottleIds.required - IDs de las botellas utilizadas
 * @property {string} createdAt - Fecha de creación del registro
 * @property {string} deletedAt - Fecha de eliminación del registro
 */

/**
 * Recycled Material Batch response
 * @typedef {object} RecycledMaterialBatchResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {RecycledMaterialBatch} data.required - Datos del lote de material reciclado
 */

/**
 * Recycled Material Batches list response
 * @typedef {object} RecycledMaterialBatchListResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {RecycledMaterialBatch[]} data.required - Lista de lotes de material reciclado
 */

/**
 * Buyer information
 * @typedef {object} BuyerInfo
 * @property {number} id.required - ID del comprador
 * @property {string} firebaseUid.required - UID del comprador
 * @property {string} email.required - Correo del comprador
 * @property {string} userName.required - Nombre del comprador
 */

/**
 * Buyers list response
 * @typedef {object} BuyersListResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {BuyerInfo[]} data.required - Lista de compradores
 */
