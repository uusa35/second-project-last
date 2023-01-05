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

type Props = {
  offset: number;
};

const SlideTopNav: FC<Props> = ({ offset }): JSX.Element => {
  const { t } = useTranslation();
  const {
    vendor,
    appSetting: { sideMenuOpen },
    locale: { lang, otherLang },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChangeLang = async (locale: string) => {
    if (locale !== router.locale) {
      await dispatch(setLocale(locale));
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
        );
    }
  };

  return (
    <div
      className={`${
        offset < 80 ? `hidden` : `block`
      } flex flex-row  justify-start items-center w-full py-8 px-4 h-24 mb-8 lg:mb-0 top-0 
      bg-cover bg-top bg-gradient-to-tr from-gray-400 to-gray-800 lg:from-white lg:to-white lg
      `}
    >
      <button
        onClick={() =>
          sideMenuOpen ? dispatch(hideSideMenu()) : dispatch(showSideMenu())
        }
        className={`ltr:ml-3 rtl:mr-3 z-50`}
      >
        <Bars3Icon className={`w-8 h-8 text-black`} />
      </button>

      {/* logo */}
      <div className="flex w-full flex-row justify-between items-center ">
        <div className={`flex flex-1`}>
          <Link
            scroll={false}
            href={appLinks.home.path}
            locale={lang}
            className="flex justify-center space-x-3  cursor-pointer p-4 text-white lg:text-black z-50"
          >
            <div className="flex grow justify-center ">
              <Image
                className="h-16 w-auto ltr:mr-6 rtl:ml-6"
                src={imgUrl(vendor.logo)}
                alt={`logo`}
                width={imageSizes.xs}
                height={imageSizes.xs}
              />
            </div>
            <div className="flex flex-1  pt-2 ">{vendor.name}</div>
          </Link>
          <Image
            src={`${imgUrl(vendor.cover)}`}
            alt={vendor.name}
            className={`object-cover w-full h-24 absolute top-0 left-0 mix-blend-overlay shadow-xl lg:hidden z-0`}
            width={imageSizes.lg}
            height={imageSizes.lg}
          />
        </div>

        <div className={`flex flex-row justify-between items-center w-16 z-50`}>
          <Link scroll={false} href={appLinks.cartIndex.path}>
            <ShoppingBagOutlined />
          </Link>
          <button
            onClick={() => handleChangeLang(otherLang)}
            className={`text-lg font-bold capitalize`}
          >
            {t(`${otherLang}`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlideTopNav;
