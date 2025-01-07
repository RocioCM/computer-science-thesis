import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import requestHelper from 'src/pkg/helpers/requestHelper';
import responseHelper from 'src/pkg/helpers/responseHelper';
import AuthHandler from './authHandler';
import * as middlewareHelper from 'src/pkg/helpers/middlewareHelper';
import { User, CreateUserDTO } from './domain/user';

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
  const authToken = requestHelper.getAuthToken(req);
  if (!authToken) {
    responseHelper.build(res, StatusCodes.UNAUTHORIZED, null);
    return;
  }

  const { status, data } = await AuthHandler.GetUserWithAuth(authToken);

  responseHelper.build(res, status, data);
}

async function UpdateUserWithAuth(req: Request, res: Response) {
  const authToken = requestHelper.getAuthToken(req);
  if (!authToken) {
    responseHelper.build(res, StatusCodes.UNAUTHORIZED, null);
    return;
  }

  const parsedUserRes = await requestHelper.parseBody(req.body, User);
  if (!parsedUserRes.ok) {
    responseHelper.build(res, parsedUserRes.status, parsedUserRes.data);
    return;
  }

  const { status, data } = await AuthHandler.UpdateUserWithAuth(
    authToken,
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
