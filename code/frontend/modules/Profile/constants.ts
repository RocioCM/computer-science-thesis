import { ROLES_OPTIONS } from '@/common/constants/auth';
import { validators } from '@/common/hooks/useForm';
import {
  FieldData,
  FormBuilderField,
  INPUT_TYPES,
} from '@/common/hooks/useForm/types';

export const PROFILE_FORM_STRUCT: FieldData[] = [
  {
    name: 'email',
    disabled: true,
    default: '',
  },

  {
    name: 'roleId',
    disabled: true,
    default: null,
  },
  {
    name: 'blockchainId',
    disabled: true,
    default: '',
  },
  {
    name: 'userName',
    default: '',
  },
  {
    name: 'managerName',
    default: '',
  },
  {
    name: 'phone',
    default: '',
    validators: [validators.isPhone],
  },
];

export const PROFILE_INPUTS: FormBuilderField[] = [
  {
    type: INPUT_TYPES.text,
    name: 'email',
    label: 'Correo electrónico',
  },
  {
    type: INPUT_TYPES.dropdown,
    name: 'roleId',
    label: 'Rol',
    dropdownOptions: ROLES_OPTIONS,
  },
  {
    type: INPUT_TYPES.text,
    name: 'blockchainId',
    label: 'Dirección Blockchain',
  },
  {
    type: INPUT_TYPES.text,
    name: 'userName',
    label: 'Nombre de usuario',
  },
  {
    type: INPUT_TYPES.text,
    name: 'managerName',
    label: 'Nombre del Responsable',
  },
  {
    type: INPUT_TYPES.text,
    name: 'phone',
    label: 'Teléfono',
  },
];
