import React, { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { imageSizes, submitBtnClass, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { WifiOff } from '@mui/icons-material';

type Props = {
  message: string;
};
const OffLineWidget: FC<Props> = ({ message }): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex w-full flex-col justify-center items-center space-y-10`}
    >
      <WifiOff className="h-90 w-90" />
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
        {t('home')}
      </Link>
    </div>
  );
};

export default OffLineWidget;
