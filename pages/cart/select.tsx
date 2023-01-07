import MainContentLayout from '@/layouts/MainContentLayout';
import { useGetLocationsQuery } from '@/redux/api/locationApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NextPage } from 'next';
import { useGetBranchesQuery } from '@/redux/api/branchApi';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useTranslation } from 'react-i18next';
import { AppQueryResult } from '@/types/queries';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';

const SelectMethod: NextPage = (): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branches,
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const { data: locations, isLoading } = useGetLocationsQuery<{
    data: AppQueryResult<Location[]>;
    isLoading: boolean;
  }>({ lang });

  useEffect(() => {
    dispatch(setCurrentModule(t('select_method')));
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <MainContentLayout>
      <div className={`px-4`}>
        <h1>{t('select_method')}</h1>
        <div>delivery</div>
        <div>pickup</div>
      </div>
    </MainContentLayout>
  );
};

export default SelectMethod;
