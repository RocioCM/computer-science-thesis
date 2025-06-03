import React, { useState } from 'react';
import { WasteBottle } from '../../types';
import AccountDetails from '../AccountDetails';
import FaIcon from '@/common/components/FaIcon';

interface Props {
  bottle?: WasteBottle | null;
  options: { label: string; value: number }[];
  handleOption: (optionId: number) => void;
}

const WasteBottleTab: React.FC<Props> = ({ bottle, options, handleOption }) => {
  const [showOptions, setShowOptions] = useState(false);

  return bottle && !showOptions ? (
    <div className="h-full w-full overflow-auto hide-scroll relative">
      {/* Información General */}
      <div className="">
        <div className="space-y-2">
          <div className="w-full flex justify-between items-center">
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

export default WasteBottleTab;
