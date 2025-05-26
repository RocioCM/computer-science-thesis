import { ROLES_OPTIONS } from '@/common/constants/auth';
import { FormBuilderField, INPUT_TYPES } from '@/common/hooks/useForm/types';
import * as validators from '@/common/hooks/useForm/validators';

export const REGISTER_FORM_STRUCT = [
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
    validators: validators.isPassword,
  },
  {
    name: 'roleId',
    required: true,
    default: null,
  },
];

export const REGISTER_INPUTS: FormBuilderField[] = [
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
  {
    type: INPUT_TYPES.dropdown,
    name: 'roleId',
    placeholder: 'Selecciona un rol',
    label: 'Rol',
    dropdownOptions: ROLES_OPTIONS,
  },
];
