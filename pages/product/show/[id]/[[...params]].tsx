import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { AppQueryResult } from '@/types/queries';
import { apiSlice } from '@/redux/api';
import { Product, productSections } from '@/types/index';
import { productApi } from '@/redux/api/productApi';
import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState, useCallback } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { imageSizes, imgUrl } from '@/constants/*';
import CustomImage from '@/components/customImage';
import { map } from 'lodash';
import Image from 'next/image';

type Props = {
  element: Product;
};
const ProductShow: NextPage<Props> = ({ element }) => {
  console.log('element', element);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [currentQty, setCurrentyQty] = useState<number>(1);
  const [maxQty, setMaxQt] = useState<number>(1);

  useEffect(() => {
    dispatch(setCurrentModule(element.name));
  }, [element]);

  const handleIncrease = useCallback(() => {
    if (element?.amount >= currentQty + 1) {
      setCurrentyQty(currentQty + 1);
    }
  }, [element.id]);

  const handleDecrease = useCallback(() => {
    if (currentQty - 1 > 0) {
      setCurrentyQty(currentQty - 1);
    }
  }, [element.id]);

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
              width={imageSizes.xl}
              height={imageSizes.lg}
              className={`w-full h-full`}
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
              onClick={() => handleIncrease()}
              type="button"
              className="relative inline-flex items-center rounded-l-xl bg-primary_BG px-4 py-2 text-sm font-medium text-white  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              +
            </button>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center  bg-primary_BG px-4 py-2 text-sm font-medium text-white  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {currentQty}
            </button>
            <button
              onClick={() => handleDecrease()}
              type="button"
              className="relative -ml-px inline-flex items-center rounded-r-xl  bg-primary_BG px-4 py-2 text-sm font-medium text-white  focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              -
            </button>
          </span>
        </div>
        <div className={`px-4`}>
          {/*   name and desc */}
          <div className="flex flex-row w-full justify-between items-center pb-4 border-b-2 border-stone-200">
            <div className={` flex-1 space-y-3`}>
              <p>{element.name}</p>
              <p>{element.desc}</p>
            </div>
            <div className={`shrink-0`}>
              <p className={`text-primary_BG text-lg `}>
                {element.price} {t(`kd`)}
              </p>
            </div>
          </div>

          {/*     sections  */}
          {map(element.sections, (s: productSections, i) => (
            <div className="flex flex-col w-full justify-start items-start space-y-3 py-4 border-b-2 border-stone-200">
              <div>
                <p>{s.title}</p>
              </div>
              {map(s.choices, (c, i) => (
                <div key={c.id} className="flex items-center">
                  <input
                    id={c.id.toString()}
                    name={s.title}
                    type="radio"
                    // defaultChecked={c.id === 'email'}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={c.name}
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    {c.name}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
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
