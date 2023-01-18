import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { sumBy } from 'lodash';
import { useAppSelector } from '@/redux/hooks';
import { suppressText } from '@/constants/*';

const PaymentSummary: FC = () => {
  const { t } = useTranslation();
  const { cart } = useAppSelector((state) => state);

  console.log('the cart', cart);
  return (
    <div className={`px-4 py-4`}>
      <div className="flex justify-between mb-3 text-lg">
        <p suppressHydrationWarning={suppressText}>{t('total')}</p>
        <p suppressHydrationWarning={suppressText}>
          {cart.total}
          {t('kwd')}
        </p>
      </div>
      <div className="flex justify-between mb-3 text-lg">
        <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
        <p suppressHydrationWarning={suppressText}>
          {cart.subTotal} {t('kwd')}
        </p>
      </div>

      <div className="flex justify-between mb-3 text-lg ">
        <p className="font-semibold" suppressHydrationWarning={suppressText}>
          {t('total')}
        </p>
        <p className="text-primary_BG" suppressHydrationWarning={suppressText}>
          {cart.grossTotal} {t('kwd')}
        </p>
      </div>
    </div>
  );
};
export default PaymentSummary;
