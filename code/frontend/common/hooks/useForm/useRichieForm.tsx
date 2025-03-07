import React, { useMemo, useRef, useState } from 'react';
import { FieldValue, INPUT_TYPES, TYPES } from './types';
import * as validators from './validators';
import {
  Errors,
  FieldData,
  FieldsObject,
  Form,
  FormBuilderConfig,
  FormBuilderField,
  FormHandleChange,
} from './types';
import Input from '@/common/components/Inputs/Input';
import InputDropdown from '@/common/components/Inputs/InputDropdown';
import InputToggle from '@/common/components/Inputs/InputToggle';
import InputCheckbox from '@/common/components/Inputs/InputCheckbox';
import InputCheckboxGroup from '@/common/components/Inputs/InputCheckboxGroup';
import InputRadio from '@/common/components/Inputs/InputRadio';
import InputRadioGroup from '@/common/components/Inputs/InputRadioGroup';
import InputPassword from '@/common/components/Inputs/InputPassword';
import InputCounter from '@/common/components/Inputs/InputCounter';
import InputNumber from '@/common/components/Inputs/InputNumber';
import InputTextArea from '@/common/components/Inputs/InputTextArea';
import InputAutocomplete from '@/common/components/Inputs/InputAutocomplete';

const validateFormStructure = (formStructure: FieldData[]) => {
  if (!Array.isArray(formStructure)) {
    throw new Error(
      'Ricardo Form: La estructura del formulario debe ser un arreglo de campos.'
    );
  }

  formStructure.forEach((fieldData) => {
    if (typeof fieldData !== 'object' || fieldData === null) {
      throw new Error(
        'Ricardo Form: La estructura de cada campo debe ser un objeto especificando la metadata del campo.'
      );
    }
    if (!fieldData.name || typeof fieldData.name !== 'string') {
      throw new Error(
        'Ricardo Form: Cada campo debe tener un name: string para poder ser identificado.'
      );
    }
    if (
      fieldData.required !== undefined &&
      typeof fieldData.required !== 'boolean' &&
      typeof fieldData.required !== 'function' // This field can be a function that returns a boolean.
    ) {
      throw new Error('Ricardo Form: El campo required debe ser un booleano.');
    }
    if (
      fieldData.parser !== undefined &&
      typeof fieldData.parser !== 'function'
    ) {
      throw new Error('Ricardo Form: El campo parser debe ser una función.');
    }
    if (
      fieldData.validators !== undefined &&
      typeof fieldData.validators !== 'function' &&
      (!Array.isArray(fieldData.validators) ||
        !fieldData.validators.length ||
        fieldData.validators.some(
          (validator) => typeof validator !== 'function'
        ))
    ) {
      throw new Error(
        'Ricardo Form: El campo validators debe ser una función o un arreglo de funciones.'
      );
    }
    if (
      fieldData.structure !== undefined &&
      (typeof fieldData.structure !== 'object' ||
        fieldData.structure === null ||
        (!fieldData.structure.isArray &&
          !fieldData.structure.isObject &&
          !fieldData.structure.isMap))
    ) {
      throw new Error(
        'Ricardo Form: estructura inválida. Utilizar la util arrayOf, object o mapOf para definir la estructura del campo.'
      );
    } else if (fieldData.structure?.isArray || fieldData.structure?.isMap) {
      if (!fieldData.structure.elementsType) {
        throw new Error(
          'Ricardo Form: El campo structure debe tener un campo elementsType para definir los elementos del arreglo/map.'
        );
      }
      if (
        !Array.isArray(fieldData.structure.elementsType) &&
        !Object.values(TYPES).includes(fieldData.structure.elementsType)
      ) {
        throw new Error(
          'Ricardo Form: El campo elementsType debe ser un tipo de dato primitivo o un campo anidado.'
        );
      } else if (Array.isArray(fieldData.structure.elementsType)) {
        validateFormStructure(fieldData.structure.elementsType); // Recursive call to validate the array nested structure.
      }
    } else if (fieldData.structure?.isObject) {
      if (!fieldData.structure.objectFields) {
        throw new Error(
          'Ricardo Form: El campo structure debe tener un campo objectFields para definir los campos del objeto.'
        );
      }

      validateFormStructure(fieldData.structure.objectFields); // Recursive call to validate the object nested structure.
    }
  });
};

