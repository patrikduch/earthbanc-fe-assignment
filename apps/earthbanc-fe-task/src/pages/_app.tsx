import { AppProps } from 'next/app';
import Head from 'next/head';
import './styles.css';
import { TaskProvider } from '../contexts/TaskContext';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to earthbanc-fe-task!</title>
      </Head>

      <TaskProvider>
        <main className="app">
          <Component {...pageProps} />
        </main>
      </TaskProvider>
    </>
  );
}

export default CustomApp;
