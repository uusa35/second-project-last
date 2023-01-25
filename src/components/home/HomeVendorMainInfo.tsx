import { FC } from 'react';
import CustomImage from '@/components/CustomImage';
import { appLinks, imageSizes, imgUrl, suppressText } from '@/constants/*';
import Link from 'next/link';
import { InfoOutlined, Check } from '@mui/icons-material';
import { Vendor } from '@/types/index';
import { useTranslation } from 'react-i18next';
import TextTrans from '@/components/TextTrans';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  element: Vendor;
};
const HomeVendorMainInfo: FC<Props> = ({ element }) => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);

  return (
    <>
      <div className="flex gap-x-2 justify-between items-center capitalize">
        <div className="flex grow gap-x-2">
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
            <h1 className="font-bold text-lg">
              <TextTrans ar={element.name_ar} en={element.name_en} />
            </h1>
            <div className="text-sm text-neutral-400 space-y-1">
              <p suppressHydrationWarning={suppressText}>
                <Check className="text-lime-400 text-base" />
                {t('payment_by_cards')}
              </p>
              <p suppressHydrationWarning={suppressText}>
                <Check className="text-lime-400 text-base" />
                {t('cash_on_delivery')}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={appLinks.vendorShow.path}
          scroll={false}
          className={`flex-none`}
        >
          <InfoOutlined
            className="text-primary_BG w-6 h-6 lg:w-8 lg:h-8"
            style={{ color }}
          />
        </Link>
      </div>

      {element.desc && (
        <div className="flex gap-x-1 justify-center items-start mt-2 capitalize">
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
