import { Request, Response, Router } from 'express';
import { ROLES } from 'src/pkg/constants';
import { Authenticate } from 'src/pkg/helpers/authHelper';
import middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import {
  CreateBaseBottlesBatchDTO,
  RecycleBaseBottlesDTO,
  SellBaseBottlesDTO,
  UpdateBaseBottlesBatchDTO,
} from './domain/baseBatch';
import ProducerHandler from './producerHandler';

// Import necessary for express-jsdoc-swagger to get the schemas
import 'src/pkg/interfaces/swaggerSchemas';
import './domain/swaggerSchemas';

//---- Routers ----//

/**
 * GET /producer/batch/{id}
 * @summary Obtiene un lote de botellas base por su ID
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {number} id.path.required - ID del lote
 * @security BearerAuth
 * @return {BaseBottlesBatchResponse} 200 - Lote encontrado
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetBatchById(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await ProducerHandler.GetBatchById(id);

  responseHelper.build(res, status, data);
}

/**
 * GET /producer/batches/user
 * @summary Obtiene todos los lotes de botellas base del usuario autenticado
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @security BearerAuth
 * @return {BaseBottlesBatchListResponse} 200 - Lista paginada de lotes
 * @return {ErrorResponse401} 401 - No autorizado
 */
async function GetAllBatchesByUser(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } = await ProducerHandler.GetAllBatchesByUser(
    userRes.data.uid,
    page,
    limit,
  );

  responseHelper.build(res, status, data);
}

/**
 * POST /producer/batch
 * @summary Crea un nuevo lote de botellas base
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {CreateBaseBottlesBatchRequest} request.body.required - Datos del lote
 * @security BearerAuth
 * @return {CreationResponse} 201 - Lote creado exitosamente
 * @return {ErrorResponse400} 400 - Datos de lote inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @example request - Ejemplo de lote
 * {
 *   "quantity": 100,
 *   "bottleType": {
 *     "weight": 500,
 *     "color": "Verde",
 *     "thickness": 2,
 *     "shapeType": "Cuello alto",
 *     "originLocation": "Argentina",
 *     "extraInfo": "Vidrio reciclado",
 *     "composition": [{ "name": "Calcín", "amount": 100, "measureUnit": "%" }]
 *   },
 *   "createdAt": "2025-05-22T10:00:00Z"
 * }
 */
async function CreateBaseBottlesBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    CreateBaseBottlesBatchDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await ProducerHandler.CreateBaseBottlesBatch(
    userRes.data.uid,
    parsedBodyRes.data,
  );

  responseHelper.build(res, status, data);
}

/**
 * PUT /producer/batch
 * @summary Actualiza un lote de botellas base existente
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {UpdateBaseBottlesBatchRequest} request.body.required - Datos del lote
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Lote actualizado correctamente
 * @return {ErrorResponse400} 400 - Datos de lote inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 * @return {ErrorResponse409} 409 - Lote ya no se puede actualizar
 * @example request - Ejemplo de lote
 * {
 *  "id": 1,
 *  "quantity": 100,
 *  "bottleType": {
 *    "weight": 500,
 *    "color": "Verde",
 *    "thickness": 2,
 *    "shapeType": "Cuello alto",
 *    "originLocation": "Argentina",
 *    "extraInfo": "Vidrio reciclado",
 *    "composition": [{ "name": "Calcín", "amount": 100, "measureUnit": "%" }]
 *   },
 *   "createdAt": "2025-05-22T10:00:00Z"
 * }
 */
async function UpdateBaseBottlesBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    UpdateBaseBottlesBatchDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await ProducerHandler.UpdateBaseBottlesBatch(
    userRes.data.uid,
    parsedBodyRes.data,
  );

  responseHelper.build(res, status, data);
}

/**
 * DELETE /producer/batch/{id}
 * @summary Elimina un lote de botellas base
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {number} id.path.required - ID del lote
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Lote eliminado correctamente
 * @return {ErrorResponse} 400 - ID de lote inválido
 * @return {ErrorResponse} 401 - No autorizado
 * @return {ErrorResponse} 404 - Lote no encontrado
 * @return {ErrorResponse} 409 - Lote ya no se puede eliminar
 */
async function DeleteBaseBottlesBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await ProducerHandler.DeleteBaseBottlesBatch(
    userRes.data.uid,
    id,
  );

  responseHelper.build(res, status, data);
}

