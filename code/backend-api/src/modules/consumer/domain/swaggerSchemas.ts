/**
 * Consumer's module schemas definition for Swagger documentation
 */

/**
 * Create Waste Bottle request
 * @typedef {object} CreateWasteBottleRequest
 * @property {string} trackingCode.required - Código de seguimiento de la botella de producto
 * @property {string} owner.required - ID de Firebase del propietario de la botella
 */

/**
 * Create Waste Bottle response
 * @typedef {object} CreateWasteBottleResponse
 * @property {number} status.required - Código de estado HTTP 201
 * @property {WasteBottleID} data.required - Datos de la botella creada
 */

/**
 * Waste Bottle ID
 * @typedef {object} WasteBottleID
 * @property {number} bottleId.required - ID de la botella de desecho creada
 */

/**
 * Waste Bottle creation response
 * @typedef {object} WasteBottleCreationResponse
 * @property {number} status.required - Código de estado HTTP 201
 * @property {WasteBottleID} data.required - Datos de la botella creada
 */

/**
 * Waste Bottle ID
 * @typedef {object} WasteBottleID
 * @property {number} bottleId.required - ID de la botella de desecho creada
 */

/**
 * Tracking Origin data object
 * @typedef {object} TrackingOriginData
 * @property {string} stage.required - Etapa del ciclo de vida - enum:base,product
 * @property {object} data.required - Datos de la etapa, varía según la etapa
 */

/**
 * Tracking Origin response
 * @typedef {object} TrackingOriginResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {TrackingOriginData[]} data.required - Datos del seguimiento de origen
 */

/**
 * Tracking Recycling data object
 * @typedef {object} TrackingRecyclingData
 * @property {string} stage.required - Etapa del ciclo de vida - enum:pickup,recycling
 * @property {object} data.required - Datos de la etapa, varía según la etapa
 */

/**
 * Tracking Recycling response
 * @typedef {object} TrackingRecyclingResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {TrackingRecyclingData[]} data.required - Datos del seguimiento de reciclaje
 */

/**
 * Recycler information
 * @typedef {object} RecyclerInfo
 * @property {string} firebaseUid.required - UID del reciclador en Firebase
 * @property {string} email.required - Correo del reciclador
 * @property {string} userName.required - Nombre del reciclador
 */

/**
 * Recyclers list response
 * @typedef {object} RecyclersListResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {RecyclerInfo[]} data.required - Lista de recicladores
 */
