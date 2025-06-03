import Modal, { ModalProps } from '@/common/components/Modal';
import { useEffect, useState } from 'react';
import { BaseBottleBatch, ProductBottlesBatch } from '../../types';
import SecondaryProducerServices from '../../services';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/common/components/LoadingSpinner';

interface Props extends ModalProps {
  handleCancel: () => any;
  editingId: number | null;
}

const BatchDetailModal: React.FC<Props> = ({
  editingId,
  handleCancel,
  ...props
}) => {
  const [batch, setBatch] = useState<ProductBottlesBatch | null>(null);
  const [baseBatch, setBaseBatch] = useState<BaseBottleBatch | null>(null);

  const fetchBatchData = async () => {
    if (!editingId) return;
    const { ok, data } = await SecondaryProducerServices.getBatch(editingId);
    if (ok) {
      setBatch(data);
      fetchBaseBatchData(data.originBaseBatchId);
    } else {
      toast.error('Ocurrió un error al cargar los datos del lote de envases');
    }
  };

  const fetchBaseBatchData = async (baseBatchId: number) => {
    if (!editingId) return;
    const { ok, data } = await SecondaryProducerServices.getBaseBatch(
      baseBatchId
    );
    if (ok) {
      setBaseBatch(data);
    } else {
      toast.error('Ocurrió un error al cargar los datos del lote base');
    }
  };

  useEffect(() => {
    if (editingId) fetchBatchData();
  }, [editingId]);

  return (
    <Modal
      handleCancel={handleCancel}
      big
      skippable={false}
      {...props}
      className="flex !justify-end w-full h-full !items-end !p-0"
      contentClassName="!rounded-none animate__slideInRight h-screen !px-10"
    >
      <h2 className="w-full font-medium text-[1.75rem] bg-n0  pb-2">
        Lote de envases #{editingId}
      </h2>

      {batch ? (
        <div className="h-full w-full overflow-auto hide-scroll relative pt-2">
          {/* Información General */}
          <section className="grid md:grid-cols-2 gap-2 border border-n2 rounded-xl p-4">
            <div className=" space-y-2">
              <h3 className="text-lg font-semibold border-b pb-2">
                Información General
              </h3>
              <p>
                <span className="font-semibold">Cantidad de envases:</span>{' '}
                {batch.quantity}
              </p>
              <p>
                <span className="font-semibold">Disponibles:</span>{' '}
                {batch.availableQuantity}
              </p>
              <p>
                <span className="font-semibold">Fecha de recepción:</span>{' '}
                {new Date(batch.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Detalles de la Botella */}
            {baseBatch && (
              <div>
                <h3 className="text-lg font-semibold border-b pb-2">
                  Detalles de la Botella
                </h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="font-semibold">Peso:</span>{' '}
                    {baseBatch.bottleType.weight}g
                  </p>
                  <p>
                    <span className="font-semibold">Color:</span>{' '}
                    {baseBatch.bottleType.color}
                  </p>
                  <p>
                    <span className="font-semibold">Espesor:</span>{' '}
                    {baseBatch.bottleType.thickness} mm
                  </p>
                  <p>
                    <span className="font-semibold">Forma:</span>{' '}
                    {baseBatch.bottleType.shapeType}
                  </p>
                </div>
              </div>
            )}
            {/* Composición */}
            <div className="mt-2 col-span-2">
              <h3 className="text-lg font-semibold border-b pb-2">
                Composición
              </h3>
              {baseBatch?.bottleType.composition.length ? (
                <table className="w-full mt-2 border border-gray-300 rounded-md">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="px-4 py-2 text-left">Material</th>
                      <th className="px-4 py-2 text-left">Cantidad</th>
                      <th className="px-4 py-2 text-left">Unidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {baseBatch.bottleType.composition.map((material, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{material.name}</td>
                        <td className="px-4 py-2">{material.amount}</td>
                        <td className="px-4 py-2">{material.measureUnit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 mt-2">
                  No hay información de composición.
                </p>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <LoadingSpinner className="mt-8" />
        </div>
      )}
    </Modal>
  );
};

export default BatchDetailModal;
