import { useEffect, useState, Suspense, useRef } from 'react';
import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import {
  useLazyGetProductsQuery,
  useLazyGetSearchProductsQuery,
} from '@/redux/api/productApi';
import { appSetting, Product } from '@/types/index';
import { NextPage } from 'next';
import MainHead from '@/components/MainHead';
import { imageSizes, scrollClass, suppressText } from '@/constants/*';
import { capitalize, debounce, isEmpty, isNull, map, uniqBy } from 'lodash';
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
import CustomImage from '@/components/CustomImage';
import LoadingSpinner from '@/components/LoadingSpinner';
import SearchInput from '@/components/SearchInput';

type Props = {
  slug: string;
  url: string;
  page: string;
  categoryId: string;
  limit: string;
};
const ProductIndex: NextPage<Props> = ({
  slug,
  url,
  page,
  categoryId,
  limit,
}): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branch: { id: branch_id },
    area: { id: area_id },
    appSetting: { productPreview },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [icon, setIcon] = useState(true);
  const listRef = useRef<HTMLDivElement>();
  const [currentPage, setCurrentPage] = useState<number>(1); // storing current page number
  const [previousPage, setPreviousPage] = useState<number>(0); // storing prev page number
  const [latest, setLatest] = useState(false); // setting a flag to know the last list
  const [searchKey, setSearchKey] = useState<string | null>(``);
  const { query }: any = useRouter();
  const [currentProducts, setCurrentProducts] = useState<any>([]);
  const [triggerGetProducts, { isLoading: getProductsLoading }] =
    useLazyGetProductsQuery();
  const [triggerSearchProducts] = useLazyGetSearchProductsQuery<{
    triggerSearchProducts: () => void;
  }>();
  // change menue view to list view
  const changeStyle = (preview: appSetting['productPreview']) => {
    dispatch(setProductPreview(preview));
    setIcon(!icon);
  };

  useEffect(() => {
    dispatch(setCurrentModule('product_search_index'));
    if (url) {
      dispatch(setUrl(url));
    }
    if (query && query.slug) {
      dispatch(setCurrentModule(capitalize(query.slug.replaceAll('-', ' '))));
    } else {
      dispatch(setCurrentModule(`product_index`));
    }
  }, []);

  const handleFire = async () => {
    await triggerGetProducts({
      category_id: categoryId?.toString(),
      branch_id: branch_id,
      area_id: area_id,
      page: currentPage.toString(),
      limit,
      url,
      lang,
    }).then((r) => {
      if (r.data && r.data?.Data && r.data?.Data?.products) {
        if (r.data.Data?.products?.length === 0) {
          setLatest(true);
          return;
        }
        setPreviousPage(currentPage);
        setCurrentProducts([...currentProducts, ...r.data.Data.products]);
      } else {
        // nothing
      }
    });
  };

  useEffect(() => {
    if (!latest && previousPage !== currentPage) {
      handleFire();
    }
  }, [latest, currentProducts, previousPage, currentPage]);

  const onScroll = () => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const resetPages = async () => {
    setCurrentProducts([]);
    setCurrentPage(1);
    setPreviousPage(0);
  };

  const handleChange = async (key: string) => {
    if (key.length >= 2 && url) {
      setSearchKey(key);
      await triggerSearchProducts({
        key,
        lang,
        branch_id,
        areaId: area_id,
        url,
      }).then((r: any) => {
        if (r.data && r.data.Data && r.data.Data.length > 0) {
          setCurrentProducts(r.data.Data);
        } else {
          setCurrentProducts([]);
        }
      });
    } else {
      await resetPages().then(() => setSearchKey(null));
    }
  };

  useEffect(() => {
    isNull(searchKey) && handleFire();
  }, [searchKey]);

  if (getProductsLoading && isEmpty(currentProducts)) {
    return <LoadingSpinner fullWidth={true} />;
  }

  return (
    <Suspense>
      <MainHead title={slug} description={slug} url={url} />
      <MainContentLayout url={url} backHome={true}>
        <h1 className="capitalize" suppressHydrationWarning={suppressText}></h1>
        <div className={`px-4 capitalize h-auto`}>
          <div className="flex justify-center items-center pb-3">
            <div className={`w-full`}>
              <SearchInput
                placeholder={`${t(`search_products`)}`}
                onChange={debounce((e) => handleChange(e.target.value), 400)}
              />
            </div>
            <button
              onClick={() =>
                changeStyle(productPreview === 'ver' ? 'hor' : 'ver')
              }
              className="pt-1 ps-2"
            >
              {icon ? (
                <List alt="menu" className={'w-8 h-8 grayscale'} />
              ) : (
                <Menu alt="menu" className={'w-8 h-8 grayscale'} />
              )}
            </button>
          </div>
          {!currentProducts.length && isEmpty(currentProducts) && (
            <div
              className={`w-full flex flex-1 flex-col justify-center items-center space-y-4`}
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
            ref={listRef}
            onScroll={onScroll}
            className={` ${scrollClass} ${
              !isNull(searchKey) && currentProducts.length <= 5
                ? `h-min`
                : `h-[100vh]`
            }  overflow-y-scroll
              ${
                productPreview === 'hor'
                  ? `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-x-3 py-4`
                  : ''
              }
            `}
          >
            {currentProducts.length
              ? map(currentProducts, (p: Product, i) =>
                  productPreview === 'hor' ? (
                    <HorProductWidget
                      element={p}
                      key={i}
                      category_id={categoryId ?? null}
                    />
                  ) : (
                    <VerProductWidget
                      element={p}
                      key={i}
                      category_id={categoryId ?? null}
                    />
                  )
                )
              : null}
          </div>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default ProductIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, req }) => {
      const { categoryId, limit, page, slug }: any = query;
      if (!categoryId || !req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          categoryId,
          slug: slug ?? ``,
          page: page ?? `1`,
          limit: parseInt(limit) > 10 ? limit : '10',
          url: req.headers.host,
        },
      };
    }
);
