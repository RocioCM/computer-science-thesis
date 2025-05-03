import withSecondaryProducerController from './withSecondaryProducerController';
import { ProductBottlesBatch, SecondaryProducerViewType } from './types';
import Table from '@/common/components/Table';
import ActionMenu from '@/common/components/ActionMenu';

const SecondaryProducerView: SecondaryProducerViewType = ({
  handleFetchData,
  editingId,
  DetailModal,
  FormModal,
  DeleteModal,
  RejectModal,
  SaleModal,
  RecycleModal,
  handleDelete,
  handleReject,
  handleRefresh,
  shouldRefresh,
  handleRefreshComplete,
  menuActions,
}) => {
  return (
    <main className="w-full h-screen flex flex-col p-2xl">
      <header className="pb-2xl flex items-center justify-between">
        <h1>Inventario de envases</h1>
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
            formatter: (rowData: ProductBottlesBatch) =>
              new Date(rowData.createdAt).toLocaleDateString(),
          },
          { name: 'trackingCode', title: 'Código de seguimiento' },
          {
            name: 'status',
            title: 'Estado',
            formatter: (rowData: ProductBottlesBatch) => (
              <span>
                {!rowData.trackingCode
                  ? 'Pendiente'
                  : rowData.availableQuantity > 0
                  ? 'Disponible'
                  : 'Vendido'}
              </span>
            ),
          },

          {
            name: 'actions',
            title: 'Acciones',
            formatter: (rowData: ProductBottlesBatch) => (
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
      <FormModal editingId={editingId} handleSuccess={handleRefresh} />
      <DeleteModal
        title="¿Confirmas que deseas eliminar el código de este lote?"
        subtitle="Siempre puedes volver a agregarlo luego."
        handleConfirm={handleDelete}
      />
      <RejectModal
        title="¿Confirmas que deseas rechazar este lote?"
        subtitle="Si rechazas este lote, el stock será devuelto al vendedor y no podrás recuperarlo luego."
        handleConfirm={handleReject}
      />
      <SaleModal editingId={editingId} handleSuccess={handleRefresh} />
      <RecycleModal editingId={editingId} handleSuccess={handleRefresh} />
    </main>
  );
};

export default withSecondaryProducerController(SecondaryProducerView);
