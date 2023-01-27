import { FC } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { appLinks, suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { appSetting } from '@/types/index';

type Props = {
  method_in_select?: appSetting['method'];
};

const DeliveryBtns: FC<Props> = ({ method_in_select = '' }): JSX.Element => {
  const color = useAppSelector(themeColor);
  const { t } = useTranslation();
  const router = useRouter();
  const {
    appSetting: { method },
  } = useAppSelector((state) => state);

  return (
    <div className="flex flex-1 w-full flex-row justify-between items-center px-5 text-lg py-8">
      <Link
        scroll={true}
        className={`${
          method_in_select
            ? method_in_select === 'delivery' && `text-white`
            : method === 'delivery' && `text-white`
        } md:ltr:mr-3 md:rtl:ml-3 py-3 px-16 capitalize border-2 rounded-md`}
        href={appLinks.cartSelectMethod(`delivery`)}
        suppressHydrationWarning={suppressText}
        style={{
          backgroundColor: router.pathname.includes('select')
            ? method_in_select === `delivery`
              ? color
              : `white`
            : method === `delivery`
            ? color
            : `white`,
        }}
      >
        {t('delivery')}
      </Link>
      <Link
        scroll={true}
        className={`${
          method_in_select
            ? method_in_select === 'pickup' && `text-white`
            : method === 'pickup' && `text-white`
        } md:ltr:mr-3 md:rtl:ml-3 capitalize py-3 px-16 border-2 rounded-md`}
        href={appLinks.cartSelectMethod(`pickup`)}
        suppressHydrationWarning={suppressText}
        style={{
          backgroundColor: router.pathname.includes('select')
            ? method_in_select === `pickup`
              ? color
              : `white`
            : method === `pickup`
            ? color
            : `white`,
        }}
      >
        {t('pickup')}
      </Link>
    </div>
  );
};
export default DeliveryBtns;
