import Modal, { ModalProps } from '@/common/components/Modal';
import { toast } from 'react-toastify';
import useForm from '@/common/hooks/useForm';
import { SEARCH_FORM_INPUTS, SEARCH_FORM_STRUCT } from '../../constants';
import Button from '@/common/components/Button';
import { Material } from '../../types';
import RecyclerServices from '../../services';

export interface Props extends ModalProps {
  handleCancel: () => any;
}

const BottleDetailModal = ({ handleCancel, ...props }: Props) => {
  const { form, formBuilder, handleMultipleChange } =
    useForm(SEARCH_FORM_STRUCT);

  const handleSearch = async () => {
    const { ok, data } = await RecyclerServices.searchBottle(form.search);
    if (ok) {
      const stagesObject = data.reduce<Record<string, any>>((acc, curr) => {
        acc[curr.stage] = curr.data;
        return acc;
      }, {});
      handleMultipleChange({ showDetail: true, ...stagesObject }, false);
    } else {
      toast.error(
        'Código no encontrado. Por favor, verifique e intente nuevamente'
      );
    }
  };

  return (
    <Modal handleCancel={handleCancel} big skippable {...props}>
      <h2 className="w-full bg-n0">Buscador de botellas</h2>
      <div className="w-full flex gap-m mt-4">
        {formBuilder(SEARCH_FORM_INPUTS)}
        <Button
          handleClick={handleSearch}
          disabled={!form.search}
          width="auto"
          label="Buscar"
          className="mt-auto"
        />
      </div>
      {form.showDetail && (
        <>
          <hr className="w-[95%] border border-n1 my-6 mx-auto" />

          <div className="h-full w-full overflow-auto hide-scroll relative pt-2">
            {/* Información General */}
            <div className="grid grid-cols-2 gap-3xl">
              {form.product && (
                <div className=" space-y-2">
                  <h3 className="text-lg font-semibold pb-2">
                    Información del producto
                  </h3>

                  <p>
                    <span className="font-semibold">
                      Código de seguimiento:
                    </span>{' '}
                    {form.product.trackingCode}
                  </p>
                  {form.product.ownerName && (
                    <p>
                      <span className="font-semibold">Productor:</span>{' '}
                      {form.product.ownerName}
                    </p>
                  )}
                  <p>
                    <span className="font-semibold">Fecha de producción:</span>{' '}
                    {new Date(form.product.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              {/* Detalles de la Botella */}
              {form.base && (
                <>
                  <div>
                    <h3 className="text-lg font-semibold pb-2">
                      Detalles del envase
                    </h3>
                    <div className="mt-2 space-y-2">
                      <p>
                        <span className="font-semibold">Peso:</span>{' '}
                        {form.base.bottleType.weight}g
                      </p>
                      <p>
                        <span className="font-semibold">Color:</span>{' '}
                        {form.base.bottleType.color}
                      </p>
                      <p>
                        <span className="font-semibold">Espesor:</span>{' '}
                        {form.base.bottleType.thickness} mm
                      </p>
                      <p>
                        <span className="font-semibold">Origen:</span>{' '}
                        {form.base.bottleType.originLocation}
                      </p>
                      {form.base.ownerName && (
                        <p>
                          <span className="font-semibold">Productor:</span>{' '}
                          {form.base.ownerName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Composición */}
                  <div className="mt-6 col-span-2">
                    <h3 className="text-lg font-semibold pb-2">Composición</h3>
                    {form.base?.bottleType.composition.length ? (
                      <table className="w-full mt-2 border border-n2 rounded-md">
                        <thead>
                          <tr className="bg-n1 text-gray-700">
                            <th className="px-4 py-2 text-left">Material</th>
                            <th className="px-4 py-2 text-left">Cantidad</th>
                            <th className="px-4 py-2 text-left">Unidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.base.bottleType.composition.map(
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
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default BottleDetailModal;
