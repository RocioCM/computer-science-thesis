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

//---- Routers ----//

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

  const { status, data } = await SecondaryProducerHandler.GetBatchById(id);

  responseHelper.build(res, status, data);
}

async function GetBaseBatchById(req: Request, res: Response) {
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

  const { status, data } = await SecondaryProducerHandler.GetBaseBatchById(id);

  responseHelper.build(res, status, data);
}

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

  const { status, data } = await SecondaryProducerHandler.GetAllBatchesByUser(
    userRes.data.uid,
    page,
    limit,
  );

  responseHelper.build(res, status, data);
}

async function UpdateProductBatchTrackingCode(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
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

async function DeleteProductBatchTrackingCode(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
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

async function RejectBaseBottlesBatch(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
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

async function RecycleBaseBottles(req: Request, res: Response) {
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

  const { status, data } = await SecondaryProducerHandler.RecycleBaseBottles(
    userRes.data.uid,
    parsedBodyRes.data,
  );

  responseHelper.build(res, status, data);
}

async function SellProductBottles(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
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

SecondaryProducerRouter.put('/batch/code', UpdateProductBatchTrackingCode);
SecondaryProducerRouter.put('/batch/reject/:id', RejectBaseBottlesBatch);
SecondaryProducerRouter.put('/batch/recycle', RecycleBaseBottles);
SecondaryProducerRouter.put('/batch/sell', SellProductBottles);

SecondaryProducerRouter.delete(
  '/batch/code/:id',
  DeleteProductBatchTrackingCode,
);

export default SecondaryProducerRouter;
