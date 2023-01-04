import React, { useEffect, Suspense } from 'react';
import { ReactBurgerMenu, slide as Menu } from 'react-burger-menu';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import SideMenuSkelton from '@/components/sideMenu/SideMenuSkelton';
import Link from 'next/link';
import {
  appLinks,
  imageSizes,
  imgUrl,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';

import {
  ApartmentOutlined,
  PendingActionsOutlined,
  Close,
  PlagiarismOutlined,
  ShoppingBagOutlined,
  HomeOutlined,
} from '@mui/icons-material';
import { setLocale } from '@/redux/slices/localeSlice';
import { useGetVendorQuery } from '@/redux/api/vendorApi';
import burgerIcon from '@/appIcons/phone.svg';
import { Vendor } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import CustomImage from '@/components/customImage';

type Props = {};

const SideMenu: FC<Props> = () => {
  const { locale, appSetting, country } = useAppSelector((state) => state);

  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: vendorDetails, isSuccess: vendorDetailsSuccess } =
    useGetVendorQuery<{
      data: AppQueryResult<Vendor>;
      isSuccess: boolean;
    }>();

  useEffect(() => {
    if (vendorDetailsSuccess) console.log(vendorDetails);
  }, [vendorDetailsSuccess]);

  const handleChangeLang = async (locale: string) => {
    await dispatch(setLocale(locale));
    await router.replace(router.pathname, router.asPath, {
      locale,
      scroll: false,
    });
  };

  return (
    <Suspense fallback={<SideMenuSkelton />}>
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
          className="flex-col justify-between  bg-white h-full outline-none px-6"
        >
          <div>
            <header className="">
              <div className="flex gap-x-2 py-5">
                <div className="flex justify-center w-full">
                  <Link scroll={false} href={appLinks.root.path}>
                    <CustomImage
                      alt={`logo`}
                      src={`${imgUrl(vendorDetails.Data.logo)}`}
                      width={imageSizes.xs}
                      height={imageSizes.xs}
                      className="h-10 w-auto"
                    />
                  </Link>
                </div>

                <p
                  className="cursor-pointer"
                  id="CloseMenuBtn"
                  onClick={() => dispatch(hideSideMenu(undefined))}
                  suppressHydrationWarning={suppressText}
                >
                  <Close fontSize="small" className={`h-4 w-4`} />
                </p>
              </div>
            </header>

            <div className="flex-col  gap-y-2 my-3 ">
              <Link scroll={false} href={appLinks.root.path}>
                <div className="flex gap-x-3 pb-7 items-center">
                  <HomeOutlined className={`h-6 w-6 text-primary_BG`} />
                  <p>{t('home')}</p>
                </div>
              </Link>

              <Link scroll={false} href={appLinks.root.path}>
                <div className="flex gap-x-3 pb-7 items-center">
                  <ShoppingBagOutlined className={`h-6 w-6 text-primary_BG`} />
                  <p>{t('my_Cart')}</p>
                </div>
              </Link>

              <Link scroll={false} href={appLinks.root.path}>
                <div className="flex gap-x-3 pb-7 items-center">
                  <PlagiarismOutlined className={`h-6 w-6 text-primary_BG`} />
                  <p>{t('search')}</p>
                </div>
              </Link>

              <Link scroll={false} href={appLinks.root.path}>
                <div className="flex gap-x-3 pb-7 items-center">
                  <PendingActionsOutlined
                    className={`h-6 w-6 text-primary_BG`}
                  />
                  <p>{t('track_order')}</p>
                </div>
              </Link>

              <Link scroll={false} href={appLinks.root.path}>
                <div className="flex gap-x-3 pb-7 items-center">
                  <ApartmentOutlined className={`h-6 w-6 text-primary_BG`} />
                  <p>{t('our_branches')}</p>
                </div>
              </Link>
            </div>
          </div>
          <footer className={`w-full`}>
            <Link href={`tel: ${vendorDetails.Data.phone}`} scroll={false}>
              <div className={`${submitBtnClass} text-center`}>{t('call')}</div>
            </Link>
          </footer>
        </div>
      </Menu>
    </Suspense>
  );
};

export default SideMenu;
