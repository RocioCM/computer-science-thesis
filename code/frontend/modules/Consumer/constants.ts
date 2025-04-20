import {
  FieldData,
  FormBuilderField,
  INPUT_TYPES,
} from '@/common/hooks/useForm/types';

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
    type: INPUT_TYPES.search,
    label: 'Código de seguimiento',
    placeholder: 'ABC1234XYZ',
  },
];

// ------- Waste bottle recycle form ------- //

export const RECYCLE_FORM_STRUCT: FieldData[] = [
  {
    name: 'trackingCode',
    required: true,
    default: '',
  },
  {
    name: 'recyclerUid',
    required: true,
    default: '',
  },
];

export const RECYCLE_FORM_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.text,
    name: 'trackingCode',
    placeholder: 'Ingresá el código de seguimiento',
    label: 'Código de seguimiento',
  },
  {
    type: INPUT_TYPES.autocomplete,
    name: 'recyclerUid',
    placeholder: 'Ingresá el nombre o correo del reciclador',
    label: 'Reciclador/a',
  },
];
