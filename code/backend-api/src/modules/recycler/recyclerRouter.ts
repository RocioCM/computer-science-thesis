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

//---- Routers ----//

async function GetBottleInfoByTrackingCode(req: Request, res: Response) {
  const trackingCode = req.params.trackingCode;

  const { status, data } =
    await RecyclerHandler.GetBottleInfoByTrackingCode(trackingCode);

  responseHelper.build(res, status, data);
}

async function GetWasteBottleTracking(req: Request, res: Response) {
  const id = requestHelper.parseUint(req.params.id);
  if (id === null) {
    responseHelper.build(res, 400, 'Invalid bottle ID');
    return;
  }

  const { status, data } = await RecyclerHandler.GetWasteBottleTracking(id);

  responseHelper.build(res, status, data);
}

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
