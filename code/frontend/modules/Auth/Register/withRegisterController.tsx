import { useState } from 'react';
import { toast } from 'react-toastify';
import { RegisterViewType, RegisterViewProps } from './types';
import { REGISTER_FORM_STRUCT } from './constants';
import useForm from '@/common/hooks/useForm';
import useLoginContext from '@/common/libraries/auth';

const withRegisterController = (View: RegisterViewType) =>
  function Controller(): JSX.Element {
    const { form, formBuilder, submitEnabled, resetForm } =
      useForm(REGISTER_FORM_STRUCT);
    const [isLoading, setIsLoading] = useState(false);
    const { registerUser } = useLoginContext();

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!submitEnabled) return;
      setIsLoading(true);

      console.log(form); ///
      const payload = {
        email: form.email,
        password: form.password,
        roleId: form.roleId,
      };
      const { ok } = await registerUser(payload);
      if (ok) {
        toast.success(
          '¡Usuario registrado exitosamente! Ya podés iniciar sesión con estas credenciales'
        );
        resetForm();
      } else {
        toast.error('Ocurrió un error al registrar. Intentá nuevamente');
      }

      setIsLoading(false);
    };

    const viewProps: RegisterViewProps = {
      handleRegister,
      submitEnabled,
      isLoading,
      formBuilder,
    };

    return <View {...viewProps} />;
  };

export default withRegisterController;
