import { useRef, useState } from 'react';
import {
  WasteBottlesViewType,
  WasteBottlesViewProps,
  WasteBottle,
} from './types';
import BottleDetailModal from './components/BottleDetailModal';
import BottleSearchModal from './components/BottleSearchModal';
import AssignBatchModal from './components/AssignBatchModal';
import useModal from '@/common/hooks/useModal';
import { toast } from 'react-toastify';
import WasteBottlesServices from './services';
import { TABS } from './constants';

const withWasteBottlesController = (View: WasteBottlesViewType) =>
  function Controller(): JSX.Element {
    const [currentTab, setCurrentTab] = useState(Object.keys(TABS)[0]);
    const [shouldRefresh, setShouldRefresh] = useState(false);
    const editingId = useRef<number | null>(null);

    const { Modal: SearchModal, showModal: showSearchModal } = useModal(
      false,
      BottleSearchModal
    );
    const { Modal: DetailModal, showModal: showDetailModal } = useModal(
      false,
      BottleDetailModal
    );
    const { Modal: AssignModal, showModal: showAssignModal } = useModal(
      false,
      AssignBatchModal
    );

    const fetchWasteBottles = async (page: number, limit: number) => {
      const { ok, data } = await WasteBottlesServices.getWasteBottles(
        page,
        limit
      );
      if (!ok) {
        toast.error('Ocurrió un error al cargar la lista de botellas');
      }
      const filteredData = data?.filter((bottle) =>
        currentTab === 'available'
          ? !bottle.recycledBatchId
          : !!bottle.recycledBatchId
      );
      return filteredData ?? [];
    };

    const handleRefresh = () => {
      setShouldRefresh(true);
    };

    const handleRefreshComplete = () => {
      setShouldRefresh(false);
    };

    const handleCurrentTab = (tab: string) => {
      if (currentTab === tab) return;
      setCurrentTab(tab);
      handleRefresh();
    };

    const handleShowDetail = (id: number) => {
      editingId.current = id;
      showDetailModal();
    };

    const handleShowAssign = (id: number) => {
      editingId.current = id;
      showAssignModal();
    };

    const menuActions = [
      {
        label: 'Ver detalle',
        icon: 'fa-solid fa-eye',
        callback: handleShowDetail,
      },
      {
        label: 'Asignar',
        icon: 'fa-solid fa-square-check',
        callback: handleShowAssign,
        hide: (batch: WasteBottle) => !!batch.recycledBatchId,
      },
    ];

    const viewProps: WasteBottlesViewProps = {
      currentTab,
      handleCurrentTab,
      menuActions,
      handleSearchButton: showSearchModal,
      handleFetchData: fetchWasteBottles,
      editingId: editingId.current,
      SearchModal,
      DetailModal,
      AssignModal,
      shouldRefresh,
      handleRefreshComplete,
      handleRefresh,
    };

    return <View {...viewProps} />;
  };

export default withWasteBottlesController;
