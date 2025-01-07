import React, { useMemo } from 'react';

interface Props {
  ref: React.RefObject<HTMLElement>;
  show?: boolean;
}

interface Position {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

/** Returns the position of a component relative to the viewport.
 * @param {React.RefObject<HTMLElement>} p.ref - reference to the component.
 * @param {boolean?} p.show - boolean value to show or hide the component.
 * @returns an object containing the position of the component.
 */
const usePosition = ({ ref, show = false }: Props): Position => {
  const position = useMemo(() => {
    if (ref.current) {
      const { top, left, bottom, right } = ref.current.getBoundingClientRect();
      return { top, left, bottom, right };
    }
    return { top: 0, left: 0, bottom: 0, right: 0 };
  }, [show]);

  return position;
};

export default usePosition;
