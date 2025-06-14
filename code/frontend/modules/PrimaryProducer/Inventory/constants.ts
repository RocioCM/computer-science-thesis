import { arrayOf, object, validators } from '@/common/hooks/useForm';
import {
  FieldData,
  FormBuilderField,
  INPUT_TYPES,
} from '@/common/hooks/useForm/types';

export const BATCH_FORM_STRUCT: FieldData[] = [
  {
    name: 'quantity',
    required: true,
    default: '',
    validators: validators.isNaturalNumber,
  },
  {
    name: 'bottleType',
    required: true,
    structure: object([
      {
        name: 'weight',
        required: true,
        default: '',
        validators: validators.isPositiveNumber,
      },
      {
        name: 'color',
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
        name: 'thickness',
        required: true,
        default: '',
        validators: validators.isPositiveNumber,
      },
      {
        name: 'shapeType',
        required: true,
        default: '',
      },

      {
        name: 'originLocation',
        required: true,
        default: '',
      },
      {
        name: 'extraInfo',
        required: false,
        default: '',
      },
    ]),
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
    name: 'quantity',
    placeholder: '1000',
    label: 'Cantidad de envases',
  },
  {
    type: INPUT_TYPES.number,
    name: 'bottleType.weight',
    placeholder: '300',
    label: 'Peso por envase (en gramos)',
  },
  {
    type: INPUT_TYPES.dropdown,
    name: 'bottleType.color',
    placeholder: 'Seleccioná una opción',
    label: 'Color del envase',
    dropdownOptions: [
      { value: 'transparente', label: 'Transparente' },
      { value: 'verde', label: 'Verde' },
      { value: 'ambar', label: 'Ámbar' },
      { value: 'otro', label: 'Otro' },
    ],
  },
  {
    type: INPUT_TYPES.number,
    name: 'bottleType.thickness',
    placeholder: '3',
    label: 'Espesor (en milímetros)',
  },
  {
    type: INPUT_TYPES.text,
    name: 'bottleType.shapeType',
    placeholder: 'Estándar',
    label: 'Tipo/forma del envase',
  },
];

export const BATCH_COMPOSITION_FORM_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.text,
    name: 'name',
    placeholder: 'Calcín',
    label: 'Nombre del material',
  },
  {
    type: INPUT_TYPES.number,
    name: 'amount',
    placeholder: '10',
    label: 'Cantidad de material',
  },
  {
    type: INPUT_TYPES.text,
    name: 'measureUnit',
    placeholder: '%',
    label: 'Unidad de medida',
  },
];

export const BATCH_FORM_INPUTS_2: FormBuilderField[] = [
  {
    type: INPUT_TYPES.date,
    name: 'createdAt',
    placeholder: 'Seleccioná la fecha de producción',
    label: 'Fecha de producción',
    max: new Date().toISOString().split('T')[0],
  },
  {
    type: INPUT_TYPES.text,
    name: 'bottleType.originLocation',
    placeholder: 'Mendoza',
    label: 'Localización de producción',
  },
  {
    type: INPUT_TYPES.textarea,
    name: 'bottleType.extraInfo',
    placeholder: '',
    label: 'Observaciones adicionales (opcional)',
    containerClassName: 'col-span-2',
  },
];

// ------- Sell form ------- //

export const SELL_FORM_STRUCT: FieldData[] = [
  {
    name: 'quantity',
    required: true,
    default: '',
    validators: validators.isNaturalNumber,
  },
  {
    name: 'buyerUid',
    required: true,
    default: '',
  },
];

export const SELL_FORM_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.number,
    name: 'quantity',
    placeholder: '500',
    label: 'Cantidad de envases a vender',
  },
  {
    type: INPUT_TYPES.autocomplete,
    name: 'buyerUid',
    placeholder: 'Busca por nombre o correo del comprador',
    label: 'Comprador',
  },
];

// ------- Recycle form ------- //

export const RECYCLE_FORM_STRUCT: FieldData[] = [
  {
    name: 'quantity',
    required: true,
    default: '',
    validators: validators.isNaturalNumber,
  },
];

export const RECYCLE_FORM_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.number,
    name: 'quantity',
    placeholder: '500',
    label: 'Cantidad de envases a reciclar',
  },
];
