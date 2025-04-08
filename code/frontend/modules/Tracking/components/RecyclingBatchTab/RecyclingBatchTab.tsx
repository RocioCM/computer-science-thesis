import React from 'react';
import { RecyclingBatch } from '../../types';

interface Props {
  batch?: RecyclingBatch | null;
}

const RecyclingBatchTab: React.FC<Props> = ({ batch }) => {
  return batch ? (
    <div className="h-full w-full overflow-auto hide-scroll relative">
      {/* Información General */}
      <div className="flex flex-col gap-s">
        <h3 className="text-lg font-semibold border-b pb-2">
          Información General
        </h3>
        <p>
          <span className="font-semibold">Material:</span> {batch.materialType}
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
    </div>
  ) : null;
};

export default RecyclingBatchTab;
