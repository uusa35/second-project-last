import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { productApi, useGetTopSearchQuery } from '@/redux/api/productApi';
import { Product } from '@/types/index';
import { NextPage } from 'next';
import { apiSlice } from '@/redux/api';

type Props = {
  elements: Product[];
};
const ProductIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  const { data: topSearch, isLoading } = useGetTopSearchQuery({});
  return (
    <MainContentLayout>
      <div>ProductIndex</div>
    </MainContentLayout>
  );
};

export default ProductIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const { categoryId, branchId, params }: any = query;
      if (!categoryId) {
        return {
          notFound: true,
        };
      }
      const { data: elements, isError } = await store.dispatch(
        productApi.endpoints.getProducts.initiate({
          category_id: categoryId,
          branchId,
          query: params[0] ?? ``,
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
