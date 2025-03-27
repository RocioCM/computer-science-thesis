import { useMemo } from 'react';
import { FormHandleChange } from '@/common/hooks/useForm/types';
import Labels from '../Labels';
import Img from '@/common/components/Img';
import cn from '@/common/utils/classNames';
import iconCheck from '@/public/assets/icon-checkbox-input.svg';
import styles from './InputCheckbox.module.css';
import FaIcon from '@/common/components/FaIcon';

const CONTAINER_STYLE = 'gap-m';
const BOX_STYLE = 'border border-n2 rounded-rs p-m';
const DISABLED_STYLE = 'opacity-60';

const CHECKBOX_BASE_STYLE = 'w-4 h-4 p-0.5 rounded-[0.25rem] bg-n0';
const UNCHECKED_STYLE = 'border-n2';
const CHECKED_STYLE = 'border-0 bg-p1';

export interface Props {
  name: string;
  checkOptionValue: any;
  value?: any[];
  label?: string;
  description?: string;
  className?: string;
  isDisabled?: boolean;
  box?: boolean; // Should the checkbox + label have box style.
  handleChange: FormHandleChange;
}

const InputCheckbox: React.FC<Props> = ({
  name,
  value,
  checkOptionValue,
  label,
  description,
  className = '',
  isDisabled = false,
  box = false,
  handleChange,
}) => {
  const isChecked = useMemo(
    () => value?.includes(checkOptionValue),
    [value, checkOptionValue]
  );

  const handleCheck = (checkOptionValue: string) => {
    if (isChecked) {
      // Remove the value from the array if it exists.
      handleChange(
        name,
        Array.isArray(value) ? value.filter((v) => v !== checkOptionValue) : []
      );
    } else {
      // Add the value to the array if it doesn't exist.
      handleChange(name, [...(value ?? []), checkOptionValue]);
    }
  };

  return (
    <label
      className={cn(
        'flex flex-row items-start',
        CONTAINER_STYLE,
        isDisabled ? DISABLED_STYLE : 'cursor-pointer',
        box ? BOX_STYLE : '',
        className
      )}
    >
      <input
        type="checkbox"
        hidden
        name={name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        className={className}
        onChange={() => handleCheck(checkOptionValue)}
      />
      <span
        className={cn(
          styles.check,
          'flex items-center justify-center shrink-0 border transition-[box-shadow,background-color] duration-300',
          CHECKBOX_BASE_STYLE,
          isChecked ? CHECKED_STYLE : UNCHECKED_STYLE
        )}
      >
        {isChecked && (
          <FaIcon type="fa-solid fa-check" className="text-n0 text-[0.8rem]" />
        )}
      </span>
      <Labels label={label} description={description} labelClassName="-mt-1" />
    </label>
  );
};

export default InputCheckbox;
