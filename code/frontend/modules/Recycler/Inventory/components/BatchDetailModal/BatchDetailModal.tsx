import Modal, { ModalProps } from '@/common/components/Modal';
import { useEffect, useState } from 'react';
import { RecyclingBatch } from '../../types';
import RecyclerServices from '../../services';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/common/components/LoadingSpinner';

interface Props extends ModalProps {
  handleCancel: () => any;
  editingId: number | null;
  handleSuccess: () => void;
}

const BatchDetailModal: React.FC<Props> = ({
  editingId,
  handleCancel,
  ...props
}) => {
  const [batch, setBatch] = useState<RecyclingBatch | null>(null);

  const fetchBatchData = async () => {
    if (!editingId) return;
    const { ok, data } = await RecyclerServices.getRecyclingBatch(editingId);
    if (ok) {
      setBatch(data);
    } else {
      toast.error('Ocurrió un error al cargar los datos del lote de botellas');
    }
  };

  useEffect(() => {
    if (editingId) fetchBatchData();
  }, [editingId]);

  return (
    <Modal handleCancel={handleCancel} big skippable={false} {...props}>
      <h2 className="w-full bg-n0">Lote de botellas #{editingId}</h2>

      {batch ? (
        <div className="h-full w-full overflow-auto hide-scroll relative pt-2">
          {/* Información General */}
          <div className="grid grid-cols-2 gap-m mt-4">
            <h3 className="text-lg font-semibold border-b py-2 col-span-2">
              Información General
            </h3>
            <p>
              <span className="font-semibold">Material:</span>{' '}
              {batch.materialType}
            </p>
            <p>
              <span className="font-semibold">Tamaño:</span> {batch.size}
            </p>
            <p>
              <span className="font-semibold">Peso:</span> {batch.weight} kg
            </p>
            <p>
              <span className="font-semibold">Fecha de creación:</span>{' '}
              {new Date(batch.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Composición */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold border-t py-2">Composición</h3>
            {batch.composition.length > 0 ? (
              <table className="w-full mt-2 border border-gray-300 rounded-md">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2 text-left">Material</th>
                    <th className="px-4 py-2 text-left">Cantidad</th>
                    <th className="px-4 py-2 text-left">Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {batch.composition.map((material, index) => (
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
          {/* Información Adicional */}
          {batch.extraInfo && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold border-t py-2">
                Información Adicional
              </h3>
              <p className="text-gray-700 mt-2">{batch.extraInfo}</p>
            </div>
          )}

          {/* Botellas */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold border-t py-2">Botellas</h3>
            {batch.wasteBottleIds.length > 0 ? (
              <ul className="grid grid-cols-4 gap-2">
                {batch.wasteBottleIds.map((bottleId) => (
                  <li
                    key={bottleId}
                    className="font-semibold border rounded-rl p-3"
                  >
                    Botella #{bottleId}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 mt-2">No hay botellas asociadas.</p>
            )}
          </div>
        </div>
      ) : (
        <LoadingSpinner className="mt-8" />
      )}
    </Modal>
  );
};

export default BatchDetailModal;
