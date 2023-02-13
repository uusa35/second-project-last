import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
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
import { useSaveCustomerInfoMutation } from '@/redux/api/CustomerApi';
import { useRouter } from 'next/router';
import { setCustomer } from '@/redux/slices/customerSlice';
import { useAppSelector } from '@/redux/hooks';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomImage from '@/components/CustomImage';
import ContactImage from '@/appImages/contact_info.png';
import { themeColor } from '@/redux/slices/vendorSlice';
import { isNull } from 'lodash';
import { useGetCartProductsQuery } from '@/redux/api/cartApi';
import { AppQueryResult } from '@/types/queries';
import { wrapper } from '@/redux/store';

const schema = yup
  .object({
    id: yup.number(),
    name: yup.string().required().min(2).max(50),
    email: yup.string().email().required(),
    phone: yup.number().min(100000).max(999999999999).required(),
  })
  .required();

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
    url,
  });
  const [triggerSaveCustomerInfo] = useSaveCustomerInfoMutation();
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: yupResolver(schema),
    defaultValues: {
      id: customer?.id ?? 0,
      name: customer?.name ?? ``,
      email: customer?.email ?? ``,
      phone: customer?.phone ?? ``,
    },
  });
console.log({customer})
  useEffect(() => {
    dispatch(setCurrentModule('customer_info'));
    dispatch(setShowFooterElement(`customerInfo`));
    if (url) {
      dispatch(setUrl(url));
    }
    if (
      (isNull(areaId) && isNull(branchId)) ||
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
    await triggerSaveCustomerInfo({
      body,
      url,
    }).then((r: any) => {
      if (r.data && r.data.Data && r.data.status) {
        router
          .push(appLinks.address.path)
          .then(() => dispatch(setCustomer(r.data.Data)));
      } else {
        dispatch(
          showToastMessage({
            content: `all_fields_r_required`,
            type: 'error',
          })
        );
      }
    });
  };

  return (
    <Suspense>
      <MainContentLayout handleSubmit={handleSubmit(onSubmit)} url={url}>
        <div className="flex-col justify-center h-full px-5">
          <div className="flex justify-center py-10 lg:my-5 lg:pb-5">
            <CustomImage
              src={ContactImage.src}
              alt="customer"
              width={imageSizes.md}
              height={imageSizes.md}
              className={`my-10 lg:my-0 w-auto h-auto`}
            />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="lg:mt-10">
              <div className="flex gap-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
                <BadgeOutlined style={{ color }} />
                <input
                  {...register('name')}
                  className={`border-0 w-full focus:ring-transparent outline-0 capitalize`}
                  placeholder={`${t('enter_your_name')}`}
                  onChange={(e) => setValue('name', e.target.value)}
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
                  className={`border-0 w-full focus:ring-transparent outline-0 capitalize`}
                  onChange={(e) => setValue('email', e.target.value)}
                  placeholder={`${t('enter_your_email')}`}
                />
              </div>
              <div>
                {errors?.email?.message && (
                  <p
                    className={`text-base text-red-800 font-semibold py-2 capitalize`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('email_is_required')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4 capitalize">
                <Phone style={{ color }} />
                <Controller
                  render={(props) => (
                    <PhoneInput
                      international
                      defaultCountry='KW'
                      placeholder={`${t('enter_your_phone')}`}
                      inputRef={register}
                      inputProps={{
                        name: 'phone',
                        required: true,
                        autoFocus: true
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
                />
              </div>
              <div>
                {errors?.phone?.message && (
                  <p
                    className={`text-base text-red-800 font-semibold py-2 capitalize`}
                    suppressHydrationWarning={suppressText}
                  >
                    {t('phone_is_required')}
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
