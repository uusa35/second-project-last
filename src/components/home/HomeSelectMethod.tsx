import {
  appLinks,
  suppressText,
  convertColor,
  gessFont,
  arboriaFont,
} from '@/constants/*';
import { isNull } from 'lodash';
import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { appSetting, Vendor } from '@/types/index';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { setCartMethod } from '@/redux/slices/appSettingSlice';
import Link from 'next/link';
import TextTrans from '@/components/TextTrans';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  element: Vendor;
};
const HomeSelectMethod: FC<Props> = ({ element }): JSX.Element => {
  const {
    appSetting: { method },
    area,
    branch,
  } = useAppSelector((state) => state);
  const color = useAppSelector(themeColor);
  const { t } = useTranslation();
  const router = useRouter();
  console.log({ color });

  const handleSelectMethod = (m: appSetting['method']) => {
    router.push(appLinks.cartSelectMethod(m));
  };

  return (
    <>
      {/* Delivery / Pickup Btns */}
      <div className="flex flex-1 w-full flex-row justify-between items-center my-2 border-t-[14px] border-stone-100 px-14 text-lg pt-4 capitalize">
        <button
          className={`${
            method === 'delivery' && `border-b-2 pb-1`
          } md:ltr:mr-3 md:rtl:ml-3 capitalize ${
            router.locale === 'ar' ? gessFont : arboriaFont
          }`}
          onClick={() => handleSelectMethod(`delivery`)}
          suppressHydrationWarning={suppressText}
          style={{ borderBottomColor: 'gray' }}
        >
          {t('delivery')}
        </button>
        <button
          className={`${
            method === 'pickup' && `border-b-2 pb-1`
          } md:ltr:mr-3 md:rtl:ml-3 capitalize ${
            router.locale === 'ar' ? gessFont : arboriaFont
          }`}
          onClick={() => handleSelectMethod(`pickup`)}
          suppressHydrationWarning={suppressText}
          // style={{ borderBottomColor: convertColor(color, 100) }}
          style={{ borderBottomColor: 'gray' }}
        >
          {t('pickup')}
        </button>
      </div>
      <div className={`px-8 py-0 text-lg capitalize`}>
        <Link
          href={appLinks.cartSelectMethod(method)}
          scroll={true}
          className="flex flex-1 gap-x-3 w-full flex-row justify-between items-center mt-0 mb-0"
        >
          <div className={`flex flex-grow justify-start items-center`}>
            <h1 className={`pt-4`}>
              {method === `delivery` ? t(`deliver_to`) : t('pickup_from')}
            </h1>
          </div>
          <div
            className={`pt-4`}
            style={{ color: `${!branch.id && !area.id ? `red` : color}` }}
          >
            {branch.id ? (
              <TextTrans ar={branch.name_ar} en={branch.name_en} />
            ) : area.id ? (
              <TextTrans ar={area.name_ar} en={area.name_en} />
            ) : (
              t(`select_location`)
            )}
          </div>
        </Link>

        <div className="flex flex-1 gap-x-2 w-full flex-row justify-between items-center mb-2">
          <div className={`flex flex-grow justify-start items-center`}>
            <h1 className={`pt-4`} suppressHydrationWarning={suppressText}>
              {t('earliest_delivery')}
            </h1>
          </div>
          <div className={`pt-4`} style={{ color }}>
            {element.DeliveryTime}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeSelectMethod;
