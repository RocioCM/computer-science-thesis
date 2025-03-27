import Modal, { ModalProps } from '@/common/components/Modal';
import RecyclerServices from '../../services';
import { SellRecyclingBatchPayload, Buyer } from '../../types';
import { toast } from 'react-toastify';
import Button from '@/common/components/Button';
import { SELL_FORM_INPUTS, SELL_FORM_STRUCT } from '../../constants';
import useForm from '@/common/hooks/useForm';

interface Props extends ModalProps {
  handleCancel: () => any;
  editingId: number | null;
  handleSuccess: () => void;
}

const BatchSaleModal: React.FC<Props> = ({
  editingId,
  handleCancel,
  handleSuccess,
  ...props
}) => {
  const { form, submitEnabled, formBuilder } = useForm(SELL_FORM_STRUCT);

  const getBuyers = async (query: string) => {
    const { data } = await RecyclerServices.searchBuyers(query);
    return (
      data?.map((buyer: Buyer) => ({
        label: `${buyer.userName}${buyer.userName ? ' - ' : ''}${buyer.email}`,
        value: buyer.firebaseUid,
      })) ?? []
    );
  };

  const handleSale = async () => {
    const payload: SellRecyclingBatchPayload = {
      batchId: editingId as number,
      buyerUid: form.buyerUid,
    };
    const { ok } = await RecyclerServices.sellRecyclingBatch(payload);
    if (ok) {
      toast.success(
        'Venta completada exitosamente. El lote reciclado ya está en propiedad del comprador'
      );
      handleCancel();
      handleSuccess();
    } else {
      toast.error(
        'No se pudo completar la venta. Por favor, inténtelo de nuevo más tarde'
      );
    }
  };

  return (
    <Modal handleCancel={handleCancel} {...props}>
      <h2 className="w-full bg-n0">Venta lote #{editingId}</h2>
      <div className="w-full flex flex-col gap-m my-xl">
        {formBuilder(SELL_FORM_INPUTS, {
          handleSearch: { buyerUid: getBuyers },
        })}
      </div>
      <Button
        handleClick={handleSale}
        disabled={!submitEnabled}
        width="full"
        label="Vender"
      />
    </Modal>
  );
};

export default BatchSaleModal;
