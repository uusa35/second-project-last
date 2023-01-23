import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import { appLinks, suppressText } from '@/constants/*';
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
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomImage from '@/components/CustomImage';

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
  const {
    register,
    handleSubmit,
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
  // const [userData, setUserData] = useState<CustomerInfo>({
  //   id: customer.id ?? 0,
  //   name: customer.name ?? ``,
  //   email: customer.email ?? ``,
  //   phone: customer.phone ?? ``,
  // });
  const [
    saveCustomerInfo,
    { isLoading: SaveCustomerLoading, error: customerInfoError },
  ] = useSaveCustomerInfoMutation();

  useEffect(() => {
    dispatch(setCurrentModule(t('customer_info')));
    dispatch(setShowFooterElement(`customerInfo`));
    return () => {
      dispatch(resetShowFooterElement());
    };
  }, []);

  const onSubmit = async (body: any) => {
    console.log('submit', body);
    // console.log(userData);
    // if (
    //   userData.name.length < 2 ||
    //   userData.phone.length < 2 ||
    //   userData.email.length < 2
    // ) {
    //   dispatch(
    //     showToastMessage({
    //       content: `some_fields_r_missing`,
    //       type: `info`,
    //     })
    //   );
    // } else {

    saveCustomerInfo({
      body,
    })
      .then((r: any) => {
        console.log({ data: r });
        if (r.data.Data && r.data.status) {
          dispatch(setCustomer(r.data.Data));
        } else {
          dispatch(
            showToastMessage({
              content: r.data?.message,
              type: 'error',
            })
          );
        }
      })
      .then(() => {
        router.push(appLinks.address.path);
      });
    // }
  };

  console.log('customer', customer);

  useEffect(() => {
    dispatch(setCurrentModule(t('customer_info')));
    dispatch(setShowFooterElement('customerInfo'));
  }, []);
  console.log({ errors });
  return (
    <Suspense>
      <MainContentLayout>
        <div className="flex-col justify-center h-full px-5">
          <div className="flex justify-center py-10 lg:my-5 lg:pb-5">
            {/* <CustomImage
              src={ContactInfo.src}
              alt="customer"
              width={imageSizes.xl}
              height={imageSizes.xl}
              className={`my-10 lg:my-0 w-auto h-auto`}
            /> */}
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="lg:mt-10">
              <div className="flex gap-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
                <BadgeOutlined className="text-primary_BG" />
                <input
                  {...register('name')}
                  // aria-invalid={errors.name ? 'true' : 'false'}
                  // onChange={(e) =>
                  //   setUserData((prev) => ({ ...prev, name: e.target.value }))
                  // }
                  // defaultValue={userData.name}
                  className={`border-0 focus:ring-transparent outline-none`}
                  type="string"
                  required
                  placeholder={`${t('enter_your_name')}`}
                />
                <div>
                  {errors?.name && (
                    <p
                      className={`text-sm text-red-800`}
                      suppressHydrationWarning={suppressText}
                    >
                      {t(`${errors?.name?.message}`)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
                <EmailOutlined className="text-primary_BG" />
                <input
                  // onChange={(e) =>
                  //   setUserData((prev) => ({ ...prev, email: e.target.value }))
                  // }
                  // defaultValue={userData.email}
                  {...register('email')}
                  aria-invalid={errors.email ? 'true' : 'false'}
                  className={`border-0 focus:ring-transparent px-0`}
                  type="email"
                  required
                  // pattern='/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'
                  placeholder={`${t('enter_your_email')}`}
                />
                <div>
                  {errors?.email?.message && (
                    <p
                      className={`text-sm text-red-800`}
                      suppressHydrationWarning={suppressText}
                    >
                      {t(`${errors?.email?.message}`)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
                <Phone className="text-primary_BG" />
                {/* <Controller
                name="phone"
                // control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    international
                    value={value}
                    defaultCountry="KW"
                    className="text-lg outline-none w-4/6 focus:border-none p-0 focus:ring-0"
                    placeholder={`${t('enter_your_phone')}`}
                    onChange={onChange}
                    id="phone-input"
                  />
                )}
              /> */}
                <PhoneInput
                  international
                  defaultCountry="KW"
                  className="text-lg outline-none w-4/6 focus:border-none p-0 focus:ring-0"
                  placeholder={`${t('enter_your_phone')}`}
                  // value={userData.phone}
                  // onChange={(value) =>
                  //   setUserData((prev) => ({ ...prev, phone: value?.toString() }))
                  // }
                  {...register('phone')}
                  aria-invalid={errors.phone ? 'true' : 'false'}
                />
              </div>
              <GreyLine />
              <input type="submit" />
            </div>
          </form>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default CustomerInformation;
