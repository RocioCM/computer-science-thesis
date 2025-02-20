import withLoginController from './withLoginController';
import { LoginViewType } from './types';
import Img from '@/common/components/Img';
import Button from '@/common/components/Button';
import loginImage from '@/public/assets/login-image.png';
import { LOGIN_INPUTS } from './constants';
import Link from 'next/link';

const LoginView: LoginViewType = ({
  handleLogin,
  submitEnabled,
  isLoading,
  formBuilder,
}) => {
  return (
    <main className="w-full h-screen flex flex-row items-center justify-around gap-xl p-3xl">
      <Img
        src={loginImage}
        width={800}
        height={800}
        alt="Iniciar sesión"
        className="h-full w-full max-w-[400px] object-contain"
      />
      <form
        className="w-full min-w-[300px] max-w-[500px] h-max max-h-full overflow-auto rounded-rl border border-n2 p-2xl flex flex-col gap-xl"
        onSubmit={handleLogin}
      >
        <h2>Bienvenido</h2>
        <div className="flex flex-col gap-s">{formBuilder(LOGIN_INPUTS)}</div>
        <p className="text-center">
          ¿No tenés cuenta?{' '}
          <Link href="/auth/register" className="font-semibold text-p1">
            Registrate acá
          </Link>
        </p>
        <Button
          handleClick={handleLogin}
          label="Iniciar sesión"
          disabled={!submitEnabled}
          isLoading={isLoading}
          width="full"
        />
      </form>
    </main>
  );
};

export default withLoginController(LoginView);
