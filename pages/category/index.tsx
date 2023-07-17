import MainContentLayout from '@/layouts/MainContentLayout';
import { wrapper } from '@/redux/store';
import {
  useGetTopSearchQuery,
  useLazyGetSearchProductsQuery,
} from '@/redux/api/productApi';
import { NextPage } from 'next';
import { debounce, isEmpty, map, isNull } from 'lodash';
import {
  appLinks,
  arboriaFont,
  imageSizes,
  suppressText,
  toEn,
} from '@/constants/*';
import MainHead from '@/components/MainHead';
import NoResultFound from '@/appImages/no-result-found.gif';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/redux/hooks';
import { useEffect, useState, Suspense } from 'react';
import VerProductWidget from '@/widgets/product/VerProductWidget';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { XMarkIcon } from '@heroicons/react/20/solid';
import CustomImage from '@/components/CustomImage';
import LoadingSpinner from '@/components/LoadingSpinner';

type Props = {
  url: string;
};
const ProductSearchIndex: NextPage<Props> = ({ url }): JSX.Element => {
  const { t } = useTranslation();
  const {
    locale: { lang },
    branch: { id: branchId },
    area: { id: areaId },
    vendor: { logo },
  } = useAppSelector((state) => state);
  const router = useRouter();
  const { key, branch_id, area_id }: any = router.query;
  const [searchKey, setSearchKey] = useState<string>(key);
  const [currentProducts, setCurrentProducts] = useState<any>([]);
  const { data: topSearch, isSuccess: topSearchSuccess } = useGetTopSearchQuery(
    {
      lang,
      branchId: branch_id ?? branchId,
      areaId: area_id ?? areaId,
      url,
    }
  );
  const [triggerGetProducts, { isSuccess: getProductsSuccess }] =
    useLazyGetSearchProductsQuery<{
      triggerGetProducts: () => void;
      isSuccess: boolean;
    }>();

  useEffect(() => {
    handleSearch(searchKey);
  }, [searchKey]);

  useEffect(() => {
    setSearchKey(key);
  }, [key]);

  const handleSearch = (key: string) => {
    triggerGetProducts({
      key,
      ...(branchId && { branch_id: branch_id ?? branchId }),
      ...(areaId && { areaId: area_id ?? areaId }),
      lang: router.locale,
      url,
    }).then((r: any) => {
      if (r.data && r.data.Data && r.data.Data.length > 0) {
        setCurrentProducts(r.data.Data);
      } else {
        setCurrentProducts([]);
      }
    });
  };

  const handleChange = async (searchInput: string) => {
    if (searchInput.length >= 2) {
      setSearchKey(searchInput);
    } else {
      setSearchKey(``);
    }
  };

  if (!getProductsSuccess) {
    return <LoadingSpinner fullWidth={true} />;
  }

  return (
    <Suspense>
      <MainHead
        title={`search products`}
        description={`searching products`}
        mainImage={`${logo}`}
        url={url}
      />
      <MainContentLayout url={url} backHome={true}>
        <div className={`px-4`}>
          {/*   search Input */}
          <div className={`w-full capitalize`}>
            <div className="relative mt-1 rounded-md shadow-sm text-gray-400">
              <div className="absolute inset-y-0 cursor-pointer ltr:right-0 rtl:left-0 flex items-center px-6">
                {isEmpty(searchKey) || isEmpty(key) ? (
                  <MagnifyingGlassIcon className="h-8 w-8" aria-hidden="true" />
                ) : (
                  <Link
                    scroll={true}
                    replace={true}
                    href={appLinks.productSearchIndex(
                      ``,
                      branch_id ?? branchId,
                      area_id ?? areaId
                    )}
                    // onClick={() => setSearchKey(``)}
                  >
                    <XMarkIcon
                      className="h-8 w-8 text-stone-400"
                      aria-hidden="true"
                    />
                  </Link>
                )}
              </div>
              <input
                type="text"
                name="search"
                id="search"
                onChange={debounce((e) => {
                  handleChange(toEn(e.target.value));
                }, 600)}
                className={`block w-full focus:ring-1 focus:ring-primary_BG rounded-md  rtl:pl-20 ltr:pr-20 border-none  bg-gray-100 py-3 h-12  text-lg capitalize ${arboriaFont}`}
                suppressHydrationWarning={suppressText}
                defaultValue={searchKey}
                placeholder={`${
                  // searchKey.length !== 0 ? searchKey : t(`search_products`)
                  t(`search_products`)
                }`}
              />
            </div>
          </div>
          {topSearchSuccess && topSearch.Data && (
            <div className="grid grid-cols-4 capitalize gap-x-4 gap-y-2 my-3">
              {map(
                topSearch.Data.topSearch,
                (keyword, i) =>
                  !isEmpty(keyword) &&
                  !isNull(keyword) &&
                  keyword !== 'null' && (
                    <Link
                      scroll={true}
                      replace={true}
                      className={`col-span-1 p-2 rounded-md bg-stone-100 text-center ${
                        searchKey === keyword && `bg-stone-200 shadow-sm`
                      }`}
                      key={i}
                      onClick={() => setSearchKey(key)}
                      href={appLinks.productSearchIndex(
                        keyword,
                        branch_id ?? branchId,
                        area_id ?? areaId
                      )}
                    >
                      {keyword}
                    </Link>
                  )
              )}
            </div>
          )}
          <div className="my-4 capitalize">
            {isEmpty(currentProducts) ? (
              <div
                className={`w-full flex flex-1 flex-col justify-center items-center space-y-4 my-12`}
              >
                <CustomImage
                  src={NoResultFound.src}
                  alt={`no_result`}
                  width={imageSizes.sm}
                  height={imageSizes.sm}
                  className={`w-60 h-auto`}
                />
                <span className={`text-black text-xl text-center`}>
                  {t('no_results_found')}
                </span>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-semibold">{t('top_results')}</p>
                  <p className="text-stone-300">
                    {currentProducts.length} {t('product_found')}
                  </p>
                </div>

                <div className="h-2 bg-stone-100 my-5 -mx-3"></div>
                {map(currentProducts, (p, i) => (
                  <VerProductWidget element={p} key={i} category_id={null} />
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
    async ({ req }) => {
      if (!req.headers.host) {
        return {
          notFound: true,
        };
      }
      return {
        props: {
          url: req.headers.host,
        },
      };
    }
);
