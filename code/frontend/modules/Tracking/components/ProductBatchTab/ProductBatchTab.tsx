import React, { useState } from 'react';
import { ProductBottlesBatch } from '../../types';
import FaIcon from '@/common/components/FaIcon';

interface Props {
  batch?: ProductBottlesBatch | null;
  options: { label: string; value: number }[];
  handleOption: (optionId: number) => void;
}

const ProductBatchTab: React.FC<Props> = ({ batch, options, handleOption }) => {
  const [showOptions, setShowOptions] = useState(false);
  return batch && !showOptions ? (
    <div className="h-full w-full overflow-auto hide-scroll relative">
      {/* Información General */}
      <div className="flex flex-1">
        <div className=" space-y-2 w-full">
          <div className="w-full flex justify-between">
            <h3 className="text-lg font-semibold border-b pb-2">
              Información General
            </h3>
            {options.length > 1 && (
              <button onClick={() => setShowOptions(!showOptions)}>
                <FaIcon type="fa-solid fa-list" />
              </button>
            )}
          </div>
          <p>
            <span className="font-semibold">Código de seguimiento:</span>{' '}
            {batch.trackingCode || 'Sin código'}
          </p>
          <p>
            <span className="font-semibold">Cantidad de envases:</span>{' '}
            {batch.quantity}
          </p>
          <p>
            <span className="font-semibold">Vendidas:</span>{' '}
            {batch.quantity - batch.availableQuantity}/{batch.quantity}
          </p>
          <p>
            <span className="font-semibold">Fecha de recepción:</span>{' '}
            {new Date(batch.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  ) : options ? (
    <div className="h-full w-full overflow-auto hide-scroll relative pt-2">
      <h3 className="text-lg font-semibold border-b pb-2">
        Productos derivados:
      </h3>
      <ul className="mt-2 space-y-2 list-disc list-inside">
        {options.map((option) => (
          <li
            key={option.value}
            onClick={() => {
              setShowOptions(false);
              handleOption(option.value);
            }}
            className="
					cursor-pointer underline"
          >
            <span className="font-semibold">{option.label}</span>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
};

export default ProductBatchTab;
