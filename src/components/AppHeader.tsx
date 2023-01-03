import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Link from 'next/link';
import { appLinks, imageSizes, imgUrl } from '@/constants/*';
import logo from '@/appIcons/phone.svg';
import burgerIcon from '@/appIcons/phone.svg';
import Image from 'next/image';
import { hideSideMenu, showSideMenu } from '@/redux/slices/appSettingSlice';
import { isAuthenticated } from '@/redux/slices/authSlice';
import dynamic from 'next/dynamic';
import { Bars3Icon } from '@heroicons/react/24/solid';
import { useGetVendorQuery } from '@/redux/api/vendorApi';
import { AppQueryResult } from '@/types/queries';
import { Vendor } from '@/types/index';
import LoadingSpinner from '@/components/LoadingSpinner';
const SideMenu = dynamic(() => import(`@/components/sideMenu`), {
  ssr: false,
});

const AppHeader: FC = () => {
  const {
    locale: { lang },
    appSetting: { sideMenuOpen },
    country: {
      id: country_id,
      name: country_name,
      name_ar: country_name_ar,
      currency: country_currency,
    },
    auth: {
      user: { avatar, name, id: user_id },
    },
    cart: { tempId, currentMode },
  } = useAppSelector((state) => state);
  const isAuth = useAppSelector(isAuthenticated);
  const { locale } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { data: vendor, isSuccess } = useGetVendorQuery<{
    data: AppQueryResult<Vendor>;
    isSuccess: boolean;
  }>();

  if (!isSuccess) {
    return <LoadingSpinner />;
  }

  return (
    <header
      className={`flex flex-row justify-start items-center w-full relative bg-cover bg-top
      bg-gradient-to-tr from-gray-400 to-gray-800 lg:from-white lg:to-white
      `}
    >
      <Image
        src={`${imgUrl(vendor.Data.cover)}`}
        alt={vendor.Data.name}
        className={`object-cover w-full h-full absolute top-0 left-0 mix-blend-overlay lg:hidden`}
        width={imageSizes.lg}
        height={imageSizes.lg}
      />
      <button
        onClick={() =>
          sideMenuOpen
            ? dispatch(hideSideMenu(undefined))
            : dispatch(showSideMenu(undefined))
        }
        className={`ltr:ml-3 rtl:mr-3`}
      >
        <Bars3Icon className={`w-8 h-8 text-black`} />
      </button>
      {/* logo */}
      <Link
        scroll={false}
        href={{
          pathname: `${appLinks.home.path}`,
          query: {
            country_id,
            country_name,
            country_name_ar,
            country_currency,
          },
        }}
        locale={locale.lang}
        className="flex justify-center space-x-3  cursor-pointer p-4"
      >
        <div className="flex flex-1 justify-center ">
          <Image
            className="h-16 w-auto"
            src={imgUrl(vendor.Data.logo)}
            alt={`logo`}
            width={imageSizes.xs}
            height={imageSizes.xs}
          />
        </div>
        <div className="flex flex-1 justify-center ">{vendor.Data.name}</div>
      </Link>
      <div className="flex justify-end items-center gap-x-5">
        {isAuth && avatar && (
          <Link
            scroll={false}
            href={`${appLinks.account.path}`}
            className={`rounded-full w-10 h-10 w-full shadow-lg border border-gray-400`}
          >
            <Image
              src={avatar}
              width={imageSizes.xs}
              height={imageSizes.xs}
              className={`w-10 w-10 rounded-full object-cover `}
              alt={name}
            />
          </Link>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
