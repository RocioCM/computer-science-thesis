import { useRef, useState } from 'react';
import { RecyclerViewProps, RecyclerViewType, RecyclingBatch } from './types';
import useModal from '@/common/hooks/useModal';
import ConfirmationModal from '@/common/components/ModalChildrens/ConfirmationModal';
import RecyclerServices from './services';
import { toast } from 'react-toastify';
import BottleDetailModal from './components/BottleDetailModal';
import BatchDetailModal from './components/BatchDetailModal';
import BatchFormModal from './components/BatchFormModal';
import BatchSaleModal from './components/BatchSaleModal';
import { ZERO_ADDRESS } from '@/common/constants';

const withRecyclerController = (View: RecyclerViewType) =>
  function Controller(): JSX.Element {
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const editingId = useRef<number | null>(null);

    const { Modal: SearchModal, showModal: showSearchModal } = useModal(
      false,
      BottleDetailModal
    );
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

    const fetchRecyclingBatches = async (page: number, limit: number) => {
      const { ok, data } = await RecyclerServices.getAllUserRecyclingBatches(
        page,
        limit
      );
      if (!ok) {
        toast.error('Ocurrió un error al cargar los lotes producidos');
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
      const { ok } = await RecyclerServices.deleteRecyclingBatch(
        editingId.current as number
      );

      if (ok) {
        toast.success('Lote eliminado correctamente');
        handleRefresh();
        hideDeleteModal();
      } else {
        toast.error(
          'Ocurrió un error al eliminar el lote. Intenta nuevamente más tarde'
        );
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
        hide: (batch: RecyclingBatch) =>
          !!batch.buyerOwner && batch.buyerOwner !== ZERO_ADDRESS,
      },
      {
        label: 'Eliminar',
        icon: 'fa-solid fa-trash-can',
        callback: handleShowDelete,
        hide: (batch: RecyclingBatch) =>
          !!batch.buyerOwner && batch.buyerOwner !== ZERO_ADDRESS,
      },
      {
        label: 'Vender',
        icon: 'fa-solid fa-shopping-cart',
        callback: handleShowSale,
        hide: (batch: RecyclingBatch) =>
          !!batch.buyerOwner && batch.buyerOwner !== ZERO_ADDRESS,
      },
    ];

    const viewProps: RecyclerViewProps = {
      handleDelete,
      editingId: editingId.current,
      SearchModal,
      DetailModal,
      FormModal,
      DeleteModal,
      SaleModal,
      handleCreateButton,
      handleSearchButton: showSearchModal,
      handleRefresh,
      shouldRefresh,
      handleRefreshComplete,
      handleFetchData: fetchRecyclingBatches,
      menuActions,
    };

    return <View {...viewProps} />;
  };

export default withRecyclerController;
