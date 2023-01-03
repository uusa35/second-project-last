import { Vendor } from '@/types/index';
import Image from 'next/image';
import { FC } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/redux/hooks';
import { appLinks, imageSizes, splitPrice, suppressText } from '@/constants/*';
import ClockIcon from '@/appIcons/clock.svg';
import TruckIcon from '@/appIcons/truck.svg';
import { kebabCase } from 'lodash';
import { useTranslation } from 'react-i18next';

type Props = {
  element: Vendor;
};
const VendorWidget: FC<Props> = ({ element }): JSX.Element => {
  const { t } = useTranslation();
  const {
    country: { id },
  } = useAppSelector((state) => state);
  const { price: deliveryPrice, currency } = splitPrice(
    element.delivery_fee.toString()
  );

  return (
    <div className="max-w-[190px] sm:max-w-[215px] bg-white rounded-lg shadow-sm border-[1px] border-gray-100 border-r mx-1">
      <Link
        scroll={false}
        href={`/country/${id}${appLinks.vendorShow.path}${element.id}?id=${
          element.id
        }&slug=${kebabCase(element.name)}`}
      >
        <Image
          className="rounded-t-lg w-full h-40 object-cover"
          src={element.logo}
          fill={false}
          width={imageSizes.xs}
          height={imageSizes.xs}
          alt="product image"
        />
      </Link>
      <div className="rounded-b-lg h-20 my-2">
        <Link
          scroll={false}
          href={`/country/${id}${appLinks.vendorShow.path}${element.id}?id=${
            element.id
          }&slug=${kebabCase(element.name)}`}
          className={`flex flex-col ltr:text-left rtl:text-right p-2 space-y-2 h-20`}
        >
          <div className={`flex flex-col h-2/3 p-2`}>
            <span className="text-xs tracking-tight dark:text-white truncate">
              {element.name}
            </span>
            {element.categories && (
              <span className="text-xs text-gray-400 dark:text-gray-400  tracking-tight dark:text-white truncate">
                {element.categories}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center gap-x-1 text-xs rounded-b-lg  h-1/3">
            {element.delivery_time && (
              <>
                <div className={'flex items-center gap-x-1'}>
                  <Image
                    className={`w-4 h-4`}
                    src={ClockIcon}
                    width={imageSizes.xs}
                    height={imageSizes.xs}
                    alt={'clock'}
                    fill={false}
                  />
                  <p className="whitespace-nowrap">{element.delivery_time}</p>
                </div>
                {/* delivery fees */}
                <div className={'flex items-center gap-x-1'}>
                  <Image
                    className={`w-4 h-4`}
                    src={TruckIcon}
                    width={imageSizes.xs}
                    height={imageSizes.xs}
                    alt={'clock'}
                    fill={false}
                  />
                  <p
                    className="whitespace-nowrap"
                    suppressHydrationWarning={suppressText}
                  >
                    {deliveryPrice} {t(currency)}
                  </p>
                </div>
              </>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default VendorWidget;
