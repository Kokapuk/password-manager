import useAuthStore from '@/store/auth';
import { Password, PasswordDTO } from './types';

const tokenExpirationTime = 3540000;
let tokenExpirationTimeout: NodeJS.Timeout | null = null;

const request = async (
  url: string,
  init?: (Omit<RequestInit, 'body' | 'headers'> & { body?: any }) | undefined,
  params?: { [key: string]: any }
): Promise<Response> => {
  params && Object.keys(params).forEach((key) => !params[key] && delete params[key]);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${url}${params ? '?' : ''}${new URLSearchParams(params)}`,
    {
      ...init,
      body: init?.body && JSON.stringify(init.body),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: useAuthStore.getState().token ?? '',
      },
    }
  );

  if (response.status === 401) {
    saveToken(null);
  }

  if (!response.ok) {
    const data = await response.json();

    console.error(data.message);
    throw new Error(data.message);
  }

  return response;
};

export const saveToken = (token: string | null) => {
  useAuthStore.setState({ token });

  if (!token) {
    return;
  }

  tokenExpirationTimeout && clearTimeout(tokenExpirationTimeout);
  tokenExpirationTimeout = setTimeout(() => {
    useAuthStore.setState({ token: null });
  }, tokenExpirationTime);
};

export const auth = async (login: string, password: string, authType: 'signIn' | 'signUp') => {
  try {
    const response = await request(authType === 'signUp' ? '/auth/signUp' : '/auth/signIn', {
      method: 'POST',
      body: { login, password },
    });
    const data = await response.json()
    saveToken(data.token);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const create = async (name: string, website: string): Promise<Password> => {
  try {
    const response = await request('/passwords', { method: 'POST', body: { name, website } });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const findAll = async (
  query: string,
  limit: number,
  page: number
): Promise<[totalCount: number, passwords: Password[]]> => {
  try {
    const response = await request(
      '/passwords',
      { method: 'GET' },
      { query: query !== '' ? query : null, limit, page }
    );
    const data = await response.json();
    const totalCount = await response.headers.get('x-total-count');
    return [Number(totalCount), data];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const findOne = async (id: string): Promise<Password> => {
  try {
    const response = await request(
      `/passwords/${id}`,
      { method: 'GET' },
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const update = async (id: string, updatedObject: PasswordDTO): Promise<void> => {
  try {
    await request(`/passwords/${id}`, {
      method: 'PUT',
      body: {
        ...updatedObject,
        credentials: {
          ...updatedObject.credentials,
          integration: updatedObject.credentials.integration && updatedObject.credentials.integration._id,
        },
      },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const remove = async (id: string): Promise<void> => {
  try {
    await request(`/passwords/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error(err);
    throw err;
  }
};
