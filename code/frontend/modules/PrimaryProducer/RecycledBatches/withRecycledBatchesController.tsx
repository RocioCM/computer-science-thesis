import { useRef, useState } from 'react';
import { RecycledBatchesViewType, RecycledBatchesViewProps } from './types';
import { toast } from 'react-toastify';
import useModal from '@/common/hooks/useModal';
import BatchDetailModal from './components/BatchDetailModal';
import RecycledBatchesServices from './services';

const withRecycledBatchesController = (View: RecycledBatchesViewType) =>
  function Controller(): JSX.Element {
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const editingId = useRef<number | null>(null);

    const { Modal: DetailModal, showModal: showDetailModal } = useModal(
      false,
      BatchDetailModal
    );

    const fetchRecyclingBatches = async (page: number, limit: number) => {
      const { ok, data } =
        await RecycledBatchesServices.getAllUserRecyclingBatches(page, limit);
      if (!ok) {
        toast.error('Ocurrió un error al cargar los lotes producidos');
      }
      return data ?? [];
    };

    const handleRefreshComplete = () => {
      setShouldRefresh(false);
    };

    const handleShowDetail = (id: number) => {
      editingId.current = id;
      showDetailModal();
    };

    const menuActions = [
      {
        label: 'Ver detalle',
        icon: 'fa-solid fa-eye',
        callback: handleShowDetail,
      },
    ];
    const viewProps: RecycledBatchesViewProps = {
      handleFetchData: fetchRecyclingBatches,
      editingId: editingId.current,
      DetailModal,
      shouldRefresh,
      handleRefreshComplete,
      menuActions,
    };

    return <View {...viewProps} />;
  };

export default withRecycledBatchesController;
