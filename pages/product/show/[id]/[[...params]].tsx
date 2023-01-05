import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import { Product } from '@/types/index';
import { productApi } from '@/redux/api/productApi';
import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';

type Props = {
  element: Product;
};
const ProductShow: NextPage<Props> = ({ element }) => {
  console.log('element', element);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCurrentModule(element.name));
  }, [element]);

  return (
    <>
      <MainHead
        title={element.name}
        description={element.desc}
        // mainImage={`${isEmpty(element.img) ? imgUrl(element?.img[0].toString())}`}
      />
      <MainContentLayout>
        <h1>ProductShow {element.id}</h1>
        <div>{element.name}</div>
      </MainContentLayout>
    </>
  );
};

export default ProductShow;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale }) => {
      const { id, branchId, areaId }: any = query;
      if (!id) {
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
      } = await store.dispatch(
        productApi.endpoints.getProduct.initiate({
          id,
          lang: locale,
          branchId: branchId ?? null,
          areaId: areaId ?? ``,
        })
      );
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
