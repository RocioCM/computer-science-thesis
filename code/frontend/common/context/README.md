# Global context

This directory contains the global context of the project. It is used to store the global variables and functions that are used throughout the project.

Saving any state in the context allows you to share it between screens and components.

It's very simple to use.

1. Create a hook here in the context/hooks folder for your functionality. Put all your state and functions in this hook.

For example, if we want to create a notification system, we can create a hook like this.
It will allow us to show a notifications counter and update it from any screen or component.

```jsx
import { useState } from 'react';

export const useNotificationsState = () => {
  const [notificationsCount, setNotificationsCount] = useState(0);

  const markAsRead = () => {
    setNotificationsCount(0);
  };

  return {
    notificationsCount,
    updateCount: setNotificationsCount,
    markAsRead,
  };
};
```

2. Use the hook in the [Provider.tsx](./Provider.tsx) file to make it available to the whole project. You will find instructions on how to do this in the file. Basically you have to call the hook and pass the value to the context provider. In the notification system example, it would look like something like this:

```jsx
import { useNotificationsState } from './hooks';

export const AppContextProvider: React.FC = ({ children }) => {
  // ... other hooks ...
  const notifications = useNotificationsState();

  const state = {
    // ... other states ...
    notifications,
  };

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
```

In this case you will use the name "notifications" to access the notification system in the context in the next step.

3. Use useAppContext hook to access your state and functions in any screen or component. For example, to use the notification system we created above, we can do this:

```jsx
import { useAppContext } from '@/common/context';

const SomeComponent = () => {
  const { notifications } = useAppContext();

  return (
    <div>
      <p>Notifications: {notifications.notificationsCount}</p>
      <button onClick={notifications.markAsRead}>Mark as read</button>
    </div>
  );
};
```

That's it! Now you can use the notification system in any screen or component.

Remember to always create a hook for each functionality you want to share in the context. This way you can keep your code organized and easy to maintain. If you code functionality directly on the context provider file, I will find you and I will bug your app. 😈
