import React, { Suspense, useEffect } from 'react';
import { ReactBurgerMenu, slide as Menu } from 'react-burger-menu';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import SideMenuSkelton from '@/components/sideMenu/SideMenuSkelton';
import Link from 'next/link';
import {
  appLinks,
  convertColor,
  imageSizes,
  imgUrl,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { hideSideMenu } from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
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
import { isEmpty, isNull } from 'lodash';
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
  const color = useAppSelector(themeColor);

  useEffect(() => {}, [vendor]);

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
        {!isEmpty(vendor) && !isNull(vendor.id) && (
          <div
            style={{ display: 'flex' }}
            className="flex-col justify-between  bg-white h-full outline-none px-6 capitalize"
          >
            <div>
              <header className="">
                <div className="flex gap-x-2 py-5">
                  <div className="flex justify-center w-full my-8">
                    <Link scroll={true} href={appLinks.root.path}>
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
                    className="cursor-pointer capitalize"
                    id="CloseMenuBtn"
                    onClick={() => dispatch(hideSideMenu(undefined))}
                    suppressHydrationWarning={suppressText}
                  >
                    <Close fontSize="small" className={`h-4 w-4`} />
                  </p>
                </div>
              </header>

              <div className="flex-col  gap-y-2 my-3">
                <Link scroll={true} href={appLinks.root.path}>
                  <div className="flex gap-x-3 pb-7 items-center ps-1">
                    <HomeOutlined className={`h-8 w-8`} style={{ color }} />
                    <p
                      suppressHydrationWarning={suppressText}
                      className="capitalize"
                    >
                      {t('home')}
                    </p>
                  </div>
                </Link>

                <Link scroll={true} href={appLinks.cartIndex.path}>
                  <div className="flex gap-x-3 pb-7 items-center ps-1">
                    <ShoppingBagOutlined
                      className={`h-8 w-8`}
                      style={{ color }}
                    />
                    <p
                      suppressHydrationWarning={suppressText}
                      className="capitalize"
                    >
                      {t('my_cart')}
                    </p>
                  </div>
                </Link>

                <Link
                  scroll={true}
                  href={appLinks.cartSelectMethod(appSetting.method)}
                >
                  <div className="flex gap-x-3 pb-7 items-center">
                    <MapPinIcon className={`h-6 w-8`} style={{ color }} />
                    <p
                      suppressHydrationWarning={suppressText}
                      className="capitalize"
                    >
                      {t('change_delivery_area')}
                    </p>
                  </div>
                </Link>

                <Link
                  scroll={true}
                  href={appLinks.productSearchIndex('', branchId ?? ``, '')}
                >
                  <div className="flex gap-x-3 pb-7 items-center ps-1">
                    <PlagiarismOutlined
                      className={`h-8 w-8`}
                      style={{ color }}
                    />
                    <p
                      suppressHydrationWarning={suppressText}
                      className="capitalize"
                    >
                      {t('search')}
                    </p>
                  </div>
                </Link>

                <Link scroll={true} href={appLinks.trackOrder.path}>
                  <div className="flex gap-x-3 pb-7 items-center ps-1">
                    <PendingActionsOutlined
                      className={`h-8 w-8`}
                      style={{ color }}
                    />
                    <p
                      suppressHydrationWarning={suppressText}
                      className="capitalize"
                    >
                      {t('track_order')}
                    </p>
                  </div>
                </Link>

                <Link scroll={true} href={appLinks.branchIndex.path}>
                  <div className="flex gap-x-3 pb-7 items-center ps-1">
                    <BuildingStorefrontIcon
                      className={`h-6 w-6`}
                      style={{ color }}
                    />
                    <p
                      suppressHydrationWarning={suppressText}
                      className="capitalize"
                    >
                      {t('our_branches')}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <footer className={`w-full`}>
              <a href={`tel:+${vendor.phone}`}>
                <p
                  className={`${submitBtnClass} text-center capitalize`}
                  suppressHydrationWarning={suppressText}
                  style={{ backgroundColor: convertColor(color, 100) }}
                >
                  {t('call')}
                </p>
              </a>
              <div
                className={`relative bottom-0 flex justify-center items-center mt-1`}
                suppressHydrationWarning={suppressText}
              >
                <p
                  className={`text-stone-200 text-center capitalize`}
                  suppressHydrationWarning={suppressText}
                >
                  v. {process.env.NEXT_PUBLIC_APP_VERSION}
                </p>
              </div>
            </footer>
          </div>
        )}
      </Menu>
    </Suspense>
  );
};

export default SideMenu;
