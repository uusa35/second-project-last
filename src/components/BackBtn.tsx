import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { FC, Suspense, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';
import { appLinks, setLang, suppressText } from '../constants';
import Link from 'next/link';
import { ShoppingBagOutlined } from '@mui/icons-material';
import { setLocale } from '@/redux/slices/localeSlice';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { useTranslation } from 'react-i18next';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  backHome: boolean;
  backRoute?: string | null;
  offset: number;
};

const BackBtn: FC<Props> = ({
  backHome,
  backRoute = null,
  offset,
}): JSX.Element => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    appSetting: { currentModule, url, previousUrl, method },
    branch,
    area,
    locale: { lang, otherLang },
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const { data: cartItems, isSuccess } = useGetCartProductsQuery({
    UserAgent: userAgent,
    area_branch:
      method === `pickup`
        ? { 'x-branch-id': branch.id }
        : { 'x-area-id': area.id },
    url,
  });

  const handleGoHome = () => {
    router.push(`/`, ``, {
      locale: lang,
      scroll: false,
    });
  };

  const handleChangeLang = async (locale: string) => {
    if (locale !== router.locale) {
      dispatch(setLocale(locale));
      await setLang(locale);
      await router
        .replace(router.pathname, router.asPath, {
          locale,
          scroll: false,
        })
        .then(() =>
          dispatch(
            showToastMessage({
              content: `language_changed_successfully`,
              type: `info`,
            })
          )
        );
    }
  };

  const handleBack = async () => {
    if (backHome) {
      handleGoHome();
    } else if (!isNull(backRoute)) {
      router.push(`${backRoute}`, undefined, {
        locale: lang,
        scroll: false,
      });
    } else {
      // if (document.referrer.includes('ar') && lang === 'en') {
      //   console.log('case 1', document.referrer.replace('ar/', ''));
      // const prevUrl = document.referrer.replace('ar/', '');
      // await setLang(lang).then(() => {
      //   return router.push(prevUrl, ``, { locale: lang });
      // });
      // } else if (!document.referrer.includes('ar') && lang === 'ar') {
      //   console.log('case 2 ===>', window.document.referrer);
      //   await setLang('ar').then(() => {
      // router.back();
      // });
      // } else {
      //   console.log('else', lang);
      //   await setLang('en').then(() => {
      // router.back();
      // });
      // }
      await setLang(lang).then(() => {
        router.back();
      });
    }
  };

  return (
    <Suspense>
      <div
        className={`${
          offset < 80 ? `block` : `hidden`
        } flex w-full my-3 justify-center items-center rounded-md py-4 px-4`}
      >
        <button
          onClick={() => handleBack()}
          className={`flex justify-start items-center pt-1 w-20`}
        >
          {router.locale === 'en' ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 grayscale"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
        </button>
        <div className={`flex flex-1 justify-center items-center pt-1`}>
          <span
            className={`text-md capitalize truncate overflow-hidden max-w-md`}
            suppressHydrationWarning={suppressText}
            style={{ color, maxWidth: '30ch', textOverflow: 'truncate' }}
          >
            {t(currentModule)}
          </span>
        </div>
        <div className={`flex flex-row justify-between items-center w-20 z-50`}>
          <Link
            scroll={true}
            href={appLinks.cartIndex.path}
            className={`relative`}
            data-cy="shopping-cart"
          >
            <ShoppingBagOutlined
              className={`w-8 h-8 text-black drop-shadow-sm`}
            />
            {isSuccess &&
              cartItems.data &&
              cartItems.data.subTotal &&
              parseFloat(cartItems.data.subTotal.toString()) > 0 &&
              cartItems.data?.Cart?.length > 0 && (
                <div className="absolute -left-2 -top-2 opacity-90  rounded-full bg-red-600 w-5 h-5 top-0 shadow-xl flex items-center justify-center text-white">
                  <span className={`pt-[2.5px] shadow-md`}>
                    {cartItems.data?.Cart?.length}
                  </span>
                </div>
              )}
          </Link>
          <button
            onClick={() => handleChangeLang(otherLang)}
            className={`w-8 h-8 text-black text-2xl font-bold capitalize`}
          >
            {t(`${otherLang}`)}
          </button>
        </div>
      </div>
    </Suspense>
  );
};

export default BackBtn;
