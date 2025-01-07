import {
  basePath,
  isServerSide,
  API_BASE_URL,
  HTTP_STATUS,
} from '@/common/constants';
import { getSession } from '@/common/libraries/auth/session';

interface BaseResponse<T> {
  ok: boolean;
  data: T | null;
  status: number;
}

interface ResponseSuccess<T> extends BaseResponse<T> {
  ok: true;
  data: T;
}

interface ResponseError<T> extends BaseResponse<T> {
  ok: false;
  data: T | null;
}

export type Response<T = null> = ResponseSuccess<T> | ResponseError<T>;

/**
 * Estandarized interface for API requests.
 * When invoked on the client side, it will fetch to API Routes (Next.Js Middlend).
 * When invoked on the server side, it will fetch directly to `API_BASE_URL` (backend).
 * @param {string} url endpoint url.
 * @param {object?} params optional params for the fetch request.
 * @returns an object containing properties: ok, data and status.
 * ok is a boolean indicating if the request was successful.
 * data contains the data returned from the request or
 * in case of error it contains the default data or error description.
 *
 * In TypeScript, <T> is a generic type used to represent a data type abstractly.
 * If you fetch a JSON data, you can use T to represent the data type what is expected in the response
 */
const request = async <T = null>(
  url: string,
  params: RequestInit = {}
): Promise<Response<T>> => {
  try {
    const session = getSession();
    params.headers = {
      'Content-Type': 'application/json',
      Authorization: session ? `Bearer ${session}` : '',
      ...(params.headers || {}),
    };
    params.mode = 'cors';

    const res = await fetch(
      isServerSide
        ? `${API_BASE_URL}${url}` // Backend url.
        : `${basePath}/api${url}`, // API Route url.
      params
    );

    const { data = null } = await res.json();

    if (res.status !== HTTP_STATUS.ok)
      return { ok: false, data, status: res.status };
    return { ok: true, data, status: HTTP_STATUS.ok };
  } catch {
    return { ok: false, data: null, status: HTTP_STATUS.internalServerError };
  }
};

export default request;
