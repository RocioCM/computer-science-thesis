// -------- VIEW / CONTROLLER -------- //

import { FormBuilderType } from '@/common/hooks/useForm/types';

export interface LoginViewProps {
  handleLogin: (e: React.FormEvent) => void;
  submitEnabled: boolean;
  isLoading: boolean;
  formBuilder: FormBuilderType;
}

export type LoginViewType = React.FC<LoginViewProps>;

// ---------- SERVICES ---------- //

export interface Login {
  name: string;
}
