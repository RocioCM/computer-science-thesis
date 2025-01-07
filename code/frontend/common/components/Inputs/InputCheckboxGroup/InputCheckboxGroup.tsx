import { FormHandleChange } from '@/common/hooks/useForm/types';
import InputCheckbox from '../InputCheckbox';
import ErrorMessage from '../ErrorMessage';
import { useErrorMessage } from '@/common/hooks/useForm';

export interface CheckboxOption {
  value: any;
  label: string;
  description?: string;
  isDisabled?: boolean;
}

export interface Props {
  name: string;
  value?: any;
  label?: string;
  checkboxes?: CheckboxOption[];
  isDisabled?: boolean;
  className?: string;
  checkboxClassName?: string;
  handleChange: FormHandleChange;
  errorMessage?: string;
}

const InputCheckboxGroup: React.FC<Props> = ({
  name,
  value,
  label,
  checkboxes,
  isDisabled = false,
  handleChange,
  className = '',
  checkboxClassName = '',
  errorMessage = '',
}) => {
  const { allowRenderError, errorMessage: renderErrorMessage } =
    useErrorMessage(errorMessage); // Show error message conditionally after interaction.

  return (
    <div className={className}>
      {label && <h6 className="mb-m">{label}</h6>}
      <div className="flex flex-col gap-s">
        {checkboxes?.map((checkbox) => {
          return (
            <InputCheckbox
              key={`${checkbox.value}`}
              name={name}
              value={value}
              checkOptionValue={checkbox.value}
              isDisabled={isDisabled || checkbox.isDisabled}
              handleChange={(...args) => {
                handleChange(...args);
                allowRenderError();
              }}
              label={checkbox.label}
              description={checkbox.description}
              className={checkboxClassName}
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

export default InputCheckboxGroup;
