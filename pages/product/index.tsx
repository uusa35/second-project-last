import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import {
  productApi,
  useGetTopSearchQuery,
  useLazyGetSearchProductsQuery,
} from '@/redux/api/productApi';
import { Product } from '@/types/index';
import { NextPage } from 'next';
import { apiSlice } from '@/redux/api';
import { debounce, isEmpty, map, isNull } from 'lodash';
import { appLinks, baseUrl, imageSizes, suppressText } from '@/constants/*';
import MainHead from '@/components/MainHead';
import Image from 'next/image';
import NotFoundImage from '@/appImages/not_found.png';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState, Suspense } from 'react';
import { setCurrentModule, setUrl } from '@/redux/slices/appSettingSlice';
import VerProductWidget from '@/widgets/product/VerProductWidget';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { XMarkIcon } from '@heroicons/react/20/solid';

type Props = {
  elements: Product[];
  url: string;
};
const ProductSearchIndex: NextPage<Props> = ({
  elements,
  url,
}): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    locale: { lang },
    branch: { id: branchId },
    area: { id: areaId },
    vendor: { logo },
  } = useAppSelector((state) => state);
  const router = useRouter();
  const { key } = router.query;
  const [searchIsEmpty, setSearchIsEmpty] = useState(true);
  const [currentProducts, setCurrentProducts] = useState<any>([]);

  const { data: topSearch, isSuccess } = useGetTopSearchQuery({
    lang,
    branchId,
    areaId,
    url,
  });
  const [triggerGetProducts] = useLazyGetSearchProductsQuery<{
    triggerGetProducts: () => void;
    isSuccess: boolean;
  }>();

  useEffect(() => {
    dispatch(setCurrentModule('product_search_index'));
  }, []);

  useEffect(() => {
    setCurrentProducts(elements);
  }, [key]);

  const handleChange = (key: string) => {
    if (key.length === 0) {
      setSearchIsEmpty(true);
    } else setSearchIsEmpty(false);

    if (key.length > 2) {
      triggerGetProducts({ key, lang, branch_id: branchId, url }).then(
        (r: any) => {
          setCurrentProducts(r.data.Data);
        }
      );
    } else {
      setCurrentProducts(elements);
    }
  };

  return (
    <Suspense>
      <MainHead
        title={`search products`}
        description={`searching products`}
        mainImage={`${baseUrl}${logo}`}
      />
      <MainContentLayout>
        <div className={`px-4`}>
          {/*   search Input */}
          <div className={`w-full capitalize`}>
            <div className="relative mt-1 rounded-md shadow-sm text-gray-400">
              <div className="absolute inset-y-0 cursor-pointer ltr:right-0 rtl:left-0 flex items-center px-6">
                {isEmpty(key) ? (
                  <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
                ) : (
                  <Link href={appLinks.productSearchIndex(branchId, areaId)}>
                    <XMarkIcon
                      className="h-8 w-8 text-stone-400"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
              <input
                type="search"
                name="search"
                id="search"
                onChange={debounce((e) => handleChange(e.target.value), 400)}
                className="block w-full focus:ring-1 focus:ring-primary_BG rounded-md  rtl:pl-20 ltr:pr-20 border-none  bg-gray-100 py-3 h-14  text-lg capitalize"
                suppressHydrationWarning={suppressText}
                placeholder={`${
                  key !== 'null' && key ? key : t(`search_products`)
                }`}
              />
            </div>
          </div>

          {isSuccess && topSearch && topSearch.Data && (
            <>
              <div className="grid grid-cols-4 capitalize gap-x-4 gap-y-2 my-3">
                {map(
                  topSearch.Data.topSearch,
                  (searchKey, i) =>
                    !isEmpty(searchKey) &&
                    !isNull(searchKey) &&
                    searchKey !== 'null' && (
                      <Link
                        className={`col-span-1 p-2 rounded-md bg-stone-100 text-center ${
                          key === searchKey && `bg-stone-200 shadow-sm`
                        }`}
                        key={i}
                        href={appLinks.productSearchIndex(
                          searchKey,
                          branchId,
                          areaId
                        )}
                      >
                        {searchKey}
                      </Link>
                    )
                )}
                {/* <Link
                  className={`p-2 rounded-md bg-red-700 text-white`}
                  href={appLinks.productSearchIndex(branchId, areaId)}
                >
                  {t(`clear`)}
                </Link> */}
              </div>
              {(key === '' || key === 'null') && searchIsEmpty && (
                <div>
                  <div className="h-2 bg-stone-100 my-5 -mx-3"></div>
                  <p className="mb-3 text-semibold">{t('trending_items')}</p>
                  {map(topSearch.Data.trendingItems, (item) => {
                    return <VerProductWidget element={item} key={item.id} />;
                  })}
                </div>
              )}
            </>
          )}

          <div className="my-4 capitalize">
            {isEmpty(elements) && !isSuccess && (
              <Image
                src={NotFoundImage.src}
                alt={`not_found`}
                width={imageSizes.sm}
                height={imageSizes.sm}
                className={`w-60 h-auto`}
              />
            )}

            {!isEmpty(currentProducts) && (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-semibold">{t('top_results')}</p>
                  <p className="text-stone-300">
                    {currentProducts.length} {t('product_found')}
                  </p>
                </div>

                <div className="h-2 bg-stone-100 my-5 -mx-3"></div>
                {map(currentProducts, (p, i) => (
                  <VerProductWidget element={p} key={i} />
                ))}
              </>
            )}
          </div>
        </div>
      </MainContentLayout>
    </Suspense>
  );
};

export default ProductSearchIndex;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ query, locale, req }) => {
      const { key, branchId, area_id }: any = query;
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      const { data: elements, isError } = await store.dispatch(
        productApi.endpoints.getSearchProducts.initiate({
          key: key ?? ``,
          ...(branchId ? { branch_id: branchId } : {}),
          ...(area_id ? { areaId: area_id } : {}),
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
