import { Request, Response, Router } from 'express';
import middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import TrackingHandler from './trackingHandler';

// Import necessary for express-jsdoc-swagger to get the schemas
import 'src/pkg/interfaces/swaggerSchemas';
import './domain/swaggerSchemas';

//---- Routers ----//

/**
 * GET /tracking/user/{blockchainId}
 * @summary Obtiene datos públicos de un usuario por su ID de blockchain
 * @tags 6. Seguimiento - Operaciones de seguimiento
 * @param {string} blockchainId.path.required - ID de blockchain del usuario (dirección Ethereum)
 * @return {UserPublicProfileResponse} 200 - Información pública del usuario
 * @return {ErrorResponse404} 404 - Usuario no encontrado
 */
async function GetUserPublicData(req: Request, res: Response) {
  const blockchainId = req.params.blockchainId;

  const { status, data } =
    await TrackingHandler.GetUserPublicData(blockchainId);
  responseHelper.build(res, status, data);
}

/**
 * GET /tracking/base-batch/{id}
 * @summary Obtiene información de seguimiento de un lote de botellas base por su ID
 * @tags 6. Seguimiento - Operaciones de seguimiento
 * @param {number} id.path.required - ID del lote de botellas base
 * @return {BaseBottlesBatchResponse} 200 - Información de seguimiento del lote
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetBaseBottlesBatchById(req: Request, res: Response) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } =
    await TrackingHandler.GetBaseBottlesBatchById(batchId);
  responseHelper.build(res, status, data);
}

/**
 * GET /tracking/base-batch/{id}/products
 * @summary Obtiene todos los productos derivados de un lote de botellas base
 * @tags 6. Seguimiento - Operaciones de seguimiento
 * @param {number} id.path.required - ID del lote de botellas base
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @return {ProductBottlesBatchListResponse} 200 - Lista de lotes de productos derivados
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetAllProductsFromBaseBatch(req: Request, res: Response) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } = await TrackingHandler.GetAllProductsFromBaseBatch(
    batchId,
    page,
    limit,
  );
  responseHelper.build(res, status, data);
}

/**
 * GET /tracking/product-batch/{id}
 * @summary Obtiene información de seguimiento de un lote de botellas de producto por su ID
 * @tags 6. Seguimiento - Operaciones de seguimiento
 * @param {number} id.path.required - ID del lote de botellas de producto
 * @return {ProductBottlesBatchResponse} 200 - Información de seguimiento del lote
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetProductBatchById(req: Request, res: Response) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await TrackingHandler.GetProductBatchById(batchId);
  responseHelper.build(res, status, data);
}

/**
 * GET /tracking/product-batch/trackingCode/{code}
 * @summary Obtiene información de seguimiento de un lote de botellas de producto por su código de seguimiento
 * @tags 6. Seguimiento - Operaciones de seguimiento
 * @param {string} code.path.required - Código de seguimiento del lote
 * @return {ProductBottlesBatchResponse} 200 - Información de seguimiento del lote
 * @return {ErrorResponse404} 404 - Código de seguimiento no encontrado
 */
async function GetProductBatchByTrackingCode(req: Request, res: Response) {
  const trackingCode = req.params.code;

  const { status, data } =
    await TrackingHandler.GetProductBatchByTrackingCode(trackingCode);
  responseHelper.build(res, status, data);
}

/**
 * GET /tracking/product-batch/{id}/waste-bottles
 * @summary Obtiene todas las botellas de desecho derivadas de un lote de producto
 * @tags 6. Seguimiento - Operaciones de seguimiento
 * @param {number} id.path.required - ID del lote de botellas de producto
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @return {WasteBottleListResponse} 200 - Lista de botellas de desecho
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetAllWasteBottlesFromProductBatchById(
  req: Request,
  res: Response,
) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } =
    await TrackingHandler.GetAllWasteBottlesFromProductBatch(
      batchId,
      page,
      limit,
    );
  responseHelper.build(res, status, data);
}

/**
 * GET /tracking/waste-bottle/{id}
 * @summary Obtiene información de seguimiento de una botella de desecho por su ID
 * @tags 6. Seguimiento - Operaciones de seguimiento
 * @param {number} id.path.required - ID de la botella de desecho
 * @return {WasteBottleResponse} 200 - Información de seguimiento de la botella
 * @return {ErrorResponse400} 400 - ID de botella inválido
 * @return {ErrorResponse404} 404 - Botella no encontrada
 */
async function GetWasteBottleById(req: Request, res: Response) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await TrackingHandler.GetWasteBottleById(batchId);
  responseHelper.build(res, status, data);
}

/**
 * GET /tracking/recycling-batch/{id}
 * @summary Obtiene información de seguimiento de un lote de reciclaje por su ID
 * @tags 6. Seguimiento - Operaciones de seguimiento
 * @param {number} id.path.required - ID del lote de reciclaje
 * @return {RecycledMaterialBatchResponse} 200 - Información de seguimiento del lote
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetRecyclingBatchById(req: Request, res: Response) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await TrackingHandler.GetRecyclingBatchById(batchId);
  responseHelper.build(res, status, data);
}

/**
 * GET /tracking/recycling-batch/{id}/waste-bottles
 * @summary Obtiene todas las botellas de desecho utilizadas en un lote de reciclaje
 * @tags 6. Seguimiento - Operaciones de seguimiento
 * @param {number} id.path.required - ID del lote de reciclaje
 * @param {number} page.query - Número de página - default: 1
 * @param {number} limit.query - Límite de resultados por página - default: 10
 * @return {WasteBottleListResponse} 200 - Lista de botellas de desecho
 * @return {ErrorResponse400} 400 - ID de lote inválido
 * @return {ErrorResponse404} 404 - Lote no encontrado
 */
async function GetAllWasteBottlesFromRecyclingBatch(
  req: Request,
  res: Response,
) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  let page = requestHelper.parseUint(req.query.page);
  let limit = requestHelper.parseUint(req.query.limit);
  if (page === null) page = 1;
  if (limit === null) limit = 10;

  const { status, data } =
    await TrackingHandler.GetAllWasteBottlesFromRecyclingBatch(
      batchId,
      page,
      limit,
    );

  responseHelper.build(res, status, data);
}

//---- Routes configuration ----//

const TrackingRouter = Router();

middlewareHelper.applyAsyncHandlerMiddleware(TrackingRouter);

TrackingRouter.get('/user/:blockchainId', GetUserPublicData);
TrackingRouter.get('/base-batch/:id', GetBaseBottlesBatchById);
TrackingRouter.get('/base-batch/:id/products', GetAllProductsFromBaseBatch);
TrackingRouter.get('/product-batch/:id', GetProductBatchById);
TrackingRouter.get(
  '/product-batch/trackingCode/:code',
  GetProductBatchByTrackingCode,
);
TrackingRouter.get(
  '/product-batch/:id/waste-bottles',
  GetAllWasteBottlesFromProductBatchById,
);
TrackingRouter.get('/waste-bottle/:id', GetWasteBottleById);
TrackingRouter.get('/recycling-batch/:id', GetRecyclingBatchById);
TrackingRouter.get(
  '/recycling-batch/:id/waste-bottles',
  GetAllWasteBottlesFromRecyclingBatch,
);

export default TrackingRouter;
