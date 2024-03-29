import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import {
  appLinks,
  arboriaFont,
  gessFont,
  imageSizes,
  suppressText,
  tajwalFont,
  toEn,
} from '@/constants/*';
import { BadgeOutlined, EmailOutlined, Phone } from '@mui/icons-material';
import GreyLine from '@/components/GreyLine';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-number-input';
import { isSupportedCountry } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useEffect, Suspense } from 'react';
import { ServerCart } from '@/types/index';
import {
  setCurrentModule,
  setShowFooterElement,
  setUrl,
  showToastMessage,
} from '@/redux/slices/appSettingSlice';
import { useDispatch } from 'react-redux';
// import { useSaveCustomerInfoMutation } from '@/redux/api/CustomerApi';
import { useRouter } from 'next/router';
import { setCustomer } from '@/redux/slices/customerSlice';
import { useAppSelector } from '@/redux/hooks';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomImage from '@/components/CustomImage';
import ContactImage from '@/appImages/contact_info.png';
import { themeColor } from '@/redux/slices/vendorSlice';
import { isNull, startCase } from 'lodash';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { wrapper } from '@/redux/store';
import { customerInfoSchema } from 'src/validations';
import PersonalDetails from '@/appImages/personal_information.svg';

type Props = {
  url: string;
};

const CustomerInformation: NextPage<Props> = ({ url }): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    customer,
    appSetting: { method },
    customer: {
      userAgent,
      address: { phone },
    },
    branch: { id: branchId },
    area: { id: areaId },
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const { data: cartItems, isSuccess } = useGetCartProductsQuery<{
    data: AppQueryResult<ServerCart>;
    isSuccess: boolean;
  }>({
    UserAgent: userAgent,
    area_branch:
      method === `pickup`
        ? { 'x-branch-id': branchId }
        : { 'x-area-id': areaId },
    url,
  });
  // const [triggerSaveCustomerInfo] = useSaveCustomerInfoMutation();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(customerInfoSchema),
    defaultValues: {
      id: customer?.id ?? 0,
      name: customer?.name ?? ``,
      email: customer?.email ?? ``,
      phone: customer?.phone ?? ``,
    },
  });
  useEffect(() => {
    dispatch(setCurrentModule('customer_info'));
    dispatch(setShowFooterElement(`customerInfo`));
    if (url) {
      dispatch(setUrl(url));
    }
    if (
      (!areaId && !branchId) ||
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
  }, []);

  const onSubmit = async (body: any) => {
    // console.log({ body });
    dispatch(setCustomer({ ...body }));
    router.push(appLinks.address.path);

    // await triggerSaveCustomerInfo({
    //   body,
    //   url,
    // }).then((r: any) => {
    //   if (r.data && r.data.Data && r.data.status) {
    //     dispatch(setCustomer(r.data.Data));
    //     router.push(appLinks.address.path);
    //     // .then(() => dispatch(setCustomer(r.data.Data)));
    //   } else {
    //     dispatch(
    //       showToastMessage({
    //         content: `all_fields_r_required`,
    //         type: 'error',
    //       })
    //     );
    //   }
    // });
  };

  // console.log({ errors });

  return (
    <Suspense>
      <MainContentLayout
        handleSubmit={handleSubmit(onSubmit)}
        url={url}
        backRoute={appLinks.cartIndex.path}
      >
        <div className="flex-col justify-center h-full px-5">
          <div className="flex justify-center py-10 lg:my-5 lg:pb-5">
            <PersonalDetails className={`my-10 lg:my-0 w-32 h-32`} />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`lg:mt-10 ${router.locale === 'ar' && arboriaFont}`}
            >
              <div className="flex gap-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
                <BadgeOutlined style={{ color }} />
                <input
                  {...register('name')}
                  className={`border-0 w-full focus:ring-transparent outline-0 ${arboriaFont}`}
                  placeholder={`${startCase(`${t('enter_your_name')}`)}`}
                  onChange={(e) => setValue('name', toEn(e.target.value))}
                  aria-invalid={errors.name ? 'true' : 'false'}
                />
              </div>
              <div>
                {errors?.name?.message && (
                  <p
                    className={`text-base text-red-800 font-semibold py-2 capitalize`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('name_is_required')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
                <EmailOutlined style={{ color }} />
                <input
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className={`border-0 w-full focus:ring-transparent outline-0 ${arboriaFont}`}
                  onChange={(e) => setValue('email', toEn(e.target.value))}
                  placeholder={`${startCase(`${t('enter_your_email')}`)}`}
                />
              </div>
              <div>
                {errors?.email?.message && (
                  <p
                    className={`text-base text-red-800 font-semibold py-2 capitalize`}
                    suppressHydrationWarning={suppressText}
                  >
                    {errors?.email?.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4 capitalize">
                <Phone style={{ color }} />
                <input
                  type="number"
                  {...register('phone')}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  className={`border-0 w-full focus:ring-transparent outline-0 ${arboriaFont}`}
                  onChange={(e) => setValue('phone', toEn(e.target.value))}
                  placeholder={`${startCase(`${t('enter_your_phone')}`)}`}
                />
                {/* <Controller
                  render={(props) => (
                    <PhoneInput
                      international
                      defaultCountry="KW"
                      placeholder={`${t('enter_your_phone')}`}
                      inputRef={register}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: true,
                      }}
                      id="phone"
                      name="phone"
                      autoComplete="phone"
                      onChange={(value) => setValue('phone', value)}
                      error={!!errors.phone}
                      helperText={t(`${errors?.phone?.message}`)}
                      value={`${customer.phone && `${customer.phone}`}`}
                    />
                  )}
                  name="phone"
                  control={control}
                  defaultValue={phone}
                  rules={{ required: true }}
                /> */}
              </div>
              <div>
                {errors?.phone?.message && (
                  <p
                    className={`text-base text-red-800 font-semibold py-2 capitalize`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t(`${errors?.phone?.message}`)}
                  </p>
                )}
              </div>
              <GreyLine />
            </div>
          </form>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default CustomerInformation;

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
