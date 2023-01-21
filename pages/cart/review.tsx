import { Suspense, useEffect } from 'react';
import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useTranslation } from 'react-i18next';
import TrunkClock from '@/appIcons/trunk_clock.svg';
import { suppressText, imageSizes } from '@/constants/*';
import { LocationOnOutlined } from '@mui/icons-material';
import Home from '@/appIcons/home.svg';
import IDCard from '@/appIcons/id_card.svg';
import OrderSummary from '@/appIcons/summary.svg';
import CustomImage from '@/components/CustomImage';
import NotFound from '@/appImages/not_found.png';
import Knet from '@/appImages/knet.png';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GoogleMapReact from 'google-map-react';
import {
  setCurrentModule,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import TextTrans from '@/components/TextTrans';

const CartReview: NextPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setCurrentModule(t('order_review')));
    dispatch(setShowFooterElement('order_review'));
  }, []);
  const { cart, branch, appSetting: { userAgent } } = useAppSelector((state) => state);
  const {data, isSuccess} = useGetCartProductsQuery({ UserAgent: userAgent });
  console.log({cart})
  return (
    <MainContentLayout>
      <Suspense>
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
              <p>{}</p>
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
              <button
                className="text-primary_BG text-base font-semibold"
                suppressHydrationWarning={suppressText}
              >
                {t('change')}
              </button>
            </div>
            <div className="w-full h-36 rounded-md">
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
                        >
                        </GoogleMapReact>
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
              <button
                className="text-primary_BG text-base font-semibold"
                suppressHydrationWarning={suppressText}
              >
                {t('edit')}
              </button>
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
                <h4 className="font-semibold text-base">customer name</h4>
                <p>customer phone</p>
              </div>
            </div>
            <button
              className="text-primary_BG text-base font-semibold"
              suppressHydrationWarning={suppressText}
            >
              {t('edit')}
            </button>
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
          <div className=" pt-5 px-4">
            <div className="mb-10 ">
              <div className="flex px-5">
                <div className="ltr:pr-3 rtl:pl-3 w-1/5">
                  <CustomImage
                    className="w-full  rounded-lg border-[1px] border-gray-200"
                    alt={`${t('item')}`}
                    src={NotFound.src}
                  />
                </div>

                <div className="w-full">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">product name</p>
                      <div className="w-fit pb-2">
                        <p className="text-xs pe-3 text-gray-400 border-e-2 border-gray-400 w-auto">
                          addons
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-primary_BG font-semibold"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('edit')}
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-primary_BG font-semibold">price</p>
                    <button className="text-CustomRed font-semibold">
                      remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              <div className="ps-5">
                <h4
                  className="font-semibold text-lg"
                  suppressHydrationWarning={suppressText}
                >
                  {t('select_payments')}
                </h4>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="bg-gray-200 flex justify-center items-center w-24 h-24">
                <div>
                  <CustomImage
                    src={Knet.src}
                    alt="payment"
                    width={imageSizes.xs}
                    height={imageSizes.xs}
                    className={`w-8 h-8`}
                  />
                </div>
              </div>
              <div className="bg-gray-200 flex justify-center items-center w-24 h-24">
                <div>
                  <CustomImage
                    src={Knet.src}
                    alt="payment"
                    width={imageSizes.xs}
                    height={imageSizes.xs}
                    className={`w-8 h-8`}
                  />
                </div>
              </div>
              <div className="bg-gray-200 flex justify-center items-center w-24 h-24">
                <div>
                  <CustomImage
                    src={Knet.src}
                    alt="payment"
                    width={imageSizes.xs}
                    height={imageSizes.xs}
                    className={`w-8 h-8`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={`px-4 py-4`}>
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
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>{t('subtotal')}</p>
              <p suppressHydrationWarning={suppressText}>{t('kwd')}</p>
            </div>
            <div className="flex justify-between mb-3 text-lg">
              <p suppressHydrationWarning={suppressText}>
                {t('delivery_services')}
              </p>
              <p suppressHydrationWarning={suppressText}>{t('kwd')}</p>
            </div>

            <div className="flex justify-between mb-3 text-lg ">
              <p
                className="font-semibold"
                suppressHydrationWarning={suppressText}
              >
                {t('total')}
              </p>
              <p
                className="text-primary_BG"
                suppressHydrationWarning={suppressText}
              >
                {t('kwd')}
              </p>
            </div>
          </div>
        </div>
      </Suspense>
    </MainContentLayout>
  );
};

export default CartReview;


