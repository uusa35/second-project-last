import React, { FC, Suspense } from 'react';
import Image from 'next/image';
import { appLinks, imageSizes, imgUrl, suppressText } from '@/constants/*';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import { Vendor } from '@/types/index';
import { useTranslation } from 'react-i18next';
import { setLocale } from '@/redux/slices/localeSlice';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HomeIcon } from '@heroicons/react/24/outline';
import TrackOrderIcon from '@/appIcons/my_orders.svg';

type Props = {
  element: Vendor;
};
const MainAsideLayout: FC<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    locale: { otherLang },
    branch: { id: branchId },
  } = useAppSelector((state) => state);

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
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      <div
        className={`hidden lg:block flex flex-row  w-full h-screen lg:w-2/4 xl:w-2/3 fixed ${
          router.locale === 'ar' ? 'left-0' : 'right-0'
        }`}
      >
        <div className="flex relative justify-center items-center top-0  w-full h-screen bg-gradient-to-tr from-gray-400 to-gray-800">
          <Image
            src={`${imgUrl(element.cover)}`}
            alt={element.name}
            className={`absolute top-0 object-cover w-full h-screen mix-blend-overlay`}
            width={imageSizes.lg}
            height={imageSizes.lg}
          />
          <div
            className={`absolute top-0 left-0 flex w-full justify-between items-center grow  z-90 text-white p-4
           `}
          >
            <div className="flex items-center gap-x-5"></div>
            <div
              className={`flex flex-col justify-start items-start w-1/3 xl:w-1/4 gap-3 mt-8`}
            >
              <Link
                scroll={false}
                href={appLinks.home.path}
                className={`flex flex-row p-1 px-4 justify-between items-center rounded-lg bg-white bg-opacity-90 text-black`}
              >
                <HomeIcon className={`w-6 h-6 rtl:ml-2 ltr:mr-2`} />
                <p suppressHydrationWarning={suppressText} className={`mt-2`}>
                  {t('home')}
                </p>
              </Link>
              <Link
                scroll={false}
                href={appLinks.trackOrder.path}
                className={`flex flex-row p-1 px-4 justify-between items-center rounded-lg bg-white bg-opacity-90 text-black`}
              >
                <Image
                  src={TrackOrderIcon}
                  width={25}
                  height={25}
                  alt={t('track_order')}
                  className={`w-6 h-6 rtl:ml-2 ltr:mr-2 text-black`}
                />
                <p suppressHydrationWarning={suppressText} className={`mt-2`}>
                  {t('track_order')}
                </p>
              </Link>
            </div>
          </div>
          <div className={`text-center space-y-3 text-white`}>
            <CustomImage
              src={`${imgUrl(element.logo)}`}
              alt={element.name}
              className={`relative object-contain w-32 h-auto shadow-xl`}
              width={imageSizes.lg}
              height={imageSizes.lg}
            />
            <p suppressHydrationWarning={suppressText}>{element.name}</p>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default MainAsideLayout;
