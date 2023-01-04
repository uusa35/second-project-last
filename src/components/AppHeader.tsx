import { FC, Suspense } from 'react';
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
import SideMenuSkelton from '@/components/sideMenu/SideMenuSkelton';
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
    <Suspense fallback={<SideMenuSkelton />}>
      <header
        className={`flex flex-row justify-start items-center w-full relative bg-cover bg-top
      bg-gradient-to-tr from-gray-400 to-gray-800 lg:from-white lg:to-white
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
        {/* <Link
          scroll={false}
          href={appLinks.home.path}
          locale={locale.lang}
          className="flex justify-center space-x-3  cursor-pointer p-4 z-50 text-white lg:text-black"
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
        <Image
          src={`${imgUrl(vendor.Data.cover)}`}
          alt={vendor.Data.name}
          className={`object-cover w-full h-full absolute top-0 left-0 mix-blend-overlay lg:hidden`}
          width={imageSizes.lg}
          height={imageSizes.lg}
        /> */}
      </header>
    </Suspense>
  );
};

export default AppHeader;
