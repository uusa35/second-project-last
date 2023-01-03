import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { productApi, useGetTopSearchQuery } from '@/redux/api/productApi';
import { Product } from '@/types/index';
import { NextPage } from 'next';

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
      if (!query.categoryId) {
        return {
          notFound: true,
        };
      }
      const { categoryId, branchId, params }: any = query;
      const { data: elements, isError } = await store.dispatch(
        productApi.endpoints.getProducts.initiate({
          category_id: categoryId,
          branchId,
          query: params[0] ?? ``,
        })
      );
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
