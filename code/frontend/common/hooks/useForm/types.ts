export type FieldValue = any;

export interface ValidatorFunction {
  (_value: FieldValue, _form: Form): string;
}

/**
 * Data types for nested form fields. Used for arrayOf and mapOf fields.
 * @see arrayOf,mapOf in utils file for more information.
 */
export enum TYPES {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  date = 'date',
}

export interface FieldData {
  name: string;
  required?: boolean | ((_e: Form) => boolean);
  disabled?: boolean | ((_e: Form) => boolean);
  parser?: () => FieldValue;
  validators?: ValidatorFunction | ValidatorFunction[];
  structure?: Structure;
  default?: FieldValue;
}

export interface Structure {
  isArray?: boolean;
  isObject?: boolean;
  isMap?: boolean;
  elementsType?: any; // FieldData[] | TYPES;
  objectFields?: FieldData[];
}

export interface FormBuilderField {
  name: string;
  placeholder?: string;
  unitPlaceholder?: string;
  className?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  type: INPUT_TYPES;
  variant?: 'number' | 'date' | 'price' | '';
  size?: number;
  maxLength?: number;
  label?: string;
  imageInput?: string;
  imageError?: string;
  imageSuccess?: string;
  required?: boolean | ((_e: Form) => boolean);
  multiple?: boolean;
  moduleClassName?: string;
  containerClassName?: string;
  focus?: boolean;
  max?: number;
  min?: number;
  step?: number;
  colorToggle?: 'black' | 'white';
  value?: FieldValue;
  radioOptionValue?: string;
  dropdownOptions?: Array<{
    value: FieldValue;
    label: string;
  }>;
}

export type FormBuilderType = (
  _formFields?: FormBuilderField[],
  _config?: FormBuilderConfig
) => React.JSX.Element;

export type FormHandleChange = (
  name: string,
  value: FieldValue,
  isManualChange?: boolean
) => void;

export interface Form {
  [key: string]: FieldValue;
}

export interface Errors {
  [key: string]: Record<string, Errors> | Array<Errors> | string;
}

export interface FieldsObject {
  [key: string]: FieldData;
}

export interface FormBuilderConfig {
  dropdownOptions?: Record<string, any[]>;
  prefix?: string;
  customProps?: Record<string, object>;
  radioOptions?: Record<string, any[]>;
  checkboxOptions?: Record<string, any[]>;
  toggleOptions?: Record<string, any[]>;
}

export enum INPUT_TYPES {
  toggle = 'toggle',
  radio = 'radio', // Just one radio input
  radioGroup = 'radioGroup', // A list of radio inputs
  text = 'text',
  number = 'number',
  counter = 'counter',
  password = 'password',
  date = 'date',
  checkbox = 'checkbox', // Just one checkbox input
  checkboxGroup = 'checkboxGroup', // A list of checkbox inputs
  textarea = 'textarea',
  dropdown = 'dropdown',
  search = 'search',
  default = 'default',
}
