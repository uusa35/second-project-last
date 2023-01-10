import {
  appLinks,
  imageSizes,
  normalBtnClass,
  submitBtnClass,
  suppressText,
} from '@/constants/*';
import { isNull } from 'lodash';
import CustomImage from '@/components/CustomImage';
import MotorIcon from '@/appIcons/motor.svg';
import TruckIcon from '@/appIcons/trunk.svg';
import { FC, Suspense } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Cart, Vendor } from '@/types/index';
import { selectMethod } from '@/redux/slices/cartSlice';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';

type Props = {
  element: Vendor;
};
const HomeSelectMethod: FC<Props> = ({ element }): JSX.Element => {
  const {
    cart: { method },
    area,
    branch,
  } = useAppSelector((state) => state);
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSelectMethod = (m: Cart['method']) => {
    dispatch(selectMethod(m));
    router.push(appLinks.cartSelectMethod.path);
  };

  return (
    <Suspense fallback={<LoadingSpinner fullWidth={false} />}>
      {/* Delivery / Pickup Btns */}
      <div className="flex flex-1 w-full flex-col md:flex-row justify-between items-center my-2">
        <button
          className={`${
            method === 'delivery' ? `border-b-2 border-b-primary_BG` : ``
          } md:ltr:mr-3 md:rtl:ml-3 capitalize`}
          onClick={() => handleSelectMethod(`delivery`)}
          suppressHydrationWarning={suppressText}
        >
          {t('delivery')}
        </button>
        <button
          className={`${
            method === 'pickup' ? `border-b-2 border-b-primary_BG` : ``
          } md:ltr:mr-3 md:rtl:ml-3 capitalize`}
          onClick={() => handleSelectMethod(`pickup`)}
          suppressHydrationWarning={suppressText}
        >
          {t('pickup')}
        </button>
      </div>
      {!isNull(area.id) && method === 'delivery' && (
        <div className="flex flex-1 w-full flex-row justify-between items-center mt-4 mb-2">
          <div
            className={`flex flex-grow justify-start items-center md:ltr:mr-3 md:rtl:ml-3`}
          >
            <h1 className={`pt-2`}>{t('deliver_to')}</h1>
          </div>
          <div className={`md:ltr:mr-3 md:rtl:ml-3 pt-2 text-primary_BG`}>
            {area.name}
          </div>
        </div>
      )}
      {!isNull(branch.id) && method === 'pickup' && (
        <div className="flex flex-1 w-full flex-row justify-between items-center mt-4 mb-2">
          <div
            className={`flex flex-grow justify-start items-center md:ltr:mr-3 md:rtl:ml-3`}
          >
            <h1 className={`pt-2`}>{t('pickup_from')}</h1>
          </div>
          <div className={`md:ltr:mr-3 md:rtl:ml-3 pt-2 text-primary_BG`}>
            {branch.name}
          </div>
        </div>
      )}
      <div className="flex flex-1 w-full flex-row justify-between items-center mt-2 mb-4">
        <div
          className={`flex flex-grow justify-start items-center md:ltr:mr-3 md:rtl:ml-3`}
        >
          <h1 className={`pt-2`} suppressHydrationWarning={suppressText}>
            {t('deliver_to')}
          </h1>
        </div>
        <Link href={appLinks.branchIndex.path} className={`md:ltr:mr-3 md:rtl:ml-3 pt-2 text-primary_BG`} suppressHydrationWarning={suppressText}>
          {t('choose_location')}
        </Link>
      </div>
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
    </Suspense>
  );
};

export default HomeSelectMethod;
