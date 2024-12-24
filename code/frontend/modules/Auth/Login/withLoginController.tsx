import { LoginViewType, LoginViewProps } from './types';
import useForm from '@/common/hooks/useForm';
import { LOGIN_FORM_STRUCT } from './constants';
import { useState } from 'react';
import useLoginContext from '@/common/libraries/auth';
import { toast } from 'react-toastify';

const withLoginController = (View: LoginViewType) =>
  function Controller(): JSX.Element {
    const { form, formBuilder, submitEnabled } = useForm(LOGIN_FORM_STRUCT);
    const [isLoading, setIsLoading] = useState(false);
    const { loginWithPassword } = useLoginContext();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!submitEnabled) return;
      setIsLoading(true);

      console.log(form); ///
      const payload = {
        email: form.email,
        password: form.password,
      };
      const { ok, data } = await loginWithPassword(payload);
      if (ok) {
        console.log('Login successful', data); ///
      } else {
        toast.error('Usuario o contraseña incorrectos. Intentá nuevamente.');
      }

      setIsLoading(false);
    };

    const viewProps: LoginViewProps = {
      handleLogin,
      submitEnabled,
      isLoading,
      formBuilder,
    };

    return <View {...viewProps} />;
  };

export default withLoginController;
