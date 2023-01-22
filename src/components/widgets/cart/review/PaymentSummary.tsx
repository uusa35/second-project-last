import { FC, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { suppressText } from '@/constants/*';
import LoadingSpinner from '@/components/LoadingSpinner';
import { isNull } from 'lodash';

type Props = {
  total: number;
  subTotal: number;
  delivery: number | null;
  isLoading: boolean;
};
const PaymentSummary: FC<Props> = ({
  total,
  subTotal,
  delivery,
  isLoading,
}) => {
  const { t } = useTranslation();
  return (
    <div className={`px-4 py-4`}>
      {isLoading ? (
        <LoadingSpinner fullWidth={false} />
      ) : (
        <>
          <div className="flex justify-between mb-3 text-lg">
            <p suppressHydrationWarning={suppressText}>{t('subtotal')} </p>
            <div className={`flex flex-row`}>
              <p suppressHydrationWarning={suppressText} className={`px-2`}>
                {subTotal}
              </p>
              <p>{t('kwd')}</p>
            </div>
          </div>
          <div className="flex justify-between mb-3 text-lg">
            <p suppressHydrationWarning={suppressText}>{t('delivery_fees')}</p>
            <p suppressHydrationWarning={suppressText}></p>
            <div className={`flex flex-row`}>
              <p suppressHydrationWarning={suppressText} className={`px-2`}>
                {isNull(delivery) ? 0 : delivery}
              </p>
              <p>{t('kwd')}</p>
            </div>
          </div>
          <div className="flex justify-between mb-3 text-lg">
            <p suppressHydrationWarning={suppressText}>{t('total')}</p>
            <div className={`flex flex-row`}>
              <p suppressHydrationWarning={suppressText} className={`px-2`}>
                {total}
              </p>
              <p>{t('kwd')}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default PaymentSummary;
