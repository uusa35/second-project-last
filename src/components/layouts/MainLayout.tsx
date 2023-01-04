import { FC, ReactNode, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import i18n from 'i18next';
import { useRouter } from 'next/router';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import {
  appLinks,
  baseUrl,
  imageSizes,
  imgUrl,
  suppressText,
  tajwalFont,
} from '@/constants/*';
import { setLocale } from '@/redux/slices/localeSlice';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { useGetVendorQuery } from '@/redux/api/vendorApi';
import Image from 'next/image';
import { AppQueryResult } from '@/types/queries';
import { Vendor } from '@/types/index';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ShoppingBagOutlined } from '@mui/icons-material';
import CustomImage from '../customImage';
const ToastAppContainer = dynamic(
  () => import(`@/components/ToastAppContainer`),
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
  const { t } = useTranslation();
  const { appSetting, locale } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: vendor, isSuccess } = useGetVendorQuery<{
    data: AppQueryResult<Vendor>;
    isSuccess: boolean;
  }>();

  useEffect(() => {
    const handleRouteChange: Handler = (url, { shallow }) => {
      dispatch(hideSideMenu());
    };
    const handleChangeComplete: Handler = (url, { shallow }) => {
      if (appSetting.sideMenuOpen) {
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
      router.reload();
    };

    const handleRouteChangeError = (err: any) => {
      console.log('the error', err);
      router.replace(router.asPath);
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
      className={`${tajwalFont} flex-col justify-start items-start grow  lg:flex lg:flex-row flex flex-row h-screen  [&>*]:capitalize`}
    >
      {children}
      {/* Main Image & Logo */}
      <div
        className={`hidden lg:block flex flex-row  w-full h-screen lg:w-2/4 xl:w-2/3 fixed ${
          router.locale === 'ar' ? 'left-0' : 'right-0'
        }`}
        // style={{ height: '120vh' }}
      >
        {isSuccess && vendor.Data && (
          <div className="flex relative justify-center items-center top-0  w-full h-screen bg-gradient-to-tr from-gray-400 to-gray-800">
            <Image
              src={`${imgUrl(vendor.Data.cover)}`}
              alt={vendor.Data.name}
              className={`absolute top-0 object-cover w-full h-screen mix-blend-overlay`}
              width={imageSizes.lg}
              height={imageSizes.lg}
            />
            <div
              className={`absolute top-0 left-0 flex w-full justify-between items-center grow  z-90 text-white p-4
           `}
            >
              <div className="flex items-center gap-x-5">
                <Link scroll={false} href={appLinks.root.path}>
                  <h1 suppressHydrationWarning={suppressText}>{t('home')}</h1>
                </Link>

                <Link scroll={false} href={appLinks.root.path}>
                  <h1 suppressHydrationWarning={suppressText}>{t('search')}</h1>
                </Link>

                <Link scroll={false} href={appLinks.root.path}>
                  <h1 suppressHydrationWarning={suppressText}>
                    {t('track_order')}
                  </h1>
                </Link>
              </div>
              <div>
                <Link scroll={false} href={appLinks.root.path}>
                  <ShoppingBagOutlined />
                </Link>
              </div>
            </div>
            <div className={`text-center space-y-3 text-white`}>
              <CustomImage
                src={`${imgUrl(vendor.Data.logo)}`}
                alt={vendor.Data.name}
                className={`relative z-90 object-contain w-32 h-auto shadow-xl`}
                width={imageSizes.lg}
                height={imageSizes.lg}
              />
              <p suppressHydrationWarning={suppressText}>{vendor.Data.name}</p>
            </div>
          </div>
        )}
      </div>
      <ToastAppContainer />
    </div>
  );
};

export default MainLayout;
