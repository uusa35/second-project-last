import { NextPage } from 'next';
import MainContentLayout from '@/layouts/MainContentLayout';
import CustomImage from '@/components/CustomImage';
import ContactInfo from '@/appImages/contact_info.png';
import { appLinks, imageSizes, submitBtnClass } from '@/constants/*';
import { BadgeOutlined, EmailOutlined, Phone } from '@mui/icons-material';
import GreyLine from '@/components/GreyLine';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState } from 'react';
import { CustomerInfo } from '@/types/index';
import { showToastMessage } from '@/redux/slices/appSettingSlice';
import { useDispatch } from 'react-redux';
import { useSaveCustomerInfoMutation } from '@/redux/api/CustomerApi';
import { useRouter } from 'next/router';
// import '../../styles/CustomeStyle.css';

const CustomerInformation: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const router = useRouter();
  const [userData, setUserData] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
  });
  const [
    saveCustomerInfo,
    { isLoading: SaveCustomerLoading, error: customerInfoError },
  ] = useSaveCustomerInfoMutation();

  const handelSaveCustomerInfo = async () => {
    console.log(userData);
    if (userData.name === '' || userData.phone === '') {
      dispatch(
        showToastMessage({
          content: `name_and_phone_are_required`,
          type: `info`,
        })
      );
    } else {
      await saveCustomerInfo({ body: userData })
        .then((r: any) => {
          console.log(r, { userData });
        })
        .then(() => {
          router.push(appLinks.address.path);
        });
    }
  };

  return (
    <MainContentLayout>
      <div className="flex-col justify-between h-full px-5">
        <div>
          <div className="flex justify-center py-10 lg:my-5 lg:pb-5">
            <CustomImage
              src={ContactInfo.src}
              alt="customer"
              width={imageSizes.xl}
              height={imageSizes.xl}
              className={`my-10 lg:my-0 w-auto h-auto`}
            />
          </div>

          <div className="lg:mt-10">
            <div className="flex space-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
              <BadgeOutlined className="text-primary_BG" />
              <input
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`border-0 focus:ring-transparent`}
                type="string"
                placeholder={`${t('enter_your_name')}`}
              ></input>
            </div>

            <div className="flex items-center space-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
              <EmailOutlined className="text-primary_BG" />
              <input
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={`border-0 focus:ring-transparent`}
                type="email"
                pattern='/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/'
                placeholder={`${t('enter_your_email')}`}
              ></input>
            </div>

            <div className="flex items-center space-x-2 px-2 border-b-4 border-b-gray-200 w-full focus:ring-transparent py-4">
              <Phone className="text-primary_BG" />
              <PhoneInput
                international
                defaultCountry="KW"
                className="text-lg outline-none w-4/6 border-none p-0 focus:ring-0"
                placeholder={`${t('enter_your_phone')}`}
                value={userData.phone}
                onChange={(value) =>
                  setUserData((prev) => ({ ...prev, phone: value?.toString() }))
                }
              />
            </div>
            <GreyLine />
          </div>
        </div>

        <button
          onClick={() => {
            handelSaveCustomerInfo();
          }}
          className={`${submitBtnClass} mt-10 mx-0`}
        >
          {t('Continue')}
        </button>
      </div>
    </MainContentLayout>
  );
};

export default CustomerInformation;
