import Link from 'next/link';
import { appLinks, suppressText } from '@/constants/*';
import Image from 'next/image';
import { map } from 'lodash';
import { Amenities, Venue } from '@/types/queries';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  element: Venue;
  country: string;
  dateSelected: string;
};
export const VenueWidget: FC<Props> = ({ element, country, dateSelected }) => {
  const { t } = useTranslation();
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 1 }}>
      <Link
        scroll={false}
        href={`/country/${country}${appLinks.venueShow.path}${element.id}/${dateSelected}`}
        className={`h-48 relative w-full`}
      >
        <div className="h-48 relative cursor-pointer">
          <Image
            alt={element.venue_name}
            fill={true}
            className="w-full h-48 object-cover rounded-md"
            src={element.background_image}
          />
          <div className="bg-primary_BG rounded-md absolute bottom-0 w-full">
            <div className="grid grid-cols-8 text-white p-1.5">
              <div className="col-start-1 col-span-8 mx-1">
                <div className="flex justify-between items-center">
                  <div className="flex text-left items-center">
                    {/* logo img */}
                    <div className="p-px w-16 h-16 relative">
                      <Image
                        fill={true}
                        className="rounded-md"
                        alt={'logo'}
                        src={element.vendor_logo}
                      />
                    </div>

                    {/* venue name */}
                    <div className="text-start px-2">
                      <p className="text-sm">{element.venue_name}</p>
                      <p className="text-xs">{element.vendor_name}</p>
                    </div>
                  </div>
                  {/* price */}
                  <div>
                    <p
                      className="text-sm text-right pb-1"
                      suppressHydrationWarning={suppressText}
                    >
                      {element.price} {t(element.currency)}
                    </p>
                    <div className="flex items-center justify-end gap-x-1 col-start-1 col-span-8 ">
                      <p className="bg-TransparentWhite rounded-xl px-2 py-0.5 text-xs h-fit whitespace-nowrap">
                        {element.space}
                      </p>
                      <div className="grid grid-flow-col gap-x-2 bg-TransparentWhite rounded-xl px-2 py-1 h-fit">
                        {map(element.amenities, (item: Amenities) => {
                          return (
                            <div className="w-4 h-4 relative" key={item.id}>
                              <Image
                                fill={true}
                                className="rounded-full"
                                alt={item.name}
                                src={item.icon}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VenueWidget;
