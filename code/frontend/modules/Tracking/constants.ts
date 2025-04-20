import { FieldData } from '@/common/hooks/useForm/types';

export const TABS_KEYS = {
  BASE_BATCH: 'baseBatch',
  PRODUCT_BATCH: 'productBatch',
  WASTE_BOTTLE: 'wasteBottle',
  RECYCLING_BATCH: 'recyclingBatch',
};

export const SEARCH_FORM_STRUCT: FieldData[] = [
  {
    name: 'type',
    required: true,
    default: '',
  },
  {
    name: 'id',
    required: true,
    disabled: (form) => !form.type,
    default: '',
  },
];

export const TIMELINE_ITEMS = [
  {
    key: TABS_KEYS.BASE_BATCH,
    label: 'Envase',
    icon: 'fa-solid fa-boxes-stacked',
  },
  {
    key: TABS_KEYS.PRODUCT_BATCH,
    label: 'Producto',
    icon: 'fa-solid fa-box-open',
  },
  {
    key: TABS_KEYS.WASTE_BOTTLE,
    label: 'Residuo',
    icon: 'fa-solid fa-bottle-water',
  },
  {
    key: TABS_KEYS.RECYCLING_BATCH,
    label: 'Reciclaje',
    icon: 'fa-solid fa-recycle',
  },
];
