import { Suspense, useEffect, Fragment, useState } from 'react';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import TrunkClock from '@/appIcons/trunk_clock.svg';
import { suppressText, imageSizes, appLinks, imgUrl } from '@/constants/*';
import {
  CreditCardOutlined,
  LocationOnOutlined,
  ReceiptOutlined,
  HomeOutlined,
} from '@mui/icons-material';
// import Home from '@/appIcons/home.svg';
import CustomImage from '@/components/CustomImage';
import Knet from '@/appImages/knet.svg';
import Cash from '@/appImages/cod.svg';
import CreditCard from '@/appImages/credit_card.svg';
import PersonalDetails from '@/appImages/personal_information.svg';
import GoogleMapReact from 'google-map-react';
import {
  setCurrentModule,
  setShowFooterElement,
  setUrl,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  useAddToCartMutation,
  useGetCartProductsQuery,
} from '@/redux/api/cartApi';
import TextTrans from '@/components/TextTrans';
import {
  filter,
  isEmpty,
  isNull,
  kebabCase,
  lowerCase,
  map,
  toString,
} from 'lodash';
import Link from 'next/link';
import { OrderUser, ProductCart, ServerCart } from '@/types/index';
import { AppQueryResult } from '@/types/queries';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useLazyCreateOrderQuery } from '@/redux/api/orderApi';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useRouter } from 'next/router';
import { setOrder, setPaymentMethod } from '@/redux/slices/orderSlice';
import { CheckCircle, BadgeOutlined } from '@mui/icons-material';
import { wrapper } from '@/redux/store';

