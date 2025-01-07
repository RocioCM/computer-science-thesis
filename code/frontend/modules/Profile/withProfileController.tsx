import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useForm from '@/common/hooks/useForm';
import useLoginContext from '@/common/libraries/auth';
import { APIUser } from '@/common/libraries/auth/types';
import { ProfileViewType, ProfileViewProps } from './types';
import { PROFILE_FORM_STRUCT } from './constants';

const withProfileController = (View: ProfileViewType) =>
  function Controller(): JSX.Element {
    const { form, formBuilder, submitEnabled, setInitialForm } =
      useForm(PROFILE_FORM_STRUCT);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { user, updateUserData } = useLoginContext();

    useEffect(() => {
      setInitialForm({ ...user });
    }, [user]);

    console.log('HOLA');

    const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!submitEnabled || !user) return;
      setIsLoading(true);

      console.log(form); ///
      const payload: APIUser = {
        ...form,

        // Read-only fields
        id: user.id,
        email: user.email,
        blockchainId: user.blockchainId,
      };
      const { ok } = await updateUserData(payload);
      if (ok) {
        toast.success('Usuario actualizado exitosamente.');
      } else {
        toast.error(
          'Ocurrió un error al actualizar los datos. Intentá nuevamente.'
        );
      }

      setIsLoading(false);
    };

    const viewProps: ProfileViewProps = {
      formBuilder,
      handleUpdateProfile,
      submitEnabled,
      isLoading,
    };

    return <View {...viewProps} />;
  };

export default withProfileController;
