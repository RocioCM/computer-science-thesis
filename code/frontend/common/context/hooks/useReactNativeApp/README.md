# Connecting to React Native Apps

This module is built to connect your webapp with a React Native app. It uses a React Native Webview library on the React Native side. The webapp will be displayed inside the webview, and the communication between the webapp and the React Native app will be done through the webview.

## How to use

First of all, if you haven't already, you need add useReactNativeApp hook on the [Context Provider](/common/context/Provider.tsx). Check the Context [README](/common/context/README.md) file for instructions on how to do this. For example, you can add the hook like this:

```jsx
import useReactNativeApp from './modules/reactNative/useReactNativeApp';

export const AppContextProvider: React.FC = ({ children }) => {
  // ... other hooks ...
  const nativeApp = useReactNativeApp();

  const state = {
    // ... other states ...
    nativeApp,
  };

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
```

### Sending messages to React Native

To send a message to the React Native app, you can use the `postMessageToApp` function. It receives two parameters: the message type and the payload. The payload can be any data you want to send to the React Native app.

Never import useReactNativeApp directly in your components. Always use the useAppContext hook to access the context and then use the useReactNativeApp hook.

```jsx
import { useAppContext } from '@/common/context';

const SomeComponent = () => {
  const { nativeApp } = useAppContext();

  const handleSendMessage = () => {
    nativeApp.postMessageToApp('scanQR', { userId: 123 });
  };

  return (
    <div>
      <button onClick={handleSendMessage}>Scan a QR using Native Camera</button>
    </div>
  );
};
```

### Receiving messages from React Native

Each time the React Native app sends a message to the webapp, the message is saved on the `lastReceivedMessage` state with the message received. You can use this state to handle the message received if it's type is the one you are expecting.

```jsx
import { useAppContext } from '@/common/context';

const SomeComponent = () => {
  const { nativeApp } = useAppContext();

  useEffect(() => {
    const message = nativeApp.lastReceivedMessage;
    if (message.type === 'qrCodeScanned') {
      toast.success('QR Code scanned successfully. Redirecting...');
      router.push('/success/' + message.payload.userId);
    }
  }, [nativeApp.lastReceivedMessage]);

  return (
    <div>
      <p>Last message received: {nativeApp.lastReceivedMessage.type}</p>
    </div>
  );
};
```
