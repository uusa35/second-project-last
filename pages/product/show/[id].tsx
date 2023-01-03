import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { AppQueryResult, Category } from '@/types/queries';
import { categoryApi } from '@/redux/api/categoryApi';
import { apiSlice } from '@/redux/api';
import { Product } from '@/types/index';
import { productApi } from '@/redux/api/productApi';
import { NextPage } from 'next';

type Props = {
  element: Product;
};
const ProductShow: NextPage<Props> = ({ element }) => {
  return (
    <MainContentLayout>
      <div>ProductShow</div>
    </MainContentLayout>
  );
};

export default ProductShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const { id }: any = query;
      if (id) {
        return {
          notFound: true,
        };
      }
      const {
        data: element,
        isError,
      }: {
        data: AppQueryResult<Product>;
        isError: boolean;
      } = await store.dispatch(productApi.endpoints.getProduct.initiate(id));
      await Promise.all(store.dispatch(apiSlice.util.getRunningQueriesThunk()));
      if (isError || !element.status || !element.Data) {
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
