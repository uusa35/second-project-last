import { FC } from 'react';
import { Club, Subscription } from '@/types/queries';
import Link from 'next/link';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

type Props = {
  element: Club;
  country: string;
  selectedCategory: string;
  params: string;
};
const SubscriptionWidget: FC<Props> = ({
  element,
  country,
  selectedCategory,
  params,
}) => {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      className="relative shadow-lg rounded-lg border border-gray-200 h-auto bg-gradient-to-tl from-primary_BG via-primary_BG to-primaryLight"
    >
      <Link
        href={appLinks.subscriptionShow(
          country, // country_id
          element.vendor_id,
          selectedCategory,
          params[0]
        )}
      >
        <div className="h-48 w-full relative rounded-t-lg">
          <Image
            className="w-full h-full rounded-lg"
            src={element.vendor_banner}
            fill={false}
            width={imageSizes.xs}
            height={imageSizes.xs}
            alt={element.vendor_name}
            priority={false}
          />
        </div>

        <div className="grid grid-cols-8 text-white rounded-md w-full p-4">
          <div className="col-start-1 col-span-8 mx-">
            <div className="flex justify-between">
              <div className="flex">
                {/* logo img */}
                <Image
                  className="w-10 h-10 rounded-md object-cover shadow-md"
                  src={element.vendor_logo}
                  alt={element.vendor_name}
                  fill={false}
                  width={imageSizes.xs}
                  height={imageSizes.xs}
                  priority={false}
                />

                {/* venue name */}
                <div className="flex flex-col mx-3 pt-1 space-y-1">
                  <p className="text-sm">{element.vendor_name}</p>
                  <p className="text-xs">{element.area}</p>
                </div>
              </div>

              {/* price */}
              <p className="text-sm" suppressHydrationWarning={suppressText}>
                {element.price} {t(element.currency)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-x-1 col-start-1 col-span-8 ">
            <p className="bg-TransparentWhite rounded-xl px-1.5 text-xs h-fit whitespace-nowrap">
              {element.space}
            </p>
            <div className="grid grid-flow-col gap-x-1 bg-opacity-20 bg-white rounded-xl p-1.5 h-fit">
              {element.amenities.map((item) => {
                return (
                  <Image
                    className="w-4 h-4 rounded-full mx-1 object-cover"
                    fill={false}
                    width={imageSizes.xs}
                    height={imageSizes.xs}
                    key={item.id}
                    alt={item.name}
                    src={item.icon}
                    priority={false}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SubscriptionWidget;
