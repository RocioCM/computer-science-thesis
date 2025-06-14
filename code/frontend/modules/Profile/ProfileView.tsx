import Button from '@/common/components/Button';
import withProfileController from './withProfileController';
import { ProfileViewType } from './types';
import { PROFILE_INPUTS } from './constants';

const ProfileView: ProfileViewType = ({
  formBuilder,
  handleUpdateProfile,
  submitEnabled,
  isLoading,
}) => {
  return (
    <main className="w-full h-screen flex flex-col p-2xl animate__animated  animate__fadeIn">
      <header className="pb-2xl flex items-center justify-between">
        <h1>Perfil</h1>
      </header>
      <form
        className="relative w-full  mx-auto flex-1 flex flex-col gap-xl overflow-auto rounded-rs border border-n bg-n0 p-2xl shadow-e2"
        onSubmit={handleUpdateProfile}
      >
        <div className="grid grid-cols-2 gap-x-m gap-y-xl">
          {formBuilder(PROFILE_INPUTS)}
        </div>
        <Button
          handleClick={handleUpdateProfile}
          label="Actualizar perfil"
          disabled={!submitEnabled}
          isLoading={isLoading}
          width="w-[12rem]"
          className="mt-auto ml-auto"
        />
      </form>
    </main>
  );
};

export default withProfileController(ProfileView);
