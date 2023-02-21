import {
  hideSideMenu,
  showSideMenu,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { Bars3Icon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { appLinks, imageSizes, imgUrl } from '@/constants/*';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { ShoppingBagOutlined } from '@mui/icons-material';
import { setLocale } from '@/redux/slices/localeSlice';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';

type Props = {
  offset: number;
  isHome: boolean;
};

const SlideTopNav: FC<Props> = ({ offset, isHome = false }): JSX.Element => {
  const { t } = useTranslation();
  const {
    vendor,
    appSetting: { sideMenuOpen, url, method },
    area,
    branch,
    customer: { userAgent },
    locale: { lang, otherLang },
  } = useAppSelector((state) => state);
  const { data: cartItems, isSuccess } = useGetCartProductsQuery({
    UserAgent: userAgent,
    area_branch:
      method === `pickup`
        ? { 'x-branch-id': branch.id }
        : { 'x-area-id': area.id },
    url,
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChangeLang = async (locale: string) => {
    if (locale !== router.locale) {
      await router
        .replace(router.pathname, router.asPath, {
          locale,
          scroll: false,
        })
        .then(() => dispatch(setLocale(locale)))
        .then(() => {
          dispatch(
            showToastMessage({
              content: `language_changed_successfully`,
              type: `info`,
            })
          );
        });
    }
  };

  return (
    <div
      className={`${
        offset <= (isHome ? -1 : 80)
          ? `hidden `
          : `flex transition-opacity duration-3000 ${
              offset <= 80 ? `bg-transparent text-black` : `bg-white text-black`
            }`
      } flex flex-row  justify-center items-center w-full  px-4 h-20 top-0  relative lg:text-black lg:bg-white
      `}
    >
      <button
        onClick={() =>
          sideMenuOpen ? dispatch(hideSideMenu()) : dispatch(showSideMenu())
        }
        className={`z-50`}
      >
        <Bars3Icon className={`w-8 h-8 drop-shadow-sm`} />
      </button>
      {/* logo */}
      <div className="flex w-full flex-row justify-between items-center">
        <Link
          scroll={true}
          href={appLinks.home.path}
          locale={lang}
          className="flex flex-1 w-full justify-center cursor-pointer "
        >
          <div
            className={`flex grow justify-center ltr:ml-10 rtl:mr-10 ${
              offset <= 80 ? 'hidden' : 'block'
            }`}
          >
            <Image
              className="h-auto w-12 xl:w-auto xl:h-16"
              src={`${imgUrl(vendor.logo)}`}
              alt={`logo`}
              width={imageSizes.xs}
              height={imageSizes.xs}
            />
          </div>
        </Link>

        <div className={`flex flex-row justify-between items-center w-20`}>
          <Link
            scroll={true}
            href={appLinks.cartIndex.path}
            className={`relative`}
            data-cy="shopping-cart"
          >
            <ShoppingBagOutlined className={`w-8 h-8 drop-shadow-sm`} />
            {isSuccess &&
              cartItems.data &&
              cartItems.data.subTotal > 0 &&
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
            className={`w-8 h-8  text-2xl font-bold capitalize drop-shadow-sm`}
          >
            {t(`${otherLang}`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideTopNav;
