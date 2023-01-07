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
import { imageSizes, imgUrl } from '@/constants/*';
import CustomImage from '@/components/customImage';

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
        mainImage={`${imgUrl(element?.img[0]?.toString())}`}
      />
      <MainContentLayout>
        <div className="relative w-full">
          <div className="relative w-full h-auto overflow-hidden">
            <CustomImage
              src={`${imgUrl(element?.img[0]?.toString())}`}
              alt={element.name}
              width={imageSizes.lg}
              height={imageSizes.lg}
              className={`w-full h-64`}
            />
          </div>
          <div className="absolute inset-x-0 top-0 flex h-full items-end justify-end overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black opacity-60"
            />
            <div className="flex flex-row w-full px-2 justify-between items-center py-4"></div>
          </div>
        </div>
        <div
          className={`flex w-full flex-row justify-center items-center my-4`}
        >
          <span className="isolate inline-flex rounded-xl shadow-sm">
            <button
              type="button"
              className="relative inline-flex items-center rounded-l-xl  bg-blue-400 px-4 py-2 text-sm font-medium text-white  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              +
            </button>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center  bg-blue-400 px-4 py-2 text-sm font-medium text-white  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              1
            </button>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center rounded-r-xl  bg-blue-400 px-4 py-2 text-sm font-medium text-white  focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              -
            </button>
          </span>
        </div>
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