const getInitialForm = (initialFormStructure: FieldData[]): Form => {
  const initialForm: Form = {};

  initialFormStructure.forEach((fieldData: FieldData) => {
    let fieldValue = null;

    // Check if the field has a structure (nested fields).
    if (
      typeof fieldData.structure === 'object' &&
      fieldData.structure !== null
    ) {
      if (fieldData.structure.isArray) {
        // If the field is an array, initialize it with the specified default value or an empty array.
        fieldValue = fieldData.default !== undefined ? fieldData.default : [];
      } else if (fieldData.structure.isMap) {
        // If the field is a map, initialize it with the specified default value or an empty object.
        fieldValue = fieldData.default !== undefined ? fieldData.default : {};
      } else if (fieldData.structure.isObject) {
        // If the field is an object, initialize it according to its structure
        // unless user explicitly specified a default null value.
        const nestedFormFields = fieldData.structure.objectFields ?? [];
        fieldValue =
          fieldData.default === null ? null : getInitialForm(nestedFormFields);
      }
    } else {
      // If the field has no structure, initialize it with the specified default value or null.
      fieldValue = fieldData.default ?? null;
    }

    // Initialize each field with the computed default value.

    initialForm[fieldData.name] = fieldValue;
  });
  return initialForm;
};

const checkFieldComplete = (fieldValue: any, fieldData: FieldData) => {
  if (!fieldData?.structure) {
    return (
      fieldValue !== null &&
      fieldValue !== undefined &&
      fieldValue !== '' &&
      (!Array.isArray(fieldValue) || fieldValue.length)
    );
  } else if (fieldData.structure.isArray) {
    return Array.isArray(fieldValue) && fieldValue.length;
  } else if (fieldData.structure.isObject) {
    return typeof fieldValue === 'object' && fieldValue !== null;
  } else if (fieldData.structure.isMap) {
    return (
      typeof fieldValue === 'object' &&
      fieldValue !== null &&
      Object.keys(fieldValue).length
    );
  }
};

/**
 * Contains all the logic related to a generic form. It includes form state,
 * functions to update it and a simple form JSX builder.
 * @param {object} initialFormStructure - Object describing the form structure.
 *
 * @returns {object} form - Object containing the form state data.
 * @returns {function} setForm - Function to update the form state data.
 * @returns {number} progress - Form completion percentage value.
 * @returns {function} handleChange - Function to handle the form state data.
 * @returns {function} formBuilder - Function to build the form.
 * @returns {function} getFieldErrorMessage - Function to retrieve the error message of a field.
 * @returns {function} getDefaultForm - Function to retrieve the default form state.
 * @returns {function} resetForm - Function to reset the form state to the initial state.
 * @returns {boolean} hasChanges - Boolean flag to track if the form has changes to save.
 * @returns {boolean} submitEnabled - Boolean flag to track if the form submit is enabled.
 * @returns {function} setInitialForm - Function to set the initial form state.
 * @returns {function} handleMultipleChange - Function to handle multiple form fields changes.
 * @returns {function} getFieldData - Function to retrieve the metadata of a field in the form structure.
 */

