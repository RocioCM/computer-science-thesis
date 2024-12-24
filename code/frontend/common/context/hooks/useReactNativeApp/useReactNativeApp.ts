import { useEffect, useState } from 'react';
import { Message } from './types';

/**
 * Hook to interact with the React Native app.
 *
 * @WARN only call this hook once in the context provider.
 */
const useReactNativeApp = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastReceivedMessage, setLastReceivedMessage] = useState<Message>({
    type: '',
    payload: null,
  });

  useEffect(() => {
    setIsConnected(!!window.ReactNativeWebView);
    postMessageToApp('getSessionToken');

    document.addEventListener('message', onMessageFromApp as any); // Android
    window.addEventListener('message', onMessageFromApp); // iOS
    return () => {
      document.removeEventListener('message', onMessageFromApp as any);
      window.removeEventListener('message', onMessageFromApp);
    };
  }, []);

  /**
   * Handle messages received from the native app.
   * @param event - The message event.
   */
  const onMessageFromApp = async (event: MessageEvent) => {
    try {
      const eventData: Message = JSON.parse(event.data);
      if (typeof eventData.type === 'string') {
        const message: Message = {
          type: eventData.type,
          payload: eventData?.payload ?? null,
        };
        setLastReceivedMessage(message);
      }
    } catch {
      return; // Ignore invalid messages
    }
  };

  /**
   * Send a message to the native app.
   * @param type - The message type.
   * @param payload - The message payload.
   */
  const postMessageToApp = (type: string, payload: any = null) => {
    const message: Message = { type, payload };
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify(message));
    } else {
      // eslint-disable-next-line no-console
      console.log(`Send message to native app: ${JSON.stringify(message)}`);
    }
  };

  return {
    isConnected,
    lastReceivedMessage,
    postMessageToApp,
  };
};

export default useReactNativeApp;
