import { imageSizes, suppressText } from '@/constants/*';
import {
  AccessTime,
  CalendarMonth,
  LocationOn,
  Person,
  Payment,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';
import PaymentImage from '@/widgets/invoice/PaymentImage';

const ClassInvoice: FC = (): JSX.Element => {
  const { t } = useTranslation();
  const { order } = useAppSelector((state) => state);

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
          <div className="flex items-center">
            <LocationOn fontSize={'small'} />
            <h6
              className="px-2 text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {t('location')}
            </h6>
          </div>
          <div className="flex items-center">
            {order.venodr_logo && <Image
              src={`${order.vendor_logo}`}
              width={50}
              height={50}
              alt={`${order.vendor_name}`}
            />}
            <div>
              <p>{order.area}</p>
              <p className="text-xs">{order.address}</p>
            </div>
          </div>
        </div>
        <div className="py-3 border-b border-b-gray-300">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center pb-2">
                <CalendarMonth fontSize={'small'} />
                <h6
                  className="px-2 text-primary_BG"
                  suppressHydrationWarning={suppressText}
                >
                  {t('class_date')}
                </h6>
              </div>
              <p>{order.date}</p>
            </div>
            <div>
              <div className="flex items-center pb-2">
                <AccessTime fontSize={'small'} />
                <h6
                  className="px-2 text-primary_BG"
                  suppressHydrationWarning={suppressText}
                >
                  {t('time')}
                </h6>
              </div>
              <p>{order.time}</p>
            </div>
          </div>
        </div>
        <div className="py-3 border-b border-b-gray-300">
          <div className="flex items-center pb-2">
            <Person fontSize={'small'} />
            <h6
              className="px-2 text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {t('billed_to')}
            </h6>
          </div>
          <p>{order.customer_name}</p>
        </div>
        {/* payment */}
        <div className="py-3 border-b border-b-gray-300">
          <div className="flex items-center pb-2">
            <Payment fontSize={'small'} />
            <h6
              className="px-2 text-primary_BG"
              suppressHydrationWarning={suppressText}
            >
              {t('payment')}
            </h6>
          </div>
          <div className="flex flex-row justify-start space-x-3 items-center">
            <div>
              <PaymentImage paymentMethod={order.payment_method} />
            </div>
            <div className={`pt-2`}>
              <p>{order.payment_method}</p>
            </div>
          </div>
        </div>
        <div className="py-3">
          <div className="flex justify-between">
            <div>
              <h4>{order.class_name}</h4>
              <div className="flex items-center pb-2">
                <LocationOn fontSize={'small'} />
                <p className="text-sm">{order.area}</p>
              </div>
            </div>
            <div className="text-end">
              <p className="text-sm" suppressHydrationWarning={suppressText}>
                {t('total_amount')}
              </p>
              <p
                className="text-lg text-primary_BG"
                suppressHydrationWarning={suppressText}
              >
                {order.price} {t(order.currency)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClassInvoice;
