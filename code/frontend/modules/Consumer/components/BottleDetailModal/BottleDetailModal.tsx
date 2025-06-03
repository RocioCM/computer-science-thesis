import Modal, { ModalProps } from '@/common/components/Modal';
import ConsumerServices from '../../services';
import { toast } from 'react-toastify';
import { Material } from '../../types';
import { useEffect, useState } from 'react';
import LoadingSpinner from '@/common/components/LoadingSpinner';

export interface Props extends ModalProps {
  handleCancel: () => any;
  wasteBottleId: number | null;
}

const BottleDetailModal = ({
  handleCancel,
  wasteBottleId,
  ...props
}: Props) => {
  const [wasteBottle, setWasteBottle] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWasteBottle = async (wasteBottleId: number) => {
    setLoading(true);
    const { ok, data } = await ConsumerServices.getWasteBottleTracking(
      wasteBottleId
    );
    if (ok) {
      const stagesObject = data.reduce<Record<string, any>>((acc, curr) => {
        acc[curr.stage] = curr.data;
        return acc;
      }, {});
      const { ok, data: dataHistory } = await ConsumerServices.searchBottle(
        stagesObject.pickup?.trackingCode
      );
      if (ok) {
        dataHistory.forEach((item: any) => {
          stagesObject[item.stage] = item.data;
        });
        setWasteBottle(stagesObject);
      } else {
        toast.error(
          'Código no encontrado. Por favor, verifique e intente nuevamente'
        );
      }
    } else {
      toast.error(
        'Código no encontrado. Por favor, verifique e intente nuevamente'
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (wasteBottleId) {
      fetchWasteBottle(wasteBottleId);
    }
  }, [wasteBottleId]);

  if (!wasteBottleId) {
    return null;
  }

  return (
    <Modal
      handleCancel={handleCancel}
      big
      skippable
      className="flex !justify-end w-full h-full !items-end !p-0"
      contentClassName="!rounded-none animate__slideInRight h-screen !px-10"
      {...props}
    >
      <h2 className="w-full font-medium text-[1.75rem] bg-n0  pb-2 ">
        Botella reciclada #{wasteBottleId}
      </h2>

      {loading && (
        <div className="h-full w-full flex items-center justify-center">
          <LoadingSpinner className="mt-8" size="3rem" />
        </div>
      )}

      {!!wasteBottle && (
        <div className="h-full w-full overflow-auto hide-scroll relative pt-2 space-y-6">
          {/* INFORMACIÓN DEL PRODUCTO Y ENVASE */}
          <section className="grid md:grid-cols-2 gap-6 border  border-n2 rounded-xl p-4">
            <h4 className="w-full font-medium  col-span-2 text-neutral-600 ">
              Origen
            </h4>
            {/* Producto */}
            {wasteBottle.product && (
              <article className="space-y-2 ">
                <h3 className="text-lg font-semibold pb-2 border-b">
                  Producto
                </h3>
                <p>
                  <strong>Código de seguimiento:</strong>{' '}
                  {wasteBottle.product.trackingCode}
                </p>
                {wasteBottle.product.ownerName && (
                  <p>
                    <strong>Productor:</strong> {wasteBottle.product.ownerName}
                  </p>
                )}
                <p>
                  <strong>Fecha de producción:</strong>{' '}
                  {new Date(wasteBottle.product.createdAt).toLocaleDateString()}
                </p>
              </article>
            )}

            {/* Envase */}
            {wasteBottle.base && (
              <article className="space-y-2">
                <h3 className="text-lg font-semibold pb-2 border-b">Envase</h3>
                <p>
                  <strong>Peso:</strong> {wasteBottle.base.bottleType.weight}g
                </p>
                <p>
                  <strong>Color:</strong> {wasteBottle.base.bottleType.color}
                </p>
                <p>
                  <strong>Espesor:</strong>{' '}
                  {wasteBottle.base.bottleType.thickness} mm
                </p>
                <p>
                  <strong>Origen:</strong>{' '}
                  {wasteBottle.base.bottleType.originLocation}
                </p>
                {wasteBottle.base.ownerName && (
                  <p>
                    <strong>Productor:</strong> {wasteBottle.base.ownerName}
                  </p>
                )}
              </article>
            )}
            {/* COMPOSICIÓN DEL ENVASE */}
            {wasteBottle.base && (
              <section className="col-span-2">
                <h3 className="text-lg font-semibold pb-2 w-full  border-b">
                  Composición del envase
                </h3>
                {wasteBottle.base.bottleType.composition.length ? (
                  <table className="w-full mt-2 border border-n2 rounded-md">
                    <thead className="bg-n1 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left">Material</th>
                        <th className="px-4 py-2 text-left">Cantidad</th>
                        <th className="px-4 py-2 text-left">Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wasteBottle.base.bottleType.composition.map(
                        (material: Material, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{material.name}</td>
                            <td className="px-4 py-2">{material.amount}</td>
                            <td className="px-4 py-2">
                              {material.measureUnit}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-n3 mt-2">
                    No hay información de composición.
                  </p>
                )}
              </section>
            )}
          </section>

          {/* RECICLAJE */}
          {wasteBottle.recycling && (
            <section className="flex flex-col gap-4 border  border-n2 rounded-xl p-4">
              <h4 className="w-full font-medium  col-span-2 text-neutral-600 ">
                Reciclaje
              </h4>
              <div>
                <h3 className=" font-semibold pb-2 mb-4 border-b">
                  Lote de reciclaje
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <p>
                    <strong>Material:</strong>{' '}
                    {wasteBottle.recycling.materialType}
                  </p>
                  <p>
                    <strong>Tamaño:</strong> {wasteBottle.recycling.size}
                  </p>
                  <p>
                    <strong>Peso:</strong> {wasteBottle.recycling.weight} kg
                  </p>
                  <p>
                    <strong>Fecha de creación:</strong>{' '}
                    {new Date(
                      wasteBottle.recycling.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Composición reciclaje */}
              <div className="mt-6">
                <h4 className=" font-semibold border-b mb-4 pb-2">
                  Composición
                </h4>
                {wasteBottle.recycling.composition.length > 0 ? (
                  <table className="w-full mt-2 border border-gray-300 rounded-md">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left">Material</th>
                        <th className="px-4 py-2 text-left">Cantidad</th>
                        <th className="px-4 py-2 text-left">Unidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {wasteBottle.recycling.composition.map(
                        (material: Material, index: number) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{material.name}</td>
                            <td className="px-4 py-2">{material.amount}</td>
                            <td className="px-4 py-2">
                              {material.measureUnit}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600 mt-2">
                    No hay información de composición.
                  </p>
                )}
              </div>

              {/* Extra info */}
              {wasteBottle.recycling.extraInfo && (
                <div className="mt-6">
                  <h4 className="text-base font-semibold border-t pt-4 pb-2">
                    Información Adicional
                  </h4>
                  <p className="text-gray-700 mt-2">
                    {wasteBottle.recycling.extraInfo}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      )}
    </Modal>
  );
};

export default BottleDetailModal;
