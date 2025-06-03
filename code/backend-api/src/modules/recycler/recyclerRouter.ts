import { Request, Response, Router } from 'express';
import { ROLES } from 'src/pkg/constants';
import { Authenticate } from 'src/pkg/helpers/authHelper';
import middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import RecyclerHandler from './recyclerHandler';
import {
  AssignWasteBottleToBatchDTO,
  CreateRecyclingBatchDTO,
  SellRecyclingBatchDTO,
  UpdateRecyclingBatchDTO,
} from './domain/recycledMaterialBatch';

// Import necessary for express-jsdoc-swagger to get the schemas
import 'src/pkg/interfaces/swaggerSchemas';
import './domain/swaggerSchemas';

//---- Routers ----//

/**
 * GET /recycler/bottle/origin/{trackingCode}
 * @summary Obtiene información sobre una botella por su código de seguimiento
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {string} trackingCode.path.required - Código de seguimiento de la botella
 * @return {TrackingOriginResponse} 200 - Información de la botella
 * @return {ErrorResponse404} 404 - Código de seguimiento no encontrado
 */
async function GetBottleInfoByTrackingCode(req: Request, res: Response) {
  const trackingCode = req.params.trackingCode;

  const { status, data } =
    await RecyclerHandler.GetBottleInfoByTrackingCode(trackingCode);
  responseHelper.build(res, status, data);
}

/**
 * GET /recycler/bottle/tracking/{id}
 * @summary Obtiene el seguimiento de una botella de desecho
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {number} id.path.required - ID de la botella de desecho
 * @return {TrackingRecyclingResponse} 200 - Información de seguimiento de la botella
 * @return {ErrorResponse400} 400 - ID de botella inválido
 * @return {ErrorResponse404} 404 - Botella no encontrada
 */
async function GetWasteBottleTracking(req: Request, res: Response) {
  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid bottle ID');
    return;
  }

  const { status, data } = await RecyclerHandler.GetWasteBottleTracking(id);
  responseHelper.build(res, status, data);
}

/**
 * GET /recycler/bottles
 * @summary Obtiene todas las botellas de desecho asignadas al reciclador autenticado
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @security BearerAuth
 * @return {WasteBottleListResponse} 200 - Lista de botellas de desecho
 * @return {ErrorResponse401} 401 - No autorizado
 */
async function GetAllUserWasteBottles(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } = await RecyclerHandler.GetAllUserWasteBottles(
    userRes.data.uid,
    page,
    limit,
  );
  responseHelper.build(res, status, data);
}

/**
 * GET /recycler/bottles/available
 * @summary Obtiene las botellas de desecho disponibles para reciclar por el reciclador autenticado
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @security BearerAuth
 * @return {WasteBottleListResponse} 200 - Lista de botellas disponibles
 * @return {ErrorResponse401} 401 - No autorizado
 */
async function GetUserAvailableWasteBottles(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } = await RecyclerHandler.GetUserAvailableWasteBottles(
    userRes.data.uid,
    page,
    limit,
  );
  responseHelper.build(res, status, data);
}

/**
 * GET /recycler/batches
 * @summary Obtiene todos los lotes de reciclaje del reciclador autenticado
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @security BearerAuth
 * @return {RecycledMaterialBatchListResponse} 200 - Lista de lotes de reciclaje
 * @return {ErrorResponse401} 401 - No autorizado
 */
async function GetAllUserRecyclingBatches(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } = await RecyclerHandler.GetAllUserRecyclingBatches(
    userRes.data.uid,
    page,
    limit,
  );
  responseHelper.build(res, status, data);
}

/**
 * GET /recycler/batch/{id}
 * @summary Obtiene un lote de reciclaje por su ID
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {number} id.path.required - ID del lote de reciclaje
 * @security BearerAuth
 * @return {RecycledMaterialBatchResponse} 200 - Información del lote de reciclaje
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetRecyclingBatchById(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await RecyclerHandler.GetRecyclingBatchById(id);
  responseHelper.build(res, status, data);
}

/**
 * GET /recycler/buyers
 * @summary Obtiene compradores filtrados por término de búsqueda
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {string} query.query - Término de búsqueda para filtrar compradores
 * @security BearerAuth
 * @return {BuyersListResponse} 200 - Lista de compradores
 * @return {ErrorResponse401} 401 - No autorizado
 */
async function GetFilteredBuyers(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const searchQuery = req.query.query as string;

  const { status, data } = await RecyclerHandler.GetFilteredBuyers(searchQuery);
  responseHelper.build(res, status, data);
}

