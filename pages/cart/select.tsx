import MainLayout from '@/layouts/MainLayout';
import MainContentLayout from '@/layouts/MainContentLayout';
import { useGetLocationsQuery } from '@/redux/api/locationApi';
import LoadingSpinner from '@/components/LoadingSpinner';
import { NextPage } from 'next';
import { useGetBranchesQuery } from '@/redux/api/branchApi';
import { useAppSelector } from '@/redux/hooks';

const SelectMethod: NextPage = () => {
  const {
    locale: { lang },
  } = useAppSelector((state) => state);
  const { data: locations, isLoading } = useGetLocationsQuery();
  const { data: branches, isLoading: branchesLoading } = useGetBranchesQuery({
    lang,
  });

  if (isLoading || branchesLoading) {
    return <LoadingSpinner />;
  }

  return <MainContentLayout>select Method</MainContentLayout>;
};
