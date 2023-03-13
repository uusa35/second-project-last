import { FC, ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import { setUserAgent } from '@/redux/slices/customerSlice';
import {
  arboriaFont,
  gessFont,
  scrollClass,
  setLang,
  suppressText,
} from '@/constants/*';
import { setLocale } from '@/redux/slices/localeSlice';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useGetVendorQuery } from '@/redux/api/vendorApi';
import { AppQueryResult } from '@/types/queries';
import { Vendor } from '@/types/index';
import { setVendor } from '@/redux/slices/vendorSlice';
import { isNull } from 'lodash';
import { useLazyCreateTempIdQuery } from '@/redux/api/cartApi';
import * as yup from 'yup';
const MainAsideLayout = dynamic(
  async () => await import(`@/components/home/MainAsideLayout`),
  {
    ssr: false,
  }
);
const ToastAppContainer = dynamic(
  async () => await import(`@/components/ToastAppContainer`),
  {
    ssr: false,
  }
);

type Props = {
  children: ReactNode | undefined;
  showCart?: boolean;
};

type Handler = (...evts: any[]) => void;

const MainLayout: FC<Props> = ({ children }): JSX.Element => {
  const {
    appSetting: { sideMenuOpen, url, previousUrl, method },
    customer: { userAgent },
    locale,
    vendor,
    branch,
    area,
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    data: vendorElement,
    isSuccess,
    refetch,
  } = useGetVendorQuery<{
    data: AppQueryResult<Vendor>;
    isSuccess: boolean;
  }>({
    lang: locale.lang,
    url,
    branch_id: method !== `pickup` ? branch.id : ``,
    area_id: method === `pickup` ? area.id : ``,
  });

  useEffect(() => {
    refetch();
  }, [branch.id, area.id]);

  const [triggerCreateTempId, { isSuccess: tempIdSuccess }] =
    useLazyCreateTempIdQuery();

  useEffect(() => {
    setAppDefaults();
  }, [isSuccess, tempIdSuccess]);

  const setAppDefaults = () => {
    if (isNull(userAgent)) {
      triggerCreateTempId({ url }).then((r: any) =>
        dispatch(setUserAgent(r.data.Data?.Id))
      );
    }
    if (isSuccess && vendorElement.Data) {
      dispatch(setVendor(vendorElement.Data));
    }
  };

  useEffect(() => {
    const handleRouteChange: Handler = (url, { shallow }) => {
      dispatch(hideSideMenu());
    };
    const handleChangeComplete: Handler = (url, { shallow }) => {
      if (sideMenuOpen) {
        dispatch(hideSideMenu());
      }
    };

    const beforeUnLoad = () => {
      if (router.asPath.includes('payment') || router.asPath.includes('cart')) {
        // do nothing
      } else if (router.asPath.includes('home') || router.asPath === '/') {
        // dispatch({ type: `resetEntireApp` });
      } else {
        // dispatch({ type: `resetApp` });
      }
      // dispatch({ type: `resetEntireApp` });
      router.reload();
    };

    const handleRouteChangeError = (err: any) => {
      // return router.replace(router.asPath);
    };

    router.events.on('routeChangeError', handleRouteChangeError);
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleChangeComplete);
    window.addEventListener('beforeunload', beforeUnLoad);
    return () => {
      window.removeEventListener('beforeunload', beforeUnLoad);
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router.pathname]);

  useEffect(() => {
    if (router.locale !== locale.lang) {
      dispatch(setLocale(router.locale));
    }
    if (router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale);
    }
    moment.locale(router.locale);
    yup.setLocale({
      mixed: {
        required: 'validation.required',
      },
      number: {
        min: ({ min }) => ({ key: 'validation.min', values: { min } }),
        max: ({ max }) => ({ key: 'validation.max', values: { max } }),
      },
      string: {
        email: 'validation.email',
        min: ({ min }) => ({ key: `validation.min`, values: min }),
        max: ({ max }) => ({ key: 'validation.max', values: max }),
        matches: 'validation.matches',
      },
    });
    setLang(router.locale);
  }, [router.locale]);

  return (
    <div
      dir={router.locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${
        router.locale === 'ar' ? gessFont : arboriaFont
      } flex-col justify-start items-start grow  lg:flex lg:flex-row flex flex-row h-screen  capitalize`}
    >
      {children}
      {/* Main Image & Logo */}
      <ToastAppContainer />
      <div
        className={`hidden lg:block flex flex-row  w-full h-screen lg:w-2/4 xl:w-2/3 fixed ${scrollClass} ${
          router.locale === 'ar' ? 'left-0' : 'right-0'
        }`}
        suppressHydrationWarning={suppressText}
      >
        {isSuccess && <MainAsideLayout element={vendor} />}
      </div>
    </div>
  );
};

export default MainLayout;
