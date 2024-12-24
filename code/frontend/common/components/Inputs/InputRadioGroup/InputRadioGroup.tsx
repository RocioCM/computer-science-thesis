import { FormHandleChange } from '@/common/hooks/useForm/types';
import InputRadio from '../InputRadio';
import ErrorMessage from '../ErrorMessage';
import { useErrorMessage } from '@/common/hooks/useForm';

export interface RadioOption {
  value: string | number | boolean;
  label: string;
  description?: string;
  isDisabled?: boolean;
}

export interface Props {
  name: string;
  value?: any;
  label?: string;
  radios?: RadioOption[];
  isDisabled?: boolean;
  className?: string;
  radioClassName?: string;
  handleChange: FormHandleChange;
  errorMessage?: string;
}

const InputRadioGroup: React.FC<Props> = ({
  name,
  value,
  label,
  radios,
  isDisabled = false,
  handleChange,
  className = '',
  radioClassName = '',
  errorMessage = '',
}) => {
  const { allowRenderError, errorMessage: renderErrorMessage } =
    useErrorMessage(errorMessage); // Show error message conditionally after interaction.

  return (
    <div className={className}>
      {label && <h6 className="mb-m">{label}</h6>}
      <div className="flex flex-col gap-s">
        {radios?.map((radio) => {
          return (
            <InputRadio
              key={`${radio.value}`}
              name={name}
              value={value}
              radioOptionValue={`${radio.value}`}
              isDisabled={isDisabled || radio.isDisabled}
              handleChange={(...args) => {
                handleChange(...args);
                allowRenderError();
              }}
              label={radio.label}
              description={radio.description}
              className={radioClassName}
            />
          );
        })}
      </div>
      {renderErrorMessage && (
        <ErrorMessage errorMessage={renderErrorMessage} className="mt-m" />
      )}
    </div>
  );
};

export default InputRadioGroup;
