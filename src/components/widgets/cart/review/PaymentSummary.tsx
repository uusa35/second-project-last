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
    delivery_fees,
  } = useAppSelector((state) => state.cart);
  const color = useAppSelector(themeColor);
  useEffect(() => {}, [promoEnabled]);

  return (
    <div className={`px-4 py-4 capitalize`}>
      <>
        <div className="flex justify-between mb-3 text-lg">
          <p suppressHydrationWarning={suppressText}>{t('subtotal')} </p>
          <div className={`flex flex-row`}>
            <p suppressHydrationWarning={suppressText} className={`px-2`}>
              {promoEnabled ? coupon.total_cart_after_tax : subTotal}
            </p>
            <p>{t('kwd')}</p>
          </div>
        </div>
        <div className="flex justify-between mb-3 text-lg">
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
            <p>{t('kwd')}</p>
          </div>
        </div>
        <div className="flex justify-between mb-3 text-lg font-semibold">
          <p suppressHydrationWarning={suppressText}>{t('total')}</p>
          <div className={`flex flex-row`} style={{ color }}>
            <p suppressHydrationWarning={suppressText} className={`px-2`}>
              {promoEnabled ? coupon.total_cart_before_tax : total}
            </p>
            <p>{t('kwd')}</p>
          </div>
        </div>
      </>
    </div>
  );
};
export default PaymentSummary;
