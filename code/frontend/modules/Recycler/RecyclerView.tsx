import withRecyclerController from './withRecyclerController';
import { RecyclerViewType, RecyclingBatch } from './types';
import Button from '@/common/components/Button';
import FaIcon from '@/common/components/FaIcon';
import Table from '@/common/components/Table';
import ActionMenu from '@/common/components/ActionMenu';
import { ZERO_ADDRESS } from '@/common/constants';

const RecyclerView: RecyclerViewType = ({
  handleFetchData,
  editingId,
  DetailModal,
  FormModal,
  DeleteModal,
  SaleModal,
  SearchModal,
  handleCreateButton,
  handleSearchButton,
  handleDelete,
  handleRefresh,
  shouldRefresh,
  handleRefreshComplete,
  menuActions,
}) => {
  return (
    <main className="w-full h-screen p-2xl">
      <header className="pb-2xl flex items-center justify-between gap-s">
        <h1>Inventario de envases</h1>
        <Button
          onClick={handleSearchButton}
          className="!ml-auto"
          variant="secondary"
        >
          <FaIcon type="fa-solid fa-search" />
          Buscar
        </Button>
        <Button onClick={handleCreateButton}>
          <FaIcon type="fa-solid fa-plus" />
          Crear lote
        </Button>
      </header>
      <Table
        title="lotes"
        handleFetch={handleFetchData}
        columns={[
          { name: 'id', title: 'ID' },
          { name: 'quantity', title: 'Cantidad' },
          { name: 'availableQuantity', title: 'Cantidad disponible' },
          {
            name: 'createdAt',
            title: 'Fecha de creación',
            formatter: (rowData: RecyclingBatch) =>
              new Date(rowData.createdAt).toLocaleDateString(),
          },
          { name: 'trackingCode', title: 'Código de seguimiento' },
          {
            name: 'status',
            title: 'Estado',
            formatter: (rowData: RecyclingBatch) => (
              <span>
                {!rowData.buyerOwner || rowData.buyerOwner === ZERO_ADDRESS
                  ? 'Activo'
                  : 'Vendido'}
              </span>
            ),
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

      <SearchModal />
      <DetailModal editingId={editingId} />
      <FormModal editingId={editingId} handleSuccess={handleRefresh} />
      <DeleteModal
        title="¿Confirmas que deseas eliminar este lote?"
        subtitle="Si eliminas este lote, no podrás recuperar su información. Esta acción no se puede deshacer."
        handleConfirm={handleDelete}
      />
      <SaleModal editingId={editingId} handleSuccess={handleRefresh} />
    </main>
  );
};

export default withRecyclerController(RecyclerView);
