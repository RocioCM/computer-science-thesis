import { ConsumerViewType, ConsumerViewProps } from './types';
import BottleSearchModal from './components/BottleSearchModal';
import useModal from '@/common/hooks/useModal';
import BottleRecycleModal from './components/BottleRecycleModal';
import { useRef, useState } from 'react';
import ConsumerServices from './services';
import { toast } from 'react-toastify';
import ConfirmationModal from '@/common/components/ModalChildrens/ConfirmationModal';
import BottleDetailModal from './components/BottleDetailModal';

const withConsumerController = (View: ConsumerViewType) =>
  function Controller(): JSX.Element {
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const trackingCode = useRef<string>('');
    const editingId = useRef<number | null>(null);

    const {
      Modal: SearchModal,
      showModal: showSearchModal,
      hideModal: hideSearchModal,
    } = useModal(false, BottleSearchModal);
    const { Modal: DetailModal, showModal: showDetailModal } = useModal(
      false,
      BottleDetailModal
    );
    const { Modal: RecycleModal, showModal: showRecycleModal } = useModal(
      false,
      BottleRecycleModal
    );
    const {
      Modal: DeleteModal,
      showModal: showDeleteModal,
      hideModal: hideDeleteModal,
    } = useModal(false, ConfirmationModal);

    const handleRecycle = (code: string) => {
      showRecycleModal();
      hideSearchModal();
      trackingCode.current = code;
    };

    const fetchWasteBottles = async (page: number, limit: number) => {
      const { ok, data } = await ConsumerServices.getUserWasteBottles(
        page,
        limit
      );
      if (!ok) {
        toast.error('Ocurrió un error al cargar los lotes de envases');
      }
      return data ?? [];
    };

    const handleDelete = async () => {
      const { ok } = await ConsumerServices.deleteWasteBottle(
        editingId.current as number
      );

      if (ok) {
        toast.success('Envase eliminado correctamente de la lista');
        handleRefresh();
        hideDeleteModal();
      } else {
        toast.error('Ocurrió un error al eliminar el envase de la lista');
      }
    };

    const handleRefresh = () => {
      setShouldRefresh(true);
    };

    const handleRefreshComplete = () => {
      setShouldRefresh(false);
    };

    const handleShowDetail = (id: number) => {
      showDetailModal();
      editingId.current = id;
    };

    const handleShowDelete = (id: number) => {
      editingId.current = id;
      showDeleteModal();
    };

    const menuActions = [
      {
        label: 'Ver detalle',
        icon: 'fa-solid fa-eye',
        callback: handleShowDetail,
      },
      {
        label: 'Eliminar',
        icon: 'fa-solid fa-trash-can',
        callback: handleShowDelete,
      },
    ];

    const viewProps: ConsumerViewProps = {
      editingId: editingId.current,
      SearchModal,
      RecycleModal,
      DeleteModal,
      DetailModal,
      handleSearchButton: showSearchModal,
      handleRecycle,
      handleDelete,
      trackingCode: trackingCode.current,
      shouldRefresh,
      handleFetchData: fetchWasteBottles,
      handleRefresh,
      handleRefreshComplete,
      menuActions,
    };

    return <View {...viewProps} />;
  };

export default withConsumerController;
