/**
 * Takes API route query and builds source endpoint url.
 * @param apiBase - Base URL for the API
 * @param query - API Route Request Query
 * @returns Source API URL
 */

// Record<string, any> is used to represent an object with string keys and values of any type,
// allowing flexibility in function parameters.
const getEndpointUrl = (
  apiBase: string,
  { endpoint = [], ...params }: Record<string, any>
): string => {
  let url = [apiBase, ...endpoint].join('/');

  if (Object.keys(params).length) {
    url +=
      '?' +
      Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join('&');
  }

  return url;
};

export default getEndpointUrl;
