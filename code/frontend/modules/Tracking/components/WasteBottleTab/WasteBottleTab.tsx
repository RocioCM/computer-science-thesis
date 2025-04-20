import React from 'react';
import { WasteBottle } from '../../types';
import AccountDetails from '../AccountDetails';

interface Props {
  bottle?: WasteBottle | null;
  options: { label: string; value: number }[];
  handleOption: (optionId: number) => void;
}

const WasteBottleTab: React.FC<Props> = ({ bottle, options, handleOption }) => {
  return bottle ? (
    <div className="h-full w-full overflow-auto hide-scroll relative">
      {/* Información General */}
      <div className="">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold border-b pb-2">
            Información General
          </h3>
          <p>
            <span className="font-semibold">Código de seguimiento:</span>{' '}
            {bottle.trackingCode}
          </p>
          <p>
            <span className="font-semibold">Usuario reciclador:</span>{' '}
            <AccountDetails blockchainId={bottle.creator} />
          </p>
          <p>
            <span className="font-semibold">Fecha de reciclaje:</span>{' '}
            {new Date(bottle.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  ) : options ? (
    <div className="h-full w-full overflow-auto hide-scroll relative pt-2">
      <h3 className="text-lg font-semibold border-b pb-2">
        Envases reciclados:
      </h3>
      <ul className="mt-2 space-y-2 list-disc list-inside">
        {options.map((option) => (
          <li
            key={option.value}
            onClick={() => handleOption(option.value)}
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

export default WasteBottleTab;
