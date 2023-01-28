import {
  useState,
  useEffect,
  Suspense,
  forwardRef,
  useRef,
  LegacyRef,
} from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import MainContentLayout from '@/layouts/MainContentLayout';
import DeliveryBtns from '@/components/widgets/cart/DeliveryBtns';
import { appSetting, Prefrences, ServerCart } from '@/types/index';
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
import { isEmpty, isNull, kebabCase, lowerCase } from 'lodash';
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
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { themeColor } from '@/redux/slices/vendorSlice';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';

const schema = yup
  .object()
  .shape({
    address: yup
      .object()
      .shape({
        block: yup.string().max(50),
        street: yup.string().max(100),
        house_no: yup.string().max(50),
        avenue: yup.string().max(50),
        paci: yup.string().max(50),
        floor_no: yup.string().max(50),
        office_no: yup.string().max(50),
        additional: yup.string().max(50),
      })
      .required(),
    longitude: yup.string(),
    latitude: yup.string(),
    customer_id: yup.string().required(),
  })
  .required();

const CartAddress: NextPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    area,
    branch,
    appSetting: { method },
    customer: { userAgent, address, id },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const [openTab, setOpenTab] = useState(1);
  const [show, SetShow] = useState(false);
  const refForm = useRef<any>();
  const [AddAddress, { isLoading: AddAddressLoading }] =
    useCreateAddressMutation();
  const { data: cartItems, isSuccess } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    refetch: () => void;
  }>({
    UserAgent: userAgent,
  });
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
      customer_id: id?.toString(),
      address: {
        block: address.block,
        street: address.street,
        house_no: address.house_no,
        avenue: address.avenue,
        paci: address.paci,
        floor_no: address.floor_no,
        office_no: address.office_no,
        additional: address.additional,
      },
    },
  });

  const CustomTimeInput = forwardRef(({ value, onClick }, ref) => (
    <div className="flex w-full items-center justify-between px-2">
      <input
        className="text-lg outline-none border-none"
        type="text"
        ref={ref}
        value={value}
      ></input>
      <AccessTime onClick={onClick} style={{ color }} />
    </div>
  ));

  const [checkTime, { isLoading: checkTimeLoading }] =
    useCheckTimeAvilabilityMutation();

  const checkTimeAvailability = async () => {
    await checkTime({
      process_type: method,
      area_branch: method === 'delivery' ? area.id : branch.id,
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
              router
                .push(appLinks.orderReview.path)
                .then(() => {
                  dispatch(setprefrences({ ...prefrences }));
                })
                .then(() => {
                  dispatch(
                    showToastMessage({
                      content: `time_and_date_saved_successfully`,
                      type: `success`,
                    })
                  );
                });
            }
            break;
          case 'busy':
            return dispatch(
              showToastMessage({
                content: `shop_is_busy`,
                type: `error`,
              })
            );
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
                content: `unknown_error`,
                type: `error`,
              })
            );
        }
      }
    });
  };

  // address
  const handleSelectMethod = (m: appSetting['method']) => {
    router.push(appLinks.cartSelectMethod(m));
  };

  const handelSaveAddress = async (body: any) => {
    await AddAddress({
      body,
    }).then((r: any) => {
      if (r.data && r.data.status) {
        dispatch(
          showToastMessage({
            content: `address_saved_successfully`,
            type: `success`,
          })
        );
        dispatch(setCustomerAddress(r.data.Data));
        checkTimeAvailability();
      } else {
        if (r.error) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data.msg[`address`][0])),
              type: `error`,
            })
          );
        }
      }
    });
  };

  const onSubmit = async (body: any) => {
    console.log('body', body);
    console.log('method', method);
    if (method === 'pickup') {
      await checkTimeAvailability();
    } else {
      await handelSaveAddress(body);
    }
  };

  useEffect(() => {
    dispatch(setCurrentModule(t('cart_address')));
    dispatch(setShowFooterElement('cart_address'));
    if (
      (isNull(area.id) && isNull(branch.id)) ||
      (isSuccess && !cartItems.data?.Cart) ||
      (isSuccess && cartItems.data?.Cart.length === 0)
    ) {
      router.replace(appLinks.cartSelectMethod(method)).then(() =>
        dispatch(
          showToastMessage({
            content: `select_a_branch_or_area_before_order`,
            type: `warning`,
          })
        )
      );
    }
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);

  const handleNext = () => {
    console.log('fired');
    refForm?.current.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );
  };

  console.log('error', errors);

  return (
    <Suspense>
      <MainContentLayout handleSubmit={handleNext}>
        {/* delivery method buttons */}
        <DeliveryBtns />
        <form id="hook-form" onSubmit={handleSubmit(onSubmit)} ref={refForm}>
          <div className={'px-4'}>
            <div className="bg-gray-200 w-full mt-5 p-0 h-2"></div>

            {method === `delivery` && !isEmpty(area) && (
              <>
                {/* location */}
                <div className="py-5">
                  <div className="flex justify-between">
                    <div className="flex">
                      <LocationOnOutlined style={{ color }} />
                      <h5
                        className="px-2 text-base font-semibold"
                        suppressHydrationWarning={suppressText}
                      >
                        {t('delivery_location')}
                      </h5>
                    </div>
                    <Link
                      href={appLinks.cartSelectMethod(method)}
                      scroll={true}
                      className="text-base font-semibold"
                      style={{ color }}
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
                      href={appLinks.cartSelectMethod(method)}
                      scroll={true}
                      className="text-base font-semibold"
                      style={{ color }}
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
                            (openTab === 1 && 'text-white')
                          }
                          style={{
                            backgroundColor: openTab == 1 ? color : `white`,
                          }}
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
                            (openTab === 2 && 'text-white')
                          }
                          style={{
                            backgroundColor: openTab == 2 ? color : `white`,
                          }}
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
                            (openTab === 3 && 'text-white')
                          }
                          style={{
                            backgroundColor: openTab == 3 ? color : `white`,
                          }}
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
                      {...register('address.block')}
                      required={method === `delivery`}
                      aria-invalid={errors.block ? 'true' : 'false'}
                    />

                    <div>
                      {errors.block?.message.key ? (
                        <p
                          className={`text-sm text-red-800`}
                          suppressHydrationWarning={suppressText}
                        >
                          {t(`${errors.block?.message.key}`, {
                            min: errors.block?.message.values,
                          })}
                        </p>
                      ) : (
                        <p
                          className={`text-sm text-red-800`}
                          suppressHydrationWarning={suppressText}
                        >
                          {t(errors.block?.message)}
                        </p>
                      )}
                    </div>
                    <input
                      placeholder={`${t(`street`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('address.street')}
                      aria-invalid={errors.street ? 'true' : 'false'}
                    />

                    <div>
                      {errors.street?.message.key ? (
                        <p
                          className={`text-sm text-red-800`}
                          suppressHydrationWarning={suppressText}
                        >
                          {t(`${errors.street?.message.key}`, {
                            min: errors.street?.message.values,
                          })}
                        </p>
                      ) : (
                        <p
                          className={`text-sm text-red-800`}
                          suppressHydrationWarning={suppressText}
                        >
                          {t(errors.street?.message)}
                        </p>
                      )}
                    </div>

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
                              {...register('address.house_no')}
                              aria-invalid={errors.house_no ? 'true' : 'false'}
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
                              {...register('address.floor_no')}
                              aria-invalid={errors.floor_no ? 'true' : 'false'}
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
                              {...register('address.office_no')}
                              aria-invalid={errors.office_no ? 'true' : 'false'}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <input
                      placeholder={`${t(`avenue`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('address.avenue')}
                      aria-invalid={errors.avenue ? 'true' : 'false'}
                    />
                    <div>
                      {errors.avenue?.message.key ? (
                        <p
                          className={`text-sm text-red-800`}
                          suppressHydrationWarning={suppressText}
                        >
                          {t(`${errors.avenue?.message.key}`, {
                            min: errors.avenue?.message.values,
                          })}
                        </p>
                      ) : (
                        <p
                          className={`text-sm text-red-800`}
                          suppressHydrationWarning={suppressText}
                        >
                          {t(errors.avenue?.message)}
                        </p>
                      )}
                    </div>

                    <input
                      placeholder={`${t(`paci`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('address.paci')}
                      aria-invalid={errors.paci ? 'true' : 'false'}
                    />

                    <div>
                      {errors.paci?.message.key ? (
                        <p
                          className={`text-sm text-red-800`}
                          suppressHydrationWarning={suppressText}
                        >
                          {t(`${errors.paci?.message.key}`, {
                            min: errors.paci?.message.values,
                          })}
                        </p>
                      ) : (
                        <p
                          className={`text-sm text-red-800`}
                          suppressHydrationWarning={suppressText}
                        >
                          {t(errors.paci?.message)}
                        </p>
                      )}
                    </div>

                    <input
                      placeholder={`${t(`additional`)}`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('address.additional')}
                      aria-invalid={errors.additional ? 'true' : 'false'}
                    />
                  </div>

                  <div>
                    {errors.additional?.message.key ? (
                      <p
                        className={`text-sm text-red-800`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t(`${errors.additional?.message.key}`, {
                          min: errors.additional?.message.values,
                        })}
                      </p>
                    ) : (
                      <p
                        className={`text-sm text-red-800`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t(errors.additional?.message)}
                      </p>
                    )}
                  </div>
                </div>

                {/* delivery prefrences */}
                <div className="mx-4">
                  <div>
                    {errors.customer_id?.message.key ? (
                      <p
                        className={`text-sm text-red-800`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t(`${errors.customer_id?.message.key}`, {
                          min: errors.customer_id?.message.values,
                        })}
                      </p>
                    ) : (
                      <p
                        className={`text-sm text-red-800`}
                        suppressHydrationWarning={suppressText}
                      >
                        {t(errors.customer_id?.message)}
                      </p>
                    )}
                  </div>
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
            {method === `pickup` && !isNull(branch.id) && (
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
          <button type={`submit`} className={`hidden`}>
            submit
          </button>
        </form>
      </MainContentLayout>
    </Suspense>
  );
};
export default CartAddress;
