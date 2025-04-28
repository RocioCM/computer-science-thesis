import withConsumerController from './withConsumerController';
import { ConsumerViewType, WasteBottle } from './types';
import Button from '@/common/components/Button';
import FaIcon from '@/common/components/FaIcon';
import Table from '@/common/components/Table';
import ActionMenu from '@/common/components/ActionMenu';

const ConsumerView: ConsumerViewType = ({
  editingId,
  SearchModal,
  RecycleModal,
  DeleteModal,
  DetailModal,
  handleSearchButton,
  handleRecycle,
  trackingCode,
  shouldRefresh,
  handleFetchData,
  handleDelete,
  handleRefresh,
  handleRefreshComplete,
  menuActions,
}) => {
  return (
    <main className="w-full h-screen p-2xl">
      <header className="pb-2xl flex items-center justify-between">
        <h1>Botellas recicladas</h1>
        <Button onClick={handleSearchButton}>
          <FaIcon type="fa-solid fa-search" />
          Buscar
        </Button>
      </header>

      <Table
        title="lotes"
        handleFetch={handleFetchData}
        columns={[
          { name: 'id', title: 'ID' },
          { name: 'trackingCode', title: 'Código de seguimiento' },
          {
            name: 'createdAt',
            title: 'Fecha de creación',
            formatter: (rowData: WasteBottle) =>
              new Date(rowData.createdAt).toLocaleDateString(),
          },
          {
            name: 'status',
            title: 'Estado',
            formatter: (_rowData: WasteBottle) => <span>{'Pendiente'}</span>,
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

      <SearchModal handleRecycle={handleRecycle} />
      <RecycleModal trackingCode={trackingCode} handleSuccess={handleRefresh} />
      <DetailModal wasteBottleId={editingId} />
      <DeleteModal
        title="¿Confirmas que deseas eliminar esta botella?"
        subtitle="Simplemente dejarás de verla en tu lista de botellas recicladas"
        handleConfirm={handleDelete}
      />
    </main>
  );
};

export default withConsumerController(ConsumerView);
