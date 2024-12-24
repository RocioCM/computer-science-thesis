import { useRef, useState, FC, MouseEvent } from 'react';
import ChevronIcon from '../../ChevronIcon';
import { FormHandleChange } from '@/common/hooks/useForm/types';

interface Option {
  label: string;
  value: string | number;
  isEnabled?: boolean;
  icon?: string;
  required?: boolean;
  name?: string;
}

interface InputDropdownProps {
  handleChange: FormHandleChange;
  value: any;
  className?: string;
  isDisabled?: boolean;
  placeholder?: string;
  options: Option[];
  multiple?: boolean;
  errorMessage?: string;
  inputLabel?: string;
  required?: boolean;
  name: string;
}

const InputDropdown: FC<InputDropdownProps> = ({
  name,
  handleChange,
  value,
  className = '',
  isDisabled = false,
  placeholder = '',
  options,
  multiple = false,
  errorMessage = '',
  inputLabel = '',
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleSelect = (e: MouseEvent<HTMLDivElement>, newValue: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (multiple) {
      const newVal = value.includes(newValue)
        ? value.filter((v: any) => v !== newValue)
        : [...value, newValue];
      handleChange(name, newVal);
    } else {
      handleChange(name, newValue);
      setShowOptions(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowOptions(!showOptions);
  };

  const displayValue = multiple
    ? value.length
    : options.find((option) => option.value === value)?.label;

  return (
    <div className={`${className} w-full h-[3.75rem] relative flex flex-col`}>
      {inputLabel && !displayValue && (
        <span className="block text-sm text-n6 px-s">{inputLabel}</span>
      )}
      <button
        ref={buttonRef}
        className={`flex items-center gap-2 h-full w-full shadow-sm text-n6 text-left cursor-default justify-between px-l sm:text-sm ${
          isDisabled ? 'bg-gray-100' : 'bg-transparent'
        }`}
        disabled={isDisabled}
        onClick={(e) => handleClick(e)}
      >
        {displayValue || placeholder || inputLabel}
        <ChevronIcon size="small" type="down" />
      </button>
      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
      {showOptions && (
        <div
          className="absolute z-50 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto"
          style={{ top: '100%' }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer select-none relative p-2 ${
                value === option.value ? 'text-white bg-p1' : 'text-n6'
              }`}
              onClick={(e) => handleSelect(e, option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InputDropdown;
