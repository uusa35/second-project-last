import { FC } from 'react';
import { Cart } from '@/types/index';
import { useTranslation } from 'react-i18next';
import { has } from 'lodash';
import { useAppSelector } from '@/redux/hooks';
import { splitPrice, suppressText } from '@/constants/*';

type Props = {
  element: {
    total: string;
    tax: string;
    sub_total?: string;
    subtotal?: string;
    delivery_fee?: string;
  };
  split?: boolean;
};
const PaymentSummary: FC<Props> = ({ element, split = false }) => {
  const { t } = useTranslation();
  const {
    country: { currency, tax: taxval, tax_status },
  } = useAppSelector((state) => state);
  const { tax, total } = element;
  const subTotal = has(element, 'sub_total')
    ? element.sub_total
    : element.subtotal;

  return (
    <div>
      <h4
        className="text-primary_BG pb-2"
        suppressHydrationWarning={suppressText}
      >
        {t('payment_summary')}
      </h4>
      <div className="rounded-lg bg-LightGray p-3 space-y-3">
        <div className="flex justify-between">
          <h5 suppressHydrationWarning={suppressText}>{t('subtotal')}</h5>
          <span suppressHydrationWarning={suppressText}>
            {split ? subTotal && splitPrice(subTotal).price : subTotal}{' '}
            {t(currency)}
          </span>
        </div>

        {element.delivery_fee && (
          <div className="flex justify-between">
            <h5 suppressHydrationWarning={suppressText}>{t('delivery_fee')}</h5>
            <span suppressHydrationWarning={suppressText}>
              {split
                ? element.delivery_fee && splitPrice(element.delivery_fee).price
                : element.delivery_fee}{' '}
              {t(currency)}
            </span>
          </div>
        )}

        {/* {tax_status === 1 && ( */}
          <div className="flex justify-between">
            <h5 suppressHydrationWarning={suppressText}>{t('tax')}</h5>
            <span suppressHydrationWarning={suppressText}>
              {split ? splitPrice(tax).price : tax} {t(currency)}
            </span>
          </div>
        {/* )} */}
        <div className="flex justify-between text-primary_BG">
          <h5 suppressHydrationWarning={suppressText}>{t('total')}</h5>
          <span suppressHydrationWarning={suppressText}>
            {split ? splitPrice(total).price : total} {t(currency)}
          </span>
        </div>
      </div>
    </div>
  );
};
export default PaymentSummary;
