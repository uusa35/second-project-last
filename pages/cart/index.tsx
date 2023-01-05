import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';

const SelectMethod: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branches,
  } = useAppSelector((state) => state);

  return (
    <MainContentLayout>
      <h1>{t('cart_index')}</h1>
      <div>cartIndex</div>
    </MainContentLayout>
  );
};

export default SelectMethod;
