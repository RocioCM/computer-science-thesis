import React from 'react';

const MockContext = React.createContext({});

const TestAppWrapper = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: object | null;
}) => {
  const state: any = {
    auth: {
      user: null,
      isLoggedIn: false,
      loading: false,
    },
  };

  if (user !== undefined) {
    // Set user if provided
    state.auth.user = user;
    state.auth.isLoggedIn = true;
  }

  return <MockContext.Provider value={state}>{children}</MockContext.Provider>;
};

export default TestAppWrapper;
