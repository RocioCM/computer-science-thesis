import { useState, useMemo, useEffect } from 'react';
import { autoUpdate, useFloating, FloatingPortal } from '@floating-ui/react';
import ChevronIcon from '@/common/components/ChevronIcon';
import { FormHandleChange } from '@/common/hooks/useForm/types';
import useErrorMessage from '@/common/hooks/useForm/useErrorMessage';
import ErrorMessage from '../ErrorMessage';
import cn from '@/common/utils/classNames';
import styles from './InputDropdown.module.css';

const LABEL_STYLE = {
  base: 'text-p mb-xs cursor-pointer',
  floatingOnTop: 'top-0 left-0 text-n10 font-semibold',
  floatingInsideInput:
    'top-[calc(2*var(--spacing-m)+var(--spacing-xs))] left-m text-n2 font-medium cursor-text',
  disabled: '!cursor-default',
};

const INPUT_STYLE = {
  base: 'gap-xs p text-left rounded-rs border-n3 px-m py-m placeholder:text-n2 h-10', // TIP: For only bottom border use: 'rounded-none border-0 border-b'
  hover: 'hover:border-n2',
  focus: cn(styles.dropdonwFocus, 'focus:border-p1 focus:border-2'),
  disabled: 'disabled:text-n3 disabled:bg-n1 disabled:border-n2',
  error: '!border-fe1',
};

export interface Option {
  label: string;
  value: string | number | boolean;
  icon?: string;
}

interface BaseDropdownProps {
  handleChange: FormHandleChange;
  className?: string;
  containerClassName?: string;
  isDisabled?: boolean;
  placeholder?: string;
  options: Option[];
  errorMessage?: string;
  label?: string;
  required?: boolean;
  name: string;
  multiple?: boolean;
  value?: null | Option['value'] | Option['value'][];
  showFloatingLabel?: boolean;
}

interface MultipleDropdownProps extends BaseDropdownProps {
  multiple: true;
  value: Option['value'][]; // Value is always an array when multiple is true
}

interface SingleDropdownProps extends BaseDropdownProps {
  multiple?: false;
  value: null | Option['value']; // Value is always a string when multiple is false
}

export type InputDropdownProps = SingleDropdownProps | MultipleDropdownProps;

const InputDropdown: React.FC<InputDropdownProps> = ({
  name,
  handleChange,
  value,
  className = '',
  containerClassName = '',
  isDisabled = false,
  placeholder = '',
  options,
  multiple = false,
  errorMessage = '',
  label = '',
  showFloatingLabel = false, // Change to true to show floating label as default behavior
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [floatLabel, setFloatLabel] = useState(false); // True when label is floating on top of input. False when label is inside input.
  const { allowRenderError, errorMessage: renderErrorMessage } =
    useErrorMessage(errorMessage);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',
    strategy: 'fixed',
    whileElementsMounted: autoUpdate,
  });

  useEffect(() => {
    setFloatLabel(!!value);
  }, [value]);

  useEffect(() => {
    if (isDisabled) setFloatLabel(true);
  }, [isDisabled]);

  const handleSelect = (e: React.MouseEvent, newValue: Option['value']) => {
    e.preventDefault();
    e.stopPropagation();
    if (multiple) {
      const newArrayValue =
        Array.isArray(value) && value.includes(newValue)
          ? value.filter((v: Option['value']) => v !== newValue)
          : Array.isArray(value)
          ? [...value, newValue]
          : [newValue];
      handleChange(name, newArrayValue);
    } else {
      handleChange(name, newValue);
      setShowOptions(false);
    }
    allowRenderError();
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (showOptions) allowRenderError();
    setShowOptions(!showOptions);
  };

  const displayValue = useMemo(() => {
    if (value === null || value === undefined)
      return showFloatingLabel ? '' : placeholder;
    if (multiple && Array.isArray(value)) {
      return `${value?.length || 0} ${
        value?.length === 1 ? 'seleccionado' : 'seleccionados'
      }`;
    }
    return options.find((option) => option.value === value)?.label;
  }, [value, options, multiple]);

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
          onClick={() => (refs.reference.current as HTMLElement)?.click()}
        >
          {label}
        </span>
      )}

      <button
        className={cn(
          'relative flex flex-row flex-nowrap justify-between items-center w-full border bg-transparent outline-none transition-shadow', // Base
          INPUT_STYLE.base, // Base custom
          INPUT_STYLE.hover, // Hover
          INPUT_STYLE.focus, // Focus
          INPUT_STYLE.disabled, // Disabled
          renderErrorMessage ? INPUT_STYLE.error : '',
          className // Custom
        )}
        name={name}
        disabled={isDisabled}
        onClick={handleClick}
        ref={refs.setReference}
      >
        <span className="flex-1 min-h-4">{displayValue}</span>
        <ChevronIcon size="small" type={showOptions ? 'up' : 'down'} />
      </button>

      {renderErrorMessage && <ErrorMessage errorMessage={renderErrorMessage} />}

      {showOptions && (
        <FloatingPortal>
          <div
            className="z-dropdown w-max rounded-md bg-white shadow-lg max-h-60 overflow-auto"
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              width: (refs.reference.current as HTMLElement)?.clientWidth,
            }}
          >
            {options.map((option) => (
              <div
                key={`${option.value}`}
                className={`cursor-pointer select-none relative p-2 ${
                  value === option.value ? 'text-white bg-p1' : 'text-n6'
                }`}
                onClick={(e) => handleSelect(e, option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </FloatingPortal>
      )}
    </div>
  );
};

export default InputDropdown;
