import {
  useState,
  useEffect,
  useMemo,
  Suspense,
  forwardRef,
  useRef,
} from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import MainContentLayout from '@/layouts/MainContentLayout';
import DeliveryBtns from '@/components/widgets/cart/DeliveryBtns';
import { Prefrences, ServerCart } from '@/types/index';
import {
  resetShowFooterElement,
  setCurrentModule,
  setShowFooterElement,
  setUrl,
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
import TextTrans from '@/components/TextTrans';
import { wrapper } from '@/redux/store';

type Props = {
  url: string;
};
const CartAddress: NextPage<Props> = ({ url }): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    area,
    branch,
    appSetting: { method },
    customer: { userAgent, address, id: customer_id },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const [addressTabType, setAddressTabType] = useState(1);
  const [show, SetShow] = useState(false);
  const refForm = useRef<any>();
  const [triggerAddAddress, { isLoading: AddAddressLoading }] =
    useCreateAddressMutation();
  const { data: cartItems, isSuccess } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
    refetch: () => void;
  }>({
    UserAgent: userAgent,
    url,
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
  const schema = yup
    .object()
    .shape({
      method: yup.string().required(),
      address_type: yup.number().required(),
      block: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      street: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      house_no: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (address_type === 1 && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      floor_no: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (address_type === 2 && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      office_no: yup.mixed().when('address_type', (address_type, schema) => {
        if (address_type === 3 && method === `delivery`) {
          return schema.required(t(`validation.required`));
        }
        return schema.nullable(true);
      }),
      avenue: yup.string().max(50).nullable(true),
      paci: yup.string().max(50).nullable(true),
      additional: yup.string().nullable(true),
      longitude: yup.string(),
      latitude: yup.string(),
      customer_id: yup.string().required(),
    })
    .required();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      method,
      address_type: addressTabType ?? 1,
      longitude: ``,
      latitude: ``,
      customer_id: customer_id?.toString(),
      block: address.block ?? ``,
      street: address.street ?? ``,
      house_no: address.house_no ?? ``,
      floor_no: address.floor_no ?? ``,
      office_no: address.office_no ?? ``,
      avenue: address.avenue,
      paci: address.paci,
      additional: address.additional,
    },
  });

  const CustomTimeInput = forwardRef(({ value, onClick }, ref) => (
    <div className="flex w-full items-center justify-between px-2">
      <input
        className="text-lg outline-none border-none"
        type="text"
        ref={ref}
        value={`${value}`}
      ></input>
      <AccessTime onClick={onClick} style={{ color }} />
    </div>
  ));

  const [triggerCheckTime, { isLoading: checkTimeLoading }] =
    useCheckTimeAvilabilityMutation();

  const checkTimeAvailability = async () => {
    await triggerCheckTime({
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
      url,
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

  useMemo(() => setValue('address_type', addressTabType), [addressTabType]);

  const handelSaveAddress = async (body: any) => {
    await triggerAddAddress({
      body: {
        address_type: body.address_type,
        longitude: body.longitude,
        latitude: body.latitude,
        customer_id: body.customer_id,
        address: {
          block: body.block,
          street: body.street,
          house_no: body.house_no,
          avenue: body.avenue,
          paci: body.paci,
          floor_no: body.floor_no,
          office_no: body.office_no,
          additional: body.additional,
        },
      },
      url,
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
    if (method === 'pickup') {
      await checkTimeAvailability();
    } else {
      await handelSaveAddress(body);
    }
  };

  useEffect(() => {
    dispatch(setCurrentModule('cart_address'));
    dispatch(setShowFooterElement('cart_address'));
    if (url) {
      dispatch(setUrl(url));
    }
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

  useEffect(() => {
    if (customer_id) {
      setValue('customer_id', customer_id);
    }
  }, [customer_id]);

  const handleNext = () => {
    refForm?.current.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true })
    );
  };

  return (
    <Suspense>
      <MainContentLayout handleSubmit={handleNext} url={url}>
        {/* delivery method buttons */}
        <DeliveryBtns />
        <div className="flex justify-center items-center">
          {area && (
            <TextTrans
              className={`font-semibold capitalize`}
              ar={area.name_ar}
              en={area.name_en}
            />
          )}
          {branch && (
            <TextTrans
              className={`font-semibold capitalize`}
              ar={branch.name_ar}
              en={branch.name_en}
            />
          )}
        </div>
        <form id="hook-form" onSubmit={handleSubmit(onSubmit)} ref={refForm}>
          <input type="hidden" {...register('method')} value={method} />
          <input
            type="hidden"
            {...register('address_type')}
            value={addressTabType}
          />
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
                      className="grid grid-cols-3 gap-x-2 mb-0 list-none pt-3 pb-4 !text-sm lg:text-base"
                      role="tablist"
                    >
                      <li
                        className={`flex-auto text-center  rounded-md cursor-pointer
                      ${addressTabType === 1 && 'text-white'}
                      `}
                        style={{
                          backgroundColor:
                            addressTabType === 1 ? color : `white`,
                        }}
                      >
                        <div
                          className={
                            'font-bold uppercase px-5 py-3 shadow-lg rounded border border-stone-300'
                          }
                          onClick={() => setAddressTabType(1)}
                          data-toggle="tab"
                          href="#home"
                          role="tablist"
                        >
                          <div className="flex items-center justify-evenly flex-wrap">
                            <Home
                              className={`${
                                addressTabType === 1 && 'text-white'
                              }`}
                            />
                            <p suppressHydrationWarning={suppressText}>
                              {t('house')}
                            </p>
                          </div>
                        </div>
                      </li>
                      <li
                        className={`flex-auto text-center  rounded-md cursor-pointer
                        ${addressTabType === 2 && 'text-white'}
                        `}
                        style={{
                          backgroundColor:
                            addressTabType === 2 ? color : `white`,
                        }}
                      >
                        <div
                          className={
                            'font-bold uppercase px-5 py-3 shadow-lg rounded border border-stone-300'
                          }
                          onClick={() => setAddressTabType(2)}
                          data-toggle="tab"
                          href="#apartment"
                          role="tablist"
                        >
                          <div className="flex items-center justify-evenly flex-wrap">
                            <Image
                              src={
                                addressTabType === 2
                                  ? ApartmentAcitveIcon
                                  : ApartmentIcon
                              }
                              alt="icon"
                              width={20}
                              height={20}
                              className="grayscale"
                            />
                            <p suppressHydrationWarning={suppressText}>
                              {t('appartment')}
                            </p>
                          </div>
                        </div>
                      </li>
                      <li
                        className={` flex-auto text-center  rounded-md cursor-pointer
                        ${addressTabType === 3 && 'text-white'}
                        `}
                        style={{
                          backgroundColor:
                            addressTabType === 3 ? color : `white`,
                        }}
                      >
                        <div
                          className={
                            'font-bold uppercase px-5 py-3 shadow-lg rounded border border-stone-300'
                          }
                          onClick={() => setAddressTabType(3)}
                          data-toggle="tab"
                          href="#office"
                          role="tablist"
                        >
                          <div className="flex items-center justify-evenly">
                            <Image
                              src={
                                addressTabType === 3
                                  ? OfficeAcitveIcon
                                  : OfficeIcon
                              }
                              alt="icon"
                              width={20}
                              height={20}
                              className="grayscale"
                            />
                            <p suppressHydrationWarning={suppressText}>
                              {t('office')}
                            </p>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <input
                      placeholder={`${t(`block`)}*`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('block')}
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
                      placeholder={`${t(`street`)}*`}
                      className={`${addressInputField}`}
                      suppressHydrationWarning={suppressText}
                      {...register('street')}
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
                          {/* house_no */}
                          <div
                            className={
                              addressTabType === 1 ? 'block' : 'hidden'
                            }
                            id="home"
                          >
                            <input
                              placeholder={`${t(`house_no`)}${
                                addressTabType === 1 ? `*` : ``
                              }`}
                              className={`${addressInputField}`}
                              suppressHydrationWarning={suppressText}
                              {...register('house_no')}
                              aria-invalid={errors.house_no ? 'true' : 'false'}
                            />
                          </div>
                          <div>
                            {errors.house_no?.message.key ? (
                              <p
                                className={`text-sm text-red-800`}
                                suppressHydrationWarning={suppressText}
                              >
                                {t(`${errors.house_no?.message.key}`, {
                                  min: errors.house_no?.message.values,
                                })}
                              </p>
                            ) : (
                              <p
                                className={`text-sm text-red-800`}
                                suppressHydrationWarning={suppressText}
                              >
                                {t(errors.house_no?.message)}
                              </p>
                            )}
                          </div>
                          {/* floor no */}
                          <div
                            className={
                              addressTabType === 2 ? 'block' : 'hidden'
                            }
                            id="apartment"
                          >
                            <input
                              placeholder={`${t(`floor_no`)}${
                                addressTabType === 2 ? `*` : ``
                              }`}
                              className={`${addressInputField}`}
                              suppressHydrationWarning={suppressText}
                              {...register('floor_no')}
                              aria-invalid={errors.floor_no ? 'true' : 'false'}
                            />
                          </div>
                          <div>
                            {errors.floor_no?.message.key ? (
                              <p
                                className={`text-sm text-red-800`}
                                suppressHydrationWarning={suppressText}
                              >
                                {t(`${errors.floor_no?.message.key}`, {
                                  min: errors.floor_no?.message.values,
                                })}
                              </p>
                            ) : (
                              <p
                                className={`text-sm text-red-800`}
                                suppressHydrationWarning={suppressText}
                              >
                                {t(errors.floor_no?.message)}
                              </p>
                            )}
                          </div>
                          {/* office_no */}
                          <div
                            className={
                              addressTabType === 3 ? 'block' : 'hidden'
                            }
                            id="office"
                          >
                            <input
                              placeholder={`${t(`office_no`)}${
                                addressTabType === 3 ? `*` : ``
                              }`}
                              className={`${addressInputField}`}
                              suppressHydrationWarning={suppressText}
                              {...register('office_no')}
                              aria-invalid={errors.office_no ? 'true' : 'false'}
                            />
                          </div>
                          <div>
                            {errors.office_no?.message.key ? (
                              <p
                                className={`text-sm text-red-800`}
                                suppressHydrationWarning={suppressText}
                              >
                                {t(`${errors.office_no?.message.key}`, {
                                  min: errors.office_no?.message.values,
                                })}
                              </p>
                            ) : (
                              <p
                                className={`text-sm text-red-800`}
                                suppressHydrationWarning={suppressText}
                              >
                                {t(errors.office_no?.message)}
                              </p>
                            )}
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
                      {...register('paci')}
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
                      {...register('additional')}
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
