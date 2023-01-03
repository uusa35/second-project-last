import { appLinks, grayBtnClass, suppressText } from '@/constants/*';
import { AccessTime, CalendarMonth, LocationOn } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Cart } from '@/types/index';
import { Venue } from '@/types/queries';
import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { dateSelected } from '@/redux/slices/searchParamsSlice';

type Props = {
  venue: Cart['venue'];
};

const VenueElement: FC<Props> = ({ venue }): JSX.Element => {
  const {
    country: { id: country },
    currentElement: { element },
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const searchDateSelected = useAppSelector(dateSelected);

  return (
    <div>
      <div className="rounded-md bg-primary_BG p-3 text-white mb-5 text-base">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-lg">{element.venue_name}</p>
            <p>{element.vendor_name}</p>
          </div>
          <Link
            scroll={false}
            href={`/country/${country}${appLinks.venueShow.path}${element.id}/${searchDateSelected}`}
            className={`${grayBtnClass} bg-TransparentWhite border-0 px-4 py-1 text-base`}
            suppressHydrationWarning={suppressText}
          >
            {t('change')}
          </Link>
        </div>

        <div className="flex flex-col justify-start mb-5">
          <div className="flex py-1">
            <LocationOn className="text-slate-700 px-1" />
            <p>{element.area}</p>
          </div>
          <div className="flex items-center py-1">
            <CalendarMonth className="text-slate-700 px-1" />
            <p>{searchDateSelected}</p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`${grayBtnClass} bg-TransparentWhite border-none pt-2 px-2`}
            >
              {element.space}
            </p>
            <p className="text-lg" suppressHydrationWarning={suppressText}>
              {element.price} {t(`${element.currency}`)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VenueElement;
