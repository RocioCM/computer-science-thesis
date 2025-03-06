import Modal, { ModalProps } from '@/common/components/Modal';
import PrimaryProducerServices from '../../services';
import { SellPayload, Buyer } from '../../types';
import useRichieForm from '@/common/hooks/useForm/useRichieForm';
import { toast } from 'react-toastify';
import Button from '@/common/components/Button';
import { SELL_FORM_INPUTS, SELL_FORM_STRUCT } from '../../constants';

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
  const { form, submitEnabled, formBuilder } = useRichieForm(SELL_FORM_STRUCT);

  const getBuyers = async (query: string) => {
    const { data } = await PrimaryProducerServices.searchBuyers(query);
    return (
      data?.map((buyer: Buyer) => ({
        label: `${buyer.userName}${buyer.userName ? ' - ' : ''}${buyer.email}`,
        value: buyer.firebaseUid,
      })) ?? []
    );
  };

  const handleSale = async () => {
    const payload: SellPayload = {
      batchId: editingId as number,
      quantity: form.quantity,
      buyerUid: form.buyerUid,
    };
    const { ok } = await PrimaryProducerServices.sellBatch(payload);
    if (ok) {
      toast.success(
        'Venta completada exitosamente. Los envases seleccionados ya están en propiedad del comprador'
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
    <Modal handleCancel={handleCancel} skippable={false} {...props}>
      <h2 className="w-full bg-n0">Venta lote #{editingId}</h2>
      <div className="w-full flex flex-col gap-m my-xl">
        {formBuilder(SELL_FORM_INPUTS, {
          handleSearch: {
            buyerUid: getBuyers,
          },
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
