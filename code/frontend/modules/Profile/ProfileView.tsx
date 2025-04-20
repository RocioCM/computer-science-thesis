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
    <main className="w-full h-screen overflow-auto p-xl">
      <form
        className="relative w-full max-w-[1000px] mx-auto h-max flex flex-col gap-xl overflow-auto rounded-rs border border-n bg-n0 p-2xl shadow-e2"
        onSubmit={handleUpdateProfile}
      >
        <h2>Perfil</h2>
        <div className="grid grid-cols-2 gap-x-m gap-y-xl">
          {formBuilder(PROFILE_INPUTS)}
        </div>
        <Button
          handleClick={handleUpdateProfile}
          label="Actualizar perfil"
          disabled={!submitEnabled}
          isLoading={isLoading}
          width="w-[12rem]"
          className="mt-4 ml-auto"
        />
      </form>
    </main>
  );
};

export default withProfileController(ProfileView);
