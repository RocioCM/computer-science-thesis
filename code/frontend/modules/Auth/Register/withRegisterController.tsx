import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { RegisterViewType, RegisterViewProps } from './types';
import { REGISTER_FORM_STRUCT } from './constants';
import useForm from '@/common/hooks/useForm';
import useLoginContext from '@/common/libraries/auth';
import { HTTP_STATUS } from '@/common/constants';

const withRegisterController = (View: RegisterViewType) =>
  function Controller(): JSX.Element {
    const { form, formBuilder, submitEnabled, resetForm } =
      useForm(REGISTER_FORM_STRUCT);
    const [isLoading, setIsLoading] = useState(false);
    const { registerUser } = useLoginContext();
    const formKeyRef = useRef(0);

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!submitEnabled) return;
      setIsLoading(true);

      const payload = {
        email: form.email.toLowerCase(), // Ensure email is lowercase
        password: form.password,
        roleId: form.roleId,
      };
      const { ok, status } = await registerUser(payload);
      if (ok) {
        toast.success(
          '¡Usuario registrado exitosamente! Ya podés iniciar sesión con estas credenciales'
        );
        resetForm();
        formKeyRef.current += 1;
      } else if (status === HTTP_STATUS.conflict) {
        toast.error('El email ingresado ya está registrado, intentá con otro');
      } else {
        toast.error('Ocurrió un error al registrar. Intentá nuevamente');
      }

      setIsLoading(false);
    };

    const viewProps: RegisterViewProps = {
      formKey: formKeyRef.current.toString(),
      handleRegister,
      submitEnabled,
      isLoading,
      formBuilder,
    };

    return <View {...viewProps} />;
  };

export default withRegisterController;
