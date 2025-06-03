import { FormBuilderField, INPUT_TYPES } from '@/common/hooks/useForm/types';
import * as validators from '@/common/hooks/useForm/validators';

export const LOGIN_FORM_STRUCT = [
  {
    name: 'email',
    required: true,
    default: '',
    validators: validators.isEmail,
  },
  {
    name: 'password',
    required: true,
    default: '',
  },
];

export const LOGIN_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.text,
    name: 'email',
    placeholder: '',
    label: 'Correo electrónico',
  },
  {
    type: INPUT_TYPES.password,
    name: 'password',
    placeholder: '',
    label: 'Contraseña',
  },
];
