import { arrayOf, object, validators } from '@/common/hooks/useForm';
import {
  FieldData,
  FormBuilderField,
  INPUT_TYPES,
} from '@/common/hooks/useForm/types';

// type Material = {
//   name: string;
//   amount: number;
//   measureUnit: string;
// };

// type Bottle = {
//   weight: number; // uint256
//   color: string;
//   thickness: number; // uint256
//   composition: Material[];
//   shapeType: string;
//   originLocation: string;
//   extraInfo: string;
// };

// export type BottleBatch = {
//   id: number; // uint256
//   quantity: number; // uint256
//   bottleType: Bottle;
//   soldQuantity: number; // uint256
//   owner: string; // Ethereum address
//   createdAt: string; // Timestamp as a string
// };

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
    placeholder: 'Ingresá la cantidad de envases',
    label: 'Cantidad de envases',
  },
  {
    type: INPUT_TYPES.number,
    name: 'bottleType.weight',
    placeholder: 'Ingresá el peso por envase (gramos)',
    label: 'Peso por envase (en gramos)',
  },
  {
    type: INPUT_TYPES.dropdown,
    name: 'bottleType.color',
    placeholder: 'Seleccioná el color del envase',
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
    placeholder: 'Ingresá el espesor (mm)',
    label: 'Espesor (en milímetros)',
  },
  {
    type: INPUT_TYPES.text,
    name: 'bottleType.shapeType',
    placeholder: 'Ingresá el tipo/forma del envase',
    label: 'Tipo/forma del envase',
  },
];

export const BATCH_COMPOSITION_FORM_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.text,
    name: 'name',
    placeholder: 'Ingresá el nombre del material',
    label: 'Nombre del material',
  },
  {
    type: INPUT_TYPES.number,
    name: 'amount',
    placeholder: 'Ingresá la cantidad de material',
    label: 'Cantidad de material',
  },
  {
    type: INPUT_TYPES.text,
    name: 'measureUnit',
    placeholder: 'Ingresá la unidad de medida de la cantidad de material',
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
    placeholder: 'Ingresá la localización de producción',
    label: 'Localización de producción',
  },
  {
    type: INPUT_TYPES.textarea,
    name: 'bottleType.extraInfo',
    placeholder: 'Ingresá observaciones adicionales',
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
    placeholder: 'Ingresá la cantidad de envases a vender',
    label: 'Cantidad de envases a vender',
  },
  {
    type: INPUT_TYPES.autocomplete,
    name: 'buyerUid',
    placeholder: 'Ingresá el nombre o correo del comprador',
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
    placeholder: 'Ingresá la cantidad de envases a reciclar',
    label: 'Cantidad de envases a reciclar',
  },
];
