import { useEffect, Suspense, useState } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { Vendor } from '@/types/index';
import { wrapper } from '@/redux/store';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import MainHead from '@/components/MainHead';
import Clock from '@/appIcons/clock.svg';
import DeliveryIcon from '@/appIcons/delivery.svg';
import PreOrderAvailabilityIcon from '@/appIcons/availability.svg';
import PaymentIcon from '@/appIcons/payment.svg';
import Knet from '@/appImages/knet.png';
import CashOnDelivery from '@/appImages/cash_on_delivery.jpg';
import Visa from '@/appImages/visa.png';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { submitBtnClass, suppressText } from '@/constants/*';
import {
  setCurrentModule,
  resetShowFooterElement,
  setShowFooterElement,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch } from '@/redux/hooks';
import CustomImage from '@/components/CustomImage';
import Feedback from '@/pages/feedback';
import FeedbackIcon from '@/appIcons/feedback.svg';
import Facebook from '@/appIcons/facebook.svg';
import Twitter from '@/appIcons/twitter.svg';
import Instagram from '@/appIcons/instagram.svg';
type Props = {
  element: Vendor;
};
type DetailsItem = {
  icon: any;
  text: string;
  content: any;
};
const VendorShow: NextPage<Props> = ({ element }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentModule(element.name));
  }, [element]);
  useEffect(() => {
    dispatch(setCurrentModule(t('vendor_show')));
    dispatch(setShowFooterElement(`vendor_show`));
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);
  function handleClosePopup() {
    SetShowModal(false);
  }
  const handleOpenPopup = () => {
    SetShowModal(true);
  };
  const [showModal, SetShowModal] = useState(false);
  const VendorDetailsItem = ({ icon, text, content }: DetailsItem) => {
    return (
      <div className="flex justify-between px-4 py-6 m-3 shadow-md capitalize">
        <div className="flex items-center">
          {icon}
          <p
            className="px-2 font-semibold"
            suppressHydrationWarning={suppressText}
          >
            {t(text)}
          </p>
        </div>
        <div>
          <p suppressHydrationWarning={suppressText}>{t(content)}</p>
        </div>
      </div>
    );
  };
  return (
    <Suspense>
      <MainHead
        title={element.name}
        description={element.desc}
        mainImage={element.logo}
      />
      <MainContentLayout>
        <VendorDetailsItem
          icon={
            <CustomImage
              src={Clock.src}
              width={20}
              height={20}
              alt={t('work_hours')}
              className={`w-6 h-6`}
            />
          }
          text="work_hours"
          content={element.WorkHours}
        />
        <VendorDetailsItem
          icon={
            <CustomImage
              src={DeliveryIcon.src}
              width={22}
              height={22}
              alt={t('delivery_time')}
              className={`w-6 h-6`}
            />
          }
          text="delivery_time"
          content={element.DeliveryTime}
        />
        <VendorDetailsItem
          icon={
            <CustomImage
              src={PreOrderAvailabilityIcon.src}
              width={25}
              height={25}
              alt={t('preorder_availability')}
              className={`w-6 h-6`}
            />
          }
          text="preorder_availability"
          content={element.Preorder_availability}
        />
        <div className="px-4 py-6 shadow-md">
          <div className="flex justify-between pb-20 ps-3">
            <div className="flex items-center">
              <CustomImage
                src={PaymentIcon.src}
                width={25}
                height={25}
                alt={t('payment_methods')}
                className={`w-6 h-6`}
              />
              <p
                className="px-2 font-semibold"
                suppressHydrationWarning={suppressText}
              >
                {t('payment_methods')}
              </p>
            </div>
            <div className="flex items-center">
              {element.Payment_Methods.visa && (
                <Link href={'/'} className="px-5">
                  <CustomImage
                    src={Visa.src}
                    className="h-10 w-12"
                    alt={t('visa')}
                  />
                </Link>
              )}
              {element.Payment_Methods.cash_on_delivery && (
                <Link href={'/'} className="px-5">
                  <CustomImage
                    className="h-10 w-12"
                    src={CashOnDelivery.src}
                    alt={t('cash_on_delivery')}
                  />
                </Link>
              )}
              {element.Payment_Methods.knet && (
                <Link href={'/'} className="px-5">
                  <CustomImage className="h-8 w-12" src={Knet.src} alt="knet" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="w-full py-8 px-4">
          <div className="py-5">
            <button className={`${submitBtnClass}`}>
              <div className="flex justify-center items-center">
                <CustomImage
                  className="w-5 h-5"
                  src={FeedbackIcon.src}
                  alt={t('feedback')}
                />
                <p
                  className="text-white px-2"
                  suppressHydrationWarning={suppressText}
                  onClick={handleOpenPopup}
                >
                  {t('leave_feedback')}
                </p>
              </div>
            </button>
          </div>
          <div className="flex justify-evenly items-center w-[80%] m-auto">
            <Link href={'/'}>
              <CustomImage
                className="w-5 h-5"
                src={Facebook.src}
                alt={t('facebook')}
              />
            </Link>
            <Link href={'/'}>
              <CustomImage
                className="w-5 h-5"
                src={Instagram.src}
                alt={t('instagram')}
              />
            </Link>
            <Link href={'/'}>
              <CustomImage
                className="w-5 h-5"
                src={Twitter.src}
                alt={t('twiiter')}
              />
            </Link>
          </div>
        </div>
        <Feedback
          right={true}
          isOpen={showModal}
          ariaHideApp={false}
          onRequestClose={handleClosePopup}
        />
      </MainContentLayout>
    </Suspense>
  );
};

export default VendorShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale }) => {
      const { data: element, isError } = await store.dispatch(
        vendorApi.endpoints.getVendor.initiate({ lang: locale })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.Data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          element: element.Data,
        },
      };
    }
);
