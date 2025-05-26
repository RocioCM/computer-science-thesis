import { Router, Request, Response } from 'express';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import AuthHandler from './authHandler';
import middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import { CreateUserDTO, UpdateUserDTO } from './domain/user';
import { Authenticate } from 'src/pkg/helpers/authHelper';

// Import necessary for express-jsdoc-swagger to get the schemas
import 'src/pkg/interfaces/swaggerSchemas';
import './domain/swaggerSchemas';

//---- Routers ----//

/**
 * POST /auth/register
 * @summary Registra un nuevo usuario
 * @tags 1. Autenticación - Operaciones de autenticación y gestión de usuarios
 * @param {CreateUserDTO} request.body.required - Datos del usuario a registrar
 * @return {AuthResponse} 201 - Usuario registrado exitosamente
 * @return {ErrorResponse400} 400 - Datos de registro inválidos
 * @example request - Ejemplo de registro
 * {
 *   "email": "usuario@ejemplo.com",
 *   "password": "contraseña123",
 *   "roleId": 2
 * }
 */
async function RegisterUser(req: Request, res: Response) {
  const parsedUserRes = await requestHelper.parseBody(req.body, CreateUserDTO);
  if (!parsedUserRes.ok) {
    responseHelper.build(res, parsedUserRes.status, parsedUserRes.data);
    return;
  }

  const { status, data } = await AuthHandler.RegisterUser(parsedUserRes.data);
  responseHelper.build(res, status, data);
}

/**
 * GET /auth/user
 * @summary Obtiene los datos del usuario autenticado
 * @tags 1. Autenticación - Operaciones de autenticación y gestión de usuarios
 * @security BearerAuth
 * @return {AuthResponse} 200 - Perfil del usuario
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Usuario no encontrado
 */
async function GetUserWithAuth(req: Request, res: Response) {
  const userRes = await Authenticate(req);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const { status, data } = await AuthHandler.GetUserWithAuth(userRes.data.uid);
  responseHelper.build(res, status, data);
}

/**
 * PUT /auth/user
 * @summary Actualiza los datos del usuario autenticado
 * @tags 1. Autenticación - Operaciones de autenticación y gestión de usuarios
 * @param {UpdateUserDTO} request.body.required - Datos del usuario a actualizar
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Perfil actualizado correctamente
 * @return {ErrorResponse400} 400 - Datos de perfil inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Usuario no encontrado
 * @example request - Ejemplo de actualización
 * {
 *   "userName": "NuevoNombre",
 *   "managerName": "NuevoManager",
 *   "phone": "+549123456789"
 * }
 */
async function UpdateUserWithAuth(req: Request, res: Response) {
  const userRes = await Authenticate(req);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedUserRes = await requestHelper.parseBody(req.body, UpdateUserDTO);
  if (!parsedUserRes.ok) {
    responseHelper.build(res, parsedUserRes.status, parsedUserRes.data);
    return;
  }

  const { status, data } = await AuthHandler.UpdateUserWithAuth(
    userRes.data.uid,
    parsedUserRes.data,
  );

  responseHelper.build(res, status, data);
}

//---- Routes configuration ----//

const AuthRouter = Router();

middlewareHelper.applyAsyncHandlerMiddleware(AuthRouter);

AuthRouter.post('/register', RegisterUser);
AuthRouter.get('/user', GetUserWithAuth);
AuthRouter.put('/user', UpdateUserWithAuth);

export default AuthRouter;
