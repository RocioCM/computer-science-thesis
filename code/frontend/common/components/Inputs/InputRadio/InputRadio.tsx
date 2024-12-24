import { FormHandleChange } from '@/common/hooks/useForm/types';
import Labels from '../Labels';
import cn from '@/common/utils/classNames';
import styles from './InputRadio.module.css';

const CONTAINER_STYLE = 'gap-m';
const BOX_STYLE = 'border border-n2 rounded-rs p-m';
const DISABLED_STYLE = 'opacity-60';

const RADIO_BASE_STYLE = 'w-4 h-4 p-1 bg-n0';
const UNCHECKED_STYLE = 'border-n2';
const CHECKED_STYLE = 'border-0 bg-p1';
const CHECKED_CONTENT_STYLE = 'bg-n0';
const UNCHECKED_CONTENT_STYLE = 'bg-n0';

export interface Props {
  name: string;
  radioOptionValue: string;
  value?: string;
  label?: string;
  description?: string;
  className?: string;
  isDisabled?: boolean;
  box?: boolean; // Should the radio have box style.
  handleChange: FormHandleChange;
}

const InputRadio: React.FC<Props> = ({
  name,
  value,
  radioOptionValue,
  label,
  description,
  className = '',
  isDisabled = false,
  box = false,
  handleChange,
}) => {
  const isChecked = radioOptionValue === value;

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
        type="radio"
        hidden
        name={name}
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        className={className}
        onChange={() => handleChange(name, radioOptionValue)}
      />
      <span
        className={cn(
          styles.radio,
          'block shrink-0 rounded-full border transition-[box-shadow,background-color] duration-300',
          RADIO_BASE_STYLE,
          isChecked ? CHECKED_STYLE : UNCHECKED_STYLE
        )}
      >
        <span
          className={cn(
            'w-full h-full block rounded-full',
            isChecked ? CHECKED_CONTENT_STYLE : UNCHECKED_CONTENT_STYLE
          )}
        ></span>
      </span>
      <Labels label={label} description={description} labelClassName="-mt-1" />
    </label>
  );
};

export default InputRadio;
