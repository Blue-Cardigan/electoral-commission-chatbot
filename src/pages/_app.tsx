import type { AppProps } from 'next/app';
import Layout from '@/components/layout';
import { Analytics } from "@vercel/analytics/react"
import '@/styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  );
}

export default MyApp;
