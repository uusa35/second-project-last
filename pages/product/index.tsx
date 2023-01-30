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
import { debounce, isEmpty, map } from 'lodash';
import { appLinks, baseUrl, imageSizes, suppressText } from '@/constants/*';
import MainHead from '@/components/MainHead';
import Image from 'next/image';
import NotFoundImage from '@/appImages/not_found.png';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState, Suspense } from 'react';
import { setCurrentModule } from '@/redux/slices/appSettingSlice';
import VerProductWidget from '@/widgets/product/VerProductWidget';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';

type Props = {
  elements: Product[];
};
const ProductSearchIndex: NextPage<Props> = ({ elements }): JSX.Element => {
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

  const { data: topSearch, isSuccess } = useGetTopSearchQuery({
    lang,
    branchId,
    areaId,
  });
  const [trigger, { isSuccess: SearchSuccess }] =
    useLazyGetSearchProductsQuery<{
      trigger: () => void;
      isSuccess: boolean;
    }>();
  const [currentProducts, setCurrentProducts] = useState<any>([]);

  useEffect(() => {
    dispatch(setCurrentModule(t('product_search_index')));
  }, []);

  useEffect(() => {
    setCurrentProducts(elements);
  }, [key]);

  const handleChange = (key: string) => {
    if (key.length === 0) {
      setSearchIsEmpty(true);
    } else setSearchIsEmpty(false);

    if (key.length > 2) {
      trigger({ key, lang, branch_id: branchId }).then((r: any) => {
        setCurrentProducts(r.data.Data);
        console.log('inside hhhhhhhhhhhhhhere');
      });
    } else {
      console.log('inside set current with elements');
      setCurrentProducts(elements);
    }
  };

  console.log(
    'topSearch',
    topSearch,
    'key',
    key,
    'currentProducts',
    currentProducts,
    elements
  );

  return (
    <Suspense>
      <MainHead
        title={`productIndex`}
        description={`productIndex`}
        mainImage={`${baseUrl}${logo}`}
      />
      <MainContentLayout>
        <div className={`px-4`}>
          {/*   search Input */}
          <div className={`w-full capitalize`}>
            <div className="relative mt-1 rounded-md shadow-sm text-gray-400">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-6">
                <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
              </div>
              <input
                type="search"
                name="search"
                id="search"
                onChange={debounce((e) => handleChange(e.target.value), 400)}
                className="block w-full focus:ring-1 focus:ring-primary_BG rounded-md  pl-20 border-none  bg-gray-100 py-3 h-16  text-lg capitalize"
                suppressHydrationWarning={suppressText}
                placeholder={`${t(`search_products`)}`}
              />
            </div>
          </div>

          {isSuccess && topSearch && topSearch.Data && (
            <>
              <div className="flex flex-row justify-evenly items-center flex-wrap gap-3 my-3 capitalize">
                {map(topSearch.Data.topSearch, (searchKey, i) => (
                  <Link
                    className={`p-2 rounded-md bg-stone-100`}
                    key={i}
                    href={appLinks.productSearchIndex(
                      searchKey,
                      branchId,
                      areaId
                    )}
                  >
                    {searchKey}
                  </Link>
                ))}
                <Link
                  className={`p-2 rounded-md bg-red-700 text-white`}
                  href={appLinks.productSearchIndex(branchId, areaId)}
                >
                  {t(`clear`)}
                </Link>
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
    async ({ query, locale }) => {
      const { key, branchId, area_id }: any = query;
      const { data: elements, isError } = await store.dispatch(
        productApi.endpoints.getSearchProducts.initiate({
          key: key ?? ``,
          ...(branchId ? { branch_id: branchId } : {}),
          ...(area_id ? { areaId: area_id } : {}),
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
