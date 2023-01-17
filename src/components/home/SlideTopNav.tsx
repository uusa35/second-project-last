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
    <div
      className={`${
        offset <= 80 ? `hidden` : `flex`
      } flex flex-row  justify-start items-center w-full pb-4 pt-8 px-4 h-22 top-0  relative bg-white 
      `}
      // bg-gradient-to-tr from-gray-50 to-gray-100 lg:from-white lg:to-white
    >
      <button
        onClick={() =>
          sideMenuOpen ? dispatch(hideSideMenu()) : dispatch(showSideMenu())
        }
        className={`z-50`}
      >
        <Bars3Icon className={`w-8 h-8 text-black`} />
      </button>

      {/* logo */}
      <div className="flex w-full flex-row justify-between items-center">
        <div className={`flex flex-1`}>
          <Link
            scroll={false}
            href={appLinks.home.path}
            locale={lang}
            className="flex justify-center space-x-3  cursor-pointer px-4 py-2 text-white lg:text-black z-50"
          >
            <div className="flex sm:hidden  grow justify-center ">
              <Image
                className="h-10 w-auto"
                src={imgUrl(vendor.logo)}
                alt={`logo`}
                width={imageSizes.xs}
                height={imageSizes.xs}
              />
            </div>
            <div className="flex sm:hidden flex-1  pt-2 ">{vendor.name}</div>
          </Link>
        </div>
        <div className={`flex flex-row justify-between items-center w-20 z-50`}>
          <Link scroll={false} href={appLinks.cartIndex.path}>
            <ShoppingBagOutlined className={`w-8 h-8 text-black`} />
          </Link>
          <button
            onClick={() => handleChangeLang(otherLang)}
            className={`w-8 h-8 text-black text-2xl font-bold capitalize`}
          >
            {t(`${otherLang}`)}
          </button>
        </div>
      </div>
      {/*<Image*/}
      {/*  src={`${imgUrl(vendor.cover)}`}*/}
      {/*  alt={vendor.name}*/}
      {/*  className={`block lg:hidden  object-stretch w-full h-22  fixed left-0 right-0 top-0 mix-blend-overlay shadow-xl z-0 overflow-hidden`}*/}
      {/*  width={imageSizes.lg}*/}
      {/*  height={imageSizes.lg}*/}
      {/*/>*/}
    </div>
  );
};

export default SlideTopNav;
