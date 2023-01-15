import { FC, Suspense } from 'react';
import CustomImage from '@/components/CustomImage';
import { appLinks, imageSizes, imgUrl, suppressText } from '@/constants/*';
import Link from 'next/link';
import { InfoOutlined, Check } from '@mui/icons-material';
import { Vendor } from '@/types/index';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '@/components/LoadingSpinner';

type Props = {
  element: Vendor;
};
const HomeVendorMainInfo: FC<Props> = ({ element }) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex gap-x-2 justify-between">
        <div className="flex flex-grow gap-x-2">
          <Link href={appLinks.home.path} scroll={false} className={`w-1/4`}>
            <CustomImage
              width={imageSizes.xs}
              height={imageSizes.xs}
              className="rounded-md w-full h-fit aspect-square"
              alt={element.name}
              src={imgUrl(element.logo)}
            />
          </Link>
          <div className={`flex flex-col w-full p-2 space-y-2`}>
            <h1 className="font-bold text-lg">{element.name}</h1>
            <div className="text-sm text-neutral-400 space-y-1">
              <p suppressHydrationWarning={suppressText}>
                <Check className="text-lime-400 text-base" />{' '}
                {t('payment_by_cards')}
              </p>
              <p suppressHydrationWarning={suppressText}>
                <Check className="text-lime-400 text-base" />{' '}
                {t('cash_on_delivery')}
              </p>
            </div>
          </div>
        </div>

        <Link href={appLinks.vendorShow.path} scroll={false}>
          <InfoOutlined className="text-primary_BG w-6 h-6 lg:w-8 lg:h-8" />
        </Link>
      </div>

      {element.desc && (
        <div className="flex gap-x-1 justify-center items-start mt-2">
          <p
            suppressHydrationWarning={suppressText}
            className="text-sm text-neutral-400 px-2"
          >
            {element.desc}
          </p>
        </div>
      )}
    </>
  );
};

export default HomeVendorMainInfo;
