import { useEffect, useState, Suspense } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import {
  productApi,
  useGetProductsQuery,
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
  setUrl,
} from '@/redux/slices/appSettingSlice';
import { useTranslation } from 'react-i18next';
import VerProductWidget from '@/components/widgets/product/VerProductWidget';
import Menu from '@/appIcons/menus.svg';
import List from '@/appIcons/list.svg';
import { useRouter } from 'next/router';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import CustomImage from '@/components/CustomImage';
import LoadingSpinner from '@/components/LoadingSpinner';
type Props = {
  elements: ProductPagination<Product[]>;
  url: string;
};
const ProductIndex: NextPage<Props> = ({ elements, url }): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branch: { id: branch_id },
    appSetting: { productPreview },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [icon, setIcon] = useState(true);
  const { query }: any = useRouter();
  const [currentProducts, setCurrentProducts] = useState<any>([]);
  const { categoryId, method, elementId } = router.query;
  const { data: getSearchResults, isSuccess } = useGetProductsQuery<{
    data: AppQueryResult<ProductPagination<Product>>;
    isSuccess: boolean;
  }>({
    category_id: categoryId?.toString(),
    ...(method === `pickup` && { branch_id: elementId }),
    ...(method === `delivery` && { area_id: elementId }),
    page: '1',
    limit: '10',
    url,
    lang,
  });

  const [triggerSearchProducts] = useLazyGetSearchProductsQuery<{
    triggerSearchProducts: () => void;
  }>();
  // change menue view to list view
  const changeStyle = (preview: appSetting['productPreview']) => {
    dispatch(setProductPreview(preview));
    setIcon(!icon);
  };

  useEffect(() => {
    if (query && query.slug) {
      dispatch(setCurrentModule(replace(query?.slug, '-', ' ')));
    } else {
      dispatch(setCurrentModule(`product_index`));
    }
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  useEffect(() => {
    if (isSuccess && getSearchResults.Data && getSearchResults.Data.products) {
      setCurrentProducts(getSearchResults.Data.products);
    }
  }, [isSuccess]);

  const handleChange = (key: string) => {
    if (isSuccess) {
      if (key.length > 2) {
        triggerSearchProducts({ key, lang, branch_id, url }).then((r: any) => {
          console.log('the r from serarch', r);
          setCurrentProducts(r.data.Data);
        });
      } else {
        setCurrentProducts(getSearchResults?.Data?.products);
      }
    }
  };

  if (!isSuccess) {
    return <LoadingSpinner fullWidth={true} />;
  }

  return (
    <Suspense>
      <MainHead title={`productIndex`} description={`productIndex`} />
      <MainContentLayout url={url}>
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
              {icon ? (
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
            {!isSuccess && isEmpty(currentProducts) ? (
              <div
                className={`w-full flex flex-1 flex-col justify-center items-center space-y-4 my-12`}
              >
                <CustomImage
                  src={NotFoundImage.src}
                  alt={`not_found`}
                  width={imageSizes.sm}
                  height={imageSizes.sm}
                  className={`w-60 h-auto`}
                />
                <span className={`text-black text-xl text-center`}>
                  {t('no_results_found')}
                </span>
              </div>
            ) : (
              map(currentProducts, (p: Product, i) =>
                productPreview === 'hor' ? (
                  <HorProductWidget element={p} key={i} />
                ) : (
                  <VerProductWidget element={p} key={i} />
                )
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
    async ({ query, locale, req }) => {
      const { categoryId, method, elementId, limit, page }: any = query;
      if (!categoryId || !method || !elementId || !req.headers.host) {
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
          category_id: categoryId.toString(),
          ...(method === `pickup` && { branch_id: elementId }),
          ...(method === `delivery` && { area_id: elementId }),
          page: page ?? `1`,
          limit: limit ?? `10`,
          lang: locale,
          url: req.headers.host,
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
          url: req.headers.host,
        },
      };
    }
);
