import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

function build(res: Response, status: StatusCodes, data: any = null) {
  return res.status(status).json({
    status,
    data,
  });
}

const responseHelper = {
  build,
};

export default responseHelper;
