import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Modal, { ModalProps } from '@/common/components/Modal';
import useForm from '@/common/hooks/useForm';
import { RecyclingBatch, WasteBottle } from '../../types';
import RecyclerServices from '../../services';
import {
  BATCH_COMPOSITION_FORM_INPUTS,
  BATCH_FORM_INPUTS_1,
  BATCH_FORM_STRUCT,
} from '../../constants';
import Button from '@/common/components/Button';
import FaIcon from '@/common/components/FaIcon';
import InputCheckbox from '@/common/components/Inputs/InputCheckbox';
import LoadingSpinner from '@/common/components/LoadingSpinner';

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
  const [availableWasteBottles, setAvailableWasteBottles] = useState<
    WasteBottle[]
  >([]);
  const [loading, setLoading] = useState(false);
  const { form, handleChange, formBuilder, submitEnabled, setInitialForm } =
    useForm(BATCH_FORM_STRUCT);
  const isEditing = !!editingId;

  const fetchAvailableWasteBottles = async () => {
    setLoading(true);
    const { ok, data } = await RecyclerServices.getAvailableWasteBottles(
      1,
      100
    ); /// TODO: add pagination here.
    setLoading(false);
    if (ok) {
      setAvailableWasteBottles((prevBottles) => {
        const bottlesObj: Record<number, WasteBottle> = prevBottles.reduce(
          (acc, bottle) => ({ ...acc, [bottle.id]: bottle }),
          {}
        );
        data.forEach((bottle) => {
          bottlesObj[bottle.id] = bottle;
        });
        return Object.values(bottlesObj);
      });
    } else {
      toast.error('Ocurrió un error al cargar las botellas disponibles');
    }
  };

  const fetchBatchData = async () => {
    if (!editingId) return;
    const { ok, data } = await RecyclerServices.getRecyclingBatch(editingId);
    if (ok) {
      const formattedForm = {
        ...data,
        createdAt: data.createdAt
          ? new Date(data.createdAt).toISOString().split('T')[0]
          : null,
        wasteBottleIds: data.wasteBottleIds.reduce(
          (acc, id) => ({ ...acc, [id]: true }),
          {}
        ),
      };
      setInitialForm(formattedForm);
      setAvailableWasteBottles((prev) => [
        ...data.wasteBottleIds.map((id) => ({ id } as WasteBottle)),
        ...prev,
      ]);
    } else {
      toast.error('Ocurrió un error al cargar los datos del lote de material');
    }
  };

  const createBottleBatch = async (data: Partial<RecyclingBatch>) => {
    const payload = {
      ...data,
      wasteBottleIds: Object.entries(form.wasteBottleIds)
        .filter(([, value]) => value)
        .map(([key]) => Number(key)),
    };
    const { ok } = await RecyclerServices.createRecyclingBatch(payload);
    if (ok) {
      toast.success('Lote de material creado correctamente');
      handleCancel();
      handleSuccess();
    } else {
      toast.error(
        'Ocurrió un error al crear el lote de material. Intenta nuevamente más tarde'
      );
    }
  };

  const updateBottleBatch = async (data: Partial<RecyclingBatch>) => {
    if (!editingId) return;
    const id = editingId;
    const payload = {
      ...data,
      id,
      wasteBottleIds: Object.entries(form.wasteBottleIds)
        .filter(([, value]) => value)
        .map(([key]) => Number(key)),
    };
    const { ok } = await RecyclerServices.updateRecyclingBatch(payload);
    if (ok) {
      toast.success('Lote de material actualizado correctamente');
      handleCancel();
      handleSuccess();
    } else {
      toast.error('Ocurrió un error al actualizar el lote de material');
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
    const composition = form.composition ? [...form.composition] : [];
    composition.push({ name: '', amount: '', measureUnit: '' });
    handleChange('composition', composition);
  };

  const handleDeleteCompositionItem = (index: number) => {
    const composition = form.composition ? [...form.composition] : [];
    composition.splice(index, 1);
    handleChange('composition', composition);
  };

  const handleSelectAllBottles = () => {
    const isAlreadyAllSelected =
      Object.keys(form.wasteBottleIds).length === availableWasteBottles.length;
    if (isAlreadyAllSelected) {
      handleChange('wasteBottleIds', {});
    } else {
      handleChange(
        'wasteBottleIds',
        availableWasteBottles.reduce(
          (acc, bottle) => ({ ...acc, [bottle.id]: true }),
          {}
        )
      );
    }
  };

  useEffect(() => {
    if (editingId) fetchBatchData();
  }, [editingId]);

  useEffect(() => {
    fetchAvailableWasteBottles();
  }, []);

  return (
    <Modal handleCancel={handleCancel} big skippable={false} {...props}>
      <h2 className="w-full font-medium text-[1.75rem] bg-n0 border-b border-n2 pb-2 mb-1">
        {isEditing ? 'Editar' : 'Crear'} lote de material{' '}
        {editingId ? `#${editingId}` : ''}
      </h2>
      <form className="h-full w-full overflow-auto hide-scroll relative ">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            {formBuilder(BATCH_FORM_INPUTS_1)}
          </div>
          <hr className="my-4" />
          <div className="flex flex-col gap-2">
            <h3>Composición</h3>
            {form.composition?.map((_: any, i: number) => (
              <div key={i} className="flex gap-2">
                {formBuilder(
                  i === 0
                    ? BATCH_COMPOSITION_FORM_INPUTS
                    : BATCH_COMPOSITION_FORM_INPUTS.map((input) => ({
                        ...input,
                        label: '',
                      })),
                  {
                    prefix: `composition.${i}`,
                  }
                )}
                {form.composition.length > 1 && (
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
          <div className="flex flex-col gap-2">
            <h3>Botellas</h3>
            {loading ? (
              <LoadingSpinner size="2rem" className="mx-auto my-4" />
            ) : (
              !!availableWasteBottles.length && (
                <div className="grid grid-cols-3 gap-2">
                  <InputCheckbox
                    name="selectAll"
                    value={
                      Object.values(form.wasteBottleIds).filter((v) => v)
                        .length === availableWasteBottles.length
                        ? ['active']
                        : []
                    }
                    checkOptionValue="active"
                    label="Seleccionar todas"
                    handleChange={handleSelectAllBottles}
                    className="col-span-3"
                  />
                  {availableWasteBottles.map((bottle) => (
                    <InputCheckbox
                      key={bottle.id}
                      name={`wasteBottleIds.${bottle.id}`}
                      value={form.wasteBottleIds[bottle.id] ? ['active'] : []}
                      checkOptionValue="active"
                      label={`Botella #${bottle.id} ${
                        bottle.trackingCode ? `(${bottle.trackingCode})` : ''
                      }`}
                      handleChange={(name, value) =>
                        handleChange(name, !!value.includes('active'))
                      }
                    />
                  ))}
                </div>
              )
            )}
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
