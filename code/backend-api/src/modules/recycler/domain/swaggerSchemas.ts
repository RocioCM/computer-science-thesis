/**
 * Recycler's module schemas definition for Swagger documentation
 */

/**
 * Create Recycled Material Batch request
 * @typedef {object} CreateRecycledMaterialBatchRequest
 * @property {number} weight.required - Peso del material reciclado en kg
 * @property {string} size.required - Tamaño del material reciclado
 * @property {string} materialType.required - Tipo de material reciclado
 * @property {array<Material>} composition.required - Composición del material reciclado
 * @property {string} extraInfo - Información adicional
 * @property {string} buyerId - ID del comprador en Firebase
 * @property {number[]} wasteBottleIds.required - IDs de las botellas utilizadas
 */

/**
 * Recycle Creation response
 * @typedef {object} RecycleCreationResponse
 * @property {number} status.required - Código de estado HTTP 201
 * @property {RecycleBatchID} data.required - Datos del lote creado
 */

/**
 * Recycle Batch ID
 * @typedef {object} RecycleBatchID
 * @property {number} batchId.required - ID del lote de material reciclado creado
 */

/**
 * Update Recycled Material Batch request
 * @typedef {object} UpdateRecycledMaterialBatchRequest
 * @property {number} id.required - ID del lote de material reciclado
 * @property {number} weight - Peso del material reciclado en kg
 * @property {string} size - Tamaño del material reciclado
 * @property {string} materialType - Tipo de material reciclado
 * @property {array<Material>} composition - Composición del material reciclado
 * @property {string} extraInfo - Información adicional
 * @property {string} buyerId - ID del comprador en Firebase
 */

/**
 * Request for selling base bottles
 * @typedef {object} SellBaseBottlesRequest
 * @property {number} batchId.required - ID del lote
 * @property {string} buyerUid.required - ID del comprador
 */

/**
 * Request to assign Waste Bottle to Batch
 * @typedef {object} AssignWasteBottleToBatchRequest
 * @property {number} batchId.required - ID del lote
 * @property {number} bottleId.required - ID de la botella a asignar
 */
