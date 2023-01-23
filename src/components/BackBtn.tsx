import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { FC, Suspense } from 'react';
import { useRouter } from 'next/router';
import { isNull } from 'lodash';
import { appLinks, suppressText } from '../constants';
import Link from 'next/link';
import { ShoppingBagOutlined } from '@mui/icons-material';
import { setLocale } from '@/redux/slices/localeSlice';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { useTranslation } from 'react-i18next';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';

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
  const {
    appSetting: { currentModule },
    locale: { lang, otherLang },
    customer: { userAgent },
  } = useAppSelector((state) => state);

  const { data: cartItems, isSuccess } = useGetCartProductsQuery({
    UserAgent: userAgent,
  });
  
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleGoHome = () => {
    router.push(`/`, ``, {
      scroll: false,
    });
  };

  const handleChangeLang = async (locale: string) => {
    if (locale !== router.locale) {
      await router
        .push(router.pathname, router.asPath, {
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
        )
        .then(() => dispatch(setLocale(locale)));
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
          onClick={() =>
            backHome
              ? handleGoHome()
              : !isNull(backRoute)
              ? router.push(`${backRoute}`, undefined, {
                  locale: lang,
                  scroll: false,
                })
              : router.back()
          }
          className={`flex justify-start items-center pt-1 w-20`}
        >
          {router.locale === 'en' ? (
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
          >
            {currentModule}
          </span>
        </div>
        <div className={`flex flex-row justify-between items-center w-20 z-50`}>
          <Link
            scroll={false}
            href={appLinks.cartIndex.path}
            className={`relative`}
          >
            <ShoppingBagOutlined className={`w-8 h-8 text-black`} />
            {isSuccess &&
              cartItems.data?.total > 0 &&
              cartItems.data?.Cart?.length > 0 && (
                <div className="absolute -left-2 -top-2 opacity-90  rounded-full bg-red-600 w-6 h-6 top-0 shadow-xl flex items-center justify-center text-white">
                  <span className={`pt-[3.5px] shadow-md`}>
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
