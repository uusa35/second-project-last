import React, { Suspense } from 'react';
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
import CustomImage from '@/components/CustomImage';
import { isEmpty } from 'lodash';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  BuildingStorefrontIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

type Props = {};

const SideMenu: FC<Props> = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    appSetting,
    vendor,
    branch: { id: branchId },
  } = useAppSelector((state) => state);

  const handleChangeLang = async (locale: string) => {
    await dispatch(setLocale(locale));
    await router.replace(router.pathname, router.asPath, {
      locale,
      scroll: false,
    });
  };

  return (
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      <Menu
        right={router.locale === 'ar'}
        isOpen={appSetting.sideMenuOpen}
        className="w-full bg-white"
        itemListClassName="overflow-auto"
        customBurgerIcon={false}
        customCrossIcon={false}
      >
        {!isEmpty(vendor) && (
          <div
            style={{ display: 'flex' }}
            className="flex-col justify-between  bg-white h-full outline-none px-6"
          >
            <div>
              <header className="">
                <div className="flex gap-x-2 py-5">
                  <div className="flex justify-center w-full my-8">
                    <Link scroll={false} href={appLinks.root.path}>
                      <CustomImage
                        alt={`logo`}
                        src={`${imgUrl(vendor.logo)}`}
                        width={imageSizes.xs}
                        height={imageSizes.xs}
                        className="h-20 w-auto shadow-md rounded-md"
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
                    <HomeOutlined className={`h-8 w-8 text-primary_BG`} />
                    <p suppressHydrationWarning={suppressText}>{t('home')}</p>
                  </div>
                </Link>

                <Link scroll={false} href={appLinks.cartIndex.path}>
                  <div className="flex gap-x-3 pb-7 items-center">
                    <ShoppingBagOutlined
                      className={`h-8 w-8 text-primary_BG`}
                    />
                    <p suppressHydrationWarning={suppressText}>
                      {t('my_cart')}
                    </p>
                  </div>
                </Link>

                <Link scroll={false} href={appLinks.cartSelectMethod.path}>
                  <div className="flex gap-x-3 pb-7 items-center">
                    <MapPinIcon className={`h-8 w-8 text-primary_BG`} />
                    <p suppressHydrationWarning={suppressText}>
                      {t('change_delivery_area')}
                    </p>
                  </div>
                </Link>

                <Link
                  scroll={false}
                  href={appLinks.productSearchIndex(branchId)}
                >
                  <div className="flex gap-x-3 pb-7 items-center">
                    <PlagiarismOutlined className={`h-8 w-8 text-primary_BG`} />
                    <p suppressHydrationWarning={suppressText}>{t('search')}</p>
                  </div>
                </Link>

                <Link scroll={false} href={appLinks.trackOrder.path}>
                  <div className="flex gap-x-3 pb-7 items-center">
                    <PendingActionsOutlined
                      className={`h-8 w-8 text-primary_BG`}
                    />
                    <p suppressHydrationWarning={suppressText}>
                      {t('track_order')}
                    </p>
                  </div>
                </Link>

                <Link scroll={false} href={appLinks.branchIndex.path}>
                  <div className="flex gap-x-3 pb-7 items-center">
                    <BuildingStorefrontIcon
                      className={`h-8 w-8 text-primary_BG`}
                    />
                    <p suppressHydrationWarning={suppressText}>
                      {t('our_branches')}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <footer className={`w-full`}>
              <Link href={`tel: ${vendor.phone}`} scroll={false}>
                <p
                  className={`${submitBtnClass} text-center`}
                  suppressHydrationWarning={suppressText}
                >
                  {t('call')}
                </p>
              </Link>
            </footer>
          </div>
        )}
      </Menu>
    </Suspense>
  );
};

export default SideMenu;
