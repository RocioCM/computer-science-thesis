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

  const { status, data } = await ProducerHandler.GetBatchById(id);

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

  const { status, data } = await ProducerHandler.GetAllBatchesByUser(
    userRes.data.uid,
    page,
    limit,
  );

  responseHelper.build(res, status, data);
}

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

async function GetRecyclingBatchById(req: Request, res: Response) {
  const userRes = await Authenticate(req, ROLES.PRODUCER);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid bottle ID');
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
