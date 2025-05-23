import { Request, Response, Router } from 'express';
import { ROLES } from 'src/pkg/constants';
import { Authenticate } from 'src/pkg/helpers/authHelper';
import middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import {
  UpdateTrackingCodeDTO,
  RecycleBaseBottlesDTO,
  SellProductBottlesDTO,
} from './domain/productBatch';
import SecondaryProducerHandler from './secondaryProducerHandler';

// Import necessary for express-jsdoc-swagger to get the schemas
import 'src/pkg/interfaces/swaggerSchemas';
import './domain/swaggerSchemas';

//---- Routers ----//

/**
 * GET /secondary-producer/batch/{id}
 * @summary Obtiene un lote de botellas de producto por su ID
 * @tags 3. Productor Secundario - Operaciones para productores de productos
 * @param {number} id.path.required - ID del lote
 * @security BearerAuth
 * @return {ProductBottlesBatchResponse} 200 - Lote encontrado
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetBatchById(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.SECONDARY_PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await SecondaryProducerHandler.GetBatchById(id);
  responseHelper.build(res, status, data);
}

/**
 * GET /secondary-producer/batch/base/{id}
 * @summary Obtiene un lote de botellas base por su ID
 * @tags 3. Productor Secundario - Operaciones para productores de productos
 * @param {number} id.path.required - ID del lote
 * @security BearerAuth
 * @return {BaseBottlesBatchResponse} 200 - Lote encontrado
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetBaseBatchById(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.SECONDARY_PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await SecondaryProducerHandler.GetBaseBatchById(id);
  responseHelper.build(res, status, data);
}

/**
 * GET /secondary-producer/batches/user
 * @summary Obtiene todos los lotes de botellas de producto del usuario autenticado
 * @tags 3. Productor Secundario - Operaciones para productores de productos
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @security BearerAuth
 * @return {ProductBottlesBatchListResponse} 200 - Lista paginada de lotes
 * @return {ErrorResponse401} 401 - No autorizado
 */
async function GetAllBatchesByUser(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.SECONDARY_PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } = await SecondaryProducerHandler.GetAllBatchesByUser(
    userRes.data.uid,
    page,
    limit,
  );
  responseHelper.build(res, status, data);
}

/**
 * GET /secondary-producer/buyers
 * @summary Obtiene una lista de compradores filtrados por término de búsqueda
 * @tags 3. Productor Secundario - Operaciones para productores de productos
 * @param {string} query.query.required - Término de búsqueda
 * @security BearerAuth
 * @return {BuyersListResponse} 200 - Lista de compradores
 * @return {ErrorResponse401} 401 - No autorizado
 */
async function GetFilteredBuyers(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.SECONDARY_PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const searchQuery = req.query.query as string;

  const { status, data } =
    await SecondaryProducerHandler.GetFilteredBuyers(searchQuery);
  responseHelper.build(res, status, data);
}

/**
 * PUT /secondary-producer/batch/code
 * @summary Actualiza el código de seguimiento de un lote de botellas de producto
 * @tags 3. Productor Secundario - Operaciones para productores de productos
 * @param {UpdateTrackingCodeRequest} request.body.required - Datos para actualizar el código de seguimiento
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Código de seguimiento actualizado correctamente
 * @return {ErrorResponse400} 400 - Datos inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 * @example request - Ejemplo de actualización
 * {
 *   "id": 1,
 *   "trackingCode": "ABC123XYZ"
 * }
 */
async function UpdateProductBatchTrackingCode(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.SECONDARY_PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    UpdateTrackingCodeDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } =
    await SecondaryProducerHandler.UpdateProductBatchTrackingCode(
      userRes.data.uid,
      parsedBodyRes.data,
    );
  responseHelper.build(res, status, data);
}

