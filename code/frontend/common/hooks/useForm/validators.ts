import {
  formatNumberToLocal,
  formatStringToNumber,
} from '@/common/utils/formatters';
import dayjs from 'dayjs';
import { ValidatorFunction } from './types';

/**
 * -----------------------------------------------
 * -------------- FIELD VALIDATORS ---------------
 * -----------------------------------------------
 * @README - HOW IT WORKS:
 * Read this instructions if you are about to create a new validator fuction.
 * @IMPORTANT NOTE: every validator must assume the value is not required, so it must check if the value
 * is empty before validating it. If the value is empty, the validator must return an empty string.
 * @EXAMPLE isEmail("") -> "" // Valid
 * @EXAMPLE isEmail("example") -> "Ingresá una dirección de correo electrónico válida" // X Invalid
 * @EXAMPLE isEmail("example@gmail.com") -> "" // Valid
 
 * FORMAT: every validator function must return an empty string if the value is valid.
 * Otherwise, it must return a string with the error message.
 */

/** Don't use this function directly. Use required attribute in form structure instead. */
export const _isRequired: ValidatorFunction = (value) => {
  if (!value) return 'Este campo es obligatorio';
  return '';
};

export const isRequiredNumber: ValidatorFunction = (value) => {
  if (typeof value !== 'number') return 'Este campo debe ser un número';
  return '';
};

export const maxLength =
  (length: number): ValidatorFunction =>
  (value) => {
    if (!value) return '';
    if (value.length > length)
      return `Este campo debe tener hasta ${length} caracteres`;
    return '';
  };

export const maxAmountFiles =
  (length: number): ValidatorFunction =>
  (value) => {
    if (!value) return '';
    if (value.length > length)
      return `Podés cargar hasta un máximo de ${length} imágenes`;
    return '';
  };

export const minAmountFiles =
  (length: number): ValidatorFunction =>
  (value) => {
    if (!value) return '';
    if (value.length < length) return `Cargá al menos ${length} imagenes`;
    return '';
  };

export const minLength =
  (length: number): ValidatorFunction =>
  (value) => {
    if (!value) return '';
    if (value.length < length)
      return `Este campo debe tener al menos ${length} caracteres`;
    return '';
  };

export const minValue =
  (min: number): ValidatorFunction =>
  (value) => {
    if (parseInt(value) < min) return `Este campo debe ser mínimo ${min}`;
    return '';
  };

export const maxValue =
  (max: number): ValidatorFunction =>
  (value) => {
    if (parseInt(value) > max) return `Este campo debe ser máximo ${max}`;
    return '';
  };

export const maxDinamicValue =
  (field: string, customError: string): ValidatorFunction =>
  (value, form) => {
    if (!value) return '';
    const formatedValue = formatNumberToLocal(form[field]);
    if (formatStringToNumber(value) > formatStringToNumber(form[field])) {
      if (customError) {
        const formatedCustomError = customError.replace(
          /\$field/g,
          formatedValue
        );
        return formatedCustomError;
      } else {
        return `Este campo no debe ser mayor a ${formatedValue}`;
      }
    } else {
      return '';
    }
  };

export const minDinamicValue =
  (field: string, customMessage: string): ValidatorFunction =>
  (value, form) => {
    if (form[field] === 0 || !form[field]) return '';
    if (formatStringToNumber(value) < form[field]) {
      if (customMessage) {
        const formatedCustomMessage = customMessage.replace(
          /\$field/g,
          form[field]
        );
        return formatedCustomMessage;
      } else {
        return `Este campo no debe ser menor a ${formatStringToNumber(
          form[field]
        )}`;
      }
    }
    return '';
  };

export const inRange =
  (min: number, max: number): ValidatorFunction =>
  (value) => {
    if (!value && typeof value !== 'number') return '';
    if (value < min || value > max)
      return `Este campo debe estar entre ${min} y ${max}`;
    return '';
  };

export const isDate: ValidatorFunction = (value) => {
  if (!value || value instanceof Date) return '';
  return 'Este campo debe ser una fecha válida';
};

