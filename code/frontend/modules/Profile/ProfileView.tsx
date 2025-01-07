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
        className="relative w-full max-w-[600px] mx-auto h-max flex flex-col gap-xl"
        onSubmit={handleUpdateProfile}
      >
        <h2>Perfil</h2>
        <div className="flex flex-col gap-s">{formBuilder(PROFILE_INPUTS)}</div>
        <Button
          handleClick={handleUpdateProfile}
          label="Actualizar perfil"
          disabled={!submitEnabled}
          isLoading={isLoading}
          width="full"
          className="sticky bottom-4 mt-4"
        />
      </form>
    </main>
  );
};

export default withProfileController(ProfileView);