/**
 * DELETE /secondary-producer/batch/code/{id}
 * @summary Elimina el código de seguimiento de un lote de botellas de producto
 * @tags 3. Productor Secundario - Operaciones para productores de productos
 * @param {number} id.path.required - ID del lote
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Código de seguimiento eliminado correctamente
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function DeleteProductBatchTrackingCode(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.SECONDARY_PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } =
    await SecondaryProducerHandler.DeleteProductBatchTrackingCode(
      userRes.data.uid,
      batchId,
    );
  responseHelper.build(res, status, data);
}

/**
 * PUT /secondary-producer/batch/reject/{id}
 * @summary Rechaza un lote de botellas base
 * @tags 3. Productor Secundario - Operaciones para productores de productos
 * @param {number} id.path.required - ID del lote
 * @security BearerAuth
 * @return {SuccessResponse} 200 - Lote rechazado correctamente
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function RejectBaseBottlesBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.SECONDARY_PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } =
    await SecondaryProducerHandler.RejectBaseBottlesBatch(
      userRes.data.uid,
      batchId,
    );
  responseHelper.build(res, status, data);
}

/**
 * PUT /secondary-producer/batch/recycle
 * @summary Recicla botellas de un lote de producto
 * @tags 3. Productor Secundario - Operaciones para productores de productos
 * @param {RecycleBaseBottlesRequest} request.body.required - Datos para el reciclaje
 * @security BearerAuth
 * @return {RecycleResponse} 200 - Reciclaje registrado correctamente
 * @return {ErrorResponse400} 400 - Datos inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 * @example request - Ejemplo de reciclaje
 * {
 *   "productBatchId": 1,
 *   "quantity": 50
 * }
 */
async function RecycleBaseBottles(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.SECONDARY_PRODUCER);
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

  const { status, data } = await SecondaryProducerHandler.RecycleBaseBottles(
    userRes.data.uid,
    parsedBodyRes.data,
  );
  responseHelper.build(res, status, data);
}

/**
 * PUT /secondary-producer/batch/sell
 * @summary Vende botellas de un lote de producto
 * @tags 3. Productor Secundario - Operaciones para productores de productos
 * @param {SellProductBottlesRequest} request.body.required - Datos para la venta
 * @security BearerAuth
 * @return {SellResponse} 200 - Venta registrada correctamente
 * @return {ErrorResponse400} 400 - Datos inválidos
 * @return {ErrorResponse401} 401 - No autorizado
 * @return {ErrorResponse404} 404 - Lote no encontrado
 * @example request - Ejemplo de venta
 * {
 *   "batchId": 1,
 *   "quantity": 50,
 *   "buyerUid": "firebase-uid-del-comprador"
 * }
 */
async function SellProductBottles(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.SECONDARY_PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedBodyRes = await requestHelper.parseBody(
    req.body,
    SellProductBottlesDTO,
  );
  if (!parsedBodyRes.ok) {
    responseHelper.build(res, parsedBodyRes.status, parsedBodyRes.data);
    return;
  }

  const { status, data } = await SecondaryProducerHandler.SellProductBottles(
    userRes.data.uid,
    parsedBodyRes.data,
  );

  responseHelper.build(res, status, data);
}

//---- Routes configuration ----//

const SecondaryProducerRouter = Router();

middlewareHelper.applyAsyncHandlerMiddleware(SecondaryProducerRouter);

SecondaryProducerRouter.get('/batch/:id', GetBatchById);
SecondaryProducerRouter.get('/batch/base/:id', GetBaseBatchById);
SecondaryProducerRouter.get('/batches/user', GetAllBatchesByUser);
SecondaryProducerRouter.get('/buyers', GetFilteredBuyers);

SecondaryProducerRouter.put('/batch/code', UpdateProductBatchTrackingCode);
SecondaryProducerRouter.put('/batch/reject/:id', RejectBaseBottlesBatch);
SecondaryProducerRouter.put('/batch/recycle', RecycleBaseBottles);
SecondaryProducerRouter.put('/batch/sell', SellProductBottles);

SecondaryProducerRouter.delete(
  '/batch/code/:id',
  DeleteProductBatchTrackingCode,
);

export default SecondaryProducerRouter;