export const isStringDate =
  (format = 'MM-YYYY'): ValidatorFunction =>
  (value) => {
    if (!value) return '';

    if (typeof value !== 'string' || !dayjs(value, format).isValid())
      return 'Este campo debe ser una fecha válida';

    return '';
  };

export const isEmail: ValidatorFunction = (value) => {
  // Regular expression for basic email validation.
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailRegex.test(value))
    return 'Ingresá una dirección de correo electrónico válida';
  return '';
};

/** Check if the value is a valid password with at least 8 characters, a letter and a number. */
export const isPassword: ValidatorFunction = (value) => {
  // At least 8 characters and includes a number and a letter
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(value))
    return 'La contraseña debe tener al menos 8 caracteres, una letra y un número';
  return '';
};

export const isNumber: ValidatorFunction = (value) => {
  //Regular expression to validate that it only contains numbers and special characters.
  const numberRegex = /^[0-9\s()\-+]+$/;
  if (
    (typeof value === 'number' || typeof value === 'string') &&
    value !== '' &&
    !numberRegex.test(`${value}`)
  )
    return 'Ingresá solo números en este campo';
  return '';
};

export const isPositiveNumber: ValidatorFunction = (value) => {
  if ((value && typeof value !== 'number') || value < 0)
    return 'Ingresá un número positivo';
  return '';
};

export const isNaturalNumber: ValidatorFunction = (value) => {
  if ((value && !Number.isInteger(value)) || value < 0)
    return 'Ingresá un número positivo';
  return '';
};

export const maxFieldValue =
  (field: string): ValidatorFunction =>
  (value, form) => {
    if (typeof form[field] === 'number' && value > form[field])
      return `Este campo no debe ser mayor a ${form[field]}`;
    return '';
  };

export const minFieldValue =
  (field: string): ValidatorFunction =>
  (value, form) => {
    if (typeof form[field] === 'number' && value < form[field])
      return `Este campo no debe ser menor a  ${form[field]}`;
    return '';
  };

export const arrayMinLength =
  (length: number): ValidatorFunction =>
  (value) => {
    if (!Array.isArray(value)) return '';
    if (value.length < length)
      return `Debe seleccionar al menos ${length} elemento${
        length !== 1 ? 's' : ''
      }`;
    return '';
  };

export const arrayMaxLength =
  (length: number): ValidatorFunction =>
  (value) => {
    if (!Array.isArray(value)) return '';
    if (value.length > length)
      return `Debe seleccionar hasta ${length} elemento${
        length !== 1 ? 's' : ''
      }`;
    return '';
  };

export const isDni: ValidatorFunction = (value) => {
  // Regular expression to validate that it only contains numbers
  const dniRegex = /^[0-9]{7,8}$/;
  if (!dniRegex.test(value))
    return 'Ingresá un DNI válido, sin puntos ni espacios';
  return '';
};

export const isPassport: ValidatorFunction = (value) => {
  // Regular expression to validate that it only contains numbers and letters and has a maximum of 9 characters
  const passportRegex = /^[a-zA-Z0-9]{6,9}$/;
  if (!passportRegex.test(value))
    return 'Ingresá un DNI o pasaporte válido, sin espacios ni guiones';
  return '';
};

export const isPhone: ValidatorFunction = (value) => {
  // Regular expression to validate that it only contains numbers
  if (!value) return '';
  const phoneRegex = /^\+?[0-9]{10,14}$/;
  if (!phoneRegex.test(value))
    return 'Ingresá un número de teléfono válido, sin espacios ni guiones';
  return '';
};

export const isValidAccount: ValidatorFunction = (value) => {
  const isNumeric = /^\d+$/.test(value);
  // Regular expression to validate that it is CBU/CVU or ALIAS
  if (isNumeric) {
    if (value.length === 22) {
      return '';
    } else {
      return 'Ingresá un CBU o CVU válido de 22 dígitos';
    }
  } else {
    const aliasRegex = /^[a-zA-Z0-9._-]{6,20}$/;
    if (!aliasRegex.test(value)) {
      return 'Ingresá un alias válido de entre 6 y 20 caracteres, que puede contener letras, números, puntos, guiones bajos y guiones';
    }
    return '';
  }
};
