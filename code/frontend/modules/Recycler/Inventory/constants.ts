import { arrayOf, validators } from '@/common/hooks/useForm';
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
    type: INPUT_TYPES.text,
    label: 'Código de seguimiento',
    placeholder: 'ABC1234XYZ',
  },
];

// ----------- Recycling Batch Form ------------- //

export const BATCH_FORM_STRUCT: FieldData[] = [
  {
    name: 'weight',
    required: true,
    default: '',
  },
  {
    name: 'size',
    required: true,
    default: '',
  },
  {
    name: 'materialType',
    required: true,
    default: '',
  },
  {
    name: 'composition',
    required: true,
    default: [{ name: '', amount: '', measureUnit: '' }],
    structure: arrayOf([
      {
        name: 'name',
        required: true,
        default: '',
      },
      {
        name: 'amount',
        required: true,
        default: '',
        validators: validators.isPositiveNumber,
      },
      {
        name: 'measureUnit',
        required: true,
        default: '',
      },
    ]),
  },
  {
    name: 'extraInfo',
    required: false,
    default: '',
  },
  {
    name: 'wasteBottleIds',
    required: false,
    default: [],
  },
  {
    name: 'createdAt',
    required: true,
    disabled: (form) => !!form.id,
    default: new Date().toISOString().split('T')[0],
  },
];

export const BATCH_FORM_INPUTS_1: FormBuilderField[] = [
  {
    type: INPUT_TYPES.number,
    name: 'weight',
    placeholder: '100',
    label: 'Peso del lote (en kg)',
  },
  {
    type: INPUT_TYPES.text,
    name: 'size',
    placeholder: '1m3',
    label: 'Tamaño del lote (con unidades)',
  },
  {
    type: INPUT_TYPES.text,
    name: 'materialType',
    placeholder: 'Vidrio',
    label: 'Tipo de material',
  },
  {
    type: INPUT_TYPES.date,
    name: 'createdAt',
    placeholder: 'Selecciona una fecha',
    label: 'Fecha de producción',
    max: new Date().toISOString().split('T')[0],
  },
  {
    type: INPUT_TYPES.textarea,
    name: 'extraInfo',
    placeholder: '',
    label: 'Observaciones adicionales (opcional)',
    containerClassName: 'col-span-2',
  },
];

export const BATCH_COMPOSITION_FORM_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.text,
    name: 'name',
    placeholder: 'Vidrio blanco',
    label: 'Nombre del material',
  },
  {
    type: INPUT_TYPES.number,
    name: 'amount',
    placeholder: '90',
    label: 'Cantidad de material',
  },
  {
    type: INPUT_TYPES.text,
    name: 'measureUnit',
    placeholder: '%',
    label: 'Unidad de medida',
  },
];

// ------- Sell form ------- //

export const SELL_FORM_STRUCT: FieldData[] = [
  {
    name: 'buyerUid',
    required: true,
    default: '',
  },
];

export const SELL_FORM_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.autocomplete,
    name: 'buyerUid',
    placeholder: 'Busca por nombre o correo del comprador',
    label: 'Comprador',
  },
];
