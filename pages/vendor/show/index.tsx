import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { Vendor } from '@/types/index';
import { wrapper } from '@/redux/store';
import { productApi } from '@/redux/api/productApi';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';

type Props = {
  element: Vendor;
};
const VendorShow: NextPage<Props> = ({ element }) => {
  console.log('vendor', element);
  return (
    <MainContentLayout>
      <h1>Vendor Show</h1>
    </MainContentLayout>
  );
};

export default VendorShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    const { data: element, isError } = await store.dispatch(
      vendorApi.endpoints.getVendor.initiate()
    );
    await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
    if (isError || !element.Data) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        element: element.Data,
      },
    };
  }
);
