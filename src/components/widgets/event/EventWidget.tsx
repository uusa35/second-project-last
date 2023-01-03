import { motion } from 'framer-motion';
import Link from 'next/link';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
import Image from 'next/image';
import SportsIcon from '@mui/icons-material/Sports';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GenderIcon from '@/appIcons/gender.svg';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { FC } from 'react';
import { Event } from '@/types/queries';
import { useTranslation } from 'react-i18next';

type Props = {
  element: Event;
  country: string;
  dateSelected: string;
};
const EventWidget: FC<Props> = ({
  element,
  country,
  dateSelected,
}): JSX.Element => {
  const { t } = useTranslation();
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 1 }}
      className={`shadow-lg rounded-lg border border-gray-200 h-auto bg-gradient-to-tl from-primary_BG via-primary_BG to-primaryLight`}
    >
      <Link
        scroll={false}
        href={`/country/${country}${appLinks.eventShow.path}${element.id}/${dateSelected}`}
      >
        <div className="h-48 w-full relative rounded-t-lg">
          <Image
            className="h-56 w-full h-auto rounded-md object-cover rounded-t-lg"
            src={element.main_image}
            alt="banner"
            fill={true}
            priority={false}
            sizes="(max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw"
          />
        </div>
        <div className="relative bg-transparent rounded-lg text-white text-sm p-2">
          {/* vendor info */}
          <div className="flex justify-between items-center mb-2 me-5">
            <div className="flex gap-x-1 items-center">
              <Image
                className="w-10 h-10 rounded-md"
                src={element.vendor_logo}
                alt="logo"
                width={imageSizes.xs}
                height={imageSizes.xs}
                priority={false}
                fill={false}
              />
              <div className="flex flex-col items-start mx-2">
                <p className="w-fit">{element.event_name}</p>
                <p className="w-fit">{element.vendor_name}</p>
              </div>
            </div>

            <p suppressHydrationWarning={suppressText}>
              {element.event_price} {t(`${element.currency}`)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-2 gap-x-1">
            <div className="flex justify-start items-center">
              <SportsIcon
                className="w-1/6"
                sx={{ color: 'white', fontSize: 20 }}
              />
              <p className="break-all ltr:text-left rtl:text-right px-2 pt-1">
                {element.categories as string}
              </p>
            </div>

            {element.is_capacity === 1 && (
              <div className="flex justify-start items-center">
                <PersonOutlineOutlinedIcon
                  className="w-1/6"
                  sx={{ color: 'white', fontSize: 20 }}
                />
                <p
                  className="ltr:text-left rtl:text-right px-1"
                  suppressHydrationWarning={suppressText}
                >
                  {element.available_seats} {t('available_seats')}
                </p>
              </div>
            )}

            <div className="flex justify-start items-center">
              <CalendarMonthIcon
                className="w-1/6"
                sx={{ color: 'white', fontSize: 20 }}
              />
              <p className="break-all ltr:text-left rtl:text-right px-2 pt-1">
                {element.date}
              </p>
            </div>

            <div className="flex justify-start items-center px-3">
              <Image
                src={GenderIcon}
                width={imageSizes.xs}
                height={imageSizes.xs}
                alt={element.event_name}
                className={`w-5 h-5 object-contain ltr:mr-3 rtl:ml-3`}
                suppressHydrationWarning={suppressText}
                priority={false}
              />
              <p className="break-all ltr:text-left rtl:text-right px-2 pt-1">
                {t(element.gender)}
              </p>
            </div>

            <div className="flex justify-start items-center">
              <AccessTimeIcon
                className="w-1/6"
                sx={{ color: 'white', fontSize: 20 }}
              />
              <p className="break-all ltr:text-left rtl:text-right px-2 pt-1 ">
                {element.time}
              </p>
            </div>

            <div className="flex justify-start items-center">
              <LocationOnIcon
                className="w-1/6"
                sx={{ color: 'white', fontSize: 20 }}
              />
              <p className="break-all ltr:text-left rtl:text-right px-2 pt-1">
                {element.area}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
export default EventWidget;
