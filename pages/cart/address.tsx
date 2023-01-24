import { useState, useEffect, Suspense, forwardRef } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import MainContentLayout from '@/layouts/MainContentLayout';
import DeliveryBtns from '@/components/widgets/cart/DeliveryBtns';
import { appSetting, Prefrences } from '@/types/index';
import {
  resetShowFooterElement,
  setCartMethod,
  setCurrentModule,
  setShowFooterElement,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/router';
import { LocationOnOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import GoogleMapReact from 'google-map-react';

import ApartmentIcon from '@/appIcons/apartment.svg';
import ApartmentAcitveIcon from '@/appIcons/apartment_active.svg';
import OfficeIcon from '@/appIcons/office.svg';
import OfficeAcitveIcon from '@/appIcons/office_active.svg';
import Image from 'next/image';
import { Home } from '@mui/icons-material';
import { addressInputField, appLinks, suppressText } from '@/constants/*';
import { isEmpty } from 'lodash';
import {
  useCheckTimeAvilabilityMutation,
  useCreateAddressMutation,
} from '@/redux/api/addressApi';
import {
  setCustomerAddress,
  setprefrences,
} from '@/redux/slices/customerSlice';
import { AccessTime } from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const CartAddress: NextPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    area,
    branch,
    appSetting: { method },
    customer: { address, id },
  } = useAppSelector((state) => state);

  const [openTab, setOpenTab] = useState(1);
  const [show, SetShow] = useState(false);
  const [selectedAddressFields, setSelectedAddressFields] = useState({});
  const [prefrences, setPrefrences] = useState<Prefrences>({
    type:
      method === 'delivery'
        ? 'delivery_now'
        : method === 'pickup'
        ? 'pickup_now'
        : '',
    date: new Date(),
    time: new Date(),
  });

  const schema = yup
    .object()
    .shape({
      block: yup.string().required(),
      street: yup.string(),
      house_no: yup.string(),
      avenue: yup.string(),
      paci: yup.string(),
      floor_no: yup.string(),
      office_no: yup.string(),
      additional: yup.string(),
    }).required();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      address_type: openTab ?? ``,
      longitude: ``,
      latitude: ``,
      customer_id: id ?? ``,
      address: {
        block: ``,
        street: ``,
        house_no: ``,
        avenue: ``,
        paci: ``,
        floor_no: ``,
        office_no: ``,
        additional: ``,
      },
    },
  });
  const CustomTimeInput = forwardRef(({ value, onClick }, ref) => (
    <div
      className="flex w-full items-center justify-between px-2"
      // dir={i18n.language === "en" ? "ltr" : "rtl"}
    >
      <input
        className="text-lg outline-none border-none"
        type="text"
        ref={ref}
        value={value}
      ></input>
      <AccessTime onClick={onClick} className="text-primary_BG" />
    </div>
  ));

  const [checkTime, { isLoading: checkTimeLoading }] =
    useCheckTimeAvilabilityMutation();

  const checkTimeAvilability = async () => {
    await checkTime({
      process_type: method,
      area_branch:
        method === 'delivery' ? area.id : method === 'pickup' && branch.id,
      params: {
        type: prefrences.type,
        date: `${new Date(prefrences.date as Date).getFullYear()}-${
          new Date(prefrences.date as Date).getMonth() + 1
        }-${new Date(prefrences.date as Date).getDate()}`,
        time: `${new Date(prefrences.time as Date).getHours()}:${new Date(
          prefrences.time as Date
        ).getMinutes()}:${new Date(prefrences.time as Date).getSeconds()}`,
      },
    }).then((r: any) => {
      if (r.data?.status) {
        switch (r.data.Data.toLowerCase()) {
          case 'open':
            {
              dispatch(
                showToastMessage({
                  content: `time_and_date_saved_successfully`,
                  type: `success`,
                })
              );
              dispatch(setprefrences({ ...prefrences }));
              router.push(appLinks.orderReview.path);
            }
            break;
          case 'busy':
            return null;
            break;
          case 'close':
            return dispatch(
              showToastMessage({
                content: `shop is ${r.data.Data.toLowerCase()} at this time`,
                type: `error`,
              })
            );
            break;

          default:
            dispatch(
              showToastMessage({
                content: `something went wrong`,
                type: `error`,
              })
            );
        }
      }
    });
  };

  // address
  const handleSelectMethod = (m: appSetting['method']) => {
    dispatch(setCartMethod(m));
    router.push('/cart/select');
  };

  // address
  const handelOninputChange = (nm: string, value: any) => {
    setSelectedAddressFields((prev) => ({ ...prev, [nm]: value }));
  };

  const [AddAddress, { isLoading: AddAddressLoading }] =
    useCreateAddressMutation();

  const handelSaveAddress = async (body: any) => {
    await AddAddress({
     body
    }).then((r: any) => {
      if (r.data && r.data.status) {
        dispatch(
          showToastMessage({
            content: `address_saved_successfully`,
            type: `success`,
          })
        );
        dispatch(setCustomerAddress(r.data.Data));
        checkTimeAvilability();
      } 
    });
  };
  console.log({ errors });
  const onSubmit = async (body: any) => {
    console.log('the body', body);
    if (method === 'pickup') {
      await checkTimeAvilability();
    }
    if (method === 'delivery') {
      await handelSaveAddress(body);

      // console.log({
      //   type: prefrences.type,
      //   date: `${new Date(prefrences.date as Date).getFullYear()}-${
      //     new Date(prefrences.date as Date).getMonth() + 1
      //   }-${new Date(prefrences.date as Date).getDate()}`,
      //   time: `${new Date(prefrences.time as Date).getHours()}:${new Date(
      //     prefrences.time as Date
      //   ).getMinutes()}:${new Date(prefrences.time as Date).getSeconds()}`,
      // });
    }
  };

  // console.log('branches', area);
  // console.log('locations', branch);
  // console.log('method', method);

  useEffect(() => {
    dispatch(setCurrentModule(t('cart_address')));
    dispatch(setShowFooterElement('cart_address'));
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);

  useEffect(() => {
    console.log(prefrences);
  }, [prefrences]);

  return (
    <Suspense>
      <MainContentLayout>
        {/* delivery method buttons */}
        <DeliveryBtns handleSelectMethod={handleSelectMethod} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={'px-4'}>
            <div className="bg-gray-200 w-full mt-5 p-0 h-2"></div>

            {method === `delivery` && !isEmpty(area) && (
              <>
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
                    <Link
                      href={appLinks.cartSelectMethod.path}
                      scroll={false}
                      className="text-primary_BG text-base font-semibold"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('change')}
                    </Link>
                  </div>
                  <div className="w-full h-36 rounded-md my-3">
                    <GoogleMapReact
                      bootstrapURLKeys={{
                        // remove the key if you want to fork
                        key: 'AIzaSyChibV0_W_OlSRJg2GjL8TWVU8CzpRHRAE',
                        language: 'en',
                        region: 'US',
                      }}
                      defaultCenter={{
                        lat: parseInt(address.latitude)
                          ? parseInt(address.latitude)
                          : 29.2733964,
                        lng: parseInt(address.longitude)
                          ? parseInt(address.longitude)
                          : 47.4979476,
                      }}
                      onChange={() => {}}
                      defaultZoom={11}
                    ></GoogleMapReact>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-md">{area.name}</p>
                    <Link
                      href={appLinks.cartSelectMethod.path}
                      scroll={false}
                      className="text-primary_BG text-base font-semibold"
                      suppressHydrationWarning={suppressText}
                    >
                      {t('edit')}
                    </Link>
                  </div>
                </div>

                {/* address */}
                <div className="flex flex-wrap">
                  <div className="w-full">
                    <ul
                      className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
                      role="tablist"
                    >
                      <li className=" ltr:ml-2 rtl:mr-2 flex-auto text-center border border-stone-300 rounded-md">
                        <a
                          className={
                            'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                            (openTab === 1
                              ? 'text-white bg-primary_BG'
                              : 'bg-white')
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
                            <Home
                              className={`${openTab === 1 && 'text-white'}`}
                            />
                            <p
                              className="px-2"
                              suppressHydrationWarning={suppressText}
                            >
                              {t('home')}
                            </p>
                          </div>
                        </a>
                      </li>
                      <li className=" ltr:ml-2 rtl:mr-2 flex-auto text-center border border-stone-300 rounded-md">
                        <a
                          className={
                            'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                            (openTab === 2
                              ? 'text-white bg-primary_BG'
                              : 'bg-white')
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
                              src={
                                openTab === 2
                                  ? ApartmentAcitveIcon
                                  : ApartmentIcon
                              }
                              alt="icon"
                              width={20}
                              height={20}
                            />
                            <p
                              className="px-2"
                              suppressHydrationWarning={suppressText}
                            >
                              {t('appartment')}
                            </p>
                          </div>
                        </a>
                      </li>
                      <li className=" ltr:ml-2 rtl:mr-2 flex-auto text-center border border-stone-300 rounded-md">
                        <a
                          className={
                            'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                            (openTab === 3
                              ? 'text-white bg-primary_BG'
                              : 'bg-white')
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
                              src={
                                openTab === 3 ? OfficeAcitveIcon : OfficeIcon
                              }
                              alt="icon"
                              width={20}
                              height={20}
                            />
                            <p
                              className="px-2"
                              suppressHydrationWarning={suppressText}
                            >
                              {t('office')}
                            </p>
                          </div>
                        </a>
                      </li>
                    </ul>
                    <input
                      placeholder={`${t(`block`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('block')}
                      aria-invalid={errors.block ? 'true' : 'false'}
                      onChange={(e) => setValue('block', e.target.value)}
                    />
                    <div>
                      {errors?.block?.message && (
                        <p
                          className={`text-base text-red-800 font-semibold py-2 capitalize`}
                          suppressHydrationWarning={suppressText}
                        >
                          {t(`block_is_required`)}
                        </p>
                      )}
                    </div>
                    <input
                      placeholder={`${t(`street`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('street')}
                      aria-invalid={errors.street ? 'true' : 'false'}
                      onChange={(e) => setValue('street', e.target.value)}
                    />

                    <div className="relative flex flex-col">
                      <div className="flex-auto">
                        <div className="tab-content tab-space">
                          <div
                            className={openTab === 1 ? 'block' : 'hidden'}
                            id="home"
                          >
                            <input
                              placeholder={`${t(`house_no`)}`}
                              className={`${addressInputField}`}
                              suppressHydrationWarning={suppressText}
                              {...register('house_no')}
                              aria-invalid={errors.house_no ? 'true' : 'false'}
                              onChange={(e) =>
                                setValue('house-no', e.target.value)
                              }
                            />
                          </div>
                          <div
                            className={openTab === 2 ? 'block' : 'hidden'}
                            id="apartment"
                          >
                            <input
                              className={`${addressInputField}`}
                              suppressHydrationWarning={suppressText}
                              placeholder={`${t(`floor#`)}`}
                              {...register('floor_no')}
                              aria-invalid={errors.floor_no ? 'true' : 'false'}
                              onChange={(e) =>
                                setValue('floor_no', e.target.value)
                              }
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
                              {...register('office_no')}
                              aria-invalid={errors.office_no ? 'true' : 'false'}
                              onChange={(e) =>
                                setValue('office_no', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <input
                      placeholder={`${t(`avenue`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('avenue')}
                      aria-invalid={errors.avenue ? 'true' : 'false'}
                      onChange={(e) => setValue('avenue', e.target.value)}
                    />

                    <input
                      placeholder={`${t(`paci`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('paci')}
                      aria-invalid={errors.paci ? 'true' : 'false'}
                      onChange={(e) => setValue('paci', e.target.value)}
                    />

                    <input
                      placeholder={`${t(`additional`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('additional')}
                      aria-invalid={errors.additional ? 'true' : 'false'}
                      onChange={(e) => setValue('additional', e.target.value)}
                    />
                  </div>
                </div>

                {/* delivery prefrences */}
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
                      checked={prefrences.type === 'delivery_now'}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500
                              dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onClick={() => {
                        SetShow(false);
                        setPrefrences({
                          type: 'delivery_now',
                          date: new Date(),
                          time: new Date(),
                        });
                      }}
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
                      checked={prefrences.type === 'delivery_later'}
                      className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300
                              rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      onClick={() => {
                        SetShow(true);
                        setPrefrences({
                          ...prefrences,
                          type: 'delivery_later',
                        });
                      }}
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
                    <div className={`flex flex-col gap-3`}>
                      <div className="flex justify-between py-2 border-b-4 border-stone-100">
                        <input
                          type="date"
                          className={`border-none w-full`}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => {
                            setPrefrences({
                              ...prefrences,
                              date: new Date(e.target.value),
                            });
                          }}
                        />
                      </div>
                      <div className="flex justify-between py-2 border-b-4 border-stone-100">
                        <DatePicker
                          selected={prefrences.time as Date}
                          onChange={(date) => {
                            setPrefrences({
                              ...prefrences,
                              time: date as Date,
                            });
                          }}
                          customInput={<CustomTimeInput />}
                          startDate={new Date()}
                          showTimeSelect
                          showTimeSelectOnly
                          timeCaption="Time"
                          dateFormat="hh:mm"
                          locale="en"
                          minTime={prefrences.time as Date}
                          maxTime={new Date(new Date().setHours(23, 59))}
                        ></DatePicker>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* pickup prefrences */}
            {method === `pickup` && !isEmpty(branch) && (
              <div className="mx-4">
                <p
                  className="my-5 font-semibold text-base"
                  suppressHydrationWarning={suppressText}
                >
                  {t('pickup_prefrences')}
                </p>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="pickup"
                    checked={prefrences.type === 'pickup_now'}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500
                          dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => {
                      SetShow(false);
                      setPrefrences({
                        type: 'pickup_now',
                        date: new Date(),
                        time: new Date(),
                      });
                    }}
                  />
                  <label
                    htmlFor="deliverNow"
                    className="ms-2 font-medium text-gray-900 dark:text-gray-300"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('pickup_now')}
                  </label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="pickup"
                    checked={prefrences.type === 'pickup_later'}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300
                          rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => {
                      SetShow(true);
                      setPrefrences({
                        ...prefrences,
                        type: 'pickup_later',
                      });
                    }}
                  />
                  <label
                    htmlFor="deliverLater"
                    className="ms-2 font-medium text-gray-900 dark:text-gray-300"
                    suppressHydrationWarning={suppressText}
                  >
                    {t('pickup_later')}
                  </label>
                </div>
                {show && (
                  <div className={`flex flex-col gap-3`}>
                    <div className="flex justify-between py-2 border-b-4 border-stone-100">
                      <input
                        type="date"
                        className={`border-none w-full`}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => {
                          setPrefrences({
                            ...prefrences,
                            date: new Date(e.target.value),
                          });
                        }}
                      />
                      {/*<CalendarDaysIcon className="text-primary_BG w-8 h-8" />*/}
                    </div>
                    <div className="flex justify-between py-2 border-b-4 border-stone-100">
                      <DatePicker
                        selected={prefrences.time as Date}
                        onChange={(date) => {
                          setPrefrences({ ...prefrences, time: date as Date });
                        }}
                        customInput={<CustomTimeInput />}
                        startDate={new Date()}
                        showTimeSelect
                        showTimeSelectOnly
                        timeCaption="Time"
                        dateFormat="hh:mm"
                        locale="en"
                        // minTime={prefrences.time as Date}
                      ></DatePicker>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <input type="submit" />
        </form>
      </MainContentLayout>
    </Suspense>
  );
};
export default CartAddress;
