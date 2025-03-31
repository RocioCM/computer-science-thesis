import {
  FieldData,
  FormBuilderField,
  INPUT_TYPES,
} from '@/common/hooks/useForm/types';

export const TABS = {
  available: 'Disponibles',
  recycled: 'Recicladas',
};

// ------- Search form ------- //

export const SEARCH_FORM_STRUCT: FieldData[] = [
  {
    name: 'search',
    required: false,
    default: '',
  },
];

export const SEARCH_FORM_INPUTS: FormBuilderField[] = [
  {
    name: 'search',
    type: INPUT_TYPES.text,
    label: 'Código de seguimiento',
    placeholder: 'ABC1234XYZ',
  },
];

// ------- Recycle form ------- //

export const ASSIGN_FORM_STRUCT: FieldData[] = [
  {
    name: 'batchId',
    required: true,
    default: null,
  },
];

export const ASSIGN_FORM_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.dropdown,
    name: 'batchId',
    placeholder: 'Selecciona un lote',
    label: 'ID del lote',
  },
];
