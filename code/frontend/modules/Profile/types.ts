// -------- VIEW / CONTROLLER -------- //

import { FormBuilderType } from '@/common/hooks/useForm/types';

export interface ProfileViewProps {
  formBuilder: FormBuilderType;
  handleUpdateProfile: (e: React.FormEvent) => void;
  submitEnabled: boolean;
  isLoading: boolean;
}

export type ProfileViewType = React.FC<ProfileViewProps>;

export interface ProfileControllerProps {}

// ---------- SERVICES ---------- //

export interface Profile {
  name: string;
}
