import Modal, { ModalProps } from '@/common/components/Modal';
import { BottleBatch } from '../../types';
import PrimaryProducerServices from '../../services';
import { toast } from 'react-toastify';
import useForm from '@/common/hooks/useForm';
import {
  BATCH_COMPOSITION_FORM_INPUTS,
  BATCH_FORM_INPUTS_1,
  BATCH_FORM_INPUTS_2,
  BATCH_FORM_STRUCT,
} from '../../constants';
import Button from '@/common/components/Button';
import { useEffect } from 'react';

export interface Props extends ModalProps {
  handleCancel: () => any;
  editingId: number | null;
  handleSuccess: () => void;
}

const BatchFormModal = ({
  editingId,
  handleCancel,
  handleSuccess,
  ...props
}: Props) => {
  const { form, handleChange, formBuilder, submitEnabled, setInitialForm } =
    useForm(BATCH_FORM_STRUCT);
  const isEditing = !!editingId;

  const fetchBatchData = async () => {
    if (!editingId) return;
    const { ok, data } = await PrimaryProducerServices.getBatch(editingId);
    if (ok) {
      setInitialForm(data);
    } else {
      toast.error('Ocurrió un error al cargar los datos del lote de botellas');
    }
  };

  const createBottleBatch = async (data: Partial<BottleBatch>) => {
    const payload = data;
    const { ok } = await PrimaryProducerServices.createBatch(payload);
    if (ok) {
      toast.success('Lote de botellas creado correctamente');
      handleCancel();
      handleSuccess();
    } else {
      toast.error('Ocurrió un error al crear el lote de botellas');
    }
  };

  const updateBottleBatch = async (data: Partial<BottleBatch>) => {
    if (!editingId) return;
    const id = editingId;
    const payload = { ...data, id };
    const { ok } = await PrimaryProducerServices.updateBatch(id, payload);
    if (ok) {
      toast.success('Lote de botellas actualizado correctamente');
      handleCancel();
      handleSuccess();
    } else {
      toast.error('Ocurrió un error al actualizar el lote de botellas');
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      updateBottleBatch(form);
    } else {
      createBottleBatch(form);
    }
  };

  const handleAddCompositionItem = () => {
    const composition = form.bottleType?.composition
      ? [...form.bottleType.composition]
      : [];
    composition.push({ name: '', amount: '', measureUnit: '' });
    handleChange('bottleType.composition', composition);
  };

  const handleDeleteCompositionItem = (index: number) => {
    const composition = form.bottleType?.composition
      ? [...form.bottleType.composition]
      : [];
    composition.splice(index, 1);
    handleChange('bottleType.composition', composition);
  };

  useEffect(() => {
    if (editingId) fetchBatchData();
  }, [editingId]);

  return (
    <Modal handleCancel={handleCancel} big skippable={false} {...props}>
      <form className="h-full w-full overflow-auto relative">
        <h2 className="bg-n0 sticky top-0 pb-2">
          {isEditing ? 'Editar' : 'Crear'} lote de botellas
        </h2>
        <div className="flex flex-col gap-2">
          {formBuilder(BATCH_FORM_INPUTS_1)}
          <div className="flex flex-col gap-2">
            <h3>Composición</h3>
            {form.bottleType?.composition?.map((_: any, i: number) => (
              <div key={i} className="flex gap-2">
                {formBuilder(BATCH_COMPOSITION_FORM_INPUTS, {
                  prefix: `bottleType.composition.${i}`,
                })}
                {i > 0 && (
                  <Button
                    label="Eliminar"
                    handleClick={() => handleDeleteCompositionItem(i)}
                  />
                )}
              </div>
            ))}
            <Button
              label="Agregar material"
              handleClick={handleAddCompositionItem}
            />
          </div>
          {formBuilder(BATCH_FORM_INPUTS_2)}
        </div>
        <Button
          label={isEditing ? 'Actualizar' : 'Crear'}
          disabled={!submitEnabled}
          className="ml-auto mt-4 sticky bottom-0 min-w-[10rem]"
          handleClick={handleSubmit}
        />
      </form>
    </Modal>
  );
};

export default BatchFormModal;
