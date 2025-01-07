import { useEffect, useMemo } from 'react';
import { NextComponentType, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { useLoginContext } from '.';
import { UserRole } from './types';

/**
 * Validates user is authenticated and has permission to access the requested page.
 *
 * Renders the page if the user is allowed to access it.
 *
 * Stays in an eternal loading screen if user is not authenticated (login must be done on Flutter app).
 *
 * Redirects to Error page if user is authenticated but is not allowed to access the page.
 *
 * @param Component Page to be rendered if access is allowed.
 * @param roles Array of allowed roles. All roles are allowed if not present.
 */
const withAuth = (
  Component: NextComponentType<NextPageContext, any, any>,
  roles: UserRole | UserRole[] = []
) =>
  function AuthWrapper(props: any) {
    const { loading, isLoggedIn, user, userHasRole } = useLoginContext();
    const router = useRouter();

    /** True if user is logged in. Guarantees consistency with user object. */
    const isAuthenticated = isLoggedIn && !!user;

    /** True if logged in user is authorized to access the page. */
    const isAuthorized = useMemo(
      () =>
        isLoggedIn &&
        (Array.isArray(roles)
          ? !roles.length || roles.some((r) => userHasRole(r))
          : userHasRole(roles)),
      [isLoggedIn, user, roles]
    );

    useEffect(() => {
      if (!loading) {
        if (!isAuthenticated) {
          router.replace('/login'); // User not allowed.
        }
      }
    }, [loading]);

    if (loading || !isAuthenticated) return null; // User not logged in.
    return isAuthorized && <Component {...props} />; // User logged in and authorized. */
  };

export default withAuth;
