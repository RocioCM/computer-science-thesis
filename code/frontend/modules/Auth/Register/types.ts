// -------- VIEW / CONTROLLER -------- //

import { FormBuilderType } from '@/common/hooks/useForm/types';

export interface RegisterViewProps {
  handleRegister: (e: React.FormEvent) => void;
  submitEnabled: boolean;
  isLoading: boolean;
  formBuilder: FormBuilderType;
}

export type RegisterViewType = React.FC<RegisterViewProps>;

export interface RegisterControllerProps {}

// ---------- SERVICES ---------- //

export interface RegisterUser {
  email: string;
  password: string;
  roleId: number;
}
