import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Prevent user from leaving the page if there are usaved changes in the form.
 * Triggers a confirmation dialog when the user tries to leave the page with unsaved changes.
 * @param hasChangesRef - Reference to a boolean value that indicates if there are changes in the form.
 * @returns handleSyncConfirmation and handleAsyncConfirmation functions to handle the confirmation dialog manually.
 */
const useUnsavedChangesConfirmation = (
  hasChangesRef: React.RefObject<boolean>
) => {
  const router = useRouter();

  useEffect(() => {
    // Add listeners to prevent user from leaving the page if there are changes in the form.

    const handleUnload = (e: BeforeUnloadEvent) => {
      if (hasChangesRef.current) {
        const leaveConfirmation = window.confirm(
          'Tienes cambios sin guardar ¿Estás seguro que deseas abandonar la página?'
        );

        if (!leaveConfirmation) {
          e.preventDefault();
          e.returnValue = '';
        }
      }
    };

    const handleRouteChange = (url: string) => {
      if (hasChangesRef.current) {
        const leaveConfirmation = window.confirm(
          'Tienes cambios sin guardar ¿Estás seguro que deseas abandonar la página?'
        );

        if (!leaveConfirmation) {
          router.events.emit('routeChangeError');
          throw `Route change to "${url}" was aborted (this error can be safely ignored). See https://github.com/zeit/next.js/issues/2476.`;
        }
      }
    };

    router.events.on('routeChangeStart', handleRouteChange); // Internal navigation
    window.addEventListener('beforeunload', handleUnload); // External navigation

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  /**
   * Handle sync confirmation dialog. When called, it will trigger a confirmation dialog if there are unsaved changes.
   * @returns If the user confirms the action, it will return true. Otherwise, it will return false.
   */
  const handleSyncConfirmation = () => {
    if (hasChangesRef.current) {
      const leaveConfirmation = window.confirm(
        'Tienes cambios sin guardar ¿Estás seguro que deseas abandonar la página?'
      );

      return leaveConfirmation;
    }
    return true;
  };

  /**
   * Handle async confirmation dialog. When called, it will trigger a confirmation dialog if there are unsaved changes.
   * If the user confirms the action, it will execute the callback. Otherwise, it will do nothing.
   * @param callback - Callback function to execute if the user confirms the action.
   */
  const handleAsyncConfirmation = async (callback: () => void) => {
    if (hasChangesRef.current) {
      const leaveConfirmation = window.confirm(
        'Tienes cambios sin guardar ¿Estás seguro que deseas abandonar la página?'
      );

      if (!leaveConfirmation) return; // Do nothing if the user cancels the action.
    }

    // Execute the callback if the user confirms the action or there are no changes.
    await callback();
  };

  return { handleSyncConfirmation, handleAsyncConfirmation };
};

export default useUnsavedChangesConfirmation;
