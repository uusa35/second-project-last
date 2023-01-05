import MainContentLayout from '@/layouts/MainContentLayout';
import { NextPage } from 'next';
import { Vendor } from '@/types/index';
import { wrapper } from '@/redux/store';
import { productApi } from '@/redux/api/productApi';
import { apiSlice } from '@/redux/api';
import { vendorApi } from '@/redux/api/vendorApi';
import MainHead from '@/components/MainHead';

type Props = {
  element: Vendor;
};
const VendorShow: NextPage<Props> = ({ element }) => {
  console.log('vendor', element);
  return (
    <>
      <MainHead
        title={element.name}
        description={element.desc}
        mainImage={element.logo}
      />
      <MainContentLayout>
        <h1>Vendor Show</h1>
      </MainContentLayout>
    </>
  );
};

export default VendorShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale }) => {
      const { data: element, isError } = await store.dispatch(
        vendorApi.endpoints.getVendor.initiate({ lang: locale })
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
