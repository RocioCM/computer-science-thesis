import withLoginController from './withLoginController';
import { LoginViewType } from './types';
import Img from '@/common/components/Img';
import Button from '@/common/components/Button';
import loginImage from '@/public/assets/login-image.png';
import { LOGIN_INPUTS } from './constants';

const LoginView: LoginViewType = ({
  handleLogin,
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
        onSubmit={handleLogin}
      >
        <h2>Bienvenido</h2>
        <div className="flex flex-col gap-s">{formBuilder(LOGIN_INPUTS)}</div>
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
