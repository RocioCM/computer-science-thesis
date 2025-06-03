import Button from '@/common/components/Button';
import Modal, { ModalProps } from '@/common/components/Modal';
import { toast } from 'react-toastify';
import useForm from '@/common/hooks/useForm';
import { ASSIGN_FORM_INPUTS, ASSIGN_FORM_STRUCT } from '../../constants';
import WasteBottlesServices from '../../services';
import { AssignBottleToBatchPayload } from '../../types';
import { useEffect, useState } from 'react';
import { ZERO_ADDRESS } from '@/common/constants';
import { Option } from '@/common/components/Inputs/InputDropdown/InputDropdown';

interface Props extends ModalProps {
  handleCancel: () => any;
  editingId: number | null;
  handleSuccess: () => void;
}

const AssignBatchModal: React.FC<Props> = ({
  editingId,
  handleCancel,
  handleSuccess,
  ...props
}) => {
  const [availableBatchesList, setAvailableBatchesList] = useState<Option[]>(
    []
  );
  const { form, submitEnabled, formBuilder } = useForm(ASSIGN_FORM_STRUCT);

  const fetchAvailableBatches = async () => {
    const { ok, data } = await WasteBottlesServices.getAllUserRecyclingBatches(
      1,
      100
    ); /// TODO: implement infinite scroll or search.
    if (ok) {
      const filteredData = data
        ?.filter(
          (batch) => !batch.buyerOwner || batch.buyerOwner === ZERO_ADDRESS
        )
        .map((batch) => ({
          label: `Lote #${batch.id}`,
          value: batch.id,
        }));
      setAvailableBatchesList(filteredData ?? []);
    } else {
      toast.error('Ocurrió un error al cargar los lotes disponibles');
    }
  };

  useEffect(() => {
    fetchAvailableBatches();
  }, []);

  const handleSubmit = async () => {
    const payload: AssignBottleToBatchPayload = {
      bottleId: editingId as number,
      batchId: form.batchId,
    };
    const { ok } = await WasteBottlesServices.assignBottleToBatch(payload);
    if (ok) {
      toast.success(
        `Botella asignada al lote #${payload.batchId} correctamente`
      );
      handleCancel();
      handleSuccess();
    } else {
      toast.error(
        'Ocurrió un error al asignar la botella. Por favor, inténtelo de nuevo más tarde'
      );
    }
  };

  return (
    <Modal handleCancel={handleCancel} {...props}>
      <h2 className="w-full font-medium text-[1.75rem] bg-n0 border-b border-n2 pb-2 mb-1">
        Asignar lote #{editingId}
      </h2>
      <div className="w-full flex flex-col gap-m my-xl">
        {formBuilder(ASSIGN_FORM_INPUTS, {
          dropdownOptions: { batchId: availableBatchesList },
        })}
      </div>
      <Button
        handleClick={handleSubmit}
        disabled={!submitEnabled}
        width="full"
        label="Asignar"
      />
    </Modal>
  );
};

export default AssignBatchModal;
