import { FC, useEffect } from 'react';
import CustomImage from '@/components/CustomImage';
import { appLinks, imageSizes, imgUrl, suppressText } from '@/constants/*';
import Link from 'next/link';
import { InfoOutlined, Check } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import TextTrans from '@/components/TextTrans';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useLazyGetVendorQuery } from '@/redux/api/vendorApi';
import LoadingSpinner from '@/components/LoadingSpinner';

type Props = {
  url: string;
};
const HomeVendorMainInfo: FC<Props> = ({ url }): JSX.Element => {
  const { t } = useTranslation();
  const color = useAppSelector(themeColor);
  const {
    locale: { lang },
    branch: { id: branch_id },
    area: { id: area_id },
  } = useAppSelector((state) => state);
  const [triggerGetVendor, { data: element, isSuccess }] =
    useLazyGetVendorQuery();

  useEffect(() => {
    if (url) {
      triggerGetVendor({
        lang,
        url,
        ...(branch_id && { branch_id }),
        ...(area_id && { area_id }),
      });
    }
  }, [branch_id, area_id]);

  if (!isSuccess || !element || !element.Data)
    return <LoadingSpinner fullWidth={true} />;

  return (
    <>
      <div className="flex gap-x-2 justify-between items-start capitalize">
        <div className="flex grow gap-x-2">
          <Link href={appLinks.home.path} scroll={true} className={`w-1/4`}>
            <CustomImage
              width={imageSizes.xs}
              height={imageSizes.xs}
              className="rounded-md w-full h-fit aspect-square"
              alt={element.Data.name}
              src={imgUrl(element.Data.logo)}
            />
          </Link>
          <div className={`flex flex-col w-full p-2`}>
            <h1 className="font-bold text-lg">
              <TextTrans ar={element.Data.name_ar} en={element.Data.name_en} />
            </h1>
            <div className="text-sm text-neutral-400 space-y-1">
              <p suppressHydrationWarning={suppressText}>
                <Check className="text-lime-400 text-base checkCircle" />
                {t('payment_by_cards')}
              </p>
              <p suppressHydrationWarning={suppressText}>
                <Check className="text-lime-400 text-base checkCircle" />
                {t('cash_on_delivery')}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={appLinks.vendorShow.path}
          scroll={true}
          className={`flex-none pt-4 grayscale`}
        >
          <InfoOutlined className="w-6 h-6 lg:w-8 lg:h-8" style={{ color }} />
        </Link>
      </div>

      {element.Data.desc && (
        <div className="flex gap-x-1 justify-center items-start mt-2 capitalize">
          <p
            suppressHydrationWarning={suppressText}
            className="text-sm text-neutral-400 px-2"
          >
            {element.Data.desc}
          </p>
        </div>
      )}
    </>
  );
};

export default HomeVendorMainInfo;
