import type { AppProps } from 'next/app';
import Layout from '@/components/layout';
import Head from 'next/head';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
