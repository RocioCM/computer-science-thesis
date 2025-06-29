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
    name: 'role',
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
    required: true,
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
    name: 'role',
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
    label: 'Nombre de usuario (opcional)',
  },
  {
    type: INPUT_TYPES.text,
    name: 'managerName',
    label: 'Nombre del Responsable (opcional)',
  },
  {
    type: INPUT_TYPES.text,
    name: 'phone',
    placeholder: '+5492610000000',
    label: 'Teléfono',
  },
];
