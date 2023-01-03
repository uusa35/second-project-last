import { suppressText } from '@/constants/*';
import {
  AccessTime,
  CalendarMonth,
  LocationOn,
  Person,
  Payment,
  Call,
  AccountCircle,
  HouseSiding,
  Grid3x3,
  ConfirmationNumber,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import GreyLine from '@/components/GreyLine';

const StoreInvoice: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { order } = useAppSelector((state) => state);

  console.log(order);

  return (
    <div>
      <div className="bg-gray-100 rounded p-4 text-base">
        <h2
          className="text-primary_BG pb-2 text-lg"
          suppressHydrationWarning={suppressText}
        >
          {t('payment_receipt')}
        </h2>
        <div className="py-3 border-b border-t border-b-gray-300 border-t-gray-300">
          {order.items.map((item: any, idx: number) => {
            return (
              <div>
                <div className="flex justify-between gap-x-2">
                  <p className="mb-1">{item.item_name}</p>
                  <p className="text-primary_BG">{item.item_price}</p>
                </div>
                <p suppressHydrationWarning={suppressText}>
                  {item.addons.join(' , ')}
                </p>

                {idx !== order.items.length && <GreyLine className="my-2" />}
              </div>
            );
          })}

          <div>
            <div>
              <p className="mb-2 font-semibold text-primary_BG">
                {t('billed_to')}
              </p>

              <div className="flex items-center gap-x-1 mb-1 px-2">
                <Person sx={{ fontSize: 16 }} />
                <p className="w-fit">{order.customer_name}</p>
              </div>

              <div className="flex items-center gap-x-1 mb-1 px-2">
                <Call sx={{ fontSize: 16 }} />
                <p className="w-fit">{order.customer_phone}</p>
              </div>
            </div>

            <GreyLine className="my-2" />

            <div>
              <p className="mb-2 font-semibold text-primary_BG">
                {t('payment_method')}
              </p>

              <div className="flex items-center gap-x-1 mb-1 px-2">
                <Payment sx={{ fontSize: 16 }} />
                <p className="w-fit">{order.payment_method}</p>
              </div>
            </div>

            <GreyLine className="my-2" />

            <div>
              <p className="mb-2 font-semibold text-primary_BG">
                {t('Order Info')}
              </p>

              <div className="flex items-center gap-x-1 mb-1 px-2">
                <Grid3x3 sx={{ fontSize: 16 }} />
                <p className="w-fit">
                  {t('Order Code')} : {order.order_code}
                </p>
              </div>

              <div className="flex items-center gap-x-1 mb-1 px-2">
                <ConfirmationNumber sx={{ fontSize: 16 }} />
                <p className="w-fit">
                  {t('Order ID')} : {order.receipt_id}
                </p>
              </div>
            </div>

            <GreyLine className="my-2" />

            <div>
              <p
                className="mb-2 font-semibold text-primary_BG"
                suppressHydrationWarning={suppressText}
              >
                {t('Address')}
              </p>

              <div className="flex items-center gap-x-1 mb-1 px-2">
                <HouseSiding sx={{ fontSize: 16 }} />
                <p className="w-fit">
                  {Object.entries(order.address)
                    .map((entry) => entry.join(': '))
                    .join(',')}{' '}
                </p>
              </div>
            </div>

            <GreyLine className="my-2" />

            <div>
              <p className="mb-2 font-semibold text-primary_BG">
                {t('Vendor Info')}
              </p>

              <div className="flex items-center gap-x-1 mb-1 px-2">
                <AccountCircle sx={{ fontSize: 16 }} />
                <p className="w-fit">{order.vendor_name} </p>
              </div>
            </div>

            <GreyLine className="my-2" />

            <div className="flex justify-between items-center">
              <p className="" suppressHydrationWarning={suppressText}>
                {t('total')}
              </p>
              <p className="text-primary_BG">{order.total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StoreInvoice;
