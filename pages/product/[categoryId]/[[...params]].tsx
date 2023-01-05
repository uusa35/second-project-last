import { useEffect } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { productApi } from '@/redux/api/productApi';
import { Product } from '@/types/index';
import { NextPage } from 'next';
import { apiSlice } from '@/redux/api';
import MainHead from '@/components/MainHead';
import { imageSizes, suppressText } from '@/constants/*';
import { isEmpty, map } from 'lodash';
import Image from 'next/image';
import NotFoundImage from '@/appImages/not_found.png';
import HorProductWidget from '@/widgets/product/HorProductWidget';
import { AppQueryResult, ProductPagination } from '@/types/queries';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useTranslation } from 'react-i18next';

type Props = {
  elements: ProductPagination<Product[]>;
};
const ProductIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  console.log('elements', elements);

  useEffect(() => {
    dispatch(setCurrentModule(t('product_index')));
  }, []);

  return (
    <>
      <MainHead title={`productIndex`} description={`productIndex`} />
      <MainContentLayout>
        <h1 suppressHydrationWarning={suppressText}>ProductIndex</h1>
        <div className="mt-4 p-4 grid sm:grid-cols-3 lg:grid-cols-2 gap-6">
          {isEmpty(elements.products) && (
            <Image
              src={NotFoundImage.src}
              alt={`not_found`}
              width={imageSizes.sm}
              height={imageSizes.sm}
              className={`w-60 h-auto`}
            />
          )}
          {map(elements.products, (p, i) => (
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
    async ({ query, locale }) => {
      const { categoryId, branch_id, page, limit, areaId }: any = query;
      if (!categoryId || !branch_id) {
        return {
          notFound: true,
        };
      }
      const {
        data: elements,
        isError,
      }: {
        data: AppQueryResult<Product[]>;
        isError: boolean;
      } = await store.dispatch(
        productApi.endpoints.getProducts.initiate({
          category_id: categoryId,
          page: page ?? `1`,
          limit: limit ?? `10`,
          branch_id: branch_id ?? `null`,
          area_id: areaId ?? ``,
          lang: locale,
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
