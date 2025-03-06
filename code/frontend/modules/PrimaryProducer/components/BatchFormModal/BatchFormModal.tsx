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
import FaIcon from '@/common/components/FaIcon';

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
    const { ok } = await PrimaryProducerServices.updateBatch(payload);
    if (ok) {
      toast.success('Lote de botellas actualizado correctamente');
      handleCancel();
      handleSuccess();
    } else {
      toast.error('Ocurrió un error al actualizar el lote de botellas');
    }
  };

  const handleSubmit = async () => {
    if (editingId) {
      await updateBottleBatch(form);
    } else {
      await createBottleBatch(form);
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
      <h2 className="w-full bg-n0">
        {isEditing ? 'Editar' : 'Crear'} lote de botellas{' '}
        {editingId ? `#${editingId}` : ''}
      </h2>
      <form className="h-full w-full overflow-auto hide-scroll relative pt-2">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {formBuilder(BATCH_FORM_INPUTS_1)}
          </div>
          <hr className="my-4" />
          <div className="flex flex-col gap-2">
            <h3>Composición</h3>
            {form.bottleType?.composition?.map((_: any, i: number) => (
              <div key={i} className="flex gap-2">
                {formBuilder(
                  i === 0
                    ? BATCH_COMPOSITION_FORM_INPUTS
                    : BATCH_COMPOSITION_FORM_INPUTS.map((input) => ({
                        ...input,
                        label: '',
                      })),
                  {
                    prefix: `bottleType.composition.${i}`,
                  }
                )}
                {form.bottleType.composition.length > 1 && (
                  <Button
                    title="Eliminar"
                    variant="secondary"
                    handleClick={() => handleDeleteCompositionItem(i)}
                    className={i === 0 ? 'mt-[1.8rem]' : ''}
                  >
                    <FaIcon type="fa-solid fa-trash-can" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="secondary" handleClick={handleAddCompositionItem}>
              <FaIcon type="fa-solid fa-plus" /> Agregar material
            </Button>
          </div>
          <hr className="my-4" />
          <div className="grid grid-cols-2 gap-2">
            {formBuilder(BATCH_FORM_INPUTS_2)}
          </div>
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
