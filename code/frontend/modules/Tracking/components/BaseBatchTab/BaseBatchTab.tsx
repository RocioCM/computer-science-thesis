import React from 'react';
import { BaseBottleBatch } from '../../types';

interface Props {
  batch: BaseBottleBatch;
}

const BaseBatchTab: React.FC<Props> = ({ batch }) => {
  return (
    <div className="h-full w-full overflow-auto hide-scroll relative">
      {/* Información General */}
      <div className="grid grid-cols-2 gap-3xl">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold border-b pb-2">
            Información General
          </h3>
          <p>
            <span className="font-semibold">Cantidad de envases:</span>{' '}
            {batch.quantity}
          </p>
          <p>
            <span className="font-semibold">Vendidos:</span>{' '}
            {batch.soldQuantity}
          </p>
          <p>
            <span className="font-semibold">Fecha de creación:</span>{' '}
            {new Date(batch.createdAt).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Ubicación de origen:</span>{' '}
            {batch.bottleType.originLocation}
          </p>
        </div>
        {/* Detalles de la Botella */}
        <div>
          <h3 className="text-lg font-semibold border-b pb-2">
            Detalles de la Botella
          </h3>
          <div className="mt-2 space-y-2">
            <p>
              <span className="font-semibold">Peso:</span>{' '}
              {batch.bottleType.weight}g
            </p>
            <p>
              <span className="font-semibold">Color:</span>{' '}
              {batch.bottleType.color}
            </p>
            <p>
              <span className="font-semibold">Espesor:</span>{' '}
              {batch.bottleType.thickness} mm
            </p>
            <p>
              <span className="font-semibold">Forma:</span>{' '}
              {batch.bottleType.shapeType}
            </p>
          </div>
        </div>
      </div>

      {/* Composición */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold border-b pb-2">Composición</h3>
        {batch.bottleType.composition.length > 0 ? (
          <table className="w-full mt-2 border border-gray-300 rounded-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 text-left">Material</th>
                <th className="px-4 py-2 text-left">Cantidad</th>
                <th className="px-4 py-2 text-left">Unidad</th>
              </tr>
            </thead>
            <tbody>
              {batch.bottleType.composition.map((material, index) => (
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
      {batch.bottleType.extraInfo && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold border-b pb-2">
            Información Adicional
          </h3>
          <p className="text-gray-700 mt-2">{batch.bottleType.extraInfo}</p>
        </div>
      )}
    </div>
  );
};

export default BaseBatchTab;
