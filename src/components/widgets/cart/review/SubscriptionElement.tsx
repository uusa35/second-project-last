import { appLinks, grayBtnClass, suppressText } from '@/constants/*';
import { CalendarMonth, LocationOn } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Cart } from '@/types/index';
import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import Link from 'next/link';
import { dateSelected } from '@/redux/slices/searchParamsSlice';
import { useRouter } from 'next/router';
import { map } from 'lodash';

type Props = {
  subscription: Cart['subscription'];
};
const SubscriptionElement: FC<Props> = ({ subscription }): JSX.Element => {
  const { t } = useTranslation();
  const {
    country: { id },
    searchParams: { searchSubCategory },
  } = useAppSelector((state) => state);
  const router = useRouter();
  const { query }: any = router;

  return (
    <div>
      <div className="rounded-md bg-primary_BG p-3 text-white mb-5 text-base">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-lg">{subscription.subscription_name}</p>
            <p>{subscription.vendor_name}</p>
          </div>
          <Link
            href={appLinks.subscriptionShow(
              id,
              query.vendor_id,
              searchSubCategory.id,
              query.currentParams
            )}
            className={`${grayBtnClass} bg-TransparentWhite border-0 px-4 py-1 text-base`}
            suppressHydrationWarning={suppressText}
          >
            {t('change')}
          </Link>
        </div>

        <div className="flex flex-col justify-start mb-5">
          <div className="flex py-1">
            <LocationOn className="text-slate-700 px-1" />
            <p>{subscription.area}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center py-1">
              <CalendarMonth className="text-slate-700 px-1" />
              <p suppressHydrationWarning={suppressText}>
                {t('start_date:')} {subscription.start_date}
              </p>
            </div>
            <p className="text-lg" suppressHydrationWarning={suppressText}>
              {subscription.price} {t(`${subscription.currency}`)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SubscriptionElement;
