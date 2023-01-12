import {
  appLinks,
  imageSizes,
  normalBtnClass,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { isNull } from 'lodash';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { appSetting, Cart, Vendor } from '@/types/index';
import { selectMethod } from '@/redux/slices/cartProductSlice';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { setCartMethod } from '@/redux/slices/appSettingSlice';
import Link from 'next/link';

type Props = {
  element: Vendor;
};
const HomeSelectMethod: FC<Props> = ({ element }): JSX.Element => {
  const {
    appSetting: { method },
    area,
    branch,
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSelectMethod = (m: appSetting['method']) => {
    router
      .push(appLinks.cartSelectMethod.path)
      .then(() => dispatch(setCartMethod(m)));
  };

  return (
    <>
      {/* Delivery / Pickup Btns */}
      <div className="flex flex-1 w-full flex-row justify-between items-center my-2 border-t-[14px] border-stone-100 px-14 text-lg pt-8 ">
        <button
          className={`${
            method === 'delivery' && `border-b-2 pb-4 border-b-primary_BG`
          } md:ltr:mr-3 md:rtl:ml-3 capitalize `}
          onClick={() => handleSelectMethod(`delivery`)}
          suppressHydrationWarning={suppressText}
        >
          {t('delivery')}
        </button>
        <button
          className={`${
            method === 'pickup' && `border-b-2 pb-4 border-b-primary_BG`
          } md:ltr:mr-3 md:rtl:ml-3 capitalize `}
          onClick={() => handleSelectMethod(`pickup`)}
          suppressHydrationWarning={suppressText}
        >
          {t('pickup')}
        </button>
      </div>
      <div className={`px-8 py-2 text-lg`}>
        {!isNull(branch.id) && method === 'pickup' && (
          <Link
            href={appLinks.cartSelectMethod.path}
            scroll={false}
            className="flex flex-1 w-full flex-row justify-between items-center mt-4 mb-2"
          >
            <div
              className={`flex flex-grow justify-start items-center md:ltr:mr-3 md:rtl:ml-3`}
            >
              <h1 className={`pt-2`}>{t('pickup_from')}</h1>
            </div>
            <div className={`md:ltr:mr-3 md:rtl:ml-3 pt-2 text-primary_BG`}>
              {branch.name}
            </div>
          </Link>
        )}

        {!isNull(area.id) && method === 'delivery' && (
          <Link
            href={appLinks.cartSelectMethod.path}
            scroll={false}
            className="flex flex-1 w-full flex-row justify-between items-center mt-4 mb-2"
          >
            <div
              className={`flex flex-grow justify-start items-center md:ltr:mr-3 md:rtl:ml-3`}
            >
              <h1 className={`pt-2`}>{t('deliver_to')}</h1>
            </div>
            <div className={`md:ltr:mr-3 md:rtl:ml-3 pt-2 text-primary_BG`}>
              {area.name}
            </div>
          </Link>
        )}

        <div className="flex flex-1 w-full flex-row justify-between items-center mt-2 mb-4">
          <div
            className={`flex flex-grow justify-start items-center md:ltr:mr-3 md:rtl:ml-3`}
          >
            <h1 className={`pt-2`} suppressHydrationWarning={suppressText}>
              {t('earliest_delivery')}
            </h1>
          </div>
          <div className={`md:ltr:mr-3 md:rtl:ml-3 pt-2 text-primary_BG`}>
            {element.DeliveryTime}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeSelectMethod;
