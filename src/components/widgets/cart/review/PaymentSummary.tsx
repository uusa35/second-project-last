import { FC, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { suppressText } from '@/constants/*';
import LoadingSpinner from '@/components/LoadingSpinner';

const PaymentSummary: FC = () => {
  const { t } = useTranslation();
  const { cart } = useAppSelector((state) => state);

  console.log('the cart from globalState ====>', cart);
  return (
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      <div className={`px-4 py-4`}>
        <div className="flex justify-between mb-3 text-lg">
          <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
          <p suppressHydrationWarning={suppressText}>
            {cart.subTotal} {t('kwd')}
          </p>
        </div>
        <div className="flex justify-between mb-3 text-lg">
          <p suppressHydrationWarning={suppressText}>{t('delivery_fees')}</p>
          <p suppressHydrationWarning={suppressText}>
            {0} {t('kwd')}
          </p>
        </div>
        <div className="flex justify-between mb-3 text-lg">
          <p suppressHydrationWarning={suppressText}>{t('total')} (server)</p>
          <p suppressHydrationWarning={suppressText}>
            {cart.total}
            {t('kwd')}
          </p>
        </div>
        <div className="flex justify-between mb-3 text-lg ">
          <p className="font-semibold" suppressHydrationWarning={suppressText}>
            {t('total')} (client)
          </p>
          <p
            className="text-primary_BG"
            suppressHydrationWarning={suppressText}
          >
            {cart.grossTotal} {t('kwd')}
          </p>
        </div>
      </div>
    </Suspense>
  );
};
export default PaymentSummary;
