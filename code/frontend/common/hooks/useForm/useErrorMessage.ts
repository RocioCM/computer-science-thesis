import { useState } from 'react';

export interface ErrorMessage {
  allowRenderError: () => void;
  errorMessage: string;
}

/**
 * Custom hook to handle error message conditional render after input is touched.
 * @param errorMessage - Error message to display conditionally.
 * @returns - Object containing the error message and a function to allow rendering the error message.
 */
const useErrorMessage = (errorMessage: string = ''): ErrorMessage => {
  const [showError, setShowError] = useState(false);

  return {
    allowRenderError: () => setShowError(true),
    errorMessage: showError ? errorMessage : '',
  };
};

export default useErrorMessage;
