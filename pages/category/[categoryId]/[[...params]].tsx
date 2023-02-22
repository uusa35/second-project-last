import { useEffect, useState, Suspense } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import {
  useGetProductsQuery,
  useLazyGetSearchProductsQuery,
} from '@/redux/api/productApi';
import { appSetting, Product } from '@/types/index';
import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { imageSizes, suppressText } from '@/constants/*';
import { capitalize, debounce, isEmpty, map } from 'lodash';
import NoResultFound from '@/appImages/no-result-found.gif';
import HorProductWidget from '@/widgets/product/HorProductWidget';
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
import { AppQueryResult, ProductPagination } from '@/types/queries';
type Props = {
  slug: string;
  url: string;
  branch_id: string;
  area_id: string;
  page: string;
  limit: string;
  category_id: string;
};
const ProductIndex: NextPage<Props> = ({
  slug,
  url,
  branch_id,
  area_id,
  page,
  limit,
  category_id,
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    appSetting: { productPreview },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [Icon, SetIcon] = useState(true);
  const { query, locale }: any = useRouter();
  const [currentProducts, setCurrentProducts] = useState<any>([]);
  const { data, isSuccess, isFetching } = useGetProductsQuery<{
    data: AppQueryResult<ProductPagination<Product>>;
    isSuccess: boolean;
    isFetching: boolean;
  }>({
    category_id: query.categoryId,
    page,
    limit,
    ...(branch_id && { branch_id }),
    ...(area_id && { area_id }),
    lang: locale,
    url,
  });
  const [triggerSearchProducts] = useLazyGetSearchProductsQuery<{
    triggerSearchProducts: () => void;
  }>();
  // change menue view to list view
  const changeStyle = (preview: appSetting['productPreview']) => {
    dispatch(setProductPreview(preview));
    SetIcon(!Icon);
  };

  useEffect(() => {
    if (query && query.slug) {
      dispatch(setCurrentModule(capitalize(query.slug.replaceAll('-', ' '))));
    } else {
      dispatch(setCurrentModule(`product_index`));
    }
    if (url) {
      dispatch(setUrl(url));
    }
  }, []);

  useEffect(() => {
    if (isSuccess && data && data.Data && data.Data.products) {
      setCurrentProducts(data.Data.products);
    }
  }, [isSuccess]);

  const handleChange = (key: string) => {
    if (key.length > 2) {
      triggerSearchProducts({ key, lang, branch_id, url }).then((r: any) =>
        setCurrentProducts(r.data.Data)
      );
    } else {
      setCurrentProducts(data.Data?.products);
    }
  };

  if (isFetching) {
    return <LoadingSpinner fullWidth={true} />;
  }

  return (
    <Suspense>
      <MainHead title={slug} description={slug} />
      <MainContentLayout url={url} backHome={true}>
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
                  className="block w-full focus:ring-1 focus:ring-primary_BG rounded-md  pl-20 border-none  bg-gray-100 py-3 h-12  text-lg capitalize"
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
                <List alt="menu" className={'w-8 h-8 grayscale'} />
              ) : (
                <Menu alt="menu" className={'w-8 h-8 grayscale'} />
              )}
            </button>
          </div>
          {isEmpty(currentProducts) && (
            <div
              className={`w-full flex flex-1 flex-col justify-center items-center space-y-4 my-12`}
            >
              <CustomImage
                src={NoResultFound.src}
                alt={`not_found`}
                width={imageSizes.sm}
                height={imageSizes.sm}
                className={`w-60 h-auto`}
              />
              <span className={`text-black text-xl text-center`}>
                {t('no_results_found')}
              </span>
            </div>
          )}
          <div
            className={
              productPreview === 'hor'
                ? ' grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-0 gap-x-2 py-4'
                : ''
            }
          >
            {!isEmpty(currentProducts) &&
              map(currentProducts, (p: Product, i) =>
                productPreview === 'hor' ? (
                  <HorProductWidget
                    element={p}
                    key={i}
                    category_id={category_id}
                  />
                ) : (
                  <VerProductWidget
                    element={p}
                    key={i}
                    category_id={category_id}
                  />
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
      const { categoryId, branch_id, page, limit, area_id, slug }: any = query;
      if (!categoryId) {
        return {
          notFound: true,
        };
      }
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          slug: slug ?? ``,
          url: req.headers.host,
          branch_id: branch_id ?? ``,
          area_id: area_id ?? ``,
          page: page ?? 1,
          limit: limit ?? 10,
          category_id: categoryId,
        },
      };
    }
);
