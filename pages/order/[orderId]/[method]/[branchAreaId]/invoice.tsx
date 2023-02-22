import MainContentLayout from '@/layouts/MainContentLayout';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { NextPage } from 'next';
import Image from 'next/image';
import { imgUrl, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { useGetInvoiceQuery } from '@/redux/api/orderApi';
import { isEmpty, map } from 'lodash';
import { wrapper } from '@/redux/store';

import { useEffect, Suspense } from 'react';
import {
  setCurrentModule,
  setShowFooterElement,
  setUrl,
} from '@/redux/slices/appSettingSlice';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/LoadingSpinner';

type Props = {
  url: string;
};
const OrderInvoice: NextPage<Props> = ({ url }): JSX.Element => {
  const {
    vendor,
    branch,
    area,
    appSetting: { method },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const color = useAppSelector(themeColor);
  const { t } = useTranslation();
  const { orderId } = useRouter().query;
  // get invoice data
  const { data: element, isSuccess } = useGetInvoiceQuery(
    {
      order_id: orderId as string,
      url,
      area_branch:
        method === `pickup` && branch.id
          ? { 'x-branch-id': branch.id }
          : method === `delivery` && area.id
          ? { 'x-area-id': area.id }
          : {},
    },
    { refetchOnMountOrArgChange: true }
  );

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

  if (!isSuccess) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense>
      <MainContentLayout url={url}>
        <div>
          {/* customer logo and name */}
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
              {t('order')} {element.data.order_code}
            </h4>
          </div>

          {/* centered order type */}
          <p
            className="font-semibold text-center pt-2 capitalize"
            suppressHydrationWarning={suppressText}
          >
            {t(`${element.data.order_type}`)}
          </p>
          <div className="my-5 px-5 py-1 bg-gray-100"></div>

          {/* second section */}
          <div className="flex justify-between px-4 py-2 capitalize">
            {/* customer info */}
            <div>
              <h4
                className="font-semibold "
                suppressHydrationWarning={suppressText}
              >
                {t('customer_info')}
              </h4>
              <p className="py-1">{element.data.customer.name}</p>
              <p className="py-1">{element.data.customer.phone}</p>
              <p className="py-1">{element.data.customer.email}</p>
            </div>

            {/* branch or area */}
            <div>
              <h4
                className="font-semibold "
                suppressHydrationWarning={suppressText}
              >
                {element.data.order_type.includes('delivery')
                  ? t('delivery_details')
                  : t('pick_up_details')}
              </h4>

              {element.data.order_type.includes('delivery') ? (
                <>
                  <p className="py-1" suppressHydrationWarning={suppressText}>
                    {t('area')} : {element?.data?.area ?? ''}
                  </p>
                  <button
                    suppressHydrationWarning={suppressText}
                    className="capitalize py-1"
                    style={{ color }}
                    onClick={() =>
                      handleMapLocation(
                        element.data.delivery_address.latitude,
                        element.data.delivery_address.longitude
                      )
                    }
                  >
                    {t('map_location')}
                  </button>
                </>
              ) : (
                <>
                  <p className="py-1" suppressHydrationWarning={suppressText}>
                    {t('branch')} : {element.data.pickup_details.branch}
                  </p>
                  <button
                    suppressHydrationWarning={suppressText}
                    className="capitalize py-1"
                    style={{ color }}
                    onClick={() =>
                      handleMapLocation(
                        element.data.pickup_details.latitude,
                        element.data.pickup_details.longitude
                      )
                    }
                  >
                    {t('map_location')}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* payment details */}
          <div className="flex gap-x-2 px-4 border-t border-b border-gray-300 py-4">
            <h4
              className="font-extrabold pb-2"
              suppressHydrationWarning={suppressText}
            >
              {t('payment_details')} :
            </h4>
            <p suppressHydrationWarning={suppressText}>
              {element.data.payment_type === 'C.O.D'
                ? t('cash_on_delivery')
                : element.data.payment_type}
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
                {`${element.data.order_details.branch}  - ${element.data.order_details.branch_address}`}
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
                {element.data.order_details.order_time}{' '}
                {element.data.order_details.order_date}
              </p>
            </div>

            {/* delivery instructions */}
            {element.data.order_type.includes('delivery') ? (
              <div className="flex items-center py-1">
                <p
                  className="pe-2 font-extrabold"
                  suppressHydrationWarning={suppressText}
                >
                  {t('delivery_instructions')} :
                </p>
                <p>{`${
                  element.data.delivery_address?.address?.additional ?? ''
                }`}</p>
              </div>
            ) : (
              <></>
            )}
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
                    {/*<th*/}
                    {/*  scope="col"*/}
                    {/*  className="py-3 px-3"*/}
                    {/*  suppressHydrationWarning={suppressText}*/}
                    {/*>*/}
                    {/*  {t('sp_req')}*/}
                    {/*</th>*/}
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
                  {map(element.data.order_summary.items, (item, idx) => (
                    <>
                      <tr key={idx} className="text-start">
                        <td className="py-3 px-3">{item.quantity}</td>
                        <td className="py-3 px-3">{item.item}</td>
                        {/*<td className="py-3 px-3"></td>*/}
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
                                    key={a.addon_id}
                                    className={`${
                                      item.addon.length > 1 &&
                                      'pe-1 whitespace-nowrap'
                                    }`}
                                  >
                                    {`${a.addon_name} X${a.addon_quantity} `}
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

          {/* promo */}
          {element.data.order_summary.promo_code &&
          element.data.order_summary.promo_code_value ? (
            <div className="flex justify-between items-center py-1 px-4 mt-4">
              <div>
                <p
                  className="pe-2 font-extrabold"
                  suppressHydrationWarning={suppressText}
                >
                  {t('promocode')} :
                </p>
                <p>{`${element.data.order_summary.promo_code}`}</p>
              </div>

              <p>{`- ${element.data.order_summary.promo_code_value}`}</p>
            </div>
          ) : (
            <></>
          )}

          {/* payment summary */}
          <div className={`px-4 py-4`}>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
              <p
                suppressHydrationWarning={suppressText}
                className={`uppercase`}
              >
                {element.data.order_summary.sub_total} {t('kwd')}
              </p>
            </div>

            {parseFloat(element.data.order_summary.tax) ? (
              <div className="flex justify-between mb-3 text-lg">
                <p suppressHydrationWarning={suppressText}>{t('tax')}</p>
                <p
                  suppressHydrationWarning={suppressText}
                  className={`uppercase`}
                >
                  {element.data.order_summary.tax} {t('kwd')}
                </p>
              </div>
            ) : (
              <></>
            )}

            {element.data.order_type.includes('delivery') ? (
              <div className="flex justify-between mb-3 text-lg">
                <p suppressHydrationWarning={suppressText}>
                  {t('delivery_services')}
                </p>
                <p
                  suppressHydrationWarning={suppressText}
                  className={`uppercase`}
                >
                  {element.data.order_summary.delivery_fee} {t('kwd')}
                </p>
              </div>
            ) : (
              <></>
            )}

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
                {element.data.order_summary.total} {t('kwd')}
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
      const { orderId, method, branchAreaId }: any = query;
      if (!orderId || !method || !req.headers.host) {
        return {
          notFound: true,
        };
      }
      const url = req.headers.host;
      if (!branchAreaId) {
        return {
          redirect: {
            destination: `/cart/${method}/select`,
            permanent: false,
          },
        };
      }
      return {
        props: {
          url,
        },
      };
    }
);
