import MainContentLayout from '@/layouts/MainContentLayout';
import { useGetLocationsQuery } from '@/redux/api/locationApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NextPage } from 'next';
import { useGetBranchesQuery } from '@/redux/api/branchApi';
import { useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';

const SelectMethod: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branches,
  } = useAppSelector((state) => state);
  const { data: locations, isLoading } = useGetLocationsQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <MainContentLayout>
      <h1>{t('select_method')}</h1>
    </MainContentLayout>
  );
};

export default SelectMethod;
