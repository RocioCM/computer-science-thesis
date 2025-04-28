import Modal, { ModalProps } from '@/common/components/Modal';
import ConsumerServices from '../../services';
import { CreateWasteBottlePayload, Recycler } from '../../types';
import { toast } from 'react-toastify';
import Button from '@/common/components/Button';
import { RECYCLE_FORM_INPUTS, RECYCLE_FORM_STRUCT } from '../../constants';
import useForm from '@/common/hooks/useForm';
import { useEffect } from 'react';

interface Props extends ModalProps {
  handleCancel: () => any;
  trackingCode: string;
  handleSuccess: () => void;
}

const BatchSaleModal: React.FC<Props> = ({
  trackingCode = '',
  handleCancel,
  handleSuccess,
  ...props
}) => {
  const { form, submitEnabled, formBuilder, handleChange } =
    useForm(RECYCLE_FORM_STRUCT);

  const getRecyclers = async (query: string) => {
    const { data } = await ConsumerServices.searchRecyclers(query);
    return (
      data?.map((recycler: Recycler) => ({
        label: `${recycler.userName}${recycler.userName ? ' - ' : ''}${
          recycler.email
        }`,
        value: recycler.firebaseUid,
      })) ?? []
    );
  };

  const handleRecycle = async () => {
    const payload: CreateWasteBottlePayload = {
      trackingCode,
      owner: form.recyclerUid,
    };
    const { ok } = await ConsumerServices.createWasteBottle(payload);
    if (ok) {
      toast.success(
        'Reciclaje registrado correctamente. ¡Gracias por reciclar!'
      );
      handleCancel();
      handleSuccess();
    } else {
      toast.error(
        'No se pudo registrar el reciclaje. Por favor, inténtelo de nuevo más tarde'
      );
    }
  };

  useEffect(() => {
    handleChange('trackingCode', trackingCode, false);
  }, [trackingCode]);

  return (
    <Modal handleCancel={handleCancel} {...props}>
      <h2 className="w-full bg-n0">Enviar a reciclar</h2>
      <div className="w-full flex flex-col gap-m my-xl">
        {formBuilder(RECYCLE_FORM_INPUTS, {
          handleSearch: { recyclerUid: getRecyclers },
        })}
      </div>
      <Button
        handleClick={handleRecycle}
        disabled={!submitEnabled}
        width="full"
        label="Enviar"
      />
    </Modal>
  );
};

export default BatchSaleModal;
