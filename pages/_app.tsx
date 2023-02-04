import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-loading-skeleton/dist/skeleton.css';
import '@/styles/TabOrderHistory.css';
import 'src/i18n/config';
import type { NextWebVitalsMetric } from 'next/app';
import { Provider } from 'react-redux';
import { wrapper } from '@/redux//store';
import MainLayout from '@/components/layouts/MainLayout';
import { AppProps } from 'next/app';
import { FC, Suspense } from 'react';

const App: FC<AppProps> = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Suspense>
      <Provider store={store}>
        <MainLayout url={props.pageProps.url}>
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    </Suspense>
  );
};

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // isLocal ? console.log('metric', metric) : null;
}

export default App;
