import withRegisterController from './withRegisterController';
import { RegisterViewType } from './types';
import { REGISTER_INPUTS } from './constants';
import Button from '@/common/components/Button';
import Img from '@/common/components/Img';
import loginImage from '@/public/assets/login-image.png';
import Link from 'next/link';

const RegisterView: RegisterViewType = ({
  handleRegister,
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
        onSubmit={handleRegister}
      >
        <h2>Registro</h2>
        <div className="flex flex-col gap-s">
          {formBuilder(REGISTER_INPUTS)}
        </div>
        <p className="text-center">
          ¿Ya tenés cuenta?{' '}
          <Link href="/auth/login" className="font-semibold text-p1">
            Ingresá acá
          </Link>
        </p>
        <Button
          handleClick={handleRegister}
          label="Crear usuario"
          disabled={!submitEnabled}
          isLoading={isLoading}
          width="full"
        />
      </form>
    </main>
  );
};

export default withRegisterController(RegisterView);
