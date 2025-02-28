import withPrimaryProducerController from './withPrimaryProducerController';
import { BottleBatch, PrimaryProducerViewType } from './types';
import Table from '@/common/components/Table';
import Button from '@/common/components/Button';
import FaIcon from '@/common/components/FaIcon';
import ActionMenu from '@/common/components/ActionMenu';

const PrimaryProducerView: PrimaryProducerViewType = ({
  handleFetchData,
  handleCreateButton,
  editingId,
  DetailModal,
  FormModal,
  DeleteModal,
  SaleModal,
  RecycleModal,
  handleRefresh,
  shouldRefresh,
  handleRefreshComplete,
  menuActions,
}) => {
  return (
    <main className="w-full h-screen p-2xl">
      <header className="pb-2xl flex items-center justify-between">
        <h1>Lotes producidos</h1>
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
          { name: 'soldQuantity', title: 'Cantidad vendida' },
          { name: 'createdAt', title: 'Fecha de creación' },
          {
            name: 'actions',
            title: 'Acciones',
            formatter: (rowData: BottleBatch) => (
              <ActionMenu
                itemId={rowData.id}
                emergeFrom="topRight"
                actions={menuActions}
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
      <DeleteModal editingId={editingId} handleSuccess={handleRefresh} />
      <SaleModal editingId={editingId} handleSuccess={handleRefresh} />
      <RecycleModal editingId={editingId} handleSuccess={handleRefresh} />
    </main>
  );
};

export default withPrimaryProducerController(PrimaryProducerView);
