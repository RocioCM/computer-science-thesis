/**
 * Auth module schemas definition for Swagger documentation
 */

/**
 * User creation DTO
 * @typedef {object} CreateUserDTO
 * @property {string} email.required - Email del usuario
 * @property {string} password.required - Contraseña del usuario
 * @property {number} roleId.required - ID del rol
 */

/**
 * User model as returned by the API
 * @typedef {object} User
 * @property {string} id.required - ID del usuario en la base de datos
 * @property {string} firebaseUid.required - ID único del usuario en Firebase
 * @property {string} email.required - Email del usuario
 * @property {string} blockchainId.required - ID del usuario en la blockchain (dirección ethereum)
 * @property {string} userName - Nombre de usuario
 * @property {string} managerName - Nombre del manager
 * @property {string} phone - Teléfono del usuario
 * @property {string} createdAt - Fecha de creación
 * @property {string} updatedAt - Fecha de actualización
 */

/**
 * Update user DTO
 * @typedef {object} UpdateUserDTO
 * @property {string} userName - Nombre de usuario
 * @property {string} managerName - Nombre del manager
 * @property {string} phone - Teléfono del usuario
 */

/**
 * Auth result
 * @typedef {object} AuthResponse
 * @property {number} status.required - Código de estado HTTP 200
 * @property {User} data.required - Datos de autenticación
 */
