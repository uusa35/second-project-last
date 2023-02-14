import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { suppressText } from '@/constants/*';
import { isNull } from 'lodash';
import { useAppSelector } from '@/redux/hooks';
import { themeColor } from '@/redux/slices/vendorSlice';

const PaymentSummary: FC = () => {
  const { t } = useTranslation();
  const {
    promoCode: coupon,
    promoEnabled,
    subTotal,
    total,
    tax,
    delivery_fees,
  } = useAppSelector((state) => state.cart);
  const color = useAppSelector(themeColor);
  useEffect(() => {}, [promoEnabled]);

  return (
    <div className={`px-4 py-2 capitalize`}>
      <>
        <div className="flex justify-between mb-2 text-lg">
          <p suppressHydrationWarning={suppressText}>{t('subtotal')} </p>
          <div className={`flex flex-row`}>
            <p suppressHydrationWarning={suppressText} className={`px-2`}>
              {promoEnabled ? coupon.sub_total : subTotal}
            </p>
            <p className={`uppercase`} suppressHydrationWarning={suppressText}>
              {t('kwd')}
            </p>
          </div>
        </div>
        <div className="flex justify-between mb-2 text-lg">
          <p suppressHydrationWarning={suppressText}>{t('tax')} </p>
          <div className={`flex flex-row`}>
            <p suppressHydrationWarning={suppressText} className={`px-2`}>
              {promoEnabled ? coupon.tax : tax}
            </p>
            <p className={`uppercase`} suppressHydrationWarning={suppressText}>
              %
            </p>
          </div>
        </div>
        {promoEnabled && (
          <div className="flex justify-between mb-2 text-lg">
            <p suppressHydrationWarning={suppressText}>{t('coupon_value')} </p>
            <div className={`flex flex-row`}>
              <p suppressHydrationWarning={suppressText} className={`px-2`}>
                {coupon.promo_code_discount}{' '}
              </p>
              <p
                className={`uppercase`}
                suppressHydrationWarning={suppressText}
              >
                {coupon.promo_code_type === 'exact_value' ? t('kwd') : '%'}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-between mb-2 text-lg">
          <p suppressHydrationWarning={suppressText}>{t('delivery_fees')}</p>
          <p suppressHydrationWarning={suppressText}></p>
          <div className={`flex flex-row`}>
            <p suppressHydrationWarning={suppressText} className={`px-2`}>
              {promoEnabled
                ? coupon.free_delivery === `false`
                  ? 0
                  : coupon.free_delivery
                : isNull(delivery_fees)
                ? 0
                : delivery_fees}
            </p>
            <p className={`uppercase`} suppressHydrationWarning={suppressText}>
              {t('kwd')}
            </p>
          </div>
        </div>
        <div className="flex justify-between mb-2 text-lg">
          <p suppressHydrationWarning={suppressText}>{t('total')}</p>
          <div className={`flex flex-row`} style={{ color }}>
            <p suppressHydrationWarning={suppressText} className={`px-2`}>
              {promoEnabled ? coupon.total_cart_before_tax : total}
            </p>
            <p className={`uppercase`} suppressHydrationWarning={suppressText}>
              {t('kwd')}
            </p>
          </div>
        </div>
      </>
    </div>
  );
};
export default PaymentSummary;
