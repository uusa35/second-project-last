import { Suspense, useEffect, Fragment } from 'react';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import TrunkClock from '@/appIcons/trunk_clock.svg';
import { suppressText, imageSizes, appLinks } from '@/constants/*';
import { EditOutlined, LocationOnOutlined } from '@mui/icons-material';
import Home from '@/appIcons/home.svg';
import IDCard from '@/appIcons/id_card.svg';
import OrderSummary from '@/appIcons/summary.svg';
import CustomImage from '@/components/CustomImage';
import NotFound from '@/appImages/not_found.png';
import Knet from '@/appImages/knet.png';
import Cash from '@/appImages/cash_on_delivery.jpg';
import Visa from '@/appImages/visa.png';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GoogleMapReact from 'google-map-react';
import {
  setCurrentModule,
  setShowFooterElement,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import TextTrans from '@/components/TextTrans';
import { isEmpty, map } from 'lodash';
import Link from 'next/link';
import { ProductCart, ServerCart } from '@/types/index';
import PaymentSummary from '@/components/widgets/cart/review/PaymentSummary';
import { AppQueryResult } from '@/types/queries';

const CartReview: NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setCurrentModule(t('order_review')));
    dispatch(setShowFooterElement('order_review'));
  }, []);
  const {
    cart,
    branch,
    customer,
    area,
    branch: { id: branchId },
    area: { id: areaId },
    customer: { userAgent },
  } = useAppSelector((state) => state);

  const {
    data: cartItems,
    isSuccess,
    isLoading,
    refetch: refetcCart,
  } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    isLoading: boolean;
    refetch: () => void;
  }>({
    UserAgent: userAgent,
  });
  const handleRemove = async (id: any) => {
    await dispatch(
      showToastMessage({
        content: `item_removed_from_cart`,
        type: `info`,
      })
    );
  };
  const paymentMethods = [
    { id: 'visa', src: Visa.src },
    { id: 'knet', src: Knet.src },
    { id: 'cash', src: Cash.src },
  ];

  return (
    <Suspense>
      <MainContentLayout>
        <div>
          <div className="flex justify-center items-center py-5 px-4">
            <CustomImage
              src={TrunkClock.src}
              alt={`${t('trunk')}`}
              width={imageSizes.sm}
              height={imageSizes.sm}
              className={`w-8 h-8`}
            />
            <div className="px-2">
              <h4
                className="font-semibold text-lg capitalize"
                suppressHydrationWarning={suppressText}
              >
                {t('expected_delivery_time')}
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
          <div className="bg-gray-200 w-full mt-5 p-0 h-2 px-4"></div>
          {/* location */}
          <div className="py-5 px-4">
            <div className="flex justify-between">
              <div className="flex">
                <LocationOnOutlined className="text-primary_BG" />
                <h5
                  className="px-2 text-base font-semibold capitalize"
                  suppressHydrationWarning={suppressText}
                >
                  {t('delivery_to')}
                </h5>
              </div>
              <Link
                href={{
                  pathname: appLinks.address.path,
                }}
                className="text-primary_BG text-base font-semibold pb-4 capitalize"
                suppressHydrationWarning={suppressText}
              >
                {t('change')}
              </Link>
            </div>
            {customer.address.longitude && customer.address.latitude && (
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
            )}

            <div className="flex justify-between pt-4">
              <div className="flex items-center">
                <CustomImage
                  src={Home.src}
                  alt="home"
                  width={imageSizes.xs}
                  height={imageSizes.xs}
                  className={`w-8 h-8`}
                />
                {customer.address.address &&
                  map(customer.address.address, (address, idx) => (
                    <div key={idx} className="flex">
                      <p className="text-md ps-5 capitalize">{address}</p>
                    </div>
                  ))}
              </div>
              <Link
                href={appLinks.cartSelectMethod.path}
                className="text-primary_BG text-base font-semibold capitalize"
                suppressHydrationWarning={suppressText}
              >
                {t('edit')}
              </Link>
            </div>
          </div>
          <div className="flex justify-between items-center py-3 px-4">
            <div className="flex items-center">
              <CustomImage
                src={IDCard.src}
                alt="id"
                width={imageSizes.xs}
                height={imageSizes.xs}
                className={`w-8 h-8`}
              />
              <div className="ps-5 capitalize">
                <h4 className="font-semibold text-base">{customer.name}</h4>
                <p>{customer.phone}</p>
              </div>
            </div>
            <Link
              href={appLinks.customerInfo.path}
              className="text-primary_BG text-base font-semibold capitalize"
              suppressHydrationWarning={suppressText}
            >
              {t('edit')}
            </Link>
          </div>
          <div className="px-4">
            <div className="flex items-center py-3">
              <CustomImage
                src={OrderSummary.src}
                alt="id"
                width={imageSizes.xs}
                height={imageSizes.xs}
                className={`w-8 h-8`}
              />
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
          <div className="bg-gray-200 w-full my-5 p-0 h-2"></div>
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
                          item.ProductName,
                          areaId
                        )}`}
                        className="ltr:pr-3 rtl:pl-3 w-1/5"
                      >
                        <CustomImage
                          className="w-full rounded-lg border-[1px] border-gray-200 shadow-md"
                          alt={`${t('item')}`}
                          src={item.image}
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
                              item.ProductName,
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
                              className="text-primary_BG px-2 capitalize"
                              suppressHydrationWarning={suppressText}
                              href={appLinks.cartIndex.path}
                            >
                              {t('edit')}
                            </Link>
                            <Link
                              href={`${appLinks.productShow(
                                item.ProductID.toString(),
                                branchId,
                                item.ProductID.toString(),
                                item.ProductName,
                                areaId
                              )}`}
                            >
                              <EditOutlined />
                            </Link>
                          </div>
                        </div>
                        {/* qty */}
                        <div className="flex">
                          <div className="w-fit pb-2">
                            <div
                              className={`flex text-gray-400 w-auto flex-wrap justify-between`}
                            >
                              {!isEmpty(item.QuantityMeters) &&
                                map(item.QuantityMeters, (q, i) => (
                                  <Fragment key={i}>
                                    {map(q.addons, (addon, i) => (
                                      <>
                                        <TextTrans
                                          key={i}
                                          className={`ltr:border-r-2 ltr:last:border-r-0 ltr:first:pr-1 rtl:border-l-2 rtl:last:border-l-0 rtl:first:pl-1 px-1 text-xs capitalize`}
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
                      </div>
                    </div>

                    <div className="px-3 flex justify-between items-center mt-3">
                      <span className="flex rounded-xl shadow-sm">
                        <button
                          type="button"
                          className="relative -ml-px inline-flex items-center  bg-gray-100 px-4 py-2 text-sm font-medium text-primary_BG  focus:z-10 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 capitalize"
                        >
                          {t(`qty`)}
                          <span className={`ltr:pl-2 rtl:pr-2`}>
                            {item.Quantity}
                          </span>
                        </button>
                      </span>
                      <div>
                        <p
                          className="text-primary_BG capitalize"
                          suppressHydrationWarning={suppressText}
                        >
                          {item.Price} {t('kwd')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div className="bg-gray-200 w-full mt-5 p-0 h-2"></div>
          <div className="px-4">
            <div className="flex items-center py-3">
              <CustomImage
                src={OrderSummary.src}
                alt="payment"
                width={imageSizes.xs}
                height={imageSizes.xs}
                className={`w-8 h-8`}
              />
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
              {map(paymentMethods, (m) => (
                <button
                  key={m.id}
                  className="bg-gray-200 flex justify-center items-center w-24 h-24 rounded-md"
                >
                  <div>
                    <CustomImage
                      src={m.src}
                      alt="payment"
                      width={imageSizes.xs}
                      height={imageSizes.xs}
                      className={`w-10 h-10`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="px-4">
            <div className="flex items-center py-3">
              <ReceiptIcon className="text-primary_BG" />
              <div className="ps-5">
                <h4
                  className="font-semibold text-lg"
                  suppressHydrationWarning={suppressText}
                >
                  {t('payment_summary')}
                </h4>
              </div>
            </div>
            {isSuccess &&
              cartItems &&
              cartItems.data &&
              cartItems.data.total &&
              cartItems.data.subTotal && <PaymentSummary />}
          </div>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default CartReview;
