/**
 * Tracking module schemas definition for Swagger documentation
 */

/**
 * User public profile
 * @typedef {object} UserPublicProfile
 * @property {string} email.required - Email del usuario
 * @property {string} blockchainId.required - ID del usuario en la blockchain (dirección ethereum)
 * @property {string} userName - Nombre de usuario
 * @property {string} phone - Teléfono del usuario
 */

/**
 * User public profile response
 * @typedef {object} UserPublicProfileResponse
 * @property {number} status.required - HTTP status code - example:200
 * @property {UserPublicProfile} data.required - Datos del perfil público
 */
