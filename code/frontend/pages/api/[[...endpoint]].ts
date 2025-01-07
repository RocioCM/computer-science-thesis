import { NextApiRequest, NextApiResponse } from 'next';
import getEndpointUrl from '@/common/utils/url';
import log from '@/common/utils/logger';
import { API_BASE_URL, HTTP_STATUS } from '@/common/constants';

type Data = {
  data: any;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { method, query, body, headers } = req;

  try {
    const url = getEndpointUrl(API_BASE_URL, query);
    log.debug('URL: ', url);

    const fetchHeaders = new Headers();
    fetchHeaders.append('Content-Type', 'application/json');
    if (headers?.authorization) {
      fetchHeaders.append('Authorization', headers.authorization);
    }

    switch (method?.toUpperCase()) {
      case 'GET': {
        const resFromBack = await fetch(url, {
          headers: fetchHeaders,
          method,
          mode: 'cors',
        });
        log.debug('RES: ', resFromBack);

        if (resFromBack.status !== HTTP_STATUS.ok)
          return res.status(resFromBack.status).json({ data: null });

        const { data } = await resFromBack.json();
        return res.status(HTTP_STATUS.ok).json({ data: data ?? null });
      }
      case 'POST':
      case 'PUT':
      case 'DELETE': {
        const resFromBack = await fetch(url, {
          headers: fetchHeaders,
          method,
          mode: 'cors',
          body: JSON.stringify(body),
        });
        log.debug('RES: ', resFromBack);

        if (![HTTP_STATUS.ok, HTTP_STATUS.created].includes(resFromBack.status))
          return res.status(resFromBack.status).json({ data: null });

        const { data } = await resFromBack.json();
        return res.status(HTTP_STATUS.ok).json({ data: data ?? null });
      }
      default:
        return res.status(HTTP_STATUS.methodNotAllowed).json({ data: null });
    }
  } catch (error) {
    log.error('Error: ', error);
    res.status(HTTP_STATUS.internalServerError).json({ data: null });
  }
};

export default handler;
