import { Router, Request, Response } from 'express';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import AuthHandler from './authHandler';
import * as middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import { CreateUserDTO, UpdateUserDTO } from './domain/user';
import { Authenticate } from 'src/pkg/helpers/authHelper';

//---- Routers ----//

async function RegisterUser(req: Request, res: Response) {
  const parsedUserRes = await requestHelper.parseBody(req.body, CreateUserDTO);
  if (!parsedUserRes.ok) {
    responseHelper.build(res, parsedUserRes.status, parsedUserRes.data);
    return;
  }

  const { status, data } = await AuthHandler.RegisterUser(parsedUserRes.data);

  responseHelper.build(res, status, data);
}

async function GetUserWithAuth(req: Request, res: Response) {
  const userRes = await Authenticate(req);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const { status, data } = await AuthHandler.GetUserWithAuth(userRes.data);

  responseHelper.build(res, status, data);
}

async function UpdateUserWithAuth(req: Request, res: Response) {
  const userRes = await Authenticate(req);
  if (!userRes.ok) {
    responseHelper.build(res, userRes.status, userRes.data);
    return;
  }

  const parsedUserRes = await requestHelper.parseBody(req.body, UpdateUserDTO);
  if (!parsedUserRes.ok) {
    responseHelper.build(res, parsedUserRes.status, parsedUserRes.data);
    return;
  }

  const { status, data } = await AuthHandler.UpdateUserWithAuth(
    userRes.data.uid,
    parsedUserRes.data,
  );

  responseHelper.build(res, status, data);
}

//---- Routes configuration ----//

const AuthRouter = Router();

middlewareHelper.applyAsyncHandlerMiddleware(AuthRouter);

AuthRouter.post('/register', RegisterUser);
AuthRouter.get('/user', GetUserWithAuth);
AuthRouter.put('/user', UpdateUserWithAuth);

export default AuthRouter;
