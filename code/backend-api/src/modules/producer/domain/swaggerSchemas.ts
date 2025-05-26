/**
 * Producer's module schemas definition for Swagger documentation
 */

/**
 * Request for creating a new base bottles batch
 * @typedef {object} CreateBaseBottlesBatchRequest
 * @property {number} quantity.required - Cantidad de botellas en el lote
 * @property {Bottle} bottleType.required - Tipo de botella
 * @property {string} createdAt.required - Fecha de creación
 */

/**
 * Request for updating an existing base bottles batch
 * @typedef {object} UpdateBaseBottlesBatchRequest
 * @property {number} id.required - ID del lote
 * @property {number} quantity.required - Cantidad de botellas en el lote
 * @property {Bottle} bottleType.required - Tipo de botella
 * @property {string} createdAt.required - Fecha de creación
 */

/**
 * Request for selling base bottles
 * @typedef {object} SellBaseBottlesRequest
 * @property {number} batchId.required - ID del lote
 * @property {number} quantity.required - Cantidad de botellas a vender
 * @property {string} buyerUid.required - ID del comprador
 */

/**
 * Request for recycling base bottles
 * @typedef {object} RecycleBaseBottlesRequest
 * @property {number} batchId.required - ID del lote
 * @property {number} quantity.required - Cantidad de botellas a reciclar
 */

/**
 * Creation response
 * @typedef {object} CreationResponse
 * @property {number} status.required - HTTP status code 200
 * @property {BaseBatchID} data.required - Response data
 */

/**
 * Base Batch ID
 * @typedef {object} BaseBatchID
 * @property {number} batchId.required - ID del lote creado
 */

/**
 * Sell response
 * @typedef {object} SellResponse
 * @property {number} status.required - HTTP status code 200
 * @property {SellID} data.required - Response data
 */

/**
 * Sell ID
 * @typedef {object} SellID
 * @property {number} productBatchId.required - ID del lote de producto creado
 */

/**
 * Recycle response
 * @typedef {object} RecycleResponse
 * @property {number} status.required - HTTP status code 200
 * @property {RecycleID} data.required - Response data
 */

/**
 * Recycle ID
 * @typedef {object} RecycleID
 * @property {number} recyclingBatchId.required - ID del lote de reciclaje creado
 */
