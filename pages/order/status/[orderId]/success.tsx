import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Success from '@/appImages/success.png';
import { suppressText, appLinks } from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { orderApi } from '@/redux/api/orderApi';
import { Order } from '@/types/index';
import { apiSlice } from '@/redux/api';
import TextTrans from '@/components/TextTrans';
import CustomImage from '@/components/CustomImage';
import { useEffect, Suspense } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  element: Order;
};
const OrderSuccess: NextPage<Props> = ({ element }) => {
  const { t } = useTranslation();
  const {
    branch: { id: branchId },
    area: { id: areaId },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentModule(t('order_success')));
  }, []);

  return (
    <Suspense>
      <MainContentLayout>
        <div className="capitalize">
          <div className="flex flex-col items-center">
            <CustomImage
              className="shadow-md"
              src={Success.src}
              alt={t('success')}
              width={80}
              height={80}
            />
            <h4
              className="font-semibold py-3"
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
            <div className="flex justify-between pt-4">
              <h4
                className="text-base font-semibold"
                style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {t('order_id')}
              </h4>
              <p>{element.order_id}</p>
            </div>
            <div className="flex justify-between pt-4">
              <h4
                className="text-base font-semibold"
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
              style={{ color }}
            >
              {t('track_your_order_and_check_the_status_of_it_live')}
            </p>
            <Link
              href={appLinks.orderInvoice(`${element.order_id}`)}
              className={`flex grow justify-center items-center p-4 rounded-lg text-white mb-3`}
              style={{ backgroundColor: color }}
            >
              {t('view_receipt')}
            </Link>
            <Link
              href={{
                pathname: `/order/track`,
                query: { order_code: element.orderCode },
              }}
              className={`flex grow justify-center items-center p-4 rounded-lg text-white mb-3`}
              style={{ backgroundColor: color }}
            >
              {t('track_order')}
            </Link>
            <Link
              href={appLinks.productSearchIndex(branchId, ``, areaId)}
              style={{ backgroundColor: color }}
              className={`flex grow justify-center items-center p-4 rounded-lg text-white mb-3`}
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
