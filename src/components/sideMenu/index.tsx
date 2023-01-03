import React from 'react';
import { ReactBurgerMenu, slide as Menu } from 'react-burger-menu';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import SideMenueSkelton from './SideMenueSkelton';
import Link from 'next/link';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
import Image from 'next/image';
import logo from '@/appIcons/phone.svg';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import CloseIcon from '@mui/icons-material/Close';
import homeIcon from '@/appIcons/phone.svg';
import orderIcon from '@/appIcons/order_history.svg';
import accountIcon from '@/appIcons/account.svg';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import { isAuthenticated, isVerified, logout } from '@/redux/slices/authSlice';
import logoutIcon from '@/appIcons/phone.svg';
import rightBlueIcon from '@/appIcons/phone.svg';
import { setLocale } from '@/redux/slices/localeSlice';
import burgerIcon from '@/appIcons/phone.svg';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/20/solid';

type Props = {};

const SideMenu: FC<Props> = () => {
  const { locale, appSetting, country } = useAppSelector((state) => state);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(isAuthenticated);
  const verified = useAppSelector(isVerified);
  const router = useRouter();

  const handleChangeLang = async (locale: string) => {
    await dispatch(setLocale(locale));
    await router.replace(router.pathname, router.asPath, {
      locale,
      scroll: false,
    });
  };

  const handleLogout = async () => {
    await dispatch(logout());
  };

  const handleGoHome = () => {
    router.push(`/`, ``, {
      scroll: false,
    });
  };

  return (
    <Menu
      right={router.locale === 'ar'}
      isOpen={appSetting.sideMenuOpen}
      className="w-full bg-white"
      itemListClassName="overflow-auto"
      customBurgerIcon={false}
      customCrossIcon={false}
    >
      <div
        style={{ display: 'flex' }}
        className="flex-col justify-between  bg-white h-full outline-none"
      >
        <div>
          <header className="px-6">
            <div className="flex gap-x-2 py-5">
              <button
                onClick={() => handleGoHome()}
                className="w-full flex justify-center items-start"
              >
                <Image
                  alt={`logo`}
                  width={imageSizes.xs}
                  height={imageSizes.xs}
                  className="h-10 w-auto"
                  src={logo}
                />
              </button>
              <p
                className="cursor-pointer"
                id="CloseMenuBtn"
                onClick={() => dispatch(hideSideMenu(undefined))}
                suppressHydrationWarning={suppressText}
              >
                <CloseIcon fontSize="small" className={`h-4 w-4`} />
              </p>
            </div>
          </header>

          <div className="my-3 px-6">
            <>
              <div className="flex pb-7 items-center cursor-pointer">
                <Link scroll={false} href={appLinks.root.path}>
                  <HomeIcon className={`h-6 w-6`} />
                </Link>
                <div className="ltr:pl-5 rtl:pr-5 pt-1">
                  <button
                    onClick={() => handleGoHome()}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('home')}
                  </button>
                </div>
              </div>

              <Link
                scroll={false}
                href={`${
                  isAuth && verified
                    ? appLinks.order.path
                    : isAuth
                    ? `#`
                    : appLinks.login.path
                }`}
              >
                <div className="flex pb-7 items-center cursor-pointer">
                  <div>
                    <HomeIcon className={`h-6 w-6 text-gray-500`} />
                  </div>
                  <div className="ltr:pl-5 rtl:pr-5">
                    <span suppressHydrationWarning={suppressText}>
                      {t('order_history')}
                    </span>
                  </div>
                </div>
              </Link>
              <Link
                scroll={false}
                href={`${isAuth ? appLinks.account.path : appLinks.login.path}`}
              >
                <div className="flex pb-7 items-center cursor-pointer">
                  <div>
                    <HomeIcon className={`h-6 w-6 text-gray-500`} />
                  </div>
                  <div className="ltr:pl-5 rtl:pr-5">
                    <span suppressHydrationWarning={suppressText}>
                      {t('account_settings')}
                    </span>
                  </div>
                </div>
              </Link>
              <Link scroll={false} href={appLinks.about.path}>
                <div className="flex pb-7 items-center cursor-pointer">
                  <div>
                    <InfoOutlinedIcon
                      sx={{ color: '#189EC9' }}
                      width="20.111"
                      height="20.111"
                    />
                  </div>
                  <div className="ltr:pl-5 rtl:pr-5">
                    <span suppressHydrationWarning={suppressText}>
                      {t('about_us')}
                    </span>
                  </div>
                </div>
              </Link>
              <Link scroll={false} href={appLinks.terms.path}>
                <div className="flex pb-7 items-center cursor-pointer">
                  <div>
                    <StickyNote2OutlinedIcon
                      sx={{ color: '#189EC9' }}
                      width="20.111"
                      height="20.111"
                    />
                  </div>
                  <div className="ltr:pl-5 rtl:pr-5">
                    <span suppressHydrationWarning={suppressText}>
                      {t('terms_and_conditions')}
                    </span>
                  </div>
                </div>
              </Link>
            </>
          </div>
          <footer className={`w-full`}>
            <div className="flex w-full flex-col bg-gray-100 rounded-t-xl px-6 py-5 h-full">
              {isAuth ? (
                <div
                  onClick={() => handleLogout()}
                  className="flex items-center mb-5 cursor-pointer"
                >
                  <div>
                    <Image
                      src={logoutIcon}
                      width={imageSizes.xs}
                      height={imageSizes.xs}
                      alt={`logout`}
                      className={`h-6 h-6`}
                    />
                  </div>
                  <p
                    className="mx-2 text-primary_BG"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('logout')}
                  </p>
                </div>
              ) : (
                <div className="flex justify-between  mb-5 " id="Logged Out">
                  <Link
                    scroll={false}
                    href={appLinks.login.path}
                    className="flex justify-between items-center  w-full cursor-pointer"
                  >
                    <div className="flex-grow text-primary_BG">
                      <span suppressHydrationWarning={suppressText}>
                        {t('log_in')}
                      </span>
                    </div>
                    <div>
                      <Image
                        src={rightBlueIcon}
                        width={imageSizes.xs}
                        height={imageSizes.xs}
                        alt={`login`}
                        className={`${locale.isRTL && `rotate-180`} h-4 w-4`}
                      />
                    </div>
                  </Link>
                </div>
              )}

              <div className="bg-primary_BG text-white rounded-lg flex justify-center items-center w-1/3">
                <button
                  onClick={() => handleChangeLang('ar')}
                  className={`rtl:bg-DarkBlue ltr:bg-transparent py-1 rounded-lg  text-center w-1/2`}
                >
                  ع
                </button>
                <button
                  onClick={() => handleChangeLang('en')}
                  className={`ltr:bg-DarkBlue ltr:py-1 rtl:bg-transparent rtl:py-0 rounded-lg  text-center w-1/2 pt-1`}
                >
                  EN
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </Menu>
  );
};

export default SideMenu;
