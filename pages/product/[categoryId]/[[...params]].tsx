import { useEffect, useState, Suspense } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import {
  productApi,
  useLazyGetSearchProductsQuery,
} from '@/redux/api/productApi';
import { appSetting, Product } from '@/types/index';
import { NextPage } from 'next';
import { apiSlice } from '@/redux/api';
import MainHead from '@/components/MainHead';
import { imageSizes, suppressText } from '@/constants/*';
import { debounce, isEmpty, map, replace } from 'lodash';
import NotFoundImage from '@/appImages/not_found.png';
import HorProductWidget from '@/widgets/product/HorProductWidget';
import { AppQueryResult, ProductPagination } from '@/types/queries';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setCurrentModule,
  setProductPreview,
} from '@/redux/slices/appSettingSlice';
import { useTranslation } from 'react-i18next';
import VerProductWidget from '@/components/widgets/product/VerProductWidget';
import Menu from '@/appIcons/menus.svg';
import List from '@/appIcons/list.svg';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CustomImage from '@/components/CustomImage';
type Props = {
  elements: ProductPagination<Product[]>;
};
const ProductIndex: NextPage<Props> = ({ elements }): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branch: { id: branch_id },
    appSetting: { productPreview },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [Icon, SetIcon] = useState(true);
  const [trigger] = useLazyGetSearchProductsQuery<{
    trigger: () => void;
  }>();
  // change menue view to list view
  const changeStyle = (preview: appSetting['productPreview']) => {
    dispatch(setProductPreview(preview));
    SetIcon(!Icon);
  };
  const { query }: any = useRouter();
  const [currentProducts, setCurrentProducts] = useState<any>([]);

  useEffect(() => {
    if (query && query.slug) {
      dispatch(setCurrentModule(replace(query?.slug, '-', ' ')));
    } else {
      dispatch(setCurrentModule(`product_index`));
    }
    setCurrentProducts(elements.products);
  }, []);

  const handleChange = (key: string) => {
    if (key.length > 2) {
      trigger({ key, lang, branch_id }).then((r: any) =>
        setCurrentProducts(r.data.Data)
      );
    } else {
      setCurrentProducts(elements.products);
    }
  };

  return (
    <Suspense>
      <MainHead title={`productIndex`} description={`productIndex`} />
      <MainContentLayout>
        <h1 className="capitalize" suppressHydrationWarning={suppressText}></h1>
        <div className={`px-4 capitalize`}>
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
                  onChange={debounce((e) => handleChange(e.target.value), 400)}
                  className="block w-full focus:ring-1 focus:ring-primary_BG rounded-md  pl-20 border-none  bg-gray-100 py-3 h-14  text-lg capitalize"
                  suppressHydrationWarning={suppressText}
                  placeholder={`${t(`search_products`)}`}
                />
              </div>
            </div>
            <button
              onClick={() =>
                changeStyle(productPreview === 'ver' ? 'hor' : 'ver')
              }
              className="pt-1 ps-2"
            >
              {Icon ? (
                <CustomImage src={List} alt="menu" className={'w-8 h-8'} />
              ) : (
                <CustomImage src={Menu} alt="menu" className={'w-8 h-8'} />
              )}
            </button>
          </div>
          <div
            className={
              productPreview === 'hor'
                ? ' grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-0 py-4'
                : ''
            }
          >
            {isEmpty(currentProducts) && (
              <CustomImage
                src={NotFoundImage.src}
                alt={`not_found`}
                width={imageSizes.sm}
                height={imageSizes.sm}
                className={`w-60 h-auto`}
              />
            )}
            {!isEmpty(currentProducts) &&
              map(currentProducts, (p: Product, i) =>
                productPreview === 'hor' ? (
                  <HorProductWidget element={p} key={i} />
                ) : (
                  <VerProductWidget element={p} key={i} />
                )
              )}
          </div>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default ProductIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale }) => {
      const { categoryId, branchId, page, limit, areaId }: any = query;
      if (!categoryId) {
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
          ...(branchId ? { branch_id: branchId } : {}),
          ...(areaId ? { area_id: areaId } : {}),
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
