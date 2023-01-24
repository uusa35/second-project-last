import NoResultImage from '@/appImages/no_results_found.jpg';
import { imageSizes, suppressText } from '@/constants/*';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import CustomImage from '@/components/CustomImage';

type Props = {
  title: string;
};
const NoDataFound: FC<Props> = ({ title }) => {
  const { t } = useTranslation();
  return (
    <div className="my-14">
      <div className="text-center flex justify-center">
        <div className="text-center">
          <CustomImage
            src={NoResultImage.src}
            alt="no result"
            className={`w-80 h-auto`}
            width={imageSizes.xs}
            height={imageSizes.xs}
          />
          <p className='capitalize' suppressHydrationWarning={suppressText}>{t(title)}</p>
        </div>
      </div>
    </div>
  );
};

export default NoDataFound;
