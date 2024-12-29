import withRegisterController from './withRegisterController';
import { RegisterViewType } from './types';
import { REGISTER_INPUTS } from './constants';
import Button from '@/common/components/Button';
import Img from '@/common/components/Img';
import loginImage from '@/public/assets/login-image.png';

const RegisterView: RegisterViewType = ({
  handleRegister,
  submitEnabled,
  isLoading,
  formBuilder,
}) => {
  return (
    <main className="w-full h-screen flex flex-row items-center justify-center gap-xl p-xl">
      <Img
        src={loginImage}
        width={800}
        height={800}
        alt="Iniciar sesión"
        className="h-full w-full object-contain"
      />
      <form
        className="w-full min-w-[300px] h-max max-h-full overflow-auto rounded-rl border border-n2 p-xl flex flex-col gap-xl"
        onSubmit={handleRegister}
      >
        <h2>Registro</h2>
        <div className="flex flex-col gap-s">
          {formBuilder(REGISTER_INPUTS)}
        </div>
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
