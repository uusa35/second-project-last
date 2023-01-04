import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { productApi, useGetTopSearchQuery } from '@/redux/api/productApi';
import { Product } from '@/types/index';
import { NextPage } from 'next';
import { apiSlice } from '@/redux/api';
import { isEmpty } from 'lodash';
import { suppressText } from '@/constants/*';

type Props = {
  elements: Product[];
};
const ProductIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  console.log('elements', elements);
  return (
    <MainContentLayout>
      {!isEmpty(elements) ? (
        <div suppressHydrationWarning={suppressText}>ProductIndex</div>
      ) : (
        <div suppressHydrationWarning={suppressText}>no results</div>
      )}
    </MainContentLayout>
  );
};

export default ProductIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const { key, branch_id, area_id }: any = query;
      const { data: elements, isError } = await store.dispatch(
        productApi.endpoints.getSearchProducts.initiate({
          search: key ?? ``,
          branchId: branch_id ?? ``,
          areaId: area_id ?? ``,
        })
      );
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !elements.Data) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          elements: elements.Data,
        },
      };
    }
);
