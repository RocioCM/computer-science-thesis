import { useEffect, useRef, useState } from 'react';
import ErrorMessage from '../ErrorMessage';
import { FormHandleChange } from '@/common/hooks/useForm/types';
import cn from '@/common/utils/classNames';
import styles from './Input.module.css';
import { useErrorMessage } from '@/common/hooks/useForm';

const LABEL_STYLE = {
  base: 'text-p mb-xs',
  floatingOnTop: 'top-0 left-0 text-n10 font-semibold',
  floatingInsideInput:
    'top-[calc(2.4*var(--spacing-m)+var(--spacing-xs))] left-m text-n2 font-medium cursor-text',
  disabled: '!cursor-default',
};

const ABSOLUTE_CHILDREN_STYLE = 'gap-xs';

const INPUT_STYLE = {
  base: 'p rounded-rs border-n1 px-m py-m placeholder:text-n2 h-12', // TIP: For only bottom border use: 'rounded-none border-0 border-b'
  hover: 'hover:border-n2',
  focus: cn(styles.inputFocus, 'focus:border-p1'),
  disabled:
    'disabled:text-n3 disabled:bg-n1 disabled:border-n2 disabled:placeholder:text-transparent',
  error: '!border-fe1',
};

export interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'disabled' | 'onChange'
  > {
  name: string;
  value?: string;
  type?: string;
  isDisabled?: boolean;
  handleChange: FormHandleChange;
  containerClassName?: string;
  className?: string;
  inputClassName?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  childrenStart?: React.ReactNode;
  childrenEnd?: React.ReactNode;
  showFloatingLabel?: boolean;
}

const Input: React.FC<Props> = ({
  name,
  value,
  type = 'text',
  isDisabled = false,
  handleChange,
  onFocus = () => {},
  onBlur = () => {},
  containerClassName = '',
  className = '',
  inputClassName = '',
  label = '',
  placeholder = '',
  errorMessage = '',
  childrenStart,
  childrenEnd,
  showFloatingLabel = true, // Change to true to show floating label as default behavior
  ...props
}) => {
  const [floatLabel, setFloatLabel] = useState(false); // True when label is floating on top of input. False when label is inside input.
  const inputRef = useRef<HTMLInputElement>(null);
  const { allowRenderError, errorMessage: renderErrorMessage } =
    useErrorMessage(errorMessage);

  useEffect(() => {
    setFloatLabel(!!value);
  }, [value]);

  return (
    <div className={cn('w-full', containerClassName)}>
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
          onClick={() => inputRef.current?.focus()}
        >
          {label}
        </span>
      )}

      <div
        className={cn(
          'relative flex flex-row flex-nowrap justify-between items-center w-full',
          className
        )}
        onClickCapture={(e) => isDisabled && e.stopPropagation()}
      >
        <div
          className={cn(
            'absolute left-0 h-full w-max flex flex-row items-center',
            ABSOLUTE_CHILDREN_STYLE
          )}
        >
          {childrenStart}
        </div>
        <input
          ref={inputRef}
          name={name}
          value={value}
          type={type}
          disabled={isDisabled}
          placeholder={showFloatingLabel ? '' : placeholder}
          className={cn(
            styles.input, // Base
            'block w-full h-max relative border bg-transparent outline-none transition-shadow', // Base
            INPUT_STYLE.base, // Base custom
            INPUT_STYLE.hover, // Hover
            INPUT_STYLE.focus, // Focus
            INPUT_STYLE.disabled, // Disabled
            renderErrorMessage ? INPUT_STYLE.error : '',
            inputClassName // Custom
          )}
          onFocus={(e) => {
            onFocus(e);
            setFloatLabel(true);
          }}
          onBlur={(e) => {
            onBlur(e);
            allowRenderError();
            setFloatLabel(!!e.target.value);
          }}
          {...props}
          onChange={(e) => {
            allowRenderError();
            handleChange(name, e.target.value);
          }}
        />
        <div
          className={cn(
            'absolute right-0 h-full w-max flex flex-row items-center',
            ABSOLUTE_CHILDREN_STYLE
          )}
        >
          {childrenEnd}
        </div>
      </div>

      {renderErrorMessage && <ErrorMessage errorMessage={renderErrorMessage} />}
    </div>
  );
};

export default Input;
