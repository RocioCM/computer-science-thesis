import { useRef, useState } from 'react';
import {
  SecondaryProducerViewType,
  SecondaryProducerViewProps,
  ProductBottlesBatch,
} from './types';
import useModal from '@/common/hooks/useModal';
import ConfirmationModal from '@/common/components/ModalChildrens/ConfirmationModal';
import SecondaryProducerServices from './services';
import { toast } from 'react-toastify';
import BatchDetailModal from './components/BatchDetailModal';
import BatchFormModal from './components/BatchFormModal';
import BatchSaleModal from './components/BatchSaleModal';
import BatchRecycleModal from './components/BatchRecycleModal';

const withSecondaryProducerController = (View: SecondaryProducerViewType) =>
  function Controller(): JSX.Element {
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const editingId = useRef<number | null>(null);
    const { Modal: DetailModal, showModal: showDetailModal } = useModal(
      false,
      BatchDetailModal
    );
    const { Modal: FormModal, showModal: showFormModal } = useModal(
      false,
      BatchFormModal
    );
    const {
      Modal: DeleteModal,
      showModal: showDeleteModal,
      hideModal: hideDeleteModal,
    } = useModal(false, ConfirmationModal);
    const {
      Modal: RejectModal,
      showModal: showRejectModal,
      hideModal: hideRejectModal,
    } = useModal(false, ConfirmationModal);
    const { Modal: SaleModal, showModal: showSaleModal } = useModal(
      false,
      BatchSaleModal
    );
    const { Modal: RecycleModal, showModal: showRecycleModal } = useModal(
      false,
      BatchRecycleModal
    );

    const fetchBottlesBatches = async (page: number, limit: number) => {
      const { ok, data } = await SecondaryProducerServices.getAllBatches(
        page,
        limit
      );
      if (!ok) {
        toast.error('Ocurrió un error al cargar los lotes de envases');
      }
      return data ?? [];
    };

    const handleRefresh = () => {
      setShouldRefresh(true);
    };

    const handleRefreshComplete = () => {
      setShouldRefresh(false);
    };

    const handleDelete = async () => {
      const { ok } = await SecondaryProducerServices.deleteTrackingCode(
        editingId.current as number
      );

      if (ok) {
        toast.success('Código de seguimiento eliminado correctamente');
        handleRefresh();
        hideDeleteModal();
      } else {
        toast.error('Ocurrió un error al eliminar el código de seguimiento');
      }
    };

    const handleReject = async () => {
      const { ok } = await SecondaryProducerServices.rejectBaseBatch(
        editingId.current as number
      );

      if (ok) {
        toast.success('Se ha rechazado correctamente el lote de envases');
        handleRefresh();
        hideRejectModal();
      } else {
        toast.error('Ocurrió un error al rechazar el lote');
      }
    };

    const handleEditButton = (id: number) => {
      editingId.current = id;
      showFormModal();
    };

    const handleShowDetail = (id: number) => {
      editingId.current = id;
      showDetailModal();
    };

    const handleShowDelete = (id: number) => {
      editingId.current = id;
      showDeleteModal();
    };

    const handleShowSale = (id: number) => {
      editingId.current = id;
      showSaleModal();
    };

    const handleShowRecycle = (id: number) => {
      editingId.current = id;
      showRecycleModal();
    };

    const handleShowReject = (id: number) => {
      editingId.current = id;
      showRejectModal();
    };

    const menuActions = [
      {
        label: 'Ver detalle',
        icon: 'fa-solid fa-eye',
        callback: handleShowDetail,
      },
      {
        label: 'Rechazar',
        icon: 'fa-solid fa-times',
        callback: handleShowReject,
        hide: (batch: ProductBottlesBatch) =>
          batch.availableQuantity < batch.quantity,
      },
      {
        label: 'Modificar código',
        icon: 'fa-solid fa-edit',
        callback: handleEditButton,
        hide: (batch: ProductBottlesBatch) =>
          batch.availableQuantity < batch.quantity,
      },
      {
        label: 'Eliminar código',
        icon: 'fa-solid fa-trash-can',
        callback: handleShowDelete,
        hide: (batch: ProductBottlesBatch) =>
          batch.availableQuantity < batch.quantity,
      },
      {
        label: 'Vender',
        icon: 'fa-solid fa-shopping-cart',
        callback: handleShowSale,
        hide: (batch: ProductBottlesBatch) =>
          !batch.trackingCode || batch.availableQuantity === 0,
      },
      {
        label: 'Reciclar',
        icon: 'fa-solid fa-recycle',
        callback: handleShowRecycle,
      },
    ];

    const viewProps: SecondaryProducerViewProps = {
      handleDelete,
      handleReject,
      editingId: editingId.current,
      DetailModal,
      FormModal,
      DeleteModal,
      SaleModal,
      RecycleModal,
      RejectModal,
      handleRefresh,
      shouldRefresh,
      handleRefreshComplete,
      handleFetchData: fetchBottlesBatches,
      menuActions,
    };

    return <View {...viewProps} />;
  };

export default withSecondaryProducerController;
