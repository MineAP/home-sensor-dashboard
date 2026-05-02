import { API_HOST } from '../components/Const';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown>;
};

async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const response = await fetch(`${API_HOST}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body instanceof FormData || typeof body === 'string' || body instanceof Blob || body instanceof ArrayBuffer
      ? body
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json() as T;
}

export { requestJson };
