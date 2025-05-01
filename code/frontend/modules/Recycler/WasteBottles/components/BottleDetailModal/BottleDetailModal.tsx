import Modal, { ModalProps } from '@/common/components/Modal';
import RecyclerServices from '../../services';
import { toast } from 'react-toastify';
import { Material } from '../../types';
import { useEffect, useState } from 'react';

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

  const fetchWasteBottle = async (wasteBottleId: number) => {
    const { ok, data } = await RecyclerServices.getWasteBottleTracking(
      wasteBottleId
    );
    if (ok) {
      const stagesObject = data.reduce<Record<string, any>>((acc, curr) => {
        acc[curr.stage] = curr.data;
        return acc;
      }, {});
      const { ok, data: dataHistory } = await RecyclerServices.searchBottle(
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
    <Modal handleCancel={handleCancel} big skippable {...props}>
      <h2 className="w-full bg-n0">Buscar botellas</h2>

      {!!wasteBottle && (
        <>
          <hr className="w-[95%] border border-n1 my-6 mx-auto" />

          <div className="h-full w-full overflow-auto hide-scroll relative pt-2">
            {/* Información General */}
            <div className="grid grid-cols-2 gap-3xl">
              {wasteBottle.product && (
                <div className=" space-y-2">
                  <h3 className="text-lg font-semibold pb-2">
                    Información del producto
                  </h3>

                  <p>
                    <span className="font-semibold">
                      Código de seguimiento:
                    </span>{' '}
                    {wasteBottle.product.trackingCode}
                  </p>
                  {wasteBottle.product.ownerName && (
                    <p>
                      <span className="font-semibold">Productor:</span>{' '}
                      {wasteBottle.product.ownerName}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Fecha de producción:</span>{' '}
                    {new Date(
                      wasteBottle.product.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Detalles de la Botella */}
              {wasteBottle.base && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold pb-2">
                      Detalles del envase
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p>
                        <span className="font-semibold">Peso:</span>{' '}
                        {wasteBottle.base.bottleType.weight}g
                      </p>
                      <p>
                        <span className="font-semibold">Color:</span>{' '}
                        {wasteBottle.base.bottleType.color}
                      </p>
                      <p>
                        <span className="font-semibold">Espesor:</span>{' '}
                        {wasteBottle.base.bottleType.thickness} mm
                      </p>
                      <p>
                        <span className="font-semibold">Origen:</span>{' '}
                        {wasteBottle.base.bottleType.originLocation}
                      </p>
                      {wasteBottle.base.ownerName && (
                        <p>
                          <span className="font-semibold">Productor:</span>{' '}
                          {wasteBottle.base.ownerName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Composición */}
                  <div className="mt-6 col-span-2">
                    <h3 className="text-lg font-semibold pb-2">Composición</h3>
                    {wasteBottle.base?.bottleType.composition.length ? (
                      <table className="w-full mt-2 border border-n2 rounded-md">
                        <thead>
                          <tr className="bg-n1 text-gray-700">
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
                  </div>
                </>
              )}

              {/* Detalles del Reciclaje */}
              {wasteBottle.recycling && (
                <div className="h-full w-full relative pt-2 col-span-2">
                  {/* Información General */}
                  <div className="grid grid-cols-2 gap-m mt-4">
                    <h3 className="text-lg font-semibold border-b py-2 col-span-2">
                      Lote de reciclaje
                    </h3>
                    <p>
                      <span className="font-semibold">Material:</span>{' '}
                      {wasteBottle.recycling.materialType}
                    </p>
                    <p>
                      <span className="font-semibold">Tamaño:</span>{' '}
                      {wasteBottle.recycling.size}
                    </p>
                    <p>
                      <span className="font-semibold">Peso:</span>{' '}
                      {wasteBottle.recycling.weight} kg
                    </p>
                    <p>
                      <span className="font-semibold">Fecha de creación:</span>{' '}
                      {new Date(
                        wasteBottle.recycling.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Composición */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold border-t py-2">
                      Composición
                    </h3>
                    {wasteBottle.recycling.composition.length > 0 ? (
                      <table className="w-full mt-2 border border-gray-300 rounded-md">
                        <thead>
                          <tr className="bg-gray-100 text-gray-700">
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
                  {/* Información Adicional */}
                  {wasteBottle.recycling.extraInfo && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold border-t py-2">
                        Información Adicional
                      </h3>
                      <p className="text-gray-700 mt-2">
                        {wasteBottle.recycling.extraInfo}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default BottleDetailModal;
