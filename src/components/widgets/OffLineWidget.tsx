import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { imageSizes, submitBtnClass, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { isNull } from 'lodash';

type Props = {
  message: string;
  img?: string;
};
const OffLineWidget: FC<Props> = ({ message, img = null }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex w-full flex-col justify-center items-center space-y-10 mt-10`}
    >
      {!isNull(img) ? (
        <Image
          className="h-90 w-1/3 rounded-lg shadow-lg"
          alt="offline"
          fill={false}
          width={imageSizes.xs}
          height={imageSizes.xs}
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
        className={`text-lg text-center`}
        suppressHydrationWarning={suppressText}
      >
        {message}
      </p>
      <Link
        scroll={false}
        href={'/'}
        className={`${submitBtnClass} text-center text-md capitalize`}
        suppressHydrationWarning={suppressText}
      >
        {t('back_to_home')}
      </Link>
    </div>
  );
};

export default OffLineWidget;
