import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Success from '@/appImages/success.png';
import { suppressText, appLinks, imageSizes } from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { orderApi } from '@/redux/api/orderApi';
import { Order } from '@/types/index';
import { apiSlice } from '@/redux/api';
import TextTrans from '@/components/TextTrans';
import CustomImage from '@/components/CustomImage';
import { useEffect, Suspense } from 'react';
import {
  setCurrentModule,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useLazyGetCartProductsQuery } from '@/redux/api/cartApi';

type Props = {
  element: Order;
};
const OrderSuccess: NextPage<Props> = ({ element }) => {
  const { t } = useTranslation();
  const {
    customer: { userAgent },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [triggerGetCartProducts] = useLazyGetCartProductsQuery();

  useEffect(() => {
    dispatch(setCurrentModule('order_success'));
    dispatch(setShowFooterElement(t('order_success')));
    triggerGetCartProducts({ UserAgent: userAgent });
  }, []);

  return (
    <Suspense>
      <MainContentLayout>
        <div className="capitalize">
          <div className="flex flex-col items-center">
            <CustomImage
              className="w-22 h-fit"
              src={Success.src}
              alt={t('success')}
              width={imageSizes.xs}
              height={imageSizes.xs}
            />
            <h4
              className="font-semibold pb-3 pt-10"
              style={{ color }}
              suppressHydrationWarning={suppressText}
            >
              {t('thank_you')}
            </h4>
            <p suppressHydrationWarning={suppressText}>
              {t('your_order_is_confirmed_and_on_its_way')}
            </p>
          </div>
          <div className="mt-10 px-5 py-1 bg-gray-100"></div>
          <div className="px-8">
            <div className="flex justify-between pt-4 text-lg">
              <h4
                className="font-semibold"
                style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {t('order_code')}
              </h4>
              <p>
                {' '}
                {'#'}
                {element.orderCode}
              </p>
            </div>
            <div className="flex justify-between pt-4 text-lg">
              <h4
                className="font-semibold"
                style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {t('vendor_name')}
              </h4>
              <TextTrans
                ar={element.vendor_name_ar}
                en={element.vendor_name_en}
              />
            </div>
          </div>
          <div className="mt-5 px-5 py-1 bg-gray-100"></div>
          <div className="w-full flex-col space-y-5 px-8 my-3">
            <p
              className="text-center pt-4 pb-2"
              suppressHydrationWarning={suppressText}
            >
              {t('track_your_order_and_check_the_status_of_it_live')}
            </p>
            <Link
              href={appLinks.orderInvoice(`${element.order_id}`)}
              scroll={true}
              className={`flex grow justify-center items-center p-4 rounded-lg text-white mb-3 shadow-lg`}
              style={{ backgroundColor: color }}
            >
              {t('view_receipt')}
            </Link>
            <Link
              href={{
                pathname: `/order/track`,
                query: { order_code: element.orderCode },
              }}
              scroll={true}
              className={`flex grow justify-center items-center p-4 rounded-lg text-white mb-3 shadow-lg`}
              style={{ backgroundColor: color }}
            >
              {t('track_order')}
            </Link>
            <Link
              href={appLinks.home.path}
              style={{ backgroundColor: color }}
              scroll={true}
              className={`flex grow justify-center items-center p-4 rounded-lg text-white mb-3 shadow-lg`}
            >
              {t('order_again')}
            </Link>
          </div>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default OrderSuccess;
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const { orderId }: any = query;
      if (!orderId) {
        return {
          notFound: true,
        };
      }
      const {
        data: element,
        isError,
      }: { data: AppQueryResult<Order>; isError: boolean } =
        await store.dispatch(
          orderApi.endpoints.checkOrderStatus.initiate({
            status: 'success',
            order_id: orderId,
          })
        );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.status || !element.data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.data,
        },
      };
    }
);
