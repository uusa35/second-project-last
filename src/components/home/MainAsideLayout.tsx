import React, { FC, Suspense } from 'react';
import { appLinks, imageSizes, imgUrl, suppressText } from '@/constants/*';
import Link from 'next/link';
import CustomImage from '@/components/CustomImage';
import { useRouter } from 'next/router';
import { Vendor } from '@/types/index';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  ClipboardDocumentCheckIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import TextTrans from '@/components/TextTrans';

type Props = {
  element: Vendor;
};
const MainAsideLayout: FC<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      <div
        className={`hidden lg:block flex flex-row  w-full h-screen lg:w-2/4 xl:w-2/3 fixed ${
          router.locale === 'ar' ? 'left-0' : 'right-0'
        }`}
      >
        <div className="flex relative justify-center items-center top-0  w-full h-screen bg-gradient-to-tr from-gray-400 to-gray-800">
          <CustomImage
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
                className={`flex flex-row p-1 px-4 justify-between items-center rounded-lg bg-white bg-opacity-90 text-black capitalize`}
                suppressHydrationWarning={suppressText}
              >
                <HomeIcon className={`w-6 h-6 rtl:ml-2 ltr:mr-2`} />
                <p suppressHydrationWarning={suppressText} className={`mt-2 capitalize`}>
                  {t('home')}
                </p>
              </Link>
              <Link
                scroll={false}
                href={appLinks.trackOrder.path}
                className={`flex flex-row p-1 px-4 justify-between items-center rounded-lg bg-white bg-opacity-90 text-black capitalize`}
                suppressHydrationWarning={suppressText}
              >
                <ClipboardDocumentCheckIcon
                  className={`w-7 h-7 rtl:ml-2 ltr:mr-2 text-stone-700`}
                />
                <p suppressHydrationWarning={suppressText} className={`mt-2 capitalize`}>
                  {t('track_order')}
                </p>
              </Link>
            </div>
          </div>
          <div className={`text-center space-y-3 text-white`}>
            <CustomImage
              src={`${imgUrl(element.logo)}`}
              alt={element.name}
              className={`relative object-contain w-32 h-auto shadow-xl rounded-md`}
              width={imageSizes.lg}
              height={imageSizes.lg}
            />
            <TextTrans ar={element.name_ar} en={element.name_en} className='capitalize' />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default MainAsideLayout;
