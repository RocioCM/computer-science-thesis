import { Request, Response, Router } from 'express';
import { ROLES } from 'src/pkg/constants';
import { Authenticate } from 'src/pkg/helpers/authHelper';
import middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import ConsumerHandler from './consumerHandler';
import { CreateWasteBottleDTO } from './domain/wasteBottle';

//---- Routers ----//

async function GetProductOriginByTrackingCode(req: Request, res: Response) {
  const trackingCode = req.params.trackingCode;

  const { status, data } =
    await ConsumerHandler.GetProductOriginByTrackingCode(trackingCode);

  responseHelper.build(res, status, data);
}

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
