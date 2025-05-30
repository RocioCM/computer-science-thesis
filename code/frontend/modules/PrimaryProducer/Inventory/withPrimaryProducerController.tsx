import { useRef, useState } from 'react';
import {
  PrimaryProducerViewType,
  PrimaryProducerViewProps,
  BottleBatch,
} from './types';
import PrimaryProducerServices from './services';
import { toast } from 'react-toastify';
import useModal from '@/common/hooks/useModal';
import BatchFormModal from './components/BatchFormModal';
import ConfirmationModal from '@/common/components/ModalChildrens/ConfirmationModal';
import BatchDetailModal from './components/BatchDetailModal';
import BatchSaleModal from './components/BatchSaleModal';
import BatchRecycleModal from './components/BatchRecycleModal';

const withPrimaryProducerController = (View: PrimaryProducerViewType) =>
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
    const { Modal: SaleModal, showModal: showSaleModal } = useModal(
      false,
      BatchSaleModal
    );
    const { Modal: RecycleModal, showModal: showRecycleModal } = useModal(
      false,
      BatchRecycleModal
    );

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

    const handleDelete = async () => {
      const { ok } = await PrimaryProducerServices.deleteBatch(
        editingId.current as number
      );

      if (ok) {
        toast.success('Lote eliminado correctamente');
        handleRefresh();
        hideDeleteModal();
      } else {
        toast.error('Ocurrió un error al eliminar el lote');
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

    const menuActions = [
      {
        label: 'Ver detalle',
        icon: 'fa-solid fa-eye',
        callback: handleShowDetail,
      },
      {
        label: 'Editar',
        icon: 'fa-solid fa-edit',
        callback: handleEditButton,
        hide: (batch: BottleBatch) => batch.soldQuantity > 0,
      },
      {
        label: 'Vender',
        icon: 'fa-solid fa-shopping-cart',
        callback: handleShowSale,
        hide: (batch: BottleBatch) => batch.soldQuantity >= batch.quantity,
      },
      {
        label: 'Reciclar',
        icon: 'fa-solid fa-recycle',
        callback: handleShowRecycle,
        hide: (batch: BottleBatch) => batch.soldQuantity >= batch.quantity,
      },
      {
        label: 'Eliminar',
        icon: 'fa-solid fa-trash-can',
        callback: handleShowDelete,
        hide: (batch: BottleBatch) => batch.soldQuantity > 0,
      },
    ];

    const viewProps: PrimaryProducerViewProps = {
      handleCreateButton,
      handleDelete,
      editingId: editingId.current,
      DetailModal,
      FormModal,
      DeleteModal,
      SaleModal,
      RecycleModal,
      handleRefresh,
      shouldRefresh,
      handleRefreshComplete,
      handleFetchData: fetchBottlesBatches,
      menuActions,
    };

    return <View {...viewProps} />;
  };

export default withPrimaryProducerController;
