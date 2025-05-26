/**
 * Secondary Producer's module schemas definition for Swagger documentation
 */

/**
 * Update Tracking Code request
 * @typedef {object} UpdateTrackingCodeRequest
 * @property {number} id.required - ID del lote
 * @property {string} trackingCode.required - Código de seguimiento
 */

/**
 * Recycle Base Bottles request
 * @typedef {object} RecycleBaseBottlesRequest
 * @property {number} productBatchId.required - ID del lote de producto
 * @property {number} quantity.required - Cantidad de botellas a reciclar
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

/**
 * Sell Product Bottles request
 * @typedef {object} SellProductBottlesRequest
 * @property {number} batchId.required - ID del lote
 * @property {number} quantity.required - Cantidad de botellas a vender
 * @property {string} buyerUid.required - UID del comprador en Firebase
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
 * @property {number} soldProductId.required - ID del lote de producto vendido
 */
