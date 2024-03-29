import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Success from '@/appImages/success.png';
import { suppressText, appLinks, imageSizes } from '@/constants/*';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { orderApi, useLazyCheckOrderStatusQuery } from '@/redux/api/orderApi';
import { Order } from '@/types/index';
import { apiSlice } from '@/redux/api';
import TextTrans from '@/components/TextTrans';
import CustomImage from '@/components/CustomImage';
import { useEffect, Suspense } from 'react';
import {
  setCurrentModule,
  setShowFooterElement,
  setUrl,
} from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useLazyGetCartProductsQuery } from '@/redux/api/cartApi';
import LoadingSpinner from '@/components/LoadingSpinner';

type Props = {
  orderId: any;
  url: string;
};
const OrderSuccess: NextPage<Props> = ({ orderId, url }) => {
  const { t } = useTranslation();
  const {
    customer: { userAgent },
    appSetting: { method },
    branch,
    area,
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const dispatch = useAppDispatch();
  const [triggerGetCartProducts] = useLazyGetCartProductsQuery();
  const [triggerGetOrderStatus, { data: element, isLoading }] =
    useLazyCheckOrderStatusQuery<{
      data: AppQueryResult<Order>;
      isLoading: boolean;
    }>();

  useEffect(() => {
    dispatch(setCurrentModule('order_success'));
    dispatch(setShowFooterElement(t('order_success')));
    if (url) {
      dispatch(setUrl(url));
    }

    // console.log({ orderId });
    triggerGetOrderStatus(
      { status: 'success', order_id: orderId, url, userAgent },
      false
    );
    triggerGetCartProducts({
      UserAgent: userAgent,
      area_branch:
        method === `pickup`
          ? { 'x-branch-id': branch.id }
          : { 'x-area-id': area.id },
      url,
    });
  }, []);

  // console.log({ element });

  if (!element) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense>
      <MainContentLayout url={url} backRoute={appLinks.home.path}>
        <div className="capitalize" suppressHydrationWarning={suppressText}>
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
              {t('your_order_has_been_received')}
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
                {element.data.orderCode}
              </p>
            </div>
            <div className="flex justify-between pt-4 text-lg">
              <h4
                className="font-semibold"
                style={{ color }}
                suppressHydrationWarning={suppressText}
              >
                {t('store_name')}
              </h4>
              <TextTrans
                ar={element.data.vendor_name_ar}
                en={element.data.vendor_name_en}
              />
            </div>
          </div>
          <div className="mt-5 px-5 py-1 bg-gray-100"></div>
          <div className="w-full flex-col space-y-5 px-8 my-3">
            <p
              className="text-center pt-4 pb-2"
              suppressHydrationWarning={suppressText}
            >
              {t('track_your_order_status_below')}
            </p>
            <Link
              href={appLinks.orderInvoice(
                `${element.data.order_id}`,
                `${method}`,
                `${method === 'delivery' ? area.id : branch.id}`
              )}
              scroll={true}
              className={`flex grow justify-center items-center p-4 rounded-lg text-white mb-3 shadow-lg`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
            >
              {t('view_receipt')}
            </Link>
            <Link
              href={{
                pathname: appLinks.trackOrder.path,
                query: { order_code: element.data.orderCode },
              }}
              scroll={true}
              className={`flex grow justify-center items-center p-4 rounded-lg text-white mb-3 shadow-lg`}
              style={{ backgroundColor: color }}
              suppressHydrationWarning={suppressText}
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
    async ({ req, query }) => {
      const { orderId }: any = query;
      const url = req.headers.host;
      if (!url || !orderId) {
        return {
          notFound: true,
        };
      }
      // const {
      //   data: element,
      //   isError,
      // }: { data: AppQueryResult<Order>; isError: boolean } =
      //   await store.dispatch(
      //     orderApi.endpoints.checkOrderStatus.initiate({
      //       status: 'success',
      //       order_id: orderId,
      //       url,
      //     })
      //   );
      // await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      // if (isError || !element.status || !element.data) {
      //   return {
      //     notFound: true,
      //   };
      // }
      return {
        props: {
          orderId,
          url,
        },
      };
    }
);
