import { Request, Response, Router } from 'express';
import { ROLES } from 'src/pkg/constants';
import { Authenticate } from 'src/pkg/helpers/authHelper';
import middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import ConsumerHandler from './consumerHandler';
import { CreateWasteBottleDTO } from './domain/wasteBottle';

// Import necessary for express-jsdoc-swagger to get the schemas
import 'src/pkg/interfaces/swaggerSchemas';
import './domain/swaggerSchemas';

//---- Routers ----//

/**
 * GET /consumer/origin/{trackingCode}
 * @summary Obtiene el origen de un producto por su código de seguimiento
 * @tags 4. Consumidor - Operaciones para consumidores de productos
 * @param {string} trackingCode.path.required - Código de seguimiento del producto
 * @return {TrackingOriginResponse} 200 - Información de origen del producto con etapas 'base' y 'product'
 * @return {ErrorResponse404} 404 - Código de seguimiento no encontrado
 */
async function GetProductOriginByTrackingCode(req: Request, res: Response) {
  const trackingCode = req.params.trackingCode;

  const { status, data } =
    await ConsumerHandler.GetProductOriginByTrackingCode(trackingCode);

  responseHelper.build(res, status, data);
}

/**
 * GET /consumer/waste
 * @summary Obtiene todas las botellas de desecho del consumidor autenticado
 * @tags 4. Consumidor - Operaciones para consumidores de productos
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @security BearerAuth
 * @return {WasteBottleListResponse} 200 - Lista de botellas de desecho
 * @return {ErrorResponse401} 401 - No autorizado
 */
async function GetAllUserWasteBottles(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.CONSUMER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } = await ConsumerHandler.GetAllUserWasteBottles(
    userRes.data.uid,
    page,
    limit,
  );

  responseHelper.build(res, status, data);
}

/**
 * GET /consumer/waste/{id}
 * @summary Obtiene el seguimiento de una botella de desecho
 * @tags 4. Consumidor - Operaciones para consumidores de productos
 * @param {number} id.path.required - ID de la botella de desecho
 * @security BearerAuth
 * @return {TrackingRecyclingResponse} 200 - Información de seguimiento de la botella con etapas 'pickup' y 'recycling'
 * @return {ErrorResponse400} 400 - ID de botella inválido
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Botella no encontrada
 */
async function GetWasteBottleTracking(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.CONSUMER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid bottle ID');
    return;
  }

  const { status, data } = await ConsumerHandler.GetWasteBottleTracking(id);

  responseHelper.build(res, status, data);
}

/**
 * GET /consumer/recyclers
 * @summary Obtiene recicladores filtrados por término de búsqueda
 * @tags 4. Consumidor - Operaciones para consumidores de productos
 * @param {string} query.query - Término de búsqueda para filtrar recicladores
 * @security BearerAuth
 * @return {BuyersListResponse} 200 - Lista de recicladores
 * @return {ErrorResponse401} 401 - No autorizado
 */
async function GetFilteredRecyclers(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.CONSUMER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const searchQuery = req.query.query as string;

  const { status, data } =
    await ConsumerHandler.GetFilteredRecyclers(searchQuery);

  responseHelper.build(res, status, data);
}

/**
 * POST /consumer/waste
 * @summary Registra una botella de desecho
 * @tags 4. Consumidor - Operaciones para consumidores de productos
 * @param {CreateWasteBottleRequest} request.body.required - Datos de la botella de desecho
 * @security BearerAuth
 * @return {CreateWasteBottleResponse} 201 - Botella registrada exitosamente con bottleId
 * @return {ErrorResponse400} 400 - Datos de botella inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @example request - Ejemplo de registro de botella
 * {
 *   "trackingCode": "ABC123XYZ",
 *   "owner": "firebase-uid-del-propietario"
 * }
 */
async function CreateWasteBottle(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.CONSUMER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    CreateWasteBottleDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await ConsumerHandler.CreateWasteBottle(
    userRes.data.uid,
    parsedBodyRes.data,
  );

  responseHelper.build(res, status, data);
}

/**
 * DELETE /consumer/waste/{id}
 * @summary Elimina una botella de desecho
 * @tags 4. Consumidor - Operaciones para consumidores de productos
 * @param {number} id.path.required - ID de la botella de desecho
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Botella eliminada correctamente
 * @return {ErrorResponse400} 400 - ID de botella inválido
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Botella no encontrada
 * @return {ErrorResponse409} 409 - La botella ya ha sido reciclada
 */
async function DeleteWasteBottle(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.CONSUMER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid bottle ID');
    return;
  }

  const { status, data } = await ConsumerHandler.DeleteWasteBottle(
    userRes.data.uid,
    id,
  );

  responseHelper.build(res, status, data);
}

//---- Routes configuration ----//

const ConsumerRouter = Router();

middlewareHelper.applyAsyncHandlerMiddleware(ConsumerRouter);

ConsumerRouter.get('/origin/:trackingCode', GetProductOriginByTrackingCode);
ConsumerRouter.get('/waste', GetAllUserWasteBottles);
ConsumerRouter.get('/waste/:id', GetWasteBottleTracking);
ConsumerRouter.get('/recyclers', GetFilteredRecyclers);

ConsumerRouter.post('/waste', CreateWasteBottle);

ConsumerRouter.delete('/waste/:id', DeleteWasteBottle);

export default ConsumerRouter;
