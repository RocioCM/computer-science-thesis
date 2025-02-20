import Head from 'next/head';
import type { AppProps } from 'next/app';
import Toast from '@/common/components/Toast';
import AppWrapper from '@/common/components/AppWrapper';
import AppProvider from '@/common/context';
import { basePath } from '@/common/constants';

import 'animate.css';
import 'react-toastify/dist/ReactToastify.css';
import '@/common/styles/variables.css';
import '@/common/styles/globals.css';
import SideBar from '@/common/components/SideBar';

function MyApp({ Component, pageProps, router }: AppProps) {
  const isDynamicRoute = /\[.*\].*/.test(router.pathname);
  const pagePath = isDynamicRoute ? router.asPath.split('?')[0] : undefined; // Add key to force re-render when navigating on dynamic routes.

  return (
    <>
      <Head>
        <title>Tesis Blockchain</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="description" content="Generated by Lila Software Studio" />
        <link rel="icon" href={`${basePath}/favicon.ico`} />
      </Head>
      <AppProvider>
        <Toast />

        <AppWrapper>
          <SideBar />
          <Component {...pageProps} key={pagePath} />
        </AppWrapper>

        <div id="modal-root"></div>
      </AppProvider>
    </>
  );
}

export default MyApp;
