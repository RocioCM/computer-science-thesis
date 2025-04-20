import { validators } from '@/common/hooks/useForm';
import {
  FieldData,
  FormBuilderField,
  INPUT_TYPES,
} from '@/common/hooks/useForm/types';

export const BATCH_FORM_STRUCT: FieldData[] = [
  {
    name: 'trackingCode',
    required: true,
    default: '',
  },
];

export const BATCH_CODE_FORM_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.text,
    name: 'trackingCode',
    placeholder: 'Ingresá el código de seguimiento',
    label: 'Código de seguimiento',
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
    placeholder: 'Ingresá la cantidad de unidades a vender',
    label: 'Cantidad de botellas a vender',
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
