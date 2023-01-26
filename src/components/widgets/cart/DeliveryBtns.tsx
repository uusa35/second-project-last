import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { appLinks, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import Link from 'next/link';

const DeliveryBtns: FC = (): JSX.Element => {
  const color = useAppSelector(themeColor);
  const { t } = useTranslation();
  const {
    appSetting: { method },
  } = useAppSelector((state) => state);

  console.log('method', method);

  return (
    <div className="flex flex-1 w-full flex-row justify-between items-center px-5 text-lg py-8">
      <Link
        scroll={true}
        className={`${
          method === 'delivery' && `text-white`
        } md:ltr:mr-3 md:rtl:ml-3 py-3 px-16 capitalize border-2 rounded-md`}
        href={appLinks.cartSelectMethod(`delivery`)}
        suppressHydrationWarning={suppressText}
        style={{ backgroundColor: method === `delivery` ? color : `white` }}
      >
        {t('delivery')}
      </Link>
      <Link
        scroll={true}
        className={`${
          method === 'pickup' && `text-white`
        } md:ltr:mr-3 md:rtl:ml-3 capitalize py-3 px-16 border-2 rounded-md`}
        href={appLinks.cartSelectMethod(`pickup`)}
        suppressHydrationWarning={suppressText}
        style={{ backgroundColor: method === `pickup` ? color : `white` }}
      >
        {t('pickup')}
      </Link>
    </div>
  );
};
export default DeliveryBtns;
