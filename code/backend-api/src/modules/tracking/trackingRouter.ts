import { Request, Response, Router } from 'express';
import middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import TrackingHandler from './trackingHandler';

//---- Routers ----//

async function GetUserPublicData(req: Request, res: Response) {
  const blockchainId = req.params.blockchainId;

  const { status, data } =
    await TrackingHandler.GetUserPublicData(blockchainId);

  responseHelper.build(res, status, data);
}

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

async function GetProductBatchById(req: Request, res: Response) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await TrackingHandler.GetProductBatchById(batchId);

  responseHelper.build(res, status, data);
}

async function GetProductBatchByTrackingCode(req: Request, res: Response) {
  const trackingCode = req.params.code;

  const { status, data } =
    await TrackingHandler.GetProductBatchByTrackingCode(trackingCode);

  responseHelper.build(res, status, data);
}

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

async function GetWasteBottleById(req: Request, res: Response) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await TrackingHandler.GetWasteBottleById(batchId);

  responseHelper.build(res, status, data);
}

async function GetRecyclingBatchById(req: Request, res: Response) {
  const batchId = requestHelper.parseUint(req.params.id);
  if (batchId === null) {
    responseHelper.build(res, 400, 'Invalid batch ID');
    return;
  }

  const { status, data } = await TrackingHandler.GetRecyclingBatchById(batchId);

  responseHelper.build(res, status, data);
}

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
