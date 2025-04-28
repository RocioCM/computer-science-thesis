import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import useForm from '@/common/hooks/useForm';
import useLoginContext from '@/common/libraries/auth';
import { LoginViewType, LoginViewProps } from './types';
import { LOGIN_FORM_STRUCT } from './constants';

const withLoginController = (View: LoginViewType) =>
  function Controller(): JSX.Element {
    const { form, formBuilder, submitEnabled } = useForm(LOGIN_FORM_STRUCT);
    const [isLoading, setIsLoading] = useState(false);
    const { loginWithPassword } = useLoginContext();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!submitEnabled) return;
      setIsLoading(true);

      const payload = {
        email: form.email.toLowerCase(),
        password: form.password,
      };
      const { ok } = await loginWithPassword(payload);
      if (ok) {
        router.push('/');
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
