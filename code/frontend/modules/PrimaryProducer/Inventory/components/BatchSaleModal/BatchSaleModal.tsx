import Modal, { ModalProps } from '@/common/components/Modal';
import PrimaryProducerServices from '../../services';
import { SellPayload, Buyer } from '../../types';
import { toast } from 'react-toastify';
import Button from '@/common/components/Button';
import { SELL_FORM_INPUTS, SELL_FORM_STRUCT } from '../../constants';
import useForm from '@/common/hooks/useForm';
import { HTTP_STATUS } from '@/common/constants';

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
    const { ok, status } = await PrimaryProducerServices.sellBatch(payload);
    if (ok) {
      toast.success(
        'Venta completada exitosamente. Los envases seleccionados ya están en propiedad del comprador'
      );
      handleCancel();
      handleSuccess();
    } else {
      if (status === HTTP_STATUS.badRequest) {
        toast.error(
          'No puedes vender más productos de los que tienes disponibles en tu lote'
        );
      } else {
        toast.error(
          'No se pudo completar la venta. Por favor, inténtelo de nuevo más tarde'
        );
      }
    }
  };

  return (
    <Modal handleCancel={handleCancel} {...props}>
      <h2 className="w-full font-medium text-[1.75rem]  bg-n0 border-b border-n2 pb-2 mb-1">
        Venta lote #{editingId}
      </h2>
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
