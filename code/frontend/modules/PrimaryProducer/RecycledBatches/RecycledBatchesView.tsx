import withRecycledBatchesController from './withRecycledBatchesController';
import { RecycledBatchesViewType, RecyclingBatch } from './types';
import Table from '@/common/components/Table';
import ActionMenu from '@/common/components/ActionMenu';

const RecycledBatchesView: RecycledBatchesViewType = ({
  handleFetchData,
  editingId,
  DetailModal,
  shouldRefresh,
  handleRefreshComplete,
  menuActions,
}) => {
  return (
    <main className="w-full h-screen flex flex-col p-2xl">
      <header className="pb-2xl flex items-center justify-between gap-s">
        <h1>Material reciclado</h1>
      </header>
      <Table
        title="lotes"
        handleFetch={handleFetchData}
        columns={[
          { name: 'id', title: 'ID' },
          { name: 'weight', title: 'Peso (kg)' },
          { name: 'materialType', title: 'Tipo de material' },
          {
            name: 'createdAt',
            title: 'Fecha de creación',
            formatter: (rowData: RecyclingBatch) =>
              new Date(rowData.createdAt).toLocaleDateString(),
          },
          {
            name: 'actions',
            title: 'Acciones',
            formatter: (rowData: RecyclingBatch) => (
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

      <DetailModal editingId={editingId} />
    </main>
  );
};

export default withRecycledBatchesController(RecycledBatchesView);
