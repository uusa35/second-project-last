import { Suspense, useEffect } from 'react';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import TrunkClock from '@/appIcons/trunk_clock.svg';
import { suppressText, imageSizes, appLinks } from '@/constants/*';
import { LocationOnOutlined } from '@mui/icons-material';
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
import { map } from 'lodash';
import Link from 'next/link';
import { QuantityMeters } from '@/types/index';
import PaymentSummary from '@/components/widgets/cart/review/PaymentSummary';
import { removeFromCart } from '@/redux/slices/cartSlice';

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
  console.log({customer})
  const { data, isSuccess } = useGetCartProductsQuery({ UserAgent: userAgent });
  const handleRemove = async (id: any) => {
    await dispatch(removeFromCart(id));
    await dispatch(
      showToastMessage({
        content: `item_removed_from_cart`,
        type: `info`,
      })
    );
  };
  const paymentMethods = [
    {id: "visa", src: Visa},
    {id: "knet", src: Knet},
    {id: "cash", src: Cash}

  ]
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
                className="font-semibold text-lg"
                suppressHydrationWarning={suppressText}
              >
                {t('expected_delivery_time')}
              </h4>
              <p>{customer.prefrences.time}</p>
            </div>
          </div>
          <div className="bg-gray-200 w-full mt-5 p-0 h-2 px-4"></div>
          {/* location */}
          <div className="py-5 px-4">
            <div className="flex justify-between">
              <div className="flex">
                <LocationOnOutlined className="text-primary_BG" />
                <h5
                  className="px-2 text-base font-semibold"
                  suppressHydrationWarning={suppressText}
                >
                  {t('delivery_to')}
                </h5>
              </div>
              <Link
                href={{
                  pathname: appLinks.address.path
                }}
                className="text-primary_BG text-base font-semibold"
                suppressHydrationWarning={suppressText}
              >
                {t('change')}
              </Link>
            </div>
            <div className="w-full h-36 rounded-md my-4">
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
                  language: 'en',
                  region: 'US',
                }}
                defaultCenter={{
                  lat: parseInt(branch.lat),
                  lng: parseInt(branch.lang),
                }}
                defaultZoom={11}
              ></GoogleMapReact>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <CustomImage
                  src={Home.src}
                  alt="home"
                  width={imageSizes.xs}
                  height={imageSizes.xs}
                  className={`w-8 h-8`}
                />
                <p className="text-md ps-5">location</p>
              </div>
              <Link href={{
                pathname: "/cart/select"
              }}
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
              <div className="ps-5">
                <h4 className="font-semibold text-base">{customer.name}</h4>
                <p>{customer.phone}</p>
              </div>
            </div>
            <Link href={{
              pathname: "/customer/info"
            }}
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
                  className="font-semibold text-base"
                  suppressHydrationWarning={suppressText}
                >
                  {t('order_summary')}
                </h4>
              </div>
            </div>
          </div>
          {map(cart.items, (item) => <div key={item.ProductID} className=" pt-5 px-4">
            <div className="mb-10">
              <div className="flex">
                <div className="ltr:pr-3 rtl:pl-3 w-1/5">
                  <CustomImage
                    className="w-full  rounded-lg border-[1px] border-gray-200"
                    alt={`${t('item')}`}
                    src={item.image ? item.image: NotFound.src}
                  />
                </div>

                <div className="w-full">
                  <div className="flex justify-between">
                    <div>
                    <Link
                            href={`${appLinks.productShow(
                              item.ProductID.toString(),
                              branchId,
                              item.ProductID,
                              item.ProductName,
                              areaId
                            )}`}
                          >
                            <p className="font-semibold">
                              <TextTrans ar={item.name_ar} en={item.name_en} />
                            </p>
                          </Link>
                          <div className="flex">
                            {map(
                              item.QuantityMeters,
                              (a: QuantityMeters, i) => (
                                <div className="w-fit pb-2" key={i}>
                                  <p
                                    className={`text-xs px-2 pe-3 text-gray-400 w-auto ${
                                      item.QuantityMeters.length > 1 &&
                                      'border-e-2 border-gray-400'
                                    }`}
                                  >
                                    <TextTrans
                                      ar={a.addons[0].name_ar}
                                      en={a.addons[0].name_en}
                                    />
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                    </div>
                    <button
                      className="text-primary_BG font-semibold capitalize"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('edit')}
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-primary_BG font-semibold">{item.totalPrice}</p>
                    <button
                      className="text-CustomRed capitalize font-semibold"
                      suppressHydrationWarning={suppressText}
                      onClick={() => handleRemove(item.id)}
                    >
                      {t('remove')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>)}
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
            <div className='flex justify-between'>
              {map(paymentMethods, (method) => <button key={method.id}
              className="bg-gray-200 flex justify-center items-center w-24 h-24 rounded-md">
                <div>
                  <CustomImage
                    src={method.src}
                    alt="payment"
                    width={imageSizes.xs}
                    height={imageSizes.xs}
                    className={`w-10 h-10`}
                  />
                </div>
              </button>)}
            </div>
          </div>
          
          <div className='px-4'>
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
            {<PaymentSummary
                total={parseFloat(cart.total)}
                subTotal={parseFloat(cart.subTotal)}
                delivery={cart.delivery_fees}
                isLoading={false}
              />}
          </div>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default CartReview;
