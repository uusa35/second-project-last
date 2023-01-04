import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { productApi, useGetTopSearchQuery } from '@/redux/api/productApi';
import { Product } from '@/types/index';
import { NextPage } from 'next';
import { apiSlice } from '@/redux/api';
import { map } from 'lodash';
import { suppressText } from '@/constants/*';
import HorProductWidget from '@/widgets/product/HorProductWidget';
import MainHead from '@/components/MainHead';

type Props = {
  elements: Product[];
};
const ProductIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  return (
    <>
      <MainHead title={`productIndex`} description={`productIndex`} />
      <MainContentLayout>
        <h1 suppressHydrationWarning={suppressText}>ProductIndex</h1>
        <div className="mt-4 p-4 grid sm:grid-cols-3 lg:grid-cols-2 gap-6">
          {map(elements, (p, i) => (
            <HorProductWidget element={p} key={i} />
          ))}
        </div>
      </MainContentLayout>
    </>
  );
};

export default ProductIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query }) => {
      const { key, branch_id, area_id }: any = query;
      console.log('the key _________>', key);
      const { data: elements, isError } = await store.dispatch(
        productApi.endpoints.getSearchProducts.initiate({
          search: key ?? ``,
          branchId: branch_id ?? `1`,
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
