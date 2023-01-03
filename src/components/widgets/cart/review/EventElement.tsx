import { appLinks, grayBtnClass, suppressText } from '@/constants/*';
import { AccessTime, CalendarMonth, LocationOn } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Cart } from '@/types/index';
import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import Link from 'next/link';
import { dateSelected } from '@/redux/slices/searchParamsSlice';

type Props = {
  event: Cart['event'];
};
const EventElement: FC<Props> = ({ event }): JSX.Element => {
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
            <p className="text-lg">{event.event_name}</p>
            <p>{event.vendor_name}</p>
          </div>
          <Link
            scroll={false}
            href={`/country/${country}${appLinks.eventShow.path}${element.id}/${searchDateSelected}`}
            className={`${grayBtnClass} bg-TransparentWhite border-0 px-4 py-1 text-base`}
            suppressHydrationWarning={suppressText}
          >
            {t('change')}
          </Link>
        </div>

        <div className="flex flex-col justify-start mb-5">
          <div className="flex py-1">
            <LocationOn className="text-slate-700 px-1" />
            <p>{event.area}</p>
          </div>
          <div className="flex items-center py-1">
            <CalendarMonth className="text-slate-700 px-1" />
            <p>{event.date}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AccessTime className="text-slate-700 px-1" />
              <p>{event.time}</p>
            </div>
            <p className="text-lg" suppressHydrationWarning={suppressText}>
              {event.price} {t(`${event.currency}`)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EventElement;
