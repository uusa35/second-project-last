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
import { HomeOutlined } from '@mui/icons-material';
import {
  addressInputField,
  appLinks,
  arboriaFont,
  suppressText,
  toEn,
} from '@/constants/*';
import { isEmpty, kebabCase, lowerCase, upperCase } from 'lodash';
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
import { addressSchema } from 'src/validations';

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
    locale: { isRTL },
    customer: { userAgent, address, id: customer_id },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const [addressTabType, setAddressTabType] = useState(
    address.type === 'APARTMENT' ? 2 : address.type === 'OFFICE' ? 3 : 1
  );
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
    area_branch:
      method === `pickup`
        ? { 'x-branch-id': branch.id }
        : { 'x-area-id': area.id },
    url,
  });
  const dateRef = useRef<HTMLInputElement>(null);
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
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(addressSchema(method, t)),
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
      building_no: address.building_no ?? ``,
      office_no: address.office_no ?? ``,
      avenue: address.avenue,
      paci: address.paci,
      additional: address.additional,
    },
  });

  const CustomTimeInput = forwardRef(({ value, onClick }, ref) => (
    <div className={`flex w-full items-center justify-between px-2`}>
      <input
        className={`text-lg outline-none border-none ${arboriaFont}`}
        type="text"
        ref={ref}
        value={`${toEn(value)}`}
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
          building_no: body.building_no,
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
        if (r.error && r.error.data && r.error.data.msg) {
          dispatch(
            showToastMessage({
              content: lowerCase(kebabCase(r.error.data?.msg[`address`][0])),
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

    if (!area.id && !branch.id) {
      router.replace(appLinks.cartSelectMethod(method)).then(() =>
        dispatch(
          showToastMessage({
            content: `select_a_branch_or_area_before_order`,
            type: `warning`,
          })
        )
      );
    }

    if (
      (isSuccess && !cartItems.data?.Cart) ||
      (isSuccess && cartItems.data?.Cart.length === 0)
    ) {
      dispatch(
        showToastMessage({
          content: `your_cart_is_empty`,
          type: `warning`,
        })
      );
      router.replace(appLinks.home.path);
    }

    // if customer id is not found
    if (!customer_id) {
      router.replace(appLinks.customerInfo.path).then(() =>
        dispatch(
          showToastMessage({
            content: `enter_your_information_to_proceed`,
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
      <MainContentLayout
        handleSubmit={handleNext}
        url={url}
        backRoute={appLinks.cartIndex.path}
      >
        {/* delivery method buttons */}
        <DeliveryBtns />
        <div className={`flex justify-center items-center`}>
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
                      <p className="text-md">{`${t('change')}`}</p>
                    </Link>
                  </div>
                </div>

                {/* address */}
                <div className="flex flex-wrap">
                  <div className="w-full">
                    <ul
                      className="grid grid-rows-3 gap-y-3 md:grid-rows-1 md:grid-cols-3 md:gap-x-2 mb-0 list-none pt-3 pb-4 !text-sm lg:text-base"
                      role="tablist"
                    >
                      <li
                        className={`flex-auto text-center  rounded-md cursor-pointer h-fit
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
                          <div className="flex items-center justify-center gap-x-2">
                            <HomeOutlined
                              className={`${
                                addressTabType === 1 && '!text-white'
                              }`}
                            />
                            <p suppressHydrationWarning={suppressText}>
                              {t('house')}
                            </p>
                          </div>
                        </div>
                      </li>
                      <li
                        className={`flex-auto text-center  rounded-md cursor-pointer h-fit
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
                          <div className="flex items-center justify-center gap-x-2">
                            {/* <Image
                              src={
                                addressTabType === 2
                                  ? ApartmentAcitveIcon
                                  : ApartmentIcon
                              }
                              alt="icon"
                              width={20}
                              height={20}
                              className="grayscale"
                            /> */}

                            <div className="">
                              {addressTabType === 2 ? (
                                <ApartmentAcitveIcon />
                              ) : (
                                <ApartmentIcon />
                              )}
                            </div>

                            <p suppressHydrationWarning={suppressText}>
                              {t('appartment')}
                            </p>
                          </div>
                        </div>
                      </li>
                      <li
                        className={` flex-auto text-center  rounded-md cursor-pointer h-fit
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
                          <div className="flex items-center justify-center gap-x-2">
                            {/* <Image
                              src={
                                addressTabType === 3
                                  ? OfficeAcitveIcon
                                  : OfficeIcon
                              }
                              alt="icon"
                              width={20}
                              height={20}
                              className="grayscale"
                            /> */}
                            {addressTabType === 3 ? (
                              <OfficeAcitveIcon />
                            ) : (
                              <OfficeIcon />
                            )}
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
                      onChange={(e) => setValue('block', toEn(e.target.value))}
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
                      onChange={(e) => setValue('street', toEn(e.target.value))}
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
                              onChange={(e) =>
                                setValue('house_no', toEn(e.target.value))
                              }
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
                              onChange={(e) =>
                                setValue('floor_no', toEn(e.target.value))
                              }
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
                          {/* building_no */}
                          <div
                            className={
                              addressTabType === 2 || addressTabType === 3
                                ? 'block'
                                : 'hidden'
                            }
                            id="apartment"
                          >
                            <input
                              placeholder={`${t(`building_no`)}${
                                addressTabType === 2 || addressTabType === 3
                                  ? `*`
                                  : ``
                              }`}
                              className={`${addressInputField}`}
                              suppressHydrationWarning={suppressText}
                              {...register('building_no')}
                              onChange={(e) =>
                                setValue('building_no', toEn(e.target.value))
                              }
                              aria-invalid={
                                errors.building_no ? 'true' : 'false'
                              }
                            />
                          </div>
                          <div>
                            {errors.building_no?.message.key ? (
                              <p
                                className={`text-sm text-red-800`}
                                suppressHydrationWarning={suppressText}
                              >
                                {t(`${errors.building_no?.message.key}`, {
                                  min: errors.building_no?.message.values,
                                })}
                              </p>
                            ) : (
                              <p
                                className={`text-sm text-red-800`}
                                suppressHydrationWarning={suppressText}
                              >
                                {t(errors.building_no?.message)}
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
                              onChange={(e) =>
                                setValue('office_no', toEn(e.target.value))
                              }
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
                      onChange={(e) => setValue('avenue', toEn(e.target.value))}
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
                      onChange={(e) => setValue('paci', toEn(e.target.value))}
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

                    <textarea
                      cols={2}
                      placeholder={`${t(`delivery_instructions`)}`}
                      className={`${addressInputField} p-0`}
                      suppressHydrationWarning={suppressText}
                      {...register('additional')}
                      onChange={(e) =>
                        setValue('additional', toEn(e.target.value))
                      }
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
                      {/* date */}
                      <div
                        className={`flex justify-between p-2 border-b-4 border-stone-100 ${arboriaFont}`}
                      >
                        <input
                          ref={dateRef}
                          type="date"
                          className={`${
                            isRTL ? `text-right` : `text-left`
                          } border-none w-full px-0 focus:border-none focus:ring-transparent`}
                          min={toEn(new Date().toISOString().split('T')[0])}
                          // value={prefrences.date as Date}
                          onChange={(e) => {
                            setPrefrences({
                              ...prefrences,
                              date: new Date(toEn(e.target.value)),
                            });
                            dateRef?.current?.blur();
                          }}
                        />
                        <span
                          className={`relative left-0 top-2.5`}
                          onClick={(e) => {
                            dateRef?.current?.click();
                            dateRef?.current?.showPicker();
                          }}
                          onChange={() => dateRef?.current?.blur()}
                          onFocus={() => dateRef?.current?.showPicker()}
                          onBlur={() => dateRef?.current?.blur()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                            />
                          </svg>
                        </span>
                      </div>

                      {/* time */}
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
                          {...(prefrences.date?.setHours(0, 0, 0, 0) ==
                          new Date().setHours(0, 0, 0, 0)
                            ? {
                                minTime: new Date(),
                                maxTime: new Date(new Date().setHours(23, 59)),
                              }
                            : {})}
                          // minTime={new Date()}
                          // maxTime={new Date(new Date().setHours(23, 59))}
                        ></DatePicker>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* pickup prefrences */}
            {method === `pickup` && branch.id && (
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
                    {/* date */}
                    <div className="flex justify-between py-2 border-b-4 border-stone-100">
                      <input
                        type="date"
                        ref={dateRef}
                        className={`border-none w-full`}
                        min={new Date().toISOString().split('T')[0]}
                        // value={(prefrences.date as Date).toDateString()}
                        onChange={(e) => {
                          setPrefrences({
                            ...prefrences,
                            date: new Date(e.target.value),
                          });
                          dateRef?.current?.blur();
                        }}
                      />
                      <span
                        className={`relative left-0 top-2.5`}
                        onClick={(e) => {
                          dateRef?.current?.click();
                          dateRef?.current?.showPicker();
                        }}
                        onChange={() => dateRef?.current?.blur()}
                        onFocus={() => dateRef?.current?.showPicker()}
                        onBlur={() => dateRef?.current?.blur()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                          />
                        </svg>
                      </span>
                      {/*<CalendarDaysIcon className="text-primary_BG w-8 h-8" />*/}
                    </div>

                    {/* time */}
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
                        {...(prefrences.date?.setHours(0, 0, 0, 0) ==
                        new Date().setHours(0, 0, 0, 0)
                          ? {
                              minTime: new Date(),
                              maxTime: new Date(new Date().setHours(23, 59)),
                            }
                          : {})}
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
