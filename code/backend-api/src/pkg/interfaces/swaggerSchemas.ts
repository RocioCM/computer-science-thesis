/**
 * Global schemas definition for Swagger documentation
 */

/**
 * Empty success response
 * @typedef {object} SuccessResponse
 * @property {number} status.required - HTTP status code - enum:200,201
 * @property {object|null} data.required - Response data - enum: null
 */

/**
 * Generic error response
 * @typedef {object} ErrorResponse
 * @property {number} status.required - HTTP status code - enum:500,400,401,404,409
 * @property {string|null} data.required - Error message
 */

/**
 * Bad Request Error (400)
 * @typedef {object} ErrorResponse400
 * @property {number} status.required - HTTP status code - enum:400
 * @property {string|null} data.required - Error message
 */

/**
 * Unauthorized Error (401)
 * @typedef {object} ErrorResponse401
 * @property {number} status.required - HTTP status code - enum:401
 * @property {string|null} data.required - Error message
 */

/**
 * Not Found Error (404)
 * @typedef {object} ErrorResponse404
 * @property {number} status.required - HTTP status code - enum:404
 * @property {string|null} data.required - Error message
 */

/**
 * Conflict Error (409)
 * @typedef {object} ErrorResponse409
 * @property {number} status.required - HTTP status code - enum:409
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
 * Product Bottles Batch model
 * @typedef {object} ProductBottlesBatch
 * @property {number} id.required - ID del lote
 * @property {number} originBaseBatchId.required - ID del lote de botellas base de origen
 * @property {number} quantity.required - Cantidad de botellas en el lote
 * @property {number} availableQuantity.required - Cantidad de botellas en el lote disponibles para venta
 * @property {string} owner.required - Dirección del propietario
 * @property {string} trackingCode - Código de seguimiento
 * @property {string} createdAt - Fecha de creación
 * @property {string} deletedAt - Fecha de eliminación
 */

/**
 * Product Bottles Batch response
 * @typedef {object} ProductBottlesBatchResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {ProductBottlesBatch} data.required - Datos del lote de botellas de producto
 */

/**
 * Product Bottles Batches list response
 * @typedef {object} ProductBottlesBatchListResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {ProductBottlesBatch[]} data.required - Lista de lotes de botellas de producto
 */

/**
 * Waste Bottle model
 * @typedef {object} WasteBottle
 * @property {number} id.required - ID de la botella de desecho
 * @property {string} trackingCode.required - Código de seguimiento de la botella
 * @property {string} creator.required - Dirección del creador en la blockchain
 * @property {string} owner.required - Dirección del propietario en la blockchain
 * @property {number} recycledBatchId - ID del lote de reciclaje si fue reciclada
 * @property {string} createdAt - Fecha de creación
 * @property {string} deletedAt - Fecha de eliminación
 */

/**
 * Waste Bottles list response
 * @typedef {object} WasteBottleListResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {WasteBottle[]} data.required - Lista de botellas de desecho
 */

/**
 * Waste Bottle model response
 * @typedef {object} WasteBottleResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {WasteBottle} data.required - Datos de la botella de desecho
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
