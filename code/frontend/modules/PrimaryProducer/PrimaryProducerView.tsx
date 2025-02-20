import withPrimaryProducerController from './withPrimaryProducerController';
import { BottleBatch, PrimaryProducerViewType } from './types';
import ButtonAdd from '@/common/components/ButtonAdd';
import Table from '@/common/components/Table';
import Button from '@/common/components/Button';

const PrimaryProducerView: PrimaryProducerViewType = ({
  handleFetchData,
  handleCreateButton,
  editingId,
  FormModal,
  handleRefresh,
  shouldRefresh,
  handleRefreshComplete,
  handleShowDetail,
}) => {
  return (
    <main className="w-full h-screen px-3xl py-l bg-n1">
      <h1 className="mb-l">Lotes producidos</h1>
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
              <Button
                variant="secondary"
                handleClick={() => handleShowDetail(rowData.id)}
              >
                Ver
              </Button>
            ),
          },
        ]}
        shouldRefresh={shouldRefresh}
        handleRefreshComplete={handleRefreshComplete}
      />
      <ButtonAdd onClick={handleCreateButton} title="Crear" />
      <FormModal editingId={editingId} handleSuccess={handleRefresh} />
    </main>
  );
};

export default withPrimaryProducerController(PrimaryProducerView);