/**
 * PUT /producer/batch/sell
 * @summary Registra la venta de botellas base
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {SellBaseBottlesRequest} request.body.required - Datos de la venta
 * @security BearerAuth
 * @return {SellResponse} 200 - Venta registrada correctamente
 * @return {ErrorResponse} 400 - Datos de venta inválidos
 * @return {ErrorResponse} 401 - No autorizado
 * @return {ErrorResponse} 404 - Lote no encontrado
 * @return {ErrorResponse} 409 - Lote ya no está disponible
 */
async function SellBaseBottles(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    SellBaseBottlesDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await ProducerHandler.SellBaseBottles(
    userRes.data.uid,
    parsedBodyRes.data,
  );

  responseHelper.build(res, status, data);
}

/**
 * PUT /producer/batch/recycle
 * @summary Registra el reciclado de un lote de botellas base
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {RecycleBaseBottlesRequest} request.body.required - Datos del reciclado
 * @security BearerAuth
 * @return {RecycleResponse} 200 - Reciclado registrado correctamente
 * @return {ErrorResponse} 400 - Datos de reciclado inválidos
 * @return {ErrorResponse} 401 - No autorizado
 * @return {ErrorResponse} 404 - Lote no encontrado
 * @return {ErrorResponse} 409 - Lote ya no está disponible
 */
async function RecycleBaseBottlesBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    RecycleBaseBottlesDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await ProducerHandler.RecycleBaseBottlesBatch(
    userRes.data.uid,
    parsedBodyRes.data.batchId,
    parsedBodyRes.data.quantity,
  );

  responseHelper.build(res, status, data);
}

/**
 * GET /producer/buyers
 * @summary Obtiene compradores filtrados por término de búsqueda
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {string} query.query - Término de búsqueda para filtrar compradores
 * @security BearerAuth
 * @return {BuyersListResponse} 200 - Lista de compradores filtrados
 * @return {ErrorResponse} 401 - No autorizado
 */
async function GetFilteredBuyers(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const searchQuery = req.query.query as string;

  const { status, data } = await ProducerHandler.GetFilteredBuyers(searchQuery);

  responseHelper.build(res, status, data);
}

/**
 * GET /producer/recycled-batches
 * @summary Obtiene todos los lotes de reciclaje del usuario autenticado
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @security BearerAuth
 * @return {RecycledMaterialBatchListResponse} 200 - Lista paginada de lotes de reciclaje
 * @return {ErrorResponse} 401 - No autorizado
 */
async function GetAllUserRecyclingBatches(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } = await ProducerHandler.GetAllUserRecyclingBatches(
    userRes.data.uid,
    page,
    limit,
  );

  responseHelper.build(res, status, data);
}

/**
 * GET /producer/recycled-batch/{id}
 * @summary Obtiene un lote de reciclaje por su ID
 * @tags 2. Productor Primario - Operaciones para productores de botellas
 * @param {number} id.path.required - ID del lote de reciclaje
 * @security BearerAuth
 * @return {RecycledMaterialBatchResponse} 200 - Lote de reciclaje encontrado
 * @return {ErrorResponse} 400 - ID de lote inválido
 * @return {ErrorResponse} 401 - No autorizado
 * @return {ErrorResponse} 404 - Lote no encontrado
 */
async function GetRecyclingBatchById(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await ProducerHandler.GetRecyclingBatchById(id);

  responseHelper.build(res, status, data);
}

//---- Routes configuration ----//

const ProducerRouter = Router();

middlewareHelper.applyAsyncHandlerMiddleware(ProducerRouter);

ProducerRouter.get('/batch/:id', GetBatchById);
ProducerRouter.get('/batches/user', GetAllBatchesByUser);
ProducerRouter.get('/buyers', GetFilteredBuyers);
ProducerRouter.get('/recycled-batch/:id', GetRecyclingBatchById);
ProducerRouter.get('/recycled-batches', GetAllUserRecyclingBatches);

ProducerRouter.post('/batch', CreateBaseBottlesBatch);

ProducerRouter.put('/batch', UpdateBaseBottlesBatch);
ProducerRouter.put('/batch/sell', SellBaseBottles);
ProducerRouter.put('/batch/recycle', RecycleBaseBottlesBatch);

ProducerRouter.delete('/batch/:id', DeleteBaseBottlesBatch);

export default ProducerRouter;
