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
    <div className="flex flex-1 space-x-5 mx-auto flex-row justify-between items-center px-5 text-lg py-8">
      <Link
        scroll={true}
        className={`${
          method_in_select
            ? method_in_select === 'delivery' && `text-white`
            : method === 'delivery' && `text-white`
        }  py-3 capitalize border-2 rounded-md w-[50%] text-center `}
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
        } capitalize py-3 border-2 rounded-md md w-[50%] text-center `}
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
