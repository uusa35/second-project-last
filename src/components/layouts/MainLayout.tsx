import { FC, ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import { setUserAgent } from '@/redux/slices/customerSlice';
import { tajwalFont } from '@/constants/*';
import { setLocale } from '@/redux/slices/localeSlice';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useGetVendorQuery } from '@/redux/api/vendorApi';
import { AppQueryResult } from '@/types/queries';
import { Vendor } from '@/types/index';
import { setVendor } from '@/redux/slices/vendorSlice';
import { isNull } from 'lodash';
import { useLazyGetBranchesQuery } from '@/redux/api/branchApi';
import { setBranch } from '@/redux/slices/branchSlice';
import { useLazyCreateTempIdQuery } from '@/redux/api/cartApi';
import { useLazyGetLocationsQuery } from '@/redux/api/locationApi';
import { setArea } from '@/redux/slices/areaSlice';
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
    appSetting: { sideMenuOpen },
    customer: { userAgent },
    locale,
    branch: { id: branchId },
    area: { id: areaId },
    vendor,
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: vendorElement, isSuccess } = useGetVendorQuery<{
    data: AppQueryResult<Vendor>;
    isSuccess: boolean;
  }>({ lang: locale.lang });
  const [triggerGetBranches] = useLazyGetBranchesQuery();
  const [triggerGetLocations] = useLazyGetLocationsQuery();
  const [triggerCreateTempId] = useLazyCreateTempIdQuery();

  useEffect(() => {
    if (isSuccess && vendorElement.Data) {
      dispatch(setVendor(vendorElement.Data));
    }

    if (isNull(userAgent)) {
      triggerCreateTempId().then((r: any) =>
        dispatch(setUserAgent(r.data.Data?.Id))
      );
    }
  }, []);

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
      console.log('the error', err);
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
  }, [router.locale]);

  return (
    <div
      dir={router.locale === 'ar' ? 'rtl' : 'ltr'}
      className={`${tajwalFont} flex-col justify-start items-start grow  lg:flex lg:flex-row flex flex-row h-screen  capitalize`}
    >
      {children}
      {/* Main Image & Logo */}
      <ToastAppContainer />
      {isSuccess && <MainAsideLayout element={vendor} />}
    </div>
  );
};

export default MainLayout;
