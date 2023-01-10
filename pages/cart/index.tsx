import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';

const CartIndex: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branches,
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentModule(t('cart')));
  }, []);

  return (
    <MainContentLayout>
      <div className={`px-4`}>
        <h1>{t('cart')}</h1>
        <div>cartIndex</div>
      </div>
    </MainContentLayout>
  );
};

export default CartIndex;
