import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { NextPage } from 'next';
import Image from 'next/image';
import { imgUrl, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { orderApi } from '@/redux/api/orderApi';
import { isEmpty, map } from 'lodash';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { OrderInvoice } from '@/types/index';
import { apiSlice } from '@/redux/api';
import { useEffect, Suspense } from 'react';
import {
  setCurrentModule,
  setShowFooterElement,
  setUrl,
} from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  element: OrderInvoice;
  url: string;
};
const OrderInvoice: NextPage<Props> = ({ element, url }): JSX.Element => {
  const { vendor } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);
  const { t } = useTranslation();
  const handleMapLocation = (lat: string, long: string) => {
    window.open(`https://maps.google.com?q=${lat},${long}`);
  };

  useEffect(() => {
    dispatch(setCurrentModule('invoice'));
    dispatch(setShowFooterElement(`home`));
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  return (
    <Suspense>
      <MainContentLayout url={url}>
        <div>
          <div className="flex px-4  pt-5 justify-between items-center">
            <div className="flex items-center">
              <Image
                src={`${imgUrl(vendor.logo)}`}
                alt="logo"
                width={60}
                height={60}
              />
              <h4 className="px-2 font-semibold capitalize">{vendor.name}</h4>
            </div>
            <h4
              className="px-2 font-semibold capitalize"
              suppressHydrationWarning={suppressText}
            >
              {t('order')} {element.order_code}
            </h4>
          </div>
          <p
            className="font-semibold text-center pt-2 capitalize"
            suppressHydrationWarning={suppressText}
          >
            {t(`${element.order_type}`)}
          </p>
          <div className="my-5 px-5 py-1 bg-gray-100"></div>
          <div className="flex justify-between px-4 py-2 capitalize">
            <div>
              <h4
                className="font-semibold "
                suppressHydrationWarning={suppressText}
              >
                {t('customer_info')}
              </h4>
              <p className="py-1">{element.customer.name}</p>
              <p className="py-1">{element.customer.phone}</p>
              <p className="py-1">{element.customer.email}</p>
            </div>
            <div>
              <h4
                className="font-semibold "
                suppressHydrationWarning={suppressText}
              >
                {t('pick_up_details')}
              </h4>
              <p className="py-1" suppressHydrationWarning={suppressText}>
                {t('branch')} : {element.pickup_details.branch}
              </p>
              <button
                suppressHydrationWarning={suppressText}
                className="capitalize py-1"
                style={{ color }}
                onClick={() =>
                  handleMapLocation(
                    element.pickup_details.latitude,
                    element.pickup_details.longitude
                  )
                }
              >
                {t('map_location')}
              </button>
            </div>
          </div>
          <div className="px-4 border-t border-gray-300 pt-4">
            <h4
              className="font-extrabold pb-2"
              suppressHydrationWarning={suppressText}
            >
              {t('payment_details')}
            </h4>
            <p suppressHydrationWarning={suppressText}>
              {element.payment_type === 'C.O.D'
                ? t('cash_on_delivery')
                : element.payment_type}
            </p>
          </div>
          <div className="px-4 pt-4">
            <h4
              className="font-extrabold pb-2"
              suppressHydrationWarning={suppressText}
            >
              {t('order_details')}
            </h4>
            <div className="flex items-center py-1">
              <p
                className="pe-2 font-extrabold"
                suppressHydrationWarning={suppressText}
              >
                {t('store_branch')} :
              </p>
              <p>
                {`${element.order_details.branch}  - ${element.order_details.branch_address}`}
              </p>
            </div>
            <div className="flex items-center py-1">
              <p
                className="pe-2 font-extrabold"
                suppressHydrationWarning={suppressText}
              >
                {t('time_date')} :
              </p>
              <p>
                {element.order_details.order_time}{' '}
                {element.order_details.order_date}
              </p>
            </div>
          </div>
          <div className="my-5 px-5 py-1 bg-gray-100"></div>
          <div className="px-4">
            <h4
              className="font-semibold pb-2"
              suppressHydrationWarning={suppressText}
            >
              {t('order_summary')}
            </h4>
            <div className="relative overflow-x-auto ">
              <table className={`table-auto w-full text-left mb-5`}>
                <thead>
                  <tr className="whitespace-nowrap text-start">
                    <th
                      scope="col"
                      className="py-3 px-3"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('qty')}
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-3"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('item')}
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-3"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('sp_req')}
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-3"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('price')}
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-3"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('total')}
                    </th>
                  </tr>
                  {/* <tr>
                  <th
                      scope="col"
                      className="py-3 px-3"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('add_on')}
                    </th>
                  </tr> */}
                </thead>
                <tbody>
                  {map(element.order_summary.items, (item, idx) => (
                    <>
                      <tr key={idx} className="text-start">
                        <td className="py-3 px-3">{item.quantity}</td>
                        <td className="py-3 px-3">{item.item}</td>
                        <td className="py-3 px-3"></td>
                        <td className="py-3 px-3">{item.price}</td>
                        <td className="py-3 px-3 uppercase">
                          {item.total}
                          {t('kwd')}
                        </td>
                      </tr>
                      {!isEmpty(item.addon) && (
                        <tr className="py-3 px-3 w-full">
                          <td colSpan={5} className="">
                            <div className="flex gap-x-2">
                              <p
                                suppressHydrationWarning={suppressText}
                                className="whitespace-nowrap font-bold"
                              >
                                {t('add_on')} :{' '}
                              </p>
                              <div className="flex flex-wrap">
                                {map(item.addon, (a, idx) => (
                                  <span
                                    className={`${
                                      item.addon.length > 1 &&
                                      'pe-1 whitespace-nowrap'
                                    }`}
                                  >
                                    {`${a} `}
                                    {idx !== item.addon.length - 1 ? '/ ' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}

                      {item.extra_notes && (
                        <tr className="py-3 px-3 w-full">
                          <td colSpan={5}>
                            <div className="flex gap-x-2">
                              <p
                                className="font-bold"
                                suppressHydrationWarning={suppressText}
                              >
                                {t('notes')} :{' '}
                              </p>
                              <p>{item.extra_notes}</p>
                            </div>
                          </td>
                        </tr>
                      )}

                      <tr className="py-3 px-3 w-full border-b border-gray-200"></tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className={`px-4 py-4`}>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
              <p
                suppressHydrationWarning={suppressText}
                className={`uppercase`}
              >
                {element.order_summary.sub_total} {t('kwd')}
              </p>
            </div>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>{t('tax')}</p>
              <p
                suppressHydrationWarning={suppressText}
                className={`uppercase`}
              >
                {element.order_summary.tax} {t('kwd')}
              </p>
            </div>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>
                {t('delivery_services')}
              </p>
              <p
                suppressHydrationWarning={suppressText}
                className={`uppercase`}
              >
                {element.order_summary.delivery_fee} {t('kwd')}
              </p>
            </div>

            <div className="flex justify-between mb-3 text-lg ">
              <p
                className="font-semibold"
                suppressHydrationWarning={suppressText}
              >
                {t('total')}
              </p>
              <p
                style={{ color }}
                suppressHydrationWarning={suppressText}
                className={`uppercase`}
              >
                {element.order_summary.total} {t('kwd')}
              </p>
            </div>
          </div>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};
export default OrderInvoice;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      const url = req.headers.host;
      const { orderId }: any = query;
      if (!orderId) {
        return {
          notFound: true,
        };
      }
      const {
        data: element,
        isError,
      }: { data: AppQueryResult<OrderInvoice>; isError: boolean } =
        await store.dispatch(
          orderApi.endpoints.getInvoice.initiate({
            order_id: orderId,
            url,
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
          url,
        },
      };
    }
);
