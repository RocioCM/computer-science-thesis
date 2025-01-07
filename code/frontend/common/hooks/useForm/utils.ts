/**
 * -----------------------------------------------
 * --------------- STRUCTURE UTILS ---------------
 * -----------------------------------------------
 * This file contains functions to define the structure of the form fields.
 * These functions are used in the form structure to define the data types of nested fields.
 * @see README for usage examples.
 */

import { FieldData } from './types';

/**
 * Array of elements of the given type.
 * @param {string | Array<object>} typeStructure - Primitive type or object structure.
 * @see TYPES in constants file for available primitive types.
 */
export const arrayOf = (typeStructure: FieldData[]) => ({
  isArray: true,
  elementsType: typeStructure,
});

/**
 * Object with the given fields.
 * @param {Array<object>} typeStructure - Array of fields specification.
 */
export const object = (typeStructure: FieldData[]) => ({
  isObject: true,
  objectFields: typeStructure,
});

/**
 * Object with string keys and with the given value type on each field.
 * @param {string | Array<object>} typeStructure - Primitive type or object structure.
 * @see TYPES in constants file for available primitive types.
 */
export const mapOf = (typeStructure: FieldData[]) => ({
  isMap: true,
  elementsType: typeStructure,
});

export const formatMoney = (amount: number): string => {
  return amount
    .toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    .replace('-', '');
};

const months = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

export const formatDateFull = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${day} de ${month} de ${year}, ${hours}:${minutes} ${ampm}`;
};

export const formatDateBasic = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
