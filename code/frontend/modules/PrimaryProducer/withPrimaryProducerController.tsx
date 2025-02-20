import { useRef, useState } from 'react';
import { PrimaryProducerViewType, PrimaryProducerViewProps } from './types';
import PrimaryProducerServices from './services';
import { toast } from 'react-toastify';
import useModal from '@/common/hooks/useModal';
import BatchFormModal from './components/BatchFormModal';

const withPrimaryProducerController = (View: PrimaryProducerViewType) =>
  function Controller(): JSX.Element {
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const editingId = useRef<number | null>(null);
    const {
      Modal: FormModal,
      showModal: showFormModal,
      hideModal: hideFormModal,
    } = useModal(false, BatchFormModal);

    const fetchBottlesBatches = async (page: number, limit: number) => {
      const { ok, data } = await PrimaryProducerServices.getAllBatches(
        page,
        limit
      );
      if (!ok) {
        toast.error('Ocurrió un error al cargar los lotes de botellas');
      }
      return data ?? [];
    };

    const handleRefresh = () => {
      setShouldRefresh(true);
    };

    const handleRefreshComplete = () => {
      setShouldRefresh(false);
    };

    const deleteBottleBatch = async (id: number) => {
      const { ok } = await PrimaryProducerServices.deleteBatch(id);
      if (ok) {
        toast.success('Lote de botellas eliminado correctamente');
        handleRefresh();
      } else {
        toast.error('Ocurrió un error al eliminar el lote de botellas');
      }
    };

    const handleCreateButton = async () => {
      editingId.current = null;
      showFormModal();
    };

    const handleEditButton = (id: number) => {
      editingId.current = id;
      showFormModal();
    };

    const viewProps: PrimaryProducerViewProps = {
      handleCreateButton,
      editingId: editingId.current,
      FormModal,
      hideFormModal,
      handleRefresh,
      shouldRefresh,
      handleRefreshComplete,
      handleFetchData: fetchBottlesBatches,
      handleShowDetail: handleEditButton,
    };

    return <View {...viewProps} />;
  };

export default withPrimaryProducerController;
