import withRegisterController from './withRegisterController';
import { RegisterViewType } from './types';
import { REGISTER_INPUTS } from './constants';
import Button from '@/common/components/Button';
import Img from '@/common/components/Img';
import bgImage from '@/public/assets/auth-bg.jpeg';
import Link from 'next/link';

const RegisterView: RegisterViewType = ({
  formKey,
  handleRegister,
  submitEnabled,
  isLoading,
  formBuilder,
}) => {
  return (
    <main className="w-full h-screen bg-p1-25 flex flex-row items-center justify-around gap-xl p-3xl">
      <Img
        src={bgImage}
        width={1200}
        height={800}
        alt="Iniciar sesión"
        className="absolute h-full w-full object-cover opacity-90 z-0"
      />
      <form
        className="relative w-full min-w-[300px] max-w-[500px] h-max max-h-full overflow-auto rounded-rs border border-n2 bg-n0 shadow-e3 p-2xl flex flex-col gap-xl"
        onSubmit={handleRegister}
        key={formKey}
      >
        <h2 className="font-medium">Registro</h2>
        <div className="flex flex-col gap-s">
          {formBuilder(REGISTER_INPUTS)}
        </div>
        <p className="text-center">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="font-semibold text-p1">
            Ingresa aquí
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