type Props = {
  url: string;
};
const CartReview: NextPage<Props> = ({ url }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    OrderUser['PaymentMethod'] | null
  >(null);
  const {
    customer,
    branch: { id: branchId, name_ar: branchAR, name_en: branchEN },
    area: { id: areaId, name_ar: areaAR, name_en: areaEN },
    customer: { userAgent },
    appSetting: { method: process_type },
    cart: { promoEnabled, PromoCode },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const { data: cartItems, isSuccess } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    refetch: () => void;
  }>({
    UserAgent: userAgent,
    area_branch:
      process_type === `pickup`
        ? { 'x-branch-id': branchId }
        : { 'x-area-id': areaId },
    url,
  });
  const [triggerCreateOrder, { isLoading }] = useLazyCreateOrderQuery();
  const [triggerAddToCart] = useAddToCartMutation();
  const paymentMethods: { id: OrderUser['PaymentMethod']; src: any }[] = [
    { id: 'visa', src: <CreditCard /> },
    { id: 'knet', src: <Knet /> },
    { id: 'cash_on_delivery', src: <Cash /> },
  ];

  useEffect(() => {
    dispatch(setCurrentModule('order_review'));
    dispatch(setShowFooterElement('order_review'));
    if (url) {
      dispatch(setUrl(url));
      if (
        (!areaId && !branchId) ||
        (isSuccess && !cartItems.data?.Cart) ||
        (isSuccess && cartItems.data?.Cart.length === 0)
      ) {
        if (router.isReady) {
          router.replace(appLinks.cartSelectMethod(process_type)).then(() =>
            dispatch(
              showToastMessage({
                content: `select_a_branch_or_area_before_order`,
                type: `warning`,
              })
            )
          );
        }
      }
    }
  }, []);

  const handelDisplayAddress = () => {
    if (customer && !isEmpty(customer.address)) {
      const address = filter(
        map(
          customer.address,
          (value, key) =>
            value !== null && key !== `id` && `${key} : ${value}  `
        ),
        (a) => a
      );
      const allAddress = toString(address).replaceAll(',', ' / ');
      return allAddress;
    }
  };

  if (isLoading || !isSuccess || !url) {
    return <LoadingSpinner fullWidth={true} />;
  }

  const handleCreateOrder = async () => {
    if (isNull(customer.id)) {
      router.push(appLinks.customerInfo.path);
    } else if (!customer.address.id && process_type === `delivery`) {
      router.push(appLinks.address.path);
    }
    if (isNull(selectedPaymentMethod)) {
      dispatch(
        showToastMessage({
          content: 'please_select_payment_method',
          type: 'error',
        })
      );
    }
    if (
      !isNull(customer.id) &&
      !isEmpty(selectedPaymentMethod) &&
      selectedPaymentMethod &&
      !isNull(userAgent)
    ) {
      await triggerCreateOrder({
        params: {
          user_id: customer.id,
          ...(process_type === `delivery`
            ? { address_id: customer.address.id }
            : {}),
          order_type: customer.prefrences.type,
          UserAgent: userAgent,
          Messg: customer.notes,
          PaymentMethod: selectedPaymentMethod,
          ...(promoEnabled && PromoCode ? { PromoCode: PromoCode } : {}),
          Date: `${new Date(customer.prefrences.date as Date).getFullYear()}-${
            new Date(customer.prefrences.date as Date).getMonth() + 1
          }-${new Date(customer.prefrences.date as Date).getDate()}`,
          Time: `${(
            '0' + new Date(customer.prefrences.time as Date).getHours()
          ).slice(-2)}:${(
            '0' + new Date(customer.prefrences.time as Date).getMinutes()
          ).slice(-2)}:${(
            '0' + new Date(customer.prefrences.time as Date).getSeconds()
          ).slice(-2)}`,
        },
        area_branch:
          process_type === `delivery`
            ? { 'x-area-id': areaId }
            : { 'x-branch-id': branchId },
        url,
      }).then((r: any) => {
        if (r.data) {
          if (r.data.status) {
            dispatch(setPaymentMethod(selectedPaymentMethod));
            if (selectedPaymentMethod === 'cash_on_delivery') {
              dispatch(setOrder(r.data.data));
              // router.replace(`/order/status/${r.data.data.order_id}/success`);
              router.replace(appLinks.orderSuccess(r.data.data.order_id));
            } else {
              window.open(r.data.Data, '_self');
            }
            dispatch(
              showToastMessage({
                content: `order_created_successfully`,
                type: `success`,
              })
            );
          } else {
            router.replace(appLinks.orderFailure.path);
          }
        } else {
          dispatch(
            showToastMessage({
              content: r.error.data.msg,
              type: `error`,
            })
          );
        }
      });
    }
  };

  const handleRemove = async (element: ProductCart) => {
    const currentItems = filter(
      cartItems.data.Cart,
      (i) => i.id !== element.id
    );
    triggerAddToCart({
      process_type: process_type,
      area_branch: process_type === 'delivery' ? areaId : branchId,
      body: {
        UserAgent: userAgent,
        Cart:
          isSuccess &&
          cartItems.data &&
          cartItems.data.Cart &&
          !isEmpty(currentItems)
            ? currentItems
            : [], // empty Cart Case !!!
      },
      url,
    }).then((r: any) => {
      if (r.data && r.data?.status) {
        dispatch(
          showToastMessage({
            content: `cart_updated_successfully`,
            type: `success`,
          })
        );
      }
    });
  };

  return (
    <Suspense>
      <MainContentLayout
        handleSubmit={handleCreateOrder}
        url={url}
        backRoute={appLinks.cartIndex.path}
      >
        <div className={`mb-[40%]`}>
          {customer.prefrences.type === `delivery_later` ? (
            <div className="flex justify-center items-end p-5">
              <TrunkClock className={`w-16 h-16 grayscale`} />
              <div className="px-6">
                <h4
                  className="font-semibold text-lg capitalize"
                  suppressHydrationWarning={suppressText}
                >
                  {process_type === 'pickup' &&
                    branchId &&
                    t('pickup_time_and_date')}

                  {process_type === 'delivery' &&
                    areaId &&
                    t('delivery_time_and_date')}
                </h4>
                <div className="flex">
                  <p className="pe-5">
                    {customer.prefrences.date &&
                      new Date(customer.prefrences.date).toLocaleDateString()}
                  </p>
                  <p>
                    {customer.prefrences.time &&
                      new Date(customer.prefrences.time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center p-5">
              <TrunkClock className={`w-16 h-16 grayscale`} />
              <div className="px-6">
                <h4
                  className="font-semibold text-lg capitalize"
                  suppressHydrationWarning={suppressText}
                >
                  {t(customer.prefrences.type)}
                </h4>
              </div>
            </div>
          )}

          <div className="bg-gray-200 w-full mt-5 p-0 h-2 px-4"></div>
          <div className={`px-4 py-5 space-y-6`}>
            {process_type === 'pickup' && branchId && (
              <>
                {/* location */}
                <div className="flex justify-between">
                  <div className="flex items-center justify-center">
                    <LocationOnOutlined style={{ color }} />
                    <h5
                      className="px-2 text-base font-semibold capitalize"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('pickup_from')}
                    </h5>
                  </div>
                  <Link
                    href={appLinks.address.path}
                    className="text-base font-semibold capitalize"
                    suppressHydrationWarning={suppressText}
                    style={{ color }}
                  >
                    <TextTrans ar={branchAR} en={branchEN} />
                  </Link>
                </div>
              </>
            )}
            {process_type === 'delivery' && areaId && (
              <>
                {/* location */}
                <div className="flex justify-between">
                  <div className="flex items-center justify-center">
                    <LocationOnOutlined style={{ color }} />
                    <h5
                      className="px-2 text-base font-semibold capitalize"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('deliver_to')}
                    </h5>
                  </div>
                  <Link
                    href={appLinks.cartSelectMethod(process_type)}
                    className="text-base font-semibold capitalize"
                    suppressHydrationWarning={suppressText}
                    style={{ color }}
                  >
                    <TextTrans ar={areaAR} en={areaEN} />
                  </Link>
                </div>
                {/* map */}
                {/* {customer.address.longitude && customer.address.latitude && (
                  <div className="w-full h-36 rounded-md">
                    <GoogleMapReact
                      bootstrapURLKeys={{
                        key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
                        language: 'en',
                        region: 'US',
                      }}
                      defaultCenter={{
                        lat: parseInt(customer.address.latitude),
                        lng: parseInt(customer.address.longitude),
                      }}
                      defaultZoom={11}
                    ></GoogleMapReact>
                  </div>
                )} */}
                {/* address */}
                <div className="flex justify-between gap-x-2">
                  <div className="flex items-center">
                    <HomeOutlined className={`grayscale`} />
                    {customer.address && (
                      <p className="text-xs ps-2 capitalize text-ellipsis overflow-hidden">
                        {handelDisplayAddress()}
                      </p>
                    )}
                  </div>
                  <Link
                    href={appLinks.address.path}
                    className="text-base font-semibold capitalize"
                    suppressHydrationWarning={suppressText}
                    style={{ color }}
                  >
                    {t('edit')}
                  </Link>
                </div>
              </>
            )}
            {/* information */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
<<<<<<< HEAD
                <BadgeOutlined sx={{ color: color }} />
=======
                <PersonalDetails className={`personal-details w-6 h-6`} />
>>>>>>> structure
                <div className="ps-2 capitalize">
                  <h4 className="font-semibold text-base">{customer.name}</h4>
                  <p>{customer.phone}</p>
                </div>
              </div>
              <Link
                href={appLinks.customerInfo.path}
                className="text-base font-semibold capitalize"
                suppressHydrationWarning={suppressText}
                style={{ color }}
              >
                {t('edit')}
              </Link>
            </div>
          </div>
          {/* order summary */}
          <div className="bg-gray-200 w-full my-5 p-0 h-2"></div>
          <div className="px-4">
            <div className="flex items-center pb-4">
              <ReceiptOutlined style={{ color }} />
              <div className="ps-5">
                <h4
                  className="font-semibold text-base capitalize"
                  suppressHydrationWarning={suppressText}
                >
                  {t('order_summary')}
                </h4>
              </div>
            </div>
          </div>
          {isSuccess &&
            cartItems.data &&
            cartItems.data.Cart &&
            cartItems.data?.subTotal > 0 &&
            map(cartItems.data?.Cart, (item: ProductCart, i) => (
              <div key={i}>
                <div className="px-4">
                  <div className="mb-10 ">
                    <div className="flex px-2 rtl:mr-1 ltr:ml-1 items-center">
                      <Link
                        href={`${appLinks.productShow(
                          item.ProductID.toString(),
                          branchId,
                          item.ProductID.toString(),
                          lowerCase(kebabCase(item.ProductName)),
                          areaId
                        )}`}
                        className="ltr:pr-3 rtl:pl-3 w-2/6"
                      >
                        <CustomImage
                          className="w-24 h-24 rounded-lg border-[1px] border-gray-200 shadow-md object-cover"
                          alt={`${t('item')}`}
                          src={imgUrl(item.ProductImage)}
                          width={imageSizes.xs}
                          height={imageSizes.xs}
                        />
                      </Link>
                      <div className="w-full">
                        <div className={`flex justify-between items-center`}>
                          <Link
                            className={`flex grow`}
                            href={`${appLinks.productShow(
                              item.ProductID.toString(),
                              branchId,
                              item.ProductID.toString(),
                              lowerCase(kebabCase(item.ProductName)),
                              areaId
                            )}`}
                          >
                            <p className="font-semibold capitalize">
                              <TextTrans
                                ar={item.ProductName}
                                en={item.ProductName}
                              />
                            </p>
                          </Link>
                          <div className="flex">
                            <Link
                              href={`${appLinks.productShow(
                                item.ProductID.toString(),
                                branchId,
                                item.ProductID.toString(),
                                lowerCase(kebabCase(item.ProductName)),
                                areaId
                              )}`}
                            >
                              {item.SalePrice !== item.Price ? (
                                <div>
                                  <div
                                    className="uppercase flex grow line-through"
                                    suppressHydrationWarning={suppressText}
                                    style={{ color }}
                                  >
                                    {item.Price} {t('kwd')}
                                  </div>
                                  <div
                                    className="uppercase flex grow"
                                    suppressHydrationWarning={suppressText}
                                    style={{ color }}
                                  >
                                    {item.SalePrice} {t('kwd')}
                                  </div>
                                </div>
                              ) : (
                                <div
                                  className="uppercase flex grow"
                                  suppressHydrationWarning={suppressText}
                                  style={{ color }}
                                >
                                  {item.Price} {t('kwd')}
                                </div>
                              )}
                            </Link>
                          </div>
                        </div>
                        {/* qty */}
                        <div className="flex">
                          <div className="w-fit pb-2">
                            <div
                              className={`flex text-gray-400 w-auto flex-wrap justify-between items-center`}
                            >
                              {!isEmpty(item.QuantityMeters) &&
                                map(item.QuantityMeters, (q, i) => (
                                  <Fragment key={i}>
                                    {map(q.addons, (addon, i) => (
                                      <>
                                        <TextTrans
                                          key={i}
                                          className={`ltr:border-r-2 ltr:last:border-r-0 ltr:first:pr-1 rtl:border-l-2 rtl:last:border-l-0 rtl:first:pl-1  text-xs capitalize`}
                                          ar={addon.name}
                                          en={addon.name}
                                        />
                                        {addon.price ?? ``}
                                      </>
                                    ))}
                                  </Fragment>
                                ))}
                            </div>
                          </div>
                        </div>
                        {item.ExtraNotes && (
                          <div
                            className={`w-full border-t border-gray-200 py-1 mb-1`}
                          >
                            <p className={`text-xs`}>
                              {t('notes')} : {item.ExtraNotes}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-between items-end">
                          <div>
                            <div
                              className="relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium focus:z-10  capitalize rounded-md"
                              style={{ color }}
                            >
                              {`${t(`qty`)} : `}
                              <span className={`ltr:pl-2 rtl:pr-2`}>
                                {item.Quantity}
                              </span>
                            </div>
                          </div>
                          <button
                            className="text-red-700 capitalize"
                            suppressHydrationWarning={suppressText}
                            onClick={() => handleRemove(item)}
                          >
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div className="bg-gray-200 w-full mt-5 p-0 h-2"></div>
          <div className="px-4 py-4">
            <div className="flex items-center py-3">
              <CreditCardOutlined style={{ color: color }} />
              <div className="ps-5 py-2">
                <h4
                  className="font-semibold text-lg"
                  suppressHydrationWarning={suppressText}
                >
                  {t('select_payments')}
                </h4>
              </div>
            </div>
            <div className="flex justify-between">
              {map(paymentMethods, (m, i) => (
                <div key={i}>
                  <button
                    onClick={() => setSelectedPaymentMethod(m.id)}
                    className={`${
                      selectedPaymentMethod == m.id &&
                      `ring-2 ring-lime-500 ring-offset-1`
                    } flex justify-center items-center w-24 h-24 rounded-md`}
                  >
                    <div>
                      <div className={`w-16 h-16`}>{m.src}</div>
                    </div>
                  </button>
                  <div
                    className={`pt-5 flex justify-center items-center space-x-1 text-lime-500 ${
                      selectedPaymentMethod == m.id ? 'block' : 'hidden'
                    }`}
                  >
                    <CheckCircle className="checkCircle" />
                    <p>{t('selected')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/*<div className="bg-gray-200 w-full mt-5 p-0 h-2"></div>*/}
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default CartReview;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);
