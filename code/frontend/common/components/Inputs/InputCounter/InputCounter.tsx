import { FormHandleChange } from '@/common/hooks/useForm/types';
import ErrorMessage from '../ErrorMessage';
import Labels from '../Labels';
import Button from '@/common/components/Button';
import { useErrorMessage } from '@/common/hooks/useForm';
import cn from '@/common/utils/classNames';
import iconPlus from '@/public/assets/icon-counter-plus.svg';
import iconMinus from '@/public/assets/icon-counter-minus.svg';
import styles from './InputCounter.module.css';

const CONTAINER_STYLE = 'items-center gap-m';
const BOX_STYLE = 'border border-n2 rounded-rs p-m';
const DISABLED_STYLE = 'opacity-60';

const COUNTER_CONTAINER_STYLE = 'gap-xs';
const INPUT_STYLE =
  '!w-3xl h-xl text-center p outline-none border-p1 focus:border rounded-[var(--spacing-xs)] transition-shadow overflow-hidden text-ellipsis whitespace-pre-wrap';
const BUTTON_STYLE =
  '!w-xl !h-xl !rounded-[var(--spacing-xs)] !border-n3 !bg-n0 !p-0 disabled:opacity-50';

export interface Props {
  name: string;
  value?: number;
  min?: number | null;
  max?: number | null;
  label?: string;
  description?: string;
  className?: string;
  isDisabled?: boolean;
  box?: boolean; // Should the counter + label have box style.
  handleChange: FormHandleChange;
  disableManualEdition?: boolean;
  errorMessage?: string;
}

const InputCounter: React.FC<Props> = ({
  name,
  value,
  label,
  description,
  className = '',
  min = 0,
  max = null,
  isDisabled = false,
  box = false,
  handleChange,
  disableManualEdition = false,
  errorMessage = '',
}) => {
  const { allowRenderError, errorMessage: renderErrorMessage } =
    useErrorMessage(errorMessage); // Show error message conditionally after interaction.

  const numberValue = parseInt(`${value}`) || 0;

  /** Returns number in valid min-max range */
  const minMax = (number: number) => {
    let result = number || 0;
    if (min !== null) result = Math.max(min, result);
    if (max !== null) result = Math.min(max, result);
    return result;
  };

  const handleIncrement = () => {
    handleChange(name, minMax(numberValue + 1));
    allowRenderError();
  };

  const handleDecrement = () => {
    handleChange(name, minMax(numberValue - 1));
    allowRenderError();
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(name, minMax(parseInt(e.target.value)));
    allowRenderError();
  };

  return (
    <div
      className={cn(
        'flex flex-row relative',
        CONTAINER_STYLE,
        isDisabled ? DISABLED_STYLE : '',
        box ? BOX_STYLE : '',
        renderErrorMessage ? 'mb-xl' : '', // Add margin bottom to cover absolute error space.
        className
      )}
    >
      <Labels label={label} description={description} />

      <div
        className={cn('flex flex-row items-center', COUNTER_CONTAINER_STYLE)}
      >
        <Button
          className={BUTTON_STYLE}
          iconStart={iconMinus}
          onClick={handleDecrement}
          variant="secondary"
          disabled={
            isDisabled || (typeof min === 'number' && numberValue <= min)
          }
        />
        <input
          type="number"
          name={name}
          value={`${numberValue}`}
          title={`${numberValue}`}
          disabled={isDisabled || disableManualEdition}
          className={cn(styles.input, INPUT_STYLE, className)}
          onInput={handleInput}
        />
        <Button
          className={BUTTON_STYLE}
          onClick={handleIncrement}
          iconStart={iconPlus}
          variant="secondary"
          disabled={
            isDisabled || (typeof max === 'number' && numberValue >= max)
          }
        />
      </div>
      {renderErrorMessage && (
        <ErrorMessage
          errorMessage={renderErrorMessage}
          className="absolute top-full left-0"
        />
      )}
    </div>
  );
};

export default InputCounter;
