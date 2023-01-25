import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { appLinks, imageSizes, suppressText } from '@/constants/*';
import { BadgeOutlined, EmailOutlined, Phone } from '@mui/icons-material';
import GreyLine from '@/components/GreyLine';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useEffect, useState, Suspense } from 'react';
import { CustomerInfo } from '@/types/index';
import {
  resetShowFooterElement,
  setCurrentModule,
  setShowFooterElement,
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
import LoadingSpinner from '@/components/LoadingSpinner';

const schema = yup
  .object({
    id: yup.number(),
    name: yup.string().required().min(2).max(50),
    email: yup.string().email().required(),
    phone: yup.number().min(100000).max(999999999999).required(),
  })
  .required();
const CustomerInformation: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const { customer } = useAppSelector((state) => state);
  const [triggerSaveCustomerInfo, { isLoading }] =
    useSaveCustomerInfoMutation();
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

  useEffect(() => {
    dispatch(setCurrentModule(t('customer_info')));
    dispatch(setShowFooterElement(`customerInfo`));
  }, []);

  const onSubmit = async (body: any) => {
    await triggerSaveCustomerInfo({
      body,
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

  if (isLoading) {
    return <LoadingSpinner fullWidth={true} />;
  }

  return (
    <Suspense>
      <MainContentLayout handleSubmit={handleSubmit(onSubmit)}>
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
                <BadgeOutlined className="text-primary_BG" />
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
                <EmailOutlined className="text-primary_BG" />
                <input
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className={`border-0 w-full focus:ring-transparent outline-0`}
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
              <div className="flex items-center gap-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
                <Phone className="text-primary_BG" />
                <Controller
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
                    />
                  )}
                  defaultValue=""
                  name="phone"
                  control={control}
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
