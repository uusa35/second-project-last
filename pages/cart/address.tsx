import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import DeliveryBtns from '@/components/widgets/cart/DeliveryBtns';
import { appSetting } from '@/types/index';
import { setCartMethod } from '@/redux/slices/appSettingSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useRouter } from 'next/router';
import {
  AccessTimeOutlined,
  LocationOnOutlined,
  CalendarMonthOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import GoogleMapReact from 'google-map-react';
import { useState } from 'react';
import ApartmentIcon from '@/appIcons/apartment.svg';
import ApartmentAcitveIcon from '@/appIcons/apartment_active.svg';
import OfficeIcon from '@/appIcons/office.svg';
import OfficeAcitveIcon from '@/appIcons/office_active.svg';
import Image from 'next/image';
import { Home } from '@mui/icons-material';
import { addressInputField, submitBtnClass, suppressText } from '@/constants/*';

const CartAddress: NextPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [openTab, setOpenTab] = useState(1);
  const [show, SetShow] = useState(false);
  const handleSelectMethod = (m: appSetting['method']) => {
    dispatch(setCartMethod(m));
    router.push('/cart/select');
  };
  return (
    <MainContentLayout>
      <div className={'px-4'}>
        {/* delivery method buttons */}
        <DeliveryBtns handleSelectMethod={handleSelectMethod} />
        <div className="bg-gray-200 w-full mt-5 p-0 h-2"></div>

        {/* location */}
        <div className="py-5">
          <div className="flex justify-between">
            <div className="flex">
              <LocationOnOutlined className="text-primary_BG" />
              <h5
                className="px-2 text-base font-semibold"
                suppressHydrationWarning={suppressText}
              >
                {t('delivery_location')}
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
            {/* <GoogleMapReact
                        bootstrapURLKeys={{
                        // remove the key if you want to fork
                        key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
                        language: 'en',
                        region: 'US',
                        }}
                        defaultCenter={{
                        lat: parseInt(b.lat),
                        lng: parseInt(b.lang),
                        }}
                        defaultZoom={11}
                        >  
                        </GoogleMapReact> */}
          </div>
          <div className="flex justify-between">
            <p className="text-md">location</p>
            <button
              className="text-primary_BG text-base font-semibold"
              suppressHydrationWarning={suppressText}
            >
              {t('edit')}
            </button>
          </div>
        </div>

        {/* address */}
        <div className="flex flex-wrap">
          <div className="w-full">
            <ul
              className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
              role="tablist"
            >
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                    (openTab === 1 ? 'text-white bg-primary_BG' : 'bg-white')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(1);
                  }}
                  data-toggle="tab"
                  href="#home"
                  role="tablist"
                >
                  <div className="flex items-center justify-center">
                    <Home className={`${openTab === 1 && 'text-white'}`} />
                    <p className="px-2" suppressHydrationWarning={suppressText}>
                      {t('home')}
                    </p>
                  </div>
                </a>
              </li>
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                    (openTab === 2 ? 'text-white bg-primary_BG' : 'bg-white')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(2);
                  }}
                  data-toggle="tab"
                  href="#apartment"
                  role="tablist"
                >
                  <div className="flex items-center justify-center">
                    <Image
                      src={openTab === 2 ? ApartmentAcitveIcon : ApartmentIcon}
                      alt="icon"
                      width={20}
                      height={20}
                    />
                    <p className="px-2" suppressHydrationWarning={suppressText}>
                      {t('appartment')}
                    </p>
                  </div>
                </a>
              </li>
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className={
                    'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                    (openTab === 3 ? 'text-white bg-primary_BG' : 'bg-white')
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(3);
                  }}
                  data-toggle="tab"
                  href="#office"
                  role="tablist"
                >
                  <div className="flex items-center justify-center">
                    <Image
                      src={openTab === 3 ? OfficeAcitveIcon : OfficeIcon}
                      alt="icon"
                      width={20}
                      height={20}
                    />
                    <p className="px-2" suppressHydrationWarning={suppressText}>
                      {t('office')}
                    </p>
                  </div>
                </a>
              </li>
            </ul>
            <input
              type="text"
              placeholder={`${t(`block`)}`}
              className={`${addressInputField}`}
              suppressHydrationWarning={suppressText}
            />

            <input
              type="text"
              placeholder={`${t(`street`)}`}
              className={`${addressInputField}`}
              suppressHydrationWarning={suppressText}
            />
            <div className="relative flex flex-col">
              <div className="flex-auto">
                <div className="tab-content tab-space">
                  <div className={openTab === 1 ? 'block' : 'hidden'} id="home">
                    <input
                      type="text"
                      placeholder={`${t(`house_no`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                    />
                  </div>
                  <div
                    className={openTab === 2 ? 'block' : 'hidden'}
                    id="apartment"
                  >
                    <input
                      type="text"
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      placeholder={`${t(`floor#`)}`}
                    />
                  </div>
                  <div
                    className={openTab === 3 ? 'block' : 'hidden'}
                    id="office"
                  >
                    <input
                      type="text"
                      placeholder={`${t(`office_no`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                    />
                  </div>
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder={`${t(`avenue`)}`}
              className={`${addressInputField}`}
              suppressHydrationWarning={suppressText}
            />

            <input
              type="text"
              placeholder={`${t(`paci`)}`}
              className={`${addressInputField}`}
              suppressHydrationWarning={suppressText}
            />

            <input
              type="text"
              placeholder={`${t(`additional`)}`}
              className={`${addressInputField}`}
              suppressHydrationWarning={suppressText}
            />
          </div>
        </div>
        <div className="mx-4">
          <p
            className="my-5 font-semibold text-base"
            suppressHydrationWarning={suppressText}
          >
            {t('delivery_prefrences')}
          </p>
          <div className="flex items-center mb-4">
            <input
              id="deliverNow"
              type="radio"
              name="deliver"
              value=""
              className="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 
                            dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onClick={() => SetShow(false)}
            />
            <label
              htmlFor="deliverNow"
              className="ms-2 font-medium text-gray-900 dark:text-gray-300"
              suppressHydrationWarning={suppressText}
            >
              {t('deliver_now')}
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="deliverLater"
              type="radio"
              name="deliver"
              value=""
              className="w-8 h-8 text-blue-600 bg-gray-100 border-gray-300 
                            rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onClick={() => SetShow(true)}
            />
            <label
              htmlFor="deliverLater"
              className="ms-2 font-medium text-gray-900 dark:text-gray-300"
              suppressHydrationWarning={suppressText}
            >
              {t('deliver_later')}
            </label>
          </div>
          {show && (
            <div>
              <div className="flex justify-between py-2">
                <p className="text-base font-semibold">date</p>
                <CalendarMonthOutlined className="text-primary_BG text-2xl" />
              </div>
              <div className="flex justify-between py-2">
                <p className="text-base font-semibold">time</p>
                <AccessTimeOutlined className="text-primary_BG text-2xl" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-gray-100 w-full">
        <div className="bg-sky-600 w-full h-32 flex justify-center items-center rounded-t-xl">
          <button
            className="bg-sky-500 rounded-full text-white h-8 px-4 py-1"
            suppressHydrationWarning={suppressText}
          >
            {t('continue')}
          </button>
        </div>
      </div>
    </MainContentLayout>
  );
};
export default CartAddress;
