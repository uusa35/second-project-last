import { FC } from 'react';
import { appSetting } from '@/types/index';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCartMethod } from '@/redux/slices/appSettingSlice';
import { suppressText } from '@/constants/*';
import { useTranslation } from 'react-i18next';
import { themeColor } from '@/redux/slices/vendorSlice';

type Props = {
  handleSelectMethod: (m: 'delivery' | 'pickup') => void;
};
const DeliveryBtns: FC<Props> = ({ handleSelectMethod }): JSX.Element => {
  const color = useAppSelector(themeColor);
  const { t } = useTranslation();
  const {
    appSetting: { method },
  } = useAppSelector((state) => state);

  return (
    <div className="flex flex-1 w-full flex-row justify-between items-center px-5 text-lg py-8">
      <button
        className={`${
          method === 'delivery' && `text-white`
        } md:ltr:mr-3 md:rtl:ml-3 py-3 px-16 capitalize border-2 rounded-md`}
        onClick={() => handleSelectMethod('delivery')}
        suppressHydrationWarning={suppressText}
        style={{ backgroundColor: method === `delivery` ? color : `white` }}
      >
        {t('delivery')}
      </button>
      <button
        className={`${
          method === 'pickup' && `text-white`
        } md:ltr:mr-3 md:rtl:ml-3 capitalize py-3 px-16 border-2 rounded-md`}
        onClick={() => handleSelectMethod('pickup')}
        suppressHydrationWarning={suppressText}
        style={{ backgroundColor: method === `pickup` ? color : `white` }}
      >
        {t('pickup')}
      </button>
    </div>
  );
};
export default DeliveryBtns;
