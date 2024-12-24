import React, { useCallback } from 'react';
import useToggle from './useToggle';

type ConditionalComponent<P> = [
  Component: (props: ConditionalComponentProps<P>) => React.JSX.Element | null,
  toggleShow: () => void,
  showComponent: () => void,
  hideComponent: () => void
];

type ConditionalComponentProps<P> = Omit<P, 'handleCancel'> & {
  handleCancel?: (_e: React.MouseEvent | React.ChangeEvent) => void;
  handleContinue?: (_e: React.MouseEvent | React.ChangeEvent) => void;
};

/**
 * Returns a conditional rendered Component and functions to show and hide it.
 * It controls if the component is shown or not.
 * @param initialState - init component on a visible state.
 * @param Component - Component to be rendered.
 * @returns Conditional Component and methods to show and hide it.
 */
function useConditionalComponent<P>(
  initialState: boolean = false,
  Component: React.FC<P>
): ConditionalComponent<P> {
  const [show, toggleShow, showComponent, hideComponent] =
    useToggle(initialState);

  /** Returns a conditional rendered Component.
   * @param {boolean} shallow If shallow is true, the component will be mounted but conditional render is delegated to the component itself. */
  const StatefulComponent = useCallback(
    (props: any) => {
      const untypedProps = props as any;
      const handleCancel = (e: React.MouseEvent | React.ChangeEvent) => {
        if (untypedProps.handleCancel) untypedProps.handleCancel(e);
        hideComponent();
      };

      const handleContinue = (e: React.MouseEvent | React.ChangeEvent) => {
        if (untypedProps.handleContinue) untypedProps.handleContinue(e);
        hideComponent();
      };

      return untypedProps.shallow || show ? (
        <Component
          {...props}
          show={show}
          handleContinue={handleContinue}
          handleCancel={handleCancel}
        />
      ) : null;
    },
    [show]
  );

  return [StatefulComponent, toggleShow, showComponent, hideComponent];
}

export default useConditionalComponent;
