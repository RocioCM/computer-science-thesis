import { useState } from 'react';
import { toast } from 'react-toastify';
import { RegisterViewType, RegisterViewProps, RegisterUser } from './types';
import { REGISTER_FORM_STRUCT } from './constants';
import RegisterServices from './services';
import useForm from '@/common/hooks/useForm';

const withRegisterController = (View: RegisterViewType) =>
  function Controller(): JSX.Element {
    const { form, formBuilder, submitEnabled } = useForm(REGISTER_FORM_STRUCT);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!submitEnabled) return;
      setIsLoading(true);

      console.log(form); ///
      const payload: RegisterUser = {
        email: form.email,
        password: form.password,
        roleId: form.roleId,
      };
      const { ok } = await RegisterServices.register(payload);
      if (ok) {
        toast.success('Usuario registrado exitosamente.');
      } else {
        toast.error('Ocurrió un error al registrar. Intentá nuevamente.');
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
