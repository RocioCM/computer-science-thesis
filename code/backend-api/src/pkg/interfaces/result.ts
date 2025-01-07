import { StatusCodes } from 'http-status-codes';

export type IResult<T = any> = Promise<IResultSuccess<T> | IResultError>;

interface IResultSuccess<T = any> {
  ok: true;
  status: StatusCodes.OK | StatusCodes.CREATED | StatusCodes.ACCEPTED;
  data: T;
}

interface IResultError {
  ok: false;
  status: Exclude<
    StatusCodes,
    StatusCodes.OK | StatusCodes.CREATED | StatusCodes.ACCEPTED
  >;
  data: null | string;
}
