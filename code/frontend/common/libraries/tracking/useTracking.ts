import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppContext } from '@/common/context';
import { getPath, getEventData, postAction } from './utils';

/**
 * Returns a wrapper function for event handlers to track events.
 * The event wrapped in this function will generate a log every time it's thrown.
 * @param global indicates true if the tracking hook is called in a global context
 * or false if called in an specific component.
 * @returns a function to track events.
 */
const useTracking = (global: boolean = false) => {
  const { auth, ...appContext } = useAppContext();
  const isStandaloneBrowser = !(appContext as any).nativeApp?.isConnected; // If the web is connected to a native app, it's not a standalone browser.
  const { loading, user } = auth;

  const router = useRouter();
  const path = router.asPath.split('?')[0]; // Get the current path without query params.

  /** Tracks a screen or view on first load. */
  const trackScreen = async () => {
    await postAction({
      trackType: 'view',
      user,
      isBrowser: isStandaloneBrowser,
      path: getPath(router.asPath),
      eventData: {},
    });
  };

  /** Tracks an event when it's triggered.
   * @param eventName name of the tracked event.
   * @param eventHandlerCallback the event handler.
   * @param customParams optional parameters to attach directly to the tracked data.
   * @param config parameters to set the properties of the event to track.
   * @returns the wrapped tracked callback for the given event.
   */
  const trackEvent =
    (
      eventName: string,
      customParams: Record<string, any> = {},
      config: string | string[] = [],
      eventHandlerCallback: (..._params: any[]) => void = () => {}
    ) =>
    async (...params: any[]) => {
      eventHandlerCallback(...params); // Call the original event handler.
      params = params[0]?.target ? params[0].target : params[0]; // Access event.target if the param is a native event.
      const formattedData = getEventData(params, config); // Format the event data.
      await postAction({
        trackType: 'event',
        path: getPath(path, eventName),
        user,
        isBrowser: isStandaloneBrowser,
        eventData: { ...formattedData, ...customParams },
      });
    };

  // END TRACKING METHODS

  // EFFECTS IMPLEMENTATION:

  useEffect(() => {
    // Track that the screen was loaded.
    if (global && !loading) trackScreen();
  }, [path, loading]);

  useEffect(() => {
    if (!global) return; // Only attach the event listener in a global context.

    // Track when a click event is triggered on any element in the document.
    const handleClick = (e: MouseEvent) =>
      trackEvent('click', { pageX: e.pageX, pageY: e.pageY }, [
        'id',
        'name',
        'innerText',
        'nodeName',
      ])(e);

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return trackEvent; // Callback to track events triggering manually.
};

export default useTracking;
