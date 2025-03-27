import { ROLES } from '@/common/constants/auth';
import useLoginContext, { withAuth } from '@/common/libraries/auth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function Home() {
  const { user, userHasRole } = useLoginContext();
  const router = useRouter();

  useEffect(() => {
    if (userHasRole(ROLES.admin)) {
      router.push('/admin');
    } else if (userHasRole(ROLES.producer)) {
      router.push('/producer');
    } else if (userHasRole(ROLES.secondary_producer)) {
      router.push('/secondary-producer');
    } else if (userHasRole(ROLES.consumer)) {
      router.push('/consumer');
    } else if (userHasRole(ROLES.recycler)) {
      router.push('/recycler');
    }
  }, [user]);

  return <main></main>;
}

export default withAuth(Home);
