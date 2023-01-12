import '../styles/globals.css';
import type { NextWebVitalsMetric } from 'next/app';
import { Provider } from 'react-redux';
import { wrapper } from '@/redux//store';
import 'react-loading-skeleton/dist/skeleton.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import MainLayout from '@/components/layouts/MainLayout';
import 'src/i18n/config';
import 'react-toastify/dist/ReactToastify.css';
// import '@/styles//galenderStyle.css';
import '@/styles/TabOrderHistory.css';
import { AppProps } from 'next/app';
import { FC } from 'react';
import { AnimatePresence } from 'framer-motion';
import NextNProgress from 'nextjs-progressbar';

const App: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <NextNProgress
        color="#189EC9"
        startPosition={0.3}
        stopDelayMs={200}
        height={2}
        showOnShallow={true}
        options={{ showSpinner: false }}
      />
      {/*<DevTools />*/}
      <AnimatePresence mode={`wait`}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </AnimatePresence>
    </Provider>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // isLocal ? console.log('metric', metric) : null;
}

export default App;