/**
 * POST /recycler/batch
 * @summary Crea un nuevo lote de material reciclado
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {CreateRecycledMaterialBatchRequest} request.body.required - Datos del lote de reciclaje
 * @security BearerAuth
 * @return {RecycleCreationResponse} 201 - Lote de reciclaje creado exitosamente
 * @return {ErrorResponse400} 400 - Datos de lote inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @example request - Ejemplo de creación de lote de reciclaje
 * {
 *   "weight": 10.5,
 *   "size": "Pequeño",
 *   "materialType": "Vidrio triturado",
 *   "composition": [
 *     { "name": "Vidrio verde", "amount": 70, "measureUnit": "%" },
 *     { "name": "Vidrio transparente", "amount": 30, "measureUnit": "%" }
 *   ],
 *   "extraInfo": "Material listo para reutilización",
 *   "wasteBottleIds": [1, 2, 3, 4]
 * }
 */
async function CreateRecyclingBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    CreateRecyclingBatchDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await RecyclerHandler.CreateRecyclingBatch(
    userRes.data.uid,
    parsedBodyRes.data,
  );
  responseHelper.build(res, status, data);
}

/**
 * PUT /recycler/batch
 * @summary Actualiza un lote de material reciclado existente
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {UpdateRecycledMaterialBatchRequest} request.body.required - Datos actualizados del lote
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Lote actualizado correctamente
 * @return {ErrorResponse400} 400 - Datos inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 * @example request - Ejemplo de actualización de lote
 * {
 *   "id": 1,
 *   "weight": 12.5,
 *   "size": "Mediano",
 *   "materialType": "Vidrio triturado refinado",
 *   "composition": [
 *     { "name": "Vidrio verde", "amount": 60, "measureUnit": "%" },
 *     { "name": "Vidrio transparente", "amount": 40, "measureUnit": "%" }
 *   ],
 *   "extraInfo": "Material procesado y listo para uso industrial",
 *   "wasteBottleIds": [1, 2, 3]
 * }
 */
async function UpdateRecyclingBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    UpdateRecyclingBatchDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await RecyclerHandler.UpdateRecyclingBatch(
    userRes.data.uid,
    parsedBodyRes.data,
  );
  responseHelper.build(res, status, data);
}

/**
 * DELETE /recycler/batch/{id}
 * @summary Elimina un lote de material reciclado
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {number} id.path.required - ID del lote de reciclaje
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Lote eliminado correctamente
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function DeleteRecyclingBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await RecyclerHandler.DeleteRecyclingBatch(
    userRes.data.uid,
    id,
  );
  responseHelper.build(res, status, data);
}

/**
 * PUT /recycler/batch/sell
 * @summary Registra la venta de un lote de material reciclado
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {SellBaseBottlesRequest} request.body.required - Datos de la venta
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Venta registrada correctamente
 * @return {ErrorResponse400} 400 - Datos inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 * @example request - Ejemplo de venta de lote
 * {
 *   "batchId": 1,
 *   "buyerUid": "firebase-uid-del-comprador"
 * }
 */
async function SellRecyclingBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    SellRecyclingBatchDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await RecyclerHandler.SellRecyclingBatch(
    userRes.data.uid,
    parsedBodyRes.data,
  );
  responseHelper.build(res, status, data);
}

/**
 * PUT /recycler/bottle/assign
 * @summary Asigna una botella de desecho a un lote de reciclaje
 * @tags 5. Reciclador - Operaciones para recicladores
 * @param {AssignWasteBottleToBatchRequest} request.body.required - Datos de asignación
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Botella asignada correctamente
 * @return {ErrorResponse400} 400 - Datos inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Botella o lote no encontrado
 * @example request - Ejemplo de asignación de botella
 * {
 *   "bottleId": 1,
 *   "batchId": 2
 * }
 */
async function AssignBottleToBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.RECYCLER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    AssignWasteBottleToBatchDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await RecyclerHandler.AssignBottleToBatch(
    userRes.data.uid,
    parsedBodyRes.data,
  );

  responseHelper.build(res, status, data);
}

//---- Routes configuration ----//

const RecyclerRouter = Router();

middlewareHelper.applyAsyncHandlerMiddleware(RecyclerRouter);

RecyclerRouter.get('/bottle/origin/:trackingCode', GetBottleInfoByTrackingCode);
RecyclerRouter.get('/bottle/tracking/:id', GetWasteBottleTracking);
RecyclerRouter.get('/bottles', GetAllUserWasteBottles);
RecyclerRouter.get('/bottles/available', GetUserAvailableWasteBottles);
RecyclerRouter.get('/batch/:id', GetRecyclingBatchById);
RecyclerRouter.get('/batches', GetAllUserRecyclingBatches);
RecyclerRouter.get('/buyers', GetFilteredBuyers);

RecyclerRouter.post('/batch', CreateRecyclingBatch);

RecyclerRouter.put('/batch', UpdateRecyclingBatch);
RecyclerRouter.put('/batch/sell', SellRecyclingBatch);
RecyclerRouter.put('/bottle/assign', AssignBottleToBatch);

RecyclerRouter.delete('/batch/:id', DeleteRecyclingBatch);

export default RecyclerRouter;
