import { FC, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { suppressText } from '@/constants/*';
import LoadingSpinner from '@/components/LoadingSpinner';
import { isNull } from 'lodash';

const PaymentSummary: FC = () => {
  const { t } = useTranslation();
  const { cart } = useAppSelector((state) => state);
  return (
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      <div className={`px-4 py-4`}>
        {cart.promoEnabled ? (
          <>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>{t('subtotal')} </p>
              <p suppressHydrationWarning={suppressText}>
                {cart.promoCode.total_cart_after_tax}
                {t('kwd')}
              </p>
            </div>
            {cart.promoCode.free_delivery !== `false` && (
              <div className="flex justify-between mb-3 text-lg">
                <p suppressHydrationWarning={suppressText}>
                  {t('delivery_fees')}
                </p>
                <p suppressHydrationWarning={suppressText}>
                  {cart.promoCode.free_delivery} {t('kwd')}
                </p>
              </div>
            )}
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>{t('total')}</p>
              <p suppressHydrationWarning={suppressText}>
                {cart.promoCode.total_cart_before_tax} {t('kwd')}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>
                {t('delivery_fees')}
              </p>
              <p suppressHydrationWarning={suppressText}>
                {isNull(cart.delivery_fees) ? 0 : cart.delivery_fee} {t('kwd')}
              </p>
            </div>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>{t('subtotal')} </p>
              <p suppressHydrationWarning={suppressText}>
                {cart.subTotal}
                {t('kwd')}
              </p>
            </div>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>{t('total')}</p>
              <p suppressHydrationWarning={suppressText}>
                {cart.total} {t('kwd')}
              </p>
            </div>
          </>
        )}
        <div className="flex justify-between mb-3 text-lg">
          <p
            suppressHydrationWarning={suppressText}
            className={`${cart.promoEnabled && `line-through`}`}
          >
            {t('subtotal')} (Client Side)
          </p>
          <p
            suppressHydrationWarning={suppressText}
            className={`${cart.promoEnabled && `line-through`}`}
          >
            {cart.grossTotal}
            {t('kwd')}
          </p>
        </div>
      </div>
    </Suspense>
  );
};
export default PaymentSummary;
