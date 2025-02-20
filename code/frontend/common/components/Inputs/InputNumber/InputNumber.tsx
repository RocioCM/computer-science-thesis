import { useRef } from 'react';
import Input, { InputProps } from '../Input';

interface Props extends Omit<InputProps, 'value' | 'type'> {
  value?: number | '';
  type?: 'number' | 'float';
}

const InputNumber: React.FC<Props> = ({
  handleChange,
  value,
  type = 'number',
  ...props
}) => {
  const lastKey = useRef<string>('');

  return (
    <Input
      {...props}
      type="number"
      value={`${value ?? ''}`}
      handleChange={(name, value) => handleChange(name, Number(value) || '')}
      onWheelCapture={(e) => e.currentTarget.blur()}
      onKeyDown={(e) => {
        // Only accept digits and backspace
        if (
          type === 'number' &&
          !(
            /^\d$/.test(e.key) ||
            e.key === 'Backspace' ||
            e.key === 'Tab' ||
            e.ctrlKey ||
            e.key === 'Enter' ||
            e.key.startsWith('Arrow')
          )
        ) {
          e.preventDefault();
        }

        // Only accept digits, backspace, dot and comma.
        if (
          type === 'float' &&
          !(
            /^\d$/.test(e.key) ||
            e.key === 'Backspace' ||
            e.key === 'Tab' ||
            e.key === 'Enter' ||
            e.ctrlKey ||
            e.key.startsWith('Arrow') ||
            (['.', ','].includes(e.key) &&
              !e.currentTarget.value.includes('.') &&
              !e.currentTarget.value.includes(',') &&
              !['.', ','].includes(lastKey.current))
          )
        ) {
          e.preventDefault();
        }

        lastKey.current = e.key;
      }}
    />
  );
};

export default InputNumber;
