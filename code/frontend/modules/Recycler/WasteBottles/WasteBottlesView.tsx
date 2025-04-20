import withWasteBottlesController from './withWasteBottlesController';
import { WasteBottle, WasteBottlesViewType } from './types';
import Button from '@/common/components/Button';
import FaIcon from '@/common/components/FaIcon';
import Table from '@/common/components/Table';
import ActionMenu from '@/common/components/ActionMenu';
import { TABS } from './constants';

const WasteBottlesView: WasteBottlesViewType = ({
  currentTab,
  handleCurrentTab,
  handleFetchData,
  editingId,
  DetailModal,
  AssignModal,
  SearchModal,
  shouldRefresh,
  handleRefreshComplete,
  menuActions,
  handleRefresh,
  handleSearchButton,
}) => {
  return (
    <main className="w-full h-screen p-2xl">
      <header className="pb-2xl flex items-center justify-between gap-s">
        <h1>Inventario de envases</h1>
        <Button onClick={handleSearchButton} className="!ml-auto">
          <FaIcon type="fa-solid fa-search" />
          Buscar
        </Button>
      </header>
      <div className="flex gap-s mb-4">
        {Object.entries(TABS).map(([tab, title]) => (
          <Button
            key={tab}
            onClick={() => handleCurrentTab(tab)}
            className="!w-[12rem]"
            variant={currentTab === tab ? 'primary' : 'secondary'}
          >
            {title}
          </Button>
        ))}
      </div>

      <Table
        title="lotes"
        handleFetch={handleFetchData}
        columns={[
          { name: 'id', title: 'ID' },
          {
            name: 'createdAt',
            title: 'Fecha de creación',
            formatter: (rowData: WasteBottle) =>
              new Date(rowData.createdAt).toLocaleDateString(),
          },
          { name: 'trackingCode', title: 'Código de seguimiento' },
          {
            name: 'status',
            title: 'Lote asignado',
            formatter: (rowData: WasteBottle) => (
              <span>
                {rowData.recycledBatchId
                  ? `#${rowData.recycledBatchId}`
                  : 'No asignado'}
              </span>
            ),
          },
          {
            name: 'actions',
            title: 'Acciones',
            formatter: (rowData: WasteBottle) => (
              <ActionMenu
                itemId={rowData.id}
                emergeFrom="topRight"
                actions={menuActions.filter(
                  (action) => !action.hide || !action.hide(rowData)
                )}
                className="mx-auto w-max"
              />
            ),
          },
        ]}
        shouldRefresh={shouldRefresh}
        handleRefreshComplete={handleRefreshComplete}
      />

      <SearchModal />
      <DetailModal editingId={editingId} />
      <AssignModal editingId={editingId} handleSuccess={handleRefresh} />
    </main>
  );
};

export default withWasteBottlesController(WasteBottlesView);
