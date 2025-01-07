import { useState } from 'react';

export type ToggleState = [
  toggle: boolean,
  switchState: () => void,
  setTrue: () => void,
  setFalse: () => void
];

/**
 * Returns a boolean state and functions to toggle it.
 * @param {boolean} initialState initial state.
 * @returns State and functions to update it.
 */
const useToggle = (initialState: boolean = false): ToggleState => {
  const [toggle, setToggle] = useState(initialState);

  const switchState = () => {
    setToggle((prevState) => !prevState);
  };

  const setTrue = () => {
    setToggle(true);
  };

  const setFalse = () => {
    setToggle(false);
  };

  return [toggle, switchState, setTrue, setFalse];
};

export default useToggle;
