import request from './request';

type ExamplePayload = {
  name: string;
  description: string;
};

/// TODO: dear programmer, please remove Example services and replace it with your own services.
const GlobalServices = {
  getExample: (id: number) => request<ExamplePayload>(`/example/${id}`),
  createExample: (payload: ExamplePayload) =>
    request<ExamplePayload>(`/example`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateExample: (id: number, payload: ExamplePayload) =>
    request(`/example/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteExample: (id: number) =>
    request(`/example/${id}`, { method: 'DELETE' }),
};

export default GlobalServices;
