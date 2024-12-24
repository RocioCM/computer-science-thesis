import { useEffect, useState } from 'react';
import ErrorMessage from '../ErrorMessage';
import { FormHandleChange } from '@/common/hooks/useForm/types';
import cn from '@/common/utils/classNames';
import styles from './InputTextArea.module.css';

const LABEL_STYLE = {
  base: 'text-p mb-xs',
  floatingOnTop: 'top-0 left-0 text-n10 font-semibold',
  floatingInsideInput:
    'top-[calc(2.5*var(--spacing-m)+var(--spacing-xs))] left-m text-n2 font-medium cursor-text',
  disabled: '!cursor-default',
};

const INPUT_STYLE = {
  base: 'p rounded-rs border-n1 px-m py-m placeholder:text-n2 min-h-5rem', // TIP: For only bottom border use: 'rounded-none border-0 border-b'
  hover: 'hover:border-n2',
  focus: cn(styles.inputFocus, 'focus:border-p1'),
  disabled:
    'disabled:text-n2 disabled:bg-n1 disabled:border-n2 disabled:placeholder:text-transparent',
  error: '!border-fe1',
};

export interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLTextAreaElement>,
    'disabled' | 'onChange'
  > {
  name: string;
  value?: string;
  type?: string;
  isDisabled?: boolean;
  handleChange: FormHandleChange;
  containerClassName?: string;
  inputClassName?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  showFloatingLabel?: boolean;
}

const InputTextArea: React.FC<Props> = ({
  name,
  value,
  isDisabled = false,
  handleChange,
  onFocus = () => {},
  onBlur = () => {},
  containerClassName = '',
  inputClassName = '',
  label = '',
  placeholder = '',
  errorMessage = '',
  showFloatingLabel = true, // Change to true to show floating label as default behavior
  ...props
}) => {
  const [floatLabel, setFloatLabel] = useState(false); // True when label is floating on top of input. False when label is inside input.

  useEffect(() => {
    setFloatLabel(!!value);
  }, [value]);

  return (
    <label className={cn('w-full block', containerClassName)}>
      {label && (
        <span
          className={cn(
            'block relative z-10 w-max transition-all', // Base
            LABEL_STYLE.base, // Base custom
            isDisabled && LABEL_STYLE.disabled, // Disabled
            showFloatingLabel && !floatLabel // Floating label
              ? LABEL_STYLE.floatingInsideInput
              : LABEL_STYLE.floatingOnTop
          )}
        >
          {label}
        </span>
      )}

      <textarea
        name={name}
        value={value}
        disabled={isDisabled}
        placeholder={showFloatingLabel ? '' : placeholder}
        className={cn(
          styles.input, // Base
          'block  w-full h-max relative resize-none border bg-transparent outline-none transition-shadow', // Base
          INPUT_STYLE.base, // Base custom
          INPUT_STYLE.hover, // Hover
          INPUT_STYLE.focus, // Focus
          INPUT_STYLE.disabled, // Disabled
          errorMessage ? INPUT_STYLE.error : '',
          inputClassName // Custom
        )}
        onFocus={(e) => {
          onFocus(e);
          setFloatLabel(true);
        }}
        onBlur={(e) => {
          onBlur(e);
          setFloatLabel(!!e.target.value);
        }}
        {...props}
        onChange={(e) => handleChange(name, e.target.value)}
      />

      {errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </label>
  );
};

export default InputTextArea;
