import { useEffect, useState } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import { productApi } from '@/redux/api/productApi';
import { Product } from '@/types/index';
import { NextPage } from 'next';
import { apiSlice } from '@/redux/api';
import MainHead from '@/components/MainHead';
import { imageSizes, suppressText } from '@/constants/*';
import { isEmpty, map, replace } from 'lodash';
import Image from 'next/image';
import NotFoundImage from '@/appImages/not_found.png';
import HorProductWidget from '@/widgets/product/HorProductWidget';
import { AppQueryResult, ProductPagination } from '@/types/queries';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import { useTranslation } from 'react-i18next';
import VerProductWidget from '@/components/widgets/product/VerProductWidget';
import { inputFieldClass } from '@/constants/*';
import SearchIcon from '@/appIcons/search.svg';
import Menu from '@/appIcons/menu.svg';
import List from '@/appIcons/list.svg';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
type Props = {
  elements: ProductPagination<Product[]>;
};
const ProductIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [IsMenue, setIsMenue] = useState(true);
  const [Icon, SetIcon] = useState(true);
  // change menue view to list view
  const changeStyle = () => {
    setIsMenue(!IsMenue);
    SetIcon(!Icon);
  };
  const { query } = useRouter();

  useEffect(() => {
    if (query.slug) {
      dispatch(setCurrentModule(replace(query.slug, '-', ' ')));
    } else {
      dispatch(setCurrentModule(`product_index`));
    }
  }, []);
  return (
    <>
      <MainHead title={`productIndex`} description={`productIndex`} />
      <MainContentLayout>
        <h1 suppressHydrationWarning={suppressText}></h1>
        <div className={`px-4`}>
          <div className="flex justify-center items-center">
            <div className={`w-full`}>
              <div className="relative mt-1 rounded-md shadow-sm text-gray-400">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-6">
                  <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  name="search"
                  id="search"
                  className="block w-full focus:ring-1 focus:ring-primary_BG rounded-md  pl-20 border-none  bg-gray-100 py-3 h-16  text-lg capitalize"
                  suppressHydrationWarning={suppressText}
                  placeholder={`${t(`search_products`)}`}
                />
              </div>
            </div>
            <button onClick={changeStyle} className="pt-1 ps-2">
              {Icon ? (
                <Image src={Menu} alt="menu" className={'w-8 h-8'} />
              ) : (
                <Image src={List} alt="menu" className={'w-8 h-8'} />
              )}
            </button>
          </div>
          <div
            className={
              IsMenue
                ? 'mt-4 p-4 grid sm:grid-cols-3 lg:grid-cols-2 gap-6'
                : 'my-4 p-4'
            }
          >
            {isEmpty(elements.products) && (
              <Image
                src={NotFoundImage.src}
                alt={`not_found`}
                width={imageSizes.sm}
                height={imageSizes.sm}
                className={`w-60 h-auto`}
              />
            )}

            {map(elements.products, (p: Product, i) =>
              IsMenue ? (
                <HorProductWidget element={p} key={i} />
              ) : (
                <VerProductWidget element={p} key={i} />
              )
            )}
          </div>
        </div>
      </MainContentLayout>
    </>
  );
};

export default ProductIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale }) => {
      const { categoryId, branchId, page, limit, areaId }: any = query;
      if (!categoryId || !branchId) {
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
          branch_id: branchId,
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