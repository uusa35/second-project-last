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
import CustomImage from '@/components/CustomImage';
import TextTrans from '@/components/TextTrans';

type Props = {
  offset: number;
  isHome: boolean;
};

const SlideTopNav: FC<Props> = ({ offset, isHome = false }): JSX.Element => {
  const { t } = useTranslation();
  const {
    vendor,
    appSetting: { sideMenuOpen },
    customer: { userAgent },
    locale: { lang, otherLang },
  } = useAppSelector((state) => state);
  const { data: cartItems, isSuccess } = useGetCartProductsQuery({
    UserAgent: userAgent,
  });
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChangeLang = async (locale: string) => {
    if (locale !== router.locale) {
      await router
        .push(router.pathname, router.asPath, {
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
              offset <= 80 ? `bg-transparent text-white` : `bg-white text-black`
            }`
      } flex flex-row  justify-start items-center w-full pb-4 pt-8 px-4 h-28 top-0  relative lg:text-black lg:bg-white
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
        <div className={`flex flex-1 justify-center`}>
          <Link
            scroll={true}
            href={appLinks.home.path}
            locale={lang}
            className="flex justify-center space-x-3  cursor-pointer px-4 py-2 "
          >
            <div className="flex xl:hidden  grow justify-center ">
              <Image
                className="h-auto w-12 xl:w-auto"
                src={imgUrl(vendor.logo)}
                alt={`logo`}
                width={imageSizes.xs}
                height={imageSizes.xs}
              />
            </div>
            <div className="hidden sm:flex flex-1  pt-2 rtl:pr-2 ltr:pl-2 drop-shadow-sm">
              <TextTrans ar={vendor.name_ar} en={vendor.name_en} />
            </div>
          </Link>
        </div>
        <div className={`flex flex-row justify-between items-center w-20`}>
          <Link
            scroll={true}
            href={appLinks.cartIndex.path}
            className={`relative`}
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
