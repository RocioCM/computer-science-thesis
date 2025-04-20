import { useEffect, useState } from 'react';
import useModal from '@/common/hooks/useModal';
import TrackingServices from '../../services';
import { UserData } from '../../types';
import LoadingSpinner from '@/common/components/LoadingSpinner';

interface Props {
  blockchainId: string;
}

const AccountDetails: React.FC<Props> = ({ blockchainId }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { Modal, showModal } = useModal();

  const fetchUserData = async (blockchainId: string) => {
    setUserData(null);
    const { ok, data } = await TrackingServices.getUserPublicData(blockchainId);
    if (ok) {
      setUserData(data);
    }
  };

  useEffect(() => {
    if (blockchainId) fetchUserData(blockchainId);
  }, [blockchainId]);

  return (
    <>
      <span
        className={userData ? 'underline cursor-pointer' : ''}
        onClick={userData ? showModal : undefined}
      >
        {userData?.userName ? userData.userName : blockchainId}
      </span>
      <Modal>
        {userData ? (
          <div className="w-full my-auto space-y-xs">
            <p>
              <span className="font-semibold">Nombre:</span> {userData.userName}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {userData.email}
            </p>
            <p>
              <span className="font-semibold">Teléfono:</span> {userData.phone}
            </p>
            <p className="w-full whitespace-preline">
              <span className="font-semibold">Blockchain ID:</span>{' '}
              {userData.blockchainId}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center">
            <LoadingSpinner />
          </div>
        )}
      </Modal>
    </>
  );
};

export default AccountDetails;
