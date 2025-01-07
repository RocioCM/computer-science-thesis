export const ROLES = {
  1: 'admin',
  2: 'producer',
  3: 'secondary_producer',
  4: 'consumer',
  5: 'recycler',
  admin: 1,
  producer: 2,
  secondary_producer: 3,
  consumer: 4,
  recycler: 5,
};

export const ROLES_OPTIONS = [
  { label: 'Administrador', value: ROLES.admin },
  { label: 'Productor primario', value: ROLES.producer },
  { label: 'Productor secundario', value: ROLES.secondary_producer },
  { label: 'Consumidor', value: ROLES.consumer },
  { label: 'Reciclador', value: ROLES.recycler },
];
