import React, { FC, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { imageSizes, submitBtnClass, suppressText, convertColor } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { isNull } from 'lodash';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useAppSelector } from '@/redux/hooks';

type Props = {
  message: string;
  img?: string;
};
const OffLineWidget: FC<Props> = ({ message, img = null }): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor); 
  return (
    <Suspense>
      <div
        className={`flex w-full flex-col justify-center items-center space-y-10 mt-10 px-4`}
      >
        {!isNull(img) ? (
          <Image
            className="h-90 w-full rounded-lg shadow-lg"
            alt="offline"
            fill={false}
            width={imageSizes.lg}
            height={imageSizes.lg}
            src={img}
          />
        ) : (
          <Image
            className="h-90 w-90"
            alt="offline"
            fill={false}
            width={imageSizes.xs}
            height={imageSizes.xs}
            src={require('@/appImages/offline.webp')}
          />
        )}
        <p
          className={`text-lg text-center whitespace-wrap break-words w-full`}
          suppressHydrationWarning={suppressText}
        >
          {/* {message} */}
          {t(message)}
        </p>
        <Link
          scroll={true}
          href={'/'}
          className={`${submitBtnClass} text-center text-md capitalize`}
          suppressHydrationWarning={suppressText}
          style={{ backgroundColor: convertColor(color, 100) }}
        >
          {t('back_to_home')}
        </Link>
      </div>
    </Suspense>
  );
};

export default OffLineWidget;