const useRichieForm = (initialFormStructure: FieldData[]) => {
  const [form, setForm] = useState(() => {
    validateFormStructure(initialFormStructure); // Validate the form structure once before initializing the form state. It may throw an error if the structure is invalid.
    return getInitialForm(initialFormStructure); // Then initialize the form state based on the form structure.
  });

  const initialStructureRef = useRef(initialFormStructure); // Save the initial form structure to ignore changes on it later.
  const initialFormRef = useRef(form); // Save the initial form state to reset the form later.
  const hasChangesRef = useRef(false); // Boolean to track if the form has changes since the last reset.

  /**
   * Checks if a field is disabled based on the field data and the form state.
   * @param {object} fieldData - The field data object to check if it's disabled.
   * @returns {boolean} - True if the field is disabled, false otherwise.
   */
  const isFieldDisabled = (fieldData: FieldData) => {
    return (
      fieldData.disabled === true ||
      (typeof fieldData.disabled === 'function' && !!fieldData.disabled(form))
    );
  };

  /**
   * Checks if a field is required based on the field data and the form state.
   * @param {object} fieldData - The field data object to check if it's required.
   * @returns {boolean} - True if the field is required, false otherwise.
   */
  const isFieldRequired = (fieldData: FieldData) => {
    return (
      (!isFieldDisabled(fieldData) && // Field only counts as required if not disabled.
        fieldData.required === true) ||
      (typeof fieldData.required === 'function' && !!fieldData.required(form))
    );
  };

  /**
   * Runs the validations of a field in the form.
   * It runs the validators of a field in the form and returns the error message if any.
   * @param {object} form - The form object to validate the field against.
   * @param {string} name - The name of the field to validate.
   * @returns {string} - The error message of the field if any, otherwise an empty string.
   */
  const runFieldValidations = (
    fieldData: FieldData,
    value: any,
    parentForm: any
  ): string => {
    let errorMessage = '';

    if (!fieldData) return errorMessage; // Impossible case, but just in case.

    if (isFieldDisabled(fieldData)) return errorMessage; // Field is disabled, no need to validate it.

    // If field is required and value is empty, return the required error message.
    if (isFieldRequired(fieldData) && !checkFieldComplete(value, fieldData)) {
      return validators._isRequired(null, form); // Get required field error message.
    }

    if (!fieldData.validators) return ''; // No validators to run, return empty message.

    const validatorsList = Array.isArray(fieldData.validators)
      ? fieldData.validators // Use the provided validators array.
      : [fieldData.validators]; // Convert single validator to array for consistency.

    // Run the validators until an error message is found.
    validatorsList.some((validator: any) => {
      errorMessage = validator(value, parentForm); /// TODO: future improvement. This doesnt support effect validators (from other fields) over nested fields.
      return !!errorMessage; // Stop running validators if an error message is found.
    });
    return errorMessage || '';
  };

  /**
   * Object containing the error messages for each field in the form.
   * It calculates the error messages for each field in the form based on the validators.
   * @type {object} - Object containing the error messages for each field in the form.
   */
  const [errors, errorsCount] = useMemo(() => {
    const formErrors = {};
    let errorsCount = 0;

    const checkFormErrors = (
      fields: FieldData[],
      subForm: Form,
      errors: Errors
    ) => {
      fields.forEach((fieldData) => {
        const formValue = subForm?.[fieldData.name] ?? null;

        const errorMessage = runFieldValidations(
          fieldData,
          formValue,
          subForm ?? {}
        ); // Base case. Run field validations, no matter the structure of the field.

        if (errorMessage) {
          errors[fieldData.name] = errorMessage; // Save the error message.
          errorsCount++; // Count the error.
        }

        if (fieldData.structure?.isObject) {
          const errorField = {};
          errors[fieldData.name] = errorField;
          checkFormErrors(
            fieldData.structure.objectFields || [],
            formValue,
            errorField
          ); // Recursive case if field is an object
        } else if (fieldData.structure?.isMap) {
          // Map of primitives
          if (Object.values(TYPES).includes(fieldData.structure.elementsType)) {
            /// TODO: future improvement. You may check the map of primitives here.
            return; // Base case. Map of primitives, no need to check further.
          }

          const errorField: Record<string, Errors> = {};
          errors[fieldData.name] = errorField;

          // Map of objects
          Object.entries(formValue).forEach(([key, value]: [string, any]) => {
            errorField[key] = {}; // Create an object to store the errors of each key in the map.
            checkFormErrors(
              fieldData.structure?.elementsType || [],
              value,
              errorField[key]
            ); // Recursive case if field is a map.
          });
        } else if (fieldData.structure?.isArray) {
          // Array of primitives
          if (Object.values(TYPES).includes(fieldData.structure.elementsType)) {
            /// TODO: future improvement. You may check the array of primitives here.
            return; // Base case. Array of primitives, no need to check further.
          }

          const errorField: Array<Errors> = [];
          errors[fieldData.name] = errorField;

          // Array of objects
          formValue.forEach((value: any, i: any) => {
            errorField.push({}); // Create an object to store the errors of each object in the array.
            checkFormErrors(
              fieldData.structure?.elementsType,
              value,
              errorField[i]
            ); // Array of objects, recursive case.
          });
        }
      });
    };

    checkFormErrors(initialStructureRef.current, form, formErrors);

    return [formErrors, errorsCount];
  }, [form]);

  /**
   * Retrieves a value from a nested object based on a dot-separated name.
   * It looks up and retrieves the value of a nested field in the form object
   * using the dot-separated name provided.
   * @param {object} nestedForm - The nested object to retrieve the value from.
   * @param {string} name - The dot-separated name of the value to retrieve.
   * @returns {*} - The value retrieved from the nested object.
   */
  const getFieldValue = (nestedForm: Form, name: string) => {
    if (name.includes('.')) {
      const levels = name.split('.');
      let currentObj = nestedForm;

      for (const level of levels) {
        if (currentObj && currentObj[level]) {
          currentObj = currentObj[level];
        } else {
          return undefined;
        }
      }

      return currentObj;
    }

    return nestedForm[name];
  };

  /**
   * Retrieves an error message (if available) from a nested object based on a dot-separated name.
   * It looks up and retrieves the error message of a nested field in the errors object.
   * @param {object} nestedErrors - The nested object to retrieve the error message from.
   * @param {string} name - The dot-separated name of the error message field to retrieve.
   * @returns {string} - The error message retrieved from the nested object. If not found, returns an empty string.
   */
  const getFieldErrorMessage = (name: string) => {
    // As the errors object is a mirror of the form object, we can reuse the same function to retrieve error messages.
    return getFieldValue(errors, name) || '';
  };

  /**
   * Value in range from 0 to 100 representing the form completion percentage.
   * It calculates the percentage of required fields that have been filled in the form.
   * @type {number} - The form completion percentage value.
   */
  const progress = useMemo(() => {
    let requiredFields = 0;
    let filledRequiredFields = 0;

    const checkRequiredFieldIsComplete = (
      fieldValue: any,
      fieldData: FieldData
    ) => {
      requiredFields++; // Count the required field.

      const isComplete = checkFieldComplete(fieldValue, fieldData);

      if (isComplete) {
        filledRequiredFields++; // Only count the filled required fields.
      }
    };

    const checkForm = (fields: FieldData[], subForm: Form = {}) => {
      fields.forEach((fieldData) => {
        const fieldValue = subForm?.[fieldData.name] ?? null;

        if (isFieldRequired(fieldData)) {
          checkRequiredFieldIsComplete(fieldValue, fieldData);
        } // Base case. Check if field is required, no matter the structure of the field.

        if (fieldData.structure?.isObject) {
          checkForm(fieldData.structure.objectFields || [], fieldValue); // Recursive case if field is an object.
        } else if (fieldData.structure?.isArray) {
          // Array of primitives. No need to check array elements.
          if (Object.values(TYPES).includes(fieldData.structure.elementsType)) {
            return; // Base case.
          }

          // Array of objects. Check each object in the array.
          fieldValue.forEach((value: any) => {
            checkForm(fieldData.structure?.elementsType, value); // Array of objects, recursive case.
          });
        } else if (fieldData.structure?.isMap) {
          // Map of primitives. No need to check map elements.
          if (Object.values(TYPES).includes(fieldData.structure.elementsType)) {
            return; // Base case.
          }

          // Map of objects. Check each object in the map.
          Object.values(fieldValue).forEach((value: any) => {
            checkForm(fieldData.structure?.elementsType, value); // Map of objects, recursive case.
          });
        }
      });
    };

    checkForm(initialStructureRef.current, form);

    // Calculate the percentage of filled required fields. Return 100 if no required fields.
    return requiredFields > 0
      ? Math.floor((filledRequiredFields / requiredFields) * 100)
      : 100;
  }, [form]);

  /** Boolean flag to track if the form has changes to save. */
  const hasChanges =
    hasChangesRef.current && // The form has changes to save.
    JSON.stringify(form) !== JSON.stringify(initialFormRef.current); // The form is different from the initial state.

  // Form submit is enabled if the form is complete, has changes to save and has no errors.
  const submitEnabled =
    progress === 100 && // All required fields are filled.
    errorsCount === 0 && // There are no errors in the form.
    hasChanges;

  const resetForm = () => {
    setForm(initialFormRef.current);
    hasChangesRef.current = false;
  };

  /**
   * Retrieves the metadata of a field in the form structure.
   * @param {string} name - The dot-separated name of the field to retrieve the metadata from.
   * @returns {object} - The metadata of the field in the form structure or null if field not found.
   */
  const getFieldData = (name: string): FieldData | null => {
    const keys = name.split('.');

    const accessField = (fields: any, keys: any): FieldData | null => {
      const [name, ...nextKeys] = keys;
      let fieldData = null;
      if (Array.isArray(fields)) {
        fieldData = fields.find((field) => field.name === name); // Find the field in the array by name.

        if (!fieldData) fieldData = null; // Field not found in the array.

        if (nextKeys.length === 0) return fieldData; // Last key, no need to destructure array or object field.

        // Access the structure of the field to continue searching for the next key.
        if (fieldData?.structure?.isArray || fieldData?.structure?.isMap) {
          // If field is an array or map, access the elements type.
          const [_index, ...restKeys] = nextKeys;
          fieldData = accessField(fieldData.structure.elementsType, restKeys);
        } else if (fieldData?.structure?.isObject)
          // If field is an object, access the object fields.
          fieldData = accessField(fieldData.structure.objectFields, nextKeys);
        else fieldData = null; // Field has no structure.
      } else {
        fieldData = null; // Field not found in the object.
      }
      return fieldData;
    };

    const fieldData = accessField(initialStructureRef.current, keys);

    if (!fieldData) {
      // eslint-disable-next-line no-console
      console.warn(
        `Ricardo Form: se está intentando acceder al campo ${name} que no está definido en el formulario.`
      );
    }
    return fieldData ?? null;
  };

  /**
   * Updates a nested object's value based on a dot-separated key.
   * It updates a specific field within a nested object structure
   * using the dot-separated keys and sets the provided value.
   * @param formObj - The object to update.
   * @param keys - The dot-separated keys representing the path to the field to update.
   * @param value - The value to set for the specified field.
   * @returns - The updated object with the modified field.
   */
  const updateFieldValue = (formObj: Form, keys: string, value: any): Form => {
    const newForm = Array.isArray(formObj) ? [...formObj] : { ...formObj }; // Create a copy of the form to avoid mutating the original object.
    const nestedKeys = keys.split('.');
    const lastKey = nestedKeys.pop();
    const targetField = nestedKeys.reduce((acc: any, key: string) => {
      // Create a copy of the field to avoid mutating the original object.
      const fieldCopy = Array.isArray(acc[key])
        ? [...acc[key]] // Copy the array
        : { ...acc[key] }; // Copy the object or create an empty object if it doesn't exist. /// TODO: maybe you should use getDefaultValue here to init an array if it's not defined.
      acc[key] = fieldCopy;
      return fieldCopy;
    }, newForm);
    if (lastKey) {
      // Update the target field with the new value.
      targetField[lastKey] = value;
    }
    return newForm;
  };

  /**
   * Handles the change event of a form field.
   * It updates the form state with the new value of the field.
   * Triggers form fields validations and updates the error messages accordingly.
   * @param {string} name - The name of the field to update.
   * @param {*} value - The new value of the field to update.
   * @param {boolean} isManualChange - Flag to track if the change was manual or automatic. Don't count automatic changes to enable form save.
   */
  const handleChange: FormHandleChange = (
    name: string | any,
    value: any,
    isManualChange = true
  ) => {
    /// TODO: code parsers support.

    hasChangesRef.current = hasChangesRef.current || isManualChange; // Track if the form has changes since the last reset.
    setForm((prevForm: Form) => {
      const updatedForm = updateFieldValue(prevForm, name, value);
      return { ...prevForm, ...updatedForm };
    });
  };

  /**
   * Handles the change event of multiple form fields.
   * It updates the form state with the new values of the fields.
   * Accepts a plain object with nested field names as keys and their new values as values.
   * Triggers form fields validations and updates the error messages accordingly.
   * @param {object} fieldsObject - The object containing the fields to update with their new values.
   * @param {boolean} isManualChange - Flag to track if the change was manual or automatic. Don't count automatic changes to enable form save.
   * @example
   * handleMultipleChange({
   *  'name': 'Johnny',
   *  'some.nested.field.0': "Hello World!",
   * });
   */
  const handleMultipleChange = (
    fieldsObject: Form,
    isManualChange: boolean
  ) => {
    Object.entries(fieldsObject).forEach(([name, value]) => {
      handleChange(name, value, isManualChange);
    });
  };

  /**
   * Sets the initial form state with the provided object.
   * It updates the form state with the provided object and resets the changes flag.
   * @param {object} initialForm - The object to set as the initial form state.
   */
  const setInitialForm = (
    initialForm: Form,
    shouldUpdateRef: boolean = true
  ): void => {
    if (shouldUpdateRef) initialFormRef.current = initialForm;
    hasChangesRef.current = false;
    setForm(initialForm);
  };

  /**
   * Retrieves the default form state based on the initial form structure.
   * @returns {object} - The default form state object.
   */
  const getDefaultForm = () => {
    return getInitialForm(initialStructureRef.current);
  };

  /**
   * Concatenates two strings with a dot if a prefix is present.
   * This is useful for building dot-separated names for nested form fields.
   * @param prefix - The prefix string, representing the path to the nested field.
   * @param name - The actual name of the field.
   * @returns A dot-separated string representing the full name of the field.
   */
  const getInputName = (prefix: string, name: string): string => {
    if (prefix) {
      return `${prefix}.${name}`;
    } else {
      return name;
    }
  };

  /**
   * Computes a dynamic field value or returns static field value as is.
   * @param {*} value - The value to compute or return.
   * @returns {*} - The computed value.
   */
  const dynamic = (value: any) =>
    typeof value === 'function' ? value(form) : value;

  /**
   * Builds an array of JSX Input elements for the provided form fields.
   * @param {object[]} formFields - Array of objects with the form fields.
   * @param {object} dropdownOptions - Object containing the dropdown options.
   * @param {string} prefix - The prefix string to concatenate with the field names.
   * @param {object} customProps - Object containing custom props for specific fields.
   * Field name must match the key without prefix. Nested fields must be specified as
   * a single string with dot-separated keys.
   * @returns {JSX.Element[]} - Array of JSX Input elements.
   */

  const formBuilder = (
    formFields: FormBuilderField[] = [],
    config: FormBuilderConfig = {}
  ): any => {
    const {
      dropdownOptions = {},
      prefix = '',
      customProps = {},
      radioOptions = {},
      checkboxOptions = {},
      toggleOptions = {},
      handleSearch = {},
    } = config;
    return formFields.map((input) => {
      const inputFullName = getInputName(prefix, input.name);
      const inputData = getFieldData(inputFullName);
      const extraInputProps = customProps[input.name];

      const renderer = {
        [INPUT_TYPES.default]: Input,
        [INPUT_TYPES.text]: Input,
        [INPUT_TYPES.date]: Input,
        [INPUT_TYPES.search]: Input,
        [INPUT_TYPES.autocomplete]: InputAutocomplete,
        [INPUT_TYPES.checkbox]: InputCheckbox,
        [INPUT_TYPES.checkboxGroup]: InputCheckboxGroup,
        [INPUT_TYPES.dropdown]: InputDropdown,
        [INPUT_TYPES.toggle]: InputToggle,
        [INPUT_TYPES.radio]: InputRadio,
        [INPUT_TYPES.radioGroup]: InputRadioGroup,
        [INPUT_TYPES.password]: InputPassword,
        [INPUT_TYPES.counter]: InputCounter,
        [INPUT_TYPES.number]: InputNumber,
        [INPUT_TYPES.textarea]: InputTextArea,
      };

      const Component: React.FC<any> = renderer[input.type];

      if (!Component) {
        // eslint-disable-next-line no-console
        console.warn(
          `Ricardo Form: El tipo de campo ${input.type} no está soportado.`
        );
        return null;
      }

      /// TODO: refactor this to be generic.
      return (
        <Component
          key={input.name}
          name={inputFullName}
          value={getFieldValue(form, inputFullName)}
          errorMessage={getFieldErrorMessage(inputFullName)}
          placeholder={input.placeholder}
          className={input.className}
          containerClassName={input.containerClassName}
          required={dynamic(inputData?.required)}
          type={input.type}
          size={input.size}
          disabled={dynamic(inputData?.disabled)}
          max={input.max}
          min={input.min}
          maxLength={input.maxLength}
          handleChange={(
            _name: string,
            value: FieldValue,
            isManualChange: boolean
          ) => handleChange(inputFullName, value, isManualChange)}
          toggleOptions={toggleOptions[inputFullName]}
          label={input.label}
          isDisabled={dynamic(inputData?.disabled)}
          color={input.colorToggle}
          inputLabel={input.label}
          multiple={input.multiple}
          radios={radioOptions[inputFullName]}
          checkboxes={checkboxOptions[inputFullName]}
          radioOptionValue={input.radioOptionValue}
          form={form}
          handleSearch={handleSearch[inputFullName]}
          options={
            input.dropdownOptions ?? dropdownOptions[inputFullName] ?? []
          }
          {...extraInputProps}
        />
      );
    });
  };

  /**
   * Calls formBuilder and generates a map where the keys are the field names
   * and the values are the results of formBuilder (JSX elements).
   * @param {object[]} formFields - Array of objects with the form fields.
   * @param {object} config - Configuration object for formBuilder (optional).
   * @returns {Map<string, React.ReactNode>} - A map with field names as keys and JSX elements as values.
   */
  const generateFormFieldMap = (
    config: FormBuilderConfig = {}
  ): Map<string, React.ReactNode> => {
    const formFields = initialStructureRef.current as FormBuilderField[];

    // Call formBuilder to generate the array of JSX elements
    const formElements = formBuilder(formFields, config);

    // Create a map to store the field names and their corresponding JSX elements
    const fieldMap = new Map<string, React.ReactNode>();

    // Loop through the formFields array to populate the map
    formFields.forEach((input, index) => {
      const inputFullName = getInputName(config.prefix || '', input.name);
      fieldMap.set(inputFullName, formElements[index]);
    });

    return fieldMap;
  };

  return {
    // Form state data.
    form,
    errors,
    errorsCount,
    progress,
    hasChanges,
    submitEnabled,

    // Methods to update form.
    handleChange,
    handleMultipleChange,
    setDangerousForm: setForm, // This function is dangerous because it bypasses validations. Use with caution.
    setInitialForm,
    resetForm,

    // Utils
    formBuilder,
    generateFormFieldMap,
    getFieldErrorMessage,
    getDefaultForm,
  };
};

export default useRichieForm;
